export function removeFromArray(array, object) {
	let index;
	array.forEach((obj, i) => {
		if ((typeof object === 'function' && object(obj)) || object === obj) {
			index = i;
		}
	});
	if (typeof index === 'number') {
		array.splice(index, 1);
		return true;
	}
	return false;
}
