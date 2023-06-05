rm -rf public
mkdir public
cp index.html public/
cp -r src/ public/
cp .env.production.json public/.env.json
