import { searchGithub } from "../libs/sdk.js";

const template = `
<form>
	<fieldset>
		<label>
			Find 4000 profile
			<input type="text" list="search-results"/>
		</label>
		<datalist id="search-results"></datalist>
		<button type="submit">Search</button>
	</fieldset>
</form>
`;

export default class NetworkSearch extends HTMLElement {
	constructor() {
		super();
	}

	async connectedCallback() {
		this.innerHTML = template;
		this.$form = this.querySelector("form");
		this.$input = this.querySelector("input");
		this.$datatalist = this.querySelector("datalist");
		this.$button = this.querySelector("button");

		this.$input.addEventListener("input", ({ target }) => {
			this.input = target.value;
			if (this.searchResults) {
				const matchingSubdomain = this.searchResults.find(
					(result) => result.subdomain === target.value
				);

				if (matchingSubdomain) {
					this.dispatchEvent(
						new CustomEvent("match", {
							detail: matchingSubdomain,
						})
					);
				}
			}
		});

		this.$form.addEventListener("submit", () => {
			event.preventDefault();
			const { data, error } = this.search(this.input);
			if (data) {
				this.searchResults = data;
			}
		});

		const { data: searchData, error } = await this.search();
		if (searchData) {
			this.searchResults = searchData;
			this.renderDatalist(this.searchResults);
		}
	}

	async search(value = "") {
		const { data, error } = await searchGithub(value);
		this.dispatchEvent(
			new CustomEvent("search", {
				detail: { data, error },
			})
		);
		return data;
	}

	renderDatalist(data) {
		this.$datatalist.innerHTML = "";
		data.forEach((item) => {
			const $option = document.createElement("option");
			$option.value = item.subdomain;
			this.$datatalist.append($option);
		});
	}
}

customElements.define("network-search", NetworkSearch);
