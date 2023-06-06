/* to be able to display user generated HTML content,
	 we polifyll globaly the sanitizer  */
import DOMPurify from "dompurify";
window.Sanitizer = DOMPurify;

/* the main app is not define yet */
import Network4000 from "./components/network-4000.js";

/* the rest of the components are defined in the declaration file */
import NetworkProfile from "./components/network-profile.js";
import NetworkProfileEdit from "./components/network-profile-edit.js";
import NetworkSearch from "./components/network-search.js";

/* only export the network app, so we can declare it as a web component later */
export default Network4000;
