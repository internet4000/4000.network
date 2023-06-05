import { readSubdomain } from "../libs/sdk.js";

export default class Network4000 extends HTMLElement {
	static get observedAttributes() {
		return [
			/* props */
			"hostname",
			"subdomain",
			"flag-development",
			/* state */
			"pathname",
		];
	}

	get flagDev() {
		return this.getAttribute("flag-development") === "true";
	}

	/* the hostname is the root domain,
		 on which the r4 radio profile app is running */
	get hostname() {
		return this.getAttribute("hostname") || window.location.hostname;
	}
	get origin() {
		return new URL(`https://${this.hostname || window.location.origin}`);
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

	async connectedCallback() {
		/* load a default profile for the homepage */
		if (!this.subdomain) {
			return this.renderHome();
		}

		/* if we're on a subdomain page, try loading it's config */
		if (this.subdomain && !this.subdomainConfig) {
			const { data: subdomainConfig, error } = await readSubdomain(
				this.subdomain
			);

			/* if there are no config for a subdomain, load 404 */
			if (!subdomainConfig) {
				console.info("no subdomain config found for", this.subdomain, error);
				return this.renderNoSubdomain(this.subdomain);
			} else {
				/* otherwise, let's load the config and render it */
				this.subdomainConfig = subdomainConfig;
				this.setAttribute("subdomain", this.subdomain);
				console.info(
					"found subdomain config for",
					this.subdomain,
					this.subdomainConfig
				);
			}
		}
		return this.renderSubdomain();
	}

	renderNoSubdomain() {
		this.innerHTML = "";
		const $info = document.createElement("network-page");
		$info.setAttribute("pathname", this.pathname);
		$info.setAttribute("name", "home");

		const $docsTitle = document.createElement("h1");
		$docsTitle.innerText = "404 - page not found";

		const $docsText = document.createElement("p");
		$docsText.innerText = `The subdomain ${this.subdomain} does not exist on ${this.hostname}.`;

		this.append($pdocsTitle);
		this.append($docsText);
	}

	renderSubdomain() {
		this.innerHTML = "";
		const $profile = document.createElement("network-profile");
		if (this.subdomainConfig) {
			$profile.setAttribute("config", JSON.stringify(this.subdomainConfig));
		}
		this.append($profile);
	}
	renderHome() {
		const $search = document.createElement("network-search");
		$search.addEventListener("search", console.log);
		$search.addEventListener("match", this.onSearchMatch.bind(this));
		this.append($search);
	}
}
