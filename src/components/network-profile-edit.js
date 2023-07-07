import {
	AUTHORIZED_WIDGETS,
	getDocumentEditUrl,
	getDocumentUrl,
} from "../libs/sdk.js";

const buildTemplate = ({ jsonValidatorUrl, editUrl, fileUrl }) => {
	return `
		<details open=true>
			<summary>?</summary>
			<p>Edit config</p>
			<ul>
				<li>
					<a href="${editUrl}">edit</a>
				</li>
				<li>
					<a href="${fileUrl}">view</a>
				</li>
				<li>
					<a href="${jsonValidatorUrl}">JSON validator</a>
				</li>
			</ul>
			<section></section>
		</details>
	`;
};

export default class NetworkProfileEdit extends HTMLElement {
	static get observedAttributes() {
		return [
			/* props */
			"config",
			"subdomain",
			"did-method",
		];
	}

	/* the subdomain we are editing the config of */
	get subdomain() {
		return this.getAttribute("subdomain");
	}
	get didMethod() {
		return this.getAttribute("did-method") || "github";
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
			return this.config.widgets.filter(({ element }) =>
				AUTHORIZED_WIDGETS.includes(element)
			);
		} else {
			return [];
		}
	}

	attributeChangedCallback(attrName, oldVal, newVal) {
		if (["config", "subdomain"].includes(attrName)) {
			this.render();
		}
	}

	connectedCallback() {
		this.innerHTML = buildTemplate({
			jsonValidatorUrl: `https://duckduckgo.com/?q=json+validator`,
			editUrl: getDocumentEditUrl(this.subdomain, this.didMethod),
			fileUrl: getDocumentUrl(this.subdomain, this.didMethod),
		});
		this.$widgets = this.querySelector("ol");
	}

	render() {
		if (this.widgets) {
			this.renderWidgetsManager();
		}
	}
	renderWidgetsManager() {
		const $widgetManager = document.createElement("widget-manager");
		this.append($widgetManager);
	}
}

customElements.define("network-profile-edit", NetworkProfileEdit);
