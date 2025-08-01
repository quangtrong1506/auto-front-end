export interface WorksInterface {
	name: string;
	id: string;
	status: 'success' | 'error' | 'on-progress' | 'not-started';
}

export const STEP = {
	openWeb: {
		name: 'Mở trang web',
		id: 'open-web',
		status: 'not-started'
	},
	login: {
		name: 'Đăng nhập',
		id: 'login',
		status: 'not-started'
	},
	autoLogin: {
		name: 'Tự động đăng nhập',
		id: 'auto-login',
		status: 'not-started'
	},
	end: {
		name: 'Kết thúc',
		id: 'end',
		status: 'success'
	}
} as {
	openWeb: WorksInterface;
	login: WorksInterface;
	autoLogin: WorksInterface;
	end: WorksInterface;
};
