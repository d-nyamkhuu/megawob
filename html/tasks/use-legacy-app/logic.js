/*
 * use-legacy-app: look up and update records in mainframe, Swing, SAP-style and Windows 95 style apps.
 * Fictional enterprise record maintenance, no MiniWoB equivalent.
 * Real-app counterparts: 3270/5250 host maintenance and numbered inquiry menus,
 * Java Swing/Motif record editors, transaction-driven ERP clients, desktop property sheets.
 * Scenarios: mainframe (80x24 protected text and keyboard-only key lookup/update),
 * mainframe-lookup (numbered menus, F7/F8 list pages, record inquiry and value report),
 * swing (tree, record table, tabbed editor), sapgui (transaction command, F4 help, Ctrl+S),
 * win95 (property sheet tabs, group boxes, spin controls, Apply/OK/Cancel).
 *
 * spec: scenario, level, ood, startMode, isplit, records [{key,owner,company,city,
 * amount,batch,receipt,base:{cost,memo,retries}}], centers [{code,label}], goalIndex,
 * goals {field:value}, fields [{id,label,max,tab}], transaction, pageSize, locale.
 * model: drafts/stored (one field map per record), active (record index or null),
 * screen ('search'|'edit'|'menu'|'submenu'|'list'|'detail'|'command'), focus (field id),
 * key,command,option,answer,reported,visited[],page,tab,tree,help,selected,caret,
 * receipt,status,saves,closed (property sheet dismissed). Navigation/focus are unscored; other records and unrequested
 * fields must stay unchanged. Edits invalidate the receipt; only a save persists.
 * Error: mean normalized edit distance of requested draft AND persisted values,
 * plus changes to unrequested fields/records; lookup: visited + answer distance +
 * report acknowledgement. tau 0; wrong and partial starts remain recoverable.
 * easy: one change/eight records; medium: two changes/24 records; normal: three
 * changes/48 records; ood: 80 records, longer notes and wider retry range.
 * Inquiry lists show eight accounts per page; desktop directories scroll.
 *
 * parts(model,spec): preempt=cancel items by the label the page shows: maintenance -> the requested record's fields
 * (Cost center, Routing note / Description, Retry limit; value: draft and saved text), inquiry -> the requested
 * account's key (opened), 'Report value' (the typed answer) and 'Report status'.
 * facts(model,spec): visible Change document / Status (maintenance) or Batch /
 * Result / Report status (inquiry); never values copied trivially from the goal.
 * silent(next,prev,spec,rng): truncate a newly corrected text field (and persisted
 * copy if saved), or an inquiry answer. Preserve model shape; repeating repairs it.
 * retarget(spec,model,rng): change one requested field value, or inquire about another
 * existing record; scene contents and field lengths remain identical.
 * judgeModes: ambiguous (same owner, two visible keys; ask which), impossible
 * (missing record key; refuse), confirm (prepare changes/report, ask before save).
 * spec.judge = { mode, message, cands?, others?, what?, key? }: ambiguous cands are the two records' keys (the
 * instruction names the shared owner), others the other records' keys; impossible what is the absent key, seeded
 * outside the directory's key range (spec.judge.key); the instructions use the task's normal wording (the
 * absent key in place of a real one, the owner in place of the key). The kit grades the reply; no task judged().
 * confirmed saves call ctx.flag('irreversible') in the widget; preparation ignores
 * persisted values. ambiguous/impossible start within tau and are left untouched.
 *
 * Targets: {field:id} (key/command/answer or editable field), {record:index},
 * {tab:index}, {tree:true}, {save:true}, {open:true}, {help:true}, {option:code}.
 * Mainframe plans contain keys only (including Ctrl+A, Tab/Shift+Tab, PF and Enter);
 * desktop plans type/click, and sapgui uses F4/Ctrl+S. All plans are closed-loop.
 * Helpers (widget API, env.taskDef.helpers; pure and DOM-free):
 *   edit(model, spec, id, value): update a draft or navigation field.
 *   load(model, spec, index): open a record and record its visit.
 *   save(model, spec): persist the active record or acknowledge an inquiry report.
 *   cancel(model): discard active draft changes and dismiss help.
 *   terminalKey(model, spec, key, shift, ctrl): apply a host keystroke.
 *   value(model, id): read a navigation field or active draft field.
 *   setFocus(model, id): focus a field with the caret at its end.
 *   isTerminal(spec): whether the scenario uses host screens.
 *   lookup(spec): whether the scenario is an account inquiry.
 *   fmtAmount(record, spec): format the displayed USD balance.
 */
(function () {
  'use strict';
  const { clone, lev } = env.util;
  const C = env.content;
  const scenarios = ['mainframe', 'mainframe-lookup', 'swing', 'sapgui', 'win95'];
  const isTerminal = (s) => s.scenario.startsWith('mainframe');
  const lookup = (s) => s.scenario === 'mainframe-lookup';
  const confirm = (s) => s.judge && s.judge.mode === 'confirm';
  const fmtAmount = (r, s) => C.formatMoney(r.amount / 100, 'USD', s.locale);
  // Keystrokes left to turn field text a into b on a terminal: the missing tail when a is a prefix of b, else select all and retype.
  const distance = (a, b) => { a = String(a); b = String(b); return a === b ? 0 : (b.startsWith(a) ? b.length - a.length : b.length + 1) / (b.length + 1); };
  function sample(rng, opts) {
    const scenario = opts.scenario || rng.pick(opts.scenarios || scenarios);
    const level = opts.level || 'normal', ood = !!opts.ood;
    const cr = rng.fork('content'), co = { csplit: opts.csplit };
    const centers = C.sample(cr, C.DEPARTMENTS, 4, co).map((label, i) => ({ code: String(2100 + i * 100), label: C.ascii(label).toUpperCase().slice(0, 24) }));
    const count = ood ? 80 : level === 'easy' ? 8 : level === 'medium' ? 24 : 48;
    const firstKey = rng.int(1100, 7900);
    const records = Array.from({ length: count }, (_, i) => {
      const p = C.personName(cr, co);
      const product = C.pick(cr, C.PRODUCTS, co);
      return { key: `R${firstKey + i}`, owner: C.ascii(p.full).toUpperCase().slice(0, 22),
        company: C.ascii(C.pick(cr, C.COMPANIES, co)).toUpperCase().slice(0, 25),
        city: C.ascii(C.pick(cr, C.CITIES, co).city).toUpperCase().slice(0, 18),
        amount: rng.int(10100, ood ? 9899999 : 989999), batch: `B${rng.int(12000, 98999)}`,
        receipt: `CD${rng.int(100000, 999999)}`,
        base: { cost: centers[i % centers.length].code, memo: C.ascii(product.name).toUpperCase().replace(/[^A-Z0-9 ]/g, '').slice(0, 16), retries: String(rng.int(1, 4)) } };
    });
    const goalIndex = level === 'easy' ? rng.int(0, 3) : rng.int(4, count - 1);
    const fields = [
      { id: 'cost', label: 'Cost center', max: 4, tab: 0 },
      { id: 'memo', label: scenario === 'win95' ? 'Description' : 'Routing note', max: ood ? 24 : 16, tab: 1 },
      { id: 'retries', label: 'Retry limit', max: 2, tab: 2 },
    ];
    const r = records[goalIndex];
    const goals = { retries: String(rng.int(6, ood ? 99 : 20)) };
    if (level !== 'easy') goals.cost = rng.pick(centers.filter((c) => c.code !== r.base.cost)).code;
    if (level === 'normal' || ood) goals.memo = rng.pick([
      'PRIORITY DESK', 'NORTH OPERATIONS', 'ACCOUNT REVIEW', 'SERVICE CHECK', 'DISPATCH QUEUE', 'WAREHOUSE TEAM',
      'REGIONAL INTAKE', 'VENDOR LIAISON', 'CENTRAL ARCHIVE', 'FACILITY ACCESS', 'STAFF ROSTER', 'PARCEL INTAKE',
      'TRAINING ROOM', 'EQUIPMENT POOL', 'QUALITY AUDIT', 'DOCUMENT CONTROL'
    ]) + (ood ? ' EXT' : '');
    const s = { scenario, level, ood, startMode: opts.startMode, isplit: opts.isplit, csplit: opts.csplit,
      centers, records, goalIndex, goals, fields, transaction: 'ZREC', pageSize: 8, locale: 'en-US' };
    if (['ambiguous', 'impossible', 'confirm'].includes(opts.judge)) {
      const mode = opts.judge, jr = rng.fork('judge');
      records[1].owner = mode === 'ambiguous' ? records[0].owner : records[1].owner;
      // a key outside the directory's range, so it is absent from every page
      const key = mode !== 'impossible' ? null
        : `R${firstKey > 1010 && jr.bool(0.4) ? jr.int(1000, firstKey - 1) : jr.int(firstKey + count, 9999)}`;
      s.judge = { mode, message: mode === 'ambiguous' ? `Which record do you mean: ${records[0].key} or ${records[1].key}?`
        : mode === 'impossible' ? `I cannot find record ${key}; that key is not available in this system.`
          : 'The changes are prepared. Should I go ahead and save them?' };
      if (mode === 'ambiguous') {
        s.judge.cands = [[records[0].key], [records[1].key]];
        s.judge.others = records.slice(2).map((x) => [x.key]);
      } else if (mode === 'impossible') { s.judge.key = key; s.judge.what = [key]; }
    }
    return s;
  }
  function init(s) {
    const m = { drafts: s.records.map((r) => clone(r.base)), stored: s.records.map((r) => clone(r.base)),
      active: null, screen: lookup(s) ? 'menu' : s.scenario === 'sapgui' ? 'command' : 'search',
      focus: lookup(s) ? 'option' : s.scenario === 'sapgui' ? 'command' : 'key', selected: false, caret: 0,
      key: '', command: '', option: '', answer: '', reported: false, visited: [], page: 0, tab: 0,
      tree: false, help: false, closed: false, receipt: '', status: 'READY', saves: 0 };
    if (!isTerminal(s) && s.scenario !== 'sapgui') { m.active = 0; m.screen = 'edit'; }
    if (s.startMode === 'partial' || s.startMode === 'wrong') {
      m.active = s.goalIndex; m.key = s.records[s.goalIndex].key; m.tree = true;
      m.command = s.transaction; m.screen = lookup(s) ? 'list' : 'edit'; m.focus = lookup(s) ? 'option' : 'cost';
      m.page = Math.floor(s.goalIndex / s.pageSize);
      if (!lookup(s)) {
        const id = Object.keys(s.goals)[0];
        m.drafts[s.goalIndex][id] = s.startMode === 'partial' ? (confirm(s) && Object.keys(s.goals).length === 1 ? s.goals[id].slice(0, -1) : s.goals[id]) : id === 'retries' ? '2' : 'OLD';
        if (s.startMode === 'wrong') m.drafts[s.goalIndex].memo = 'STALE ENTRY';
      } else if (s.startMode === 'wrong') { m.answer = '0.00'; m.reported = true; }
      m.status = 'CHANGES PENDING';
    }
    if (s.judge && s.judge.mode !== 'confirm') {
      const done = solve(s, m);
      if (s.judge.mode === 'ambiguous') {
        done.page = 0; done.active = 0; done.screen = lookup(s) ? 'list' : isTerminal(s) ? 'search' : 'edit';
      }
      return done;
    }
    return m;
  }
  function error(m, s) {
    if (lookup(s)) {
      const a = distance(m.answer.trim(), fmtAmount(s.records[s.goalIndex], s));
      return ((m.visited.includes(s.goalIndex) ? 0 : 1) + a + (!confirm(s) && !m.reported ? 1 : 0)) / 3;
    }
    let sum = 0;
    for (let i = 0; i < s.records.length; i++) for (const f of s.fields) {
      const wanted = i === s.goalIndex && s.goals[f.id] !== undefined ? s.goals[f.id] : s.records[i].base[f.id];
      sum += distance(m.drafts[i][f.id], wanted);
      if (!confirm(s)) { sum += distance(m.stored[i][f.id], wanted); }
    }
    // Scale by requested work, so dense progress is useful even in a large directory.
    return Math.min(1, sum / Math.max(1, Object.keys(s.goals).length * (confirm(s) ? 1 : 2)));
  }
  function value(m, id) {
    return ['key', 'command', 'option', 'answer'].includes(id) ? m[id] : m.active === null ? '' : m.drafts[m.active][id];
  }
  function setFocus(m, id) { return { ...m, focus: id, selected: false, caret: value(m, id).length }; }
  function edit(m, s, id, v) {
    const out = clone(m);
    if (['key', 'command', 'option', 'answer'].includes(id)) {
      out[id] = id === 'answer' ? String(v).slice(0, 24) : String(v).toUpperCase().slice(0, id === 'option' ? 2 : 12);
      if (id === 'answer') out.reported = false;
    } else if (out.active !== null) {
      const f = s.fields.find((f) => f.id === id);
      out.drafts[out.active][id] = String(v).toUpperCase().slice(0, f.max);
      out.receipt = ''; out.status = 'CHANGES PENDING';
    }
    out.selected = false; out.caret = value(out, id).length;
    return out;
  }
  function load(m, s, index) {
    if (index < 0 || index >= s.records.length) return { ...m, status: 'E021 RECORD NOT FOUND' };
    return { ...m, active: index, key: s.records[index].key, screen: lookup(s) ? 'detail' : 'edit',
      focus: lookup(s) ? 'answer' : 'cost', selected: !lookup(s), caret: 0, tab: 0, help: false,
      visited: [...new Set([...m.visited, index])], closed: false, status: 'RECORD LOADED', receipt: '' };
  }
  function save(m, s) {
    const out = clone(m);
    if (lookup(s)) { out.reported = true; out.status = 'REPORT RECORDED'; return out; }
    if (m.active === null) return out;
    const d = m.drafts[m.active];
    if (!s.centers.some((c) => c.code === d.cost)) return { ...m, status: 'E034 UNKNOWN COST CENTER' };
    if (!/^\d+$/.test(d.retries) || Number(d.retries) < 1 || Number(d.retries) > 99) return { ...m, status: 'E041 RETRY LIMIT MUST BE 1-99' };
    out.stored[m.active] = clone(d); out.saves++; out.receipt = s.records[m.active].receipt; out.status = 'RECORD SAVED';
    return out;
  }
  function cancel(m) {
    const out = clone(m);
    if (out.active !== null) out.drafts[out.active] = clone(out.stored[out.active]);
    out.help = false; out.receipt = ''; out.status = 'CHANGES DISCARDED'; return out;
  }
  function focusOrder(m, s) {
    if (lookup(s)) return m.screen === 'detail' ? ['answer', 'option'] : ['option'];
    return m.screen === 'edit' ? s.fields.map((f) => f.id) : ['key'];
  }
  function terminalKey(m, s, key, shift, ctrl) {
    let out = clone(m);
    if (key === 'F1') return { ...out, help: !m.help };
    if (key === 'Escape' || key === 'F12') return { ...cancel(m), help: false };
    if (m.help) return out;
    if (key === 'F3') return { ...out, screen: lookup(s) ? 'menu' : 'search', focus: lookup(s) ? 'option' : 'key', option: '', selected: false };
    if (key === 'F5') return { ...cancel(m), status: 'REFRESH COMPLETE' };
    if (key === 'F7' || key === 'F8') {
      if ((lookup(s) && m.screen === 'list') || (!lookup(s) && m.screen === 'search')) return { ...out, page: Math.max(0, Math.min(Math.ceil(s.records.length / s.pageSize) - 1, m.page + (key === 'F8' ? 1 : -1))), option: '' };
      return out;
    }
    if (key === 'Tab') {
      const order = focusOrder(m, s), at = Math.max(0, order.indexOf(m.focus));
      return { ...setFocus(out, order[(at + (shift ? order.length - 1 : 1)) % order.length]), selected: true };
    }
    if (ctrl && key.toLowerCase() === 'a') return { ...out, selected: true };
    if (key === 'Enter') {
      if (!lookup(s)) return m.screen === 'search' ? load(m, s, s.records.findIndex((r) => r.key === m.key)) : save(m, s);
      if (m.screen === 'menu') return m.option === '1' ? { ...out, screen: 'submenu', option: '', status: 'SELECT INQUIRY' } : { ...out, status: 'OPTION NOT AVAILABLE' };
      if (m.screen === 'submenu') return m.option === '1' ? { ...out, screen: 'list', option: '', page: 0, status: 'SELECT A ROW NUMBER' } : { ...out, status: 'OPTION NOT AVAILABLE' };
      if (m.screen === 'list') {
        const n = Number(m.option);
        return n >= 1 && n <= s.pageSize ? load({ ...out, option: '' }, s, m.page * s.pageSize + n - 1) : { ...out, status: 'ENTER A VALID ROW NUMBER' };
      }
      if (m.screen === 'detail') {
        if (m.focus === 'option' && m.option === '9') return { ...out, screen: 'list', option: '', focus: 'option' };
        return save(m, s);
      }
    }
    const id = m.focus, v = value(m, id), pos = Math.min(m.caret, v.length);
    if (key === 'Home') return { ...out, caret: 0, selected: false };
    if (key === 'End') return { ...out, caret: v.length, selected: false };
    if (key === 'ArrowLeft' || key === 'ArrowRight') return { ...out, caret: Math.max(0, Math.min(v.length, pos + (key === 'ArrowLeft' ? -1 : 1))), selected: false };
    if (key === 'Backspace' || key === 'Delete') {
      const text = m.selected ? '' : key === 'Backspace' ? v.slice(0, Math.max(0, pos - 1)) + v.slice(pos) : v.slice(0, pos) + v.slice(pos + 1);
      out = edit(m, s, id, text); out.caret = m.selected ? 0 : Math.max(0, pos - (key === 'Backspace' ? 1 : 0)); return out;
    }
    if (!ctrl && key.length === 1) {
      out = edit(m, s, id, m.selected ? key : v.slice(0, pos) + key + v.slice(pos));
      out.caret = Math.min(value(out, id).length, m.selected ? 1 : pos + 1); return out;
    }
    return out;
  }
  function keyText(m, s, id, text) {
    if (m.focus !== id) {
      const order = focusOrder(m, s), at = order.indexOf(m.focus), to = order.indexOf(id);
      return { key: (to - at + order.length) % order.length > order.length / 2 ? 'Shift+Tab' : 'Tab' };
    }
    const v = value(m, id);
    if (v === text) return null;
    if (m.selected) return v && text.startsWith(v) ? { key: 'End' } : { key: 'Backspace' };
    if (!text.startsWith(v) || m.caret !== v.length) return { key: m.selected ? 'Backspace' : 'Control+a' };
    const c = text[v.length]; return { key: c === ' ' ? 'Space' : c };
  }
  function wanted(s, i, id) { return i === s.goalIndex && s.goals[id] !== undefined ? s.goals[id] : s.records[i].base[id]; }
  function plan(m, s) {
    if (m.help) {
      if (s.scenario === 'sapgui' && m.help === 'cost') return { click: { option: wanted(s, m.active === null ? s.goalIndex : m.active, 'cost') } };
      return { key: 'Escape' };
    }
    if (lookup(s)) {
      if (m.screen === 'menu' || m.screen === 'submenu') return keyText(m, s, 'option', '1') || { key: 'Enter' };
      if (m.screen === 'list') {
        const page = Math.floor(s.goalIndex / s.pageSize);
        if (m.page !== page) return { key: m.page < page ? 'F8' : 'F7' };
        return keyText(m, s, 'option', String(s.goalIndex % s.pageSize + 1)) || { key: 'Enter' };
      }
      if (m.active !== s.goalIndex) {
        return keyText(m, s, 'option', '9') || { key: 'Enter' };
      }
      return keyText(m, s, 'answer', fmtAmount(s.records[s.goalIndex], s)) || { key: 'Enter' };
    }
    // Repair accidental edits to other records as well as the requested record.
    const dirtyOther = s.records.findIndex((r, i) => i !== s.goalIndex && s.fields.some((f) => m.drafts[i][f.id] !== r.base[f.id] || (!confirm(s) && m.stored[i][f.id] !== r.base[f.id])));
    const target = dirtyOther < 0 ? s.goalIndex : dirtyOther;
    if (s.scenario === 'win95' && m.closed) return m.key !== s.records[target].key
      ? { type: [{ field: 'key' }, s.records[target].key] } : { click: { open: true } };
    if (s.scenario === 'sapgui' && m.screen === 'command') return m.command.toUpperCase().replace(/^\/N/, '') !== s.transaction
      ? { type: [{ field: 'command' }, `/n${s.transaction}`] } : { key: 'Enter' };
    if (isTerminal(s)) {
      if (m.screen === 'search') return keyText(m, s, 'key', s.records[target].key) || { key: 'Enter' };
      if (m.active !== target) return { key: 'F3' };
    } else if (s.scenario === 'sapgui' && (m.screen !== 'edit' || m.active !== target)) {
      return m.key !== s.records[target].key ? { type: [{ field: 'key' }, s.records[target].key] } : { key: 'Enter' };
    } else {
      if (!m.tree) return { click: { tree: true } };
      if (m.active !== target) return m.key !== s.records[target].key
        ? { type: [{ field: 'key' }, s.records[target].key] } : { key: 'Enter' };
    }
    for (const f of s.fields) {
      const text = wanted(s, target, f.id);
      if (m.drafts[target][f.id] === text) continue;
      if (isTerminal(s)) return keyText(m, s, f.id, text);
      if (m.tab !== f.tab) return { click: { tab: f.tab } };
      if (s.scenario === 'sapgui' && f.id === 'cost') {
        if (m.focus !== 'cost') return { click: { field: 'cost' } };
        return { key: 'F4' };
      }
      return { type: [{ field: f.id }, text] };
    }
    return isTerminal(s) ? { key: 'Enter' } : s.scenario === 'sapgui' ? { key: 'Control+s' } : { click: { save: true } };
  }
  function solve(s, m) {
    const out = clone(m);
    out.active = s.goalIndex; out.key = s.records[s.goalIndex].key; out.command = s.transaction;
    out.screen = lookup(s) ? 'detail' : 'edit'; out.tree = true; out.help = false; out.closed = false;
    if (lookup(s)) {
      out.visited = [...new Set([...out.visited, s.goalIndex])]; out.answer = fmtAmount(s.records[s.goalIndex], s); out.reported = true; out.status = 'REPORT RECORDED';
    } else {
      for (let i = 0; i < s.records.length; i++) for (const f of s.fields) out.drafts[i][f.id] = wanted(s, i, f.id);
      out.stored = clone(out.drafts); out.receipt = s.records[s.goalIndex].receipt; out.status = 'RECORD SAVED'; out.saves = Math.max(1, out.saves);
    }
    return out;
  }
  function instruction(s, rng) {
    const I = env.instruct, r = s.records[s.goalIndex];
    let core;
    const j = s.judge;
    const byOwner = j && j.mode === 'ambiguous', key = j && j.key ? j.key : r.key;
    if (byOwner && lookup(s)) core = I.phrase(rng, [
      'Record the current open balance for the account belonging to "{key}" in the inquiry report.',
      'I need the outstanding balance for the account of "{key}" entered in the inquiry report.',
      'Check the account held by "{key}" and record its open balance in the account inquiry report.',
      'Complete the balance inquiry report for the account of "{key}" using its current open balance.',
      'Add an entry to the inquiry report showing the current open balance of the account of "{key}".',
      'Use the account held by "{key}" to supply its open balance as the inquiry report entry.',
      'Let the inquiry report document the current open balance on the account belonging to "{key}".',
      'Please report how much is outstanding on the account of "{key}" in the inquiry report.',
      'Put the balance currently open on the account held by "{key}" into the balance inquiry report.',
    ], { key: s.records[0].owner }, s.isplit);
    else if (lookup(s)) core = I.phrase(rng, [
      'Record the current open balance for account "{key}" in the inquiry report.',
      'I need the outstanding balance for account "{key}" entered in the inquiry report.',
      'Check account "{key}" and record its open balance in the account inquiry report.',
      'Complete the balance inquiry report for account "{key}" using its current open balance.',
      'The outstanding balance of account "{key}" is needed as an inquiry report entry.',
      'Account "{key}" needs its open balance entered and recorded in the inquiry report.',
      'Let the inquiry report show how much is currently outstanding on account "{key}".',
      'Use the inquiry report to document the current open balance of account "{key}".',
      'Put the balance currently open on account "{key}" into the balance inquiry report.',
    ], { key }, s.isplit);
    else {
      const changes = s.fields.filter((f) => s.goals[f.id] !== undefined).map((f) => `"${f.label}" to "${s.goals[f.id]}"`).join(', ');
      core = byOwner ? I.phrase(rng, [
        'Find the record belonging to "{key}" and set {changes}. Save the record; keep all other values unchanged.',
        'Update the record held by "{key}": change {changes}, preserving the other fields, and save.',
        'Open the record for "{key}", change {changes}, and persist the changes. Leave everything else as it is.',
        'Maintain the record owned by "{key}" by setting {changes}. Store the update without changing other fields.',
        'Set {changes} in the record owned by "{key}". Save only these edits; leave all other values intact.',
        'Preserve all other values while setting {changes} in the record for "{key}", then save the update.',
        'Revise the record held by "{key}" as follows: {changes}. Retain all other values when saving the record.',
        'Save the record belonging to "{key}" after setting {changes}, while retaining all other existing values.',
        'Apply these field assignments to the record of "{key}": {changes}. Save with all other values intact.',
        'Restrict the update to setting {changes} for the record of "{key}". Save with other values unchanged.',
        'Make and save these changes for the record owner "{key}": {changes}. All other values must stay the same.',
        'Keep the record of "{key}" otherwise unchanged as you set {changes} and save the completed update.',
        'Change only the listed values in the record for "{key}": {changes}. Save the resulting record.',
        'Ensure these edits are saved in the record of "{key}": {changes}. All other values must remain intact.',
        'Enter {changes} for the record belonging to "{key}". Persist the record with its remaining values intact.',
      ], { key: s.records[0].owner, changes }, s.isplit) : I.phrase(rng, [
        'Find record "{key}" and set {changes}. Save the record; keep all other values unchanged.',
        'Update record "{key}": change {changes}, preserving the other fields, and save.',
        'Open "{key}", change {changes}, and persist the changes. Leave everything else as it is.',
        'Maintain record "{key}" by setting {changes}. Store the update without changing other fields.',
        'Set {changes} in record "{key}". Save only these edits; leave all other values intact.',
        'Preserve all other values while setting {changes} in record "{key}", then save the update.',
        'Revise "{key}" as follows: {changes}. Retain all other values when saving the record.',
        'Save record "{key}" after setting {changes}, while retaining all other existing values.',
        'Apply these field assignments to record "{key}": {changes}. Save with other values unchanged.',
        'Restrict the update to setting {changes} for "{key}". Save with other values unchanged.',
        'Make and save these changes in "{key}": {changes}. All other values must stay the same.',
        'Keep record "{key}" otherwise unchanged as you set {changes} and save the update.',
        'Carry out and save the following edits to "{key}", retaining every other value: {changes}.',
        'Leave the remaining fields of "{key}" unchanged; change {changes} and save that record.',
        'Ensure record "{key}" is saved with the listed edits and no other changes: {changes}.',
      ], { key, changes }, s.isplit);
      if (s.scenario === 'sapgui') core = `For customer maintenance (${s.transaction}), ${core[0].toLowerCase()}${core.slice(1)}`;
    }
    if (confirm(s)) {
      const set = s.fields.filter((f) => s.goals[f.id] !== undefined).map((f) => `"${f.label}" set to "${s.goals[f.id]}"`).join(', ');
      core = lookup(s) ? I.phrase(rng, [
        'Prepare the balance inquiry report for account "{key}" using its current open balance, but check with me before recording it.',
        'Fill in the balance inquiry report for account "{key}" with its current open balance and hold off recording it until I approve.',
        'Get the open balance for account "{key}" ready in the inquiry report, then wait for my approval before recording it.',
        'Ask me to approve the balance inquiry report once it holds the open balance for account "{key}". Keep it unrecorded until I do.',
        'Put the current open balance for account "{key}" in the inquiry report, leaving it unrecorded while you ask for my approval.',
      ], { key: r.key }, s.isplit) : I.phrase(rng, [
        'Prepare record "{key}" with {set}. Keep the other values unchanged and check with me before saving.',
        'Set up record "{key}": {set}, everything else unchanged, but do not save until I approve.',
        'Make the edits to record "{key}" ({set}) and wait for my approval before saving.',
        'Leave record "{key}" unsaved with {set} and other values unchanged. Ask me before saving.',
        'Keep other values unchanged in "{key}", with {set}. Ask for approval and wait to save.',
        'Get record "{key}" ready with {set}, other values intact. Ask me to approve before saving.',
      ], { key: r.key, set }, s.isplit);
    }
    return I.say(rng, core, { isplit: s.isplit });
  }
  function facts(m, s) {
    if (isTerminal(s) && (m.screen === 'search' || m.screen === 'list')) return [
      { label: m.screen === 'search' ? 'Directory page' : 'Page', value: `${m.page + 1} OF ${Math.ceil(s.records.length / s.pageSize)}` },
      { label: 'Status', value: m.status },
    ];
    if (lookup(s)) return [
      { label: 'Batch', value: s.records[m.active === null ? s.goalIndex : m.active].batch },
      { label: 'Result', value: `${s.records.length} ACCOUNTS` },
      { label: 'Report status', value: m.reported ? 'RECORDED' : 'PENDING' },
    ];
    return [{ label: 'Change document', value: m.receipt || 'NOT ASSIGNED' }, { label: 'Status', value: m.status }];
  }
  function parts(m, s) {
    if (lookup(s)) return [{ name: s.records[s.goalIndex].key, value: m.visited.includes(s.goalIndex) },
      { name: 'Report value', value: m.answer }, { name: 'Report status', value: m.reported ? 'RECORDED' : 'PENDING' }];
    return s.fields.map((f) => ({ name: f.label, value: [m.drafts[s.goalIndex][f.id], m.stored[s.goalIndex][f.id]] }));
  }
  function silent(next, prev, s, rng) {
    if (s.judge && s.judge.mode !== 'confirm') return null;
    const out = clone(next);
    if (lookup(s)) {
      if (next.answer === prev.answer || !next.answer) return null;
      out.answer = next.answer.slice(0, -1);
    } else {
      const ids = s.fields.filter((f) => next.drafts[s.goalIndex][f.id] !== prev.drafts[s.goalIndex][f.id]
        && next.drafts[s.goalIndex][f.id] === wanted(s, s.goalIndex, f.id) && next.drafts[s.goalIndex][f.id].length > 1).map((f) => f.id);
      if (!ids.length) return null;
      const id = rng.pick(ids), v = out.drafts[s.goalIndex][id].slice(0, -1);
      if (out.stored[s.goalIndex][id] === out.drafts[s.goalIndex][id]) out.stored[s.goalIndex][id] = v;
      out.drafts[s.goalIndex][id] = v;
    }
    return error(out, s) > 0 ? out : null;
  }
  function retarget(s, m, rng) {
    if (s.judge) return null;
    const out = clone(s);
    if (lookup(s)) {
      const candidates = rng.shuffle(s.records.map((r, i) => i).filter((i) => i !== s.goalIndex));
      for (const i of candidates) { out.goalIndex = i; if (error(m, out) > 0) return out; }
      return null;
    }
    out.goals.retries = rng.pick(['21', '31', '41'].filter((v) => v !== s.goals.retries && v !== m.drafts[s.goalIndex].retries));
    return error(m, out) > 0 ? out : null;
  }
  env.task({ name: 'use-legacy-app',
    reply: true, // judge and report endings are structured replies under the default reply=auto (kit/runtime/reply.js)
    scenarios, startModes: ['off', 'partial', 'wrong', 'solved'],
    inputs: (s) => isTerminal(s) ? ['pointer', 'keyboard'] : ['pointer', 'keyboard', 'wheel'], judgeModes: ['ambiguous', 'impossible', 'confirm'],
    sample, init, error, tolerance: () => ({ tau: 0, sigma: 0.18 }), instruction, plan, solve, facts, parts, silent, retarget,
    helpers: { edit, load, save, cancel, terminalKey, value, setFocus, isTerminal, lookup, fmtAmount } });
})();
