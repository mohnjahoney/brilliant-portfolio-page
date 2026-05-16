# How to Make a Page with GitHub Pages

## Make a Local Repo using git

Create a project folder and initialize Git.

```bash
mkdir my-page
cd my-page
git init
git branch -M main
```

Add a first file and commit it.

```bash
echo "# My Page" > README.md
git add README.md
git commit -m "Initial commit"
```

## Create a Remote Repo on GitHub

Create an empty repo on GitHub.

- Do not initialize it with a README.
- Do not add a `.gitignore` or license yet.
- Copy the SSH repo URL.

The URL should look like this:

```text
git@github.com:YOUR_USERNAME/YOUR_REPO.git
```

## Connect a Local Repo to GitHub

```bash
# inside your repo
git remote add origin git@github.com:YOUR_USERNAME/YOUR_REPO.git

# verify
git remote -v

# push local main branch and establish tracking
git push -u origin main
```

## Simple Static Page

Create an `index.html` file at the root of the repo.

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>My Page</title>
  </head>
  <body>
    <h1>Hello GitHub Pages</h1>
  </body>
</html>
```

Commit and push:

```bash
git add index.html
git commit -m "Add static page"
git push
```

In GitHub:

1. Go to repo settings.
2. Open **Pages**.
3. Set the source to deploy from the `main` branch.
4. Choose the root folder.

## With a Build Step

For a project that builds into a `dist` folder, add scripts in `package.json`.

```json
{
  "scripts": {
    "build": "vite build",
    "deploy": "npm run build && gh-pages -d dist"
  },
  "devDependencies": {
    "gh-pages": "^6.1.1",
    "vite": "^5.0.0"
  }
}
```

Install dependencies:

```bash
npm install
```

Deploy:

```bash
npm run deploy
```

For this setup, GitHub Pages usually serves from the `gh-pages` branch created by the deploy script.
