# Writing your blog

Only people with write access to your GitHub repository can publish. Visitors cannot write or edit posts: this is a static blog, with no browser editor or submission endpoint. Keep your GitHub account secure and only give repository write access to trusted people.

## Publish a post

1. In VS Code, open `portfolio/content/posts/`.
2. Copy `my-first-post.md` to a lowercase filename like `building-my-chat-app.md`.
3. Fill in the metadata and write below the second `---`:

```markdown
---
title: Building my chat app
description: What I built, the decisions I made, and what I learned.
date: 2026-11-01
category: projects
draft: false
---

## The idea

Your story here.

## What I built

Explain the project. Add **bold text**, lists, code blocks, and links.
```

Use `category: thoughts` for personal posts, or `category: projects` for project write-ups. Use a real date in YYYY-MM-DD format. The filename becomes the URL: `/blog/building-my-chat-app/`.

Set `draft: true` to keep a post off the deployed website. Drafts committed to a public GitHub repository can still be read on GitHub; keep truly private notes outside the repository.

## Preview locally

```sh
cd /Users/evison/Documents/ChatGPT/my-profile/portfolio
npm ci
npm run dev
```

Open http://localhost:3000/blog/. If port 3000 is occupied:

```sh
npm run build
python3 -m http.server 3001 --directory dist
```

Re-run `npm run build` after editing Markdown, then refresh the browser.

## Publish your changes

From the `my-profile` folder:

```sh
git add portfolio/content/posts
git commit -m "Publish a new blog post"
git push
```

Vercel builds Markdown into HTML automatically. The listing sorts newest first and lets readers filter thoughts or project notes. Generated HTML in `dist/blog/` is not committed. Do not edit generated pages; edit the Markdown source instead.

## Images

Put images in `portfolio/dist/assets/` and refer to them using root-relative links:

```markdown
![A screenshot of my project](/assets/my-project.png)
```

Also add new image files to Git when publishing. Write Markdown and HTML only from sources you trust: post content is rendered as HTML at build time.
