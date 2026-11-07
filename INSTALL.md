# fridgesforsale.fun: install guide

Newest first: **COLD START** (fridge racing, now with races) is right below, then **COLD OPEN** (the nightmare robbery), then **scratch offs, cup and ball, big shots, events and gus**, then **higher or lower**, then **the bug hunt and speed pass**, then **the heist**. Then the **Fridge Palace** casino it lives in, then the 4:20 video, the fridge exchange (with the odd fridges that feed it) and fishing. The vendor stuff is at the bottom.

## COLD START (fridge racing) · stage 2 of 6: the races, the twenty drivers, five new fridges

A whole racing game with its own button on the page: **fridge racing**, right under the casino button. It looks and plays like a PS2 street racer from 2005 that nobody remembers. Every car is a fridge laid down on a chassis, and the city is Port Kelvin at 2 a.m.

**Stage 2** is the racing: three routes, real races against up to seven opponents, and the twenty drivers of the Port Kelvin street league, each with their own car, their own way of driving, their own mouth, and a memory of what you did to them last time. Five new fridges came with them. Everything from stage 1 (the city, the PS2 look, the handling, the weather) is still there and still works the same.

### What's new in the folder

```
racing/                     new folder: the whole game, already built
racing/index.html           the game's own page (it opens inside the fridge page)
racing/boot.js              adds the "fridge racing" button to the fridge page
racing/engine-worklet.js    the engine sound synthesizer
racing/models/              the seven fridges and their wheels, built in Blender (dorm, topfreeze, kei, wine, sbs, chest, exotic and wheel, all .glb)
racing/tex/                 the city's textures: 32 small pictures and a manifest.json that lists them
racing/assets/              the game code, its styles and its fonts (ten files with random-looking names)
index.html                  changed: one new line that loads racing/boot.js
```

The casino, the market, fishing and everything else didn't change.

There's also a second zip, **coldstart-source.zip**. That's the TypeScript source code the game is built from. **You don't upload it anywhere and you don't need it to play.** Keep it somewhere safe on your computer. It's there so the real code exists outside of this chat.

### Putting it on GitHub Pages

1. Unzip **fridgesforsale-coldstart.zip** on your computer.
2. Open your repo on github.com. Click **Add file**, then **Upload files**.
3. Drag in the whole **racing** folder (the folder itself, not the files inside it).
4. Also drag in **index.html** from the zip. It replaces your old one. The only change is one new line near the bottom: `<script src="racing/boot.js"></script>`, right under the `casino/boot.js` line.
   - **If you already uploaded an earlier COLD START zip:** upload the whole `racing` folder again and let it replace the old one. The files in `racing/assets/` get new random-looking names every build, so github keeps the old ones next to the new ones. They're harmless. If you want things tidy, open `racing/assets` on github afterwards and delete every file that isn't in your zip's `racing/assets` folder (click the file, then the three dots at the top right, then **Delete file**, then commit).
   - **Don't skip `racing/tex`.** Without it the game still runs, but the city falls back to the old painted textures.
   - If you've changed your index.html yourself since the last zip and don't want to replace it, open yours on github instead (click it, then the pencil icon), find the line `<script src="casino/boot.js"></script>`, and add `<script src="racing/boot.js"></script>` on the line right after it.
5. Before you commit, scroll the upload list. You should see:
   - `racing/index.html`, `racing/boot.js` and `racing/engine-worklet.js`
   - ten files that start with `racing/assets/`: one `.js`, one `.css`, and eight font files (`.woff` and `.woff2`)
   - eight files that start with `racing/models/` (stage 1 had three: the five new ones are `kei.glb`, `wine.glb`, `sbs.glb`, `chest.glb` and `exotic.glb`)
   - 33 files that start with `racing/tex/`: 30 `.jpg`, 2 `.png` (`apart_mask.png` and `graffiti.png`) and `manifest.json`

   Github's upload page can take a minute to list all of them. If they show up without `racing/` in front, the folder got flattened: cancel and drag the folder itself.
6. Commit. Wait for the green check in the **Actions** tab.
7. Hard refresh: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac). On a phone, close the tab and reopen it.
8. The new **fridge racing** button sits right under **fridge casino**. Press it.

The first load downloads about 6 MB (the physics engine is most of it), so it takes a few seconds on a slow connection. After that the browser keeps it. The game no longer needs Google Fonts: its fonts ship inside the racing folder, so it looks the same offline.

### Starting it

- A loading card comes up ("reading memory card (8MB) in slot 1"), then the title screen.
- **Press Enter**, or click or tap the screen, at **PRESS START**. That's also what turns the sound on: browsers don't let a page make noise until you've pressed something.
- **QUICK RACE** sets up a race (more on that below).
- **FREE ROAM** puts you in the city. It asks you to pick a fridge first.
- **THE LEAGUE** is the list of drivers and what each one thinks of you.
- **GARAGE** is where you pick a fridge and its paint. Locked fridges show up there too, with what it takes to get them.
- **BACK TO FRIDGESFORSALE** closes the game and puts you back on the fridge page. Esc on the title screen also backs out of the menus.

### Controls

| | keyboard | controller | phone |
|---|---|---|---|
| gas | W or ↑ | RT | GAS |
| brake (keep holding it once you've stopped and the automatic goes into reverse; press gas to go forward again) | S or ↓ | LT | BRAKE |
| steer | A D or ← → | left stick | drag on the left half of the screen |
| handbrake | Space | A or B | E-BRAKE |
| shift up / down (manual only) | E / Q | RB / LB | |
| change camera (chase, far, hood, bumper) | C | Y | CAM |
| look back | B (hold) | right stick click | |
| reset the car onto the road | R | Select / Back | (pause menu, RESET CAR) |
| horn | H | left stick click | |
| headlights | L | X | |
| pause | Esc or P | Start | ❚❚ |
| menus | arrows, Enter, Esc | d-pad, A, B | tap |

Controllers work in Chrome, Edge and Firefox. Plug it in and press any button once so the browser notices it.

### The fridges

Seven now. You start with three. The other four belong to people in the league, and the only way to get one is to beat its owner in a race (finish ahead of them). The garage shows the locked ones with who you need to beat.

- **COLDSPOT Dorm 1.3** (starter, front-wheel drive). A dorm fridge with a small four-cylinder in the nose. Light and buzzy. Too fast into a corner and it pushes wide instead of spinning.
- **HOTPOINT-KELVIN Kelvinaire 350** (muscle, rear-wheel drive). A 1974 top-freezer with a 5.7 V8. Lazy at low rpm, then it wants to go sideways. Full throttle in a corner will spin it, on purpose. Feed the gas in and it drifts.
- **COLDSPOT Minibar 660** (kei, front-wheel drive, unlocked from the start). A hotel minibar with a tiny turbo three that revs to almost 9000. Slow in a straight line, fun everywhere else.
- **VINOTEK Sommelier 30i** (euro, rear-wheel drive, locked). A wine cooler with a straight six. Balanced and smooth, the one that rewards a clean line.
- **HAKURO Frost FD-7** (JDM, rear-wheel drive, locked). A side-by-side with a turbo rotary. Hums at idle, screams at 8000, glows underneath. Made to go sideways.
- **SUBARCTIC Permafrost GT** (rally, all-wheel drive, locked). A chest freezer that went rallying: turbo flat four, all four wheels driven. Rain and gravel barely bother it.
- **MONTEFRIGO Gelato V12** (exotic, mid-engine, locked). Restaurant stainless with a 6.0 V12 behind you. The fastest thing in the city and the easiest one to spin.

They all sound different because the engine sound is synthesized from how each engine actually fires: the V8's uneven burble, the rotary's buzz, the V12's howl, the flat four's lope.

### Things to try in the city

- **The 4th Street overpass** (marked OVERPASS on the minimap). A real ramp up over 2nd Avenue. Come down the far side fast and you get air. The game shows your air time.
- **The construction site** in the south-east (SITE on the map) has a dirt pile at exactly the wrong angle. Gravel and dirt have less grip and kick up dust.
- **Kelvin Square** in the middle has a fountain and a statue. The curbs are real: you bump up onto the sidewalk.
- **KWIK-CHILL** in the south-west is the only thing open. The pumps and canopy pillars are solid.
- Trash cans, newspaper boxes, hydrants, mailboxes, cones, barrels and barriers can all be knocked over.
- Drift a corner (more on that just below). Once you're properly sideways the drift meter comes up and counts. Straighten out to bank the points.
- Look at the walls. People have been busy.
- Under the overpass the sound changes.

### Racing

From the main menu pick **QUICK RACE**. The setup screen has:

- **ROUTE**: which race (the three are below). The panel on the right shows its length, your records on it, and tonight's field.
- **LAPS**: 1 to 6 on the circuits (3 is the default). Sprints are one run, start to finish.
- **OPPONENTS**: 1 to 7. More cars is more chaos and more work for the computer. On an old laptop, try 4 first.
- **NEW FIELD**: rolls a different set of drivers.
- **WEATHER**: clear, overcast, rain or heavy fog. Some drivers are better in the rain than others. Some only race in certain weather.
- **FRIDGE**: opens the garage so you can change cars.
- **MEET THE FIELD**: one page per opponent: who they are, how they drive, what they're good and bad at, who they know in tonight's field, your history with them, and something they say to you. Then **LET'S GO**.

The race starts with a countdown on the gantry over the start line: three red lamps, then green. Gas before green does nothing (the cars are held on the grid), so have your foot down when it goes.

**The three routes:**

- **FIGURE CHILL** (circuit, 688 m a lap). Up 2nd Avenue under the overpass, round the block, then back over the top of it. The landing off the overpass is where races get decided.
- **THE GRID** (circuit, 688 m a lap). A big rectangle round the north side. The route notes say the parking lot on the far corner has no walls on its east side. Make of that what you will.
- **KWIK-CHILL RUN** (sprint, 880 m). Point to point, from the north-east corner across the whole of downtown to the gas station. Last one buys.

On a race night the city gets dressed for it: sawhorse barricades close the side streets the route doesn't use (you can knock them over, they're light), amber chevron boards mark every corner, and there's a start gantry with the lights and a checkered line. It all comes down when the race ends.

**During the race:**

- Top left: your position, the lap, the race time, your best lap, and the gap to the car ahead and behind.
- The minimap shows the route as a line and every opponent as a dot. A dot with a red ring has a grudge against you.
- Drivers talk. Their lines come up at the top of the screen with their name: when they pass you, when you pass them, when somebody hits somebody, and at the end.
- **WRONG WAY** flashes if you turn around.
- If you're lost or stuck, press **R**. It puts you back on the route a few meters behind where you were, never ahead.
- **Esc** pauses: RESUME, RESET CAR, RESTART RACE, CAMERA, SETTINGS, QUIT RACE.

After the line you get the results: finishing order, times, best laps, any new route or lap record, and notes about what changed (a new grudge, someone's respect, a fridge you won). From there you can race again with the same field, set up a new race, free roam from where you stopped, or go to the main menu.

### The league

Twenty drivers race in Port Kelvin. Every one has a name, a nickname, a car, a look, a story, a way of driving and a mouth. **THE LEAGUE** on the main menu lists them (one only shows up there after you've met them).

How they drive is not just a speed setting. Each driver has their own mix of skill, consistency (how often they make mistakes), aggression, risk, how early they brake, how good their line is, how much they like to drift, patience, how hard they defend, how they do in the rain, and how much they show off. So the coward brakes early and gives everyone room, the maniac dives into every gap, the drifter slides the big corners, the veteran defends the inside, and the champion is just fast and clean.

They race each other, not just you. They follow, pass, defend, get boxed in, bump, run wide and make mistakes against each other the same way they do against you. Some of them have rivalries, feuds and friendships with each other, and a rival drives harder against a rival.

**They remember you.** After every race each driver keeps score: how often you beat them, how often they beat you, and how many times you hit them. Lean on someone and they hold a **grudge** (they drive harder against you and they'll tell you about it). Race someone clean and beat them, and they come to **respect** you (they give you more room). Grudges and respect show up in the setup screen, on the driver pages, on the minimap and in what they say. Someone with a grudge usually turns up in your next field.

No cheating: nobody gets a speed boost for being behind, nobody slows down so you can catch up, and nobody gets moved forward. The only time the game moves an opponent is when one is truly stuck (lost, flipped, or no progress for nine seconds), and it puts them back on the road behind where they got stuck, the same as your R button.

### Driving (the handling rework)

The cars used to feel heavy: you had to slow right down for ordinary corners, they lost a lot of speed turning, and a mistake at speed spun you. That's gone. Under the tires there's still a real physics model, and on top of it sits an arcade layer that reads what you meant with the stick and helps the car do it.

- **Steering**: the car turns the moment you steer and stops turning when you let go. At low speed full lock is a tight turn, at high speed it's a long sweeper, so a twitch at 100 mph doesn't throw you off the road.
- **Cornering**: corners keep your speed. Instead of scrubbing off, the car's momentum gets turned toward where the nose points. You can take an ordinary downtown corner at 35 to 40 mph without braking.
- **Taking a corner faster than that**: drift it. There are three ways in:
  1. Tap the handbrake (Space) while steering into the corner.
  2. Tap the brake quickly while steering hard, the OutRun and Ridge Racer way.
  3. In the Kelvinaire only: full throttle with lots of steering lets the V8 kick the back end out.

  Once you're sliding, the stick sets the angle:
  - steer into the corner to hold it (more steering, more angle)
  - let go of the steering and the car straightens out by itself
  - steer the other way and it straightens out fast
  - more throttle adds angle and keeps your speed up

  A drift takes a 60 mph corner about as tightly as normal driving takes it at 50.
- **Getting it back**: when the slide comes back under a few degrees, the grip comes back fast and the car snaps straight. Usually that takes about half a second.
- **Mistakes still count**: with ASSISTS on SOME or FULL the car catches a slide that gets too deep, but you lose speed. With ASSISTS OFF nothing catches it. Full lock and the handbrake at 80 mph will spin you. Hitting things still hurts.
- **The two fridges still feel different**:
  - the Dorm turns in sharply, pushes wide if you stay on the gas at the limit, and its drifts are short flicks
  - the Kelvinaire is heavier and slower to turn, but it hangs the tail out on throttle and holds long, deep slides
- **Reverse with the automatic works now**: stop, keep holding brake, and it goes into R and backs up (up to about 20 mph). The gear shows R. Press gas to stop and go forward again. You never need manual just to reverse. Before this fix it would select R and rev the engine, and the wheels got nothing.
- **Sense of speed**:
  - The camera lens widens as you get onto the highway-speed end of things, and a little more when the car pulls hard.
  - The camera drops back when you accelerate and closes in when you brake. It looks further down the road at speed and leans a couple of degrees in hard corners.
  - Little reflective markers on the lane lines stream past.
  - Each pole you pass makes a whoosh on that side.
  - The wind gets louder the faster you go.
  - The speed blur is toned down from before.

### Weather

Every time you start driving the game rolls the weather (or pick one in SETTINGS, WEATHER). You can also change it live from the pause menu. It changes how the car drives, not just how things look.

- **CLEAR**: dry road, stars and the moon, full grip.
- **OVERCAST**: low cloud lit orange by the city, no stars, flatter light, a damp road. Almost full grip.
- **RAIN**:
  - rain falling around you (it leans with your speed) and splashes on the road
  - the road fully wet and mirroring the neon, spray off your tires
  - rain and tire hiss in the sound, lightning and thunder now and then
  - about 12% less grip and slightly wider corners. The car slides out a bit more easily, but it's still fun to drive.
- **HEAVY FOG**: the city closes in to about 80 meters. Fog banks drift past, your headlight beams show up in the haze, and the city sounds muffled. Somewhere off the waterfront a foghorn goes. A damp road with a little less grip.

The FREE ROAM panel in the top left shows the current weather.

### Settings (and what they do)

- **VIDEO OUTPUT**: the cable the picture goes out through.
  - COMPONENT: clean and sharp.
  - S-VIDEO (the default): slightly soft, the colors a bit softer still, faint scanlines.
  - COMPOSITE: the yellow plug. Colors smear to the right, edges ring, and saturated detail crawls.
- **RESOLUTION**:
  - 640 x 448 (the default) is exactly what a PS2 drew. In 16:9 those 640 columns get stretched wider, which is what PS2 widescreen did.
  - 360 LINES is crunchier, 720 LINES is sharper.
  - NATIVE uses your screen's real resolution with square pixels.
- **WIDTH**: 640, or 512 (SOFT). A lot of PS2 games only drew 512 pixels across and stretched them.
- **FIELD RENDER**: draws one interlaced field each frame (every other line, alternating). A still picture stays sharp; edges shimmer when things move. That's the famous PS2 jaggies. Turn it off for a steadier image.
- **PALETTE TEXTURES**: every texture gets cut down to 16 or 256 colors, the way PS2 art was stored. This one applies the next time you start the game.
- **WET STREETS**: the neon, the shop windows and the streetlights reflect in the road, with puddles. Turn it off first if the game runs slow.
- **PAINT REFLECTIONS**: the city's lights slide across the car paint as you drive past them.
- **ASPECT**: 16:9 widescreen, or 4:3 with black bars on the sides like an old TV.
- **TEXTURES**: SMOOTH or SHARP (blocky pixels).
- **16-BIT DITHER**: the faint dot pattern and color banding a PS2 picture had. Turn it off for a cleaner image.
- **FRAME BLEND**: the ghosting trail at high speed a lot of PS2 racers used.
- **VERTEX WOBBLE**: makes polygons jitter like a PS1. Off by default, since a PS2 didn't do this. It's there for the purists.
- **DRAW DISTANCE**: how far before the fog. NEAR runs faster on weak computers and phones. Heavy fog is always closer than this.
- **WEATHER**: RANDOM (the default, a new roll every time you start driving), CLEAR, OVERCAST, RAIN or HEAVY FOG.
- **FRAME RATE**: 60, or 30 like most PS2 racers that weren't Burnout.
- **Seven volume sliders**: master, engines, effects, environment, music, radio, menus. Music and radio don't do anything yet (stage 5).
- **TRANSMISSION**: auto or manual.
- **ASSISTS**:
  - FULL: traction control, ABS, the strongest slide catch, a touch more grip
  - SOME (the default): ABS, launch control from a stop, and the slide catch
  - OFF: none of it. The brakes can lock, the wheels can spin, and a slide that goes too deep becomes a spin.
  - The arcade steering and grip are part of how the game drives at every setting. ASSISTS only changes the safety net.
- **UNITS** (mph or km/h) and **CAMERA SHAKE**.

Settings save as soon as you change them.

### Saving

Everything saves by itself in your browser (the memory card icon in the top right blinks when a new record gets written): settings, which fridge and paint you picked, miles driven, top speed, crashes and best air time for each car. Check it under **RECORDS** on the main menu. The save survives a refresh. It's stored per browser, so your phone and your computer keep separate saves. Clearing your browser's site data erases it.

### If something goes wrong

- **The button isn't there**: the `racing/boot.js` line didn't make it into index.html, or the racing folder didn't upload. Check step 4 and step 5 above.
- **It sits on the loading card forever**: hard refresh. If it says WebGL is off, your browser has 3D graphics turned off (in Chrome: Settings, System, "use graphics acceleration when available").
- **No sound**: press a key or tap once on the title screen. Check the volume sliders and that the tab isn't muted.
- **Choppy on a phone or an old laptop**: in SETTINGS, turn WET STREETS and PAINT REFLECTIONS off first. If it's still slow, set DRAW DISTANCE to NEAR and RESOLUTION to 360 LINES.
- **The car is stuck or upside down**: press R (or pause, then RESET CAR).

### The HUD

It's drawn into the game's picture, at the same 640 x 448, before the picture goes out through the cable. It gets the same pixels, the same dither and the same color smear as the city, the way a PS2 HUD did. Switch VIDEO OUTPUT to COMPOSITE and watch the dial smear along with everything else.

- **Bottom right, the tach**:
  - a chrome dial with a needle and a segmented rev bar that lights up as the revs climb
  - the bar turns orange, then red, then flashes white near the limiter, and SHIFT blinks above it
  - the gear sits in the box under the needle. It jumps when you shift, and R turns pink
  - your speed is the digital readout to the left, with the unlit digits showing through like an old LCD
- **Bottom left, the minimap**: it turns with you. The red N rides around the frame, so you always know where north is. The tab on top shows the district and a clock that keeps running from 2:00.
- **Top left, FREE ROAM**: your top speed, best drift and biggest air this session.
- **Middle of the screen**: callouts (AIR), the drift meter while you're sideways, and the location card that types itself out when you arrive.
- **Bottom middle, button prompts**: the controls come up as little keycaps for a few seconds when you start driving.
- **Top right, the memory card**: a little card icon blinks with SAVING when you set a new record.

All the HUD text uses sprite fonts. Every letter is drawn once into a texture page when the game loads, with its gradient, outline and shadow baked in, then stamped and scaled, which is how PS2 games did text.

### The PS2 look (what's actually going on)

It isn't a filter. The renderer copies what the hardware did:

- **The picture**: 640 x 448 with non-square pixels, no anti-aliasing, drawn one interlaced field at a time and woven back together. Then a 16-bit framebuffer with the PS2's 4 x 4 dither pattern, and out through an emulated cable.
- **Textures**:
  - The city uses real photo textures now, cut down to what a 2004 artist would have shipped. The asphalt, sidewalks, brick, concrete, cobbles, grass, gravel, dirt, rusty metal, hazard stripes, warning signs and graffiti are all photos.
  - The tool that converts them (`tools/textures/build_textures.py` in the source zip) shrinks each photo to 64, 128 or 256 pixels. It sharpens it the way Photoshop would have, multiplies the shadows into the color, and darkens it for a city at night.
  - The game then cuts every texture down to 16 or 256 colors when it loads (that's PALETTE TEXTURES).
  - Building fronts are photo walls with the windows painted on top: some lit, some with blinds, the odd TV glow, and now and then somebody standing in one.
  - Mip levels (the smaller copies of each texture used far away) are picked mostly by distance, with no blending between them, like the PS2's graphics chip did it. That's the soft bands across the road and the shimmer far away.
- **Lighting**:
  - The city's lighting is baked into the vertex colors when it loads: streetlight pools, storefront spill, and the ground darkening next to walls.
  - The cars are lit per vertex. Each one picks up the streetlight it's under.
  - Their ambient occlusion was baked in Blender.
- **No real shadows**: the car gets a soft blob shadow on whatever is under it.
- **The 2004 night-racer tricks**:
  - big two-layer bloom
  - frame-blend motion blur
  - Burnout-style light trails off the lights above about 50 mph
  - star-filter halos on every streetlight
  - always-wet streets reflecting the neon
  - a tiny 32 pixel reflection of the city updated around the car, a sixth at a time

The cars were modeled in Blender: about 900 polygons each, real wheel arches, chrome bumpers, a grille and the compressor coils on the back.

### Credits

- **Textures**: ambientCG (ambientcg.com), released as CC0, which means free for anything and no credit is needed. They're credited here anyway.
- **Fonts**: Russo One, Rajdhani and Michroma, all under the SIL Open Font License, bundled through Fontsource.

### There are secrets

A few already, more every stage. One responds to the city's name. One of the league's drivers doesn't show up on a clear night.

### What's in, honestly

Built and working:
- **Racing**: three routes (two circuits, one sprint, one of them with a shortcut), 1 to 7 opponents, a grid, a real countdown, laps and lap times, positions, gaps, wrong way, finish, results, route and lap records, restart and quit
- **Race night dressing**: closed side streets, corner chevrons, start and finish gantries with working lights, a checkered line
- **Twenty league drivers**, each with a car, paint, story, look, style, strengths and weaknesses, eleven driving traits, rivalries, and their own lines for intros, passing, being passed, contact, winning, losing, grudges and respect
- **Opponent driving**: a racing line worked out for every route, braking and corner speeds planned from what's coming, following, passing, side by side, defending, mistakes (late brakes, wide exits, overcooking), planned drifts, reaction times, rain and fog effects, backing out when stuck, and a reset only when truly stuck. No rubber banding and no free places
- **Memory**: every driver remembers your record against them and your contact with them, between sessions. Grudges and respect change how they drive against you
- **Seven fridges**, four of them won by beating their owners
- **Rendering, textures, HUD, handling, weather, audio, menus, controls and saving** from stage 1, plus a race HUD, results, the league screen and garage locks. Opponents have their own synthesized engines in 3D, and the far ones go quiet to save the computer some work
- **Fixes in this stage**: the gap beside the overpass ramps where a car could get stuck now has barriers, and the ramp rails run all the way down. Resetting on the overpass no longer drops you inside it
- **Fixes after the first test footage**: the chase camera fell behind at speed and ended up on the roof of your own car past about 40 mph. It keeps its distance at any speed now. Off the line, opponents feather the throttle instead of spinning their wheels, and everyone holds their grid lane for the first stretch before merging onto the racing line, so the start doesn't stall behind one car. During the countdown the HUD shows your real grid position (it used to say last), and the drop onto the grid no longer pops up an AIR callout. Quitting a race from the pause menu no longer leaves the race HUD on top of the menus

Not perfect yet:
- The opening lap can still turn into some bumping (less than before), and an opponent sometimes runs wide out of a corner into a wall and loses ten seconds backing out. They do recover. In testing, about half the races on FIGURE CHILL had one driver who got stuck badly enough to need a reset. THE GRID and KWIK-CHILL RUN came out cleaner
- Opponents remember you, not each other. Rivalries between drivers are fixed in the roster, not earned
- Lap times are timed to the frame (a sixtieth of a second), shown to the thousandth

Not in yet:
- **Stage 3**: more districts, traffic you have to dodge, more routes, a season
- **Stage 4**: upgrades, tuning, money, the roguelite night run
- **Stage 5**: the radio station and music
- **Stage 6**: most of the secrets

Crashes make noise, sparks and shake, and they count in RECORDS. They don't damage the car yet (that comes with repairs in stage 4).

## COLD OPEN

A whole second robbery of the Fridge Palace, and this time you're on the floor with everyone else. Take too much off Three Cup Nicky and he makes a phone call. A couple of minutes later something hits you from behind. You wake up on the carpet in the dark while his crew and Clement rob the place and kill people. You can't stand. You crawl. A fridge wrapped in packing tape tells you where to go.

It plays like the hospital at the start of Metal Gear Solid V: you're helpless, you hide, you lie still among the dead, you get your body back a piece at a time, and then something worse than the robbers shows up.

This one is dark. People get executed in front of you, dragged across the floor, and worse. It's all fridges, but it doesn't play it for laughs.

### What's new in the folder

```
casino/wake/wake.js       new: your body (crawl, limp, walk, run), the man in tape, clement's cameras, getting spotted, dying, checkpoints, the trigger
casino/wake/story.js      new: the whole night, scene by scene, both endings
casino/wake/crew.js       new: nicky's crew: masks, flashlights, patrols, suspicion, searching, the fight
casino/wake/people.js     new: hostages, the dead, the hiding, the crowd, executions, dragging
casino/wake/fx.js         new: the new gore (drag smears, pulsing wounds, gutting, cracked screens, crushing, melting), fire, the dark, the drone
casino/wake/beasts.js     new: the two things you can't fight
casino/wake/after.js      new: what the palace looks like on the visits after
casino/wake/debug.js      new: the wakedebug view (type it to see what every guard is doing)
casino/main.js            changed: loads the new folder, new loading lines
casino/core/player.js     changed: the body can be held to a crawl or a limp, eye height can drop to the floor, you can crawl under tables
casino/core/engine.js     changed: slow motion (for when you get spotted)
casino/core/input.js      changed: the mouse lock no longer throws an error when the game asks for it without a click
casino/games/cups.js      changed: nicky notices when you win too much, packs up, makes the call
casino/games/bar.js       changed: gus can be held in place for the night
casino/games/hilo.js      changed: if lou didn't make it, somebody else deals his table
casino/games/cashier.js   changed: doug remembers what you did
casino/games/gus.js       changed: gus will talk about that night
casino/games/wheel.js     changed: the podium fridge can be reached by other code
casino/world/layout.js    changed: the front doors can be chained
casino/heist/heist-hud.js changed: on phones, DUCK goes flat during the cold open
casino/core/extras.js     changed: seven new secrets
```

`index.html` didn't change.

### Putting it on GitHub Pages

1. Repo root, **Add file**, **Upload files**.
2. Drag in the whole `casino` folder. It replaces the old one.
3. Before committing, scroll the upload list and find the new folder. You should see eight files that start with `casino/wake/`: `wake.js`, `story.js`, `crew.js`, `people.js`, `fx.js`, `beasts.js`, `after.js`, `debug.js`. If they show up without `casino/wake/` in front, the folder got flattened: cancel and drag the `casino` folder itself.
4. Commit. Wait for the green check in the **Actions** tab.
5. Hard refresh: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac). On a phone, close the tab and reopen it.
6. Saves carry over. The cold open saves into the same casino save (under `wake`).

**To check it worked without grinding Nicky:** open the casino and type `coldopen` on the keyboard (anywhere, no box to click). A toast says a payphone starts ringing, Nicky packs up his box and walks to the payphone, and a little over a minute later it starts. Trying to leave through the front doors makes it start sooner.

**To see what the guards are thinking:** once it's running, type `wakedebug` on the keyboard (same as `coldopen`, anywhere; computer only, since it needs a keyboard). Type it again to hide it. You get:

- a number and a state over every guard's head (`#2 route`, `#4 walk (hold)`, and so on). The number stays the same for the whole stage, so you can tell me "#3 did something weird" and I'll know exactly which one.
- a colored line on the floor showing where each one is walking next. Cyan is a patrol, white is a scripted walk, yellow is a guard coming to check on something, orange is the man in tape.
- a yellow line from a guard's head to whatever he's staring at.
- his suspicion number next to his state, from 0 (nothing) to 1 (he's got you).
- a panel in the top right with the stage, your position, and every guard listed. If a guard ever can't find a way to walk somewhere, it shows up at the bottom as `no path`.

**How the guards behave now (the sneaking part):**

- They stop and turn before they walk, speed up and slow down, and don't walk through tables, machines or walls.
- A guard in the middle of a scripted beat (the sweeper in the slots, the one checking the bodies, the one dragging Doug) **doesn't leave his beat**. If he catches a glimpse of you, he stops, stares at the spot with his light, and either finds you (the `!`) or loses interest and carries on exactly where he was.
- A patrol that sees something does it in steps you can read: `?` over his head, he stops, turns to the spot, waits a second, walks over slowly, stops a little short and shines his light on it. Then he sweeps left, right, left, says something like "nerves", and walks back to the exact point on his route he left.
- Nothing about where they walk is random anymore. Same stage, same moves, every time, so you can learn it.


### How it starts (for real)

- At Nicky's box (cup and ball, by the restrooms), either take **5,000 chips off him in one visit** or **win 5 in a row**. Nicky is easy on purpose. That's the hustle: he lets you win.
- If your save already shows you took 15,000 or more off him before this update, your first win next visit sets it off.
- He stops mid-game: "you're perfect." He packs up the box, walks to the payphone and makes a call you can overhear.
- From then you have about 80 seconds. The front doors are chained from outside. If you try them, it starts sooner.
- It won't start during the heist, the morning after the heist, or twice in one visit.

### Controls

| | computer | phone |
|---|---|---|
| look | mouse | right side of the screen |
| crawl, limp, walk | WASD | left thumb |
| run (only near the end) | Shift | push the stick all the way |
| go flat / get up | **Z** | **DUCK** |
| crouch (once you can stand) | **C** | (use DUCK to go flat instead) |
| use, talk, pick up | **E** | tap |
| dive away (when it says QUICK DIVE) | **Space** | tap the prompt or DUCK |
| spray freon | hold left mouse | FIRE |
| aim | right mouse | AIM |
| switch weapon | 1 revolver, 4 freon, or Q | SWAP |
| pick in a choice | 1 or 2 | tap |

### Your body

You start barely able to move, and you get it back as the night goes on:

1. **Locked:** you can only look around. You're on your back on the carpet.
2. **Crawling:** flat on the floor, slow, your hands reaching out in front of you. You can crawl under tables.
3. **Limping:** you can stand up, bent over, slow, with one leg dragging. You can still go flat with Z.
4. **Walking:** still no running.
5. **Running:** only when something is chasing you.

### Staying alive

- **The crew** wear knit masks and carry flashlights taped to their guns. You can see the beam and the pool of light it throws on the floor.
- **A white ? over a head** means one of them noticed something. He walks over to look. Get out of sight and lie still and he gives up.
- **A red ! means he found you.** Time slows way down for about a second (**REFLEX**). If you break his line of sight in that second (behind a slot machine, behind a pillar, flat behind a table), he loses you. If not, you're dead.
- **What makes you easier to see:** standing, moving, running (running is loud, people hear it), being inside a flashlight beam, being close.
- **What hides you:** lying flat, not moving, slot machines and pillars between you and them, being under a table (nobody finds you under a table unless they're checking that table), and lying among the bodies without moving (you're one of them).
- **HOLD STILL:** when you're flat and someone's looking around, a bar appears at the bottom of the screen. It fills while you don't move. Moving the mouse counts as moving. Full means you're as invisible as you're going to get.
- **Clement's cameras:** red lights on the pillars, each with a red spot on the floor where it's looking. If one watches you for about a second, Clement calls out where you are over the PA and the nearest crew member comes to check.
- **The searchlight** in the lobby comes from a van outside the front doors and sweeps back and forth through the glass. Wait for it to pass.

### Checkpoints

If you die, **TRY AGAIN** puts you back at the last one:
the floor · the slots · the box · the bar · the pile · the gold fridge · the fire · the staff room · then either the hallway and the alley, or the floor, the cage and the vault.

**GIVE UP** walks you out of the casino. The night still counts as having happened.

### The night (spoiler-light)

1. You wake up in a pile of bodies by the bar and watch something you can't stop.
2. The man in tape gets you crawling. A guard walks past with a light and you have to not move.
3. The slot rows: someone is checking every row for people hiding. Keep a row of machines between you and him. The man in tape tells you when to move.
4. Nicky's box: you get up.
5. The lobby: the people at the front doors don't get out. The searchlight starts sweeping. Get from the wheel to the pillar to the podium.
6. The bar: someone's hiding behind it. Then someone comes to check the bodies, one at a time. Play dead.
7. Something on the podium wakes up. When it comes at you, **dive**.
8. Something worse comes out of it. Run for the staff door in the north-west corner.
9. The staff room: wake the night guard (he slept through the last robbery too), get the freon, put out the fire, and then you choose.

### The two endings

- **GET OUT:** the loading door behind the race screen, and an escape ride through the alley behind the casino. You ride backwards on one of the race fridges. When the thing chasing you lifts its arms, hit it with freon before it finishes. At the end, look at what's left behind.
- **GO BACK:** the night guard lends you his revolver (he's never fired it). Flip the breaker to blind Clement's cameras, then deal with the crew on the floor (freon freezes them solid; frozen ones stay frozen; a bullet shatters a frozen one). Get Doug out of the cage. Nicky is waiting in front of the vault with one last game. Then Clement.

### After that night

On the visits after:
- If someone didn't make it, it shows. Some tables have candles. Some staff are new hires.
- The podium is empty and burned for one visit. Then the gold fridge is back like nothing happened. Stand near it for a while.
- Tape footprints lead from the staff room to the painted-on restroom door.
- The carpet has been cleaned. Mostly.
- Nicky's box is closed for a while, and how long depends on the ending. Then he's back. He's still easy. It can happen again.
- Gus has something to say about it. So does Doug, if he's still Doug.

### Seven new secrets

Hints in the pause menu (all but the first only show up after your first night):
- Take too much off the man with the cups. He'll notice. Then he'll make a call.
- Crawl through the slot rows without anyone wondering about you.
- When the prize comes for you, move the first time.
- The man in tape leaves something behind. Look at it.
- His last game has the same trick as all the others.
- Go back for them and don't break anybody. Frozen is enough.
- There are two ways out of the staff room. Take both, on different nights.


### If something goes wrong

- **It never starts:** you need to win at Nicky's box, and the heist can't be in progress. Typing `coldopen` skips the requirement.
- **Stuck somewhere with nothing happening:** the man in tape waits for you if you fall more than a few steps behind. Get closer to him. The objective in the top left says what's next.
- **It's too dark to see:** turn graphics up to medium or high in the pause menu (that turns on the flashlight in the last part), or turn your screen brightness up. It's supposed to be dark, but you should always be able to see the crew's flashlights.

## Scratch offs, cup and ball, big shots, random events, and gus

Five new things in the casino. None of them change how the old games play.

### What's new in the folder

```
casino/games/scratch.js     new: the scratch-o-matic machine and every ticket
casino/games/cups.js        new: three cup nicky's cup and ball game
casino/games/events.js      new: random events and the big shot visitors
casino/games/gus.js         new: the conversations with gus
casino/games/bar.js         changed: gus talks for real now, happy hour prices
casino/main.js              changed: loads the three new modules (gus loads through the bar)
casino/npc/npcs.js          changed: guests crowd the bar at happy hour and watch nicky
casino/eggs/eggs.js         changed: the breaker switch and the power flicker can't fight; the breaker now gets the room properly dark
casino/heist/heist.js       changed: nicky's box has a chip tray to grab during the job
casino/core/extras.js       changed: eight new secrets, two new map labels
casino/boot.js              changed: new loading screen tips
casino/casino.css           changed: styles for the tickets and the gus window
```

`index.html` didn't change.

### Putting it on GitHub Pages

1. Repo root, **Add file**, **Upload files**.
2. Drag in the whole `casino` folder (it replaces the old one).
3. Before committing, scroll the upload list and check these four show up with `casino/games/` in front of them: `casino/games/scratch.js`, `casino/games/cups.js`, `casino/games/events.js`, `casino/games/gus.js`. If any of them shows up as just the file name with nothing in front, the folder got flattened: cancel and drag the folder itself, not what's inside it.
4. Commit. Wait for the green check in the **Actions** tab.
5. Hard refresh: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac). On a phone, close the tab and reopen it.
6. Saves carry over. Everything new saves into the same casino save as before.

**To check it worked:** open the casino and press Esc. The map should show two new labels: SCRATCH (by the front doors) and CUPS (by the restrooms). The secrets list should have eight more entries than before.

### The scratch-o-matic

**Where:** the red vending machine against the front wall, a few steps left of the doors as you walk in. Yellow "scratch-o-matic" neon on top, chasing bulbs.

**How to play:**
1. Walk up and press **E** (tap on a phone): **buy scratch offs**.
2. Pick a ticket. Each one shows its price, how often it wins anything and the most it can pay.
   - **Lucky Coils** · 10 chips. Nine squares. Three matching symbols win that symbol's prize (the legend is printed on the ticket).
   - **Freezer Burn** · 50 chips. Two winning numbers and eight of yours. Any of your numbers that matches wins the prize printed under it. A snowflake wins its prize on the spot.
   - **Cold Hard Cash** · 250 chips. Twelve squares and a prize box. Three gold bars win whatever is in the box.
3. Scratch: click and drag over the silver (on a phone, drag your finger). Once most of a square is scratched, the rest of it clears itself.
4. Too lazy? **SCRATCH ALL** clears the whole ticket.
5. **ANOTHER** buys the same ticket again. **BACK** goes to the menu.

Things to know:
- Every ticket is decided the moment it drops out of the machine. The art is drawn to match. Scratching slower doesn't help, and scratching harder doesn't either.
- If you close the window before finishing, the machine scratches it for you and pays you if it won.
- They pay back about 75% on average, like real scratch tickets. They are not a good investment. They are fun.
- A big win makes the machine flash and the room cheer. The machine's window brags about your biggest recent win.

### Cup and ball (three cup nicky)

**Where:** west side of the floor, right in front of the painted restroom doors, past the slots. A small black fridge in a red beanie standing on a milk crate behind a cardboard box. The box says he isn't affiliated with the palace. He shouts at you when you walk by.

**How to play:**
1. Walk up and press **E**: **play cup and ball**.
2. Pick a chip, press **+ BET** (10 to 1,000). **SAME AGAIN** repeats your last bet.
3. Press **PLAY** (or Space). Nicky lifts a cup to show you the ball, then shuffles.
4. When he stops, pick the cup: **LEFT / MIDDLE / RIGHT** buttons, keys **A S D** or **1 2 3**, or click (tap) the cup itself.
5. Right cup: he pays even money (bet 100, get 200 back). Then pick **LET IT RIDE** (key R) to bet the whole win again, or **TAKE IT**.
6. Wrong cup: he shows you where it was.

Things to know:
- The shuffle is real. If you can follow the ball, you win.
- Every win in a row makes him faster, with more swaps and some fake moves. Bets of 400 or more get the fast hands right away. The SPEED meter in the panel shows how fast he's going.
- Nicky is a hustler. On bigger bets he sometimes cheats. When he does, the ball is under no cup at all.
- **CALL HIM OUT** (key C) instead of picking, if you think he cheated. Right: he pays four times your bet to keep you quiet and plays clean for a while. Wrong: you lose the bet, he gets offended and won't play with you for a bit.
- Gus knows something about how to catch him. Ask him.

### Random events

Every couple of minutes, something happens on its own. A voice on the PA announces most of them. Only one of each kind runs at a time, and none of them happen during the heist or the morning after it.

- **Happy hour:** two minutes of half price drinks at the bar. Guests rush the bar too.
- **Power flicker:** the lights stutter and the whole palace goes dark for a few seconds. Every fridge face keeps glowing. If you've been downstairs, the dark might say something.
- **Wedding party:** a bride (veil, crown, tin cans dragging behind her), a groom in a top hat and three guests in party hats walk in. They stop at the podium for photos, then take over the bar for a while. Talk to the bride.
- **Pickpocket:** somebody in a beanie bumps into you and takes some of your chips. He runs for the front doors with a red arrow over his head. Catch him before he gets out: run up and press **E** to grab him. You get your chips back plus a little of everyone else's. He only shows up while you're walking around with at least 200 chips.
- **Dropped chips:** you hear chips hit the floor somewhere close. A little stack with a glint is lying on the carpet. Find it before somebody else does.
- **Somebody hits a slot:** a guest at a slot machine wins big. Confetti, cheering, the whole thing.

### The big shots

Sometimes a big shot walks in the front doors with company and tours the floor for a few minutes, then leaves. One at a time.

- **THE WHALE:** a huge gold fridge in a crown and sunglasses with two bodyguards named LEFT and RIGHT. Every so often he throws chips in the air. Stand close when he does and some of them land on you. Talk to him. The bodyguards don't want to talk.
- **DIAMOND DOLORES:** a pink retro fridge in a crown, with a tiny fridge dog named PRINCESS trotting behind her. She bets huge on red at the roulette tables and the whole room watches. Princess can be pet.
- **THE PROFESSOR:** a quiet gray fridge in a bowtie who parks himself at the blackjack tables. Talk to him and he teaches you something true about the games in here. A couple of minutes later the pit boss throws him out for counting cards.

### Gus, the bartender

Gus talks for real now. At the bar, press **E** (**order a drink or talk to GUS**), then **TALK TO GUS**.

- You pick what to say from a list. Number keys **1 to 9** pick an option on a computer. Click his line to skip the typing.
- He remembers you between visits: how often you come by, whether you tip, which stories he's told you, what you've asked about.
- The line at the top says what he thinks of you: a stranger, a regular, a friend, or family. It goes up a bit each visit you talk to him and when you tip. Asking for coolant does not help.
- **tell me about yourself** tells his stories in order, one at a time.
- **what do you know about...** lists people and places. The list grows as you find things in the casino (and downstairs). A dot means he hasn't told you about that one yet. Some have a follow-up question.
- **got any advice?** changes with what you've been doing tonight.
- **let me leave you a tip** takes 10, 50, 250 or 1,000 chips. Big tips get you a rumor about a secret you haven't found yet.
- He comments on how your night is going, on happy hour, on whichever big shot is in the building, on the wedding party.
- Once he thinks of you as family, **the usual, gus** gets you a free drink once per visit.

### Eight new secrets

Hints in the pause menu:
- Nicky's cups are honest. Nicky isn't always.
- The scratch machine has a heart. Lose to it enough and find out.
- The scratch machine prints one ticket it isn't supposed to.
- Gus has four words for you. Earn the last one.
- Somebody in a beanie is faster than you think. You're faster than he thinks.
- The whale tips people who sit through the stories.
- Dolores never goes anywhere alone. Say hi to her date.
- The professor teaches until security cancels class. Take three lessons.

### Also fixed while I was in there

- Flipping the main breaker in the staff hallway (an older secret) only turned off the lamps, so the room stayed mostly lit. It goes properly dark now.

### Heist notes

- During the heist, Nicky puts his hands up with the rest of the staff, and his box has a chip tray to grab.
- The morning after the robbery, Nicky's box is still there with a sign on it. He isn't.
- Big shots, the wedding party and the other events clear out the moment the heist starts.

## Higher or lower

A new table in the casino. Lucky Lou deals it. He sweats.

### Where it is

East side of the table pit, against the east wall, just past the Hold'em table. Look for the pink "Higher or Lower" neon and the gold-framed board above the dealer. It's on the pause menu map as HI-LO.

### What's new in the folder

```
casino/games/hilo.js        new: the table, the deck, lucky lou, the odds, the board
casino/main.js              changed: loads the new table
casino/boot.js              changed: one new loading screen tip
casino/casino.css           changed: subtitles move to the top while any game panel is open
casino/core/extras.js       changed: two new secrets, the table on the map
casino/world/cards.js       changed: cards a touch under pure white so bloom stops washing them out (every table)
casino/npc/npcs.js          changed: guests stand around and watch this table too
casino/heist/heist.js       changed: lou's table has a chip tray to grab during the job
casino/heist/aftermath.js   changed: the table is taped off after the robbery like the others; one security guard moved out of the way
casino/heist/combat.js      changed: a rare guard bullet could throw an error mid-heist; it can't anymore
```

`index.html` didn't change.

### Putting it on GitHub Pages

1. Repo root, **Add file**, **Upload files**.
2. Drag in the whole `casino` folder (it replaces the old one).
3. Before committing, scroll the upload list and look for `casino/games/hilo.js`. If it shows up as just `hilo.js` with nothing in front, the folder got flattened: cancel and drag the folder itself, not what's inside it.
4. Commit. Wait for the green check in the **Actions** tab.
5. Hard refresh: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac). On a phone, close the tab and reopen it.
6. Saves carry over. The table's stats live in the casino save next to everything else.

**To check it worked:** open the casino, walk to the east wall past Hold'em and look for the pink sign. Or press Esc: the map shows HI-LO.

### How it plays

1. Walk up to the stool and press **E** (tap on a phone).
2. Pick a chip, press **+ STAKE** until you like the number (5 to 1,000). **SAME AGAIN** repeats your last stake.
3. Press **DEAL** (or Space). Lou shuffles a fresh deck: 52 cards and one joker. The first card goes face up.
4. Call the next card: **HIGHER**, **LOWER** or **SAME**.
   - Under each button: the multiplier you'd get and your real chance, worked out from the cards still in the deck. Lou takes a 4% cut off every multiplier. The safe call pays a little. The brave call pays a lot.
   - The line under the buttons counts what's left: how many cards are higher, how many are the same, how many are lower, and whether the joker is still in there.
5. Right call: the pot multiplies and you call again. Wrong call: the pot is gone.
6. **CASH OUT** whenever you want. The pot goes to your wallet.

Rules:
- Aces are high, twos are low.
- A tie loses, unless you called SAME.
- The joker counts as a win no matter what you called, and gives the pot a little bonus on top.
- Ten right calls in a row runs the table: the pot gets ×1.5 and the room goes off.
- The table pays up to 100,000. Hit that and Lou cashes you out himself.
- Standing up in the middle of a run takes the pot with you (it counts as cashing out).
- If the whole deck runs out, Lou pays you and goes to get a towel.

Keys while seated (computer): **W** or **↑** higher · **S** or **↓** lower · **Q** same · **Space** deals, and cashes out mid-run · **Esc** stands up.

### Extras

- The board above Lou shows the pot, a light for every right call (they go red near the end), your best streak and your biggest pot.
- Lou reacts: he's smug when you take the obvious call, shocked when you win against the odds, and he starts sweating actual drops once the pot gets big.
- At five in a row people come over to watch. At eight Lou starts begging. Guests wander over to watch the table even when you're not playing.
- During the heist, Lou puts his hands up like the rest of the staff, and his table has a chip tray worth grabbing.
- After the robbery, the table is taped off with the others for a visit.

### Two new secrets

Hints in the pause menu:
- Lou has a button nobody presses. Press it right three times in one run.
- Lou has a light for every right call. Light all of them.

### Also fixed while I was in there

- Cards on every table were so white they bloomed out on high graphics. You can read them now.
- With a game panel open, the subtitles used to sit behind the panel. They move to the top of the screen now.
- Once in a long while, a security guard's stray bullet hitting the wrong thing threw an error during the heist. The game catches it now and keeps going.

## Bug hunt and speed pass

No new files this round. A lot of existing ones changed, mostly inside `casino`.

### What changed

```
index.html                  main page: short screens, sideways phones, a few small bugs
market/market.css           the exchange on narrow phones
fishing/fishing.js          the fishing panels on narrow phones
casino/boot.js              the wanted poster upstairs
casino/main.js              shaders compile against the right target at load
casino/casino.css           layer order on phones
casino/core/                engine (post chain, resolution), player (collisions), hud, extras
casino/world/               fridge.js (how every fridge is built), cards.js
casino/games/               bar, blackjack, roulette, slots, wheel
casino/npc/npcs.js          guest pathfinding, memory cleanup
casino/eggs/eggs.js         a new secret
casino/heist/               most files
```

### Putting it on GitHub Pages

1. Repo root, **Add file**, **Upload files**.
2. Drag in `index.html` and the `casino`, `market` and `fishing` folders. The folders replace the old ones; nothing gets deleted.
3. Before committing, scroll the upload list and check the paths. You should see things like `casino/heist/nav.js`, `casino/world/fridge.js`, `market/market.css`, `fishing/fishing.js`. If `nav.js` shows up without `casino/heist/` in front, the folder got flattened: cancel and drag the folders themselves, not their contents.
4. If GitHub refuses that many files at once, split it: `casino` in one commit, then `index.html`, `market` and `fishing` in a second.
5. Commit. Wait for the green check in the **Actions** tab (a minute or two).
6. Hard refresh the site: Ctrl+Shift+R on Windows/Linux, Cmd+Shift+R on a Mac. On a phone, close the tab and open it again (or clear the site's cache) because phones hold on to old JavaScript.
7. Saves are untouched. Chips, heist progress, heat, fish and the exchange all carry over.

**To check it worked:** on a computer, open the casino and press Esc. At the bottom of the secrets list there are two new ??? entries ("gus has a favorite customer" and "the neon does, twice a day"). On a phone, start the heist and tap FIRE: if the gun fires, the phone fixes are in.

### Bugs fixed

**On phones**
- During the heist, FIRE, AIM, RLD, SWAP, DUCK, YELL and HEAL couldn't be tapped. The invisible move/look areas sat on top of them. Same for the heist's answer buttons and the "try again" card. All tappable now.
- The phone buttons step out of the way while an answer or a card is on screen.
- Cards and Clement's duffel scroll on short screens (phones held sideways), so the buttons at the bottom are always reachable. Same for the cards in the escape on the main page.
- The exchange's close button (X) fell off the right edge of narrow phones. The timeframe buttons were too small to hit.
- In fishing, the cooler/fishdex/tackle panels covered the location and bait pickers on narrow phones.
- On narrow phones the heist screen stacks the fear meter, the objectives and the subtitles instead of piling them on top of each other, and USE sits above the ammo count instead of under it.
- Main page held sideways: the right column covered the grey box. The paint size slider was a thin sliver to tap.

**On computers**
- Short browser windows (under about 700px tall): with the shop open, the bottom buttons in the left column slid under the music player and couldn't be clicked. The column scrolls now.
- Every clickable thing on the main page, the exchange, fishing, the basement and every casino menu was checked at up to 15 screen sizes, from a 320px phone to an ultrawide monitor.

**In the casino and the heist**
- Switching guns in the middle of a shotgun pump threw an error every frame until you switched back.
- Heat mode: dying during the crew betrayal sent you back into Clement's gold plate fight, with your crew member wearing the plates. A retry now puts you back in the right fight.
- Photo mode during the job wiped the heist's color grading when you left it.
- In photo mode with Clement's guns in your bag, pressing 1 to 6 for a filter also drew a gun (which starts the robbery), and clicking the photo buttons fired it. Number keys also drew guns while you were picking a dialogue answer.
- Dying and then leaving through the pause menu skipped the walk-away rules (the fine, the story reset). The pause menu says WALK AWAY there now and does the same thing as the card.
- Esc during a slot spin (or an auto-spin run) only cancelled the auto-spin, so getting up took several tries. Now you stand up as soon as the reels stop.
- The lucky wheel had no way out once you sat down. Esc (or the back button) now gets you up, and a paid spin you didn't take gets refunded.
- The chandelier now flattens guests and staff standing under it, not just cops.
- Clement retried an impossible path every single frame when he couldn't reach a spot (a CPU spike).
- Retrying from the drill checkpoint replayed waves you'd already beaten, and the vault had no checkpoint of its own. Both fixed. Clement's door at the very end no longer freezes in midair.
- The vault gold looked like cardboard on low graphics. It's gold.
- Memory leaks: every guest who left, every enemy body that got cleaned up and every chip stack taken off a table kept its graphics memory forever. Long sessions slowly got heavier. They give it back now.

**On the main page**
- Resizing the window erased the dried blood (it's supposed to be permanent).
- The ragdoll guy stayed where the old window edge was after a resize. He follows the corner now.
- A few sounds threw errors in the console when the browser blocked autoplay.

### Faster

Measured in the casino at 1280x720. A draw call is one "draw this" message to the graphics card; fewer of them is the biggest single thing that makes a 3D page smoother on weaker computers and phones.

| | before | after |
|---|---|---|
| draw calls, standing in the lobby | 811 | about 430 |
| draw calls, at the tables | 413 | about 210 |
| draw calls, mid-firefight in the heist | 563 | about 340 |
| shaders built at load | 56 | 41 |
| shaders built mid-heist (stutter) | up to 11 | 0 |
| graphics memory: separate shapes held | 661 | 365 |
| enemy pathfinding | 1x | about 3.5x faster |
| line of sight checks | 1x | about 3.7x faster |
| enemy map rebuild when the gate blows | full rebuild (about 100ms freeze) | only what changed (a few ms) |

How:
- Every fridge in the building (guests, staff, dealers, cops, Clement) used to be a dozen separate pieces for the graphics card. Now it's four: body, two arms, face. The table rails, roulette wheels, chip trays and slot levers got the same treatment.
- Shaders used to compile twice: once at load for the wrong target, again on the first frame. Now once, at load, for the right one. The guns in your hands compile at load too.
- One full-screen pass is gone (the color finishing step was folded into the last effect, same picture).
- Retina and 4K screens: the game caps how many pixels it draws per frame instead of drawing 8 million.
- On "auto" graphics, if the game is still slow at its lowest resolution, it steps the effects down on its own: lighter edge smoothing first, then no edge smoothing and no bloom.
- Guest faces only redraw when their expression actually changes.
- Bullet holes and scorch marks stop re-uploading every frame once they've landed.
- The vault room isn't drawn until the door opens.
- Pathfinding, line of sight and collisions stopped creating garbage every call.

### New secrets

Seven more, hints in the pause menu once they're unlocked (no spoilers here either):
- Gus has a favorite customer. It's whoever orders the free thing, again and again.
- Casinos don't have clocks. The neon does, twice a day.
- One man sleeps through the whole robbery. Make some noise near him.
- Somebody in the wall has been waiting for an excuse.
- Clement wears six pieces of gold. Take every one.
- The vault keeps one box with a familiar number on it.
- Upstairs they put your face on the wall. It's only taped up.

### Also new

- On a phone, drag your thumb on FIRE to aim while you shoot.

## Phone layout fix

Two files: `index.html` and `casino/boot.js`. Upload both (drag `boot.js` into the `casino` folder on GitHub, or drag the whole `casino` folder again).
- With the panels open (≡ button), the page dims and the panels sit in two columns: buttons on the left, roulette and paint on the right, the grey box under the left column, the music player along the bottom. Nothing overlaps; a column too tall for the screen scrolls on its own.
- Phones held sideways get shorter columns and a smaller music player.
- The "[click me]" tag next to the ragdoll is gone on phones (it kept landing on his name).
- The casino button keeps its red and gold look before the casino has ever been opened.

## THE FRIDGE PALACE JOB: the heist

A first person shooter built into the casino. Clement, a rusty fridge in a long coat, stands by the painted-on restroom doors (west wall). Talk to him, take his duffel, draw a gun whenever you want, and rob the place. It ends with you running out the front doors and onto the main page.

### What's new in the folder

```
casino/
  heist/                    everything for the robbery (18 files, new)
    heist.js                runs the story and heat mode, your coolant, the bag, checkpoints, the escape handoff
    clement.js              clement: his model, every line he says, following you, helping you, the boss fight
    weapons.js              the guns in your hands: drawing, aiming, recoil, sway, reloads, muzzle flash, shells
    guns.js                 the four gun models and their stats
    combat.js               who got hit: bullets against walls (they know how tall they are), fridges, glass, everything
    enemies.js              guards, cops, mini fridge rushers, swat with door shields, the walk-in freezer
    crowd.js                everybody get down: guests on the floor, staff hands up, the fear meter, robbing people
    vault.js                the cage gate, the charge, the drill, the vault room, the slam, the hinges
    destruct.js             slot machines, glass doors, CO2 tanks, video walls, the aquarium, the chandelier, the sign
    gore.js                 what comes out of a shot fridge: food, sauce, puddles, coolant, sparks, bullet holes, brass
    loot.js                 ammo, cold packs, chips and gold bars on the floor
    nav.js                  how enemies find their way around and pick cover
    heist-audio.js          gunshots, impacts, the alarm, sirens, screaming, the drill, the score (all synthesized)
    heist-hud.js            the screen during the job, plus the phone buttons
    heist.css               its styles
    aftermath.js            what the casino looks like on the visits after
    heat.js                 heat mode: the payphone and the crew
    escape2d.js             the escape onto the main page
  main.js, boot.js, core/*, world/*, games/*, npc/*, eggs/*   changed (hooks for the heist)
market/engine.js            changed: the exchange reacts to the robbery
```

### Putting it on GitHub Pages

1. Repo root, **Add file**, **Upload files**.
2. Drag in the whole `casino` folder again (it replaces the old one; the new `heist` folder inside comes along). Also drag in the `market` folder.
3. Check the upload list before committing. You should see `casino/heist/heist.js`, `casino/heist/escape2d.js` and `market/engine.js` among the paths. If `heist.js` shows up without `casino/heist/` in front, the folder got flattened; cancel and drag the folder itself.
4. The casino folder is now 66 files. If GitHub's uploader refuses that many at once, do it in two commits: `casino/heist` first, then the rest of `casino` plus `market`.
5. Commit, wait for the green check in **Actions**, hard refresh (Ctrl+Shift+R / Cmd+Shift+R).
6. `index.html` didn't change this round. Your fridge PNGs don't change either.
7. To test: open the casino (`?casino=1` opens it on load), walk left from the doors to the west wall between the FRIDGES and FREEZERS doors, and talk to Clement.

**If something breaks:** the casino keeps running if the heist fails to load (you just won't see Clement). Open the browser console (F12) and look for a red line mentioning `heist`. A missing file in `casino/heist/` is the usual cause.

### Controls during the job

**Computer**
- **1 2 3** (and **4** once you have it): draw a gun. Drawing a gun starts the job.
- **Left click** fire · **right click** aim down the sights · **R** reload · **Q** last gun · **H** holster · mouse wheel cycles guns
- **C** or **Ctrl**: duck (enemies have a harder time hitting you behind waist-high cover)
- **F**: yell. Keeps the room scared.
- **G**: use a cold pack (heals)
- **E**: rob the fridge you're looking at, grab things, kick the drill
- **V**: look at your gun
- **Esc**: pause. During the job the pause menu's leave button becomes ABANDON THE JOB.

**Phone**: a FIRE button, AIM (toggle), RLD, SWAP (also draws your first gun), DUCK, YELL and HEAL appear on the right during the job. The left thumb stick still walks. Tap people on the floor to rob them.

### The guns

- **COLD SHOULDER** (.357 revolver): six shots, hits hard, a face-screen hit does double.
- **ICEBREAKER** (12 gauge pump): nine pellets, pump after every shot, loads one shell at a time (you can fire mid-reload).
- **LITTLE CHILL** (9mm smg): thirty rounds, fast, climbs when you hold it.
- **THE FREON CANNON** (Gus's R-12 thrower): you find it partway through. Hold fire to spray freezing gas. Anything frozen solid shatters when you shoot it. The tank refills when you stop spraying.

Ammo, cold packs and chips drop from the people you put down. Walk over them.

### How the job goes (spoiler-light)

1. Talk to Clement, say you're in, take the duffel. He follows you around. Play the casino as long as you like.
2. Draw a gun anywhere and the job starts. The band stops. Everybody hits the carpet.
3. While it's quiet: rob the guests on the floor (each one has something, some have more than chips), make Doug fill a bag at the cage, grab the chip trays off the tables. Keep the room scared with yells, warning shots and pointing your gun at people. Let the fear run out and somebody runs for the panic button.
4. Security shows up. Then the cage gate. Then the vault. The drill jams; go kick it.
5. Grab what you can carry. The heavier the bag, the slower you walk.
6. You can probably guess what Clement does next.
7. The fight against Clement has three parts. Pay attention to what's hanging over the lobby.
8. Get out the front door.

There are checkpoints. If you die ("DEFROSTED"), you can retry from the last one, or walk away (you lose 10% of your chips and the job resets for a later visit).

### The escape (on the main page)

When you run through the front doors, the casino's last frame cracks and falls onto your fridges as real pieces of glass. You're a fridge in a ski mask with a money bag, in 2D, on the actual page.
- **A / D** move, **W** or **Space** jump, **mouse** aims, **click** shoots, **R** reloads, **1 2 3 4** or **Q** switches guns.
- Phone: ◀ ▶ JUMP SWAP buttons, tap anywhere to shoot there.
- Cop fridges drop from the top of the screen on parachutes. Later, something with rotors.
- Hold out until the van shows up, then run off the right edge of the screen.
- Your bullets go into the page itself: the buttons, the counter, the sign, the music player. Some of those react. One thing on the page can't be shot.
- If the vendor likes you enough, there's another way out.
- Get caught ("BUSTED") and you can retry the escape, or give up and lose the bag.
- Make it out and the whole bag lands on your counter as fridges (some fall from the sky). Bullet holes stay on the page until you reload it.

### After the job

The casino changes over your next few visits: a crime scene first, then repairs, then a reopening with a lot more security, then a party. One mark from that night stays forever. The guests talk about it. The fridge exchange reacts to the robbery (watch NEON). A wanted poster stays on the main page while the heat is on; heat cools off one star per real day.

### Heat mode

After the story, a payphone rings where Clement used to stand (once the casino has reopened). Pick a crew member: each one changes the run and takes a cut, and some of them turn on you. Every run raises the heat: more cops, tougher gear, a bigger vault, a bigger payout.

### Saved data

Heist progress lives in the casino's save (`fridgepalace_v1`, under `heist`): story progress, which visit you robbed it on (that drives the rebuild), total stolen, heat, your bullet holes from the last job, and a few flags. To replay the story from scratch, run this in the browser console: `s=JSON.parse(localStorage.fridgepalace_v1); delete s.heist; localStorage.fridgepalace_v1=JSON.stringify(s)`.

### Performance

The job adds enemies, particles and a second render pass for the gun in your hands. Shaders for all of it compile on the loading screen, so the first firefight doesn't stutter. Phones get fewer particles, fewer enemies at once and no flashlight. The automatic resolution drop from the casino still applies.

## FRIDGE PALACE: the casino

### What's in the folder

```
casino/
  boot.js                   adds the "fridge casino" button; nothing 3D loads until it's pressed
  main.js                   starts everything, runs the frame loop, handles sitting down and leaving
  casino.css                every screen, panel, menu and button inside the casino
  lib/
    three.module.min.js     the 3D engine (three.js r170), saved in your repo so it never depends on another site
    THREE-LICENSE.txt       three.js is MIT licensed; keep this file next to it
    addons/                 the extra three.js pieces: bloom, rounded boxes, reflections, geometry merging
  core/
    engine.js               renderer, bloom, the drunk / vignette / film grain pass, quality presets, auto resolution
    input.js                keyboard + mouse look, and the phone controls (stick, look, USE, pause)
    player.js               walking, collision with walls and furniture, head bob, footsteps, the seat camera
    hud.js                  chip counter, prompts, toasts, the pause menu, settings
    audio.js                every sound effect, synthesized, plus the crowd murmur and 3D positioning
    music.js                the house band: 32 bars of lounge jazz written and performed in code
    save.js                 your chips and stats
    fx.js                   coin showers and confetti
    extras.js               photo mode, the floor map, the secrets list
    util.js                 tweens, timers, the fair random numbers every game pays out on
  world/
    layout.js               the building: floors, walls, the dome, columns, lights, neon, the lobby, the club
    textures.js             carpet, marble, wood, damask, ceiling, signs, the logo: all painted in code
    materials.js            gold, chrome, felt, leather, glass
    fridge.js               the fridge people: bodies, faces that blink and talk, arms, hats, bow ties
    props.js                stools, chairs, couches, plants, ropes, chandeliers
    cards.js                the deck (court cards are fridges in hats) and real-size chips
    signs.js                neon signs and the video walls
  games/
    cashier.js              the cage, the tellers, the club membership, the bouncer
    bar.js                  the freezer bar, the aquarium, GUS the bartender, drinks
    slots.js                35 slot machines
    slots-themes.js         the reels, paytables and symbol art for all five slot themes
    blackjack.js            three blackjack tables (one in the club), the pit boss
    roulette.js             single zero on the floor, double zero in the club
    poker.js                no limit hold'em against fridge regulars
    poker-eval.js           the poker hand math
    wheel.js                the lucky wheel and the podium fridge
    racing.js               the inside track: fridges racing on a big screen
  npc/
    npcs.js                 the crowd: walking, sitting at machines, drinking, cheering
    dialogue.js             what the crowd says
  eggs/
    eggs.js                 secrets
```

Everything in the casino is built from code: models, textures, sounds and music. The only outside download is two Google Fonts (Cinzel and Pacifico). If those are blocked, it falls back to Georgia and nothing breaks.

### Putting it on GitHub Pages

1. Back up your current `index.html` (click it in the repo, three dots top right, **Download**).
2. Repo root, **Add file**, **Upload files**.
3. Drag in the new `index.html` and the whole `casino` folder. Drag the folder itself, not the files inside it.
4. Before you commit, scroll the upload list and check the paths. You should see entries like:
   - `casino/boot.js`
   - `casino/lib/three.module.min.js`
   - `casino/lib/addons/postprocessing/UnrealBloomPass.js`
   - `casino/games/slots.js`
   - `casino/world/layout.js`
   If you see `boot.js` with no `casino/` in front, the folder got flattened. Cancel and drag the folder again.
5. GitHub's web uploader sometimes chokes on more than about 100 files in one go. The casino is 48 files, so one upload should work. If GitHub complains, upload `casino/lib` in one commit and the rest of `casino` in a second.
6. Commit message (something like `fridge palace`), **Commit changes**.
7. Wait for the green check in the **Actions** tab (1 to 2 minutes).
8. Hard refresh the site (Ctrl+Shift+R on Windows, Cmd+Shift+R on a Mac; on a phone close the tab fully and reopen it).
9. A gold-on-red **fridge casino** button should appear in the left panel under **fridge market**. Press it.
10. You get a loading screen with a spinning diamond. On a decent computer the doors open in a few seconds. The first load also has to download the 700KB 3D engine, so it takes a bit longer the first time.

**If it fails:**
- The button never shows up: `casino/boot.js` didn't upload, or the `<script src="casino/boot.js">` line isn't in index.html (it's right after `extras/dogg.js`).
- The loading screen says the palace couldn't open and mentions WebGL: that browser has 3D graphics turned off. Chrome: Settings, System, "Use graphics acceleration when available" on. Nothing on the site can fix it from our side.
- The loading screen hangs at the start: `casino/main.js` or `casino/lib/three.module.min.js` is missing or in the wrong folder.
- The building loads but a game is missing (a table with nobody at it, no slot machines): that one file in `casino/games/` didn't upload. The casino keeps running without it.
- Testing locally: open it through a local web server, not by double clicking index.html. Browsers refuse to load module scripts from `file://`.

**Testing switch:** add `?casino=1` to the URL and the casino opens by itself a moment after the page loads.

### Controls

**Computer**
- Click the screen once to grab the mouse. Mouse looks around.
- W A S D (or the arrow keys) walk. Shift runs.
- E uses whatever you're looking at. The prompt at the bottom says what it does.
- Esc: pause menu (settings, a map of the floor, your stats, the secrets list, photo mode, leave). While seated at a game, Esc stands you up.
- P: photo mode (more below).
- At the blackjack table: H hit, S stand, D double, P split, R surrender, Space or Enter to deal.
- At slots: Space spins. At roulette: Space spins.

**Phone**
- Left side of the screen: put your thumb down and a stick appears under it. Push to the edge of the ring to run (it turns red).
- Right side: drag to look. A quick tap on the right side also counts as USE.
- The round USE button lights up and changes its label when something is usable.
- II (top right): pause.
- Graphics drop to the "low" preset automatically on phones: no bloom, fewer lights, fewer people. You can change it in the pause menu.

### Money

- The casino uses chips. Chips are separate from the fridges on your counter upstairs.
- The cage (lobby, on your right as you walk in) swaps them one for one in both directions: **BUY CHIPS** takes fridges off your counter, **CASH OUT** sends fridges back up.
- Chips are saved in the browser, so they're still there next visit. Like the exchange, this is a way to keep fridges between page reloads.
- First visit with no chips and almost no fridges: the teller gives you 100 chips on the house, once.
- **The Palace Club** costs 5,000 chips at the cage, one time. It opens the velvet rope in the north east: high limit blackjack, double zero roulette, couches, and a live FRDX stock board.
- The pause menu shows how much you've bet, how much came back, and what percentage the house has taken off you so far.

### The games

**Slots (west side, 35 machines).** Five themes:
- **Freezer Burn**: classic 3 reels, 5 lines, wild golden fridge, any-bar pays.
- **Cold Hard Cash**: 5 reels, 20 lines, golden fridge wild, three snowflakes give 8 free spins at double pay.
- **Ice Queen**: 5 reels, 25 lines, wilds on reels 2 to 4 expand to fill the reel, three crystals give 10 free spins at triple pay.
- **Defrost Deluxe** (west wall, three machines): one line, progressive jackpot. Three JACKPOT symbols at max bet win whatever the big number on the west wall says. Every bet on those machines adds 3% to it, and it creeps up on its own while you're inside.
- **The Vendor's Back Room** (dark corner, north west): unplugged until you've been to the basement. Five reels, his face is the wild, three tally marks open a pick-a-fridge bonus where one of the six fridges is him.
- One machine by the restrooms is out of order.
- Each theme pays back about 94 to 95% over the long run. I checked every paytable by simulating hundreds of thousands of spins.
- Controls: bet per line + and −, MAX BET, SPIN, AUTO ×10 / ×25 (auto stops on a big win), PAYTABLE shows every symbol and what it pays. Clicking the lever or the screen spins too.

**Blackjack (east pit, two tables; a third in the club).** Six decks, the dealer stands on all 17s, blackjack pays 3:2, double on any two cards and after splits, split up to four hands, split aces get one card, late surrender, insurance, and a Perfect Pairs side bet (6:1, 12:1, 25:1). Fridge regulars sit at the table and play basic strategy (mostly). The **?** button tells you what the basic strategy book says for your hand. Table 1 is 5 to 500, table 2 is 25 to 2,500, the club table is 100 to 10,000.

**Roulette (east pit; double zero in the club).** Every bet type works: tap a number for a straight bet, tap the line between two numbers for a split, a corner where four meet, the bottom edge of a column for a street, the bottom edge between two columns for a six line. Dozens, columns, red/black, odd/even and high/low sit around the board. UNDO, CLEAR, REBET. The camera moves to the wheel while it spins, and the last 14 results show above the board.

**Hold'em (east pit, south end).** No limit, blinds 10/20, buy in 400 to 4,000. Up to five fridge regulars, each with a playing style: one folds everything, one raises everything, one calls everything, one only plays hands with an ace, one gets visibly nervous with a good hand (watch his face). They work out their odds by playing the rest of the hand a few hundred times in their heads. Side pots work properly. The house takes 5% of any pot that sees a flop, capped at 30. Standing up mid-hand folds you, and your stack goes back to your chips.

**The Inside Track (north, the big screen).** Sit at any of the eight terminals, pick one of six fridges, bet, start the race. Odds come from each racer's rating with a 15% house margin, and the race uses the same ratings, so the odds are honest. There's a race caller.

**The Lucky Wheel (lobby, left).** One free spin a day by your own clock. Extra spins cost 1,000. Hold the button to pull, let go to spin. Prizes: chips (500 up to 10,000), a free drink, Coolant bait for the fishing pond upstairs, 5 GOLD shares on the exchange, a mystery prize, and the **Podium Fridge**.

**The Podium Fridge.** The gold fridge turning on the podium in the middle of the lobby. Land on it and you get 25,000 chips, and a giant gold fridge drops onto your site upstairs every time you visit from then on.

**The Freezer Bar (center).** A ring of marble around a tall aquarium. GUS sells drinks from free water to a 500-chip bottle of champagne for the whole room. Drinks make the camera sway, the picture double and the band drift out of tune, and they wear off over time. Drink too much and you wake up on the lobby bench a little poorer.

**The aquarium** holds the fish you've caught upstairs, swimming around. If you haven't fished yet, the plaque says your catches will live there.

### The people

Around 18 fridge guests (10 on phones) wander the floor. They sit at slot machines and play them (you hear their machines), drink at the bar, watch races and tables, chat in the lobby, cheer when somebody near them wins big, and eventually go home while new ones walk in. Look at one and press E to talk. What they say depends on their personality and on you: your chips, your big wins, how much you've had to drink, whether you won the podium fridge, what the exchange is doing today, whether you fish, and what you've seen in the basement.

Staff: DOUG, MARGE and PAT at the cage, GUS at the bar, the dealers, the croupiers, the pit boss, the bouncer at the club, the doorman. Most of them have something to say.

### Photo mode

Press **P** while walking (or PHOTO MODE in the pause menu). The HUD disappears. Keys 1 to 6 switch filters (clean, noir, warm, freezer, VHS, vendor). Space and C raise and lower the camera. Enter (or SNAP) saves a PNG straight to your downloads. P or Esc to leave.

### Settings (pause menu)

Look speed, volume, house band volume, graphics (auto, low, med, high), invert look, head bob. Graphics "high" turns on bloom and smoother edges. Whatever you pick, the game lowers its own resolution when frames drop and raises it again when there's room.

### Saved data

Browser storage key `fridgepalace_v1` holds chips, stats, settings, membership, the daily wheel, the podium fridge and the secrets found. The casino also reads `fridgefish_v1` (your fish), `frdx_state_v1` (the exchange) and `vendor_memory_v1` (the basement) so it can react to them. To wipe the casino only, open the browser console and run `localStorage.removeItem('fridgepalace_v1')`.

### Secrets (hints only)

The heist adds a few more secrets to the list once you've met Clement.

The pause menu counts the secrets you've found and shows a hint for each one you haven't. A few more hints:
- The cage has a stapler with something stuck under it.
- The staff door code is a number this site already cares about once a day.
- Not every camera in the security room points at the casino.
- Somebody's locker still has his name on it.
- Don't touch the breaker. Or do.
- A plaque at the roulette wheel remembers a king.
- Look down along the east wall.
- An old code from upstairs works in here too.
- The machine that's out of order can be persuaded. Persuade it a lot.
- Bet big when the shoe's rich and small when it isn't, and see who notices.
- If you've had the sauce downstairs, ask the bartender what else he makes.
- If you've been downstairs enough times, keep an eye on the far end of the room.
- The vendor hears about the casino too.

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

## New this round: what's in the folder

```
market/
  engine.js                 the exchange: prices, the order book, every order type, margin, options, settlement, news
  variants.js               the odd fridges: 12 colored, shaped and glowing kinds, each one tied to a ticker
  ui.js                     the terminal screen you open with "fridge market"
  market.css                styles for the terminal
fishing/
  fish-data.js              all 69 fish: names, rarity, difficulty, where and when they bite, how they look
  fishing.js                the pond, the cast, the reel minigame, the cooler, the fishdex, the tackle shop
  fishing.css               styles for the fishing screen
extras/
  dogg.js                   the 4:20 player
```

Two files in `vendor/` changed too: `basement-core.js` (the 4:20 video can pause the basement game) and `coldfeet.js` (the vendor now brings up your fishing and whether you own shares of him during check-ins).

`dogg.mp4` is NOT in this folder. It uses the copy already in your repo. It has to sit in the repo root, next to `index.html`, spelled exactly `dogg.mp4` (all lowercase). GitHub Pages is case sensitive, so `Dogg.mp4` or `dogg.MP4` will not play.

## Putting the new round on GitHub Pages

1. Back up `index.html` first: click it in the repo, three dots top right, **Download**.
2. Repo root, **Add file**, **Upload files**.
3. Drag in, all in one upload:
   - the new `index.html`
   - the whole `market` folder (drag the folder itself)
   - the whole `fishing` folder
   - the whole `extras` folder
   - the whole `vendor` folder again (two files inside it changed; dragging the whole folder is easiest and overwrites the old copies)
4. In the upload list, check you see paths like `market/engine.js`, `fishing/fishing.js`, `extras/dogg.js` and `vendor/coldfeet.js`. If you see `engine.js` with no folder in front of it, the folder got flattened; cancel and drag the folder itself instead of its contents.
5. Commit message (something like `market fishing 420`), **Commit changes**.
6. Wait for the green check in the **Actions** tab (1 to 2 minutes).
7. Hard refresh the site (Ctrl+Shift+R, or Cmd+Shift+R on a Mac). On a phone, close the tab completely and reopen it.
8. Quick check that everything landed:
   - the left panel has a **fridge market** button under the cannon, with a small FRDX number under the label
   - the fridge shop has **Fishing Rod (100F)** at the bottom
   - spawn about 20 fridges; a few should come out colored, rusty, short, wide or glowing
   - add `?dogg=1` to the URL; the video should cover the screen for a minute

If the market button does nothing, `market/ui.js` probably didn't upload. If no odd fridges ever show up, `market/variants.js` is missing. If "go fishing" never appears after buying the rod, `fishing/fishing.js` is missing.

## 4:20

- At 4:20:00 PM on the visitor's own clock, every day, `dogg.mp4` covers the whole page and plays from the start.
- It runs until 4:21:00 exactly, then disappears. Load the page at 4:20:35 and it starts 35 seconds into the video, so it still ends on 4:21.
- It plays once per day per page load. Reloading during the minute starts it again at the right offset.
- The music player upstairs pauses for the minute and picks back up after. If someone's in the basement, the game pauses first.
- Browsers block sound until the visitor has clicked or tapped the page at least once. If they haven't, the video plays muted with a **tap for sound** button at the bottom. One tap and the sound comes on.
- It sits above everything, the market and the fishing screen included.
- To test it any time: add `?dogg=1` to the URL, or type `dogg420()` in the browser console.
- Skipping to a point in the video needs the server to support partial downloads. GitHub Pages does. Some local test servers (Python's built-in one, for example) don't, so on those it always starts from 0:00. Nothing to fix on the live site.

## The odd fridges

Every spawned fridge (spawn button, both autoclickers, the cannon) rolls for a kind. Most come out normal. The rest are listed on the exchange, and each one you spawn vests you 1 share of its ticker (locked for 2 sessions, so you can't sell it right away). It also adds 1 share to that company's float, so mass spawning slowly dilutes the stock.

| Kind | Ticker | Roughly 1 in | What it looks like |
|---|---|---|---|
| normal | FRDG | 1.3 | your original fridge PNGs; vests nothing |
| rusted | RUST | 19 | brown, rust spots, AS IS sticker |
| mini | MINI | 23 | small, stickers |
| chest freezer | CHST | 33 | wide and low |
| side-by-side | SXS | 39 | wide, two doors, a screen |
| retro | RTRO | 49 | rounded, mint, chrome handle |
| wine cooler | WINE | 66 | narrow, glass door, bottles |
| smart | SMRT | 82 | dark, big screen, cyan glow |
| frost | FRST | 98 | icy blue, glows, slides around |
| neon | NEON | 123 | black with pink neon, very bouncy |
| gold | GOLD | 197 | solid gold, heavy, glows |
| void | VOID | 328 | black and purple, floats instead of falling |
| the vendor's | VNDR | 983 | his color; only after you've died in the basement once |

## The exchange (fridge market)

It's built to look and feel like a real trading terminal, so the screen itself explains nothing. This section is the cheat sheet, for you only.

**Getting money in.** The exchange keeps its own cash, separate from the counter upstairs. Open **ACCT** (bottom tabs on desktop, the bottom strip on a phone), type an amount and press **DEPOSIT**. That takes fridges off your counter (and removes that many fridges from the screen, like the autoclickers do). Up to 5,000 lands right away (10,000 on a margin account); the rest clears next session. **WITHDRAW** sends cash back to your counter.

Handy side effect: the counter upstairs resets to 0 every page reload, but the exchange account is saved. Parking fridges in the exchange keeps them between visits.

**Time.** One trading day is 6 real minutes: 30 seconds of pre-market, 4.5 minutes of regular trading, 45 seconds after-hours, 15 seconds closed. Five days to a week; options expire Friday at the close. The clock is in the orange bar at the top. Prices keep moving while the page is closed (up to 10 minutes of catch-up, then whole days).

**Placing a trade.** Pick a ticker on the left (MON). In ORDER ENTRY on the right: BUY, a quantity, a type, then TRANSMIT. MKT fills now at whatever the book offers. LMT waits for your price. Outside regular hours only LMT orders with EXT ticked will fill; anything else waits for the open.

**Command line.** The yellow line under the top bar takes typed commands. `HELP` and Enter shows all of them. A few:
- `SMRT GO` loads SMRT
- `BUY 100 FRDG LMT 41.20 GTC`
- `SELL 50 FRDG STP 39`
- `BUY 200 NEON TP 10 SL 8.5` (a bracket: take profit and stop loss go live once it fills)
- `DEP 5000`, `WD 5000`
- `CXL ALL`, `FLAT FRDG`
- `RESET CONFIRM` wipes the market and your account (deposits are lost)

**The rules it enforces**, so you're not surprised:
- Cash account: sale money takes 2 sessions to settle. Selling something you bought with unsettled money is a "good faith violation". Three of those and you're limited to settled cash for 9 sessions.
- Margin account (needs 2,000 in equity): roughly 2x buying power, lets you short. If your equity falls under the maintenance level at the close you get a margin call, 2 sessions to fix it, then the exchange sells your stuff at the next open and charges 25.
- Four day trades (buy and sell the same day) inside 5 sessions on a margin account flags you as a pattern day trader. Under 25,000 equity that locks you to closing trades only for 9 sessions.
- A stock down 10% on the day can only be shorted with a limit above the bid (SSR). A stock that moves too fast pauses for 15 seconds (LUDP). If the whole index drops 7%, everything halts for 30 seconds.
- VOID orders need the attestation box ticked (or `ATTEST` on the command line). VNDR is halted until you've been to the basement.
- Options need approval. Apply in ACCT. You get more levels as you make more trades and grow the account. Level 2 lets you buy calls and puts. They're priced off Black-Scholes, ×10 per contract, and settle in cash at the close on expiry day.

**What moves prices.** Random walk plus a market mood that shifts between calm, bull, bear, melt-up and crash; news headlines; earnings every 15 sessions (gaps at the open); your own big orders (you move the price when you buy a lot); spawning (dilutes); the pond (rare catches pump FISH).

**Saved data:** browser storage key `frdx_state_v1` (market and account) and `frdx_ui_v1` (which screen and ticker you had open). Console tools: `MKT.reset()` wipes it, `MKT._tick()` advances one second, `MKT.account()` prints the account.

## Fishing

1. Buy **Fishing Rod (100F)** in the fridge shop. A **go fishing** button appears under the market button and stays there on future visits.
2. Hold the screen (or Space) to charge, let go to cast. Let go near the white line on the power meter for a long cast; a few fish only bite on long casts.
3. Wait. The bobber twitches a few times (those are nibbles; touching it then scares the fish off). When it goes under and a **!** shows up, tap fast.
4. The reel: a bar on the right side. Hold to lift the green bar, let go to drop it. Keep the fish inside the green bar until the meter next to it fills. Never letting it slip out counts as a perfect catch: bigger fish and 1.5x value.
5. On the catch card: **KEEP** (goes in the cooler), **SELL** (fridges straight to your counter), or **LET GO**.

**Tabs:** COOLER (sell what you kept, one at a time or all), FISHDEX (every fish; ones you haven't caught show as shadows with where they live and a hint about when), TACKLE (rods, bait, waters).

**Rods:** Twig (100), Fiberglass (600, unlocks crisper lake), Graphite (2,500), The Compressor (12,000, unlocks the abyssal freezer). Better rods mean a bigger green bar, a faster reel, more time to hook and better odds at rare fish. A fifth rod shows up in the tackle shop for free for one specific kind of player.

**Bait** (used up one per bite): Ice Cubes (fast bites, commons), Leftovers (uncommons), Freezer-Burnt Shrimp (rares), Mystery Tupperware (epics), Liquid Coolant (legendary and mythic odds go way up).

**Waters:** the puddle (start), crisper lake (Fiberglass or better), the basement drain (after you've died in the basement once), the abyssal freezer (The Compressor or better; always counts as cold).

**69 fish** across six rarities: 19 common, 18 uncommon, 14 rare, 9 epic, 5 legendary, 4 mythic. A lot of them only bite under certain conditions, all read from the visitor's real clock and date: time of day, the weather (changes every 10 minutes, shown at the top), the real moon phase, the season, weekends, whether the exchange is open or having a big up or down day, and things you've done in the basement.

**Saved data:** browser storage key `fridgefish_v1`. Console: `FISHING.reset()` wipes it.

## Hints for the new stuff (no spoilers)

- One fish keeps the same schedule as the video.
- One only bites at a certain minute of every hour. The roulette panel's memorial line tells you which.
- Something came up the drain from downstairs. It only comes out at night.
- If you know a certain name from the basement walls, he's fishable. Let him go home after.
- The vendor notices when you fish. He also notices if you own a piece of him. Or bet against him.
- There's a rod waiting by the stairs for someone he trusts.
- The biggest thing in the pond only surfaces in a storm, at night, on a long cast, in the coldest water.
- Two fish care about how the exchange is doing today.

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

`?dogg=1` plays the 4:20 video right away (see the 4:20 section). The vendor switches below combine with commas.

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
