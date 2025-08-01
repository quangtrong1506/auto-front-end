'use client';

import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { STEP, WorksInterface } from './step';

interface OpenWebProps {
	data?: WorksInterface;
	onLogin?: ({ email, password }: { email: string; password: string }) => void;
	onCancel?: () => void;
}
export const LoginPinterest = ({ data, onLogin, onCancel }: OpenWebProps) => {
	const [form, setForm] = useState({
		email: '',
		password: '',
		autoLogin: false
	});

	useEffect(() => {
		const localData = localStorage.getItem('user');
		if (localData) {
			setForm(JSON.parse(localData));
		}
	}, []);

	const onSubmit = () => {
		if (!form.email || !form.password) {
			Swal.fire('Error', 'Vui lòng nhập đầy đủ thông tin', 'warning');
		}
		onLogin?.({
			email: form.email,
			password: form.password
		});
		localStorage.setItem('user', JSON.stringify(form));
	};

	if (!data || data.id !== STEP.login.id) return;
	return (
		<div className="h-full flex justify-center items-center flex-col gap-2">
			<div className="text-2xl">{data.status === 'not-started' && 'Đăng nhập Pinterest'}</div>
			<input
				className="border px-2 py-1 w-full rounded-lg focus-within:outline-none"
				type="text"
				name="username"
				id="username"
				placeholder="Email"
				value={form.email}
				onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))}
			/>
			<input
				className="border px-2 py-1 w-full rounded-lg focus-within:outline-none"
				type="password"
				name="password"
				id="password"
				placeholder="Password"
				value={form.password}
				onChange={e => setForm(prev => ({ ...prev, password: e.target.value }))}
			/>
			<div className="w-full flex gap-2 items-center">
				<input
					type="checkbox"
					id="auto-login"
					checked={form.autoLogin}
					onChange={e => setForm(prev => ({ ...prev, autoLogin: e.target.checked }))}
				/>
				<label htmlFor="auto-login">Tự động đăng nhập</label>
			</div>
			<div className="flex gap-2">
				<button className="px-3 py-1 rounded-lg border border-cyan-600 text-cyan-500" onClick={onSubmit}>
					{data.status === 'not-started' && 'Đăng nhập'}
					{data.status === 'on-progress' && 'Đang đăng nhập'}
					{data.status === 'error' && 'Đăng nhập lại'}
				</button>
				<button className="px-3 py-1 rounded-lg border text-gray-500" onClick={onCancel}>
					Bỏ qua
				</button>
			</div>
		</div>
	);
};
