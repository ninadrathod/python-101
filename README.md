# Python 101 — The Cheat Sheet Course

A single-page, beginner-friendly Python course that covers the built-ins, standard-library tools and tricks you need before a coding test. It also covers reading and writing files and scraping websites.

- **Stack:** plain HTML + [Tailwind CSS (CDN)](https://tailwindcss.com/docs/installation/play-cdn) + vanilla JS + [highlight.js](https://highlightjs.org/)
- **No build step:** open `index.html` and it works.
- **Responsive:** sticky sidebar table of contents on desktop; sticky top bar with a slide-out menu on mobile.

```
.
├── index.html   # all course content (27 sections)
├── script.js    # TOC generation, mobile drawer, scroll spy, copy buttons, progress bar
└── README.md
```

---

## Preview locally

```bash
cd python-101
python3 -m http.server 8000
# open http://localhost:8000
```

You can also double-click `index.html`. A local server is closer to how GitHub Pages serves the site, and the clipboard "Copy" buttons work more reliably over `http://localhost`.

---

## Hosting on GitHub Pages

### ⚠️ First: this repository is private

GitHub Pages availability depends on **your plan** and the **repo's visibility**:

| Your plan | Public repo | Private repo |
|---|---|---|
| GitHub Free (personal or org) | ✅ Pages available | ❌ **Pages not available** |
| GitHub Pro (personal) | ✅ | ✅ |
| GitHub Team (org) | ✅ | ✅ |
| GitHub Enterprise Cloud | ✅ | ✅ (can also restrict who can view the site) |

What this means:

1. **On a Free account you cannot publish Pages from a private repo.** You can either upgrade to **GitHub Pro**, or make the repository **public** (steps below).
2. **A private repo does not mean a private website.** On Pro and Team, the *source code* stays private, but the published site is **publicly accessible to anyone with the URL**. Only GitHub Enterprise Cloud supports access-controlled ("private") Pages sites. Never put secrets in a Pages site.
3. If you later downgrade from Pro to Free while the repo is private, the site will be **unpublished**.

Choose **Option A** or **Option B**, then continue with **Enable GitHub Pages**.

### Option A — keep the repo private (GitHub Pro, Team or Enterprise)

1. Check your plan at **Settings (your profile) → Billing and plans → Plans and usage**.
2. If you're on Free, upgrade to **Pro** there.
3. Skip to [Enable GitHub Pages](#enable-github-pages).

### Option B — make the repo public (free)

Before you flip the switch, do a safety check. **Making a repo public exposes all of its files *and its entire commit history*.**

1. **Scan for secrets** (API keys, passwords, `.env` files, tokens), including in past commits:
   ```bash
   git log --all --oneline              # review what's in the history
   git grep -I -n -E "(api[_-]?key|secret|password|token)" $(git rev-list --all) | head
   ```
   If you find something, **rotate (revoke and reissue) that secret immediately**. Deleting it in a new commit is not enough, because it's still in history. Then rewrite history with a tool such as [`git filter-repo`](https://github.com/newren/git-filter-repo) or BFG before going public.
2. **Check for personal info** you don't want published, such as your email address in commit metadata.
3. **Add a license** if you want others to be allowed to reuse the content. Without one, the default is "all rights reserved".
4. Change the visibility:
   1. Open the repo on GitHub → **Settings** → **General**.
   2. Scroll to the **Danger Zone** → **Change repository visibility** → **Change visibility**.
   3. Choose **Make public**, read the warnings, type the repo name to confirm, and authenticate if prompted.

Things that change when a repo goes public:
- Anyone can view, clone and fork the code.
- Stars and watchers become visible, and the repo can show up in search results.
- GitHub Actions minutes are free for public repos.
- You can switch it back to private later, but anything already cloned or forked stays out there.

### Enable GitHub Pages

1. Push the code to GitHub (on the `main` branch):
   ```bash
   git add index.html script.js README.md
   git commit -m "Add Python 101 course"
   git push origin main
   ```
2. On GitHub, go to the repo → **Settings** → **Pages** (left sidebar, under *Code and automation*).
3. Under **Build and deployment**:
   - **Source:** `Deploy from a branch`
   - **Branch:** `main` and folder `/ (root)` → **Save**
4. Wait a minute or two. The Pages settings page (and the **Actions** tab) shows the deployment status.
5. Your site will be live at:
   ```
   https://<your-username>.github.io/python-101/
   ```

### Optional: use your own domain

1. Create a file named `CNAME` in the repo root containing just your domain, e.g. `www.example.com` (one line, no `https://`). Commit and push:
   ```bash
   echo "www.example.com" > CNAME
   git add CNAME && git commit -m "Add custom domain" && git push
   ```
2. At your DNS provider, add the records:

   **For a subdomain such as `www.example.com`:**

   | Type | Name | Value |
   |---|---|---|
   | CNAME | `www` | `<your-username>.github.io` |

   **For an apex/root domain such as `example.com`** (in addition to, or instead of, `www`):

   | Type | Name | Value |
   |---|---|---|
   | A | `@` | `185.199.108.153` |
   | A | `@` | `185.199.109.153` |
   | A | `@` | `185.199.110.153` |
   | A | `@` | `185.199.111.153` |
   | AAAA | `@` | `2606:50c0:8000::153` |
   | AAAA | `@` | `2606:50c0:8001::153` |
   | AAAA | `@` | `2606:50c0:8002::153` |
   | AAAA | `@` | `2606:50c0:8003::153` |

3. In **Settings → Pages → Custom domain**, enter the same domain and click **Save**. GitHub runs a DNS check.
4. Once the check passes (DNS can take up to 24 hours), tick **Enforce HTTPS**.
5. Recommended: [verify your domain](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages) in your account settings so nobody else can claim it for their Pages site.

Check DNS from your terminal:
```bash
dig www.example.com +noall +answer
```

### Updating the site

Every push to `main` redeploys automatically:
```bash
git add -A && git commit -m "Update course" && git push
```

### Troubleshooting

| Problem | Fix |
|---|---|
| 404 at the `github.io` URL | Confirm Pages is set to `main` / `(root)` and that `index.html` is at the repo root. Wait a few minutes after the first deploy. |
| Redirects to a domain that doesn't work | Delete or fix the `CNAME` file and clear the custom domain field in **Settings → Pages**. |
| "Pages is not available" on a private repo | Upgrade to Pro, or make the repo public (see above). |
| HTTPS checkbox is greyed out | DNS hasn't propagated or is misconfigured. Recheck the records and wait. |
| Styles missing | The page loads Tailwind and highlight.js from CDNs, so you need an internet connection. |

---

## Customising

- **Colours / theme:** a dark code-editor theme. Edit the `tailwind.config` block in the `<head>` of `index.html`. The neutrals are `canvas`, `panel`, `line` and `fg`; the accent palettes are named after syntax-highlighting roles: `term` (prompt green), `fn` (cyan), `str` (orange), `kw` (purple), `err` (red) and `num` (yellow).
- **Reusable styles:** the `<style type="text/tailwindcss">` block defines `.card`, `.tip`, `.analogy`, `.warn`, `.code` and so on with `@apply`.
- **Add a section:** copy any `<section>` and give it a unique `id`, a `data-group` (sidebar heading) and a `data-title` (sidebar label). The table of contents builds itself.

> The Tailwind Play CDN is great for zero-build projects. For heavy production traffic, consider compiling Tailwind with the [Tailwind CLI](https://tailwindcss.com/docs/installation) to get a smaller, faster CSS file.
