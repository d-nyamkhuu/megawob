/*
 * act-in-time: act at the right moment while things move, light up, load or expire.
 * Tasks where things move, light up, load or expire on the task clock. MiniWoB counterparts:
 * chase-circle, moving-items, button-delay, simon-says, stock-market, login-user-popup; plus real-web
 * timing patterns (loading spinners, auto-dismissing toasts, countdowns, auto-advancing carousels,
 * debounced autocomplete, non-modal cookie bars).
 *
 * Time. Every dynamic runs on the kit clock through tick(): in clock=step mode (the default) one agent
 * action is spec.beat ms of task time (spec.beat = opts.stepMs, default 1000), so an observation is
 * taken at t = k * beat and the next action plays out over [t, t + beat]. No timers, no Date. A click
 * happens at the observation time t, so whatever the agent saw is what it clicks.
 *
 * Inputs: pointer only, except popup, debounce and search (typing), which also allow the keyboard. `inputs` is a
 * function of the spec, so a key press in any other scenario ends the episode with reward 0.
 *
 * scenarios
 *   chase     chase-circle: a circle (radius r) glides over a board for n = 8-12 beats (ood 13-16, smaller
 *             r); keep the pointer inside it. Speed <= 1.6 r per beat, so a pointer parked where the
 *             circle will be in the middle of the next beat stays inside for the whole beat. Time inside
 *             is measured on every tick from model.p. Ends by itself ('time-up') after n beats.
 *   moving    moving-items: 8-11 shapes (ood 12-14) in 3 colors slide along 4 lanes and leave the board;
 *             click every shape of the target color before it leaves. Presses are hit-tested in the logic
 *             (itemAt, 1.25 r margin). Another color: 'wrong-click'; a target escaping: 'missed'; after
 *             the last shape: 'time-up'. Schedules are resampled until the greedy one-per-beat plan works, even
 *             when one of the first four beats is lost to an overlay.
 *   delay     button-delay. 'enable': the button is inactive until spec.delay; 'appear': a placeholder until
 *             then (early / distractor clicks: 'wrong-click'); 'interval': after a 3-beat "get ready" phase (spec.ready;
 *             clicks are ignored until then) click ONE, wait spec.wait seconds (1-4 beats; ood 5-6), click
 *             TWO (graded by timing; 'mistimed' / 'wrong-order').
 *   simon     simon-says: n = 4-6 pads; pad seq[k] lit in beat k (70% of the beat); then repeat the
 *             sequence; a wrong press: 'wrong-press'. ood: length 6-8.
 *   stock     stock-market: a price per beat for T = 12-16 beats (ood 18-22), one dip below the threshold
 *             of 2-3 beats. A buy above the threshold: 'bad-buy'; no buy by the close: 'timeout'.
 *   popup     login-user-popup: type a username and password and press "Log in" while an interruption
 *             appears at a seeded time or on first focus of a field. kind 'modal': a dialog that disables
 *             the form; one button keeps the session, the other leaves the page (exited). kind 'bar': a
 *             non-modal cookie bar at the bottom of the app (covers what is below it); any choice closes
 *             it unless the goal asks for one (spec.popup.want 'accept' | 'reject'); a "Cookie settings"
 *             link reopens it. Logging in with wrong values fails ("Incorrect username or password").
 *   loading   click "Search" (the query is prefilled), a spinner and skeleton rows run for spec.load ms,
 *             then the results appear; open the requested one (by name, cheapest, best rated, position).
 *             Opening another result is a wrong final choice (its page has "Back to results").
 *   toast     a sign-in check: "Send code" shows a toast with a one-time code that disappears after
 *             spec.ttl ms (read it before it goes; "Resend code" shows it again); enter the code on an
 *             on-screen keypad and press "Verify". A wrong code is a wrong final choice.
 *   countdown a hold timer ("Held for 0:07"): choose one option in each of 2-3 groups and press the
 *             confirm button before the timer runs out ('expired'). Confirming wrong options is a wrong
 *             final choice (a "Cancel reservation" link undoes it in recoverable mode).
 *   carousel  an auto-advancing carousel (a slide every spec.period ms, with dots and arrows; manual
 *             navigation pauses it): open the slide named in the goal. Opening another slide is a wrong
 *             final choice (its page has "Back").
 *   debounce  an autocomplete field whose suggestions appear only after typing has paused for
 *             spec.debounce ms plus a fetch of spec.latency ms ("Searching…"); type, wait, then pick the
 *             named city (click, or arrow keys + Enter on route 'keys'). A wrong pick just fills the
 *             field with the wrong value (retype to fix).
 *
 *   refresh   a busy list (M7): an inbox / queue / contacts list reloads on a schedule. Busy (spinner, dimmed
 *             rows; skeleton rows for the first load) for spec.first ms from t = 0, then idle for spec.gap ms,
 *             busy for spec.busy ms, idle, ... and every reload brings the rows back in another order (the
 *             named item never sits at the same place twice running). A click on a row while busy is a
 *             mistake: it ends the episode ('busy-click', model.early); open the named item when idle.
 *             Idle windows are >= 3 beats, so a wait-then-click oracle always fits (also after an overlay).
 *   deadline  act inside a window (M7): an offer (claim button + decoy) or a delivery-slot list appears at
 *             spec.ready and is gone at ready + spec.window (>= 3 beats). Clicking before it is there
 *             ('early-click'), clicking a decoy / the wrong slot ('wrong-click') and letting it pass
 *             ('expired', checked on the clock) all end the episode. A life bar shows the time left.
 *   search    a debounced product search box (M7): results for the typed text show only after spec.debounce
 *             ms of quiet plus spec.latency ms of loading; until then the list still shows the previous
 *             (stale) results (popular items at first, never the target). Opening any result while
 *             model.q !== model.settled is a stale click: a strike ('stale-click'), as is a wrong product.
 *             Typing the query, waiting until the list has settled, then opening the product is the plan.
 *
 * Recoverable mode (R4): popup, loading, toast, countdown, carousel, refresh, search. spec.recoverable = opts.recover ??
 * 50% (forced true for a 'wrong' start that already made a wrong final choice). Each wrong final choice
 * adds a strike (model.strikes); the first one ends the episode unless recoverable; a second always ends
 * it. While the wrong result is shown it costs error (see below); the way back is Back / Cancel / retry.
 *
 * Levels (opts.level easy | medium, normal is the task as it was): the sampled episode is eased in
 * place from a 'level' fork (levelAdjust). chase: bigger circle, tau 0.2 -> 0.35 / 0.275 (spec.tau, spec.need);
 * moving: 3 / 4 targets and 1 / 2 distractors; delay: no / one distractor button, shorter delay, interval tau
 * 0.35 / 0.25; simon: shorter sequence (2 / about 3); stock: buy threshold +0.8 / +0.4; popup: password cut to
 * 4 / 5 characters, no cookie wish on easy; loading: 3 / 4 results, shorter load; toast: 4 / 5 digits, longer
 * ttl; countdown: 2 groups on easy, a longer hold; carousel: 3 / 4 slides; debounce: shorter wait, click route
 * only on easy; refresh / deadline / search: fewer rows / slots, shorter busy phases, longer windows (o.lv).
 *
 * Start modes: off, partial, wrong, solved (solved via solve()).
 *   partial  moving: the first target already caught; delay interval: ONE already pressed; popup: the
 *            username typed; loading: search done, results shown; toast: code sent; countdown: first group
 *            chosen; carousel: paused on a neighbouring slide; debounce: the prefix typed (loading)
 *   wrong    popup: wrong values typed; loading: a wrong result open (strike 1); toast: a stale code typed;
 *            countdown: a wrong option chosen; carousel: a wrong slide open (strike 1); debounce: a wrong
 *            city picked; refresh / search: a wrong item open (strike 1, recoverable). partial: search: the query
 *            typed and settled. Other scenarios start as 'off'.
 *
 * Opt-in traits (widgets that declare them; without them every draw is unchanged):
 *   traits.moving     { shapes?: ['circle', 'square', 'triangle', ...], items?: n, targets?: n, visible?: true }
 *                     moving: the shape pool ('triangle' is new, the base widget draws it), a fixed number of
 *                     shapes and of targets, and visible: every shape already on the board at t = 0, spread
 *                     over the lanes (the schedule is still resampled until the oracle plan works)
 *   traits.countdown  { hold: ms }: countdown with that exact hold (e.g. 18000 for a 00:18 timer); never less
 *                     than the oracle needs plus 2 beats
 *   traits.orient     'horizontal' (default) | 'vertical': which way the board of chase and moving runs.
 *                     'horizontal' is today's wide board (A wide, 1 tall) with moving's shapes sliding left and
 *                     right along horizontal lanes; declaring it samples exactly as no trait. 'vertical' stands
 *                     the board upright (1 wide, A tall): moving's 4 lanes become columns and the shapes slide up
 *                     and down them (lane dir 1 = top to bottom, -1 = bottom to top); chase's circle sweeps mostly
 *                     up and down a tall board. A vertical episode is the horizontal one of the same seed with x
 *                     and y swapped (no extra draws), so its timing, difficulty and plan feasibility are
 *                     unchanged; spec.orient = 'vertical' (absent when horizontal) and every position (itemPos,
 *                     itemAt, chasePos, model.p, the oracle's mid-beat lead) is in the upright board's units;
 *                     boardDims(spec) gives [width, height]. Other scenarios ignore it; any other value throws
 *                     for every scenario
 *
 * spec   { scenario, beat, startMode, isplit, csplit, ood, recoverable?, ... }
 *   chase    n, dur, A (the board's long side; the short side is 1), orient?, r, cx, cy, ax, ay, wx, wy, px,
 *            py, vmax, need
 *   moving   A, r, lanes: [{ y, dir, v }] (vertical: [{ x, dir, v }]), items: [{ lane, t0, color, shape,
 *            target }], color, colors, nTargets, end, orient?
 *   delay    mode; 'enable' / 'appear': delay, label, buttons: [{ key, label }], context { title, text };
 *            'interval': wait (beats), waitMs, ready (ms), buttons (keys 'one', 'two', x, y in [0, 1])
 *   simon    pads: [{ color, hex }], seq, show, lit
 *   stock    symbol, company, prices, T, q, threshold, best
 *   popup    user, pass, popup: { kind 'modal' | 'bar', trigger ('time' | 'focus-user' | 'focus-pass'),
 *            at, msg, question, stay, leave, order (modal); text, accept, reject, want (bar) }
 *   loading  query, results: [{ name, price, rating, reviews, note }], target, by ('name' | 'cheapest' |
 *            'rated' | 'position'), load (ms)
 *   toast    code, delay (ms before the toast shows), ttl (ms it stays), channel ('SMS' | 'email'), dest
 *   countdown item, groups: [{ key, label, options: [...], want }], hold (ms), confirm (label)
 *   carousel slides: [{ title, sub, cta, hue }], period (ms), first (slide at t = 0), target, route
 *            ('wait' | 'dots' | 'arrows')
 *   debounce label, pool: [{ city, country, iata }], target (pool index), prefix, debounce, latency,
 *            max (suggestions shown), route ('click' | 'keys')
 *   refresh  kind, label, what, items: [{ name, note }], target, orders: [[item index, ...], ...] (display
 *            order per reload epoch), first, busy, gap
 *   deadline kind ('offer' | 'slot'), title, text, goLabel, ready, window, buttons: [{ key ('go' | 'x0'...), label }]
 *   search   label, category, items: [{ name, price }], target, query, popular (item indices of the stale
 *            first list), debounce, latency
 *   Any: tau? (chase, delay interval: set by levels)
 * model  { t (task ms since reset), ... }
 *   chase    p ([x, y] | null), inside (ms)        moving   hits, misses        delay   clicks: [{ key, t }]
 *   simon    presses        stock    bought: null | { k, price }
 *   popup    user, pass, popup ('pending' | 'open' | 'done'), choice (bar: null | 'accept' | 'reject'),
 *            exited, login (null | { user, pass }), failed (last login attempt was wrong), strikes
 *   loading  searched (null | ms), open (null | result index), strikes
 *   toast    sent (null | ms of the last send), digits (string), verified, failed, strikes
 *   countdown sel: { group: option }, confirmed, strikes
 *   carousel at, base, paused, opened (null | slide), strikes
 *   debounce q, qAt (null | ms of the last edit), value (null | pool index), active (keyboard highlight),
 *            focus (the field has focus; mirrored by the widget, unscored)
 *   refresh  open (null | item), early (clicks while busy), strikes
 *   deadline clicks: [{ key, t }]
 *   search   q, qAt, settled (the query whose results the list shows), open (null | item), openStale, strikes, focus
 * error
 *   chase 1 - inside / dur (tau 0.2)   moving (missed + wrong) / nTargets (tau 0)
 *   delay 0 / 1, interval timing error (tau 0.15)   simon 1 - matched / len   stock price - best
 *   popup 0.8 * field edit distance + 0.2 * (not logged in); with a cookie wish 0.85 * that + 0.15 *
 *         (wrong choice); 1 while exited
 *   loading 1 (no search), 0.6 (searching), 0.5 (results shown), 1 (wrong result open), 0
 *   toast 1 (no code sent), 0.25 + 0.65 * edit distance(digits, code), 0 once verified
 *   countdown (wrong groups + not confirmed) / (groups + 1); 1 when confirmed with wrong options
 *   carousel 0.7 (nothing opened), 1 (wrong slide open), 0
 *   debounce 1, 0.6 (useful prefix typed), 0.4 (suggestions with the city shown), 1 (wrong pick), 0
 *   refresh 0 (the named item open), else 1      deadline 0 (go clicked inside the window), else 1
 *   search 1, 0.6 (typed, list stale), 0.4 (typed, list settled), 1 (wrong or stale open), 0
 *   All tau 0 except chase, delay interval, stock.
 *
 * plan targets (the widget's locate() maps them to viewport px)
 *   { point: [x, y] } chase     { item: i } moving     { button: key } delay     { pad: i } simon
 *   { buy: true } stock         { field: 'user' | 'pass' }, { login: true }, { popup: 'stay' | 'leave' |
 *   'accept' | 'reject' }, { settings: true } (cookie settings link), { back: true } (return after leaving)
 *   { search: true }, { result: i }, { back: true }                                         loading
 *   { send: true }, { key: '0'-'9' | 'back' }, { verify: true }                             toast
 *   { opt: [group, option] }, { confirm: true }, { cancel: true }                           countdown
 *   { slide: true } (the visible slide), { dot: i }, { arrow: 'next' | 'prev' }, { back: true }   carousel
 *   { field: 'city' }, { suggestion: i }                                                   debounce
 *   { row: item index }, { back: true }                                                    refresh
 *   { button: 'go' }                                                                       deadline
 *   { field: 'q' }, { result: item index }, { back: true }                                 search
 * plan steps: { move } (chase), { click }, { type } (popup, debounce, search), { key: 'ArrowDown' | 'Enter' }
 * (debounce keys route), { wait } while something runs.
 *
 * Helpers (widget API, env.taskDef.helpers):
 *   COLORS color names to hex values
 *   boardDims(spec) -> [board width, board height]
 *   chasePos(spec, t) -> circle position
 *   itemPos(spec, i, t) -> shape position or null
 *   itemAt(spec, t, pt) -> hit-tested shape index or null
 *   delayReady(spec, t) -> button ready
 *   simonLit(spec, t) -> lit pad index
 *   simonPhase(spec, t) -> show or input
 *   simonShown(spec, t) -> flashes shown
 *   priceAt(spec, t) -> current quote
 *   priceIndex(spec, t) -> quote index
 *   fmt$(price) -> dollar string
 *   resultsShown(spec, model) -> loaded results visible
 *   toastShown(spec, model) -> code toast visible
 *   holdLeft(spec, model) -> hold time left
 *   expired(spec, model) -> hold expired
 *   slideAt(spec, model) -> current slide
 *   slideProgress(spec, model) -> slide progress fraction
 *   suggestState(spec, model) -> none, typing, loading or shown
 *   suggestions(spec, query) -> matching city indices
 *   refreshBusy(spec, t) -> list busy
 *   refreshOrder(spec, t) -> displayed item order
 *   refreshEpoch(spec, t) -> reload epoch
 *   deadlineReady(spec, t) -> window ready
 *   deadlineOver(spec, t) -> window over
 *   deadlineLeft(spec, t) -> window time left
 *   searchList(spec, query) -> matching product indices
 *   searchState(spec, model) -> idle, typing or loading
 *   act(model, spec, event) -> interaction result
 *
 * Round 2 hooks (optional, pure; see the html/kit/env.js header). sample() makes no extra draw unless opts.judge is
 * set; the judge text and its parts come from rng.fork('judge').
 *   judgeModes ['impossible'] (every scenario): the goal names a thing the page does not have: chase a square /
 *     triangle / ... (the board has a circle), moving a color of no shape, delay a button label (or button THREE),
 *     simon a pad color, stock another ticker symbol, popup a sign-in control (passkey, SSO, ...), loading / search a
 *     product that is not listed, toast a code route the card lacks, countdown an option no chip offers, carousel a slide
 *     that is not there, debounce a city the field does not know, refresh a person who is not in the list, deadline a
 *     slot or button the window does not show. spec.judge = { mode, what, templates, vars, message } (what: [the missing
 *     thing as the goal names it, other short ways to say it], which the reply must name). The page starts
 *     as a solved one (init = solve of the normal start; timers keep running on the kit clock and the state stays
 *     within tau) and ended() never ends a judge episode by itself (a 'time-up' would score 0). The base widget hides
 *     moving's "Catch <color>" card then. 'ambiguous' and 'confirm' are not declared: a timed round has no natural
 *     "either A or B" (chase, simon and toast have no choice among things on the page) and no irreversible step in
 *     every scenario (the checker needs a judge for every scenario of a mode).
 *   facts(model, spec): 2-4 values the page shows after the task: chase time inside / left; moving caught, missed
 *     clicks, shapes left; delay interval the clock times of ONE and TWO (status bar), enable / appear the card's
 *     status, title and text; simon phase, presses, flashes; stock the buy price, the quote now, shares; popup status
 *     and account; loading the opened product's price, rating, reviews, note; toast status, the code, where it was
 *     sent; countdown status, item, chosen options; carousel the opened page's title and subtitle; debounce the
 *     field, "City, Country" and airport code (status bar); refresh the opened row's note and name; deadline the
 *     claim status and time to spare (shown on the card), offer title; search price, product, result header.
 *     [] while the task has not been done; the task's facts() then lists the labels (and the values) of the solved page,
 *     so the report request names them from the start. Label paraphrases go in labels, aliases are other spellings of the
 *     value ("3.2" for "3.2 s").
 *   silent(next, prev, spec, rng): the last good action did not take and the page shows the state before it:
 *     moving a click on a target is lost (only if the plan still catches every target, also with a beat lost);
 *     delay the click does nothing (interval: only the ONE press, a lost TWO could not be repeated on time);
 *     simon the last press is dropped; stock the buy is lost (price still in range a beat later); popup the login
 *     press is lost or the user / password is cut one or two characters short; loading the result page does not
 *     open or the search press is lost; toast the verify press, the last digit or the send is lost; countdown a
 *     chip choice or the confirm press does not stick (only with the hold time to repeat it); carousel the slide
 *     does not open (paused carousel only); debounce the pick does not take; refresh the row does not open (list
 *     still idle and in the same order a beat later); deadline the claim is lost (window still open a beat later);
 *     search the product does not open. null for chase (no discrete step to lose) and in judge episodes.
 *   retarget(spec, model, rng): another goal on the same page, only when the model has not already committed to
 *     the old one in a way that cannot be undone and the plan can still finish: moving another color of the board
 *     (hits so far must be of it, every shape of it still catchable); delay interval another wait; stock another
 *     price to buy under (best price still ahead, nothing bought); popup other credentials (not signed in); loading
 *     another result (name or position); countdown another option in one group (hold time left); carousel another
 *     slide; debounce another city of the same suggestions; refresh another item whose rows never repeat a place;
 *     deadline (slots) another slot to book, none clicked yet; search another product with its query. null for
 *     chase (no goal choice), simon (the pattern was shown once), toast (the instruction does not depend on the
 *     code), delay enable / appear and deadline offers (the target is the page's one primary button).
 *   faults(spec): a fault that costs a beat (a missed click, a retry banner) fits loading, search, toast, popup,
 *     debounce, refresh and delay enable / appear; the timing-critical chase, moving, simon, stock, delay
 *     interval and deadline get none (a missed TWO press in delay interval could not be repeated on time).
 *
 * Deviations from MiniWoB: the instruction never names the end control; recoverable wrong choices;
 * content from env.content banks; new timing scenarios beyond MiniWoB.
 *
 * Files (files: [...] below, loaded in order after this one): scenarios/<scenario>.js, one env.scenario('act-in-time', {...})
 * object per scenario. This file holds the shared helpers (lib) and dispatches to the objects; the hooks an object has
 * are listed above the dispatch section. The checker-only test lives in selftest.js.
 */
(function () {
  'use strict';

  const C = env.content;
  const I = env.instruct;

  const COLORS = { red: '#e03131', blue: '#1c7ed6', green: '#2f9e44', orange: '#f76707', purple: '#7048e8' };

  const round2 = (x) => Math.round(x * 100) / 100;
  const round3 = (x) => Math.round(x * 1000) / 1000;
  const snap = (ms) => Math.round(ms / 50) * 50;
  const fmt$ = (p) => '$' + p.toFixed(2);
  const secs = (ms) => {
    const s = ms / 1000;
    return Number.isInteger(s) ? String(s) : s.toFixed(1);
  };
  const { clone, lev } = env.util;
  const fold = (s) => C.ascii(s).toLowerCase();

  // traits.orient (see the header): validated for every scenario, applied to chase and moving by transposing the
  // horizontal episode after it is sampled (no extra draws).
  const ORIENTS = ['horizontal', 'vertical'];
  function orientOf(traits) {
    const o = traits && traits.orient;
    if (o === undefined) return 'horizontal';
    if (!ORIENTS.includes(o)) throw new Error(`act-in-time: traits.orient must be 'horizontal' or 'vertical' (got ${JSON.stringify(o)})`);
    return o;
  }
  const vertical = (spec) => spec.orient === 'vertical';
  const boardDims = (spec) => (vertical(spec) ? [1, spec.A] : [spec.A, 1]);

  // ---------------------------------------------------------------- chase

  function chasePos(spec, t) {
    const s = t / spec.beat;
    let x = spec.cx;
    let y = spec.cy;
    for (let i = 0; i < 2; i++) {
      x += spec.ax[i] * Math.sin(spec.wx[i] * s + spec.px[i]);
      y += spec.ay[i] * Math.sin(spec.wy[i] * s + spec.py[i]);
    }
    return [x, y];
  }

  // ---------------------------------------------------------------- moving

  function itemX(spec, i, t) {
    const it = spec.items[i];
    const ln = spec.lanes[it.lane];
    const d = (ln.v * (t - it.t0)) / spec.beat;
    return ln.dir > 0 ? -spec.r + d : spec.A + spec.r - d;
  }
  // itemX is the distance along the lane; the position is in board units ([across, along] when vertical).
  function itemPos(spec, i, t) {
    const x = itemX(spec, i, t);
    if (!(x > -spec.r && x < spec.A + spec.r)) return null;
    const ln = spec.lanes[spec.items[i].lane];
    return vertical(spec) ? [ln.x, x] : [x, ln.y];
  }
  function itemLeave(spec, i) {
    const it = spec.items[i];
    return it.t0 + ((spec.A + 2 * spec.r) / spec.lanes[it.lane].v) * spec.beat;
  }
  function itemAt(spec, t, pt) {
    let best = null;
    let bd = Infinity;
    for (let i = 0; i < spec.items.length; i++) {
      const p = itemPos(spec, i, t);
      if (!p) continue;
      const d = Math.hypot(p[0] - pt[0], p[1] - pt[1]);
      if (d <= 1.25 * spec.r && d < bd) {
        bd = d;
        best = i;
      }
    }
    return best;
  }

  // ---------------------------------------------------------------- delay

  const delayReady = (spec, t) => t >= spec.delay;

  // ---------------------------------------------------------------- simon

  const simonPhase = (spec, t) => (t < spec.show - 1e-9 ? 'show' : 'input');
  function simonLit(spec, t) {
    if (simonPhase(spec, t) !== 'show') return null;
    const k = Math.floor(t / spec.beat + 1e-9);
    return t - k * spec.beat < spec.lit * spec.beat ? spec.seq[k] : null;
  }
  const simonShown = (spec, t) => Math.min(spec.seq.length, Math.floor(t / spec.beat + 1e-9) + 1);

  // ---------------------------------------------------------------- stock

  const priceIndex = (spec, t) => Math.max(0, Math.min(spec.T - 1, Math.floor(t / spec.beat + 1e-9)));
  const priceAt = (spec, t) => spec.prices[priceIndex(spec, t)];

  // ---------------------------------------------------------------- popup

  const nd = (a, b) => lev(a, b) / Math.max(a.length, b.length, 1);

  // ---------------------------------------------------------------- loading

  const resultsShown = (spec, m) => m.searched !== null && m.t >= m.searched + spec.load - 1e-9;

  // ---------------------------------------------------------------- toast (one-time code)

  const toastShown = (spec, m) => m.sent !== null && m.t >= m.sent + spec.delay - 1e-9 && m.t < m.sent + spec.delay + spec.ttl - 1e-9;

  // ---------------------------------------------------------------- countdown (hold timer)

  const holdLeft = (spec, m) => Math.max(0, spec.hold - m.t);
  const expired = (spec, m) => !m.confirmed && m.t >= spec.hold - 1e-9;

  // ---------------------------------------------------------------- carousel

  function slideAt(spec, m) {
    const n = spec.slides.length;
    if (m.paused) return m.base;
    return (m.base + Math.floor((m.t - m.at) / spec.period + 1e-9)) % n;
  }
  const slideProgress = (spec, m) => (m.paused ? 0 : (((m.t - m.at) % spec.period) + spec.period) % spec.period / spec.period);

  // ---------------------------------------------------------------- debounce (autocomplete)

  function suggestions(spec, q) {
    const f = fold(q).trim();
    if (!f) return [];
    return spec.pool.map((c, i) => [fold(c.city), i]).filter(([c]) => c.startsWith(f)).sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : a[1] - b[1]))
      .map(([, i]) => i).slice(0, spec.max);
  }

  function suggestState(spec, m) {
    if (m.value !== null || !m.q || m.qAt === null) return 'none';
    if (m.t < m.qAt + spec.debounce - 1e-9) return 'typing';
    if (m.t < m.qAt + spec.debounce + spec.latency - 1e-9) return 'loading';
    return 'shown';
  }

  // ---------------------------------------------------------------- refresh (busy list)

  const refreshBusy = (spec, t) => t < spec.first - 1e-9 || (t - spec.first) % (spec.gap + spec.busy) >= spec.gap - 1e-9;
  function refreshEpoch(spec, t) {
    if (t < spec.first - 1e-9) return 0;
    const P = spec.gap + spec.busy;
    const k = Math.floor((t - spec.first) / P + 1e-9);
    return k + ((t - spec.first) - k * P < spec.gap - 1e-9 ? 1 : 0);
  }
  const refreshOrder = (spec, t) => spec.orders[refreshEpoch(spec, t) % spec.orders.length];

  // ---------------------------------------------------------------- deadline (act inside a window)

  const deadlineReady = (spec, t) => t >= spec.ready - 1e-9;
  const deadlineOver = (spec, t) => t >= spec.ready + spec.window - 1e-9;
  const deadlineLeft = (spec, t) => Math.max(0, spec.ready + spec.window - t);

  // ---------------------------------------------------------------- search (debounced results)

  const nameMatches = (name, q) => {
    const f = fold(q).trim();
    if (!f) return false;
    const nm = fold(name);
    return nm.startsWith(f) || nm.split(/[^a-z0-9]+/).some((w) => w.startsWith(f));
  };
  // Result list (item indices) a search box shows for the query q; '' shows the popular items.
  function searchList(spec, q) {
    if (!String(q).trim()) return spec.popular;
    return spec.items.map((it, i) => [it, i]).filter(([it]) => nameMatches(it.name, q)).map(([, i]) => i).slice(0, 6);
  }

  function searchState(spec, m) {
    if (m.q === m.settled || m.qAt === null) return 'idle';
    return m.t < m.qAt + spec.debounce - 1e-9 ? 'typing' : 'loading';
  }

  // ---------------------------------------------------------------- difficulty ladder

  // ---------------------------------------------------------------- dispatch: one object per scenario
  //
  // Each scenarios/<scenario>.js registers env.scenario('act-in-time', { name, ... }); the functions below call its hooks (all optional
  // unless noted; the extra arguments after spec / model are the helpers the common code builds for them):
  //   sample(rng, beat, o) (required: the scenario's spec fields), level(spec, lv, r, keep) (easy / medium easing, in place)
  //   model: start(spec) (required: the start model), act(model, spec, ev, m, t) (the scenario's interactions, applied to the
  //   copy m; widgets and the checker-only test share it), tickBy(model, spec, dt, t) (the scenario's dynamics; t = the new clock)
  //   grading: error(model, spec) and tolerance(spec) (required: tolerance defaults to tau 0), endedBy(model, spec) (the
  //   name the episode ends with, or null)
  //   oracle: plan(model, spec) (the next step), simulate(m, spec, step, c) (the step in model terms, when the common
  //   click / move cases do not cover it), solveBy(spec, model, m) (a solved model)
  //   text: phrase(spec, rng, pick, say) (the instruction), judgeAsk(jr, spec, mk, cant) (the phantom of judge=impossible)
  //   Round 2: factRows(model, spec, f), silentEdit(next, prev, spec, rng, m, out), retargetEdit(spec, model, rng, base, good,
  //   others)

  const V = env.scenariosOf('act-in-time');

  // opts.level 'easy' (lv 1) / 'medium' (lv 0.5): the sampled episode is eased in place, drawing only from the
  // 'level' fork, so normal samples exactly what it always did. refresh, deadline and search ease themselves in
  // their samplers (o.lv).
  function levelAdjust(spec, lv, r) {
    const keep = (easy, medium) => (lv >= 1 ? easy : medium);
    const h = V[spec.scenario].level;
    if (h) h(spec, lv, r, keep);
  }

  // ---------------------------------------------------------------- transitions (new scenarios)

  const RECOVERABLE = ['popup', 'loading', 'toast', 'countdown', 'carousel', 'refresh', 'search'];
  const limit = (spec) => (spec.recoverable ? 2 : 1);

  // Every interaction of the newer scenarios goes through act(), so widgets and the checker-only test share it.
  function act(model, spec, ev) {
    const m = clone(model);
    const t = m.t;
    const h = V[spec.scenario].act;
    if (h) h(model, spec, ev, m, t);
    return m;
  }

  // ---------------------------------------------------------------- scoring

  function errorOf(model, spec) {
    const h = V[spec.scenario].error;
    if (h) return h(model, spec);
    return 1;
  }

  function tolerance(spec) {
    const h = V[spec.scenario].tolerance;
    if (h) return h(spec);
    return { tau: 0, sigma: 0.35, minInitialError: 0.5 };
  }

  function toleranceOpen(spec) {
    return { tau: 0, sigma: 0.5, minInitialError: 0.5 };
  }

  function endedOf(model, spec) {
    // a judge episode ends only by the agent's message (a round running out would score 0)
    if (spec.judge) return null;
    const h = V[spec.scenario].endedBy;
    if (h) return h(model, spec);
    return null;
  }

  function endedWrongChoice(model, spec) {
    return model.strikes >= limit(spec) ? 'wrong-choice' : null;
  }

  // ---------------------------------------------------------------- model

  function initModel(spec) {
    const h = V[spec.scenario].start;
    if (h) return h(spec);
    return { t: 0 };
  }

  function tickOf(model, spec, dt) {
    const t = model.t + dt;
    const h = V[spec.scenario].tickBy;
    if (h) return h(model, spec, dt, t);
    return { ...model, t };
  }

  function planOf(model, spec) {
    const h = V[spec.scenario].plan;
    if (h) return h(model, spec);
    return null;
  }

  function solveOf(spec, model) {
    const m = { ...model };
    const h = V[spec.scenario].solveBy;
    if (h) return h(spec, model, m);
    return m;
  }

  // What one plan step does to the model in the base widget (selftest.js only).
  function simulate(model, spec, step) {
    let m = { ...model };
    const t = m.t;
    const c = step.click || {};
    if (step.move && spec.scenario === 'chase') m.p = step.move.point;
    else if (c.item !== undefined) {
      const i = itemAt(spec, t, itemPos(spec, c.item, t));
      m.hits = i === null ? m.hits : m.hits.concat([i]);
    } else if (c.button) { if (spec.mode !== 'interval' || t >= (spec.ready || 0) - 1e-9) m.clicks = m.clicks.concat([{ key: c.button, t }]); }
    else if (c.pad !== undefined) {
      if (simonPhase(spec, t) === 'input') m.presses = m.presses.concat([c.pad]);
    } else if (c.buy) m.bought = { k: priceIndex(spec, t), price: priceAt(spec, t) };
    else if (V[spec.scenario].simulate) m = V[spec.scenario].simulate(m, spec, step, c);
    else if (step.click) m = act(m, spec, step.click.key !== undefined ? { key: step.click.key } : step.click);
    return m;
  }

  // ---------------------------------------------------------------- instructions

  const Q = (s) => `"${s}"`;

  function instructionOf(spec, rng) {
    const pick = (ts) => I.pick(rng, ts, spec.isplit);
    const say = (core, o = {}) => I.say(rng, core, { isplit: spec.isplit, typo: 0, ...o });
    // judge episode: the goal names something the page does not have (see judgeOf)
    if (spec.judge) return say(I.ucFirst(I.fill(pick(spec.judge.templates), spec.judge.vars)));
    const h = V[spec.scenario].phrase;
    if (h) return h(spec, rng, pick, say);
    return '';
  }

  // ---------------------------------------------------------------- round 2: judge, facts, silent, retarget

  const JUDGE_MODES = ['impossible'];
  const sec1 = (ms) => (ms / 1000).toFixed(1);

  const ABSENT_CONTROLS = {
    popup: [
      'the "Sign in with passkey" button', 'the "Continue with SSO" button', 'the "Forgot password" link',
      'the "Use a security key" button', 'the "Create account" link', 'the "Scan a QR code" button',
      'the "Use my smart card" button', 'the "Scan fingerprint" button', 'the "Approve on phone" button',
      'the "Security question" option', 'the "Unlock my account" link', 'the "Email me a login link" link',
      'the "Use a certificate" button', 'the "Use an invite code" link', 'the "Enter account PIN" button',
      'the "Text me a code" button', 'the "Enter a backup code" option', 'the "Recognize my face" button',
      'the "Sign in as guest" button', 'the "Draw a pattern" option'
    ],
    toast: [
      'the "Call me instead" option', 'the "Use a backup code" option', 'the "Send by WhatsApp" button',
      'the "Use a hardware key" option', 'the "Use a smart card" option', 'the "Use a certificate" option'
    ],
  };
  const PRODUCT_NAMES = C.PRODUCTS.map((p) => p.name).filter((n) => !/"/.test(n) && n.length <= 40);

  // A list entry not in `taken`, from the content bank (the episode's content split first), by the judge fork.
  function absentFrom(jr, list, csplit, taken) {
    const bad = new Set(taken.map(fold));
    for (let k = 0; k < 80; k++) {
      const x = C.pick(jr, list, { csplit });
      if (!bad.has(fold(x))) return x;
    }
    return list.find((x) => !bad.has(fold(x)));
  }

  // judge mode 'impossible' for every scenario: the goal names a thing the page does not have (a shape, color, button,
  // option, product, person, city or slot that is not there). spec.judge = { mode, what, templates, vars, message };
  // the page starts as a solved one (init), so any further action only does harm.
  function judgeOf(jr, spec) {
    // what: the missing thing as the goal names it, plus its bare name and quoted text (the reply's missing item)
    const mk = (what, templates, vars, message) => {
      const all = [];
      for (const w of [].concat(what)) {
        all.push(w);
        const q = /"([^"]+)"/.exec(w);
        if (q) all.push(q[1]);
        if (/^the /.test(w)) all.push(w.slice(4));
      }
      return { mode: 'impossible', what: [...new Set(all)], templates, vars, message };
    };
    const cant = (why) => `I can't do that: ${why}.`;
    const h = V[spec.scenario].judgeAsk;
    if (h) return h(jr, spec, mk, cant);
    return null;
  }

  // ---- facts: what the page shows at the end (see the header)

  function factsOf(model, spec) {
    // f(label, value, labels, aliases): labels are other names of the fact, aliases other spellings of the value
    const f = (label, value, labels, aliases) => ({ label, value: String(value), ...(labels ? { labels } : {}), ...(aliases ? { aliases } : {}) });
    const h = V[spec.scenario].factRows;
    if (h) return h(model, spec, f);
    return [];
  }

  // ---- silent: the last (error-lowering) action did not take; the page shows the state it was in before

  function silentOf(next, prev, spec, rng) {
    if (spec.judge) return null;
    const tau = tolerance(spec).tau;
    const m = clone(next);
    const out = (r) => (errorOf(r, spec) > tau + 1e-9 ? r : null);
    const h = V[spec.scenario].silentEdit;
    if (h) return h(next, prev, spec, rng, m, out);
    return null;
  }

  // ---- retarget: another goal on the same page

  function retargetOf(spec, model, rng) {
    if (spec.judge) return null;
    const base = clone(spec);
    const good = (ns) => {
      if (!ns || endedOf(model, ns)) return null;
      const e0 = errorOf(initOf(ns), ns);
      return errorOf(model, ns) > tolerance(ns).tau + 1e-9 && Number.isFinite(e0) ? ns : null;
    };
    const others = (n, ...not) => [...Array(n).keys()].filter((i) => !not.includes(i));
    const h = V[spec.scenario].retargetEdit;
    if (h) return h(spec, model, rng, base, good, others);
    return null;
  }

  // judge episodes: the page starts as a solved one (the right outcome is to say so and leave it alone)
  function initOf(spec) {
    const m = initModel(spec);
    return spec.judge ? solveOf(spec, m) : m;
  }

  // ---------------------------------------------------------------- task

  const TIMING_CRITICAL = ['chase', 'moving', 'simon', 'stock', 'deadline'];
  const SCENARIOS = ['chase', 'moving', 'delay', 'simon', 'stock', 'popup', 'loading', 'toast', 'countdown', 'carousel', 'debounce', 'refresh', 'deadline', 'search'];
  const KEYS = ['popup', 'debounce', 'search'];

  env.task({
    name: 'act-in-time',
    scenarios: SCENARIOS,
    files: ['scenarios/chase.js', 'scenarios/moving.js', 'scenarios/delay.js', 'scenarios/simon.js', 'scenarios/stock.js',
      'scenarios/popup.js', 'scenarios/loading.js', 'scenarios/toast.js', 'scenarios/countdown.js',
      'scenarios/carousel.js', 'scenarios/debounce.js', 'scenarios/refresh.js', 'scenarios/deadline.js',
      'scenarios/search.js'],
    lib: { ABSENT_CONTROLS, absentFrom, act, chasePos, COLORS, deadlineOver, deadlineReady, delayReady,
      endedWrongChoice, expired, fmt$, fold, holdLeft, itemAt, itemLeave, itemPos, itemX, limit, nameMatches, nd,
      priceAt, priceIndex, PRODUCT_NAMES, Q, refreshBusy, refreshEpoch, resultsShown, round2, round3, searchList,
      sec1, secs, simonPhase, slideAt, snap, suggestions, suggestState, tolerance, toleranceOpen, initModel, simulate },
    startModes: ['off', 'partial', 'wrong', 'solved'],
    // Keyboard only where text is typed (popup, debounce). See the header.
    inputs: (spec) => (spec && KEYS.includes(spec.scenario) ? ['pointer', 'keyboard'] : ['pointer']),
    tickMs: 50,
    // No page faults where a lost beat cannot be made up in time. See the header.
    faults: (spec) => !(TIMING_CRITICAL.includes(spec.scenario) || (spec.scenario === 'delay' && spec.mode === 'interval')),

    helpers: { COLORS, boardDims, chasePos, itemPos, itemAt, delayReady, simonLit, simonPhase, simonShown,
      priceAt, priceIndex, fmt$, resultsShown, toastShown, holdLeft, expired, slideAt, slideProgress,
      suggestState, suggestions, refreshBusy, refreshOrder, refreshEpoch, deadlineReady, deadlineOver,
      deadlineLeft, searchList, searchState, act },

    sample(rng, opts) {
      const list = opts.scenarios && opts.scenarios.length ? opts.scenarios : SCENARIOS;
      const scenario = opts.scenario || rng.pick(list);
      const beat = Number(opts.stepMs) > 0 ? Number(opts.stepMs) : 1000;
      const lv = opts.level === 'easy' ? 1 : opts.level === 'medium' ? 0.5 : 0; // difficulty ladder (see levelAdjust)
      const o = { ood: !!opts.ood, csplit: opts.csplit || 'train', startMode: opts.startMode || 'off', traits: opts.traits || {}, lv };
      o.orient = orientOf(o.traits);
      const spec = { scenario, beat, startMode: o.startMode, isplit: opts.isplit || 'train', csplit: o.csplit, ood: o.ood, ...V[scenario].sample(rng, beat, o) };
      if (RECOVERABLE.includes(scenario)) {
        spec.recoverable = opts.recover === null || opts.recover === undefined ? rng.bool(0.5) : !!opts.recover;
        if (o.startMode === 'wrong' && ['loading', 'carousel', 'refresh', 'search'].includes(scenario)) spec.recoverable = true;
      }
      if (lv) levelAdjust(spec, lv, rng.fork('level'));
      // Round 2: judge episodes draw only from their own fork, so every other episode samples exactly as before.
      if (JUDGE_MODES.includes(opts.judge)) {
        const j = judgeOf(rng.fork('judge'), spec);
        if (j) spec.judge = j;
      }
      return spec;
    },
    init: initOf,
    error: errorOf,
    tolerance,
    instruction: instructionOf,
    plan: planOf,
    solve: solveOf,
    tick: (model, spec, dt) => tickOf(model, spec, dt),
    ended: endedOf,
    judgeModes: JUDGE_MODES,
    facts: env.util.reportFactsOf(factsOf, solveOf),
    silent: silentOf,
    retarget: retargetOf,

  });
})();
