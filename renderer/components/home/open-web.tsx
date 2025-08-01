import { STEP, WorksInterface } from './step';

interface OpenWebProps {
	data?: WorksInterface;
	onStart?: () => void;
}
export const OpenWeb = ({ data, onStart }: OpenWebProps) => {
	if (!data || data.id !== STEP.openWeb.id) return;
	return (
		<div className="h-full flex justify-center items-center">
			<div
				className="cursor-pointer px-4 py-2 rounded-full bg-slate-600 text-white hover:bg-slate-500"
				onClick={onStart}
			>
				{data.status === 'not-started' && 'Mở trang web'}
				{data.status === 'on-progress' && 'Đang khởi tạo'}
				{data.status === 'error' && 'Lỗi'}
			</div>
		</div>
	);
};
