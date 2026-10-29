/*
 * pick-color: set a color picker to a target color. MiniWoB counterparts: use-colorwheel, use-colorwheel-2.
 *
 * Scenarios (the goal is always one 8-bit sRGB color; error is CIEDE2000 to it)
 *   swatch     match a target swatch shown on the page
 *   hex        set a color given as text in the goal: '#3FA2C4', '#3fa2c4', '3FA2C4', 'rgb(63, 162, 196)'
 *              (ood also 'hsl(196, 51%, 51%)'); the page shows it on a target card in most episodes
 *   named      a color name from a curated bank ("set it to teal"): canonical CSS-style hex, larger tau
 *   palette    a preset palette (named swatches) plus the picker: one preset is close to the target (3-6 tau
 *              away), so the efficient route is: click that preset, then fine-tune. Target as swatch or hex.
 *   image      match the color of a region of an illustration ("the roof"), named in the goal or marked with
 *              a pin on the image. Half the episodes offer an eyedropper tool (click it, then the region).
 *   hex-typed  keyboard: type the color into the picker's text fields (hex and/or R, G, B), same grading.
 *              The goal may be given in another format than the fields take (rgb() for a hex field, hex for
 *              R/G/B fields), so converting is part of the task.
 *
 * The model lives in HSV, not in pixels, so any control layout reuses it. A widget declares its pointer
 * controls as `traits: { controls }` (default 'sv+hue'); the base site implements all five:
 *   'sv+hue'       saturation/value square + hue strip (Photoshop-style; reference/picker, reference/popover)
 *   'wheel+value'  hue (angle) and saturation (radius / R) on a disc, value on a separate strip (reference/wheel)
 *   'rgb'          three R, G, B sliders, 0-255 each (reference/rgb)
 *   'sl+hue'       HSL saturation (x) / lightness (y, 1 at the top) square + hue strip (vanilla-picker;
 *                  reference/vanilla)
 *   'hsl'          three H (0-360), S and L (0-100%) sliders (reference/hsl)
 * HSL sets work on math.hsvToHsl(model) and write back with math.hslToHsv (floats; the model stays HSV).
 * traits.popover (reference/popover): the pointer controls (and the text fields) live in a popover that a
 * swatch button opens (click) and a press outside closes; the model carries an unscored `open` flag and the
 * plan opens the popover before any drag or typing. Widgets may add an alpha control as an unscored
 * distractor (reference popover, hsl, vanilla): it never enters the model or the error.
 *
 * spec   { scenario, controls, goal: { h, s, v }, rgb: [r, g, b], hex: '#RRGGBB', tau,
 *          isplit, csplit, ood, startMode,
 *          fields: null | 'hex' | 'rgb' | 'both'   editable text fields (keyboard episodes; null = read-only readout)
 *          keys (bool: 'keyboard' allowed), route: 'drag' | 'type' (how the oracle sets the color),
 *          typeText (what the oracle types into the hex field), targetLabel (caption of the target card),
 *          showCode (hex/hex-typed: the target card shows the code), format: 'hex' | 'rgb' | 'hsl', code (goal text),
 *          named:   name, aliases
 *          palette: presets: [{ name, hex }], near (index of the close preset), ref: 'swatch' | 'hex'
 *          image:   scene: { kind: 'house' | 'landscape' | 'still' | 'tiles', rows?, cols?,
 *                            regions: [{ id, name, hex }], target (region id), mark: 'name' | 'pin' },
 *                   eyedropper (bool) }
 *          goal is the HSV of the 8-bit color `hex` (so controls placed exactly at goal show hex).
 *          h in degrees [0, 360), s and v in [0, 1]. Training goals keep s >= 0.3 and v >= 0.35 (away from
 *          the grey corner where hue is undefined); ood goals are greyish or dark (s 0.12-0.3 or v 0.2-0.35).
 *          popover (true when the widget declares traits.popover; absent otherwise)
 * model  { h, s, v, picking?, preset?, open? }   h in [0, 360] (0 and 360 are both red), s and v in [0, 1]. picking
 *          (image with eyedropper): the eyedropper is armed; the next click on the image copies a region's
 *          color. preset (palette): index of the last preset clicked (unscored; widgets keep it on later edits).
 *          RGB widgets convert: channels = math.hsvToRgbF(h, s, v) * 255 (floats), and after a slider
 *          moves, model = math.rgbToHsv([r, g, b]) (float channels are fine). A valid typed hex / channel
 *          sets the model the same way (math.parseColor). open (traits.popover): the picker popover is open
 *          (unscored; init starts closed).
 * error  CIEDE2000 between the 8-bit sRGB of the model and the goal; success when <= tau
 *        (tau in {3, 4, 5}; named 7, ood named 5).
 *
 * Levels (opts.level easy | medium; normal is unchanged; spec.level records it): tau x2 / x1.5 (named capped at 11, its
 * names are 16 apart), palette keeps 5 / 7 presets at most (the close one stays). The controls are the widget's.
 *
 * Start modes: off, solved, partial (sv+hue, sl+hue: hue already right; wheel: hue/saturation right; rgb: two
 * channels right; hsl: hue and saturation right; palette: the close preset applied; image with eyedropper:
 * eyedropper armed), wrong (swatch: complementary or shifted shade; hex / hex-typed: two channels swapped;
 * named: the nearest other name; palette: a far preset applied; image: another region's color).
 *
 * Input routes: inputs are ['pointer'], plus 'keyboard' when spec.keys (hex-typed always, 25% otherwise;
 * the color readout is then an editable hex field). route 'type' (hex-typed always; hex and palette/hex in
 * half the keyboard episodes): the oracle types the color instead of dragging.
 * opts.route (episode knob) overrides that mix after the same rng draws (so unset = the mix above, unchanged):
 *   'keyboard'  scenarios that know the code (hex, palette with ref 'hex'): keys, a hex field, route 'type';
 *               hex-typed keeps its own fields; swatch, named, image and palette/swatch ignore it
 *   'pointer'   keys off, no fields, route 'drag' (hex-typed has no pointer route: ignored)
 *   'wheel'     ignored (no wheel route)
 *
 * plan targets (widget.locate maps each to viewport px), by controls:
 *   sv+hue        { surface: 'hue', h }, { surface: 'sv', s, v }           hue first, then s/v
 *   wheel+value   { surface: 'wheel', h, s }, { surface: 'value', v }     wheel first, then value
 *   rgb           { surface: 'r' | 'g' | 'b', value }  (value 0-255)       r, g, b in turn
 *   sl+hue        { surface: 'hue', h }, { surface: 'sl', s, l }           hue first, then s/l (HSL)
 *   hsl           { surface: 'hue', h }, { surface: 'light', l }, { surface: 'sat', s }   h, then l, then s
 *                 (lightness before saturation: at l = 0 or 1 saturation has no effect)
 *   any surface   { surface, current: true }   where that control's marker is now
 *   { field: 'hex' | 'r' | 'g' | 'b' }   a text field (plan step { type: [field, text] })
 *   { preset: i }                       preset swatch i (click)
 *   { tool: 'eyedropper' }              the eyedropper button (click; toggles picking)
 *   { region: id }                      a point inside that image region (click while picking)
 *   { popover: 'open' }                 the swatch button that opens the picker popover (traits.popover)
 * Wheel: hue is the polar angle (widgets pick the zero direction and orientation), saturation is
 * radius / R. Strips and sliders are linear over their full length (hue 0..360, value 0..1, 0..255).
 *
 * Pointer quantization. Widgets must respect these minimum sizes:
 *   MIN_TRACK_PX = 200       length of every linear control (hue strip, s and v sides of the square,
 *                            value strip, each RGB / HSL slider, both sides of the HSL square), endpoint
 *                            to endpoint + 1
 *   MIN_WHEEL_RADIUS = 100   disc radius in px (saturation 0..1 over >= 100 px; one px of arc is
 *                            <= 1.9 degrees of hue at the minimum goal saturation 0.3)
 * A drag lands within 1 px per axis of its target (fractional element offsets, integer pointer
 * coordinates). sample() only keeps goals where every such landing, on all controls at once, stays
 * within TAU_MARGIN * tau: linear controls are checked at -1/0/+1 px, the wheel on a ring of
 * WHEEL_TOL_PX (1.5 px, > sqrt 2) around the goal; HSL sets step h, s and l by one px each. The plan
 * treats a control as set once it is within that same distance, so it never repeats a drag that cannot
 * improve.
 *
 * Helpers (widget API, env.taskDef.helpers):
 *   math: color conversions, parsing, model readouts and CIEDE2000 / Lab calculations
 *   MIN_TRACK_PX: minimum length of linear controls, in pixels
 *   MIN_WHEEL_RADIUS: minimum hue/saturation disc radius, in pixels
 * Self-tests live in tasks/pick-color/selftest.js (loaded only by the checker and node tests).
 *
 * Round 2 hooks (optional, pure; see the html/kit/env.js header)
 *   facts(model, spec)       what a person reports back: the color the picker shows, as the page shows it. 'Selected
 *                            color' = the hex code of the model (readout or hex field; the base widget always
 *                            shows one when there are no typed fields); fields 'rgb' / 'both' add Red, Green, Blue
 *                            (the R, G, B fields). The value is the model's color, not the goal (within tau). aliases are
 *                            other spellings of the hex code; label paraphrases go in labels.
 *   parts(model, spec)       preempt=cancel: the picker's one "Selected color" (value: the model's rgb).
 *   silent(next, prev, spec, rng)   a channel rounded: rounds one color channel (then more) of the 8-bit color to a
 *                            multiple of 32/48/64 ("the picker snapped it to a coarse step"), keeping the first
 *                            rounding whose error exceeds tau; null when none does or in a judge episode.
 *   retarget(spec, model, rng)   a new color in the same scene: swatch/hex/hex-typed a new goal color (card, code and
 *                            typed text follow), named another name, palette a goal near another preset (spec.near
 *                            moves), image another region of the same illustration; null in a judge episode or when
 *                            no new goal is reachable within the pointer margin.
 *   judgeModes ambiguous, impossible (every scenario; spec.judge; the page starts on the stand-in goal, nothing to change;
 *                            the base widget hides the target card and code in these episodes; no confirm: the
 *                            picker has no irreversible step):
 *     ambiguous   the hex / named goal wording with "A or B" where the color would be (two codes in the goal's format, or hex;
 *                 two names for named); status ask, one option per candidate (cands: the code and its bare hex, or the
 *                 name and its aliases; both differ from the stand-in color the picker sits on, which is in others)
 *     impossible  a color the sRGB picker cannot make: a display-p3 or lab() value, an rgb() channel above 255, or a
 *                 name like "ultraviolet" (named); status impossible naming it (what: [that color text])
 *
 * Deviations from MiniWoB: graded ΔE instead of a fixed RGB distance; target formats, names, presets,
 * images and typed fields go beyond use-colorwheel(-2).
 */
(function () {
  'use strict';

  const { srgbToLab, deltaE00 } = env.util;

  const MIN_TRACK_PX = 200;
  const MIN_WHEEL_RADIUS = 100;
  const WHEEL_TOL_PX = 1.5;
  const TAU_MARGIN = 0.75;
  const STEP = 1 / (MIN_TRACK_PX - 1); // one pixel, as a fraction of a full linear control
  const CONTROLS = ['sv+hue', 'wheel+value', 'rgb', 'sl+hue', 'hsl'];
  const HSL_SETS = ['sl+hue', 'hsl'];
  const SCENARIOS = ['swatch', 'hex', 'named', 'palette', 'image', 'hex-typed'];
  const RAD = Math.PI / 180;

  // ---------------------------------------------------------------- color math

  // h in degrees, s and v in [0, 1] -> float sRGB in [0, 1]
  function hsvToRgbF(h, s, v) {
    const f = (n) => {
      const k = (n + h / 60) % 6;
      return v - v * s * Math.max(0, Math.min(k, 4 - k, 1));
    };
    return [f(5), f(3), f(1)];
  }

  const hsvToRgb = (h, s, v) => hsvToRgbF(h, s, v).map((c) => Math.round(Math.min(1, Math.max(0, c)) * 255));

  function rgbToHsv([r, g, b]) {
    const [R, G, B] = [r / 255, g / 255, b / 255];
    const max = Math.max(R, G, B);
    const d = max - Math.min(R, G, B);
    let h = 0;
    if (d > 0) {
      if (max === R) h = 60 * (((G - B) / d) % 6);
      else if (max === G) h = 60 * ((B - R) / d + 2);
      else h = 60 * ((R - G) / d + 4);
    }
    return { h: (h + 360) % 360, s: max === 0 ? 0 : d / max, v: max };
  }

  function hslToRgb(h, s, l) {
    const a = s * Math.min(l, 1 - l);
    const f = (n) => {
      const k = (n + h / 30) % 12;
      return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
    };
    return [f(0), f(8), f(4)].map((c) => Math.round(Math.min(1, Math.max(0, c)) * 255));
  }

  function rgbToHsl([r, g, b]) {
    const { h } = rgbToHsv([r, g, b]);
    const max = Math.max(r, g, b) / 255;
    const min = Math.min(r, g, b) / 255;
    const l = (max + min) / 2;
    const s = max === min ? 0 : (max - min) / (1 - Math.abs(2 * l - 1));
    return [h, s, l];
  }

  // HSV <-> HSL on floats (h in degrees, the rest in [0, 1]). Saturation is 0 where it is undefined.
  function hsvToHsl(h, s, v) {
    const l = v * (1 - s / 2);
    return [h, l <= 0 || l >= 1 ? 0 : (v - l) / Math.min(l, 1 - l), l];
  }

  function hslToHsv(h, s, l) {
    const v = l + s * Math.min(l, 1 - l);
    return { h, s: v <= 0 ? 0 : Math.min(1, Math.max(0, 2 * (1 - l / v))), v: Math.min(1, Math.max(0, v)) };
  }

  const hex = (rgb) => '#' + rgb.map((c) => c.toString(16).padStart(2, '0')).join('').toUpperCase();
  const fromHex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));

  // Parse what a person types into a color field: '#3FA2C4', '3fa2c4', 'rgb(63, 162, 196)'. null if invalid.
  function parseColor(text) {
    const t = String(text || '').trim();
    let m = /^#?([0-9a-f]{6})$/i.exec(t);
    if (m) return fromHex('#' + m[1]);
    m = /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/i.exec(t);
    if (m) {
      const c = m.slice(1, 4).map(Number);
      return c.every((x) => x <= 255) ? c : null;
    }
    return null;
  }

  const clamp01 = (x) => Math.min(1, Math.max(0, x));
  const modelRgb = (m) => hsvToRgb(m.h, clamp01(m.s), clamp01(m.v));
  const dE = (a, b) => deltaE00(srgbToLab(a), srgbToLab(b));
  const hueDist = (a, b) => {
    const d = Math.abs(a - b) % 360;
    return Math.min(d, 360 - d);
  };
  // Wheel position of (h, s), in px at MIN_WHEEL_RADIUS.
  const wheelXY = (h, s) => [MIN_WHEEL_RADIUS * s * Math.cos(h * RAD), MIN_WHEEL_RADIUS * s * Math.sin(h * RAD)];
  function wheelHS(x, y) {
    const r = Math.hypot(x, y);
    return { h: r === 0 ? 0 : ((Math.atan2(y, x) / RAD) + 360) % 360, s: Math.min(1, r / MIN_WHEEL_RADIUS) };
  }
  const modelHsl = (m) => hsvToHsl(m.h, clamp01(m.s), clamp01(m.v));
  const channels = (m) => hsvToRgbF(m.h, clamp01(m.s), clamp01(m.v)).map((c) => c * 255);
  const CH = { r: 0, g: 1, b: 2 };

  // Every 8-bit color reachable by landing within the pointer tolerance of the goal on all controls.
  function neighbours(goal, rgb, controls) {
    const out = [];
    const offs = [-1, 0, 1];
    if (controls === 'rgb') {
      for (const dr of offs) for (const dg of offs) for (const db of offs) {
        out.push([dr, dg, db].map((d, i) => Math.round(Math.min(255, Math.max(0, rgb[i] + d * 255 * STEP)))));
      }
      return out;
    }
    if (controls === 'wheel+value') {
      const [gx, gy] = wheelXY(goal.h, goal.s);
      const ring = [[0, 0]];
      for (let k = 0; k < 16; k++) ring.push([WHEEL_TOL_PX * Math.cos(k * Math.PI / 8), WHEEL_TOL_PX * Math.sin(k * Math.PI / 8)]);
      for (const [dx, dy] of ring) {
        const { h, s } = wheelHS(gx + dx, gy + dy);
        for (const dv of offs) out.push(hsvToRgb(h, s, clamp01(goal.v + dv * STEP)));
      }
      return out;
    }
    if (HSL_SETS.includes(controls)) {
      const [h, s, l] = hsvToHsl(goal.h, goal.s, goal.v);
      for (const dh of offs) for (const ds of offs) for (const dl of offs) {
        out.push(hslToRgb((h + dh * 360 * STEP + 360) % 360, clamp01(s + ds * STEP), clamp01(l + dl * STEP)));
      }
      return out;
    }
    for (const dh of offs) for (const ds of offs) for (const dv of offs) {
      out.push(hsvToRgb((goal.h + dh * 360 * STEP + 360) % 360, clamp01(goal.s + ds * STEP), clamp01(goal.v + dv * STEP)));
    }
    return out;
  }

  function worstNeighbour(goal, rgb, controls) {
    const lab = srgbToLab(rgb);
    let worst = 0;
    for (const n of neighbours(goal, rgb, controls)) worst = Math.max(worst, deltaE00(srgbToLab(n), lab));
    return worst;
  }

  // A goal color the pointer can reach within TAU_MARGIN * tau. opts: hue [lo, hi], sat, val ranges, ood.
  function sampleGoal(rng, controls, tau, opts = {}) {
    let best = null;
    for (let tries = 0; tries < 200; tries++) {
      const [h0, h1] = opts.hue || [0, 360];
      let sat = opts.sat || [0.3, 1];
      let val = opts.val || [0.35, 1];
      if (opts.ood) {
        if (rng.bool()) sat = [0.12, 0.3];
        else val = [0.2, 0.35];
      }
      const rgb = hsvToRgb((rng.float(h0, h1) + 360) % 360, rng.float(...sat), rng.float(...val));
      const goal = rgbToHsv(rgb);
      if (!opts.ood && (goal.s < 0.3 || goal.v < 0.35)) continue;
      if (opts.avoid && opts.avoid.some((c) => dE(c, rgb) < 15)) continue;
      const worst = worstNeighbour(goal, rgb, controls);
      if (!best || worst < best.worst) best = { rgb, goal, worst };
      if (worst <= TAU_MARGIN * tau) break;
    }
    return best;
  }

  // ---------------------------------------------------------------- banks

  // Color names with canonical hex; pairwise CIEDE2000 >= 16, so any color within the named tau (7) of one
  // name is at least 9 from every other name.
  const NAMED = [
    { name: 'red', hex: '#FF0000', aliases: ['bright red'] },
    { name: 'orange', hex: '#FFA500', aliases: [] },
    { name: 'yellow', hex: '#FFFF00', aliases: ['bright yellow'] },
    { name: 'green', hex: '#008000', aliases: [] },
    { name: 'blue', hex: '#0000FF', aliases: ['pure blue'] },
    { name: 'purple', hex: '#800080', aliases: [] },
    { name: 'brown', hex: '#A52A2A', aliases: [] },
    { name: 'teal', hex: '#008080', aliases: [] },
    { name: 'navy', hex: '#000080', aliases: ['navy blue'] },
    { name: 'olive', hex: '#808000', aliases: ['olive green'] },
    { name: 'cyan', hex: '#00FFFF', aliases: ['aqua'] },
    { name: 'magenta', hex: '#FF00FF', aliases: ['fuchsia'] },
    { name: 'lime', hex: '#00FF00', aliases: ['lime green'] },
    { name: 'salmon', hex: '#FA8072', aliases: [] },
    { name: 'sky blue', hex: '#87CEEB', aliases: ['light sky blue'] },
    { name: 'tan', hex: '#D2B48C', aliases: [] },
    { name: 'royal blue', hex: '#4169E1', aliases: [] },
    { name: 'mint', hex: '#3EB489', aliases: ['mint green'] },
    { name: 'charcoal', hex: '#36454F', aliases: ['charcoal grey'] },
    { name: 'plum', hex: '#DDA0DD', aliases: [] },
    { name: 'deep pink', hex: '#FF1493', aliases: [] },
  ].map((c) => ({ ...c, id: c.name, rgb: fromHex(c.hex) }));

  const PRESET_NAMES = ['Ocean', 'Sunset', 'Moss', 'Clay', 'Berry', 'Slate', 'Sand', 'Fern', 'Rust', 'Sky', 'Ink',
    'Peach', 'Lagoon', 'Denim', 'Honey', 'Ember', 'Pine', 'Lilac', 'Copper', 'Glacier', 'Cocoa', 'Meadow', 'Brick',
    'Orchid', 'Storm', 'Saffron', 'Harbor', 'Pebble', 'Cherry', 'Kelp', 'Dune', 'Iris', 'Aurora', 'Quartz', 'Willow',
    'Cypress', 'Opal', 'Coral', 'Birch', 'Juniper', 'Thistle', 'Fallow', 'Poppy', 'Fawn', 'Maple', 'Umber', 'Tundra',
    'Fjord', 'Oasis', 'Delta', 'Reef', 'Gale', 'Haze', 'Nimbus', 'Zephyr', 'Eclipse', 'Lunar', 'Comet', 'Orbit',
    'Nova', 'Vesper', 'Fable', 'Echo', 'Rune', 'Velvet', 'Linen', 'Suede', 'Marble', 'Granite', 'Papaya', 'Guava',
    'Melon', 'Flicker', 'Topaz', 'Onyx', 'Jasper', 'Agate', 'Garnet', 'Citrine', 'Sable', 'Sepia', 'Shimmer', 'Ripple',
    'Wisp', 'Fleck', 'Mica', 'Basalt', 'Flint', 'Pumice', 'Lichen', 'Heath', 'Thicket', 'Balsam', 'Laurel', 'Clover',
    'Sage', 'Aster', 'Dahlia', 'Zinnia', 'Lotus', 'Peony', 'Azalea', 'Briar', 'Sorrel', 'Rowan', 'Alder', 'Acorn',
    'Cirrus', 'Monsoon', 'Canyon', 'Prairie', 'Swell', 'Mallow', 'Sienna', 'Boreal', 'Taffy', 'Pollen', 'Kestrel',
    'Mistral', 'Cassis', 'Biscuit', 'Silt', 'Gloam', 'Cameo', 'Cress', 'Dapple', 'Tinsel', 'Flurry', 'Tropic', 'Beryl',
    'Caper', 'Wattle', 'Batik', 'Mosaic', 'Fossil', 'Pecan', 'Madder', 'Chalk', 'Rill', 'Grotto', 'Serein', 'Auburn',
    'Mauve', 'Sedge', 'Plover', 'Calico', 'Luster', 'Quince', 'Yarrow', 'Flax', 'Moraine', 'Rattan'];
  const TARGET_LABELS = [
    'Target', 'Sample', 'Reference', 'Match this', 'Goal color', 'Desired', 'Source', 'Benchmark', 'Comparison',
    'Prototype', 'Color key', 'Paint chip', 'Test card', 'Guide', 'Approved'
  ];

  // Illustration regions (geometry lives in the widgets). hue: plausible hue range for non-target regions.
  const SCENES = {
    house: [
      { id: 'sky', name: 'sky', hue: [185, 225], sat: [0.2, 0.6], val: [0.8, 1] },
      { id: 'sun', name: 'sun', hue: [38, 58], sat: [0.6, 1], val: [0.9, 1] },
      { id: 'roof', name: 'roof', hue: [0, 30], sat: [0.5, 0.9], val: [0.45, 0.85] },
      { id: 'wall', name: 'wall of the house', hue: [20, 60], sat: [0.1, 0.4], val: [0.75, 0.95] },
      { id: 'door', name: 'door', hue: [10, 40], sat: [0.4, 0.8], val: [0.3, 0.6] },
      { id: 'window', name: 'window', hue: [180, 220], sat: [0.2, 0.5], val: [0.85, 1] },
      { id: 'grass', name: 'grass', hue: [75, 140], sat: [0.4, 0.8], val: [0.45, 0.8] },
      { id: 'crown', name: 'treetop', hue: [90, 150], sat: [0.4, 0.8], val: [0.3, 0.6] },
      { id: 'trunk', name: 'tree trunk', hue: [18, 38], sat: [0.4, 0.7], val: [0.25, 0.45] },
    ],
    landscape: [
      { id: 'sky', name: 'sky', hue: [190, 230], sat: [0.2, 0.55], val: [0.8, 1] },
      { id: 'sun', name: 'sun', hue: [25, 55], sat: [0.6, 1], val: [0.9, 1] },
      { id: 'mountain', name: 'mountain', hue: [210, 270], sat: [0.15, 0.45], val: [0.4, 0.7] },
      { id: 'hill', name: 'hill', hue: [80, 140], sat: [0.35, 0.7], val: [0.35, 0.65] },
      { id: 'lake', name: 'lake', hue: [180, 215], sat: [0.4, 0.8], val: [0.45, 0.8] },
      { id: 'sail', name: 'sail', hue: [0, 360], sat: [0.5, 0.9], val: [0.75, 1] },
      { id: 'hull', name: 'boat hull', hue: [0, 40], sat: [0.4, 0.8], val: [0.3, 0.6] },
      { id: 'field', name: 'field', hue: [40, 75], sat: [0.4, 0.8], val: [0.6, 0.9] },
    ],
    still: [
      { id: 'wall', name: 'background wall', hue: [20, 60], sat: [0.05, 0.3], val: [0.8, 0.95] },
      { id: 'table', name: 'table', hue: [18, 40], sat: [0.35, 0.7], val: [0.35, 0.6] },
      { id: 'mug', name: 'mug', hue: [0, 360], sat: [0.5, 0.9], val: [0.5, 0.9] },
      { id: 'book', name: 'book', hue: [0, 360], sat: [0.5, 0.9], val: [0.4, 0.8] },
      { id: 'apple', name: 'apple', hue: [-15, 15], sat: [0.6, 0.95], val: [0.6, 0.9] },
      { id: 'vase', name: 'vase', hue: [0, 360], sat: [0.4, 0.9], val: [0.5, 0.9] },
      { id: 'plate', name: 'plate', hue: [0, 360], sat: [0.05, 0.3], val: [0.85, 1] },
    ],
  };
  const SCENE_PREFIX = { house: ['picture', 'image', 'drawing'], landscape: ['picture', 'image', 'painting'],
    still: ['photo', 'picture', 'image'], tiles: ['mosaic', 'tile grid', 'image'] };

  // ---------------------------------------------------------------- plan

  function fieldsHex(spec) {
    return spec.fields === 'hex' || spec.fields === 'both';
  }

  // Index of a preset whose color is closest to the model (to know which preset is applied).
  function presetError(spec, i) {
    return dE(fromHex(spec.presets[i].hex), spec.rgb);
  }

  // Next step in model terms. Popover widgets open the popover before any step that acts inside it (drags and
  // typing: the fields live in the popover too); clicks on presets, the eyedropper or the image are outside.
  function plan(model, spec) {
    const step = basePlan(model, spec);
    if (spec.popover && !model.open && (step.drag || step.type)) return { click: { popover: 'open' } };
    return step;
  }

  function basePlan(model, spec) {
    const g = spec.goal;
    const cur = (surface) => ({ surface, current: true });
    const err = task.error(model, spec);

    if (spec.route === 'type' && spec.fields) {
      if (fieldsHex(spec)) return { type: [{ field: 'hex' }, spec.typeText] };
      const now = channels(model);
      let i = now.findIndex((c, k) => Math.abs(c - spec.rgb[k]) > 0.5);
      if (i < 0) i = 0;
      return { type: [{ field: 'rgb'[i] }, String(spec.rgb[i])] };
    }
    if (spec.scenario === 'image' && spec.eyedropper) {
      if (!model.picking) return { click: { tool: 'eyedropper' } };
      return { click: { region: spec.scene.target } };
    }
    // Apply the close preset once (model.preset remembers the last preset clicked), then fine-tune.
    if (spec.scenario === 'palette' && model.preset !== spec.near && err > presetError(spec, spec.near) + 0.5) {
      return { click: { preset: spec.near } };
    }
    if (spec.controls === 'rgb') {
      const diff = channels(model).map((c, i) => Math.abs(c - spec.rgb[i]));
      let i = diff.findIndex((d) => d > 255 * STEP);
      if (i < 0) i = diff.indexOf(Math.max(...diff));
      const surface = 'rgb'[i];
      return { drag: [cur(surface), { surface, value: spec.rgb[i] }] };
    }
    if (spec.controls === 'hsl') {
      const now = modelHsl(model);
      const want = hsvToHsl(g.h, g.s, g.v);
      if (hueDist(model.h, g.h) > 360 * STEP) return { drag: [cur('hue'), { surface: 'hue', h: g.h }] };
      if (Math.abs(now[2] - want[2]) > STEP) return { drag: [cur('light'), { surface: 'light', l: want[2] }] };
      return { drag: [cur('sat'), { surface: 'sat', s: want[1] }] };
    }
    if (spec.controls === 'sl+hue') {
      const [, s, l] = hsvToHsl(g.h, g.s, g.v);
      if (hueDist(model.h, g.h) > 360 * STEP) return { drag: [cur('hue'), { surface: 'hue', h: g.h }] };
      return { drag: [cur('sl'), { surface: 'sl', s, l }] };
    }
    if (spec.controls === 'wheel+value') {
      const [x, y] = wheelXY(model.h, clamp01(model.s));
      const [gx, gy] = wheelXY(g.h, g.s);
      if (Math.hypot(x - gx, y - gy) > WHEEL_TOL_PX) return { drag: [cur('wheel'), { surface: 'wheel', h: g.h, s: g.s }] };
      return { drag: [cur('value'), { surface: 'value', v: g.v }] };
    }
    // sv+hue. The kit only asks for a plan while error > tau, so with the hue set the remaining
    // step is always saturation/value.
    if (hueDist(model.h, g.h) > 360 * STEP) return { drag: [cur('hue'), { surface: 'hue', h: g.h }] };
    return { drag: [cur('sv'), { surface: 'sv', s: g.s, v: g.v }] };
  }

  // ---------------------------------------------------------------- sampling helpers

  function codeOf(rgb, format, rng) {
    if (format === 'rgb') return `rgb(${rgb.join(', ')})`;
    if (format === 'hsl') {
      const [h, s, l] = rgbToHsl(rgb);
      return `hsl(${Math.round(h)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
    }
    const h = hex(rgb);
    return rng.pick([h, h, h.toLowerCase(), `hex ${h.slice(1)}`]);
  }

  // hsl goals are re-quantized so the integer hsl() text denotes the goal exactly.
  function hslExact(rgb) {
    const [h, s, l] = rgbToHsl(rgb);
    return hslToRgb(Math.round(h), Math.round(s * 100) / 100, Math.round(l * 100) / 100);
  }

  function nearPreset(rng, goal, rgb, tau) {
    for (let k = 0; k < 400; k++) {
      const c = hsvToRgb((goal.h + rng.float(-25, 25) + 360) % 360, clamp01(goal.s + rng.float(-0.25, 0.25)),
        clamp01(goal.v + rng.float(-0.25, 0.25)));
      const d = dE(c, rgb);
      if (d >= 3 * tau && d <= 6 * tau) return c;
    }
    return hsvToRgb((goal.h + 12) % 360, clamp01(goal.s - 0.1), clamp01(goal.v - 0.1));
  }

  function sampleScene(rng, spec, controls, tau, opts) {
    const kind = rng.pick(opts.ood ? ['house', 'landscape', 'still', 'tiles', 'tiles'] : ['house', 'landscape', 'still', 'tiles']);
    let defs;
    let rows = 0;
    let cols = 0;
    if (kind === 'tiles') {
      rows = opts.ood ? rng.int(5, 6) : rng.int(3, 4);
      cols = opts.ood ? rng.int(5, 7) : rng.int(3, 5);
      defs = [];
      for (let r = 1; r <= rows; r++) {
        for (let c = 1; c <= cols; c++) defs.push({ id: `t${r}-${c}`, name: `tile in row ${r}, column ${c}`, hue: [0, 360], sat: [0.3, 0.95], val: [0.4, 1] });
      }
    } else defs = SCENES[kind];
    const target = rng.pick(defs);
    const best = sampleGoal(rng, controls, tau, { hue: rng.bool(0.6) ? target.hue : null, ood: opts.ood });
    const regions = [];
    const used = [best.rgb];
    for (const d of defs) {
      if (d === target) {
        regions.push({ id: d.id, name: d.name, hex: hex(best.rgb) });
        continue;
      }
      let rgb;
      for (let k = 0; k < 60; k++) {
        rgb = hsvToRgb((rng.float(...d.hue) + 360) % 360, rng.float(...d.sat), rng.float(...d.val));
        if (dE(rgb, best.rgb) >= 15 && used.every((u) => dE(rgb, u) >= 6)) break;
      }
      used.push(rgb);
      regions.push({ id: d.id, name: d.name, hex: hex(rgb) });
    }
    const mark = kind === 'tiles' ? rng.pick(['name', 'name', 'pin']) : rng.pick(['name', 'name', 'pin']);
    return { best, scene: { kind, rows, cols, regions, target: target.id, mark } };
  }

  // ---------------------------------------------------------------- instructions

  const I = env.instruct;

  const T = {
    swatch: [
      'Use the picker to match the {target}{tol}.',
      'Pick the color shown in the {target}{tol}.',
      'Make the current color match the {target}{tol}.',
      'Adjust the color picker until it matches the {target}{tol}.',
      'Set the picker to the same color as the {target}{tol}.',
      'Copy the color of the {target} into the picker by eye{tol}.',
      'The selected color should look exactly like the {target}{tol}. Fix it.',
      'Recreate the {target} color with the picker{tol}.',
      'Bring the picker color into line with the {target}{tol}.',
      'Please match what you see in the {target}{tol}.',
      'The {target} shows the color to put in the picker{tol}.',
      'Give the picker the color you see in the {target}{tol}.',
      'The picker and the {target} should agree on color{tol}.',
      'Aim to match the {target} in the picker{tol}.',
      'The color to select is the one in the {target}{tol}.',
      'Get the picker showing the color of the {target}{tol}.',
    ],
    hex: [
      'Use the picker to choose {code}{tol}.',
      'Set the color picker to {code}{tol}.',
      'Change the color to {code}{tol}.',
      'Pick {code} with the color picker{tol}.',
      'Make the selected color {code}{tol}.',
      'The brand color is {code}. Set the picker to it{tol}.',
      'Select the color {code}{tol}.',
      'Dial in {code} on the color picker{tol}.',
      '{code} is the goal. Adjust the picker{tol}.',
      'Make sure the picker shows {code}{tol}.',
      'The color needs to be {code}{tol}.',
      'Please bring the picker to {code}{tol}.',
      'The picker is meant to be {code}{tol}.',
      'Pick a color matching {code}{tol}.',
      'Your color choice should be {code}{tol}.',
    ],
    named: [
      'Set the color to {name}.',
      'Change the color to {name}.',
      'Make it {name}.',
      'Choose {name} in the color picker.',
      'Use the picker to select {name}.',
      'I want this in {name}, please set the picker accordingly.',
      'Pick a {name} color.',
      'Switch the selected color to {name}.',
      'For this color, the goal is {name}.',
      'Please aim for {name} here.',
      '{name} is the color to use.',
      'The picker should show {name}.',
      'For the color, go with {name}.',
      'Adjust until the picker shows {name}.',
      'Have {name} as the active color.',
      'The requested shade is {name}.',
      'Use {name} for the selection.',
      'I have {name} in mind this time.',
      '{name} belongs in the picker.',
      'I need the picker set to {name}.',
      'This calls for {name} as the color.',
      'Let the color choice be {name}.',
      '{name}, please, for the picker.',
      'Please make sure {name} is selected.',
    ],
    palette: [
      'Start from the closest preset, then fine-tune the color to match the {target}{tol}.',
      'Match the {target}{tol}. One of the presets gets you close; adjust from there.',
      'Pick the preset nearest the {target} and tweak it until the colors match{tol}.',
      'Make the current color match the {target}{tol}; presets are a good starting point.',
      'Use a preset as a base and fine-tune it to the {target}{tol}.',
      'Get the color to match the {target}{tol}. Starting from a preset is fastest.',
      'Choose the closest preset, then adjust the picker so it equals the {target}{tol}.',
      'The {target} is the goal. Refine the preset that comes closest to it{tol}.',
      'From the presets, take the best starting color and tune it to the {target}{tol}.',
      'The best preset gives you a head start. Tune it to match the {target}{tol}.',
      'Bring the picker into line with the {target}{tol}, refining the nearest preset.',
      'The presets offer a close match; refine the best one to match the {target}{tol}.',
      'With the nearest preset as a base, match the {target} by tuning the picker{tol}.',
      'Let the closest preset supply the base color; refine it to the {target}{tol}.',
      'For the {target}, begin with the best preset and finish by fine-tuning{tol}.',
    ],
    paletteHex: [
      'Start from the closest preset, then fine-tune the color to {code}{tol}.',
      'Set the color to {code}{tol}. One of the presets is close; adjust from there.',
      'Pick the preset nearest {code} and tweak it until it is exactly {code}{tol}.',
      'Make the color {code}{tol}; presets are a good starting point.',
      'Use a preset as a base and fine-tune it to {code}{tol}.',
      'Get the picker to {code}{tol}. Starting from a preset is fastest.',
      'Use {code} as the goal; refine the nearest preset to reach it{tol}.',
      'The nearest preset gets you started. Tune it to match {code}{tol}.',
      'To reach {code}, use the closest preset and fine-tune the picker{tol}.',
      'The picker needs {code}{tol}. Refine the preset that gets you closest.',
      'First find the best preset for {code}; then fine-tune to match{tol}.',
      'Refine the nearest preset in the picker for a match to {code}{tol}.',
      'A preset gets you partway to {code}; use the closest and refine it{tol}.',
      'Let the closest preset supply a base; refine it to match {code}{tol}.',
      'For {code}, begin with the best preset and finish by tuning{tol}.',
      '{code} is the destination. Begin at the nearest preset and tune{tol}.',
    ],
    image: [
      'Set the picker to the color of the {region} in the {pic}{tol}.',
      'Match the color of the {region} in the {pic}{tol}.',
      'Pick the exact color of the {region} in the {pic}{tol}.',
      'Make the current color the same as the {region} in the {pic}{tol}.',
      'Copy the color of the {region} from the {pic} into the picker{tol}.',
      'Use the color of the {region} shown in the {pic}{tol}.',
      'Find the {region} in the {pic} and select its color{tol}.',
      'Your picker should match the {region} in the {pic}{tol}.',
      'Your picker color comes from the {region} in the {pic}{tol}.',
      'Use the {region} in the {pic} as a color model for the picker{tol}.',
      'See the {region} in the {pic}. Give the picker its color{tol}.',
    ],
    'hex-typed': [
      'Enter {code} in the color fields{tol}.',
      'Type the color {code} into the picker{tol}.',
      'Set the color to {code} by typing it in{tol}.',
      'Change the color to {code}{tol}.',
      'Fill in the color value {code}{tol}.',
      'Update the color to {code} using the input fields{tol}.',
      'The color should be {code}. Type it in{tol}.',
      'Use typed values to reach {code}{tol}.',
      'Match {code}{tol} through keyboard entry.',
      'Adjust the fields until you get {code}{tol}.',
      'Replace the field values to reach {code}{tol}.',
      '{code} is the target for typed values{tol}.',
      'Reach {code} by editing the fields{tol}.',
      'Key in values to give {code}{tol}.',
      'The fields need values matching {code}{tol}.',
      'Type in the picker fields. Aim for {code}{tol}.',
      'Make your field entries produce {code}{tol}.',
    ],
  };

  function regionPhrase(spec) {
    const sc = spec.scene;
    if (sc.mark === 'pin') return sc.kind === 'tiles' ? 'tile marked with the pin' : 'area marked with the pin';
    return sc.regions.find((r) => r.id === sc.target).name;
  }

  // ---------------------------------------------------------------- round 2: judge modes, silent, retarget

  // Colors the sRGB picker cannot produce (impossible), written as the goal would.
  const NO_COLOR_NAMES = [
    'ultraviolet', 'infrared', 'transparent', 'invisible', 'x-ray green', 'clear', 'radio wave', 'microwave',
    'gamma ray'
  ];

  function impossibleColor(jr, spec) {
    if (spec.scenario === 'named') return jr.pick(NO_COLOR_NAMES);
    const f2 = () => jr.float(0, 1).toFixed(2);
    return jr.pick([
      () => `color(display-p3 ${jr.float(0.9, 1).toFixed(2)} ${f2()} ${jr.float(0, 0.2).toFixed(2)})`,
      () => `rgb(${jr.int(256, 400)}, ${jr.int(0, 255)}, ${jr.int(0, 255)})`,
      () => `lab(${jr.int(60, 90)} ${jr.int(100, 125)} ${-jr.int(60, 110)})`,
    ])();
  }

  // Every scenario builds both modes (the checker requires it): the stand-in goal is the sampled one, the instruction
  // names codes or names the page does not hold, and the widget hides the target card / code (it would show the stand-in).
  function judgeOf(jr, spec, mode) {
    if (mode === 'impossible') {
      const what = impossibleColor(jr, spec);
      return { mode, what: [what], message: `I can't do that: ${what} is outside the colors the picker can make.` };
    }
    // ambiguous: two candidates, in the goal's format or as hex, both different from the stand-in color the picker sits on
    // (and shows): that one is in `others`, so a reply that just copies the page's text names it and fails.
    let a;
    let b;
    let cands;
    let others;
    if (spec.scenario === 'named') {
      const [c, d] = jr.sample(NAMED.filter((x) => x.name !== spec.name), 2);
      a = c.name;
      b = d.name;
      cands = [[c.name, ...c.aliases], [d.name, ...d.aliases]];
      others = [[spec.name, ...spec.aliases, spec.hex, spec.hex.slice(1)]];
    } else {
      const format = spec.format || 'hex';
      const one = sampleGoal(jr, spec.controls, spec.tau, { ood: spec.ood, avoid: [spec.rgb] });
      const two = sampleGoal(jr, spec.controls, spec.tau, { ood: spec.ood, avoid: [spec.rgb, one.rgb] });
      const rgbs = [one, two].map((g) => (format === 'hsl' ? hslExact(g.rgb) : g.rgb));
      [a, b] = rgbs.map((rgb) => codeOf(rgb, format, jr));
      cands = rgbs.map((rgb, i) => [i ? b : a, hex(rgb).slice(1)]);
      others = [[...new Set([spec.hex, spec.hex.slice(1), spec.code].filter(Boolean))]];
    }
    return { mode, cands, others, message: `Which color should I use: ${a} or ${b}?`, vars: { a, b } };
  }

  // The task's own goal wording for a code or a name (hex / named templates), with the judge episode's color text where
  // the goal color would be: both candidates ("A or B") or the impossible color.
  function judgeInstruction(spec, rng) {
    const j = spec.judge;
    const ins = I;
    const text = j.mode === 'ambiguous' ? `${j.vars.a} or ${j.vars.b}` : j.what[0];
    const core = ins.phrase(rng, spec.scenario === 'named' ? T.named : T.hex, { name: text, code: text, tol: '' }, spec.isplit);
    return ins.say(rng, core, { isplit: spec.isplit, terse: spec.scenario === 'named' ? `color: ${text}` : `color ${text}`, typo: 0 });
  }

  // A new goal color for spec (same controls, tau and scene). Returns the changed spec fields or null.
  function newGoal(spec, rng) {
    const tau = spec.tau;
    const margin = TAU_MARGIN * tau;
    const v = spec.scenario;
    if (v === 'named') {
      const c = rng.pick(NAMED.filter((x) => x.name !== spec.name));
      return { name: c.name, aliases: c.aliases, rgb: c.rgb.slice(), goal: rgbToHsv(c.rgb) };
    }
    if (v === 'image') {
      const ok = spec.scene.regions.filter((r) => r.id !== spec.scene.target
        && worstNeighbour(rgbToHsv(fromHex(r.hex)), fromHex(r.hex), spec.controls) <= margin);
      if (!ok.length) return null;
      const r = rng.pick(ok);
      return { scene: { ...spec.scene, target: r.id }, rgb: fromHex(r.hex), goal: rgbToHsv(fromHex(r.hex)) };
    }
    if (v === 'palette') {
      const others = spec.presets.map((p, i) => i).filter((i) => i !== spec.near);
      const near = rng.pick(others);
      const base = fromHex(spec.presets[near].hex);
      for (let k = 0; k < 60; k++) {
        const c = nearPreset(rng, rgbToHsv(base), base, tau);
        const d = dE(c, base);
        const goal = rgbToHsv(c);
        if (d >= 3 * tau && d <= 6 * tau && spec.presets.every((p, i) => i === near || dE(fromHex(p.hex), c) >= d + 3)
          && worstNeighbour(goal, c, spec.controls) <= margin) return { near, rgb: c, goal };
      }
      return null;
    }
    let best = sampleGoal(rng, spec.controls, tau, { ood: spec.ood, avoid: [spec.rgb] });
    if (spec.format === 'hsl') {
      const rgb = hslExact(best.rgb);
      best = { rgb, goal: rgbToHsv(rgb) };
    }
    return { rgb: best.rgb, goal: best.goal };
  }

  // ---------------------------------------------------------------- task

  const task = {
    name: 'pick-color',
    scenarios: SCENARIOS,
    startModes: ['off', 'partial', 'wrong', 'solved'],
    judgeModes: ['ambiguous', 'impossible'],
    inputs: (spec) => (spec && spec.keys ? ['pointer', 'keyboard'] : ['pointer']),
    lib: { CONTROLS, NAMED, clamp01, wheelXY, wheelHS, CH, dE },
    helpers: {
      MIN_TRACK_PX,
      MIN_WHEEL_RADIUS,
      math: { hsvToRgb, hsvToRgbF, rgbToHsv, hex, fromHex, srgbToLab, deltaE00, modelRgb, channels, parseColor,
        hsvToHsl, hslToHsv, modelHsl, hslToRgb, rgbToHsl },
    },


    sample(rng, opts) {
      const scenario = opts.scenario || rng.pick(opts.scenarios && opts.scenarios.length ? opts.scenarios : SCENARIOS);
      const controls = (opts.traits && opts.traits.controls) || 'sv+hue';
      if (!CONTROLS.includes(controls)) throw new Error(`color: unknown traits.controls '${controls}' (have ${CONTROLS.join(', ')})`);
      const ood = !!opts.ood;
      const cs = { csplit: opts.csplit };
      const spec = {
        scenario, controls, isplit: opts.isplit || 'train', csplit: opts.csplit || 'train', ood,
        startMode: opts.startMode || 'off',
        tau: rng.pick([3, 4, 5]),
        targetLabel: rng.pick(TARGET_LABELS),
      };
      if (opts.traits && opts.traits.popover) spec.popover = true;
      let best;
      if (scenario === 'named') {
        const c = env.content.pick(rng, NAMED, cs);
        spec.tau = ood ? 5 : 7;
        spec.name = c.name;
        spec.aliases = c.aliases;
        best = { rgb: c.rgb.slice(), goal: rgbToHsv(c.rgb) };
      } else if (scenario === 'image') {
        const s = sampleScene(rng, spec, controls, spec.tau, { ood });
        best = s.best;
        spec.scene = s.scene;
        spec.eyedropper = rng.bool(0.5);
      } else {
        best = sampleGoal(rng, controls, spec.tau, { ood });
      }
      if (scenario === 'hex' || scenario === 'hex-typed') {
        spec.format = rng.pick(ood ? ['hex', 'rgb', 'hsl'] : ['hex', 'hex', 'rgb']);
        if (spec.format === 'hsl') {
          const rgb = hslExact(best.rgb);
          best = { rgb, goal: rgbToHsv(rgb) };
        }
      }
      spec.rgb = best.rgb;
      spec.goal = best.goal;
      spec.hex = hex(best.rgb);
      if (scenario === 'palette') {
        spec.ref = rng.pick(['swatch', 'hex']);
        const n = ood ? rng.int(14, 18) : rng.int(6, 10);
        const names = env.content.sample(rng, PRESET_NAMES, n, cs);
        const near = nearPreset(rng, best.goal, best.rgb, spec.tau);
        const colors = [near];
        for (let k = 0; colors.length < n && k < 2000; k++) {
          const c = hsvToRgb(rng.float(0, 360), rng.float(0.25, 0.95), rng.float(0.3, 1));
          if (dE(c, best.rgb) >= 20 && colors.every((o) => dE(o, c) >= 10)) colors.push(c);
        }
        const order = rng.shuffle(colors.map((c, i) => i));
        spec.presets = order.map((i, k) => ({ name: names[k % names.length], hex: hex(colors[i]) }));
        spec.near = order.indexOf(0);
        if (spec.ref === 'hex') spec.format = 'hex';
      }
      spec.code = spec.format ? codeOf(spec.rgb, spec.format, rng) : null;
      spec.showCode = scenario === 'hex-typed' ? rng.bool(0.3) : scenario === 'hex' ? rng.bool(0.7) : false;

      // Input routes.
      if (scenario === 'hex-typed') {
        spec.keys = true;
        spec.fields = rng.pick(['hex', 'rgb', 'both']);
        spec.route = 'type';
      } else {
        spec.keys = rng.bool(0.25);
        spec.fields = spec.keys ? 'hex' : null;
        const knowsCode = scenario === 'hex' || (scenario === 'palette' && spec.ref === 'hex');
        spec.route = spec.keys && knowsCode && rng.bool(0.5) ? 'type' : 'drag';
        // The route knob overrides the mix after the same draws, so an unset knob keeps every seed as it was.
        if (opts.route === 'keyboard' && knowsCode) Object.assign(spec, { keys: true, fields: 'hex', route: 'type' });
        else if (opts.route === 'pointer') Object.assign(spec, { keys: false, fields: null, route: 'drag' });
      }
      if (spec.fields) {
        const h = spec.hex;
        spec.typeText = rng.pick([h, h.toLowerCase(), h.slice(1)]);
      }
      if (opts.level === 'easy' || opts.level === 'medium') {
        const f = opts.level === 'easy' ? 2 : 1.5;
        spec.level = opts.level;
        spec.tau = Math.min(spec.tau * f, scenario === 'named' ? 11 : 99);
        if (spec.presets) {
          const keep = opts.level === 'easy' ? 5 : 7;
          if (spec.presets.length > keep) {
            const idx = spec.presets.map((_, i) => i).filter((i) => i !== spec.near).slice(0, keep - 1);
            idx.push(spec.near);
            idx.sort((a, b) => a - b);
            spec.presets = idx.map((i) => spec.presets[i]);
            spec.near = idx.indexOf(spec.near);
          }
        }
      }
      if (task.judgeModes.includes(opts.judge)) {
        const j = judgeOf(rng.fork('judge'), spec, opts.judge);
        if (j) spec.judge = j;
      }
      return spec;
    },

    init(spec, rng) {
      if (spec.judge) return task.solve(spec, null); // nothing to change
      const base = { h: rng.float(0, 360), s: rng.float(0, 1), v: rng.float(0, 1) };
      if (spec.scenario === 'image') base.picking = false;
      if (spec.popover) base.open = false;
      const mode = spec.startMode;
      const g = spec.goal;
      const withRgb = (rgb) => ({ ...base, ...rgbToHsv(rgb) });
      if (mode === 'partial') {
        if (spec.scenario === 'palette') return { ...withRgb(fromHex(spec.presets[spec.near].hex)), preset: spec.near };
        if (spec.scenario === 'image' && spec.eyedropper) return { ...base, picking: true };
        if (spec.controls === 'rgb') {
          const c = spec.rgb.slice();
          const k = rng.int(0, 2);
          c[k] = (c[k] + rng.int(70, 185)) % 256;
          return withRgb(c);
        }
        if (spec.controls === 'wheel+value') {
          return { ...base, h: g.h, s: g.s, v: g.v > 0.6 ? rng.float(0.05, g.v - 0.3) : rng.float(g.v + 0.3, 1) };
        }
        if (spec.controls === 'hsl') {
          const [, s, l] = hsvToHsl(g.h, g.s, g.v);
          return { ...base, ...hslToHsv(g.h, s, l > 0.5 ? rng.float(0.05, l - 0.3) : rng.float(l + 0.3, 0.95)) };
        }
        return { ...base, h: g.h };
      }
      if (mode === 'wrong') {
        if (spec.scenario === 'named') {
          let near = null;
          for (const c of NAMED) {
            if (c.name === spec.name) continue;
            const d = dE(c.rgb, spec.rgb);
            if (!near || d < near.d) near = { c, d };
          }
          return withRgb(near.c.rgb);
        }
        if (spec.scenario === 'palette') {
          const others = spec.presets.map((p, i) => i).filter((i) => i !== spec.near);
          const k = rng.pick(others);
          return { ...withRgb(fromHex(spec.presets[k].hex)), preset: k };
        }
        if (spec.scenario === 'image') {
          const others = spec.scene.regions.filter((r) => r.id !== spec.scene.target);
          return withRgb(fromHex(rng.pick(others).hex));
        }
        if (spec.scenario === 'hex' || spec.scenario === 'hex-typed') {
          const [r, gg, b] = spec.rgb;
          const swapped = rng.pick([[b, gg, r], [gg, r, b], [r, b, gg]]);
          if (dE(swapped, spec.rgb) > 2 * spec.tau) return withRgb(swapped);
        }
        return rng.bool()
          ? { ...base, h: (g.h + 180) % 360, s: g.s, v: g.v }
          : { ...base, h: g.h, s: g.s, v: g.v > 0.55 ? g.v - 0.35 : g.v + 0.35 };
      }
      return base;
    },

    error(model, spec) {
      return deltaE00(srgbToLab(modelRgb(model)), srgbToLab(spec.rgb));
    },

    tolerance(spec) {
      return { tau: spec.tau };
    },

    facts(model, spec) {
      const rgb = modelRgb(model);
      const code = hex(rgb);
      const out = [];
      if (spec.fields !== 'rgb') {
        out.push({ label: 'Selected color', value: code, aliases: [code.toLowerCase(), code.slice(1)], labels: ['Hex', 'Hex color', 'Current color', 'Color'] });
      }
      if (spec.fields === 'rgb' || spec.fields === 'both') {
        ['Red', 'Green', 'Blue'].forEach((label, i) => out.push({ label, value: String(rgb[i]), labels: ['RGB'[i]] }));
      }
      return out;
    },

    parts: (model) => [{ name: 'Selected color', value: modelRgb(model), aliases: ['Color', 'Current color'] }],

    silent(next, prev, spec, rng) {
      const step = rng.pick([32, 48, 64]);
      const first = rng.int(0, 2);
      if (spec.judge) return null;
      const c = modelRgb(next);
      // A coarser step if rounding to the first one stays within tau (a larger step is a rougher snap).
      for (const q of [step, 64, 85]) {
        const cur = c.slice();
        for (let n = 0; n < 3; n++) {
          const k = (first + n) % 3;
          cur[k] = Math.min(255, Math.round(cur[k] / q) * q);
          if (cur.join() === c.join()) continue;
          const out = { ...next, ...rgbToHsv(cur) };
          if (task.error(out, spec) > spec.tau) return out;
        }
      }
      return null;
    },

    retarget(spec, model, rng) {
      if (spec.judge) return null;
      for (let k = 0; k < 8; k++) {
        const g = newGoal(spec, rng);
        if (!g) return null;
        if (dE(g.rgb, spec.rgb) < 3 * spec.tau) continue;
        const out = { ...spec, ...g, hex: hex(g.rgb) };
        if (spec.format) out.code = codeOf(g.rgb, spec.format, rng);
        if (spec.fields) {
          const h = out.hex;
          out.typeText = rng.pick([h, h.toLowerCase(), h.slice(1)]);
        }
        if (task.error(model, out) > spec.tau) return out;
      }
      return null;
    },

    instruction(spec, rng) {
      if (spec.judge) return judgeInstruction(spec, rng);
      const ins = I;
      const tolText = rng.pick([`(ΔE00 ≤ ${spec.tau})`, `within ΔE ${spec.tau}`, `(ΔE ≤ ${spec.tau})`, `to within ΔE00 ${spec.tau}`]);
      const tolPh = ins.tol(rng, tolText, 0.5);
      const label = spec.targetLabel;
      const lbl = label.toLowerCase();
      const target = rng.pick([`${lbl} swatch`, `“${label}” swatch`, `swatch labeled “${label}”`,
        /color/.test(lbl) ? `${lbl} swatch` : `${lbl} color`]);
      const vars = {
        tol: tolPh ? ' ' + tolPh : '',
        target,
        code: spec.code,
        name: spec.name && ins.alias(rng, spec.name, spec.aliases, 0.25),
        region: spec.scene && regionPhrase(spec),
        pic: spec.scene && rng.pick(SCENE_PREFIX[spec.scene.kind]),
      };
      const key = spec.scenario === 'palette' && spec.ref === 'hex' ? 'paletteHex' : spec.scenario;
      const core = ins.phrase(rng, T[key], vars, spec.isplit);
      let terse;
      let steps;
      if (spec.scenario === 'swatch') terse = `match the “${label}” swatch`;
      else if (spec.scenario === 'hex' || spec.scenario === 'hex-typed') terse = `color ${spec.code}`;
      else if (spec.scenario === 'named') terse = `color: ${vars.name}`;
      else if (spec.scenario === 'image') {
        terse = `color of the ${vars.region}`;
        if (spec.eyedropper) steps = ['select the eyedropper tool', `click the ${vars.region} in the ${vars.pic}`];
      } else {
        terse = spec.ref === 'hex' ? `${spec.code}, from a preset` : `match the “${label}” swatch, start from a preset`;
        steps = ['click the preset closest to the target', `fine-tune the picker until it matches${vars.tol}`];
      }
      if (spec.scenario === 'hex-typed') {
        const where = spec.fields === 'rgb' ? 'the R, G and B fields' : 'the hex field';
        steps = [`click ${where}`, `enter ${spec.code}`];
      }
      // Names and codes must survive verbatim: no typo noise when the goal carries a name or a code.
      return ins.say(rng, core, { isplit: spec.isplit, terse, steps, typo: spec.scenario === 'named' || spec.code ? 0 : 0.05 });
    },

    plan,

    solve(spec, model) {
      const out = { ...spec.goal };
      if (spec.scenario === 'image') out.picking = false;
      if (spec.popover) out.open = !!(model && model.open);
      return out;
    },
  };

  env.task(task);
})();
