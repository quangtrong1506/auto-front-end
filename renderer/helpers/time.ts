/**
 * @description Chuyển đổi thời gian mặt trời mọc/lặn sang dạng đọc được
 */
export function formatSunTime(time: number = 0): string {
	const formatter = new Intl.DateTimeFormat('vi-VN', {
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
		timeZone: 'Asia/Ho_Chi_Minh',
		hour12: false
	});

	return formatter.format(new Date(time * 1000));
}

export const formatIOSTimeToString = (time: string): string => {
	const date = new Date(time);

	return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} ${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
};
