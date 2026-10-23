# Deploying a new build

1. Upload `index.html` and `sw.js` to the repo
2. Wait for the green tick on the commit (GitHub is still building until then)
3. Open the app, Setup → **Check for updates**

That is the whole thing. No guessing at how long to wait and no refresh dance.

## Why the waiting used to be unpredictable

Two delays stacked, and only the first was obvious.

**The deploy.** GitHub builds the site and pushes it to its CDN — usually 10 to 60
seconds. The commit's tick tells you when it is done, so there is no need to estimate.

**The cache.** GitHub Pages serves files with a ten-minute cache lifetime. The service
worker was network-first, but a plain `fetch()` still consults the browser's HTTP
cache, so "go to the network" could be answered from a stale copy and look perfectly
fresh. The same applied to the browser's own check of `sw.js`. Between them, a new
build could stay invisible for up to ten minutes after it had successfully deployed —
which is exactly the kind of thing that makes you wonder whether the upload worked.

Fixed on both sides in v38:

- the worker fetches the page with `cache: 'no-store'`, so it genuinely hits the
  network every time, and still falls back to its own cache when there is no signal
- the app registers with `updateViaCache: 'none'`, so the browser cannot answer an
  update check from cache

## What you should see now

Once the commit shows its tick, the next launch picks up the new build on its own.
**Check for updates** forces it immediately and tells you either *Already up to date*
or *Update found — restarting*.

The one exception is mid-ride: an update is held until the ride is saved, because
reloading during a recording would be worse than running a build one version behind.

## If something still looks wrong

1. Setup → Check for updates — it will say plainly whether a newer build exists
2. Confirm the version line at the bottom of Setup matches what you uploaded
3. Only then suspect the upload

Check the deployed file directly at `ccappzone.github.io/Rail/index.html` and search it
for `APP_VERSION` to see what the server is actually holding.
