import { IpcBodyInterface, IpcKey, IPCResponseInterface } from 'shared';
import { createDriver } from '../driver/webdriver';
import { sendWebContents } from '../helpers';
import { log } from '../helpers/dev-log';
import { openWeb } from '../selenium';
import { delay, handleClick, handleInsertText, handleKeyboard, handleWindow } from './run-file-selenium-handle';

export function RunFile(_mainWindow: Electron.BrowserWindow) {
	return async (
		_event: Electron.IpcMainInvokeEvent,
		data: IpcBodyInterface['Run_File']
	): Promise<IPCResponseInterface['Run_File'] | void> => {
		try {
			const initData = {
				job_id: data.job_id,
				status: 'running',
				data: {
					command: 'Starting',
					line: 0,
					time: new Date().toISOString(),
					desscription: 'Đang khởi tạo driver'
				},
				fileName: data.file.name,
				url: data.file.commands[0].type === 'open-web' ? data.file.commands[0].data.url : '/404/'
			} as IPCResponseInterface['Run_File'];
			sendWebContents(_mainWindow, IpcKey.RunFile, {
				...initData,
				data: {
					command: 'Starting',
					line: 0,
					time: new Date().toISOString(),
					desscription: 'Đang khởi tạo driver'
				}
			});
			const { file, browser } = data;

			// khởi tạo driver
			const driver = await createDriver(browser || 'chrome', p => {
				sendWebContents(_mainWindow, IpcKey.Download_Driver, {
					status: p.transferred === p.total ? 'success' : 'downloading',
					data: {
						downloaded_size: p.transferred,
						total_size: p.total,
						process: p.percent,
						driver: {
							browser: p.browser,
							version: p.version
						}
					}
				});
			});
			if (!driver) {
				sendWebContents(_mainWindow, IpcKey.RunFile, {
					...initData,
					data: {
						command: 'Starting',
						line: 0,
						time: new Date().toISOString(),
						desscription: 'Đang khởi tạo driver'
					}
				});
				return;
			}

			let index = 0;
			const commands = file.commands;
			for (const command of commands) {
				switch (command.type) {
					// Mở trình duyệt
					case 'open-web': {
						const checkOpenWeb = await openWeb(driver, command.data.url);
						if (checkOpenWeb) {
							sendWebContents(_mainWindow, IpcKey.RunFile, {
								...initData,
								data: {
									command: 'Open web',
									line: 0,
									time: new Date().toISOString(),
									desscription: command.description || `Đã mở ${command.data.url}`
								}
							});
						} else {
							sendWebContents(_mainWindow, IpcKey.RunFile, {
								...initData,
								status: 'error',
								data: {
									command: 'Open web',
									line: 0,
									time: new Date().toISOString(),
									desscription: `Lỗi mở ${command.data.url}`
								},
								message: `Lỗi mở ${command.data.url}`
							});
							return;
						}
						delay(command.data.delay || 0);
						break;
					}
					case 'click': {
						const checkClick = await handleClick(driver, command);
						if (checkClick) {
							sendWebContents(_mainWindow, IpcKey.RunFile, {
								...initData,
								data: {
									command: 'Click',
									line: index,
									time: new Date().toISOString(),
									desscription: command.description || `Đã click ${command.selector}`
								}
							});
						} else {
							sendWebContents(_mainWindow, IpcKey.RunFile, {
								...initData,
								status: 'error',
								data: {
									command: 'Click',
									line: index,
									time: new Date().toISOString(),
									desscription: `Lỗi click ${command.selector}`
								},
								message: `${command.description || ''} - Error: Không tìm thấy DOM Element \`${command.selector || 'null'}\``
							});
							return;
						}
						break;
					}
					case 'insert-text': {
						const checkClick = await handleInsertText(driver, command);
						if (checkClick) {
							sendWebContents(_mainWindow, IpcKey.RunFile, {
								...initData,
								data: {
									command: 'insert-text',
									line: index,
									time: new Date().toISOString(),
									desscription: command.description || `Đã nhập text vào ${command.selector}`
								}
							});
						} else {
							sendWebContents(_mainWindow, IpcKey.RunFile, {
								...initData,
								status: 'error',
								data: {
									command: 'insert-text',
									line: index,
									time: new Date().toISOString()
								},
								message: `${command.description || ''} - Error: Không tìm thấy DOM Element \`${command.selector || 'null'}\``
							});
							return;
						}
						break;
					}
					case 'window': {
						const checkClick = await handleWindow(driver, command);
						if (checkClick) {
							sendWebContents(_mainWindow, IpcKey.RunFile, {
								...initData,
								data: {
									command: 'resize',
									line: index,
									time: new Date().toISOString(),
									desscription: `Đã resize`
								}
							});
						} else {
							sendWebContents(_mainWindow, IpcKey.RunFile, {
								...initData,
								status: 'error',
								data: {
									command: 'resize',
									line: index,
									time: new Date().toISOString(),
									desscription: `Lỗi resize`
								},
								message: `${command.description || ''} - Error: Không tìm thấy DOM Element \`${command.selector || 'null'}\``
							});
							return;
						}
						break;
					}
					case 'keyboard': {
						const checkKey = await handleKeyboard(driver, command);
						if (checkKey) {
							sendWebContents(_mainWindow, IpcKey.RunFile, {
								...initData,
								data: {
									command: 'keyboard',
									line: index,
									time: new Date().toISOString(),
									desscription: `Đã thực hành keyboard`
								}
							});
						} else {
							sendWebContents(_mainWindow, IpcKey.RunFile, {
								...initData,
								status: 'error',
								data: {
									command: 'keyboard',
									line: index,
									time: new Date().toISOString(),
									desscription: `Lỗi thực hành keyboard`
								},
								message: `${command.description || ''} - Error: Không tìm thấy DOM Element \`${command.selector || 'null'}\``
							});
							return;
						}
						break;
					}
					default:
						break;
				}
				await delay(command.delay || 0);

				index += 1;
			}
			sendWebContents(_mainWindow, IpcKey.RunFile, {
				...initData,
				status: 'success',
				data: {
					command: 'Done',
					line: index,
					time: new Date().toISOString(),
					desscription: 'Đã hoàn tất'
				}
			});
			return;
		} catch (error: unknown) {
			log.info('Error [run-file]', error);
			return;
		}
	};
}
