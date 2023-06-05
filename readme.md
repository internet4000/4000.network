# 4000.network

## Create a 4000 network subdomain page

1. With a `github` accout, create a repository named `.4000.network`
2. inside this repository create a `.profile.json` file
3. visit `username.4000.network` to see the profile

> comming soon: interface for managing a profile and its widgets

## Dev

Run locally with:

- clone repository
- npm run dev

Deploy a build with

- npm run build

### Subdomains

- managed (authorized) by vercel DNS on `*.4000.network`
- handled by the javascript router
- query to github.com/:subdomain/.4000.network/.env.json
