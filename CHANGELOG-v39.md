# Send It v39

## The GPX / CSV / Done bar is gone

Removed entirely. Viewing a saved ride now has no button bar at all — Close sits in the
header where it always did, and GPX and CSV stay on the ride card in the Rides list
where they belong.

You were right that it made no sense. It put three taps between you and the screen you
wanted, one of which quietly exited, and it duplicated functions that already had a
home.

## Export all rides now actually works

It was failing silently, which is the worst way for anything to fail.

**What was wrong.** The button tried the Android share sheet first, which is correct —
that is how you get a file into mail or Drive. But `navigator.share()` returns a promise
and the old code never caught its rejection. Android also refuses to open a share sheet
unless a tap happened very recently, and gathering every ride out of storage first can
use up that window. So the share was refused, the rejection went nowhere, no fallback
ran, and no message appeared. The button looked dead because, in that moment, it was.

**What it does now.** It tries the share sheet. If Android refuses, it falls back to a
plain download. Either way it tells you which happened — *Shared send-it-2026-10-23.json*
or *Saved to Downloads* — followed by *12 rides · 84 KB* so you know the file is not
empty. If there are no rides it says so instead of exporting an empty file. If both
routes fail it says that too, rather than leaving you guessing.

Backing out of the share sheet yourself is treated as a choice, not a failure — it will
not force a download behind your back.

The file is dated (`send-it-2026-10-23.json`) and carries every ride summary, every GPS
point and every jump, plus the app version and your units, so it can be read back
without guesswork.

## Verified

123 tests across six suites. The export ones cover the share sheet working, the share
sheet being refused, the rider cancelling, and having nothing to export — all four of
which previously looked identical from the outside.
