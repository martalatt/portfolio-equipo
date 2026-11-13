# Team Portfolio

A small, minimalist portfolio website for a team of up to six people.
Built with React, TypeScript, plain CSS and Vite. No backend, no database, no extra libraries:
everything is saved in the browser's LocalStorage.

## What it does

- **Homepage**: welcome section, six member cards, collaborative projects, navigation menu.
- **Individual portfolios**: photo, description, list of projects, "Add project" button.
- **Add / edit / delete**: members (max 6), individual projects and collaborative projects.
- **Permissions**:
  - Everyone can view everything.
  - A *team member* can edit their own profile and projects, and all collaborative projects.
  - The *administrator* can do everything (including adding and deleting members and editing the team introduction).
- **Persistence**: changes survive a page refresh (LocalStorage).
- **Responsive**: works on phones, tablets and desktops.

## Run it on your computer

You need [Node.js](https://nodejs.org) 18 or newer.

```bash
npm install
npm run dev
```

Open the address shown in the terminal (usually http://localhost:5173).

## How to sign in

Click **Sign in** in the top-right corner.

| Role | How |
| --- | --- |
| Team member | Choose your name from the list. No password. |
| Administrator | Password: `admin123` |

Change the password in `src/config.ts`.

> **Important:** there is no server, so sign-in is only a convenience that shows or hides the editing
> buttons. The password is visible to anyone who reads the site's code, and anyone could edit their
> own browser's data. This is fine for a simple team page, but do not use it to protect anything private.

## Replacing the example content

Two ways, you can combine them:

1. **From the website**: sign in as administrator and edit names, photos, projects and the introduction.
2. **From the code**: edit `src/sampleData.ts`. This is the content every new visitor sees.

> **Where is the data stored?** LocalStorage lives in *each visitor's own browser*. When you edit the
> site online, only you (in that browser) will see the changes. Other visitors see the content from
> `src/sampleData.ts`. To change what **everybody** sees, edit `src/sampleData.ts` and publish again.
>
> After changing the *structure* of the data in `sampleData.ts`, change `STORAGE_KEY` in
> `src/config.ts` (e.g. `v1` to `v2`) so browsers that saved the old content load the new one.

Images are shrunk automatically before being saved. Browsers allow about 5 MB of LocalStorage in
total, so keep images to a reasonable number. The site shows a warning if the storage is full.

## Publish on GitHub Pages

1. Create a new repository on GitHub and upload this project (or push it with git):

   ```bash
   git init
   git add .
   git commit -m "First version"
   git branch -M main
   git remote add origin https://github.com/YOUR-USER/YOUR-REPO.git
   git push -u origin main
   ```

2. On GitHub, open **Settings → Pages**. Under **Build and deployment → Source**, choose **GitHub Actions**.
3. Go to the **Actions** tab. The workflow *Deploy to GitHub Pages* runs automatically (about a minute).
4. When it finishes, your site is at `https://YOUR-USER.github.io/YOUR-REPO/`.

The project already works under any repository name (`base: './'` in `vite.config.ts` and a hash
based router), so there is nothing else to configure.

## Update the published site

Make your changes, then:

```bash
git add .
git commit -m "Update content"
git push
```

The workflow rebuilds and republishes the site automatically.

## Project structure

```
src/
  main.tsx            entry point
  App.tsx             tiny hash router, header and footer
  config.ts           admin password, member limit, storage keys
  types.ts            data types
  sampleData.ts       example content (replace it)
  storage.ts          useLocalStorage hook
  store.tsx           app state, actions and permission rules
  utils.ts            helpers (ids, image resizing)
  styles.css          all styling
  pages/              Home, MemberPage
  components/         Header, Modal, forms, project cards, avatar, image field
.github/workflows/deploy.yml   automatic deployment to GitHub Pages
```
