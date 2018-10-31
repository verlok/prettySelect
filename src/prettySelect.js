import defaults from "./prettySelect.defaults";
import { createElement, getDropHtml, getLabelHtml } from "./prettySelect.dom";

class PrettySelect {
	// TODO: Organize into intention-declaring named methods
	constructor(selectElement, options) {
		this.settings = Object.assign({}, defaults, options);
		this.selectElement = selectElement;

		this.settings.optionsSelector = this.settings.onlyValuedOptions
			? "option[value][value!='']:not([data-placeholder])"
			: "option:not([data-placeholder])";

		this.wrapperElement = createElement("div", this.settings.wrapClass);

		this._initialDisplay = this.selectElement.style.display;
		this.selectElement.style.display = "none";
		this.selectElement.parentNode.append(this.wrapperElement);

		this.wrapperElement.append(this.selectElement);

		this.labelElement = createElement("div", this.settings.labelClass);
		this._setLabelHtml();

		let optionElements = this.selectElement.querySelectorAll(
			this.settings.optionsSelector
		);

		this.dropDownElement = createElement("ul", this.settings.dropClass);
		this._setDropHtml();

		this.wrapperElement.setAttribute(
			"data-prettyselect-elements",
			optionElements.length
		);
		this.wrapperElement.append(this.labelElement);
		this.wrapperElement.append(this.dropDownElement);
		this.wrapperElement.addEventListener("click", event => {
			if (event.target.tagName !== "LI" || this.isDisabled()) {
				return;
			}
			event.stopPropagation();
			let liElement = event.target;
			let newVal = liElement.getAttribute("data-value");
			let oldVal = this.selectElement.value;
			this.closeDrop();
			if (newVal === oldVal) {
				return;
			}
			this.selectElement.value = newVal;
			this._changeHandler();
		});

		this.closeDrop();

		this.selectElement.addEventListener("change", this._changeHandler);

		this.labelElement.addEventListener("click", event => {
			if (this.isDisabled()) {
				return;
			}
			event.stopPropagation();
			if (this.isDropOpen()) {
				this.closeDrop();
				return;
			}
			this.showDrop();
		});

		let htmlElement = document.querySelector("html");
		htmlElement.addEventListener("click", () => {
			this.closeDrop();
		});

		this.observer = new MutationObserver((mutations, observer) => {
			let optionElements = this.selectElement.querySelectorAll(
				this.settings.optionsSelector
			);

			this.wrapperElement.setAttribute(
				"data-prettyselect-elements",
				optionElements.length
			);

			this._setDropHtml();
			this._setLabelHtml();
		});

		this.observer.observe(this.selectElement, {
			subtree: true,
			attributes: true,
			attributeOldValue: false,
			attributeFilter: ["class", "selected", "value"],
			childList: true
		});
	}

	// PRIVATE

	_setLabelHtml() {
		this.labelElement.innerHTML = getLabelHtml(this.selectElement);
	}

	_setDropHtml() {
		let optionElements = this.selectElement.querySelectorAll(
			this.settings.optionsSelector
		);
		this.dropDownElement.innerHTML = getDropHtml(optionElements);
	}

	_changeHandler() {
		let newValue = this.selectElement.value.replace("'", "\\'");
		this.labelElement.innerHTML = this.selectElement.querySelector(
			`option[value="${newValue}"]`
		).innerHTML;
	}

	// PUBLIC

	destroy() {
		this.observer.disconnect();
		this.wrapperElement.removeChild(this.labelElement);
		this.wrapperElement.removeChild(this.dropDownElement);
		this.wrapperElement.parentNode.append(this.selectElement);
		this.wrapperElement.parentNode.removeChild(this.wrapperElement);
		this.selectElement.style.display = this._initialDisplay;
	}

	isDisabled() {
		return this.selectElement.getAttribute("disabled") !== null;
	}

	disable() {
		this.selectElement.setAttribute("disabled", "disabled");
		this.wrapperElement.classList.add(this.settings.disabledClass);
	}

	enable() {
		this.selectElement.removeAttribute("disabled");
		this.wrapperElement.classList.remove(this.settings.disabledClass);
	}

	closeDrop() {
		this.wrapperElement.classList.remove(this.settings.wrapOpenClass);
		this.dropDownElement.style.display = "none";
	}

	showDrop() {
		this.wrapperElement.classList.add(this.settings.wrapOpenClass);
		this.dropDownElement.style.display = "block";
	}

	isDropOpen() {
		return this.dropDownElement.style.display === "block";
	}
}

export default PrettySelect;
