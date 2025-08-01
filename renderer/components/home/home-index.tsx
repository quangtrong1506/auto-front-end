import { useState } from 'react';
import Swal from 'sweetalert2';
import { sendIpcInvike } from '../../hooks';
import { FindImage } from './find-image';
import { LoginPinterest } from './login';
import { OpenWeb } from './open-web';
import { STEP, WorksInterface } from './step';

export const HomeIndex = () => {
	const [step, setStep] = useState<WorksInterface>(STEP.openWeb);

	/** Khởi tạo trình duyệt */
	const onStart = () => {
		if (step.status === 'not-started' && step.id === STEP.openWeb.id) {
			sendIpcInvike('open', null)
				.then(res => {
					if (res.status === 'success') {
						if (localStorage.getItem('user')) {
							const data = JSON.parse(localStorage.getItem('user') || '{}') as {
								email: string;
								password: string;
								autoLogin: boolean;
							};
							if (data.autoLogin) {
								setStep({ id: STEP.autoLogin.id, name: STEP.autoLogin.name, status: 'on-progress' });
								setTimeout(() => {
									onLogin({ email: data.email, password: data.password }, true);
								}, 2000);
							}
							return;
						}
						setStep({ ...STEP.login, status: 'not-started' });
					} else setStep(prev => ({ ...prev, status: 'error' }));
				})
				.catch(e => {
					console.log(e);
					setStep(prev => ({ ...prev, status: 'error' }));
				});
			setStep(prev => ({ ...prev, status: 'on-progress' }));
		}
	};

	const onLogin = ({ email, password }: { email: string; password: string }, autoLogin?: boolean) => {
		if (((step.status === 'not-started' || step.status === 'error') && step.id === STEP.login.id) || autoLogin) {
			setStep(prev => ({ ...prev, status: 'on-progress' }));
			sendIpcInvike('login', { email, password })
				.then(res => {
					if (res.status === 'success') {
						setStep(STEP.end);
					} else {
						setStep(prev => ({ ...prev, status: 'error' }));
						Swal.fire({
							title: 'Error',
							html: res.message,
							icon: 'warning',
							confirmButtonText: 'Kiểm tra lại',
							showConfirmButton: true
						}).then(res => {
							if (res.isConfirmed) {
								setStep({ id: STEP.login.id, name: STEP.login.name, status: 'error' });
							}
						});
					}
				})
				.catch(e => {
					console.log(e);
					setStep(prev => ({ ...prev, status: 'error' }));
				});
		}
	};

	const onSkipLogin = () => {
		setStep(STEP.end);
	};

	return (
		<div className="w-full min-h-dvh flex justify-center">
			<div className="flex flex-col items-center gap-4">
				<OpenWeb data={step} onStart={onStart} />
				<LoginPinterest data={step} onLogin={onLogin} onCancel={onSkipLogin} />
				{step.id === STEP.autoLogin.id && (
					<div className="h-full flex justify-center items-center text-2xl">Đang tự động đăng nhập...</div>
				)}
				{step.id === STEP.end.id && <FindImage />}
			</div>
		</div>
	);
};
