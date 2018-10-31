export const createElement = (tagName, className) => {
	const newElement = document.createElement(tagName);
	newElement.className = className;
	return newElement;
};

export const getDropHtml = optionElements =>
	Array.from(optionElements).
		map(optionElement => {
			let rawValue = optionElement.getAttribute("value");
			let rawClass = optionElement.getAttribute("class");
			let classString =
				typeof rawClass !== "undefined" ? `class="${rawClass}"` : "";
			return `<li data-value="${rawValue}" ${classString}>${
				optionElement.innerHTML
			}</li>`;
		}).
		join("");

export const getLabelHtml = selectElement => {
	let placeholder = selectElement.querySelector("[data-placeholder]");
	if (placeholder) {
		return placeholder.innerHTML;
	}
	let selectedOption = selectElement.querySelector("[selected]");
	return selectedOption ? selectedOption.innerHTML : "";
};
