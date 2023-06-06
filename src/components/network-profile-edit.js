import {
	AUTHORIZED_WIDGETS,
	getProfileFileEditUrl,
	getProfileFileUrl,
} from "../libs/sdk.js";

export default class NetworkProfileEdit extends HTMLElement {
	static get observedAttributes() {
		return [
			/* props */
			"config",
			"subdomain",
		];
	}

	/* the subdomain we are editing the config of */
	get subdomain() {
		return this.getAttribute("subdomain");
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

	render() {
		const jsonValidatorUrl = `https://duckduckgo.com/?q=json+validator`;
		const editUrl = getProfileFileEditUrl(this.subdomain);
		const fileUrl = getProfileFileUrl(this.subdomain);
		this.innerHTML = `
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
		`;
	}
}

customElements.define("network-profile-edit", NetworkProfileEdit);
