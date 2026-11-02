/*
 * scroll-page: scroll a long page to find content below the fold and act on it.
 * Find and act on content below the fold of a long, realistic page (news article, docs page,
 * help-center FAQ, product page, terms of service) under the site's sticky header. The page itself scrolls
 * (the widget is scrollable): the agent wheels, uses the page's own navigation (table of contents, "Back to
 * top") or the keyboard (PageDown / Home), reads content that is off-screen and acts on it. No MiniWoB
 * counterpart (closest: click-link and scroll-text, which never scroll the page).
 *
 * scenarios
 *   link       click one link or button in a section in the lower half of the page. The goal names the
 *              section by its heading, or describes it ("the part about sending items back"), or (when the
 *              label is unique on the page) only says it is further down. Generic labels ("Learn more",
 *              "Contact us") repeat across sections, so the section matters.
 *   accordion  a FAQ block far down the page: expand the named (or described) question, then click the link
 *              inside its answer. Some answers share link labels. Items may be exclusive (opening one
 *              closes the others).
 *   copy       read a value (order number, tracking code, booking reference, ...) printed far down the page
 *              and type it into a field at the top ('down'), or the reverse: a value at the top into a field
 *              near the end ('up'). Other codes with other labels are printed on the page as decoys.
 *   top        the page starts scrolled to the very bottom; click a tool in the page's own header ("Share",
 *              "Follow", "Download PDF", ...). The same labels also appear in a toolbar at the bottom of the
 *              page, which is the wrong one. A floating "Back to top" button appears once scrolled.
 *   nested     a scroll pane inside the long page (release history, live updates, other sellers, previous
 *              versions, help articles): find the named row in the pane and click its action. ood: the pane
 *              holds groups, each with its own inner scroll pane (two levels of nesting).
 *   Scroll containers: the same pane kinds and rows, in other kinds of container. All of them are
 *   hosted in a section of the long page like nested, so the page scrolls to the container first and the agent
 *   then has to scroll the right container the right way.
 *   hscroll    a horizontal strip of cards (target off to the right): wheel with dx over the strip, or drag the
 *              strip's horizontal scrollbar thumb (spec.paneRoute).
 *   carousel   scroll-snap carousel, one slide at a time: the slide's prev / next arrows, swipe (drag the slide
 *              sideways) or a wheel with dx (spec.slideRoute 'arrows' | 'swipe' when paneRoute is not 'wheel').
 *   sticky     a list whose header row is sticky inside the pane and covers the rows scrolled under it. A row
 *              that is only partly below the header does not count: the widget ignores clicks on it and the
 *              target is "seen" only when its whole row is visible.
 *   lazy       a list that appends rows only when it is scrolled to its end (model.loaded counts the rows
 *              loaded; no timers): the target row does not exist until enough batches have loaded.
 *   siblings   two scroll panes side by side with different titles; only one holds the target row. Scrolling
 *              the other pane does nothing for the task (its rows have actions too: wrong clicks).
 *
 * Wrong clicks. Every link, button and tool in the page content is an "action". Clicking an action other
 * than the target "navigates away" (the widget shows the linked page with a Back button). Not recoverable
 * (spec.recoverable false): the episode ends ('wrong-link'). Recoverable: the first wrong click only opens
 * that page (error 1 until Back is clicked); a second wrong click ends the episode. Table-of-contents links,
 * "Back to top", accordion headers and the copy field are navigation, never wrong.
 *
 * spec   { scenario, kind ('article'|'docs'|'faq'|'product'|'terms'), title, meta, crumbs[], startMode,
 *          isplit, csplit, ood, recoverable, route ('wheel'|'nav'|'keys'), keys (keyboard allowed), toc,
 *          forcedRoute? (opts.route when set),
 *          paneRoute ('wheel'|'thumb': how the oracle scrolls inner panes),
 *          tools: [action], bottomTools: [action] (top scenario), sections: [{ id, heading, about,
 *          paras: [str], actions: [action] }], target (action id; not copy), targetSection (section id),
 *          faq?: { at (section index the block follows), exclusive, items: [{ id, q, about, paras,
 *          actions }] }, item (accordion: target question id),
 *          pane?: { id, at (section index), kind, title, label, groups?: [{ id, title, pane: { id, rows } }],
 *          rows?: [{ id, title, ref, meta, actions }], hh? (sticky: header height px), initial? / batch? (lazy:
 *          rows loaded at the start / per load; rows holds them all) }, row (target row id; nested and the
 *          scroll containers), group (ood: its group), pane2? (siblings: { id 'p1', kind, title, rows }, the
 *          pane without the target), first2? (siblings: the target pane comes first), slideRoute? (carousel),
 *          copy?: { dir ('down'|'up'), value, vlabel, valiases[], field (label), section (where the value
 *          or the field sits), decoys: [{ label, value, section }] } }
 *          action = { id, label, kind ('link'|'button') }
 * model  { done (target clicked), clicked: [action ids], away (wrong page open: action id | null), wrongs,
 *          open: [faq item ids], loaded? (lazy: rows loaded), slide? (carousel: current slide; mirrored),
 *          text (copy field), seen (target seen on screen; mirrored by the widget),
 *          where ('above'|'in'|'below': the target relative to the viewport; mirrored), paneWhere (the same
 *          for the outer scroll pane box, nested), atTop (page scrolled
 *          to the top; mirrored), jumped (section id of the last table-of-contents jump),
 *          align-layout: { [paneId]: { first, last, pitch, scrolls } } (rows fully visible in each pane; mirrored),
 *          startAt (null | 'bottom' | 'middle' | section id: where the
 *          widget scrolls the page when it renders the start state) }
 * error  tau = 0
 *   link, top, nested   1 while a wrong page is open; 0 once the target is clicked; else 1 - 0.5 [seen]
 *   accordion           1 while away; 0 once clicked; else 1 - 0.25 [seen] - 0.25 [target question open]
 *   copy                1 while away; else normalized edit distance between the field and the value (case
 *                       and surrounding spaces ignored)
 *
 * start modes  off; partial (link/top/nested: the page already scrolled near the target, seen; accordion:
 *              the question already open; copy: the first half of the value typed); wrong (a wrong page is
 *              open; copy: a decoy code typed); solved.
 * routes       spec.route: 'wheel' (the kit scrolls the page with the wheel when a target is off-screen),
 *              'nav' (table-of-contents links, the "Back to top" button), 'keys' (PageDown / Home; only when
 *              spec.keys, which adds 'keyboard' to the inputs, ~25%). Inner panes scroll with { wheel } over
 *              the pane or by dragging the pane's scrollbar thumb (spec.paneRoute, 50/50). Copy always allows
 *              the keyboard (typing).
 * opts.route   (episode knob; undefined = the mix above, same spec as before) overrides the drawn routes and
 *              sets spec.forcedRoute: 'pointer' = route 'nav' + toc, paneRoute 'thumb', keys false (copy keeps
 *              typing, so it stays keyboard); 'keyboard' = keys true + route 'keys' (PageDown / Home; copy:
 *              unchanged); 'wheel' = route 'wheel' + paneRoute 'wheel'. The kit may still wheel the page to
 *              bring a target that the chosen route left off-screen into view.
 * ood          10-16 sections (train 5-9), 18-28 FAQ items (8-14), 26-40 pane rows (10-20) in two levels; the
 *              scroll containers get about twice the rows / slides.
 * levels       (the task is discrete, so only the size of the page changes) easy: 3-5 sections,
 *              5-8 FAQ items, 6-10 pane rows, fewer cards / slides / rows in the containers, the target close to
 *              the first screen of its container, wrong clicks recoverable (unless opts.recover is set).
 *              medium: 4-7 sections, 6-11 FAQ items, 8-14 pane rows, in between for the containers.
 * scenario mix  an unforced episode draws one of the five original scenarios exactly as before, and then with
 *              probability 1/2 (own stream rng.fork('scenario')) swaps it for one of the scroll containers.
 *
 * plan targets (the widget's locate() maps them to viewport px)
 *   { action: id }     a link / button / tool          { item: id }      a FAQ question header
 *   { toc: sectionId } a table-of-contents link        { totop: true }   the floating "Back to top" button
 *   { back: true }     Back on the wrong page          { field: true }   the copy field
 *   { value: true }    the printed value (hover)       { pane: id }      the middle of a scroll pane (wheel)
 *   { thumb: paneId }  a pane's scrollbar thumb         { scrollTo: [paneId, row index] }  where to release the
 *                                                        thumb so that the row is in the middle of the pane
 *   { arrow: 'prev'|'next' } carousel arrows            { swipeFrom: dir } / { swipeTo: dir }  a carousel swipe
 *                                                        (dir 'next' drags left); lazy: scrollTo the row count
 *                                                        (one past the last loaded row) loads the next batch
 * plan steps: { click }, { type }, { move }, { key: 'PageDown' | 'Home' }, { wheel: [{ pane }, dy, dx?] },
 * { drag: [{ thumb }, { scrollTo }] }, { drag: [{ swipeFrom }, { swipeTo }] }. Page-level scrolling for route 'wheel' is the kit's.
 *
 * Round 2 hooks (optional, pure; contract the html/kit/env.js header). With the knobs off nothing changes: sample()
 * draws extra only when opts.judge is set (from rng.fork('judge')).
 *   parts(model, spec)     preempt=cancel: the page position (scrolled to the target or not), every link / button / tool
 *                          (clicked), FAQ question (open) and, for copy, the field (typed text) and the printed codes
 *   facts(model, spec)     what the finished page shows that a person would report: the page title; link: the section
 *                          the clicked link sits in (when the goal described it) and how many links / buttons it has;
 *                          accordion: how many answers are open, the question (when described) and the links in its
 *                          answer; top: the page details line and the number of tools in the toolbar; copy: the code and
 *                          one decoy code printed elsewhere on the page; scroll containers: the host section, the row's
 *                          meta text (date, price, read time; hidden in siblings, which gives the other list's title).
 *                          [] in judge episodes (nothing was done). The page has no scroll-position readout.
 *   silent(next, prev, spec, rng)  the last click did not take: done goes back to false and the click is dropped (the
 *                          page loses the "Opened" mark; repeat the click); accordion: the question just opened snaps
 *                          shut; copy: the typed code comes back cut by 1-3 characters or with one look-alike swapped
 *                          (0/O, 1/I, 5/S, 8/B, 2/Z). null on updates that only scroll (seen, layout, slide and loaded
 *                          are mirrored from the DOM and re-derived, so they cannot be corrupted) and in judge episodes.
 *   retarget(spec, model, rng)  another goal on the same page: link: another link / button in a late section (the same
 *                          section first); accordion: another question; top: another tool; copy (dir 'down'): a decoy
 *                          code becomes the goal and the old target is printed in its place as the decoy; scroll
 *                          containers: another row (and action) of the same pane or group. null once the target is
 *                          clicked, for copy dir 'up' (the top card shows the value and would have to change) and in
 *                          judge episodes. A stale model.seen stays (the kit scrolls to the new target; panes are
 *                          re-aimed from model.layout).
 *   judgeModes ambiguous, impossible, confirm (every scenario; spec.judge = { mode, message, ... }). ambiguous and
 *              impossible start on the "done" page (error 0, nothing opened for a stand-in goal; copy: the empty
 *              field) and the instruction is a judge text; confirm is the normal task plus "check with me first".
 *     ambiguous   the goal names two candidates in the scenario's usual wording ("click A or B"): link: two links in two
 *                 sections, top: two tools, accordion: two questions, copy: two code labels (the real one and a decoy),
 *                 containers: two rows of the pane; the reply asks (status ask), one option per candidate
 *                 (spec.judge.cands: the section heading, tool, question, code label or row; others: the page's other
 *                 headings, tools, questions, labels or rows)
 *     impossible  the named thing is not on the page: a section heading, toolbar tool, FAQ question, code label or
 *                 pane row (version, time, seller, article, effective date) the page lacks; status impossible, what
 *                 names it (spec.judge.what)
 *     confirm     the click on the target is the irreversible step (copy: the button next to the field, whose label
 *                 spec.judge.button replaces the random one); the widget calls ctx.flag('irreversible') on it.
 *                 tolerance() counts the prepared page as there: tau 0.5; error 0.5 when the target is seen (accordion:
 *                 and its question open; containers: and its row fully visible in every pane), 0.75 partway, 1
 *                 otherwise (partial starts act like off); copy keeps tau 0 (the typed code).
 *   faults is not opted out: a flaky click or a late-loading page makes sense on a long page.
 *
 * Files (files: [...], loaded in order after this one; each attaches its functions to lib, which logic.js calls at call time):
 *   content.js   page content: banks (sections, FAQ, values, code formats, pane kinds) and the builders of sections,
 *                tools, FAQ items and pane rows
 *   instruct.js  instruction wording (T) and the instruction of normal and judge episodes
 *   hooks.js     judgeOf, facts, parts, silent, retarget
 *   sample.js    sample(): page, target, routes per scenario; the scroll containers' hosting
 * Self-test: selftest.js (the kit's self-test harness; the checker and node tests load it, episodes do not).
 * Helpers (widget API, env.taskDef.helpers): actionById(spec, id) the action with that id (with its place),
 * clickAction(model, spec, id) the model after a click on an action, goBack(model) the model after Back on a wrong
 * page, toggleItem(model, spec, id) the model after a FAQ question header click.
 */
(function () {
  'use strict';

  const { clone, lev, isConfirm } = env.util;
  const JUDGE_MODES = ['ambiguous', 'impossible', 'confirm'];
  // ambiguous / impossible: the right outcome is to leave the page alone
  const isIdle = (spec) => !!(spec.judge && spec.judge.mode !== 'confirm');

  // lib: the code the task's files share. Each file attaches its functions to it at load; logic.js calls them
  // through lib at call time (files, below).
  const lib = {};

  function actionsOf(spec) {
    const out = [];
    for (const a of spec.tools || []) out.push({ ...a, where: 'tools' });
    for (const s of spec.sections) for (const a of s.actions) out.push({ ...a, where: s.id });
    if (spec.faq) for (const it of spec.faq.items) for (const a of it.actions) out.push({ ...a, where: it.id });
    if (spec.pane) {
      const rowsOf = (p) => (p.groups ? p.groups.flatMap((g) => rowsOf(g.pane)) : p.rows);
      for (const r of rowsOf(spec.pane)) for (const a of r.actions) out.push({ ...a, where: r.id });
    }
    if (spec.pane2) for (const r of spec.pane2.rows) for (const a of r.actions) out.push({ ...a, where: r.id });
    for (const a of spec.bottomTools || []) out.push({ ...a, where: 'bottom' });
    return out;
  }
  const actionById = (spec, id) => actionsOf(spec).find((a) => a.id === id);
  const isTarget = (spec, id) => spec.target === id;
  const countLabel = (spec, label) => actionsOf(spec).filter((a) => a.label === label).length;

  const rowsOf = (p) => (p.groups ? p.groups.flatMap((g) => rowsOf(g.pane)) : p.rows);

  const CLASSIC = ['link', 'accordion', 'copy', 'top', 'nested'];
  // Scroll containers: panes of rows in other shapes.
  const CONTAINERS = ['hscroll', 'carousel', 'sticky', 'lazy', 'siblings'];
  const SCENARIOS = CLASSIC.concat(CONTAINERS);
  const isPane = (v) => v === 'nested' || CONTAINERS.includes(v);

  function init(spec, rng) {
    // ambiguous / impossible: nothing to change; the normal start supplies the unscored fields (scroll offsets)
    if (isIdle(spec)) return solve(spec, init({ ...spec, judge: undefined }, rng));
    const m = { done: false, clicked: [], away: null, wrongs: 0, open: [], text: '', seen: false, atTop: true,
      where: 'below', paneWhere: 'below', jumped: null, layout: {}, startAt: null };
    if (spec.scenario === 'top') {
      m.startAt = 'bottom';
      m.atTop = false;
    }
    if (spec.scenario === 'lazy') m.loaded = spec.pane.initial;
    if (spec.scenario === 'carousel') m.slide = 0;
    const wrongIds = actionsOf(spec).filter((a) => a.id !== spec.target).map((a) => a.id);
    // confirm: a partial start that has the target seen is already at the stopping point, so it starts like off
    const mode = isConfirm(spec) && spec.startMode === 'partial' && (spec.scenario === 'link' || isPane(spec.scenario)) ? 'off' : spec.startMode;
    if (mode === 'partial') {
      if (spec.scenario === 'accordion') m.open = [spec.item];
      else if (spec.scenario === 'copy') m.text = spec.copy.value.slice(0, Math.ceil(spec.copy.value.length / 2));
      else if (spec.scenario === 'top') m.startAt = 'middle';
      else {
        m.startAt = spec.targetSection;
        m.seen = true;
        m.where = 'in';
      }
    } else if (mode === 'wrong') {
      if (spec.scenario === 'copy' && rng.bool(0.6)) m.text = rng.pick(spec.copy.decoys).value;
      else if (wrongIds.length) {
        m.away = rng.pick(wrongIds);
        m.clicked = [m.away];
      }
      if (spec.scenario === 'accordion' && spec.faq.items.length > 1) {
        m.open = [rng.pick(spec.faq.items.filter((it) => it.id !== spec.item)).id];
      }
    }
    return m;
  }

  const norm = (s) => String(s || '').trim().toUpperCase();

  // The target is where a confirm episode stops: seen (accordion: and open; containers: its row fully visible in every
  // pane, which is what plan() scrolls for, and loaded for lazy: layout counts only the rows shown).
  function ready(model, spec) {
    if (!model.seen) return false;
    if (spec.scenario === 'accordion') return model.open.includes(spec.item);
    if (isPane(spec.scenario)) {
      return panePath(spec).every(({ pane, index }) => {
        const L = model.layout && model.layout[pane];
        return !!L && index >= L.first && index <= L.last;
      });
    }
    return true;
  }

  function error(model, spec) {
    if (model.away) return 1;
    if (spec.scenario === 'copy') {
      if (isIdle(spec)) return norm(model.text) ? 1 : 0; // nothing to type
      const a = norm(model.text);
      const b = norm(spec.copy.value);
      return Math.min(1, lev(a, b) / Math.max(1, b.length));
    }
    if (model.done) return 0;
    if (isConfirm(spec)) return ready(model, spec) ? 0.5 : model.seen || model.open.length ? 0.75 : 1;
    if (spec.scenario === 'accordion') return 1 - 0.25 * (model.seen ? 1 : 0) - 0.25 * (model.open.includes(spec.item) ? 1 : 0);
    return 1 - 0.5 * (model.seen ? 1 : 0);
  }

  // ---------------------------------------------------------------- transitions (shared with widgets)

  function clickAction(model, spec, id) {
    if (model.away) return model;
    const m = { ...model, clicked: model.clicked.concat([id]) };
    if (id === spec.target) {
      m.done = true;
      m.seen = true;
    } else {
      m.away = id;
      m.wrongs = model.wrongs + 1;
    }
    return m;
  }
  const goBack = (model) => ({ ...model, away: null });
  function toggleItem(model, spec, id) {
    const isOpen = model.open.includes(id);
    let open = isOpen ? model.open.filter((x) => x !== id) : spec.faq && spec.faq.exclusive ? [id] : model.open.concat([id]);
    open = open.slice();
    return { ...model, open };
  }

  function ended(model, spec) {
    return model.wrongs >= (spec.recoverable ? 2 : 1) ? 'wrong-link' : null;
  }

  function solve(spec, model) {
    const m = { ...clone(model), away: null };
    if (spec.scenario === 'copy') return { ...m, text: isIdle(spec) ? '' : spec.copy.value, seen: true };
    m.done = true;
    m.seen = true;
    if (isIdle(spec)) return m; // the page stays as it is: no stand-in goal is opened, loaded or scrolled to
    m.clicked = m.clicked.concat([spec.target]);
    if (spec.scenario === 'lazy') m.loaded = spec.pane.rows.length;
    if (spec.scenario === 'carousel') m.slide = spec.pane.rows.findIndex((r) => r.id === spec.row);
    if (spec.scenario === 'accordion' && !m.open.includes(spec.item)) m.open = spec.faq.exclusive ? [spec.item] : m.open.concat([spec.item]);
    return m;
  }

  // Pane path from the outermost pane to the one holding the target row: [{ pane, index, count }].
  function panePath(spec) {
    const p = spec.pane;
    if (!p) return [];
    if (p.groups) {
      const gi = p.groups.findIndex((g) => g.id === spec.group);
      const g = p.groups[gi];
      return [{ pane: p.id, index: gi, count: p.groups.length },
        { pane: g.pane.id, index: g.pane.rows.findIndex((r) => r.id === spec.row), count: g.pane.rows.length }];
    }
    return [{ pane: p.id, index: p.rows.findIndex((r) => r.id === spec.row), count: p.rows.length }];
  }

  function plan(model, spec) {
    if (model.away) return { click: { back: true } };
    const v = spec.scenario;
    if (v === 'copy') {
      const value = spec.copy.value;
      if (norm(model.text) === norm(value)) return null;
      if (spec.copy.dir === 'down' && !model.seen) return { move: { value: true } };
      return { type: [{ field: true }, value] };
    }
    if (model.done) return null;
    // Page-level navigation routes (the kit scrolls by wheel on its own for route 'wheel').
    if (v === 'top' && !model.atTop) {
      if (spec.route === 'nav') return { click: { totop: true } };
      if (spec.route === 'keys') return { key: 'Home' };
    }
    if (v !== 'top' && !model.seen) {
      const sec = v === 'accordion' ? 'faq' : spec.targetSection;
      if (spec.route === 'nav' && spec.toc && model.jumped !== sec) return { click: { toc: sec } };
      // Nested targets sit inside a pane (clipped rows look "below"); the pane box itself decides.
      const where = isPane(v) ? model.paneWhere : model.where;
      if (spec.route === 'keys' && where === 'below') return { key: 'PageDown' };
    }
    if (v === 'accordion' && !model.open.includes(spec.item)) return { click: { item: spec.item } };
    if (v === 'carousel') {
      const { pane, index } = panePath(spec)[0];
      const cur = model.slide || 0;
      const L = model.layout && model.layout[pane];
      if (cur !== index) {
        if (spec.paneRoute === 'wheel') return { wheel: [{ pane }, 0, (index - cur) * ((L && L.pitch) || 600)] };
        const dir = index > cur ? 'next' : 'prev';
        if (spec.slideRoute === 'swipe') return { drag: [{ swipeFrom: dir }, { swipeTo: dir }] };
        return { click: { arrow: dir } };
      }
    } else if (isPane(v)) {
      for (const { pane, index } of panePath(spec)) {
        const L = model.layout && model.layout[pane];
        if (!L) continue;
        // lazy: a row that has not loaded yet is reached by scrolling to the end (one past the last loaded row)
        const at = v === 'lazy' ? Math.min(index, model.loaded) : index;
        if (at < L.first || at > L.last) {
          const mid = (L.first + L.last) / 2;
          if (spec.paneRoute === 'thumb' && L.scrolls) return { drag: [{ thumb: pane }, { scrollTo: [pane, at] }] };
          const d = Math.round((at - mid) * (L.pitch || 40));
          return { wheel: v === 'hscroll' ? [{ pane }, 0, d] : [{ pane }, d] };
        }
      }
    }
    return { click: { action: spec.target } };
  }

  function tolerance(spec) {
    if (spec && isConfirm(spec) && spec.scenario !== 'copy') return { tau: 0.5, sigma: 0.5, minInitialError: 0.75 };
    return { tau: 0, sigma: 0.5 };
  }

  Object.assign(lib, {
    CLASSIC, CONTAINERS, JUDGE_MODES, SCENARIOS, isIdle, rowsOf, actionsOf, actionById, isTarget, countLabel, error, tolerance,
  });

  env.task({
    name: 'scroll-page',
    scenarios: SCENARIOS,
    startModes: ['off', 'partial', 'wrong', 'solved'],
    inputs: (spec) => (spec && spec.keys ? ['pointer', 'keyboard', 'wheel'] : ['pointer', 'wheel']),
    files: ['content.js', 'instruct.js', 'hooks.js', 'sample.js'],
    lib,
    helpers: { actionById, clickAction, goBack, toggleItem },
    sample: (rng, opts = {}) => lib.sample(rng, opts),
    init,
    error,
    tolerance,
    judgeModes: JUDGE_MODES,
    facts: (model, spec) => lib.facts(model, spec),
    parts: (model, spec) => lib.parts(model, spec),
    silent: (next, prev, spec, rng) => lib.silent(next, prev, spec, rng),
    retarget: (spec, model, rng) => lib.retarget(spec, model, rng),
    instruction: (spec, rng) => lib.instruction(spec, rng),
    plan,
    solve,
    ended,
  });
})();
