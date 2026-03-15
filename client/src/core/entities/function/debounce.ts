
const debounce = <T extends (...args: any[]) => void>(fn: T, delay: number) => {
	let timeoutId: ReturnType<typeof setTimeout> | undefined;
	return (...args: Parameters<T>) => {
		if (timeoutId) clearTimeout(timeoutId);
		timeoutId = setTimeout(() => fn(...args), delay);
	};
};

export default debounce;
