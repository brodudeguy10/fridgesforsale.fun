# fridgesforsale.fun: install guide

This round: **the torture room**, a sandbox for the ragdoll guy in a room of his own. It opens from a new button on the fridge page, under fridge racing.

## The torture room

A bare concrete room with one weak fluorescent tube in the middle of the ceiling, a steel door, hooks and rings for ropes, and a drain in the floor. One dummy stands in it: a blank mannequin with no name and no face anyone would know. Thirteen tools sit along the bottom of the screen in seven groups. Nothing keeps score and nothing times you. Every wound stays where you put it, he keeps bleeding from what's open, and when he dies he stays a body you can keep working on. **RESET** puts the whole room back the way it started, without reloading the page.

He's the same man as the one in the corner of the fridge page (version three: the skeleton, the damage model, the brain, the X-ray), built from his own copy of that code, so nothing you do in the room can change the fridge page.

### Uploading this round

`fridgesforsale-torture.zip` has 30 files:

- `INSTALL.md` (this guide)
- `index.html` (your page with one line added, nothing else touched)
- the folder `torture`, with 16 files in it and a folder `torture/gore` with 12 more

Steps:

1. Open `fridgesforsale-torture.zip`.
2. On github.com open your repo, click **Add file**, then **Upload files**.
3. Drag **three things** from inside the zip onto that page: the file `INSTALL.md`, the file `index.html`, and the folder `torture`. Drag the folder as a folder, so it keeps everything inside it.
   - If you've changed `index.html` on GitHub since **November 19** (your last upload), leave my `index.html` out and add the line by hand (it's below, under **Adding the line by hand**). Mine is your November 19 copy plus that one line, so uploading it would undo anything you changed after that.
4. Before you commit, read the file list GitHub shows. There should be 30 files:
   - `INSTALL.md` and `index.html` with nothing in front of them
   - 16 files that start with `torture/`: `blades.js`, `boot.js`, `env.js`, `game.js`, `guns.js`, `index.html`, `post.js`, `pre.js`, `room.js`, `ropes.js`, `saw.js`, `sound.js`, `spikes.js`, `tools.js`, `torture.css` and `ui.js`
   - 12 files that start with `torture/gore/`: `anatomy.js`, `audio.js`, `blood.js`, `body.js`, `brain.js`, `core.js`, `damage.js`, `flesh.js`, `gibs.js`, `main.js`, `recap.js` and `render.js`

   If any of them shows up without `torture/` in front, cancel and drag again. There are two files called `index.html`, and that's right: one on its own (the fridge page) and one inside `torture/` (the room).
5. Click **Commit changes**.
6. Click the **Actions** tab and wait for the newest run to go green (about a minute). If it goes red, open it and send me what it says.
7. Open `fridgesforsale.fun/torture/boot.js` in your browser. You should see a page of code that starts with `TORTURE ROOM: the button on the fridge page.` If it says 404, GitHub hasn't caught up yet: wait a minute and press **Ctrl+Shift+R**. Still 404 after five minutes means the folder didn't upload: go back to step 2 and drag the `torture` folder again.
8. Open `fridgesforsale.fun/torture/gore/brain.js`. It should start with `THE GUY, version three: the brain.` A 404 here means the `gore` folder inside `torture` didn't make it: drag the `torture` folder again.
9. Open `fridgesforsale.fun/torture/`. The room should open on its own, full screen, with him standing in it. (This is the room without the fridge page around it. It works the same, and its **EXIT** button takes you to the fridge page.)
10. Go to the main page and press **Ctrl+Shift+R** to throw away the old copy your browser kept. A dark button that says **torture room** should be in the game buttons, right under **fridge racing**.
11. To check it from the inside: press **F12**, click **Console**, type `TORTURE` and press Enter. It should print an object with `open` and `close` in it. `undefined` means the browser still has the old `index.html`: close the tab, open the site again and press **Ctrl+Shift+R**.

**Adding the line by hand.** Only for the case in step 3.

1. On github.com open your repo and click `index.html`.
2. Click the pencil icon (**Edit this file**) near the top right of the file.
3. Click anywhere in the code, press **Ctrl+F** and search for `racing/boot.js`. It finds this line, near the bottom of the file:

   ```
   <script src="racing/boot.js"></script>
   ```

4. Click at the end of that line, after the last `>`, and press **Enter** to start a new line under it.
5. Paste this on the new line:

   ```
   <script src="torture/boot.js"></script>
   ```

6. Those two lines should now sit one above the other, and nothing else should have moved. Click **Commit changes**, then **Commit changes** again in the box that comes up.
7. Upload `INSTALL.md` and the `torture` folder the normal way (steps 2 to 5 above, without `index.html`).

**How it loads.** The fridge page loads `torture/boot.js`, a small file that adds the button and does nothing else until somebody presses it. Pressing it opens `torture/index.html` in a full-screen frame over the page. The fridge page underneath stops (its physics and drawing, and the music) the same way it does for fridge racing, and **EXIT** in the room starts it all again. Nothing else on the site changed: `extras/gore/` (the guy in the corner), the casino, racing, the market, fishing and the levels are the same files as before.

### Playing it

- **Pick a tool** from the bar at the bottom, or press **1** to **7** for the groups (press the same number again to step through the group). **W** and **E** go to the previous and next tool.
- **Variants:** most tools have two or three, shown as chips under the bar. Click one, or press **S** and **D**.
- **Left mouse** uses the tool. **Right mouse** (hold) is always the hand, whatever tool you have, so you can move him without putting the knife down.
- **Shift + click** takes out the spike, nail, staple or rope under the cursor. **Delete** does the same at the cursor without clicking.
- **Mouse wheel:** over a rope or chain it makes it longer or shorter; with the spike it turns the spike; with the chainsaw it turns the bar.
- **R** reloads. **T** hides the tool bar (the room grows to fill the space). **F** is full screen. **Esc** pauses, or cancels a rope or a staple you've started.

### The tools

1. **HAND.** Grab any part of him and drag. Let go while the mouse is still moving and he flies the way you were going. **GRAB** holds firmly. **RIP** holds harder, so a hard enough pull sprains, dislocates or tears the limb you're holding.
2. **ROPE** and **CHAIN.** Click a hook, a ring or the wall, then click him (or press on one and let go on the other). One end has to be on him; the other can be on another part of him. A rope only pulls when it's tight, so slack it does nothing, and a hard enough yank snaps it. A chain is heavier and stiffer and never breaks: whatever it's tied to gives first. The wheel over one, or **− LENGTH** and **+ LENGTH**, winches it in or lets it out. **TENSION** sets how hard it pulls once it's tight. **UNTIE** takes one off with a click, **CLEAR ALL** takes them all.
3. **PISTOL**, **SHOTGUN** and **RIFLE.** The round lands where the sight is, in whatever part of him is there (or the wall, the door, the light, a rope, a spike, a bit of him on the floor). His damage model takes it from there: the bone, the organ, the artery under that exact spot, and out the back.
   - Pistol: **9 MM**, **HOLLOW POINT** (a bigger hole, more blood), **SUPPRESSED** (no flash, and a cough where the bang was). 15 rounds.
   - Shotgun: **BUCKSHOT** (nine pellets, the dotted circle shows the spread), **SLUG** (one heavy round that knocks him over), **BIRDSHOT** (a cloud of small pellets). It pumps itself between shots. 8 shells, loaded one at a time.
   - Rifle: **FULL AUTO** (hold it down: eleven rounds a second, climbing as you hold), **BURST** (three a click), **SEMI** (one a click). 30 rounds.
   - Brass flies out, bounces on the floor and stays there (the newest 60). **∞ AMMO** turns off magazines and reloading.
   - Point any gun at him and he lifts his hands and pleads.
4. **RAZOR**, **SCALPEL** and **KNIFE.** Drag across him. The cut lands exactly where the blade crossed him.
   - Razor: takes the skin off in strips, never deeper than the fat.
   - Scalpel: a fine line; each pass along the same line goes one layer deeper (skin, fat, muscle, bone).
   - Knife: a swing slashes (a harder swing cuts deeper); a click without moving stabs. Deep enough at a joint, the limb comes off there.
5. **CHAINSAW.** A real object: it swings on your hand, bumps him, and drops to the floor when you switch tools. Press to pull the cord, hold to open it up. With the chain moving, whatever the bar touches gets cut, again and again, deeper the longer it stays; hold it on a knee or an elbow and the limb comes off. Off or idling, it only pushes. Let go and it idles; seven seconds idle and it dies. **AIMED** turns the bar toward the nearest part of him, **FREE** lets you turn it with the wheel.
6. **SPIKE** and **NAIL GUN.**
   - Spike: **ON A SURFACE** snaps it into the floor, a side wall or the ceiling, pointing out (the ghost under the cursor shows where). **ANYWHERE** sets it in mid-air at the angle the wheel picks. Drop him on the point, throw him at it, or lay him on it: the part that meets the point goes on, slides down it under his weight, and tears off if you pull him away sideways. **REMOVE** takes one out, **CLEAR SPIKES** takes them all. Up to 24.
   - Nail gun: click a part of him and a nail goes through it into the wall behind. Pull on him hard enough and it tears out through him. **PULL OUT** takes a nail out clean. Up to 40.
7. **STAPLE GUN.** **JOIN**: click a part, then another, and they're drawn together and stapled (pulled far enough apart, the staple rips out). **TO THE WALL**: staples a part to the wall, weaker than a nail. **TACK**: staples, nothing more. Up to 80.

### His condition

The panel in the top left shows him at a glance: a map of his body coloured by how badly each part is hurt (by the trauma surgeons' AIS scale), his blood, his pain, how aware he is, the latest bad injury, and his ISS score once he has one. A part that's come off shows as a dotted outline. The panel sits over a corner of the room, so clicks go through it to the room (only the X-RAY button takes them), and it fades while your cursor works under it. Once he dies, the panel says what killed him and **X-RAY ▸** lights up: it opens his case file, the same one the fridge page has (skeleton, every injury, the timeline, the cause of death). **Esc** closes it.

### The pause menu

**Esc** or **PAUSE**. Everything stops: the physics, the sound, the guns, the chainsaw's idle timer.

- **RESUME**, **RESTART SCENE** (the same as RESET), **FULLSCREEN**, **EXIT ROOM**
- Four volumes: **MASTER**, **EFFECTS**, **AMBIENT** (the tube's hum and the room) and **HIS VOICE**
- **Light in the air**: the dust and the cone of light under the tube. Turn it off on a slow computer.
- **Full blood detail**: off draws about half the drops, also for a slow computer
- **Infinite ammo**, and **show the palette** (the same as **T**)
- The full list of controls

The volumes, the two graphics switches, infinite ammo, the rope tension and the last tool you picked are all remembered in your browser for next time.

### Easter eggs (hints only)

The pause menu says it at the bottom: some words do things if you type them on that screen. There are three. One of them you already know from the fridge page. And if you leave the room alone long enough with the sound on, somebody outside notices.

### Under the hood

- **The room is its own page** (`torture/index.html`) in a frame over the fridge page. Closing it throws the whole room away, so nothing it made stays in memory on the fridge page.
- **His code is a copy** (`torture/gore/`) of the fridge page's `extras/gore/`, with the room's changes made in the copy: the dummy's look (plain skin, briefs, a quieter flesh colour inside), stab wounds, spikes, nails and staples as wounds of their own in his record and in the cause of death, blood that runs down the back wall and stops at the floor, and his guts drawn in front of him. The fridge page's copy wasn't touched. One thing to know: if you change the guy on the fridge page later, the room keeps the version it has until it gets its own update.
- **His sounds** still come from `extras/gore/audio/` and the site's `revolver.mp3`, `bullethitflesh.mp3` and `glassshatter.mp3`, all already on the site. The room's own sounds (the three guns, the brass, the reloads, the chainsaw, the nail gun, the stapler, rope and chain, the tube's hum) are made in the browser while you play, so there are no new sound files to upload.
- **Physics:** Matter.js 0.19 (the same as the fridge page), 60 steps a second. Matter has no continuous collision detection, so anything fast (a thrown arm, a swinging chainsaw) gets its step split into up to four smaller ones, so it can't skip through a spike or a wall between two steps.
- **Storage:** the room's settings are under `ffs_torture_settings` and `ffs_torture_tool`, and its body count under `ffs_torture_bodycount`, so the dead in the room don't count on the fridge page.

### Tested, and not tested

Every test drives the real room in a browser (Chromium, through Playwright), with mouse and keyboard input sent the way a real mouse and keyboard send it, on a copy of your site as of the November 19 upload. A few steps run by script to save time: the hanging test winds the ropes in by script, and one easter egg's test runs the room's clock fast. All 18 checks from your list, with 162 separate pass or fail items under them, and every one passed on the final build:

- **1. Launching from the site (8 of 8).** The button sits under fridge racing; clicking it opens the room full screen with him in it; the fridge page's physics stops underneath and its game flag is set; keys and clicks reach the room inside the frame (**3** picks the pistol, a click shoots him); **EXIT** closes it and the fridge page runs again; opening and closing twice leaves nothing behind.
- **2. Window sizes (13 of 13).** 1280×720, 1920×1080, 1024×768, 800×600, a phone upright (390×844) and on its side (844×390): the whole room fits above the tool bar every time, the page never scrolls, a live resize refits it, no errors.
- **3. Ragdoll physics (6 of 6).** He stands on his own with his joints together; thrown hard into a wall, nothing goes through the wall or the floor and no joint stretches apart; dropped from high up, he lands on the floor.
- **4. The hand (9 of 9).** It takes the head, a hand, a foot and a forearm and each follows the cursor; right mouse is the hand over the knife (he moves, the knife cuts nothing), and letting go gives the knife back; a flick throws him; RIP on an arm sprains and tears joints.
- **5. Ropes and chains (12 of 12).** Hook to hand; shortening it lifts his arm; the wheel lengthens it; a chain dragged from a floor ring to his foot; a rope from one part of him to another; shift-click, UNTIE and CLEAR ALL each take one off and leave nothing behind; a hard yank snaps a rope; hung by both wrists from two ceiling hooks, his feet leave the floor and he hangs there.
- **6. Firearms (15 of 15).** The pistol's hole lands at the exact spot under the sight (to half a unit, in the part's own coordinates) and uses one round; the thigh gets the thigh; buckshot spreads over more than one part; the shotgun can't fire again inside its pump; the slug shoves him; full auto fires about eleven a second and stops when you let go; a burst is three rounds; **R** reloads; infinite ammo uses nothing; a miss leaves a hole in the concrete exactly where it hit; shooting the tube breaks it; the brass stays on the floor as real objects.
- **7. Blades (6 of 6).** Razor slices on the chest, a scalpel cut on the thigh, a knife slash across the belly, a stab where you click, and the forearm off at the elbow.
- **8. Chainsaw (6 of 6).** The cord, then it runs and opens up while held; held in his thigh it keeps cutting every moment it's in him; let go, it idles and stops cutting; it takes the lower leg off; another tool, it stops and drops to the floor, still an object.
- **9. Spikes, nails, staples (13 of 13).** A floor spike points up, a wall spike sits flush and points out, a mid-air one at the wheel's angle; thrown onto the floor spike he goes on it, it wounds him there, and he stays on it; shift-click takes the spike out and him off it; REMOVE and CLEAR SPIKES; a nail through his hand holds it in place while you pull him by the chest, and PULL OUT takes it out; staples JOIN, TACK and REMOVE ALL.
- **10 to 13. Damage that stays, blood on the room, still a body after death, reset (11 of 11).** Four shots in, five seconds later every injured region is as bad or worse; blood stains the concrete and pools on the floor under him; he dies (rifle to the head); dead, the hand still moves him and the knife still cuts him; the X-ray opens and the room holds still behind it; RESET clears every rope, spike, nail, staple, bit of him, drop of blood and stain, fixes the light and brings him back unhurt; five resets in a row leave the same number of physics bodies and constraints.
- **14. Tool selection and variants (10 of 10).** Each of the 13 tools by click, the groups by **1** to **7**, a group key again steps through it, **W** and **E**, **S** and **D** (they wrap round), the variant chips, an icon, name and help on every tool, **T** hides and brings back the bar, and the last tool is remembered after a reload. No errors.
- **15. Controls that don't step on each other (7 of 7).** A variant key mid-drag keeps hold of him; **Esc** halfway through a rope cancels the rope (the next **Esc** pauses); letters typed on the pause screen don't change tools; right click never opens the browser's menu over the room; the wheel never scrolls the page; clicking the tool bar never shoots.
- **16. Pause and volume (17 of 17).** **Esc** pauses (the menu shows, the physics stops, the sound stops); the four sliders move the actual volume; RESUME starts everything again; the settings come back after a reload; PAUSE and RESTART SCENE; the controls list. The sound was measured at the speakers' input, since I can't listen: the hum on its own sits at about −44 dB, every tool is louder than it, the suppressed pistol is a fifth of the plain one, the chainsaw is louder flat out than idling and goes quiet when it dies, the tools differ in brightness, and each slider at zero silences its part (master silences everything).
- **17. A long session (7 of 7).** Six minutes of random play with every tool (389 bursts) and a reset every 30 seconds. No errors. After the last reset the room held exactly what it started with: the same 21 physics bodies and 32 constraints, no blood, nothing left over. Event listeners and the page's element count stayed flat. Memory after each reset sat between 9 and 11 MB with no climb. The caps held (60 shell casings at most, the blood under its limit), and a quiet room cost the same to run at the end as at the start.
- **The smaller promises in this guide (16 of 16).** He lifts his hands and pleads at a gun; all the easter eggs go off; **TENSION** sets the pull and is remembered; the yank that snaps a rope leaves a chain whole; paused, the chainsaw's idle timer holds, and seven seconds of idling later it dies; **Delete** takes out the spike under the cursor; a thigh thrown at a spike's point goes on it, and pulled away sideways it tears off; a nailed hand pulled hard tears off the nail; infinite ammo is remembered; the wall ring behind the condition panel takes a rope, with the panel faded while the cursor is under it. No errors in either run.
- **18. The rest of the site (6 of 6, plus the launch test above).** The fridge page loaded with the room's script and with that script blocked: the same buttons in the same order (the room adds one, last), the same console output, the guy in the corner and the physics running the same. Fridge racing and the room take turns holding the page and it runs again after both. The room's storage keys are all its own.

Couldn't test:

- **Hearing it.** Every sound was built and measured by its waveform, its level and its brightness, but nobody listened. Put headphones on and tell me what sounds off: a gun that's thin, a chainsaw that buzzes like a toy, a hum that's too loud.
- **Your computer.** My test browser draws on the CPU in software, so I can't give you a real frame rate. In software, a quiet room drew at about 60 frames a second at 1280×720 and dropped to about 30 in the busiest moments.
- **Phones and touch.** The layout fits a phone both ways up, but the tools are built for a mouse (right button, wheel, shift), and nothing was tried with a finger.
- **Other browsers.** Chromium only.

Two honest notes. He's drawn from the side, flat, so he can't turn toward you or away. And limbs come off at the joints: a chainsaw or a knife deep enough near a joint takes the limb off there. Nothing cuts through the middle of a bone.
