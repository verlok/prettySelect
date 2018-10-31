var defaults = {
	wrapClass: "prettyselect-wrap",
	labelClass: "prettyselect-label",
	dropClass: "prettyselect-drop",
	disabledClass: "prettyselect-disabled",
	wrapOpenClass: "prettyselect-open",
	onlyValuedOptions: false
};

const createElement = (tagName, className) => {
	const newElement = document.createElement(tagName);
	newElement.className = className;
	return newElement;
};

class PrettySelect {
	constructor(selectElement, options) {
		this.settings = Object.assign({}, defaults, options);
		this.selectElement = selectElement;

		//TODO: Move out
		let optionsSelector = {
			onlyWithValue: "option[value][value!='']:not([data-placeholder])",
			withoutValue: "option:not([data-placeholder])"
		};

		this.settings.optionsSelector = this.settings.onlyValuedOptions
			? optionsSelector.onlyWithValue
			: optionsSelector.withoutValue;

		this.wrapperElement = createElement("div", this.settings.wrapClass);

		this.selectElement.style.display = "none";
		this.selectElement.parentNode.append(this.wrapperElement);

		this.wrapperElement.append(this.selectElement);

		this.labelElement = createElement("div", this.settings.labelClass);
		this.labelElement.append(this._getLabel(this.selectElement));

		let optionElements = this.selectElement.querySelectorAll(
			this.settings.optionsSelector
		);
		let elementsHtml = this._populate(optionElements); //TODO: `_populate` returns a string, what if it appended to the dropdown instead?

		this.dropDownElement = createElement("ul", this.settings.dropClass);
		this.dropDownElement.innerHTML = elementsHtml;

		this.wrapperElement.setAttribute(
			"data-prettyselect-elements",
			optionElements.length
		);
		this.wrapperElement.append(this.labelElement);
		this.wrapperElement.append(this.dropDownElement);
		this.wrapperElement.addEventListener("click", event => {
			if (event.target.tagName !== "LI") {
				return;
			}
			let liElement = event.target;
			if (this.isDisabled()) {
				return;
			}
			event.stopPropagation();
			let newVal = liElement.getAttribute("data-value");
			let oldVal = this.selectElement.value;
			if (newVal === oldVal) {
				return;
			}
			this.selectElement.value = newVal;
			this._changeHandler();
			this.closeDrop();
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
			let htmlElement = document.querySelector("html"); // TODO: Bring out and reuse
			htmlElement.addEventListener(
				"click",
				() => {
					console.log("Clicked on HTML element");
					this.closeDrop();
				},
				{ once: true }
			); //TODO: Fix IE11 without "once"
		});

		this.observer = new MutationObserver((mutations, observer) => {
			let optionElements = this.selectElement.querySelectorAll(
				this.settings.optionsSelector
			);

			this.wrapperElement.setAttribute(
				"data-prettyselect-elements",
				optionElements.length
			);

			this.dropDownElement.innerHTML = this._populate(optionElements);

			if (thiss.selectElement.querySelector("[selected]").length === 0) {
				this.labelElement.innerHTML(this._getLabel(this.selectElement));
			} else {
				this.labelElement.innerHTML = this.selectElement.querySelector(
					"option[selected]"
				).innerHTML;
			}
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

	_changeHandler() {
		let newValue = this.selectElement.value.replace("'", "\\'"); //string
		this.labelElement.innerHTML = this.selectElement.querySelector(
			`option[value="${newValue}"]`
		).innerHTML;
	}

	// ALL THESE CAN ALL BE CONVERTED TO STATIC FUNCTIONS

	_populate(optionElements) {
		return Array.from(optionElements).
			map(optionElement => {
				let rawValue = optionElement.getAttribute("value");
				let rawClass = optionElement.getAttribute("class");
				let classString =
					typeof rawClass !== "undefined"
						? `class="${rawClass}"`
						: "";
				return `<li data-value="${rawValue}" ${classString}>${
					optionElement.innerHTML
				}</li>`;
			}).
			join("");
	}

	_getLabel(selectElement) {
		let placeholder = selectElement.querySelector(
			"option[data-placeholder]"
		);
		if (placeholder) {
			return placeholder.innerHTML;
		}
		let selectedOption = selectElement.querySelector("option[selected]");
		return selectedOption ? selectedOption.innerHTML : "";
	}

	// PUBLIC

	destroy() {
		this.observer.disconnect();
		this.wrapperElement.removeChild(this.labelElement);
		this.wrapperElement.removeChild(this.dropDownElement);
		this.wrapperElement.parentNode.append(this.selectElement);
		this.wrapperElement.parentNode.removeChild(this.wrapperElement);
		this.selectElement.style.display = "inline-block"; // TODO: Save initial display value in constructor, to replace the original one
		//TODO: this.selectElement .removeData 'PrettySelect'
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
