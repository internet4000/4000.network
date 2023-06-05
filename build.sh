npm install
vite build
rm dist/.env.json
mv dist/.env.production.json dist/.env.json
