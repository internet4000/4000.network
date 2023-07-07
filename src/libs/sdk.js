import DIDGithub from "./did-github.js";

/* DID methods (github is a DID method;
	 to get a profile/document as DID ID/subdomain) */
const DIDS = {
	github: new DIDGithub(),
};

const AUTHORIZED_WIDGETS_MAP = {
	"matrix-room-element": [],
	p: [],
};
const AUTHORIZED_WIDGETS = Object.keys(AUTHORIZED_WIDGETS_MAP);

const readDocument = (subdomain, didMethod) => {
	const did = DIDS[didMethod];
	if (!did) {
		return;
	}
	return did.readDocument(subdomain);
};
const searchNetwork = (query, didMethod) => {
	const did = DIDS[didMethod];
	if (!did) {
		return;
	}
	return did.search(query);
};

const getDocumentUrl = (subdomain, didMethod) => {
	const did = DIDS[didMethod];
	if (!did) {
		return;
	}
	return did.getDocumentUrl(subdomain);
};

const getDocumentEditUrl = (subdomain, didMethod) => {
	const did = DIDS[didMethod];
	if (!did) {
		return;
	}
	return did.getDocumentEditUrl(subdomain);
};

const getDocumentRawUrl = (subdomain, didMethod) => {
	const did = DIDS[didMethod];
	if (!did) {
		return;
	}
	return did.getDocumentRawUrl(subdomain);
};

export {
	AUTHORIZED_WIDGETS,
	AUTHORIZED_WIDGETS_MAP,
	readDocument,
	searchNetwork,
	getDocumentEditUrl,
	getDocumentUrl,
	getDocumentRawUrl,
};
