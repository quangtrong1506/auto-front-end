function randomIdByLength(length: 8 | 16 | 32) {
	return Array.from({ length: length / 8 }, () => Math.random().toString(36).slice(2, 10)).join('');
}

export const randomID = () => randomIdByLength(16);
