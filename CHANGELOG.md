# Send It — changelog

Newest first.

---

## v44 — airtime no longer cut short, bigger airs count

**The 0.23 s problem.** In the air, rider and bike fall together, but the rider is
still working the bars — levelling out, tucking, absorbing. The phone feels that as a
force. The old landing test ("above 0.6 g for 70 ms") could be passed by a mid-air bar
pull, so the jump ended early and the real landing was ignored. Simulated against the
old detector, a 0.90 s jump with a bar pull read 0.29 s and a 1.40 s send read 0.23 s —
the same short number every time.

Fixes:
- a landing must now spike to about 1.1 g;
- a landing is provisional for 0.35 s — if the phone drops back into free fall, it was
  mid-air and the flight carries on;
- safety net: a normal riding load held for 0.25 s ends the jump even if the landing
  was too smooth to spike (transition landings);
- a suspension rebound straight after a landing doesn't extend the jump.

Simulated: 0.90 s with bar pull → 0.90; 1.40 s with two pulls → 1.40; clean 0.60 → 0.60;
smooth 1 g landing → 0.80 of 0.80; rough trail → nothing; 0.12 s hop → rejected.

**Air traces.** The last 12 jumps (logged or rejected) keep the accelerometer reading
around them. Setup → Air test → Save air traces downloads them, so the detector can be
tuned on real jumps. Costs nothing noticeable: a small fixed-size buffer.

**Airs count 50% bigger** (10 → 15px), now on two lines: "3 AIRS" / "BEST 1.12S".

---

## v43 — Bike / Ski, vertical, lift count

**Sport toggle** at the top of Setup.
- **Bike:** speed bar 0–60, ride screen shows **Climb** (metres gone up).
- **Ski:** speed bar 0–80, ride screen shows **Vert** (metres gone down).
- Rail top speed can still be changed by hand afterwards.

**Vertical sits under Peak, same 20px number.** Both climb and descent are always
counted and saved; Sport only picks which one the screen shows. Feet when set to miles.

**How it's measured.** GPS altitude, which comes free with every speed reading — no
extra battery. GPS height wanders 5–15 m even standing still, so readings the phone
rates as poor are dropped, the rest are smoothed, and a change is only banked once it
clears 6 m. In testing: parked 3 minutes with ±8 m noise banked 7 m; a 200 m climb read
196 m; 450 m of skiing read 431 m. Expect real-world totals within roughly 10–20%.

**Paused time doesn't count.** Shuttle up in the truck with the ride paused and that
climb isn't banked. Time the app was killed mid-ride still counts, like distance.

**Lift count (ski summary only).** A sustained climb of 40 m counts as one lift. It
re-arms after 25 m of descent, so a lift with a dip in it still counts once.

**Summary:** Bike adds Climb ↑. Ski adds Vertical ↓ and Lifts. Rides saved before v43
have no vertical and simply don't show it. CSV gains sport, ascent, descent and lifts.

---

## v42 — breadcrumb trail removed

**GPS stays on — it is the speedometer.** Live speed, distance, peak and avg all still
come from GPS exactly as before.

**What's gone:** the right-edge swipe to the breadcrumb map, the map screen and its
background tiles, the map thumbnail and speed-through-the-ride chart on the summary,
Map and GPX on the ride cards, and the Track logging setting. GPS points are no longer
stored at all — older settings that had it switched on are overridden.

**Kept:** CSV export (ride totals + every jump) and Export all rides. Rides saved
before v42 keep their stored points inside those exports.

**Screen stays on while riding**, unchanged: Keep screen on and Background keepalive
both default to On.

The app is about 440 lines lighter.

---

## v41 — Start on the left, bigger Peak, smaller clock

**Start ride is on the left.** Things begin on the left and end on the right. Finish
moves to the right. The resume screen follows the same rule: Resume ride left,
Finish it right.

**The summary screen flipped with it, deliberately.** Save is now on the right and
Hold to discard on the left. Finish sits on the right of the ride screen, so a press
that carries through from Finish still lands on Save, never on Discard. Finish and
Discard still never share a side.

**Peak value up to 20px** (was 14). The PEAK label stays small; the number is the
thing you glance at.

**Clock down to 15px** (was 17).

**Peak marker fix.** The white peak line used to run down through the tag row and
could strike through the Peak number. It now spans the bar only.

---

## v40 — horizontal gauge, bigger speed

Whole-number speed at 112px with km/h beside it at 17px. Horizontal gauge wedging
16 → 55px under the speed, banded colour from logo blue (#85C8FE) through amber to
red. Recording banner lost its tinted block. Clock to 17px. Finish hold 500ms;
Discard stays at 800ms.

## v39 — export fixed, saved-ride button bar removed
## v38 — deploys land immediately (no-store fetch, updateViaCache none)
## v37 — iOS install meta tags
## v36 — the app updates itself (never mid-ride)
## v35 — proportional scaling anchored to 360×780
## v34 — locked layout, button safety, hold-to-finish, 600ms nav guard
## v33 — split layout, time of day
## v32 — airtime detection rebuilt, Air test panel
## v31 — auto-resume, gap rendering, post-ride summary
## v30 — crash-safe rides, breadcrumb map, service worker fixed
