/*
 * change-settings: change toggles, selects and numbers on a settings screen, then save.
 * A preferences screen with sections (tabs, or one long scrolling page), a settings search
 * field, toggles (some with negated labels: "Disable notifications" must be ON to turn notifications off),
 * dependent controls (turning a toggle on reveals the settings under it), selects and number inputs, and a
 * Save button that is enabled only when something changed (dirty state). Saving stores the values and shows a
 * confirmation; changes left unsaved do not count. No MiniWoB counterpart (closest: click-checkboxes and
 * enter-text, which have no persistence, no negation and no dependencies).
 *
 * scenarios
 *   toggle     1-3 toggles (ood 3-5); most episodes include a negated toggle described by its effect
 *              ("stop showing unread badges" -> "Hide unread badges" ON).
 *   dependent  a parent toggle that is off hides a select or number input; the goal may name only the hidden
 *              child (the agent must find and enable the parent). ood: a chain parent -> toggle -> value.
 *   mixed      2-4 settings (ood 4-6) of different kinds across sections.
 *   search     a larger settings page; 1-2 settings (ood 2-3) outside the first section, most episodes'
 *              oracle uses the settings search box.
 *
 * spec   { scenario, startMode, isplit, csplit, ood, layout ('tabs'|'long': long pages scroll), scroll,
 *          title, sections: [{ id, title, ids: [setting ids in order, children right after their parent] }],
 *          settings: { id: { id, label, kind ('toggle'|'select'|'number'), negated, description, options?,
 *          min?, max?, step?, unit?, parent? (id: shown only while the parent is on), section } },
 *          base: { id: value } (saved values at the start), goals: [{ id, value }] (raw target values; a
 *          dependent child's parents come first), mention: [ids the instruction names], queries: { id: search
 *          text that finds it }, route ('nav'|'search'), numRoute ('type'|'stepper'), discardRoute (bool),
 *          saveStyle ('button'|'bar'), control ('switch'|'checkbox') }
 * model  { values: { id: value }, saved: { id: value } (last saved), tab (section id, tabs layout), query
 *          (search text), open (id of the open select | null), saves (number of saves), toast (the "saved"
 *          confirmation is showing) }
 * error  tau = 0: (goals not at their target + other settings changed from the start + [unsaved changes])
 *        / (number of goals + 1), capped at 1. Unsaved changes make the episode fail even when every value is
 *        right; saving wrong values keeps those goals wrong.
 *
 * start modes  off; partial (some goals already set and saved, or the only goal set but unsaved; dependent:
 *              the parent already on); wrong (unsaved wrong changes: other toggles flipped, a select or number
 *              goal set to a wrong value; Discard or fixing them one by one recovers); solved.
 * routes       spec.route 'search' types into the settings search, 'nav' clicks tabs (tabs layout) or lets
 *              the kit scroll the long page; numbers are typed or stepped with -/+ (spec.numRoute, only for
 *              small changes); wrong starts are undone with Discard (spec.discardRoute) or one by one.
 * ood          6-9 sections with 5-8 settings each, more goals, chains of dependencies.
 * levels       (the task is discrete) easy: 2-3 sections (search 3-4) with at most 3 rows (tabs) / 4 (long)
 *              each, one goal (mixed: two), no negated toggle among the goals, no extra toggle next to a
 *              dependent goal. medium: 3-4 sections (search 4-6), at most 4 / 5 rows, goals as normal but
 *              toggle 1-2 and mixed 2-3.
 *
 * judge modes (judgeModes; opts.judge; spec.judge = { mode, message, ... }; built last from its own fork, so nothing
 *              else in the spec changes and no rng is drawn while opts.judge is off). ambiguous / impossible start on the
 *              solved page (goals set and saved) and the instruction is a one-line change request:
 *   ambiguous   "turn off notifications": two toggles carry the word (cands: the label and the distinctive words of each;
 *               others: the page's other toggles, never offered). A page without such a pair gets two toggles with the
 *               very same label ("turn on "Sync photos""; twins, cands the label twice). The reply asks (status ask)
 *               with one option per toggle.
 *   impossible  a number beyond its range, an option the select does not offer (drawn from the whole settings bank), or
 *               a setting the page does not have (also from the bank); status impossible, what: the value / option / label
 *   confirm     the normal task plus "but check with me before you save"; the widget flags 'irreversible' when Save is
 *               pressed; in this mode unsaved changes do not count as an error (error ignores the dirty state), so the
 *               prepared page is within tau = 0 and a partial start never leaves the lone goal set
 *
 * optional hooks (contract the html/kit/env.js header; pure, no DOM; called only by their knobs):
 *   facts(model, spec)            up to 2 goal settings as the page shows them (toggle On / Off, select option, number
 *                                 with unit) plus "Settings changed: N" (settings now different from the start; label
 *                                 paraphrases in labels)
 *   parts(model, spec)            preempt=cancel: every setting by its label, value what the page holds now
 *   silent(next, prev, spec, rng) one correct goal comes back wrong though the page looks done: a toggle that did not
 *                                 stick, a select on its neighbour option, a number rounded to 10 or off by one step
 *                                 (the saved value follows when it was saved)
 *   retarget(spec, model, rng)    a different goal on the same page: a select / number goal gets another value, else a
 *                                 toggle goal moves to another top-level toggle; null for dependent chains
 *
 * plan targets (the widget's locate() maps them to viewport px)
 *   { control: id }        the switch / checkbox, the select button, or the number field
 *   { option: [id, value] } an option in the open select's list
 *   { step: [id, +1|-1] }  the number stepper buttons
 *   { tab: sectionId }     a section tab (tabs layout)
 *   { search: true }       the settings search field
 *   { save: true }  { discard: true }   the Save and Discard buttons
 * plan steps: { click }, { type: [{ search }, text] }, { type: [{ control }, number] }.
 *
 * Self-test: selftest.js (loaded only by the checker and node tests).
 * Helpers (widget API, env.taskDef.helpers):
 *   visibleIds(model, spec)          setting ids currently shown, in display order
 *   isShown(model, spec, id)         whether all ancestor toggles are on
 *   matches(spec, id, query)         whether the label or description matches a search
 *   setValue(model, spec, id, value) update a setting and close its popup
 *   save(model)                     persist the current values and show confirmation
 *   discard(model)                  restore the last saved values
 *   setQuery(model, query)          update search text and close any popup
 *   setTab(model, id)               change section and close any popup
 *   openSelect(model, id)           toggle a select popup
 *   isDirty(model, spec)            whether current values differ from saved values
 *   stepOf(setting)                number step size
 *   RESULT_CAP                     maximum search results in the tabs layout
 */
(function () {
  'use strict';

  const { clone, quote: q } = env.util;
  const C = env.content;
  const I = env.instruct;
  const RESULT_CAP = 4; // search results shown at once in the tabs layout

  // Dependent settings: [parent id, child (bank id or local definition)].
  const DEPS = [
    ['quiet_hours', 'quiet_start'],
    ['email_notifications', 'digest_frequency'],
    ['autosave', 'autosave_interval'],
    ['offline_mode', 'cache_size'],
    ['spellcheck', 'spellcheck_language'],
    ['sync_enabled', 'backup_frequency'],
    ['two_factor', { id: 'tfa_method', label: 'Verification method', kind: 'select', description: 'How you confirm it is you.',
      options: ['Authenticator app', 'Text message', 'Security key', 'Email code'] }],
    ['price_alerts', { id: 'price_drop', label: 'Alert when the price drops by', kind: 'number', min: 5, max: 50, unit: '%',
      description: 'Only notify me about bigger discounts.' }],
    ['allow_guests', { id: 'guest_expiry', label: 'Guest access expires after', kind: 'select', description: 'Guests lose access automatically.',
      options: ['7 days', '30 days', '90 days', 'Never'] }],
    ['auto_renew', { id: 'renew_reminder', label: 'Remind me before renewal', kind: 'select', description: 'An email before you are charged.',
      options: ['1 day', '3 days', '7 days', '14 days'] }],
    ['working_hours', { id: 'work_start', label: 'Workday starts at', kind: 'select', description: 'Shown on your profile card.',
      options: ['7:00', '8:00', '9:00', '10:00'] }],
    ['location_sharing', { id: 'location_precision', label: 'Location precision', kind: 'select', description: 'How exact the shared location is.',
      options: ['Exact', 'City', 'Region', 'Country'] }],
    ['captions', { id: 'caption_size', label: 'Caption size', kind: 'select', description: 'Size of subtitles on videos.',
      options: ['Small', 'Medium', 'Large', 'Extra large'] }],
    ['auto_translate', { id: 'translate_to', label: 'Translate posts into', kind: 'select', description: 'Target language for translations.',
      options: ['English', 'German', 'French', 'Spanish', 'Japanese'] }],
    ['screen_reader', { id: 'sr_verbosity', label: 'Screen reader verbosity', kind: 'select', description: 'How much extra detail is announced.',
      options: ['Low', 'Medium', 'High'] }],
    ['login_alerts', { id: 'alert_channel', label: 'Send sign-in alerts by', kind: 'select', description: 'Where new sign-in alerts go.',
      options: ['Email', 'Text message', 'Push notification'] }],
    ['allow_api_tokens', { id: 'token_days', label: 'Token lifetime', kind: 'number', min: 1, max: 365, unit: 'days',
      description: 'Tokens expire after this many days.' }],
  ];
  // Chains for ood dependent episodes: parent -> toggle -> value.
  const CHAINS = [
    ['two_factor', { id: 'tfa_trust', label: 'Trust this browser', kind: 'toggle', description: 'Skip codes on this browser for a while.' },
      { id: 'tfa_trust_days', label: 'Trust it for', kind: 'number', min: 1, max: 90, unit: 'days', description: 'Ask again after this many days.' }],
    ['sync_enabled', { id: 'sync_photos', label: 'Sync photos', kind: 'toggle', description: 'Upload photos to your other devices.' },
      { id: 'sync_photo_quality', label: 'Synced photo quality', kind: 'select', description: 'Lower quality saves space.',
        options: ['Original', 'High', 'Storage saver'] }],
    ['allow_guests', { id: 'guest_upload', label: 'Let guests upload files', kind: 'toggle', description: 'Guests can share files in channels.' },
      { id: 'guest_upload_mb', label: 'Guest upload limit', kind: 'number', min: 10, max: 500, unit: 'MB', description: 'Largest file a guest may upload.' }],
    ['autosave', { id: 'autosave_cloud', label: 'Also save to the cloud', kind: 'toggle', description: 'Keep a copy of drafts online.' },
      { id: 'autosave_copies', label: 'Cloud copies to keep', kind: 'number', min: 1, max: 20, description: 'Older copies are deleted.' }],
  ];

  // ---------------------------------------------------------------- helpers

  function stepOf(s) {
    if (s.step) return s.step;
    const r = s.max - s.min;
    return r <= 20 ? 1 : r <= 120 ? 5 : r <= 600 ? 10 : r <= 6000 ? 50 : 100;
  }
  const fmtNumber = (s, v) => (s.unit ? (s.unit === '%' ? `${v}%` : `${v} ${s.unit}`) : String(v));
  const same = (a, b) => a === b || (typeof b === 'number' && a !== '' && a !== null && Number(a) === b);
  const NEG_RE = /^(disable|turn off|stop|mute|pause|block|hide|opt out of|unsubscribe from)\s+(.+)$/i;
  const subjectWords = (label) => {
    const m = NEG_RE.exec(label);
    const s = (m ? m[2] : label).toLowerCase();
    return s.split(/[^a-z0-9@]+/).filter((w) => w.length >= 5);
  };

  function sampleValue(rng, s, avoid) {
    if (s.kind === 'toggle') return avoid === undefined ? rng.bool(0.5) : !avoid;
    if (s.kind === 'select') {
      const opts = s.options.filter((o) => o !== avoid);
      return rng.pick(opts.length ? opts : s.options);
    }
    const st = stepOf(s);
    const n = Math.floor((s.max - s.min) / st);
    for (let t = 0; t < 20; t++) {
      const v = s.min + st * rng.int(0, n);
      if (v !== avoid) return v;
    }
    return avoid === s.min ? s.min + st : s.min;
  }

  function isShown(model, spec, id) {
    for (let p = spec.settings[id].parent; p; p = spec.settings[p].parent) if (model.values[p] !== true) return false;
    return true;
  }
  function matches(spec, id, q) {
    const s = spec.settings[id];
    const t = String(q || '').trim().toLowerCase();
    if (!t) return true;
    return s.label.toLowerCase().includes(t) || (s.description || '').toLowerCase().includes(t);
  }
  // Settings rows the screen shows for this model, in order.
  function visibleIds(model, spec) {
    const q = String(model.query || '').trim();
    const all = spec.sections.flatMap((sec) => sec.ids);
    if (q) {
      const hits = all.filter((id) => matches(spec, id, q) && isShown(model, spec, id));
      return spec.layout === 'tabs' ? hits.slice(0, RESULT_CAP) : hits;
    }
    if (spec.layout === 'tabs') {
      const sec = spec.sections.find((s) => s.id === model.tab) || spec.sections[0];
      return sec.ids.filter((id) => isShown(model, spec, id));
    }
    return all.filter((id) => isShown(model, spec, id));
  }
  const isDirty = (model, spec) => Object.keys(spec.settings).some((id) => !same(model.values[id], model.saved[id]));

  // ---------------------------------------------------------------- transitions (shared with widgets)

  const setValue = (model, spec, id, v) => ({ ...model, values: { ...model.values, [id]: v }, open: null, toast: false });
  const save = (model) => ({ ...model, saved: { ...model.values }, saves: model.saves + 1, toast: true, open: null });
  const discard = (model) => ({ ...model, values: { ...model.saved }, open: null, toast: false });
  const setQuery = (model, q) => ({ ...model, query: q, open: null });
  const setTab = (model, id) => ({ ...model, tab: id, open: null });
  const openSelect = (model, id) => ({ ...model, open: model.open === id ? null : id });

  // ---------------------------------------------------------------- sampling

  const SCENARIOS = ['toggle', 'dependent', 'mixed', 'search'];

  // The search text that finds a goal setting: the label word (or pair) with the fewest matches.
  function queryFor(spec, gid) {
    const ids = Object.keys(spec.settings);
    const s = spec.settings[gid];
    const words = s.label.replace(/[^\p{L}\p{N}@\s-]/gu, ' ').split(/\s+/).filter((w) => w.length >= 3);
    const cands = words.map((w) => w.toLowerCase());
    for (let i = 0; i + 1 < words.length; i++) cands.push(`${words[i]} ${words[i + 1]}`.toLowerCase());
    cands.push(s.label.toLowerCase());
    let best = null;
    let bestN = 1e9;
    for (const q of cands) {
      const n = ids.filter((id) => matches(spec, id, q)).length;
      if (matches(spec, gid, q) && (n < bestN || (n === bestN && q.length < best.length))) {
        best = q;
        bestN = n;
      }
    }
    return bestN <= RESULT_CAP ? best : s.label.toLowerCase();
  }

  function sample(rng, opts = {}) {
    const allowed = (opts.scenarios && opts.scenarios.length ? opts.scenarios : SCENARIOS).filter((v) => SCENARIOS.includes(v));
    const scenario = opts.scenario && allowed.includes(opts.scenario) ? opts.scenario : rng.pick(allowed);
    const ood = !!opts.ood;
    const lvl = opts.level === 'easy' || opts.level === 'medium' ? opts.level : 'normal';
    const easy = lvl === 'easy';
    const csplit = opts.csplit || 'train';
    const spec = { scenario, startMode: opts.startMode, isplit: opts.isplit || 'train', csplit, ood };

    spec.layout = ood ? 'long' : rng.bool(scenario === 'search' ? 0.55 : 0.5) ? 'tabs' : 'long';
    spec.scroll = spec.layout === 'long';
    const maxRows = spec.layout === 'tabs' ? (easy ? 3 : 4) : ood ? 8 : easy ? 4 : lvl === 'medium' ? 5 : 6;
    const nSec = ood ? rng.int(6, 9) : scenario === 'search'
      ? (easy ? rng.int(3, 4) : lvl === 'medium' ? rng.int(4, 6) : rng.int(5, 7))
      : easy ? rng.int(2, 3) : lvl === 'medium' ? rng.int(3, 4) : rng.int(3, 5);

    const { depParent, depChild } = sampleSettings(rng, spec, { csplit, scenario, ood, nSec, maxRows });
    sampleGoals(rng, spec, { scenario, ood, easy, lvl, depParent, depChild });

    spec.route = rng.bool(scenario === 'search' ? 0.8 : 0.25) ? 'search' : 'nav';
    spec.numRoute = rng.bool(0.5) ? 'stepper' : 'type';
    spec.discardRoute = rng.bool(0.5);
    spec.saveStyle = spec.layout === 'long' && rng.bool(0.5) ? 'bar' : 'button';
    spec.control = rng.bool(0.7) ? 'switch' : 'checkbox';
    // Judge episodes: built from its own fork after every other draw (nothing is drawn while the knob is off).
    if (JUDGE_MODES.includes(opts.judge)) {
      const j = judgeOf(rng.fork('judge'), spec, opts.judge);
      if (j) spec.judge = j;
    }
    return spec;
  }

  // Build the sections, dependency tree and saved starting values.
  function sampleSettings(rng, spec, { csplit, scenario, ood, nSec, maxRows }) {
    const split = (list) => C.split(list, csplit);
    const all = C.SETTINGS;
    const byGroup = {};
    for (const s of all) (byGroup[s.group] ||= []).push(s);
    const depChild = new Map(); // parent id -> [child defs]
    const childIds = new Set();
    const chain = scenario === 'dependent' && ood ? rng.pick(CHAINS) : null;
    for (const [p, ch] of DEPS) {
      const def = typeof ch === 'string' ? all.find((s) => s.id === ch) : ch;
      if (!def) continue;
      childIds.add(def.id);
      if (chain && chain[0] === p) continue;
      depChild.set(p, [def]);
    }
    if (chain) {
      depChild.set(chain[0], [chain[1]]);
      depChild.set(chain[1].id, [chain[2]]);
      childIds.add(chain[1].id);
      childIds.add(chain[2].id);
    }
    const settings = {};
    const sections = [];
    const groups = rng.shuffle(Object.keys(byGroup)).filter((g) => split(byGroup[g]).length >= 3);

    // The dependent scenario needs a parent that exists in the bank.
    let depParent = null;
    if (scenario === 'dependent') {
      const cands = [...depChild.keys()].filter((p) => all.some((s) => s.id === p && s.kind === 'toggle' && !s.negated));
      const want = chain ? chain[0] : rng.pick(cands);
      depParent = all.find((s) => s.id === want);
      const g = depParent.group;
      groups.splice(groups.indexOf(g), 1);
      groups.splice(Math.min(rng.int(0, Math.min(2, groups.length)), nSec - 1), 0, g); // inside the first nSec: otherwise the parent is never placed
    }

    const addSetting = (def, section, parent) => {
      const s = { ...def, section, negated: !!def.negated };
      delete s.group;
      if (parent) s.parent = parent;
      if (s.kind === 'number') s.step = stepOf(s);
      settings[s.id] = s;
      return s;
    };
    for (const g of groups.slice(0, nSec)) {
      const sid = `sec-${C.slug(g)}`;
      const sec = { id: sid, title: g, ids: [] };
      const pool = rng.shuffle(split(byGroup[g]).filter((s) => !childIds.has(s.id) && !settings[s.id]));
      if (depParent && depParent.group === g && !pool.includes(depParent)) pool.unshift(depParent);
      else if (depParent && depParent.group === g) {
        pool.splice(pool.indexOf(depParent), 1);
        pool.unshift(depParent);
      }
      const words = new Map(); // subject word -> toggle id (no contradictory pairs on one page)
      const room = rng.int(3, maxRows);
      let rows = 0;
      for (const s of pool) {
        if (rows >= room) break;
        const kids = [];
        for (let p = s.id; depChild.has(p) && kids.length < 2;) {
          const k = depChild.get(p)[0];
          kids.push(k);
          p = k.id;
        }
        if (s.kind === 'toggle') {
          const ws = subjectWords(s.label);
          if (ws.some((w) => words.has(w) && words.get(w) !== s.negated)) continue;
          ws.forEach((w) => words.set(w, s.negated));
        }
        if (rows + 1 + kids.length > maxRows) continue;
        sec.ids.push(addSetting(s, sid).id);
        let parent = s.id;
        for (const k of kids) {
          sec.ids.push(addSetting(k, sid, parent).id);
          parent = k.id;
        }
        rows += 1 + kids.length;
      }
      if (sec.ids.length) sections.push(sec);
    }
    spec.sections = sections;
    spec.settings = settings;
    const titles = [
      'Settings', 'Preferences', 'Account settings', 'Your preferences', 'Workspace settings', 'App settings',
      'General options', 'My account'
    ];
    spec.title = rng.pick(titles);

    // Base (saved) values.
    const base = {};
    for (const id of Object.keys(settings)) base[id] = sampleValue(rng, settings[id]);
    spec.base = base;
    return { depParent, depChild };
  }

  // Choose and order goals, then derive instruction mentions and search queries.
  function sampleGoals(rng, spec, { scenario, ood, easy, lvl, depParent, depChild }) {
    const { settings, sections, base } = spec;
    // Goals.
    const ids = Object.keys(settings);
    const top = ids.filter((id) => !settings[id].parent);
    const toggles = top.filter((id) => settings[id].kind === 'toggle');
    const goals = [];
    const want = (id) => goals.push({ id, value: sampleValue(rng, settings[id], base[id]) });
    if (scenario === 'toggle') {
      const n = Math.min(toggles.length, ood ? rng.int(3, 5) : easy ? 1 : lvl === 'medium' ? rng.int(1, 2) : rng.int(1, 3));
      const neg = toggles.filter((id) => settings[id].negated);
      const plain = toggles.filter((id) => !settings[id].negated);
      const pick = [];
      if (!easy && neg.length && rng.bool(0.75)) pick.push(rng.pick(neg));
      for (const id of rng.shuffle(easy && plain.length ? plain : toggles)) if (pick.length < n && !pick.includes(id)) pick.push(id);
      pick.forEach(want);
    } else if (scenario === 'dependent') {
      const chainIds = [depParent.id];
      while (depChild.has(chainIds[chainIds.length - 1]) && settings[depChild.get(chainIds[chainIds.length - 1])[0].id]) {
        chainIds.push(depChild.get(chainIds[chainIds.length - 1])[0].id);
      }
      // Every toggle on the chain must be off at the start and on in the goal; the leaf gets a new value.
      for (const id of chainIds.slice(0, -1)) {
        base[id] = false;
        goals.push({ id, value: true });
      }
      want(chainIds[chainIds.length - 1]);
      if (rng.bool(0.3) && !easy) {
        const extra = rng.pick(toggles.filter((id) => !chainIds.includes(id)));
        if (extra) want(extra);
      }
      spec.chain = chainIds;
    } else if (scenario === 'mixed') {
      const n = ood ? rng.int(4, 6) : easy ? 2 : lvl === 'medium' ? rng.int(2, 3) : rng.int(2, 4);
      const kinds = rng.shuffle(['toggle', 'select', 'number']);
      const pool = rng.shuffle(top);
      const pick = [];
      for (const k of kinds) {
        const id = pool.find((x) => settings[x].kind === k && !pick.includes(x));
        if (id && pick.length < n) pick.push(id);
      }
      // Spread over sections where possible.
      const secs = new Set(pick.map((id) => settings[id].section));
      for (const id of pool) {
        if (pick.length >= n) break;
        if (!pick.includes(id) && (!secs.has(settings[id].section) || rng.bool(0.4))) {
          pick.push(id);
          secs.add(settings[id].section);
        }
      }
      pick.forEach(want);
    } else {
      const n = ood ? rng.int(2, 3) : rng.int(1, 2);
      const later = top.filter((id) => settings[id].section !== sections[0].id);
      rng.shuffle(later).slice(0, n).forEach(want);
    }
    // Parents first, then section order.
    const order = Object.fromEntries(spec.sections.flatMap((s) => s.ids).map((id, i) => [id, i]));
    goals.sort((a, b) => order[a.id] - order[b.id]);
    spec.goals = goals;
    // What the instruction names: dependent goals may name only the leaf.
    spec.mention = goals.map((g) => g.id);
    if (scenario === 'dependent' && rng.bool(0.5)) spec.mention = goals.filter((g) => !spec.chain.slice(0, -1).includes(g.id)).map((g) => g.id);
    spec.hintParent = scenario === 'dependent' && rng.bool(0.5);

    // Search queries: the label word (or pair) with the fewest matches.
    spec.queries = {};
    for (const g of goals) spec.queries[g.id] = queryFor(spec, g.id);
  }

  function init(spec, rng) {
    const m = { values: { ...spec.base }, saved: { ...spec.base }, tab: spec.sections[0].id, query: '', open: null,
      saves: 0, toast: false };
    const G = spec.goals;
    if (spec.startMode === 'partial') {
      if (spec.scenario === 'dependent' && spec.chain.length > 1) {
        m.values[spec.chain[0]] = true;
        m.saved = { ...m.values };
      } else if (G.length >= 2) {
        const k = rng.int(1, G.length - 1);
        for (const g of rng.sample(G, k)) m.values[g.id] = g.value;
        m.saved = { ...m.values };
      } else if (!(spec.judge && spec.judge.mode === 'confirm')) {
        m.values[G[0].id] = G[0].value; // set but not saved (confirm judge episodes ignore unsaved work: that would start done)
      }
    } else if (spec.startMode === 'wrong') {
      const goalIds = new Set(G.map((g) => g.id));
      const others = Object.values(spec.settings).filter((s) => s.kind === 'toggle' && !s.parent && !goalIds.has(s.id)
        && !Object.values(spec.settings).some((c) => c.parent === s.id));
      for (const s of rng.sample(others, rng.int(1, Math.min(2, others.length)))) m.values[s.id] = !m.values[s.id];
      const vg = G.filter((g) => spec.settings[g.id].kind !== 'toggle' && isShown(m, spec, g.id));
      if (vg.length && (rng.bool(0.5) || !others.length)) {
        const g = rng.pick(vg);
        const s = spec.settings[g.id];
        let v = sampleValue(rng, s, g.value);
        if (same(v, spec.base[g.id])) v = sampleValue(rng, s, spec.base[g.id]);
        if (!same(v, g.value)) m.values[g.id] = v;
      }
      if (!isDirty(m, spec)) {
        // Fallback: a goal toggle flipped the wrong way is impossible (it already is); flip any top toggle.
        const t = Object.values(spec.settings).find((s) => s.kind === 'toggle' && !s.parent && !goalIds.has(s.id));
        if (t) m.values[t.id] = !m.values[t.id];
      }
    }
    // ambiguous / impossible: the page starts as it should stay (goals set and saved).
    if (spec.judge && spec.judge.mode !== 'confirm') return solve(spec, m);
    return m;
  }

  function error(model, spec) {
    const goalIds = new Set(spec.goals.map((g) => g.id));
    let bad = 0;
    for (const g of spec.goals) if (!same(model.values[g.id], g.value)) bad++;
    for (const id of Object.keys(spec.settings)) if (!goalIds.has(id) && !same(model.values[id], spec.base[id])) bad++;
    // confirm judge episodes: saving is the step to ask about, so a prepared but unsaved page is already within tau
    if (isDirty(model, spec) && !(spec.judge && spec.judge.mode === 'confirm')) bad++;
    return Math.min(1, bad / (spec.goals.length + 1));
  }

  function solve(spec, model) {
    const values = { ...spec.base };
    for (const g of spec.goals) values[g.id] = g.value;
    return { ...clone(model), values, saved: { ...values }, open: null, toast: true, saves: (model.saves || 0) + 1 };
  }

  // ---------------------------------------------------------------- oracle

  function plan(model, spec) {
    const goalIds = new Set(spec.goals.map((g) => g.id));
    const fixes = [];
    for (const id of Object.keys(spec.settings)) if (!goalIds.has(id) && !same(model.values[id], spec.base[id])) fixes.push({ id, value: spec.base[id] });
    for (const g of spec.goals) if (!same(model.values[g.id], g.value)) fixes.push(g);
    const order = Object.fromEntries(spec.sections.flatMap((s) => s.ids).map((id, i) => [id, i]));

    // Undo a wrong start with Discard when that loses no correct unsaved work.
    if (spec.discardRoute && fixes.some((f) => !goalIds.has(f.id))) {
      const lose = Object.keys(spec.settings).some((id) => !same(model.values[id], model.saved[id])
        && goalIds.has(id) && same(model.values[id], spec.goals.find((g) => g.id === id).value));
      const helps = Object.keys(spec.settings).some((id) => !goalIds.has(id) && !same(model.values[id], spec.base[id])
        && same(model.saved[id], spec.base[id]));
      if (!lose && helps) return { click: { discard: true } };
    }

    fixes.sort((a, b) => order[a.id] - order[b.id]);
    const next = fixes[0];
    if (!next) {
      if (model.open) return { click: { control: model.open } };
      if (isDirty(model, spec)) return { click: { save: true } };
      return null;
    }
    // A parent that hides the setting comes first.
    let id = next.id;
    let value = next.value;
    for (let p = spec.settings[id].parent; p; p = spec.settings[p].parent) {
      if (model.values[p] !== true) {
        id = p;
        value = true;
      }
    }
    const s = spec.settings[id];
    if (model.open && model.open !== id) return { click: { control: model.open } };
    // Navigate so the row is on screen.
    const shown = visibleIds(model, spec).includes(id);
    if (spec.route === 'search') {
      const q = spec.queries[id] || s.label.toLowerCase();
      if (!shown || (model.query && !matches(spec, id, model.query))) return { type: [{ search: true }, q] };
    } else {
      if (model.query && (!shown || spec.layout === 'tabs')) return { type: [{ search: true }, ''] };
      if (spec.layout === 'tabs' && model.tab !== s.section) return { click: { tab: s.section } };
    }
    if (!visibleIds(model, spec).includes(id)) {
      // Shown only through search (e.g. a query is active in the tabs layout): search for it.
      return { type: [{ search: true }, spec.queries[id] || s.label.toLowerCase()] };
    }
    if (s.kind === 'toggle') return { click: { control: id } };
    if (s.kind === 'select') return model.open === id ? { click: { option: [id, value] } } : { click: { control: id } };
    const cur = Number(model.values[id]);
    const st = stepOf(s);
    if (spec.numRoute === 'stepper' && model.values[id] !== '' && Number.isFinite(cur) && Math.abs(value - cur) <= 4 * st
      && Math.abs(value - cur) % st === 0) {
      return { click: { step: [id, value > cur ? 1 : -1] } };
    }
    return { type: [{ control: id }, String(value)] };
  }

  // ---------------------------------------------------------------- instructions

  const isAre = (s) => (/[^s]s$/.test(s) && !/\b(this|status|access)$/i.test(s) ? 'are' : 'is');
  const LIT = {
    on: [
      'turn on {q}', 'switch {q} on', 'enable {q}', 'make sure {q} is on', 'tick {q}', 'activate {q}', 'set {q} on',
      'keep {q} on', 'get {q} enabled', 'let {q} be on'
    ],
    off: [
      'turn off {q}', 'switch {q} off', 'disable {q}', 'make sure {q} is off', 'untick {q}', 'deactivate {q}',
      'set {q} to off', 'leave {q} off'
    ],
  };
  const SEM = {
    off: {
      on: [
        'turn off {s}', 'switch off {s}', 'make sure {s} {is} off', 'stop {s}', 'get rid of {s}',
        'I no longer want {s}, so turn {it} off', 'leave {s} turned off'
      ],
      off: [
        'turn {s} back on', 'make sure {s} {is} on', 'enable {s}', 'keep {s} switched on', 'allow {s}',
        'switch {s} on again', 'bring back {s}', 'set {s} to enabled', 'leave {s} turned on', 'let {s} resume'
      ],
    },
    hide: {
      on: [
        'hide {s}', "don't show {s}", 'make sure {s} {is} hidden', 'stop showing {s}', 'keep {s} out of sight',
        'turn off showing {s}', 'block display of {s}', 'keep {s} hidden'
      ],
      off: [
        'show {s}', 'make {s} visible', 'stop hiding {s}', 'unhide {s}', 'let people see {s}', 'display {s}',
        'let {s} show', 'have {s} shown'
      ],
    },
    optout: {
      on: [
        'opt out of {s}', 'turn off {s}', 'stop {s}', 'say no to {s}', 'make sure {s} {is} off', 'disable {s}',
        'keep {s} off'
      ],
      off: [
        'opt back in to {s}', 'turn {s} back on', 'allow {s}', 'keep {s} on', 'make sure {s} {is} on', 'enable {s}',
        'leave {s} enabled', 'set {s} to on', 'let {s} be on', 'agree to {s}'
      ],
    },
    unsub: {
      on: [
        'unsubscribe from {s}', 'stop getting {s}', 'turn off {s}', 'opt out of {s}',
        'no more {s}, please turn them off', 'make sure I get no {s}', 'do not send me {s}', 'cancel delivery of {s}'
      ],
      off: [
        'stay subscribed to {s}', 'keep getting {s}', 'turn {s} back on', 'resubscribe to {s}',
        'make sure I still get {s}', 'keep {s} coming', 'send me {s} again', 'sign me up for {s}'
      ],
    },
  };
  const SELECT = [
    'set {q} to {v}', 'change {q} to {v}', 'choose {v} for {q}', 'pick {v} under {q}', 'switch {q} to {v}',
    'use {v} for {q}', 'let {q} be {v}'
  ];
  const NUMBER = [
    'set {q} to {v}', 'change {q} to {v}', 'enter {v} for {q}', 'make {q} {v}', 'put {q} at {v}', 'update {q} to {v}',
    'let {q} read {v}', 'type {v} in {q}'
  ];
  const FRAMES = [
    '{goals}, then save your changes.',
    '{Goals} and save.',
    'Update the settings: {goals}. Save when you are done.',
    'Go into the settings, {goals}, and make sure the change is saved.',
    '{Goals}. Remember to save.',
    'Change these preferences and save them: {goals}.',
    'Open the preferences, {goals}, and save.',
    '{Goals}; the change has to be saved to count.',
    '{Goals}. Finish by saving.',
    '{Goals}. Save after making these changes.',
    'First {goals}. Save the settings afterwards.',
    'Make these adjustments: {goals}. Save next.',
    '{Goals}, then save when finished.',
    'For these preferences, {goals}. Save at the end.',
    'Please carry out and save these changes: {goals}.',
    '{Goals}. Do not leave the changes unsaved.',
  ];
  const FRAMES_SECTION = [
    'Go to {section}, {goals}, then save.',
    'Go to the {section} settings and {goals}. Save afterwards.',
    'Open {section} and {goals}. Then save.',
    'Head to {section}, {goals} and save the change.',
    'Open the {section} section, {goals}, then save your changes.',
    'Find the {section} section, {goals} and save.',
    'With {section} open, {goals}. Save when done.',
  ];
  // Parenthetical hints attached to the clause of a hidden child setting.
  const HINT = [' (it shows up once {parent} is on)', ' (under {parent})', ' (you may need to turn on {parent} first)',
    ' (hidden until {parent} is enabled)', ' (found under {parent}, which has to be on)', ' (part of {parent})'];

  function clause(rng, spec, g, pick, alias) {
    const s = spec.settings[g.id];
    const label = alias(s.label);
    if (s.kind === 'select') return env.instruct ? env.instruct.fill(pick(SELECT), { q: q(label), v: q(g.value) }) : `set ${q(label)} to ${q(g.value)}`;
    if (s.kind === 'number') return (pick(NUMBER)).replace('{q}', q(label)).replace('{v}', fmtNumber(s, g.value));
    // toggles
    const m = s.negated ? NEG_RE.exec(s.label) : null;
    if (m && rng.bool(0.75)) {
      const verb = m[1].toLowerCase();
      const kind = verb === 'hide' ? 'hide' : verb === 'opt out of' ? 'optout' : verb === 'unsubscribe from' ? 'unsub' : 'off';
      const subj = (m[2].charAt(0).toLowerCase() + m[2].slice(1)).replace(/\s+by default$/i, '');
      const t = pick(SEM[kind][g.value ? 'on' : 'off']);
      return t.replace(/\{s\}/g, subj).replace('{is}', isAre(subj)).replace('{it}', isAre(subj) === 'are' ? 'them' : 'it');
    }
    const lit = LIT[g.value ? 'on' : 'off'].filter((t) => spec.control === 'checkbox' || !/tick/.test(t));
    return pick(lit).replace('{q}', q(label));
  }

  function joinList(xs) {
    if (xs.length <= 1) return xs.join('');
    return `${xs.slice(0, -1).join(', ')} and ${xs[xs.length - 1]}`;
  }

  function instruction(spec, rng) {
    if (spec.judge) return spec.judge.mode === 'confirm' ? confirmInstruction(spec, rng) : judgeInstruction(spec, rng);
    const In = I;
    const sp = spec.isplit;
    const pick = (ts) => (In ? In.pick(rng, ts, sp) : rng.pick(ts));
    const alias = (label) => (In ? In.alias(rng, label, [], 0.3) : label);
    const goals = spec.goals.filter((g) => spec.mention.includes(g.id));
    const hint = spec.scenario === 'dependent' && spec.hintParent && spec.mention.length < spec.goals.length
      ? pick(HINT).replace('{parent}', q(spec.settings[spec.chain[0]].label)) : '';
    const leaf = spec.chain && spec.chain[spec.chain.length - 1];
    const clauses = goals.map((g) => clause(rng, spec, g, pick, alias) + (g.id === leaf ? hint : ''));
    const secs = new Set(goals.map((g) => spec.settings[g.id].section));
    const list = joinList(clauses);
    let core;
    if (secs.size === 1 && rng.bool(0.35)) {
      const sec = spec.sections.find((s) => s.id === [...secs][0]);
      core = pick(FRAMES_SECTION).replace('{section}', q(sec.title)).replace('{goals}', list);
    } else {
      core = pick(FRAMES).replace('{goals}', list).replace('{Goals}', list.charAt(0).toUpperCase() + list.slice(1));
    }
    core = core.charAt(0).toUpperCase() + core.slice(1);
    const terse = spec.goals.filter((g) => spec.mention.includes(g.id)).map((g) => {
      const s = spec.settings[g.id];
      return `${s.label}: ${s.kind === 'toggle' ? (g.value ? 'on' : 'off') : s.kind === 'number' ? fmtNumber(s, g.value) : g.value}`;
    }).join('; ') + '; save';
    return In ? In.say(rng, core, { isplit: sp, terse, steps: clauses.concat(['save the changes']) }) : core;
  }

  // confirm judge episodes: the changes without the save, and the hold-back ("check with me before you save").
  function confirmInstruction(spec, rng) {
    const In = I;
    const sp = spec.isplit;
    const pick = (ts) => (In ? In.pick(rng, ts, sp) : rng.pick(ts));
    const alias = (label) => (In ? In.alias(rng, label, [], 0.3) : label);
    const goals = spec.goals.filter((g) => spec.mention.includes(g.id));
    const leaf = spec.chain && spec.chain[spec.chain.length - 1];
    const hint = spec.scenario === 'dependent' && spec.hintParent && spec.mention.length < spec.goals.length
      ? pick(HINT).replace('{parent}', q(spec.settings[spec.chain[0]].label)) : '';
    const clauses = goals.map((g) => clause(rng, spec, g, pick, alias) + (g.id === leaf ? hint : ''));
    const list = joinList(clauses);
    const core = `${list.charAt(0).toUpperCase() + list.slice(1)}, but check with me before you save.`;
    const terse = `${goals.map((g) => {
      const s = spec.settings[g.id];
      return `${s.label}: ${s.kind === 'toggle' ? (g.value ? 'on' : 'off') : s.kind === 'number' ? fmtNumber(s, g.value) : g.value}`;
    }).join('; ')}; ask me before saving`;
    return In ? In.say(rng, core, { isplit: sp, terse, steps: clauses.concat(['check with me before you save']) }) : core;
  }

  // ---------------------------------------------------------------- judge modes

  const JUDGE_MODES = ['ambiguous', 'impossible', 'confirm'];
  // Settings and options the page does not have (impossible mode): drawn from the whole settings bank, minus what is here.
  const absentToggles = (all) => {
    const taken = new Set(all.map((s) => s.label.toLowerCase()));
    const words = new Set(all.filter((s) => s.kind === 'toggle').flatMap((s) => subjectWords(s.label)));
    return C.SETTINGS.filter((s) => s.kind === 'toggle' && !taken.has(s.label.toLowerCase()) && !subjectWords(s.label).some((w) => words.has(w)))
      .map((s) => s.label);
  };
  const absentOptions = (s) => [...new Set(C.SETTINGS.filter((x) => x.kind === 'select').flatMap((x) => x.options))]
    .filter((o) => !s.options.some((p) => p.toLowerCase() === o.toLowerCase()));
  const ASK_ON = [
    'Turn on {w} and save.', 'Switch on {w}, then save.', 'Enable {w} and save the changes.',
    'Set {w} to on and save it.', 'Save once {w} is on.'
  ];
  const ASK_OFF = [
    'Turn off {w} and save.', 'Switch off {w}, then save.', 'Disable {w} and save the changes.',
    'Set {w} to off and save it.', 'Save once {w} is off.'
  ];

  const labelWords = (label) => String(label).toLowerCase().replace(/[^a-z0-9@\s-]/g, ' ').split(/\s+/).filter((w) => w.length >= 3);

  function judgeOf(jr, spec, mode) {
    const all = Object.values(spec.settings);
    if (mode === 'confirm') {
      return { mode, message: 'The settings are changed but not saved yet. Should I go ahead and save them, or do you want to check them first?' };
    }
    if (mode === 'impossible') {
      const kinds = ['toggle'];
      if (all.some((s) => s.kind === 'number')) kinds.push('number', 'number');
      if (all.some((s) => s.kind === 'select')) kinds.push('select', 'select');
      const kind = jr.pick(kinds);
      if (kind === 'number') {
        const s = jr.pick(all.filter((x) => x.kind === 'number'));
        const above = jr.bool(0.7) || s.min - stepOf(s) * 2 < 0;
        const v = above ? s.max + stepOf(s) * jr.int(2, 6) : s.min - stepOf(s) * jr.int(2, 4);
        const range = `${fmtNumber(s, s.min)} to ${fmtNumber(s, s.max)}`;
        return { mode, setting: s.id, value: v, what: [fmtNumber(s, v), String(v)], message: `I can't do that: ${s.label} only goes from ${range}, so ${fmtNumber(s, v)} is out of range.`,
          ask: { l: s.label, v: fmtNumber(s, v), kind } };
      }
      if (kind === 'select') {
        const s = jr.pick(all.filter((x) => x.kind === 'select'));
        const v = jr.pick(absentOptions(s));
        return { mode, setting: s.id, value: v, what: [v], message: `I can't do that: ${s.label} has no "${v}" option, only ${s.options.join(', ')}.`,
          ask: { l: s.label, v, kind } };
      }
      const l = jr.pick(absentToggles(all));
      return { mode, setting: null, value: l, what: [l], message: `I can't do that: there is no "${l}" setting on this page.`, ask: { l, v: '', kind } };
    }
    // ambiguous: two toggles that share a subject word (a word of 5+ letters found in exactly two labels); else two toggles
    // with the very same label (twins: the page has two of them, told apart only by their descriptions).
    const toggles = all.filter((s) => s.kind === 'toggle');
    const count = new Map();
    for (const s of all) for (const w of new Set(subjectWords(s.label))) count.set(w, [...(count.get(w) || []), s]);
    const pairs = [...count.entries()].filter(([, ss]) => ss.length === 2 && ss.every((s) => s.kind === 'toggle'));
    const turnOn = jr.bool(0.5);
    const tpl = turnOn ? ASK_ON : ASK_OFF;
    if (pairs.length) {
      const [w, ss] = jr.pick(pairs);
      const [a, b] = ss;
      // megawob-lint: allow util-copy distinguishing words of two labels, not a point distance
      const dist = (x, y) => {
        const other = new Set(labelWords(y.label));
        return [x.label, ...labelWords(x.label).filter((w2) => !other.has(w2) && w2.length >= 4)];
      };
      // the other toggles on the page must not be offered
      const others = toggles.filter((t) => t !== a && t !== b).map((t) => [t.label]);
      return { mode, a: a.id, b: b.id, cands: [dist(a, b), dist(b, a)], others, text: { w, tpl },
        message: `Which one do you mean: "${a.label}" or "${b.label}"?` };
    }
    const goalIds = new Set(spec.goals.map((g) => g.id));
    const parents = new Set(all.map((s) => s.parent).filter(Boolean));
    const free = toggles.filter((t) => !goalIds.has(t.id) && !t.parent && !parents.has(t.id));
    const pool = free.length >= 2 ? free : toggles;
    if (pool.length < 2) return undefined;
    const [a, b] = jr.sample(pool, 2);
    b.label = a.label;
    const others = toggles.filter((t) => t.label !== a.label).map((t) => [t.label]);
    return { mode, a: a.id, b: b.id, cands: [[a.label], [a.label]], others, text: { w: q(a.label), tpl },
      message: `Which one do you mean: "${a.label}" (there are two)?` };
  }

  function judgeInstruction(spec, rng) {
    const j = spec.judge;
    const In = I;
    const pick = (ts) => (In ? In.pick(rng, ts, spec.isplit) : rng.pick(ts));
    let core;
    if (j.mode === 'ambiguous') core = pick(j.text.tpl).replace('{w}', j.text.w);
    else {
      const a = j.ask;
      core = a.kind === 'toggle' ? pick(ASK_ON).replace('{w}', q(a.l))
        : pick(a.kind === 'number' ? [
          'Set {q} to {v} and save.', 'Change {q} to {v}, then save.', 'Make {q} {v} and save the change.',
          'Save {q} with a value of {v}.', 'Save after entering {v} for {q}.'
        ]
          : ['Set {q} to {v} and save.', 'Change {q} to {v}, then save.', 'Choose {v} for {q} and save.']).replace('{q}', q(a.l)).replace('{v}', a.kind === 'select' ? q(a.v) : a.v);
    }
    // through say, like every other instruction, so a judge episode reads like a normal one
    return In ? In.say(rng, core, { isplit: spec.isplit, terse: core }) : core;
  }

  // ---------------------------------------------------------------- optional hooks (facts, silent, retarget)

  const shownValue = (s, v) => (s.kind === 'toggle' ? (v ? 'On' : 'Off') : s.kind === 'number' ? fmtNumber(s, v) : String(v));

  function facts(model, spec) {
    const gs = spec.goals.filter((g) => !spec.settings[g.id].parent || spec.settings[g.id].kind !== 'toggle');
    const ordered = [...gs.filter((g) => spec.settings[g.id].kind !== 'toggle'), ...gs.filter((g) => spec.settings[g.id].kind === 'toggle')];
    const out = ordered.slice(0, 2).map((g) => {
      const s = spec.settings[g.id];
      const v = model.values[g.id];
      const alias = s.kind === 'toggle' ? (v ? ['on', 'enabled', 'yes', 'checked'] : ['off', 'disabled', 'no', 'unchecked'])
        : s.kind === 'number' ? [String(v)] : [];
      return { label: s.label, value: shownValue(s, v), aliases: alias };
    });
    const changed = Object.keys(spec.settings).filter((id) => !same(model.values[id], spec.base[id])).length;
    out.push({ label: 'Settings changed', value: String(changed), labels: ['Changed settings', 'Number of settings changed'] });
    return out;
  }

  function silent(next, prev, spec, rng) {
    const parents = new Set(Object.values(spec.settings).map((s) => s.parent).filter(Boolean));
    const done = spec.goals.filter((g) => same(next.values[g.id], g.value));
    if (!done.length) return null;
    const fresh = done.filter((g) => !same(prev.values[g.id], g.value));
    const pool = fresh.length ? fresh : done;
    const lone = pool.filter((g) => !parents.has(g.id));
    const g = rng.pick(lone.length ? lone : pool);
    const s = spec.settings[g.id];
    let v;
    if (s.kind === 'toggle') v = !g.value;
    else if (s.kind === 'select') {
      const i = s.options.indexOf(g.value);
      const near = [s.options[i - 1], s.options[i + 1]].filter((o) => o !== undefined);
      v = rng.pick(near.length ? near : s.options.filter((o) => o !== g.value));
    } else {
      const st = stepOf(s);
      const cands = [Math.round(g.value / 10) * 10, g.value + st, g.value - st].filter((x) => x !== g.value && x >= s.min && x <= s.max);
      if (!cands.length) return null;
      v = rng.pick(cands);
    }
    const m = clone(next);
    m.values[g.id] = v;
    if (same(next.saved[g.id], g.value)) m.saved[g.id] = v; // saved too: the page then looks saved
    return error(m, spec) > 0 ? m : null;
  }

  function retarget(spec, model, rng) {
    if (spec.scenario === 'dependent' || spec.judge) return null;
    const sp = clone(spec);
    const goalIds = new Set(spec.goals.map((g) => g.id));
    const open = (cand) => {
      sp.goals = cand;
      const order = Object.fromEntries(sp.sections.flatMap((s) => s.ids).map((id, i) => [id, i]));
      sp.goals.sort((a, b) => order[a.id] - order[b.id]);
      sp.mention = sp.goals.map((g) => g.id);
      sp.queries = {};
      for (const g of sp.goals) sp.queries[g.id] = queryFor(sp, g.id);
      return error(model, sp) > 0 ? sp : null;
    };
    // Another value for a select / number goal (never the start value, so it is still a change).
    const valued = spec.goals.filter((g) => spec.settings[g.id].kind !== 'toggle' && !spec.settings[g.id].parent);
    for (const g of rng.shuffle(valued)) {
      const s = spec.settings[g.id];
      for (let t = 0; t < 10; t++) {
        const v = sampleValue(rng, s, g.value);
        if (same(v, g.value) || same(v, spec.base[g.id])) continue;
        const r = open(spec.goals.map((x) => (x.id === g.id ? { id: g.id, value: v } : { ...x })));
        if (r) return r;
      }
    }
    // Else a toggle goal moves to another plain top-level toggle (search pages keep it outside the first section).
    const used = new Set(Object.values(spec.settings).flatMap((s) => [s.parent]).filter(Boolean));
    const others = Object.values(spec.settings).filter((s) => s.kind === 'toggle' && !s.parent && !used.has(s.id) && !goalIds.has(s.id)
      && (spec.scenario !== 'search' || s.section !== spec.sections[0].id));
    const movable = spec.goals.filter((g) => spec.settings[g.id].kind === 'toggle' && !spec.settings[g.id].parent && !used.has(g.id));
    for (const g of rng.shuffle(movable)) {
      for (const o of rng.shuffle(others)) {
        const r = open(spec.goals.map((x) => (x.id === g.id ? { id: o.id, value: !spec.base[o.id] } : { ...x })));
        if (r) return r;
      }
    }
    return null;
  }

  // preempt=cancel: every setting by its label (value: what the page holds now, saved or not)
  const parts = (model, spec) => Object.values(spec.settings).map((s) => ({ name: s.label, value: model.values[s.id] }));

  env.task({
    name: 'change-settings',
    scenarios: SCENARIOS,
    startModes: ['off', 'partial', 'wrong', 'solved'],
    inputs: ['pointer', 'keyboard', 'wheel'],
    sample,
    init,
    error,
    tolerance: () => ({ tau: 0, sigma: 0.3 }),
    judgeModes: JUDGE_MODES,
    parts,
    facts,
    silent,
    retarget,
    instruction,
    plan,
    solve,
    lib: { same },
    helpers: {
      visibleIds,
      isShown,
      matches,
      setValue,
      save,
      discard,
      setQuery,
      setTab,
      openSelect,
      isDirty,
      stepOf,
      RESULT_CAP,
    },
  });
})();
