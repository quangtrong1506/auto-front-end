/**
 * Quản lý tải driver theo nhu cầu (lazy), có báo % tiến độ qua callback (hoặc IPC).
 * - Hỗ trợ: chrome, firefox, edge, ie, opera, safari
 * - Lần đầu gọi mới tải; lần sau dùng cache.
 * - Giải nén tự động.
 */

import AdmZip from 'adm-zip';
import { execSync } from 'child_process';
import { app } from 'electron';
import fs from 'fs';
import https from 'https';
import fetch from 'node-fetch';
import path from 'path';
import { log } from '../helpers';

/** Kiểu browser */
export type BrowserKind = 'chrome' | 'firefox' | 'edge' | 'ie' | 'opera' | 'safari';

/** Interface tiến độ tải */
export interface DownloadProgressInterface {
	browser: BrowserKind;
	percent: number; // 0..100 (nếu không biết total thì gửi -1)
	transferred: number; // bytes đã tải
	total: number; // tổng bytes (0 nếu server không trả Content-Length)
	version: string;
	error?: string;
}

/** Thư mục chứa driver cache */
const DRIVER_ROOT = path.join(app.getPath('userData'), 'drivers');

/** Tạo thư mục cache */
function ensureDir(dir: string): void {
	if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

/** Tải file có báo tiến độ */
export function downloadFile(
	url: string,
	dest: string,
	browser: BrowserKind,
	version: string,
	onProgress?: (p: DownloadProgressInterface) => void
): Promise<void> {
	return new Promise((resolve, reject) => {
		ensureDir(path.dirname(dest));
		const file = fs.createWriteStream(dest);
		https
			.get(url, res => {
				if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
					// follow redirect
					res.destroy();
					return downloadFile(res.headers.location, dest, browser, version, onProgress)
						.then(resolve)
						.catch(reject);
				}
				if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode} khi tải ${url}`));

				const total = parseInt(res.headers['content-length'] || '0', 10) || 0;
				let transferred = 0;

				res.on('data', chunk => {
					transferred += chunk.length;
					if (onProgress) {
						const percent = total ? Math.round((transferred / total) * 100) : -1;
						onProgress({ browser, percent, transferred, total, version });
					}
				});

				res.pipe(file);
				file.on('finish', () => file.close(() => resolve()));
				res.on('error', reject);
				file.on('error', reject);
			})
			.on('error', reject);
	});
}

/** Giải nén .zip vào thư mục đích, ghi đè nếu có */
function unzip(zipPath: string, outDir: string): void {
	const zip = new AdmZip(zipPath);
	ensureDir(outDir);
	zip.extractAllTo(outDir, true);
}

/** Chạy lệnh an toàn, trả string (trim) */
function sh(cmd: string): string {
	return execSync(cmd, { stdio: ['ignore', 'pipe', 'ignore'] })
		.toString()
		.trim();
}

/** Lấy version Chrome đang cài trong máy */
function detectChromeVersion(): string {
	if (process.platform === 'win32') {
		try {
			// BLBeacon key cho Chrome Stable
			const out = sh('reg query "HKCU\\Software\\Google\\Chrome\\BLBeacon" /v version');
			const m = out.match(/version\s+REG_SZ\s+([^\s]+)/i);
			if (m) return m[1];
		} catch (e) {
			log.error(e);
		}
	}
	if (process.platform === 'darwin') {
		try {
			const out = sh('/Applications/Google\\ Chrome.app/Contents/MacOS/Google\\ Chrome --version');
			const m = out.match(/(\d+\.\d+\.\d+\.\d+)/);
			if (m) return m[1];
		} catch (e) {
			log.error(e);
		}
	}
	try {
		const out = sh('google-chrome --version || chromium --version || chrome --version');
		const m = out.match(/(\d+\.\d+\.\d+\.\d+)/);
		if (m) return m[1];
	} catch (e) {
		log.error(e);
	}
	throw new Error('Không tìm thấy Chrome trên máy');
}

/** Lấy version Edge đang cài */
async function detectEdgeVersion(): Promise<string | null> {
	try {
		const res = await fetch('https://edgeupdates.microsoft.com/api/products');
		const json = await res.json();
		const releases = json[0]?.Releases;
		return releases[0]?.ProductVersion;
	} catch (e) {
		log.error(e);
		return null;
	}
}

/** Map platform → tag của Chrome for Testing / Edge / Gecko */
function platformTagChromeLike(): 'win64' | 'mac-x64' | 'mac-arm64' | 'linux64' {
	if (process.platform === 'win32') return 'win64';
	if (process.platform === 'darwin') return process.arch === 'arm64' ? 'mac-arm64' : 'mac-x64';
	return 'linux64';
}

/** Tải + trả path driver cho từng browser (nếu chưa có) */
async function ensureChrome(onProgress?: (p: DownloadProgressInterface) => void): Promise<string> {
	const folder = path.join(DRIVER_ROOT, 'chrome');
	ensureDir(folder);

	// Nếu đã có bản chromedriver trong thư mục con → dùng luôn
	const plat = platformTagChromeLike();
	const exe = process.platform === 'win32' ? 'chromedriver.exe' : 'chromedriver';
	const candidate = path.join(folder, `chromedriver-${plat}`, exe);
	if (fs.existsSync(candidate)) return candidate;

	// Lấy version Chrome → match major trong known-good-versions
	const chromeVersion = detectChromeVersion();
	const major = chromeVersion.split('.')[0];

	const api = 'https://googlechromelabs.github.io/chrome-for-testing/known-good-versions-with-downloads.json';
	const json: {
		versions: {
			version: string;
			downloads: {
				chromedriver: {
					platform: string;
					url: string;
				}[];
			};
		}[];
	} = await (await fetch(api)).json();
	const verInfo = json.versions.find(v => v.version.startsWith(major));
	if (!verInfo) throw new Error(`Không tìm thấy ChromeDriver phù hợp major ${major}`);

	const item = verInfo.downloads.chromedriver.find(x => x.platform === plat);
	if (!item) throw new Error(`Không có chromedriver cho platform ${plat}`);

	const zipPath = path.join(folder, 'chromedriver.zip');
	await downloadFile(item.url, zipPath, 'chrome', json.versions[0].version, onProgress);
	unzip(zipPath, folder);
	fs.unlinkSync(zipPath);

	return candidate;
}

async function ensureGecko(onProgress?: (p: DownloadProgressInterface) => void): Promise<string> {
	const folder = path.join(DRIVER_ROOT, 'firefox');
	ensureDir(folder);
	const exe = process.platform === 'win32' ? 'geckodriver.exe' : 'geckodriver';
	const candidate = path.join(folder, exe);
	if (fs.existsSync(candidate)) return candidate;

	// Lấy bản latest từ Github
	const api = 'https://api.github.com/repos/mozilla/geckodriver/releases/latest';
	const json: {
		assets: {
			name: string;
			browser_download_url: string;
		}[];
	} = await (await fetch(api, { headers: { 'User-Agent': 'auto-frontend' } })).json();
	const asset = json.assets.find(a => {
		if (process.platform === 'win32') return a.name.includes('win64.zip');
		if (process.platform === 'darwin') return a.name.includes('macos.tar.gz');
		return a.name.includes('linux64.tar.gz');
	});
	if (!asset) throw new Error('Không tìm thấy asset geckodriver phù hợp');

	const archivePath = path.join(folder, asset.name);
	await downloadFile(asset.browser_download_url, archivePath, 'firefox', asset.name, onProgress);

	if (asset.name.endsWith('.zip')) unzip(archivePath, folder);
	else execSyncSafe(`tar -xzf "${archivePath}" -C "${folder}"`);

	fs.unlinkSync(archivePath);

	// Sau khi giải nén, file nằm ngay tại folder
	return candidate;
}

async function ensureEdge(onProgress?: (p: DownloadProgressInterface) => void): Promise<string> {
	const folder = path.join(DRIVER_ROOT, 'edge');
	ensureDir(folder);
	const exe = process.platform === 'win32' ? 'msedgedriver.exe' : 'msedgedriver';
	const candidate = path.join(folder, exe);
	if (fs.existsSync(candidate)) return candidate;

	const ver = await detectEdgeVersion();
	const plat = platformTagChromeLike();
	const url = `https://msedgedriver.microsoft.com/${ver}/edgedriver_${plat}.zip`;
	console.log(url);

	const zipPath = path.join(folder, 'edgedriver.zip');
	await downloadFile(url, zipPath, 'edge', ver || 'Latest', onProgress);
	unzip(zipPath, folder);
	fs.unlinkSync(zipPath);

	// Trên Windows file nằm ngay trong folder sau extract
	// Trên mac/linux cũng tương tự do gói edge chuẩn
	return candidate;
}

async function ensureIE(onProgress?: (p: DownloadProgressInterface) => void): Promise<string> {
	if (process.platform !== 'win32') throw new Error('IE chỉ hỗ trợ trên Windows');
	const folder = path.join(DRIVER_ROOT, 'ie');
	ensureDir(folder);
	const exe = 'IEDriverServer.exe';
	const candidate = path.join(folder, exe);
	if (fs.existsSync(candidate)) return candidate;

	// Lưu ý: IEDriver dừng update, bản ổn định phổ biến 3.150.2
	const url = 'https://github.com/SeleniumHQ/selenium/releases/download/selenium-4.14.0/IEDriverServer_x64_4.14.0.zip';
	const zipPath = path.join(folder, 'iedriver.zip');
	await downloadFile(url, zipPath, 'ie', '4.14.0', onProgress);
	unzip(zipPath, folder);
	fs.unlinkSync(zipPath);

	// File sau giải nén thường nằm trong folder con — di chuyển lên nếu cần
	const extracted = path.join(folder, 'IEDriverServer.exe');
	if (fs.existsSync(extracted) && extracted !== candidate) fs.renameSync(extracted, candidate);

	return candidate;
}

async function ensureOpera(onProgress?: (p: DownloadProgressInterface) => void): Promise<string> {
	const folder = path.join(DRIVER_ROOT, 'opera');
	ensureDir(folder);
	const exe = process.platform === 'win32' ? 'operadriver.exe' : 'operadriver';
	const candidate = path.join(folder, exe);
	if (fs.existsSync(candidate)) return candidate;

	const api = 'https://api.github.com/repos/operasoftware/operachromiumdriver/releases/latest';
	const json: {
		assets: {
			name: string;
			zipball_url: string;
		}[];
	} = await (await fetch(api, { headers: { 'User-Agent': 'auto-frontend' } })).json();
	const asset = json.assets.find(a => {
		if (process.platform === 'win32') return a.name.includes('win64.zip');
		if (process.platform === 'darwin') return a.name.includes('mac64.zip');
		return a.name.includes('linux64.zip');
	});
	if (!asset) throw new Error('Không tìm thấy asset operadriver phù hợp');

	const zipPath = path.join(folder, asset.name);
	await downloadFile(asset.zipball_url, zipPath, 'opera', asset.name, onProgress);
	unzip(zipPath, folder);
	fs.unlinkSync(zipPath);

	// Tên file sau unzip có thể nằm trong thư mục con, copy ra gốc
	const found = findFileRecursive(folder, exe);
	if (!found) throw new Error('Không tìm thấy operadriver sau khi giải nén');
	if (found !== candidate) fs.copyFileSync(found, candidate);

	return candidate;
}

/** Safari: có sẵn safaridriver trên macOS (xcode-select) */
async function ensureSafari(): Promise<string> {
	if (process.platform !== 'darwin') throw new Error('Safari chỉ hỗ trợ trên macOS');
	return '/usr/bin/safaridriver';
}

/** Tìm file đệ quy trong thư mục */
function findFileRecursive(root: string, filename: string): string | null {
	const stack: string[] = [root];
	while (stack.length) {
		const dir = stack.pop()!;
		const entries = fs.readdirSync(dir, { withFileTypes: true });
		for (const e of entries) {
			const full = path.join(dir, e.name);
			if (e.isDirectory()) stack.push(full);
			else if (e.isFile() && e.name === filename) return full;
		}
	}
	return null;
}

/** exec tar an toàn (không throw làm vỡ tiến trình nếu thiếu tar) */
function execSyncSafe(cmd: string): void {
	try {
		execSync(cmd, { stdio: 'ignore' });
	} catch (e) {
		log.error(e);
		throw new Error('Giải nén .tar.gz thất bại: cần tar trong PATH');
	}
}

/**
 * Hàm public: bảo đảm có driver cho browser, trả về absolute path
 * @param browser - tên trình duyệt
 * @param onProgress - callback tiến độ (có thể gửi IPC từ đây)
 */
export async function ensureDriver(
	browser: BrowserKind,
	onProgress?: (p: DownloadProgressInterface) => void
): Promise<string> {
	ensureDir(DRIVER_ROOT);

	if (browser === 'chrome') return ensureChrome(onProgress);
	if (browser === 'firefox') return ensureGecko(onProgress);
	if (browser === 'edge') return ensureEdge(onProgress);
	if (browser === 'ie') return ensureIE(onProgress);
	if (browser === 'opera') return ensureOpera(onProgress);
	if (browser === 'safari') return ensureSafari();

	throw new Error(`Browser không hỗ trợ: ${browser}`);
}
