export const createElement = (tagName, className) => {
	const newElement = document.createElement(tagName);
	newElement.className = className;
	return newElement;
};
