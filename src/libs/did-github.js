export default class DIDGithub {
	async fetchData(url) {
		let data, error;
		try {
			const response = await fetch(url);
			if (response.ok) {
				try {
					data = await response.json();
				} catch (e) {
					error = e;
				}
			} else {
				error = response;
			}
		} catch (e) {
			error = e;
		}
		return { data, error };
	}

	async readDocument(githubUsername) {
		console.log("read gh");
		const url = this.getDocumentRawUrl(githubUsername);
		return this.fetchData(url);
	}

	async search(query) {
		const url = this.getSearchUrl(query);
		let { data, error } = await this.fetchData(url);

		if (!error) {
			data.items = data.items.map((item) => ({
				subdomain: item.owner.login,
				stargazers_count: item.stargazers_count,
				topics: item.topics,
			}));
		}
		return { data, error };
	}

	/* docs: https://docs.github.com/en/search-github/searching-on-github/searching-in-forks */
	getSearchUrl(query) {
		return `https://api.github.com/search/repositories?q=fork:true+topic:4000-network+topic:profile-json+${query}`;
	}
	getDocumentRawUrl(actor) {
		return `https://raw.githubusercontent.com/${actor}/.4000.network/main/.profile.json`;
	}
	getDocumentUrl(actor) {
		return `https://github.com/${actor}/.4000.network/blob/main/.profile.json`;
	}
	getDocumentEditUrl(actor) {
		return `https://github.com/${actor}/.4000.network/edit/main/.profile.json`;
	}
}
