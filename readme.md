# 4000.network

This project is a prototype attempt at creating a user managed network of
profiles, with a diversity of content. 4000.network should provide a straight
forward way to publish and customize a public web page composed of HTML widgets,
and web-components.

> It currently relies on `github`, which provides the mechanism to reserve a
> subdomain on githubUsername.4000.network. Note that this will eventually be moved to githubUsername.github.4000.network.

## Create a 4000 network subdomain page

1. With a `github` account, create a repository named [`.4000.network`](https://github.com/internet4000/.4000.network)
2. inside this repository create an empty `.profile.json` file (with either no content, or an empty object `{}` or such as this [example](https://github.com/internet4000/.4000.network "a .4000.network github repository for the .profile.json example file used as 4000.network subdomains configuration"))
3. on github, tag the repository with the two topics `4000-network` and `topic:profile-json`
4. visit `githubUsername.4000.network` to see the profile

> comming soon: interface for managing a profile and its widgets (try adding `?edit` to a profile URL)

> coming next: remove github dependency (todo: auth? + .profile.json hosting? + sync to github repo? supabase? DID?)

> then? theming? explore what can be done with "just a list of widgets" (aka registered custom-elements and default html elements — sanitized & 'white'listed -)? Responsive CSS themes? default CSS vars?

## Development

4000.network is mainly a vanilla javascript web-component, `network-4000`.

To run the projec locally (it uses `vite` as build tool):

- clone repository
- `npm i`
- `npm run dev`

To Deploy a build:

- `npm run build`
- publish the `./dist` folder
- customize the `./public/.env.production.json` file

### `.env.{production}.json`

In this file are all the "public environment"

### How to test the url and subdomains

When running a local server (here with vite), we can use subdomains in the URL just as with "normal live URLs"; so if our app runs on port `4001`:

- it is possible to access [internet4000.localhost:4001](http://internet4000.localhost:4001)
- as well as
  [4000.network.internet4000.localhost:4001/](http://4000.network.internet4000.localhost:4001/),
  which in our case in not used (only the first subdomain)

### Subdomains

How subdomain handling used to works
- cloudflare `A` record on `@` (root) to `vercel` DNS ip
- managed (authorized) by vercel DNS on `*.4000.network` and `vercel.json`
- handled by the javascript web component `network-4000.subdomain` getter
- currently make a query to github.com/:subdomain/.4000.network/.env.json

Notes:
- whatever was tried, could not make it work with github pages and
cloudflare DNS
- maybe if not `vercel` and subdomain hosting, make it work with
  `/:gh_username`, as path of the app?

### Dependencies

#### HTML & user content Sanitizer

Using [DOMPurify](https://github.com/cure53/DOMPurify) for cleaning un-wanted
user content.

#### external web-components

Currently evaluating how to best import user defined npm modules, web components
that are made available in the list of widgets you can add to your page.

There widgets could be:

- defined by this application
- defined by the user who makes a page (a list of npm cdn imports)?

> These present a lot a security issues, and has to be investigated in depth.

The file `src/lib/sdk.js` currently has a list, `AUTHORIZED_WIDGETS_MAP`.

- the approach, is to make white list of elements, and their attributes.
- but this goes into conflict with DOMPUrify, which does the same job.

> Also note [`rehype-sanitize`](https://www.npmjs.com/package/rehype-sanitize), used in [goog-space](https://gitlab.com/sctlib/goog-space/-/blob/main/src/space.js#L1-6)

It is also a tedious work to authorize and list all possible widgets/web-components that should be allowed to be used by users.
