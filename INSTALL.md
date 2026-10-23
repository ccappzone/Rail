# Installing Send It

## Android (Chrome)

1. Open **https://ccappzone.github.io/Rail/** in Chrome itself — not from inside
   another app. A link tapped in messages or Slack may open in that app's embedded
   browser, which cannot install anything.
2. Menu (⋮) → **Install app**
3. It appears in your app drawer with the Send It icon

You get a real app: its own icon, its own entry in recents, no address bar, no Chrome
UI. Android builds a small package from the manifest, so it behaves like any installed
app, works offline, and keeps its own storage.

If the menu only offers "Add to Home screen" and no "Install app", you are in an
embedded browser. Copy the link into Chrome and try again.

**Note:** the app runs fullscreen, which hides the Android status bar — no system clock
or battery while you are in it. That is what the in-app clock is for.

## iPhone (Safari)

1. Open the link in **Safari** — Chrome on iOS cannot install web apps
2. Share button → **Add to Home Screen**
3. Name it and tap Add

It runs standalone with no Safari chrome.

**Worth knowing before a friend tests on an iPhone:** iOS is stricter than Android
about background web apps. The wake lock that keeps the screen on is only supported
from iOS 16.4, and iOS is more aggressive about evicting storage from web apps that go
unused for weeks. Rides are saved either way, but an iPhone is the weaker test device.

## Checking which version you have

Setup → bottom of the screen. It reads `Send It v37` plus whether crash-safe storage is
active.

**Setup → Check for updates** fetches the latest build. From v36 onward the app does
this itself on every launch and applies updates automatically — except mid-ride, where
it waits until the ride is saved.

## Sharing it

Just send the URL. There is nothing to sign up for and no account. Each person's rides
live only on their own phone — there is no server holding any of it, which also means
nothing syncs between devices and clearing browser data for the site wipes the rides.
Export from Setup before doing that.
