# Daft-a-Peth - Cloudflare Pages site

This is your full static site build for **daft-a-peth.com**.

## Included
- Home page
- Blog page
- Single post page
- About page
- Shop page
- Your chosen logo already added
- Easy content files:
  - `content/posts.json`
  - `content/products.json`

## Launch on Cloudflare Pages with GitHub
1. Create a GitHub repository.
2. Upload every file from this folder.
3. In Cloudflare go to **Workers & Pages**.
4. Choose **Create application** > **Pages** > **Connect to Git**.
5. Pick your repo.
6. Use these settings:
   - Framework preset: **None**
   - Build command: leave blank
   - Build output directory: `/`
7. Deploy.

Because this is a static site, there is no build step needed.

## How to change blog posts
Open `content/posts.json` and edit the entries.

Example:
```json
{
  "slug": "my-new-post",
  "title": "My new post title",
  "category": "Football",
  "date": "2026-04-14",
  "readTime": "5 min read",
  "excerpt": "Short summary for the card.",
  "body": [
    "First paragraph.",
    "Second paragraph.",
    "Third paragraph."
  ]
}
```

## How to change products
Open `content/products.json` and edit the entries.

Example:
```json
{
  "name": "New product name",
  "type": "Tee Shirt",
  "price": "£30",
  "description": "Short product description.",
  "link": "https://your-checkout-link-here"
}
```

## Easiest way to update the site yourself
Use GitHub in the browser:
1. Open the file.
2. Click the pencil icon.
3. Edit the text.
4. Commit the change.
5. Cloudflare Pages redeploys automatically.

## Where your logo is
Your current logo file is here:
- `assets/logo-daft-a-peth.png`

If you ever replace it, keep the same file name and overwrite that image.

## Smart next upgrades
- Add your real about page copy
- Replace placeholder product names with your actual drops
- Add your social links
- Add real checkout links
- Connect email signup
- Add analytics


## New content structure
- Top nav now uses category pages: Football, Betting, Golf, Lifestyle, Food, Shop
- Homepage order is logo/brand first, then About, then Latest Articles
- Add food recipes and eating-out posts in `content/posts.json` using category `Food`
- Optional food post tag values: `Recipe` or `Eating Out`
- Category pages use `blog.html?category=Football` style links
