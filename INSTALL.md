# THE VENDOR, rebuilt: install guide

## What's in the folder

```
index.html                  your site, with the old vendor code taken out and the new files hooked in
vendor/
  vendor.css                styles for the basement, the visual novel and the room
  shared.js                 memory, settings, sound bus, hooks into the page, debug switches
  sound-dsp.js              the synthesiser: oscillators, filters, physical models, reverb
  sound-bank.js             every sound in the game, written as a recipe
  sound-worker.js           renders the bank in the background so the page never stalls
  sound-runtime.js          caches the rendered sounds, plays them, places them in 3D
  basement-map.js           the floor plan: rooms, lights, props, hiding spots, tag spots
  basement-gfx.js           every texture and sprite, painted in code (no image files)
  basement-audio.js         every sound, synthesised in code (no audio files)
  basement-core.js          the game: renderer, the vendor's AI, input, menus, deaths
  coldfeet.js               the visual novel, every ending, and the check-in room
```

No new images or audio files. Everything new gets drawn and synthesised in the browser. All nine files in `vendor/` need to go up, including `sound-worker.js`. The game never references that one by a script tag, so it's easy to miss. Your existing assets (fridge PNGs, mp3s, screencrack.png, BSOD.png, gifs) stay exactly where they are.

## Putting it on GitHub Pages

1. Open your site's repo on github.com.
2. Back up first. Click `index.html`, click the three dots in the top right, pick **Download**. Keep that copy somewhere safe.
3. Go back to the repo root (the page that lists all your files).
4. Click **Add file**, then **Upload files**.
5. Drag in the new `index.html` from this folder. GitHub will replace the old one.
6. In the same upload, drag in the whole `vendor` folder. Drag the folder itself, so GitHub keeps the `vendor/` path. After the drop you should see entries like `vendor/basement-core.js` in the upload list.
7. Scroll down, type a commit message (something like `vendor rebuild`), click **Commit changes**.
8. Wait one to two minutes for Pages to rebuild. The **Actions** tab shows a green check when it's live.
9. Open fridgesforsale.fun and hard refresh: Ctrl+Shift+R on Windows, Cmd+Shift+R on a Mac. On a phone, close the tab fully and reopen it.
10. Check the repo root afterwards. It should show `index.html` and a `vendor` folder side by side, next to your fridge PNGs and mp3s.

If the grey box does nothing after upload, the `vendor` folder probably landed in the wrong place. Open the repo and confirm `vendor/shared.js` exists at that exact path.

## Your old save data

The game reads the same browser storage key as before (`vendor_memory_v1`). Anyone with deaths already counted keeps them. New fields get added on first load.

## Controls

**Keyboard and mouse**
- WASD: move. Arrow keys work too.
- Mouse: look. Click the screen once to lock the mouse.
- Shift: run. Running drains stamina and makes noise.
- F: flashlight on or off. Off is harder to see by and harder for it to see.
- R: shake the flashlight. The light dims over time; shaking brings it back and makes noise.
- E or Enter: use the thing in front of you (tags, hiding spots, the door, a few other things).
- Esc or P: pause. Settings live there.

**Phone**
- Left thumb anywhere on the left half: a joystick appears under it. Push to the edge of the ring to run (the ring turns red).
- Right thumb anywhere on the right half: drag to look.
- LIGHT: flashlight on or off.
- SHAKE: shake the flashlight.
- The big round button appears only when there's something to use, and its label changes (TAKE, HIDE, OUT, DOOR, and so on).
- II in the top left: pause.
- Landscape plays best. On Android it tries to lock landscape on its own.

## How the game works now

- Six fridges have tags. Take all six and the stairs door unlocks, then get back to it.
- Before the first tag, it only shows up for a second at the end of a corridor.
- After the first tag it hunts. It walks the corridors, follows noise, and teleports closer when you can't see it.
- Early on it freezes while you look at it. From the fourth tag on, it keeps moving while you watch.
- Staring at it builds static. Too much static and it has you.
- Lights die as you take tags. The fifth tag sets off a scare. The sixth turns everything red.
- Hiding spots: two showroom fridges, a laundry locker, an office locker, a cold room fridge. Each works once per run. If it watched you get in, it comes straight to you.
- A tally wall by the stairs door counts deaths. Six marks, then a heart where the seventh goes.
- The seventh death is the turn. It catches you and stops.

## Sound

Every sound gets synthesised in your visitor's browser the first time they load the page, in a background thread. On a slow machine the essentials take about 4 seconds and the full set about 11. The browser caches the result, so the second visit is ready in under 3. The title screen shows "the lights are coming on" with a percentage until the essentials finish, then the button turns into "go down".

If you change a sound recipe in `sound-bank.js`, bump `VBANK_VERSION` at the bottom of that file (for example `vendor-snd-3` to `vendor-snd-4`). That throws away everyone's cached copy so they hear the new version.

## Events

Every 15 to 50 seconds the basement does something on its own. Which thing depends on the room you're in and how many tags you hold. Some can happen once per run, some repeat.

## Testing switches

Add these to the end of the URL. Combine them with commas.

| Add to the URL | Effect |
|---|---|
| `?vendor=reset` | wipe its memory (death count, relationship, everything) |
| `?vendor=deaths6` | set the death count (any number works, `deaths3`, `deaths12`) |
| `?vendor=together` | skip to the check-in room |
| `?vendor=unplug` | the dark room |
| `?vendor=debug` | fps counter; M shows a map; G makes it unable to catch you |
| `?vendor=reset,deaths6,debug` | combined: fresh save, one death from the visual novel, debug on |

The browser console has `vendorDebug.mem()`, `vendorDebug.reset()`, `vendorDebug.deaths(6)`, `vendorDebug.together()` and `vendorDebug.stranger()`.

## Easter eggs (hints only)

- Something down a dead end in the crawlspace belongs on its face.
- Storage has a warning written on a wall. Ignore it.
- The office radio is tuned to a station you know.
- The laundry has a tape in it. It's loud. Something hates it.
- Read the walls. A couple only show up under certain conditions.
- Once you're in the room with it, ask it about upstairs things after you've been busy up there.
- Look behind it, eventually.
- The office radio has more than one station. One of them is meant to be looked at.
- Something in the boiler room rings.
- Somebody dropped a watch in the showroom. You'd know if it's real.
- There's a bottle on a washer with a name you'll recognise.
- The office has an old newspaper with a masthead you'll recognise too.
- When you've had the sauce, count the fridges in the cold room again.
- Now and then, early in a run, it's on its break.
- Once you know a certain name from the walls, try typing it.
- The vendor only answers questions about things you've seen down there. Read the walls. Read the tags.

## Fonts

The new screens load two Google Fonts (Special Elite and Reenie Beanie). With the network blocked they fall back to Courier and a cursive font, and nothing breaks.
