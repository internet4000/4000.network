const DEFAULT_SUBDOMAIN = "internet4000";

const AUTHORIZED_WIDGETS = ["matrix-room-element", "p"];

class GithubFileFetcher {
	constructor() {}

	async get4000NetworkGithub(githubUsername) {
		let url = `https://raw.githubusercontent.com/${githubUsername}/.4000.network/main/.profile.json`;
		try {
			let response = await fetch(url);
			if (response.ok) {
				let json = await response.json();
				return json;
			} else {
				console.error("HTTP-Error: " + response.status);
			}
		} catch (error) {
			console.error(error);
		}
	}

	async search4000NetworkGithub(query) {
		const url = `https://api.github.com/search/repositories?q=topic:4000-network+topic:profile-json+${query}`;

		let data, error;
		try {
			const response = await fetch(url);
			const json = await response.json();
			data = json.items.map((item) => {
				return {
					subdomain: item.owner.login,
					stargazers_count: item.stargazers_count,
					topics: item.topics,
				};
			});
		} catch (e) {
			console.error("Error fetching search data", error);
			error = e;
		}
		return { data, error };
	}
}

const readSubdomain = async (subdomain) => {
	const fetcher = new GithubFileFetcher();
	let data, error;

	try {
		data = await fetcher.get4000NetworkGithub(subdomain);
	} catch (e) {
		error = e;
	}

	return {
		data,
		error,
	};
};

const searchGithub = async (query) => {
	const fetcher = new GithubFileFetcher();
	let data, error;
	try {
		data = await fetcher.search4000NetworkGithub(query);
	} catch (e) {
		error = e;
	}

	return {
		data,
		error,
	};
};

export { AUTHORIZED_WIDGETS, readSubdomain, searchGithub };
