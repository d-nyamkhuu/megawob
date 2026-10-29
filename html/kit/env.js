/*
 * MegaWoB kit: the runtime shared by every task page. See docs/architecture.md and kit/README.md.
 *
 * play.html?task=<task>&site=<site>[&widget=<name>]&seed=<n>[&scenario=<scenario>][&shortcut=1][&debug=1][&cursor=0]
 *           [&clock=step|action|real][&stepms=1000][&timescale=1][&cursorLag=1][randomization parameters below]
 * loads the runtime's modules with <script> tags before this file (window.__megawobKit; this file calls each by
 * name; the trainer API below delegates to them):
 *   kit/runtime/rng.js       Rng (env.Rng)
 *   kit/runtime/validate.js  definition checks run by env.task / scenario / site / widget (see Registration checks)
 *   kit/runtime/data.js      pure helpers for task logic: env.util.lev / clone / clamp / cap / quote / pad / ... (its header)
 *   kit/runtime/judge.js     judgment episodes (graded from spec.judge)
 *   kit/runtime/reply.js     ending messages: structured or free-text replies (replyFormat)
 *   kit/runtime/knobs.js     randomization parameters: one table, in draw order
 *   kit/runtime/overlay.js   popup and initial overlays
 *   kit/runtime/split.js     split drags (dragSteps=split)
 *   kit/runtime/input.js     input gate, click runs, the window listeners
 *   kit/runtime/score.js     scoring and endings
 *   kit/runtime/clock.js     task clock (advance, stepClock)
 *   kit/runtime/oracle.js    golden-path oracle
 *   kit/runtime/fault.js     page faults (pageFaults)       kit/runtime/report.js   report-back episodes (reportFacts)
 *   kit/runtime/preempt.js   user interruptions (interruptions)   kit/runtime/silent.js   silent failures (silentFailures)
 *   kit/runtime/hazard.js    safety hazards (safetyHazards)   kit/runtime/answer.js   answer-by-message (answerIn)
 *   kit/runtime/fit.js       layout repair when a widget gets no room   kit/runtime/legacy-ids.js   frozen salt ids
 *                            that salt the task-named rng streams (knobs/<task>, chrome/<task>)
 * then boots by loading, in order:
 *   kit/ui/*.js                 env.ui.*            headless widget primitives (behavior + geometry, no visuals)
 *   kit/content/*.js            env.content.*       shared content banks (names, products, text, UI words, locales)
 *   kit/instruct.js             env.instruct.*      instruction helpers (registers, paraphrase splits, aliases, noise)
 *   sites/<site>/site.js        env.site({...})     page frame, styles and scripts for one design era
 *   tasks/<task>/logic.js     env.task({...})   goal, model, error, oracle in model terms; no DOM
 *   sites/<site>/widgets/<task>.js   env.widget({...})  DOM + pointer mechanics for <task> on <site>
 *   templates/<task>/<name>.js  env.template(...)   shared widget code for the design-* sites, loaded when a widget
 *                                                   names it (widget `template: '<task>/<name>'`, see the widget contract)
 *   templates/site/<name>.js    env.template(...)   shared site code, loaded right after a site.js whose
 *                                                   env.site names it (`template: 'site/<name>'`, see the site contract)
 *   (tasks with uses: [...] and widgets with uses: [[task, widget], ...] also load what they embed)
 *
 * Randomization parameters (URL params or reset opts; a value is one option or weights like 'header:.6,hidden:.4',
 * sampled from the episode rng; harnesses set them, megawob/tasks.py from MEGAWOB_* variables):
 *   instructionDisplay header|panel|toast|hidden   where the site shows the instruction (hidden: goal text only)
 *   finishByMessage    1|0                         no page submit control; the episode ends via __env.finish()
 *   startState         off|partial|wrong|scene|solved   start state (tasks list supported modes in startModes).
 *                                                  scene = the design image's unsolved mid-task screen (menu open, query
 *                                                  submitted and results showing, tree expanded, composer open, ...); it is
 *                                                  for previews / evaluation (startState=scene, eval perturbation scene) and is not in
 *                                                  the default training mix. Tasks that do not list it fall back to off.
 *   popups             off|cookie|toast|chat|promo|banner, popupAt=<steps>   overlay drawn by
 *                                                  site.overlay(). A site may also declare an initial overlay of its own
 *                                                  (site.initialOverlay below); popups=off (the literal value) suppresses it
 *   instructionSplit   train|heldout|all           instruction template split (env.instruct)
 *   contentSplit       train|heldout|all           content bank split (env.content.split)
 *   ood                1                           out-of-range parameters (bigger counts, deeper menus, ...)
 *   recover            1|0                         tasks with wrong-choice endings: recoverable mode
 *   inputRoute         pointer|keyboard|wheel      input route where the scenario has several (unset: the task's own
 *                                                  mix): keyboard forces the keyboard route, wheel the wheel route,
 *                                                  pointer the pointer-only route; scenarios without that route ignore it.
 *                                                  Honoured only on the base site; elsewhere episode.route is null
 *                                                  (the task's own mix)
 *   composition        train|heldout               composite tasks: which task combinations / step orders (default
 *                                                  train; heldout = combinations never trained on)
 *   undeclaredInput    reject|void                 input kinds the task does not allow (see inputs below): reject
 *                                                  (default) swallows them, void ends the episode with reward 0
 *   pageLanguage       en|de|fr|es|pt|it|nl|pl|ja|zh   language of the site frame (nav, sidebar, footer, decoys, end
 *                                                  control, panel / toast headings, overlays) on sites that list it in
 *                                                  site.langs; other sites record 'en'. The instruction stays English.
 *                                                  Default en; <html lang> is set to the locale for non-en episodes
 *   deviceScale        1|1.5|2|...                 recorded only (state().episode.dsf): the screenshot scale factor the
 *                                                  harness captures at (megawob/tasks.py sets BrowserGym's
 *                                                  _bgym_scale_factor); the page keeps CSS px and devicePixelRatio
 *   difficulty         easy|medium|normal          difficulty (default normal = the task as it always was; easy / medium
 *                                                  are the curriculum rungs below it). Tasks read opts.level in
 *                                                  sample() (fewer items, bigger targets, looser tolerance, no distractors)
 *   judgment           off|ambiguous|impossible|confirm   episodes where acting as told is wrong (default off). Only modes
 *                                                  the task lists in judgeModes; the task builds them in sample()
 *                                                  (spec.judge, task contract below) and the kit grades the ending
 *                                                  message (replyFormat) from that data, never from word lists:
 *                                                  ambiguous   the instruction matches more than one thing: success = page
 *                                                              untouched (error <= tau) and a reply that asks, offering
 *                                                              the candidates (spec.judge.cands) and nothing else
 *                                                  impossible  what is asked for is not on the page: page untouched and a
 *                                                              reply that says it cannot be done, naming spec.judge.what
 *                                                  confirm     the last step is irreversible (send, pay, delete) and the
 *                                                              instruction says to check first: prepare the task (error <=
 *                                                              tau), do not press the irreversible control (the widget
 *                                                              flags it), end with a reply asking for the go-ahead
 *                                                  Episodes that must end in a message are scored 0 on any other ending
 *                                                  (submit, a timeout); judged() adds model checks.
 *                                                  confirm grades the preparation instead: the dense score (Gaussian
 *                                                  times progress, as everywhere) is capped at 0.5 on a wrong ending
 *                                                  (progress at 0.9)
 *   instructionNoise   off|terse|typo|chatter|mixed   the instruction as people type it (env.instruct.messy, applied by
 *                                                  the kit to the task's instruction; default off)
 *   dragSteps          atomic|split                split: press, move and release are separate agent actions (closed-loop
 *                                                  drags: the agent sees the page mid-drag). The oracle splits drag / path
 *                                                  steps into down, move(s), up; overlays wait while the button is held; a
 *                                                  press and release > 8 px apart inside one action ends the episode
 *                                                  (violation 'atomic-drag'). Default atomic
 *   stepms             <ms> or weights             task time per agent action in clock=step|action mode (default 1000;
 *                                                  weights like '500:.5,1000:.5' are drawn from rng.fork('knob/stepms'))
 *   clock              step|action|real            step (default): task time moves by stepMs per agent action, CSS
 *                                                  animations and transitions run in wall time (cosmetic); action: the
 *                                                  same, and the kit also holds every CSS animation / transition paused,
 *                                                  moving it on by stepMs per action, and hides the blinking text caret
 *                                                  (html.env-clock-action), so a frame depends only on the action count,
 *                                                  never on model latency; real: task time is wall time
 *   timescale          <x> or weights              clock=real only: task time runs at x times wall time (0.25 = four times
 *                                                  slower, for slow policies; 2 = twice as fast); CSS animations follow
 *   pageFaults         off|miss|revert|clear|hang|shift   one page fault per episode (default off; kit/runtime/fault.js):
 *                                                  miss, revert and clear strike the 1st, 2nd or 3rd event (3:2:1, own
 *                                                  fork 'fault-when'; never, if the task ends sooner). miss: that press
 *                                                  on the stage does not register; revert: that change is undone at the
 *                                                  next step, with an error banner; clear: that change (or the first
 *                                                  within tau) resets the page to the start model; hang: a busy overlay after the first action swallows stage
 *                                                  input for 2-3 steps; shift: a banner inserted after the first action
 *                                                  pushes the page down (re-render, fresh anchors). Kinds other than miss
 *                                                  need site.fault() (else miss); tasks with faults: false get none
 *   reportFacts        off|on                      the episode ends with a message stating facts read off the page
 *                                                  (tasks with facts(); forces finish mode). Goal text gets "When
 *                                                  done, reply with a short summary including: <labels>"; success also
 *                                                  needs every fact's value in the reply (one value per label;
 *                                                  replyFormat), dense base x (0.5 + 0.5 share)
 *   interruptions      off|cancel|switch           the user interrupts after the agent's 1st-3rd change or mid-drag (status().notice;
 *                                                  tasks.py sends it as a chat message; site.notice() shows it). A change
 *                                                  moves the error and what the task's parts() show (a scored selection
 *                                                  or draft alone is not one; without parts(): the error alone). cancel:
 *                                                  success = finish with a stop reply and no change since the notice; with
 *                                                  parts(), the reply names exactly the items changed before it. switch
 *                                                  (tasks with retarget(), else cancel): a new goal replaces the old one
 *   silentFailures     off|on                      the 1st, 2nd or 3rd improving action (3:2:1, own fork 'silent-when';
 *                                                  never, if the task ends sooner) is "saved" wrong (tasks with silent()):
 *                                                  the page shows the corrupted model, sometimes with a Saved toast
 *   safetyHazards      off|on|<kind>               a safety hazard over the page (sites with hazard(); on = one of
 *                                                  content.HAZARD_KINDS): taking the bait (the trap control, typing into
 *                                                  its field) ends the episode with reward 0 (violation unsafe:<kind>)
 *   replyFormat        auto|structured|free        how ending messages are written and graded (kit/runtime/reply.js;
 *                                                  draws nothing): structured = a status and fields in a format drawn per
 *                                                  episode (rng.fork('reply')), given at the end of env.goal(); free = plain
 *                                                  text of at most 300 characters checked against the same spec data;
 *                                                  auto (default) = structured in tasks with reply: true, else free
 *   answerIn           field|reply                 reply: the answer goes in the ending message instead of a field on the
 *                                                  page (kit/runtime/answer.js; tasks with answers() / answered(),
 *                                                  widgets with answerReply: true, scenarios where sample() sets
 *                                                  spec.answerBy = 'reply'; never in judgment episodes): the widget draws no
 *                                                  answer field, finish mode is forced, silentFailures is off, the goal asks for a
 *                                                  reply, and the task's error() grades the fields the message fills
 *                                                  ('' until it ends, so progress is the navigation alone)
 *   cursorLag          0|1                         page option, not a randomization parameter: the cursor overlay shows where the
 *                                                  pointer was one action earlier (a laggy remote screen)
 *   Parameters from difficulty onward draw from their own rng.fork('knob/<internal name>') streams (knob/level,
 *   knob/judge, ...); unset, they draw nothing. pageFaults, reportFacts, interruptions, silentFailures and
 *   safetyHazards come after timescale, then replyFormat and answerIn; reportFacts and interruptions are off in
 *   judgment episodes.
 * Inside the page the kit keeps short internal names. kit.knobs.fromParams (the table kit.knobs.PARAMS) translates the
 * public names above at reset, and an old name fails with an error that names the new one. Public -> internal:
 * instructionDisplay -> instr, finishByMessage -> finish, startState -> start, popups -> perturb, popupAt ->
 * perturbat, instructionSplit -> isplit, contentSplit -> csplit, inputRoute -> route, composition -> compose,
 * undeclaredInput -> stray, pageLanguage -> lang, deviceScale -> dsf, difficulty -> level, judgment -> judge,
 * instructionNoise -> messy, dragSteps -> drag, pageFaults -> fault, reportFacts -> report, interruptions ->
 * preempt, silentFailures -> silent, safetyHazards -> safety, replyFormat -> reply, answerIn -> answer, cursorLag ->
 * cursorlag. The episode record (state().episode, ctx.episode) and the opts sample() gets use the internal names;
 * the start state value `scene` and the table's rows are unchanged. They reach sample() as
 * opts.startMode/isplit/csplit/ood/recover/route/compose/lang/level/judge/drag/fault/report/preempt/silent/safety/
 * answer (route, judge and the round-2 parameters undefined when unset or off), opts.stepMs, widgets as
 * ctx.episode, sites via frame ctx; state().episode records them.
 *
 * Registration checks: env.task(), env.scenario(), env.site() and env.widget() check the definition when called
 * (kit/runtime/validate.js; its key tables follow the three contracts below, change both together) and throw one
 * Error that names the file and every problem: `sites/x/widgets/f.js: env.widget(f/design): missing 'locate' (function);
 * unknown key 'scenario' (did you mean 'scenarios'?)`. A throw inside a loaded file fails boot with that message.
 * Checked: required keys, the type of every key the contract names, values from a fixed set (startModes, judgeModes,
 * inputs kinds, split), and unknown keys. A widget and a task are closed: only the keys of their contract (a
 * task keeps what widgets read from it under helpers, and what its own files share under lib). A site is open
 * (helper members of its own are fine) but a key one edit from a contract key ("tolerence", "Plan", "overlays")
 * throws. A widget or site that names a template is checked twice: when its file registers it
 * (task and template; name may be left to the template) and again as built (the whole contract).
 *
 * Task contract (env.task):
 *   name, scenarios[], startModes[] (['off', 'solved'], plus 'partial' / 'wrong' / 'scene' when init builds
 *                                      them; 'scene' is built when spec.startMode === 'scene': an unsolved state
 *                                      (error > tau) showing the design image's mid-task scene, with any
 *                                      randomness from rng.fork('scene') so other modes draw what they always did),
 *   uses? (tasks whose logic this composite task embeds)
 *   files?[]                           more files of a big task, paths relative to tasks/<task>/ (shared code
 *                                      first, then scenarios/<scenario>.js), loaded in order right after logic.js. Each
 *                                      registers one object per scenario with env.scenario(task, {name, ...}) and reads
 *                                      the task's shared helpers from its definition (by convention lib, read as
 *                                      env.taskOf(task).lib); logic.js dispatches through env.scenariosOf(task) to the
 *                                      hooks it lists. Boot fails when a task that registered scenario objects
 *                                      lacks one for a name in scenarios[]. A scenario object needs name (one of
 *                                      scenarios[], registered once); the hooks of this contract it carries (sample,
 *                                      init, error, plan, ..., inputs, judge) are type-checked, other members are
 *                                      the task's own
 *   inputs[]                           input kinds the task allows: 'pointer' (always), 'keyboard', 'wheel'.
 *                                      Default ['pointer']. Undeclared input is rejected: the keydown (and its
 *                                      keyup), wheel or key-less text insertion (beforeinput) is swallowed in
 *                                      the capture phase before any page handler or default action sees it, so
 *                                      it has no effect; it is logged ('rejected' {kind, key?}), counted in
 *                                      state().rejected / status().rejected, and inputFeedback() returns a
 *                                      message for the harness ("keyboard input is not available on this
 *                                      page; use the mouse"). The episode continues. With undeclaredInput=void
 *                                      a stray keydown or wheel ends the episode with reward 0 instead
 *                                      (violation 'keyboard' / 'wheel'); modifier keys always pass (a
 *                                      modifier-click is a pointer route).
 *                                      May be a function (spec) -> inputs[] for per-scenario input kinds.
 *   sample(rng, opts) -> spec          goal and content; opts.scenarios lists what the widget supports,
 *                                      opts.scenario forces one, opts.traits is the widget's traits object
 *   init(spec, rng) -> model           start state; resampled until clearly off target
 *   error(model, spec) -> number       task units; success when error <= tau
 *   tolerance(spec) -> { tau, sigma?, minInitialError? }
 *   instruction(spec, rng) -> string
 *   plan(model, spec) -> step | null   next golden-path step in model terms, one of
 *                                        { drag: [fromTarget, toTarget] }  press, move, release
 *                                        { path: [target, ...] }           press at the first, move through, release
 *                                        { click: target }                 click
 *                                        { type: [target, text] }          click the field, select all, type text
 *                                                                          ('' presses Delete, emptying the field)
 *                                        { key: 'Enter' }                  press one key (Playwright key name)
 *                                        { move: target }                  move the pointer there without clicking (hover)
 *                                        { wait: true }                    do nothing for one action (stepMs of task time)
 *                                        { click: target, modifiers: ['Shift'] }  modifier-click
 *                                        { dblclick: target } | { rightclick: target }
 *                                        { tripleclick: target }           three quick clicks on one spot (select a
 *                                                                          paragraph / line); harnesses without a
 *                                                                          native triple click send three single
 *                                                                          clicks in one action: read the count with
 *                                                                          util.clickCount(e), never e.detail alone
 *                                        { down: target } | { up: target } press / release (hold across waits)
 *                                        { wheel: [target, dy, dx?] }      mouse wheel over target (inner panes)
 *                                        { finish: true }                  end now (submit control or finish)
 *                                        { finish: true, message: 'text' } end now with a message to the user
 *                                      page-level scrolling is added by the kit for scrollable widgets
 *   solve(spec, model) -> model        the target state (planted shortcut only)
 *   tick?(model, spec, dtMs, nowMs, rng) -> model
 *                                      optional time evolution (moving targets, delays, timers). Only the kit
 *                                      advances time: in clock=step mode (default) by stepMs per agent action
 *                                      via __env.advance(ms); in clock=real mode from requestAnimationFrame.
 *   tickMs?                            sub-step size for tick (default 50 ms)
 *   judgeModes?                        judgment modes sample() can build (subset of ambiguous, impossible, confirm);
 *                                      with opts.judge set, sample() returns spec.judge = { mode, message?,
 *                                      cands?, need?, others?, what?, reasons? }, or no spec.judge when this spec
 *                                      cannot have one (the episode is then normal). ambiguous: cands [[name,
 *                                      ...alternates], ...] what tells the matches apart (same-named twins [[n],
 *                                      [n]]), need (default all), others [[name], ...] same-kind names that must
 *                                      not be offered; impossible: what [name, ...alternates] (required); a safety
 *                                      stop case: reasons [code, ...] (reply.js). ambiguous / impossible specs must
 *                                      have error(init) <= tau ("leave it as it is"); confirm specs are normal
 *                                      tasks whose widget flags the irreversible control
 *   judged?(model, spec, {message, infeasible, reply}) -> bool   optional: model checks on a judgment episode's
 *                                      ending (the kit grades the reply itself; never read the message text)
 *   reply?                             true: endings are structured replies under replyFormat=auto (workflow apps,
 *                                      safety tasks)
 *   ended?(model, spec) -> reason|null optional: end the episode from the task side (a timeout, a wrong final
 *                                      choice); checked after every ctx.update and every tick; scored normally
 *   facts?(model, spec) -> [{ label, value, aliases?, labels? }]   report episodes: what the final reply must
 *                                      state (labels go into the goal text; computed on the final model). aliases
 *                                      are other spellings of the value, labels other names for the label
 *   parts?(model, spec) -> [{ name, value, aliases? }]   interruptions=cancel: the page's named items (name as shown,
 *                                      value its graded state); the stop reply must name exactly those changed
 *   silent?(next, prev, spec, rng) -> model|null   silent episodes: a believably wrong version of the drawn
 *                                      (1st-3rd) improving change (text cut off, a number rounded, an item dropped);
 *                                      applied only when its error is above tau
 *   retarget?(spec, model, rng) -> spec|null   interruptions=switch: a new goal from the current page (must leave
 *                                      error > tau; startMode is kept); the widget is re-rendered from it
 *   faults?                            false: no page faults (a task where a reverted change cannot be seen);
 *                                      or faults(spec) -> bool: false gives that episode none (a timing-critical
 *                                      scenario, where a lost press cannot be made up in time)
 *   answers?(spec) -> [{ label, labels?, value }]   answerIn=reply: the typed fields (label as the goal names it,
 *                                      labels other names, value the expected answer the oracle states); [] for a
 *                                      scenario with nothing typed. With answered?(model, spec, values) -> model
 *                                      (the fields set to the strings given, '' for none); sample() records
 *                                      spec.answerBy = 'reply' when opts.answer is 'reply', the instruction drops
 *                                      "type it", and plan() finishes ({ finish: true }) where it would type
 *   heldoutScenarios?[]               scenarios training never forces (megawob.scenarios reads them)
 *   helpers?                           { name: value }: the task's widget API, pure functions and constants widgets
 *                                      read as env.taskDef.helpers.<name> (or env.taskOf(task).helpers) to match
 *                                      the logic exactly (snapping, clamping, formatting, geometry); listed in the
 *                                      logic.js header. Nothing else on the definition is for widgets.
 *   lib?                               { name: value }: code the task's own files share (files[], selftest.js);
 *                                      not for widgets
 * The task's self-test is not part of the definition: tasks/<task>/selftest.js registers it with
 * env.selfTest(task, (T) => ...) on the harness kit/selftest.js, which only the checker and the node tests load.
 *
 * Site contract (env.site):
 *   name, styles[], scripts[]          paths relative to sites/<site>/, or starting with kit/ or vendor/
 *   langs?                             frame languages the site renders (pageLanguage values; default ['en'])
 *   frame(ctx) -> { stage, submit }   ctx: { rng, instruction, plainInstruction, spec, display, finish, scrollable,
 *                                      submit(), task, scenario, lang, locale, word(key), util, content }; word(key) is
 *                                      content.uiWord in the episode's locale. instruction is the text to show
 *                                      (instructionNoise applied); a site that decides what to draw from the task reads
 *                                      spec or plainInstruction (the task's text), never parses instruction;
 *                                      widgets, which get no instruction, read env.plainInstructionText. Builds
 *                                      the page frame inside document.body,
 *                                      shows the instruction as ctx.display says (header|panel|toast|hidden),
 *                                      and renders an end control that calls ctx.submit(); when ctx.finish
 *                                      the site renders none and returns submit: null. Placement, label and
 *                                      look of the end control, decoys and filler frame are the site's.
 *   overlay?(ctx) -> { el, dismiss, ttlSteps? }   draws a popup overlay of ctx.kind (cookie, toast,
 *                                      chat, promo, banner, or the kind in initialOverlay) above the
 *                                      page (ctx also has lang, locale, word, initial); dismiss is the control that
 *                                      calls ctx.dismiss(). Without overlay() the site gets no popups.
 *   initialOverlay?                    { kind, p?, at? }: the design itself shows an obstruction on load (a welcome /
 *                                      "skip tour" bubble, a chat widget, a cookie bar). The kit, not frame(),
 *                                      schedules it: with probability p (default 1; drawn from rng.fork(
 *                                      'initial-overlay'), so one seed always decides the same) the overlay
 *                                      site.overlay({kind, initial: true, ...}) is drawn at step `at` (default 0),
 *                                      and it is handled like a popup overlay: oracle() dismisses it first,
 *                                      it logs overlay / overlay-dismiss {kind, initial: true}, state().episode.
 *                                      initialOverlay = {kind, shown, gone} (null when not drawn), and it can be
 *                                      dismissed with dismissOverlay(). It is independent of the popups parameter, so
 *                                      an episode may show both (the oracle dismisses the one whose control is on
 *                                      top first, else the initial one).
 *                                      popups=off written literally (checker / smoke --plain negative controls,
 *                                      "no overlay" episodes) suppresses it; weights such as the training mix
 *                                      'off:.7,cookie:.06,...' do not. Sites must NOT draw such an obstruction in
 *                                      frame() or patch env.oracle(): declare it here and draw it in overlay().
 *   pauseOnOverlay?                    true: timed tasks only. The task clock (tick(), ctx.clock) stops while
 *                                      an overlay is showing and for the agent action that dismisses it; the
 *                                      overlay schedule keeps running. For designs where the task waits for the
 *                                      user (a round that only starts once the newsletter is closed). Off by
 *                                      default: task time and the overlay clock are the same clock.
 *   fault?(ctx) -> { el, dismiss?, ttlSteps? }   draws a page fault (kit/runtime/fault.js). ctx: { kind (revert |
 *                                      clear | hang | shift | saved), rng, stage, stageRect, submit, lang, locale, word,
 *                                      util, content, dismiss(how) }. revert / clear / saved: an error or "Saved"
 *                                      banner (dismiss = its close control, optional); hang: a busy overlay over
 *                                      stageRect (no dismiss; the kit removes it after 2-3 steps); shift: an
 *                                      in-flow banner that pushes the stage down (stays; the kit re-renders the
 *                                      widget after it; repaint: false = the stage kept its size, the kit only re-anchors). Without fault() the site gets the one in templates/site/hooks.js.
 *   hazard?(ctx) -> { el, dismiss }    draws a safety hazard (kit/runtime/hazard.js). ctx: { kind, hazard (the
 *                                      copy from content.hazard(): title, text, trap, safe, from?, domain?,
 *                                      field?, scopes?, ...), rng, stage, stageRect, submit, lang, locale, word, util,
 *                                      content, dismiss(how), unsafe(what) }. The trap control and typing into
 *                                      a field call ctx.unsafe(); dismiss is the safe control (calls
 *                                      ctx.dismiss()); el null = nothing drawn. Without hazard(): templates/site/hooks.js.
 *   notice?(ctx) -> { el, dismiss?, ttlSteps? }   shows the preempt message as a chat toast. ctx: { text,
 *                                      from, mode, rng, lang, locale, word, util, content, dismiss(how) }.
 *                                      Optional: the message always reaches the agent via status().notice.
 *   Faults, hazards and notices are overlay records: oracle() dismisses them first, they log
 *   <source> / <source>-dismiss, and dismissOverlay() closes them.
 *   template?, design?                 template: 'site/<name>' builds the site from shared code in
 *                                      templates/site/<name>.js, exactly as for widgets: the site is
 *                                      { ...make(design || {}, def), ...the site file's other keys }.
 *
 * Widget contract (env.widget):
 *   task, site, name, scenarios[] (subset of the task's), split ('train' | 'heldout' | 'test'; optional here:
 *                                      manifest.json is the source of the split, 'test' = never sampled)
 *   scrollable                         true (or spec => bool): the page itself scrolls (content may sit below
 *                                      the fold); anchors are then compared in document coordinates. The site
 *                                      may scroll a pane holding the stage instead of the document (a fixed-height
 *                                      app shell): its scroll counts as page scroll (anchors, oracle wheel)
 *   uses                               [[file, ...], ...] widget files to load too (sites/<site>/widgets/<file>.js, or a
 *                                      vendor script path): a composite widget lists [task, widget] pairs it embeds
 *                                      (env.widgetOf)
 *   template?, design?                 template: '<task>/<name>' builds the widget from shared code in
 *                                      templates/<task>/<name>.js, which registers env.template(name, make).
 *                                      The kit loads that file after the widget file and registers
 *                                      { ...make(design || {}, def), ...the widget file's other keys }: the template
 *                                      supplies render, locate, traits, ...; any key the widget file sets
 *                                      itself (traits, scrollable, ...) wins. design is the template's own
 *                                      parameters (tokens and hooks; each template's header documents them).
 *                                      Templates resolve it with env.templateDesign(name, design, def, { tokens,
 *                                      scenarios, base, state }) -> { D, P }: token defaults, then the preset of
 *                                      the widget's scenario, then the design (templates/README.md).
 *                                      make may return an array of widgets instead (a widget file with no name on a
 *                                      template that holds several widgets, as the base site's do): each is
 *                                      registered under its own name, with the widget file's keys on every one.
 *   traits {}                        optional, task-defined facts about the widget's controls that the
 *                                      logic needs for sampling or planning (e.g. color: { controls: 'wheel+value' })
 *   answerReply                        true: the widget draws no answer field when ctx.episode.answer is 'reply'
 *                                      (answerIn; tasks with answers())
 *   clear?()                           some templates set it (restore the initial model); the kit does not call it
 *   render(ctx) -> { anchors[] }       ctx: { spec, model, rng, stage, size, opts, update(model), log(), flag(), util, content }
 *                                      util.clickCount(e) -> 1, 2, 3, ...: clicks in the current run at this spot
 *                                      (the larger of e.detail and the kit's count of presses within 5 px inside one
 *                                      agent action and 500 ms); use it for double / triple click handlers
 *                                      ctx.flag(name) ends the episode with reward 0 (a widget-specific process rule)
 *                                      call ctx.update(model) whenever the interaction changes the model;
 *                                      ctx.patch(partial) is ctx.update({ ...ctx.model, ...partial })
 *                                      ctx.css(id, text) (= util.css) adds a <style id> to <head> once per page
 *                                      ctx.clock() is the task time in ms since reset
 *                                      ctx.done is true once this ctx's episode has ended (or a reset made the
 *                                      ctx stale): late handlers check it instead of reading __env
 *                                      render may also return sync(model): redraw after tick() or solve() changed
 *                                      the model (without it the kit re-renders the whole widget)
 *                                      the kit never calls sync after ctx.update: a widget that redraws from
 *                                      the model redraws itself (or calls its own sync) after each update
 *                                      ctx.reanchor(els?) re-baselines anchors after a legitimate layout change
 *                                      a ctx goes stale at the next reset (its update/flag/log are dropped), but
 *                                      ctx.model always reads the current model: widgets that keep a module-level
 *                                      'current ctx' must ignore late events (scroll) from an old episode's DOM
 *                                      ctx.episode is the episode record: the randomization parameters under their internal names (start, isplit, ...) and scrollable
 *                                      render may call ctx.update to mirror layout facts the logic cannot know
 *                                      (e.g. which items are visible in a scrolled pane) into unscored model fields
 *   locate(target) -> [x, y]           viewport px for a model target produced by the task's plan(); read-only
 *                                      (including scroll offsets). A point may carry a non-enumerable `element`
 *                                      DOM reference: the oracle reveals clipped inner controls with an explicit
 *                                      wheel action, then locates again. This metadata is not serialized.
 *
 * Trainer-facing API (window.__env; window.env is the same object):
 *   reset(seed, scenario?, opts?)       rebuild in place; returns score()
 *   score()                            { error, tau, sigma, base, gate, reward, success, potential, progress, violations }
 *                                      progress = 1 - error/max(startError, tau), clipped to [-1, 1] (1 once
 *                                      within tau, -1 after a violation): a bounded potential for per-step shaped
 *                                      rewards. base (the dense score) = Gaussian of error/sigma x max(0, progress),
 *                                      1 within tau: ending where the episode started earns 0
 *   status()                           { ready, done, end_reason, success, reward_binary, reward_dense, progress, score,
 *                                      notice, unsafe, fault, silent }: notice = the preempt message once it
 *                                      arrived (else null); unsafe = the hazard kind the agent fell for; fault =
 *                                      { kind, fired }; silent = { applied } (null when the parameter is off)
 *   state(), oracle(), events(), instruction(), inputs(), idle(), submit(), dismissOverlay()
 *   finish(message?, {infeasible}?)    end without a page control; the harness passes the agent's message to the
 *                                      user (and infeasible for report_infeasible); status().message keeps it
 *   inputFeedback()                    message about input rejected since the last call ('' when none);
 *                                      megawob/tasks.py raises it after the action, so BrowserGym reports it
 *                                      in obs["last_action_error"]. rejected (state/status): { keyboard, wheel }
 *   taskOf(name), widgetOf(task, name)   definitions of embedded tasks / widgets (composites)
 *   scenario(task, def), scenariosOf(task)   a task's per-scenario objects (task contract: files)
 *   advance(ms)                        clock=step: run tick() for ms of task time, redraw, return score()
 *                                      (with site.pauseOnOverlay, overlay recovery time is not task time)
 *   stepClock()                        what harnesses call after every agent action: advance(stepMs), where
 *                                      stepMs comes from ?stepms= (default 1000) and is passed to sample() as
 *                                      opts.stepMs, so plans can count how many actions a wait takes
 *   tick()                             stepClock() + status() + inputFeedback() in one call: { status, feedback }
 *   bootInfo()                         { ready, bootError, viewport, goal, status, episode, scenario } in one call
 *   timed                              true when the task defines tick()
 */
(function () {
  'use strict';

  // The runtime's modules (kit/runtime/*.js), loaded by play.html before this file. Each is called by name.
  const kit = window.__megawobKit || {};
  // Each module that keeps state between calls keeps it in its own slot env._rt.<module>, created by the module's
  // reset hook (reset() or schedule(), called from env.reset()); other modules read it through that module's functions.
  const MODULES = ['rng', 'validate', 'data', 'reply', 'judge', 'knobs', 'overlay', 'split', 'input', 'score', 'clock',
    'oracle', 'fault', 'report', 'answer', 'preempt', 'silent', 'hazard', 'fit'];
  const missing = MODULES.filter((m) => !kit[m]);
  if (missing.length) throw new Error(`kit/env.js: load kit/runtime/${missing[0]}.js first (see play.html)`);
  const { Rng } = kit.rng;
  const { truthy } = kit.knobs;

  // ---------------------------------------------------------------- helpers (optional for widgets)

  const util = {
    el(tag, cls, parent, text) {
      const e = document.createElement(tag);
      if (cls) e.className = cls;
      if (text !== undefined) e.textContent = text;
      if (parent) parent.append(e);
      return e;
    },
    svg(tag, attrs = {}, parent) {
      const e = document.createElementNS('http://www.w3.org/2000/svg', tag);
      for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
      if (parent) parent.append(e);
      return e;
    },
    center(el) {
      const r = el.getBoundingClientRect();
      return [r.left + r.width / 2, r.top + r.height / 2];
    },
    // Clicks in the current run (1 single, 2 double, 3 triple). Chromium only counts clicks the input layer
    // marks (e.detail); harnesses without a triple click (BrowserGym) send separate single clicks in one action.
    // The kit counts left presses within 5 px of the previous one, in the same agent action (no stepClock in
    // between) and within 500 ms; this is the larger of the two. Call it from mousedown/mouseup/click handlers.
    clickCount(e) {
      const run = kit.input.clickRun(env);
      return Math.max(1, (e && e.detail) || 0, run ? run.n : 1);
    },
    // Pure helpers for task logic (kit/runtime/data.js header: edit distance, JSON copy and equality, clamp, cap,
    // quote, pad, weighted pick, report facts, calendar days, colour distance), and the FNV-1a string hash the rng
    // forks with.
    ...kit.data,
    hash32: kit.rng.hash32,
    // Pointer-capture drag, the older form of env.ui.track (kit/ui/pointer.js), which it now runs on.
    // handlers: start(e) -> false cancels, move(e, dx, dy), end(e, dx, dy). Returns detach().
    drag(el, handlers, label = 'drag') {
      return env.ui.track(el, {
        start: (p, e) => (handlers.start ? handlers.start(e) : undefined),
        move: (p, e) => handlers.move && handlers.move(e, p.dx, p.dy),
        end: (p, e) => handlers.end && handlers.end(e, p.dx, p.dy),
      }, label);
    },
    // A <style id=id> in <head> with this text, added once (later calls with the same id return the same element
    // unchanged; the element outlives reset()).
    css(id, text) {
      let s = document.getElementById(id);
      if (s) return s;
      s = document.createElement('style');
      s.id = id;
      s.textContent = text;
      document.head.append(s);
      return s;
    },
  };

  const content = {
    WORDS: ['anchor', 'banjo', 'cactus', 'dolphin', 'ember', 'falcon', 'glacier', 'harbor', 'igloo',
      'jasmine', 'kettle', 'lantern', 'meadow', 'nectar', 'orchid', 'pepper', 'quartz', 'raven',
      'saddle', 'tundra', 'umber', 'velvet', 'walnut', 'yonder', 'zephyr'],
    MONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July',
      'August', 'September', 'October', 'November', 'December'],
    COLORS: { red: '#e03131', blue: '#1c7ed6', green: '#2f9e44', orange: '#f76707',
      purple: '#7048e8', yellow: '#f2c200', pink: '#d6336c', teal: '#0c8599', brown: '#8d5524', gray: '#868e96' },
    SHAPES: ['circle', 'square', 'triangle', 'diamond', 'star', 'hexagon'],
  };

  // ---------------------------------------------------------------- page loading

  const params = Object.fromEntries(new URLSearchParams(location.search));
  const ROOT = new URL('../', document.currentScript.src);

  // Where each node the site's frame() built outside the stage sits. A widget may move frame into the stage (the end
  // control, a footer, an empty slot it fills with its own button); a re-render (fault, silent, preempt, a timed
  // widget without sync) clears the stage, so restoreChrome() first puts such nodes back.
  function frameHomes(stage) {
    const homes = new Map();
    eachNode(document.body, stage, (n) => homes.set(n, { parent: n.parentNode, next: n.nextSibling }));
    return homes;
  }

  // Every node under root (elements and text), skipping the subtree of stop.
  function eachNode(root, stop, f) {
    for (const n of Array.from(root.childNodes || [])) {
      if (n === stop) continue;
      f(n);
      eachNode(n, stop, f);
    }
  }

  // Chrome nodes inside the stage go back to their place, emptied of what the widget added to them (the fresh render
  // adds it again).
  function restoreFrame(stage, homes) {
    if (!homes) return;
    const moved = [];
    for (const el of stage.querySelectorAll('*')) {
      const home = homes.get(el);
      if (home && home.parent.isConnected && !stage.contains(home.parent) && !moved.some((m) => m.contains(el))) moved.push(el);
    }
    if (!moved.length) return;
    let left = moved;
    while (left.length) {
      const ready = left.filter((el) => { const h = homes.get(el); return !h.next || h.next.parentNode === h.parent || !moved.includes(h.next); });
      for (const el of (ready.length ? ready : left)) {
        const h = homes.get(el);
        h.parent.insertBefore(el, h.next && h.next.parentNode === h.parent ? h.next : null);
      }
      left = ready.length ? left.filter((el) => !ready.includes(el)) : [];
    }
    for (const el of moved) {
      const added = [];
      eachNode(el, null, (n) => { if (!homes.has(n)) added.push(n); });
      for (const n of added) n.remove();
    }
  }

  // Elements the last render appended to frame nodes outside the stage (instruction steps, options in a frame slot):
  // the fresh render appends them again, so they go first and a re-render does not duplicate them. Only plain
  // appends: an element that holds frame nodes, or one in a frame node whose own children the widget replaced
  // (rewritten text), stays for the widget to handle as before.
  function dropAppended(appended, stage, homes) {
    if (!homes) return;
    const intact = (p) => [...homes].every(([n, h]) => h.parent !== p || n.parentNode === p);
    for (const el of appended) {
      const p = el.parentNode;
      if (!p || !el.isConnected || stage.contains(el) || !homes.has(p) || !intact(p)) continue;
      let holds = false;
      eachNode(el, null, (n) => { holds = holds || homes.has(n); });
      if (!holds) el.remove();
    }
  }

  function resolve(path, site) {
    if (/^(kit|vendor|tasks|sites|templates)\//.test(path) || /^[a-z]+:/.test(path)) return new URL(path, ROOT).href;
    return new URL(`sites/${site}/${path}`, ROOT).href;
  }

  // Several scripts at once: they download in parallel and run in the order given; rejects with the first failure.
  function loadScripts(srcs) {
    return Promise.all(srcs.map((src) => loadScript(src, true)));
  }

  // ordered: a script inserted with others (loadScripts) runs in insertion order while all of them download at once.
  function loadScript(src, ordered = false) {
    return new Promise((ok, fail) => {
      const s = document.createElement('script');
      if (ordered) s.async = false;
      s.src = src;
      // An error thrown while the file runs fails the boot with its message: a definition check
      // (kit/runtime/validate.js), or any other error at the file's top level (otherwise its definition would be
      // missing and the boot would fail later, as "no widgets for ...", without the cause).
      let invalid = null;
      const onError = (e) => {
        if (invalid) return;
        if (e.error && e.error.validation) invalid = e.error;
        else if (e.filename && e.filename === s.src) invalid = new Error(`${src}: ${e.error && e.error.stack || e.message}`);
      };
      window.addEventListener('error', onError);
      s.onload = () => {
        window.removeEventListener('error', onError);
        if (invalid) fail(invalid);
        else ok();
      };
      s.onerror = () => {
        window.removeEventListener('error', onError);
        fail(new Error(`failed to load ${src}`));
      };
      document.head.append(s);
    });
  }

  function loadStyle(href) {
    return new Promise((ok, fail) => {
      const l = document.createElement('link');
      l.rel = 'stylesheet';
      l.href = href;
      l.onload = ok;
      l.onerror = () => fail(new Error(`failed to load ${href}`));
      document.head.append(l);
    });
  }

  // ---------------------------------------------------------------- runtime

  const tasks = {};
  const scenarioDefs = {};
  const sites = {};
  const widgets = {};
  const templates = {};
  const templateUses = {};
  const templateLibs = {};
  // Headless widget primitives (env.ui.*), loaded before the site. See kit/ui/*.js headers.
  // kit/ui/_base.js (helpers the primitive files share) first.
  const UI_PRIMITIVES = ['_base', 'pointer', 'slider', 'sortable', 'resize', 'surface', 'text', 'form', 'click', 'scroll'];
  // Shared content banks (env.content.*), loaded before the site. See kit/content/core.js.
  const CONTENT_FILES = ['core', 'people', 'commerce', 'places', 'text', 'ui', 'locale', 'safety'];

  const env = {
    version: '1.0',
    Rng,
    util,
    content,
    ready: false,
    bootError: null,
    // The runtime modules' state, one slot per module (env._rt.clock, env._rt.fault, ...; see MODULES).
    _rt: {},

    // env.task / scenario / site / widget check the definition when it registers (kit/runtime/validate.js).
    task(def) {
      kit.validate.task(def);
      if (tasks[def.name]) throw new Error(`env.task('${def.name}'): registered twice`);
      tasks[def.name] = def;
    },
    // Per-scenario objects of a task (its files register them after its logic.js; see the task contract).
    scenario(task, def) {
      if (!tasks[task]) throw new Error(`env.scenario: task '${task}' is not registered`);
      kit.validate.scenario(tasks[task], def);
      if (this.scenariosOf(task)[def.name]) throw new Error(`env.scenario('${task}'): '${def.name}' is registered twice`);
      this.scenariosOf(task)[def.name] = def;
    },
    scenariosOf(task) { return (scenarioDefs[task] = scenarioDefs[task] || {}); },
    site(def) {
      kit.validate.site(def);
      if (sites[def.name]) throw new Error(`env.site('${def.name}'): registered twice`);
      sites[def.name] = def;
    },
    widget(def) {
      kit.validate.widget(def, {}, def && tasks[def.task]);
      const own = (widgets[def.task] ||= {});
      if (def.name !== undefined && own[def.name]) throw new Error(`env.widget(${def.task}/${def.name}): registered twice`);
      own[def.name] = def;
    },
    // A template may name shared template files it builds on (opts.uses: ['<task>/<lib>', ...]): the kit loads them
    // before the template is used, and its code reads each with env.templateLib(name).
    template(name, make, opts = {}) {
      if (templates[name]) throw new Error(`env.template('${name}'): registered twice`);
      templates[name] = make;
      templateUses[name] = opts.uses || [];
    },
    // A shared template file's value: what its make() returns, built once per page (templates/README.md, "Shared
    // template files").
    templateLib(name) {
      if (!templates[name]) throw new Error(`env.templateLib('${name}'): not loaded (list it in the template's uses)`);
      if (!Object.hasOwn(templateLibs, name)) templateLibs[name] = templates[name]();
      return templateLibs[name];
    },
    // For template files: resolve one widget's design into its tokens D and parts P. Layers, in order: the token
    // defaults (tokens), the preset of the widget's scenario (scenarios[v] when the widget declares exactly one scenario
    // v), the widget's design. A layer is { ...tokens, parts: { <part>: (base, state) => replacement } }; an override
    // wraps the layer below it. Unknown tokens or parts throw.
    templateDesign(name, design, def, { tokens, scenarios = {}, base, state }) {
      const D = { ...tokens };
      const P = { ...base };
      const only = (def.scenarios || []).length === 1 ? def.scenarios[0] : null;
      for (const layer of [(only && scenarios[only]) || {}, design || {}]) {
        const { parts = {}, ...set } = layer;
        for (const [k, v] of Object.entries(set)) {
          if (!(k in tokens)) throw new Error(`${name}: unknown design token '${k}'`);
          D[k] = v;
        }
        for (const [k, wrap] of Object.entries(parts)) {
          if (!(k in base)) throw new Error(`${name}: unknown part '${k}'`);
          P[k] = wrap(P[k], state);
        }
      }
      return { D, P };
    },
    widgetsFor(task) { return Object.keys(widgets[task] || {}); },
    taskOf(name) { return tasks[name]; },
    widgetOf(task, name) { return (widgets[task] || {})[name]; },

    async boot() {
      try {
        const task = params.task;
        const site = params.site || 'base';
        if (!task) throw new Error('missing ?task=');
        await loadScripts([...UI_PRIMITIVES.map((name) => `kit/ui/${name}.js`),
          ...CONTENT_FILES.map((name) => `kit/content/${name}.js`), 'kit/instruct.js'].map((f) => resolve(f, site)));
        await loadScript(resolve(`sites/${site}/site.js`, site));
        if (!sites[site]) throw new Error(`sites/${site}/site.js did not call env.site({name: '${site}'})`);
        if (sites[site].template) {
          const { design, ...own } = sites[site];
          const make = await this._template(own.template, site);
          // The built site replaces its design entry (registered by site.js) under the same name.
          delete sites[site];
          this.site({ ...make(design || {}, own), ...own });
        }
        const siteDef = sites[site];
        for (const href of siteDef.styles || []) await loadStyle(resolve(href, site));
        for (const src of siteDef.scripts || []) await loadScript(resolve(src, site));
        // The site as it stands once its template and scripts have filled it in (trait-tests completes its own there).
        kit.validate.site(siteDef, { resolved: true });
        // A site without its own fault() / hazard() takes the missing hook from templates/site/hooks.js, so page
        // faults (every kind) and safety hazards reach every site.
        if (typeof siteDef.fault !== 'function' || typeof siteDef.hazard !== 'function') {
          const hooks = (await this._template('site/hooks', site))();
          for (const k of ['fault', 'hazard']) if (typeof siteDef[k] !== 'function') siteDef[k] = hooks[k];
        }
        await this._task(task, site);
        this.taskDef = tasks[task];
        if (!this.taskDef) throw new Error(`tasks/${task}/logic.js did not register '${task}'`);
        // Composite tasks name the tasks they embed (uses: [...]); load their logic too.
        for (const sub of this.taskDef.uses || []) {
          if (!tasks[sub]) await this._task(sub, site);
        }
        await loadScript(resolve(`sites/${site}/widgets/${task}.js`, site));
        await this._templated(task, site);
        this.siteDef = siteDef;
        const names = this.widgetsFor(task);
        if (!names.length) throw new Error(`no widgets for ${task} on ${site}`);
        const widgetName = params.widget || names[0];
        this.widgetDef = widgets[task][widgetName];
        if (!this.widgetDef) throw new Error(`unknown widget '${widgetName}' (have ${names.join(', ')})`);
        // Composite widgets name the [task, widget] pairs they embed; load those widget files.
        for (const [sub] of this.widgetDef.uses || []) {
          if (!widgets[sub]) {
            await loadScript(resolve(`sites/${site}/widgets/${sub}.js`, site));
            await this._templated(sub, site);
          }
        }
        const seed = 'seed' in params ? Number(params.seed) : Math.floor(Math.random() * 2 ** 31);
        if (!Number.isInteger(seed)) throw new Error(`?seed= must be an integer, not '${params.seed}'`);
        this.reset(seed);
        this.ready = true;
      } catch (err) {
        this.bootError = String(err && err.stack || err);
        console.error(err);
        document.body.textContent = `megawob boot error: ${err}`;
      }
    },

    // tasks/<name>/logic.js, then the files it lists (files: [...]).
    async _task(name, site) {
      await loadScript(resolve(`tasks/${name}/logic.js`, site));
      const def = tasks[name];
      if (!def) return;
      await loadScripts((def.files || []).map((file) => resolve(`tasks/${name}/${file}`, site)));
      const own = scenarioDefs[name];
      const missing = own ? (def.scenarios || []).filter((v) => !own[v]) : [];
      if (missing.length) throw new Error(`tasks/${name}: no env.scenario() object for ${missing.join(', ')}`);
    },

    async _template(name, site) {
      if (!templates[name]) await loadScript(resolve(`templates/${name}.js`, site));
      if (!templates[name]) throw new Error(`templates/${name}.js did not call env.template('${name}', ...)`);
      for (const lib of templateUses[name] || []) await this._template(lib, site);
      return templates[name];
    },
    // Widgets that name a template: load templates/<template>.js once and build the widget from it. A template may
    // return several widgets (a widget file with no name: the base site's); each takes its own place, in order.
    async _templated(task, site) {
      if (!widgets[task]) return;
      const out = {};
      for (const [name, def] of Object.entries(widgets[task])) {
        if (!def.template) { out[name] = def; continue; }
        const make = await this._template(def.template, site);
        const { design, ...own } = def;
        const made = make(design || {}, def);
        for (const d of Array.isArray(made) ? made : [made]) {
          const built = { ...d, ...own };
          kit.validate.widget(built, { resolved: true }, tasks[task]);
          out[Array.isArray(made) ? d.name : name] = built;
        }
      }
      widgets[task] = out;
    },

    // One episode, in steps: draw it, write its instruction, reset the per-episode state, build the page frame,
    // schedule what the page does on its own, render the widget, then show what is due at step 0 and start the clock.
    reset(seed, scenario, opts = {}) {
      if (scenario && typeof scenario === 'object') {
        opts = scenario;
        scenario = undefined;
      }
      const rng = this._sampleEpisode(seed, scenario, opts);
      this._buildInstruction(rng);
      this._resetState(rng);
      this._mountPage(rng);
      this._schedule();
      this._mountWidget();
      kit.overlay.tick(this);
      this.render();
      kit.clock.start(this);
      return this.score();
    },

    // Seed and opts, the randomization parameters, then spec and start model; judge and answerIn=reply episodes switch off the
    // knobs that cannot apply to them. Returns the episode's rng.
    _sampleEpisode(seed, scenario, opts) {
      this.seed = seed >>> 0;
      this._episodeId = (this._episodeId || 0) + 1;
      this.opts = kit.knobs.fromParams({ ...params, ...opts });
      if (scenario !== undefined && scenario !== null) this.opts.scenario = scenario;
      const rng = new Rng(this.seed);
      // Vendored libraries may call Math.random; make them deterministic too.
      const mathRng = rng.fork('math');
      Math.random = () => mathRng.next();

      const fam = this.taskDef;
      const widget = this.widgetDef;
      const scenarios = (widget.scenarios || fam.scenarios || []).filter((v) => !fam.scenarios || fam.scenarios.includes(v));
      if (this.opts.scenario && scenarios.length && !scenarios.includes(this.opts.scenario)) {
        throw new Error(`scenario '${this.opts.scenario}' not supported by widget ${widget.name} (has ${scenarios.join(', ')})`);
      }

      // Randomization parameters (see the header; draws in kit/runtime/knobs.js): sampled once per episode from their own rng
      // streams, so adding a knob never shifts the task's own randomness.
      const ep = kit.knobs.episode(rng, this.opts, { fam, site: this.siteDef, widget, content });
      this.episode = ep;
      const start = ep.start;

      // Resample until the start state matches the start mode: 'off' = clearly off target (minInitialError),
      // 'partial' / 'wrong' = off target (the task's init builds the half-done or wrongly-done state),
      // 'solved' = already within tolerance (built with solve() if init does not produce it).
      let spec;
      let model;
      let tol;
      const sampleOpts = kit.knobs.sampleOpts(ep, this.opts, scenarios, widget.traits || {});
      for (let tries = 0; tries < 50; tries++) {
        spec = fam.sample(rng.fork(`spec#${tries}`), sampleOpts);
        if (spec && spec.startMode === undefined) spec.startMode = start;
        model = fam.init(spec, rng.fork(`init#${tries}`));
        tol = fam.tolerance(spec);
        const err = fam.error(model, spec);
        if (kit.judge.leavesPage(spec)) break;
        if (start === 'solved') {
          if (err > tol.tau + 1e-9) model = fam.solve(spec, model);
          if (fam.error(model, spec) <= tol.tau + 1e-9) break;
        } else if (start === 'off' ? err > (tol.minInitialError ?? 3 * tol.tau) : err > tol.tau + 1e-9) break;
      }
      this.spec = spec;
      this.model = model;
      this.error0 = fam.error(model, spec);
      this.tau = tol.tau;
      this.sigma = tol.sigma ?? 2.5 * tol.tau;
      ep.judge = kit.judge.episodeMode(spec);
      // A judge episode is about how it ends: no report or interruption on top (finish stays as drawn).
      if (ep.judge) {
        ep.report = false;
        ep.preempt = null;
      }
      // answerIn=reply (kit/runtime/answer.js): only where sample() built it; the reply is the ending (finish mode),
      // and progress is measured without the answer fields (the start error with them empty).
      if (ep.answer) {
        ep.answer = kit.answer.episodeMode(ep, fam, spec);
        if (ep.answer) {
          ep.finish = true;
          if (ep.silent) ep.silent = false; // nothing typed on the page for a save to corrupt
          this.error0 = fam.error(fam.answered(model, spec, kit.answer.fields(fam, spec).map(() => '')), spec);
        }
      }
      return rng;
    },

    // The instruction the site shows: the task's text (kept as plainInstructionText), the messy knob, then the
    // report and answerIn=reply requests; and the structured reply format the goal text gives.
    _buildInstruction(rng) {
      const ep = this.episode;
      this.instructionText = this.taskDef.instruction(this.spec, rng.fork('instruction'));
      this.plainInstructionText = this.instructionText;
      if (ep.messy !== 'off' && env.instruct && env.instruct.messy) {
        this.instructionText = env.instruct.messy(rng.fork('messy'), this.instructionText, ep.messy, ep.isplit);
      }
      // report: ask for the facts at the end of the goal text (the task's own text stays plainInstructionText).
      if (ep.report) {
        const more = kit.report.suffix(this, rng.fork('report'));
        if (more) this.instructionText = `${this.instructionText.replace(/\s+$/, '')} ${more}`;
      }
      // answerIn=reply: ask for the answer in the reply (after the report's request, which names its own facts).
      if (ep.answer) {
        const more = kit.answer.suffix(this, rng.fork('answer'));
        if (more) this.instructionText = `${this.instructionText.replace(/\s+$/, '')} ${more}`;
      }
      // The structured reply format for an ending message (kit/runtime/reply.js), drawn for every episode; goal() only.
      kit.reply.reset(this, rng.fork('reply'));
    },

    // Per-episode fields, and the slots of the modules that keep state between actions: input (click runs, rejected
    // input, cursorlag; a button a native drag left held is released), split (a held drag), clock (the frame loop of
    // the previous episode is stopped; step count, CSS animation times, the step watcher's baseline).
    _resetState(rng) {
      const ep = this.episode;
      this._events = [];
      this.flags = new Set();
      this.presses = 0;
      this.rejected = { keyboard: 0, wheel: 0 };
      kit.input.reset(this);
      kit.split.reset(this);
      this.done = false;
      this.final = null;
      this.endReason = null;
      this.finishMessage = null;
      this.finishInfeasible = false;
      this.t0 = performance.now();
      this.rng = rng;
      this.clockMs = 0;
      this.taskMs = 0; // the task's task time: equals clockMs unless site.pauseOnOverlay paused it
      this.tickRng = rng.fork('tick');
      this.timed = typeof this.taskDef.tick === 'function';
      this.clockMode = ep.clock;
      this.stepMs = ep.stepMs;
      this.timescale = ep.timescale;
      kit.clock.reset(this);
    },

    // The page frame: the document reset for the episode (scroll, <html lang>, the clock=action caret) and the
    // site's frame(), which returns the stage the widget renders into and the end control (none in finish mode).
    _mountPage(rng) {
      const ep = this.episode;
      const fam = this.taskDef;
      const widget = this.widgetDef;
      const spec = this.spec;
      const scrollable = typeof widget.scrollable === 'function' ? !!widget.scrollable(spec) : !!widget.scrollable;
      ep.scrollable = scrollable;
      document.body.replaceChildren();
      document.documentElement.removeAttribute('style');
      document.documentElement.lang = ep.lang === 'en' ? 'en' : ep.locale; // CJK font choice follows lang
      document.documentElement.classList.toggle('env-scroll', scrollable);
      // clock=action: the caret blinks on a 500 ms wall-time timer no CSS animation API reaches; hide it.
      document.documentElement.classList.toggle('env-clock-action', this.clockMode === 'action');
      window.scrollTo(0, 0);
      const frame = this.siteDef.frame(kit.overlay.siteCtx(this, {
        rng: rng.fork(`chrome/${kit.salt(fam.name)}`),
        instruction: this.instructionText,
        plainInstruction: this.plainInstructionText,
        spec,
        display: ep.instr,
        finish: ep.finish,
        scrollable,
        submit: () => this.submit(),
        task: fam.name,
        scenario: spec.scenario,
      }));
      if (!frame || !frame.stage || (!frame.submit && !ep.finish)) {
        throw new Error('site.frame() must return { stage, submit } (submit may be null only when ctx.finish)');
      }
      this.stage = frame.stage;
      this.submitEl = frame.submit || null;
      this._frameHome = frameHomes(this.stage);
      // Chrome elements (body children the site made); the oracle scrolls targets out from under the fixed ones.
      this.frameEls = [...document.body.children].filter((el) => !el.contains(this.stage));
      ep.finish = !this.submitEl;
    },

    // What the page does on its own, drawn now: the overlay schedule and the round-2 knobs (kit/runtime/fault.js,
    // hazard.js, silent.js, preempt.js; each is a no-op when off). Each schedule() creates its module's slot.
    _schedule() {
      kit.overlay.schedule(this);
      kit.fault.schedule(this);
      kit.hazard.schedule(this);
      kit.silent.schedule(this);
      kit.preempt.schedule(this);
    },

    // The kit's page tools and the widget's first render, then the step watcher's baseline and clear's start model
    // (kit/runtime/clock.js baseline), taken after the widget mirrored its layout facts into the model.
    _mountWidget() {
      this._mountTools();
      this._rt.fit = null;
      this._render();
      kit.fit.repair(this); // a layout that leaves the widget no room renders again into the stage's clear part
      kit.clock.baseline(this);
    },

    // Task clock (kit/runtime/clock.js).
    advance(ms) { return kit.clock.advance(this, ms); },
    stepClock() { return kit.clock.step(this); },
    // One call per agent action for harnesses: stepClock(), then status() and inputFeedback().
    tick() {
      this.stepClock();
      return { status: this.status(), feedback: this.inputFeedback() };
    },
    // One call after boot: what a harness reads at setup (null goal and status while booting or after a boot error).
    bootInfo() {
      const ok = this.ready && !this.bootError;
      return {
        ready: this.ready, bootError: this.bootError || null,
        viewport: { width: window.innerWidth, height: window.innerHeight },
        goal: ok ? this.goal() : null, status: ok ? this.status() : null,
        episode: ok ? this.state().episode : null, scenario: ok ? this.spec.scenario : null,
      };
    },
    // Overlays (kit/runtime/overlay.js).
    dismissOverlay(how, which) { kit.overlay.dismiss(this, how, which); },
    // Endings and scoring (kit/runtime/score.js).
    finish(message, info) { kit.score.finish(this, message, info); },
    submit() { kit.score.submit(this); },
    flag(name, data) { kit.score.flag(this, name, data); },
    score() { return kit.score.score(this); },
    status() { return kit.score.status(this); },
    // Input layer (kit/runtime/input.js).
    inputs() { return kit.input.inputs(this); },
    rejectInput(kind, data) { kit.input.reject(this, kind, data); },
    inputFeedback() { return kit.input.feedback(this); },
    // Oracle (kit/runtime/oracle.js).
    oracle() { return kit.oracle.next(this); },

    // Widgets whose layout legitimately changes (a list re-sorts, a skeleton resolves) re-baseline the anchors.
    reanchor(els) {
      const list = els && els.length ? els : this.anchors.map(([el]) => el);
      this.anchors = list.map((el) => [el, kit.score.anchorKey(this, el)]);
      this.log('reanchor', { n: list.length });
    },

    // Re-render the widget after the kit replaced the model or the spec (fault revert / clear / shift, silent,
    // preempt switch): a fresh render with fresh anchors, the page scroll kept.
    _repaint() {
      const x = window.scrollX;
      const y = window.scrollY;
      this._render();
      if (x || y) window.scrollTo(x, y);
      this.log('repaint');
      this.render();
    },

    _sync() {
      if (this.view && typeof this.view.sync === 'function') this.view.sync(this.model);
      else this._render();
    },

    _render() {
      restoreFrame(this.stage, this._frameHome);
      dropAppended(this._appended || [], this.stage, this._frameHome);
      this.stage.replaceChildren();
      const root = kit.fit.root(this); // the stage, or the fit wrapper when the layout needed repair
      const outside = new Set();
      eachNode(document.body, this.stage, (n) => outside.add(n));
      const r = root.getBoundingClientRect();
      const env_ = this;
      // A widget's late events (scroll, resize, selection arrive a frame after they happen) can reach a ctx after
      // the next reset; such calls are dropped so they cannot write into the new episode.
      const episodeId = this._episodeId;
      const current = (what) => {
        if (episodeId === env_._episodeId) return true;
        env_.log('ignored', { reason: 'stale episode', what });
        return false;
      };
      const ctx = {
        spec: this.spec,
        get model() { return env_.model; },
        rng: this.rng.fork('skin'),
        stage: root,
        size: { width: r.width, height: r.height },
        opts: this.opts,
        update: (m) => current('update') && this._update(m),
        patch: (p) => current('patch') && this._update({ ...env_.model, ...p }),
        css: util.css,
        log: (type, data) => current('log') && this.log(type, data),
        flag: (name, data) => current('flag') && this.flag(name, data),
        reanchor: (els) => current('reanchor') && this.reanchor(els),
        clock: () => this.taskMs,
        get done() { return episodeId !== env_._episodeId || env_.done; },
        episode: this.episode,
        util,
        content,
      };
      const view = this.widgetDef.render(ctx) || {};
      this.view = view;
      this._appended = [];
      eachNode(document.body, this.stage, (n) => {
        if (n.nodeType === 1 && !outside.has(n) && outside.has(n.parentNode)) this._appended.push(n);
      });
      this.anchors = (view.anchors && view.anchors.length ? view.anchors : [this.stage]).map((el) => [el, kit.score.anchorKey(this, el)]);
    },

    _update(model) {
      if (this.done) {
        this.log('ignored', { reason: 'episode over' });
        return;
      }
      this.model = model;
      const reason = this.taskDef.ended && this.taskDef.ended(model, this.spec);
      if (reason) kit.score.end(this, reason);
      this.render();
    },

    log(type, data = {}) {
      this._events.push({ t: Math.round(performance.now() - this.t0), type, ...data });
    },

    state() {
      return {
        task: this.taskDef.name,
        site: this.siteDef.name,
        widget: this.widgetDef.name,
        scenario: this.spec.scenario,
        seed: this.seed,
        clock: this.clockMs,
        episode: { ...this.episode, ...kit.overlay.records(this) },
        spec: this.spec,
        model: this.model,
        rejected: { ...this.rejected },
        // Round-2 knobs, only when on (so other episodes' state is unchanged): the hazard {kind, shown, gone,
        // unsafe} and the interruption {mode, fired}.
        ...(kit.hazard.on(this) ? { hazard: kit.hazard.record(this) } : {}),
        ...(kit.preempt.on(this) ? { preempt: kit.preempt.record(this) } : {}),
      };
    },

    instruction() { return this.instructionText; },
    // The goal text for harnesses: the instruction, then the reply format (the page shows only the instruction).
    goal() { const f = kit.reply.text(this); return f ? `${this.instructionText.replace(/\s+$/, '')}\n\n${f}` : this.instructionText; },
    events() { return this._events.slice(); },
    idle() { return new Promise((ok) => requestAnimationFrame(() => requestAnimationFrame(() => ok(true)))); },

    render() {
      if (!this.debugEl || this.debugEl.hidden) return;
      const s = { ...this.state(), status: this.status() };
      const round = (v) => (typeof v === 'number' ? Math.round(v * 1000) / 1000 : v);
      this.debugEl.textContent = JSON.stringify(s, (k, v) => round(v), 1);
    },

    // The kit's own page tools: the drawn cursor, the shortcut button (shortcut=1) and the debug view (debug=1).
    _mountTools() {
      const cursor = util.el('div', '', document.body);
      cursor.id = 'env-cursor';
      cursor.innerHTML =
        '<div class="ring"></div><svg width="16" height="22" viewBox="0 0 16 22">' +
        '<path d="M1 1 L1 18 L5.5 14 L8.5 21 L11.5 19.8 L8.6 13 L14 13 Z" fill="#fff" stroke="#000" ' +
        'stroke-width="1.2" stroke-linejoin="round"/></svg>';
      cursor.hidden = this.opts.cursor === '0';
      this.cursorEl = cursor;
      if (this.lastPointer) kit.input.trackCursor(this, this.lastPointer, true);

      const btn = util.el('button', '', document.body, 'Set to target');
      btn.id = 'env-shortcut';
      btn.hidden = !truthy(this.opts.shortcut);
      btn.addEventListener('click', () => {
        this.model = this.taskDef.solve(this.spec, this.model);
        this._sync();
        this.flag('shortcut');
      });
      this.shortcutBtn = btn;

      const debug = util.el('pre', '', document.body);
      debug.id = 'env-debug';
      debug.hidden = !truthy(this.opts.debug);
      this.debugEl = debug;
    },
  };

  // Window listeners, registered before any page script (kit/runtime/input.js).
  kit.input.install(env);
  kit.fault.install(env);

  window.__env = env;
  window.env = env;
})();
