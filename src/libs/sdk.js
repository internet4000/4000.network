const AUTHORIZED_WIDGETS_MAP = {
	"matrix-room-element": [],
	p: [],
};
const AUTHORIZED_WIDGETS = Object.keys(AUTHORIZED_WIDGETS_MAP);

class GithubFileFetcher {
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

	async get4000NetworkGithub(githubUsername) {
		const url = this.get4000NetworkGithubFileRawUrl(githubUsername);
		return this.fetchData(url);
	}

	async search4000NetworkGithub(query) {
		const url = this.get4000NetworkGithubSearchUrl(query);
		let { data, error } = await this.fetchData(url);

		if (!error) {
			data = data.items.map((item) => ({
				subdomain: item.owner.login,
				stargazers_count: item.stargazers_count,
				topics: item.topics,
			}));
		}
		return { data, error };
	}

	/* docs: https://docs.github.com/en/search-github/searching-on-github/searching-in-forks */
	get4000NetworkGithubSearchUrl(query) {
		return `https://api.github.com/search/repositories?q=fork:true+topic:4000-network+topic:profile-json+${query}`;
	}

	get4000NetworkGithubFileRawUrl(actor) {
		return `https://raw.githubusercontent.com/${actor}/.4000.network/main/.profile.json`;
	}

	get4000NetworkGithubFileUrl(actor) {
		return `https://github.com/${actor}/.4000.network/blob/main/.profile.json`;
	}

	get4000NetworkGithubFileEditUrl(actor) {
		return `https://github.com/${actor}/.4000.network/edit/main/.profile.json`;
	}
}

const fetcher = new GithubFileFetcher();

const readSubdomain = (subdomain) => fetcher.get4000NetworkGithub(subdomain);

const searchGithub = (query) => fetcher.search4000NetworkGithub(query);

const getProfileFileUrl = (subdomain) =>
	fetcher.get4000NetworkGithubFileUrl(subdomain);

const getProfileFileEditUrl = (subdomain) =>
	fetcher.get4000NetworkGithubFileEditUrl(subdomain);

const getProfileFileRawUrl = (subdomain) =>
	fetcher.get4000NetworkGithubFileRawUrl(subdomain);

export {
	AUTHORIZED_WIDGETS,
	readSubdomain,
	searchGithub,
	getProfileFileEditUrl,
	getProfileFileUrl,
	getProfileFileRawUrl,
};
