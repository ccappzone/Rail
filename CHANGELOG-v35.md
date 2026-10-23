# Send It v35 — proportional scaling

Layout unchanged. This is purely about how it adapts to other phones.

## One scale unit instead of many

v34 sized each element with its own `clamp()` against viewport width. That works on
your S23 but drifts elsewhere: on a bigger phone the logo would hit its ceiling while
the speed digits kept growing, so the balance you approved would quietly come apart.

There is now a single unit:

    --k: min(calc(100vw / 360), calc(100vh / 780));

Read it as "how many times bigger is this screen than the one this was designed on",
limited by whichever dimension is tighter. Every size on the ride screen is a design
value multiplied by it. The speed is `90 * --k`, the logo `60 * --k`, the clock
`34 * --k`, and so on.

The result is that the proportions hold. On your S23 nothing moves by a pixel. On a
Pixel 8 everything is 14% larger, together. Landscape flips the reference to 780×360
so the same logic applies rotated.

## Measured across real devices

| Device | Size | Scale | Speed | Fits |
|---|---|---|---|---|
| Galaxy S23 | 360×780 | 1.00× | 90px | yes |
| S23 Ultra | 384×824 | 1.06× | 95px | yes |
| Pixel 8 | 412×915 | 1.14× | 103px | yes |
| iPhone 15 Pro Max | 430×932 | 1.19× | 108px | yes |
| iPhone SE | 375×667 | 0.86× | 77px | yes |
| Z Fold (open) | 673×841 | 1.08× | 97px | yes |

Nothing clips anywhere, checked against the widest string each slot has to hold.

**One case worth knowing:** a folding phone opened out is far wider than it is tall
relative to the design, so the scale is capped by height and the left column ends up
roomy — about 358px of space for a 159px number. It is correct and nothing breaks, it
just looks sparse. Scaling by width instead would overflow the bottom of the screen,
which is worse. Not worth solving unless someone actually rides with a fold.

## Floors and ceilings

Every scaled value keeps a minimum and a maximum, so a very small phone stays legible
and a tablet does not render absurd digits. On any real phone the proportional value
sits well inside those bounds and they never engage.

## Verified

95 tests across four suites, all passing.

## Install

Replace `index.html` and `sw.js`. Setup should read `Send It v35`.
