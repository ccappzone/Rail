# Send It — Advance Your Ride

Big-digit GPS speed, a segmented speed bar, **airtime per jump**, moving time and distance. Records each session and saves it to a ride list you can export as GPX, CSV or JSON.

Files:

| File | What it is |
|---|---|
| `index.html` | The whole app — layout, styling, logic, and the logo (embedded as data, so there is no separate image file to upload). |
| `manifest.webmanifest` | Lets Android install it as a real app (own icon, fullscreen, no browser bars). |
| `sw.js` | Service worker. Caches the app so it opens instantly and works with no signal. |
| `icon-*.png`, `apple-touch-icon.png` | Home screen icons — the SI monogram, cut from the logo's own letterforms. |

---

## 1. Host it (10 minutes, free, permanent)

GPS and the keep-screen-on lock only work over **https**. Opening `index.html` from your phone's Downloads folder will not get you a speed reading. It has to be served.

**GitHub Pages — recommended.** Free, permanent URL, no build step, and updating the app is a drag-and-drop.

1. Create a free account at github.com if you don't have one.
2. New repository → name it `rail` → **Public** → Create.
3. On the repo page: **Add file → Upload files** → drag in all the files from this folder → Commit.
4. **Settings → Pages** → Source: *Deploy from a branch* → Branch: `main`, folder: `/ (root)` → Save.
5. Wait about a minute. Your app is at `https://YOURNAME.github.io/send-it/`

To push an update later: upload the changed file, and bump the `CACHE` version in `sw.js` (currently `si-v12`, so go to `si-v13`). Without that bump, phones that already installed it keep running the old cached copy.

**Alternatives:**
- **Netlify Drop** (netlify.com/drop) — drag the folder onto the page, get a URL in about 20 seconds, no account needed to start. Fastest way to test. Free tier URLs are random-looking but you can rename them.
- **Cloudflare Pages** — same idea, connects to the GitHub repo, fastest edge delivery. Overkill for this, but free.

Avoid Google Drive / Dropbox links. They serve files as downloads, not as a website, so the app won't run.

## 2. Install it on your phone

1. Open the URL in **Chrome** on Android.
2. Menu (⋮) → **Add to Home screen** → Install.
3. Launch from the icon, not from Chrome — installed mode drops the address bar and gives you the full screen.
4. First ride: Chrome asks for location. Choose **Precise** and **While using the app**. If you pick "approximate" you'll get a speed reading that's useless.

## 3. Share it with friends

Send the URL. That's the whole distribution story — no Play Store, no APK, no sideloading, no signing. They add it to their home screen the same way.

Worth telling them: **ride data is stored on their own phone only**, in the browser's storage for that site. Nothing syncs anywhere. Consequences to warn them about:

- Clearing Chrome's site data or storage for the site wipes the ride list.
- Uninstalling the app can clear it too.
- Different phone = different rides. There is no account.
- The **Export all rides** button in Setup is the backup. Tell them to use it if a session mattered.

If a shared version ever needs accounts and sync, that's the point where it stops being a single HTML file — see the roadmap note at the bottom.

---

## Airtime detection

The phone is a load sensor. Clamped to the bars it reads about 9.8 m/s² at rest — that's gravity being resisted by the frame. The instant the wheels leave the ground nothing pushes back, and total acceleration collapses toward zero. Airtime is the gap between that collapse and the landing spike.

**What you see.** The air line sits under the speed rail. On landing, the duration flashes amber for three seconds, then settles back to your last air, with the session count and best air on the right. Every jump is logged with its duration and the speed you took off at, so after the session you can see whether the bigger airs came from more speed or better pop.

**Tuning it — do this on your first session.** Sensitivity sets how unloaded the bike has to get before it counts:

| Setting | Catches | Risk |
|---|---|---|
| Low | Clean, committed airs only | Misses small doubles |
| Med | Most real jumps | Start here |
| High | Small doubles, rollers, manuals | Rough chatter can false-trigger |

Do one run, count your jumps in your head, then check the number against the app. Off by a couple? Move one step. Also raise **Minimum air** if braking bumps are inflating the count — anything below that duration is treated as chatter, not a jump.

**Mount rigidity matters more than the settings.** A phone in a soft silicone bar strap flexes, which blurs the collapse and the landing spike, and the detector goes vague. A rigid clamp gives clean edges and much better numbers. This is the single biggest factor in accuracy.

**Honest limits:**
- Accelerometer events run around 60 Hz, so durations are good to roughly ±30 ms. A 1.20 s air might read 1.17–1.23.
- A jump doesn't count unless you were doing more than 4 km/h at takeoff. Stops the app logging airs while you carry the bike.
- Anything over 4 seconds is discarded as a sensor error, and there's a 350 ms gap enforced between jumps, so a very fast double may register as one.
- Drops and step-downs read slightly long, because unweighting before the lip starts the clock a fraction early. Consistent, so still comparable run to run.
- It cannot tell a jump from being airborne for any other reason. Crashes log beautifully.

---

## On the screen

- **Speed** — huge, centre screen, one decimal. The only thing you should ever need to read at speed.
- **Speed bar** — 24 amber segments under the digits, labelled 0 / 25% / 50% / 75% / full scale. The white line is your session peak. Set the scale in Setup just above your usual top speed. The point is that you can read *how many segments are lit* in peripheral vision without focusing on digits — the difference between a glance and taking your eyes off the trail.
- **Moving time** — clock stops when you stop, if auto-pause is on.
- **Air line** — last jump, session count, best air. Flashes amber on landing.
- **Colours** — white for speed, time and distance; light grey for avg and peak; light blue for every label. Amber is reserved for the speed bar and a fresh landing.
- **Focus** — hides the speed bar and stats, keeping the logo, speed and airtime. Digits go as large as the screen allows.
- **Lock** — for bar mounting. Blocks every tap so bumps and gloved hands can't hit Finish mid-session. Press and hold anywhere for 0.7 s to unlock.
- **Orientation** — locked to portrait so the screen never flips mid-run. To switch the app to landscape instead, change `"orientation": "portrait"` to `"landscape"` in `manifest.webmanifest` and reinstall.
- **GPS dot** — green under 10 m, amber to 25 m, red beyond. Wait for green before a timed run. The first fix takes 10–30 seconds from cold; longer under trees.

## Accuracy, honestly

- Speed comes from the GPS chip's own doppler measurement when the phone provides it, which is accurate to roughly ±1 km/h and updates about once a second. It falls back to distance-over-time between fixes only if doppler isn't available.
- Peak speed is real but it's sampled at ~1 Hz. A 2-second airtime spike can land between samples. Treat peak as "close", not "certified".
- Distance ignores any fix worse than the accuracy cutoff, plus any movement under 3 m. This is deliberate: without those filters a phone sitting still on a bench accumulates a kilometre an hour of pure GPS noise.
- Tight, tree-covered jump lines are the hardest case for GPS. Expect distance to read a few percent short on a twisty session.

## Battery

The app is built to be cheap to run: no maps, no animation loops, no network calls, no background work, and it only touches the screen when a number actually changes. What's left is dominated by two things you control — **the screen** and **the GPS radio**.

Biggest wins, in order:

1. **Screen brightness.** On a bright day at 100% brightness the display can pull more power than everything else combined. Set brightness to the lowest level you can still read, then leave the dark theme on.
2. **Keep the dark theme.** On an OLED phone, black pixels are switched off. This layout is mostly black on purpose — that's a real, measurable saving, not a style choice. Only switch to the daylight theme if you genuinely can't read the digits in direct sun.
3. **Eco refresh rate** (Setup) polls GPS half as often. Roughly halves location power draw. Speed feels slightly laggier — good for a long trail ride, less good for a jump session where you're judging your run-in.
4. **Pause between runs.** Pause releases the GPS watch, the accelerometer and the screen lock entirely. Pushing back up to the top with the app paused costs almost nothing — and it stops the walk up polluting your average speed.
5. **Turn off jump detection** on rides where you don't care about airtime. The accelerometer runs around 60 Hz while recording. Small next to the screen and GPS, but not free.
6. **Stats only** track logging skips storing GPS points. Small power saving, large storage saving, but you lose GPX export.
7. **Turn off keep-screen-on** if you ride with the phone in a pocket. The screen is the expensive part; without it the app is nearly free.
8. Airplane mode with location still enabled works fine and stops the cell radio hunting for towers on a remote trail. GPS is receive-only and doesn't need a data connection.

Rough expectation with screen on, dark theme, mid brightness, fast refresh: **3–5 hours** on a typical modern Android. Screen off in a pocket: most of a day.

## Known limits

- iPhone Safari does not support the wake lock API, so the screen will sleep on iOS, and it prompts before allowing motion access. Everything works, but Android Chrome is the target.
- Fullscreen mode only applies when launched from the home screen icon.
- If you background the app mid-ride, Android may throttle the timer. Keep it in the foreground while recording.

## What's next

The natural next steps, roughly in order of effort:

1. **Lap / run splits** — one big button that marks the end of a run, so you get per-run speed and time instead of one session average. Most useful single addition for a jump line you're repeating.
2. **Track map** on the ride detail screen — needs a map library and tiles, which is the first thing here that costs real battery and bandwidth. Keep it on the history screen only, never on the live screen.
3. **Elevation and vertical descent** — GPS altitude is already available but discarded because it's noisy (±10 m). Needs heavy smoothing to be worth showing.
4. **Landing force** — the landing spike is already measured, it just isn't recorded. Peak g per jump would tell you which landings you're casing.
5. **Accounts and sync** — the point at which this needs a backend. Only worth it if friends want to compare sessions.
