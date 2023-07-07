import { readDocument } from "../libs/sdk.js";

export default class Network4000 extends HTMLElement {
	static get observedAttributes() {
		return [
			/* props */
			"hostname",
			"subdomain",
			"did-method",
			"flag-development",
			/* state */
			"pathname",

			/* url search params state */
			"is-editing",
		];
	}

	get flagDev() {
		return this.getAttribute("flag-development") === "true";
	}

	get searchParams() {
		const searchParams = new URLSearchParams(window.location.search);
		return {
			edit: searchParams.has("edit"),
			query: searchParams.get("query"),
		};
	}

	get isEditing() {
		return this.searchParams.edit;
	}
	set isEditing(bool) {
		this.setAttribute("is-editing", bool);
	}

	/* the hostname is the root domain,
		 on which the r4 radio profile app is running */
	get hostname() {
		return this.getAttribute("hostname") || window.location.hostname;
	}
	get origin() {
		return new URL(`https://${this.hostname || window.location.origin}`);
	}
	get didMethod() {
		return this.getAttribute("did-method") || "github";
	}
	get allowedOrigins() {
		return [this.origin];
	}
	/* the slug comes from the wildcard subdomain */
	get subdomain() {
		if (!window.location.host.endsWith("." + this.hostname)) {
			return this.getAttribute("subdomain");
		}
		const subdomains = window.location.host
			.replace("." + this.hostname, "")
			.split(".");
		const wildcard = subdomains[subdomains.length - 1];
		return wildcard;
	}
	get pathname() {
		return window.location.pathname;
	}

	onSearchMatch({ detail }) {
		let url = `${window.location.protocol}//${detail.subdomain}.${this.hostname}`;
		if (this.flagDev) {
			const url = `http://${detail.subdomain}.${this.hostname}`;
		}
		window.location = url;
	}

	onContentInput(event) {
		console.log("on content input", event);
		// parse document (y3js?)
	}

	async connectedCallback() {
		if (this.isEditing) {
			this.setAttribute("is-editing", this.isEditing);
		}
		/* if we're on a subdomain page, try loading it's config */
		if (this.subdomain) {
			const { data, error } = await readDocument(
				this.subdomain,
				this.didMethod
			);
			/* if there are no config for a subdomain, load 404 */
			if (data) {
				/* otherwise, let's load the config and render it */
				this.subdomainConfig = data;
				this.setAttribute("subdomain", this.subdomain);
			}
			if (error) {
				this.subdomainError = error;
			}
		}
		this.render();
	}

	async render() {
		if (!this.subdomain) {
			this.renderHead({
				title: this.hostname,
			});
			return this.renderHome();
		}
		if (!this.subdomainConfig) {
			this.renderHead({
				title: `404 - ${this.hostname}`,
			});
			return this.renderNoSubdomain();
		}

		/* html's head is managed in the component, above we clean it */
		this.renderSubdomain();
	}

	renderHead({ title }) {
		if (title) {
			document.title = title;
		}
	}

	renderNoSubdomain() {
		this.innerHTML = "";
		const $docsTitle = document.createElement("h1");
		$docsTitle.innerText = "404 - page not found";

		const $docsText = document.createElement("p");
		$docsText.innerText = `The subdomain ${this.subdomain} does not exist on ${this.hostname}.`;

		this.append($docsTitle);
		this.append($docsText);

		if (this.subdomainError) {
			const $info = document.createElement("p");
			$info.innerText =
				"The subdomain config seems to be a malformed JSON; check the javascript console";
			this.append($info);
		}
	}

	renderSubdomain() {
		this.innerHTML = "";
		const $profile = document.createElement("network-profile");
		$profile.setAttribute("did-method", this.didMethod);
		if (this.subdomainConfig) {
			$profile.setAttribute("config", JSON.stringify(this.subdomainConfig));
		}
		if (this.searchParams.edit) {
			$profile.setAttribute("contenteditable", true);
			$profile.addEventListener("input", this.onContentInput.bind(this));
		}
		this.append($profile);

		/* render edit, if query param request */
		if (this.searchParams.edit) {
			const $profileEdit = document.createElement("network-profile-edit");
			$profileEdit.setAttribute("config", JSON.stringify(this.subdomainConfig));
			$profileEdit.setAttribute("subdomain", this.subdomain);
			this.append($profileEdit);
		}
	}
	renderHome() {
		const $search = document.createElement("network-search");
		$search.setAttribute("did-method", this.didMethod);
		$search.addEventListener("search", () => {});
		$search.addEventListener("match", this.onSearchMatch.bind(this));
		this.append($search);
	}
}
