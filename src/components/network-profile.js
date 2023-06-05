import { AUTHORIZED_WIDGETS } from "../libs/sdk.js";

export default class NetworkProfile extends HTMLElement {
	static get observedAttributes() {
		return [
			/* props */
			"config",
		];
	}

	/* get the config for a subdomain profile */
	get config() {
		let data;
		try {
			data = JSON.parse(this.getAttribute("config"));
		} catch (e) {}
		return data;
	}

	get name() {
		if (this.config && this.config.name) {
			return this.config.name;
		} else {
			return "";
		}
	}

	get widgets() {
		if (this.config && this.config.widgets) {
			return this.config.widgets.filter(({ type }) =>
				AUTHORIZED_WIDGETS.includes(type)
			);
		} else {
			return [];
		}
	}

	attributeChangedCallback(attrName, oldVal, newVal) {
		console.log("attr changed", attrName, oldVal, newVal);
		if (["config"].includes(attrName)) {
			this.render();
		}
	}
	render() {
		this.innerHTML = "";
		this.name && this.renderHead();
		this.name && this.renderName();
		this.widgets && this.widgets.length && this.renderWidgets();
	}
	renderHead() {
		if (this.name) {
			document.title = this.name;
		}
	}
	renderName() {
		const $name = document.createElement("h1");
		$name.innerHTML = this.name;
		this.append($name);
	}
	renderWidgets() {
		console.log(this);
		const $widgets = this.widgets.map(this.buildWidget.bind(this));
		$widgets
			.filter((widget) => !!widget)
			.forEach(($widget) => this.append($widget));
	}

	/* build one widget from its data */
	buildWidget(widget) {
		const { type: widgetElement, attributes } = widget;
		const innerText = widget["inner-text"];

		const $widget = document.createElement(widgetElement);
		if (attributes) {
			attributes.forEach(([key, value]) => {
				if (typeof value === "object") {
					$widget.setAttribute(key, JSON.stringify(value));
				} else {
					$widget.setAttribute(key, value);
				}
			});
		}
		if (innerText) {
			$widget.innerText = innerText;
		}
		return $widget;
	}
}

customElements.define("network-profile", NetworkProfile);
