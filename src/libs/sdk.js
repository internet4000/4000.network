const DEFAULT_SUBDOMAIN = "internet4000";

const AUTHORIZED_WIDGETS = ["matrix-room-element", "p"];

class GithubFileFetcher {
	constructor() {}

	async get4000NetworkGithub(githubUsername) {
		let url = `https://raw.githubusercontent.com/${githubUsername}/.4000.network/main/.profile.json`;
		try {
			let response = await fetch(url);
			if (response.ok) {
				// if HTTP-status is 200-299
				// get the response body (the method explained below)
				let json = await response.json();
				return json;
			} else {
				console.error("HTTP-Error: " + response.status);
			}
		} catch (error) {
			console.error(error);
		}
	}
}

const readSubdomain = async (subdomain) => {
	const fetcher = new GithubFileFetcher();
	let data, error;

	try {
		data = await fetcher.get4000NetworkGithub("internet4000");
	} catch (e) {
		error = e;
	}

	return {
		data,
		error,
	};
};

export { DEFAULT_SUBDOMAIN, AUTHORIZED_WIDGETS, readSubdomain };
