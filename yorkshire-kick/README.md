# Daft-a-Peth: adding and editing articles

The website uses **Astro**. Each article is a separate Markdown (`.md`) file in **`yorkshire-kick/src/content/posts`**. You can do all your writing through GitHub in a browser; no coding app is needed.

The old articles have been removed for a fresh start. A single unpublished starter, `src/content/posts/new-article.md`, is ready for your first piece; you can edit and rename it on GitHub, or copy the template to create a separate file. Their earlier versions remain recoverable in GitHub history. The old `content/posts.json` has also been emptied; it no longer publishes Astro articles. The site works with no articles or with drafts only.

## Publish a new article

1. Open [ARTICLE_TEMPLATE.md](ARTICLE_TEMPLATE.md). Use GitHub's **Code** view (or **Raw**) and copy the entire file, including both `---` lines. Do not copy only the rendered preview.
2. Open the [articles folder](https://github.com/RICKYFISH/apeth/tree/main/yorkshire-kick/src/content/posts) on the **main** branch.
3. Choose **Add file → Create new file**. On a phone, the menu may be behind `…`; use your browser's desktop-site option if needed.
4. Name it something like `a-day-at-the-football.md`. Use lowercase letters and hyphens, with no spaces. Keep it directly inside the posts folder.
5. Paste the template. Replace the details above the second `---` and write your article below it. See the field guide below.
6. Leave `draft: true` while working. Choose **Commit changes**, add a short message such as `Draft football article`, and commit to **main**. Drafts are saved in GitHub but hidden from the built website, its article lists and RSS. They are still readable in this public repository.
7. When ready, edit the file and change it to **`draft: false`**. Choose **Commit changes** again and commit to **main**. If GitHub instead requires a pull request, merge it into main to publish.
8. Wait for Cloudflare's deployment to succeed, then check your article at `https://daft-a-peth.com/posts/a-day-at-the-football/` and on the homepage/article list.

**Everyday routine: copy template → write → change draft to false → commit → check the live page.**

## Copy-and-paste template

```markdown
---
title: 'Your article title'
description: 'A short summary for the article card and search results.'
published: 2026-10-19
category: 'Lifestyle'
tags: ['Yorkshire', 'Life']
image: '/logo-daft-a-peth.png'
imageAlt: 'Daft-a-Peth graffiti logo'
featured: false
draft: true
---

Write your opening paragraph here.

Leave a blank line between paragraphs.

## A heading if you want one

Write the rest of your article here.
```

## What each field means

Keep the spelling of the field names, the colons and both `---` lines. Only replace the values on the right.

| Field | What to put there |
| --- | --- |
| `title` | Your article's headline. |
| `description` | One or two short sentences summarising it. Shown on article cards, above the article and in search metadata. |
| `published` | The article date as `YYYY-MM-DD`, e.g. `2026-10-19`. This is the date field; do not rename it `date`. Newest dates appear first. A future date does **not** schedule publication: `draft: false` makes the article available on the next successful build. |
| `category` | Exactly one of `Football`, `Betting`, `Golf`, `Lifestyle`, `Food`, with that spelling and capitalisation. Shop is a separate page, not an article category. |
| `tags` | Optional labels written as a list, e.g. `['Recipe', 'Yorkshire']`. Use `[]` for none. Keep the commas and square brackets. |
| `image` | The image's web path. The template uses the existing logo so it works before you upload a photo. See below. |
| `imageAlt` | A short, accurate description of the chosen picture, for people who cannot see it. Update this when you change the image. |
| `featured` | `true` to request the large homepage feature; otherwise `false`. If several are true, the newest wins. If none are true, the newest published article is featured. |
| `draft` | `true` keeps it off the website; `false` publishes it after the build. Use lowercase `true`/`false` without quotes. |

Title, description, published, category, image and imageAlt are required. The template includes the optional fields too, so you can keep using the same format.

The examples use single quotes around text. If your text contains an apostrophe, double it **inside the fields**, for example `title: 'It''s a funny old game'`. Normal article paragraphs below the second `---` need no special escaping.

## Add an image

1. Open [yorkshire-kick/assets](https://github.com/RICKYFISH/apeth/tree/main/yorkshire-kick/assets) on GitHub.
2. Choose **Add file → Upload files**, select your image and commit it to **main**. Use a simple filename such as `football-away-day.jpg`. Upload the image before publishing an article that uses it.
3. In your article use `image: '/football-away-day.jpg'` and write an accurate `imageAlt`.

**Important:** Astro's `publicDir` is set to `assets`. That folder's contents are copied to the web root. So `yorkshire-kick/assets/football-away-day.jpg` becomes **`/football-away-day.jpg`**, not `/assets/football-away-day.jpg`. If you create `assets/images/football-away-day.jpg`, use `/images/football-away-day.jpg`. Paths and filename capitalisation must match.

To add another photo inside the article body, put this on its own line: `![A description of the photo](/football-away-day.jpg)`.

## Edit, unpublish or remove an article

- **Edit:** open its `.md` file in the posts folder, click the pencil/**Edit** button, change the text and commit to **main**. Keep the filename to keep the same web address. GitHub's Preview helps check Markdown, but is not a preview of the finished website.
- **Unpublish:** set `draft: true` and commit. The article disappears after a successful deployment; its old address will no longer be generated.
- **Remove:** open the file, choose **Delete file** (sometimes under `…`) and commit. GitHub history retains earlier versions. Do not delete an image used by another page.
- **Recover:** open the file's History, or the commit before its deletion, and copy the earlier text into a new file at the same path. There is no need to reset the whole repository.

Plain paragraphs are enough. Optional Markdown: `## Heading`, `**bold**`, `*italic*`, `[link text](https://example.com)`, or list lines starting with `- `. Do not paste Word formatting or wrap the whole article in triple backticks.

## How GitHub changes reach Cloudflare

With the existing Cloudflare project connected to this repository and production branch **main**, a commit to main triggers a build and deployment. A commit to another branch does not update production until merged. Cloudflare installs dependencies, runs Astro and publishes the generated **dist** folder. A failed build leaves the previous successful site in place.

Open the existing project in **Cloudflare → Workers & Pages** and check its latest deployment/build and commit. The repository cannot confirm the dashboard's current Git connection, domain mapping or automatic-deployment settings. If no deployment appears, check that the project watches `RICKYFISH/apeth`, production branch `main`, and that automatic builds are enabled.

### If the existing project is Cloudflare Pages

| Setting | Value |
| --- | --- |
| Repository | `RICKYFISH/apeth` |
| Production branch | `main` |
| Root directory | `yorkshire-kick` |
| Framework preset | `Astro` |
| Build command | `npm run build` |
| Build output directory | `dist` (relative to the root directory above) |

Do not leave the build command blank or publish `/`. Those were instructions for the earlier website. Astro must build first. See [Cloudflare's Astro Pages guide](https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/).

### If the existing project is a Cloudflare Worker

This repository also contains `yorkshire-kick/wrangler.jsonc`: Worker name `apeth`, static assets directory `./dist`. For its connected Git build use root directory **`yorkshire-kick`**, build command **`npm run build`**, and deploy command **`npx wrangler deploy`**. The existing Wrangler file points at built assets; it does not run Astro itself. Build before deploying. See [Cloudflare Workers build configuration](https://developers.cloudflare.com/workers/ci-cd/builds/configuration/).

Use the settings for the existing service attached to your domain. You do not need to create a second service or move the domain just to publish an article.

## If a change does not appear

1. Check that the article is on main, ends in `.md`, is in `src/content/posts`, and has `draft: false`.
2. Check the latest Cloudflare build belongs to your commit and succeeded. Read its error log if it failed; common causes are a missing required field, a misspelled category or broken quotes in the top fields.
3. For a missing image, check the uploaded filename and the web path explained above.
4. Refresh the live page after deployment. GitHub saving successfully does not by itself mean Cloudflare has deployed successfully.

## Technical reference (not needed for everyday writing)

- `src/content.config.ts` defines the article fields and loads Markdown from `src/content/posts`.
- `astro.config.mjs` sets static output, the site URL and `publicDir: 'assets'`.
- `package.json` provides `npm run dev`, `npm run build` and `npm run preview`.
- From `yorkshire-kick`, run `npm install`, then `npm run build`. To inspect the result locally, use `npm run preview` and open the address it prints.
- Article URLs come from filenames: `my-story.md` → `/posts/my-story/`.
- The old root `.html` files, `app.js` and `content/*.json` belong to the earlier system; they are not the current Astro publishing workflow. The Astro shop is currently a coming-soon page; editing `content/products.json` will not populate it.
- Punditry Watch uses its own files in `src/content/quotes`; the article reset leaves that collection, About, Shop, branding and images in place.
