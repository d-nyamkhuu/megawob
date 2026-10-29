/* use-email/oracle.js: shared oracle internals; loaded through the task's files list. */
(function () {
  'use strict';
  const lib = env.taskOf('use-email').lib;

  // ---------------------------------------------------------------- start states

  function baseModel(spec) {
    return {
      flags: spec.emails.map((e) => ({ starred: !!e.starred, important: !!e.important, unread: !!e.unread })),
      box: spec.emails.map((_, i) => lib.homeBox(spec, i)),
      view: 'inbox',
      query: '',
      checked: [],
      anchor: null,
      open: null,
      menu: null,
      confirm: null,
      compose: null,
      sent: [],
      toast: null,
      strikes: 0,
      lastStrike: null,
      scroll: 0,
      rowPx: 64,
      stack: false,
      ...(spec.spam ? { junk: true } : {}),
    };
  }

  // Undo start: the wrong action is already done (its toast may still be up). partial: its folder is shown
  // or the target is open there; wrong: also an email that belongs in a folder was "restored" to the inbox.
  function initUndo(m, spec, rng, mode) {
    rng = rng || new env.Rng(7);
    const t = spec.target;
    const box = spec.undo.box;
    m.box[t] = box;
    if (spec.toast0) m.toast = { kind: box, of: [t], from: ['inbox'] };
    if (mode === 'partial') {
      m.view = box;
      if (rng.bool(0.5)) {
        m.open = t;
        m.flags[t].unread = false;
      }
    } else if (mode === 'scene') {
      m.view = box;
      m.open = t;
      m.flags[t].unread = false;
    } else if (mode === 'wrong') {
      const away = spec.emails.map((_, i) => i).filter((i) => i !== t && lib.homeBox(spec, i) !== 'inbox');
      const h = rng.pick(away);
      m.box[h] = 'inbox';
      if (rng.bool(0.5)) m.toast = { kind: 'inbox', of: [h], from: [lib.homeBox(spec, h)] };
      else if (rng.bool(0.5)) {
        m.open = h;
        m.flags[h].unread = false;
      }
    }
    return m;
  }

  // Start mode 'scene' (the reference screen's unsolved mid-task state, no scored progress and no randomness):
  // the target message is open and scrolled into the list; reply / forward (and star-reply) also have the
  // untouched composer of that kind open (Reply: to the sender, empty body; Forward: empty To, the original as
  // body); compose has an empty new message; bulk and search-only starts stay as they are.
  function initScene(m, spec) {
    if (lib.isBulk(spec)) return m;
    if (spec.task === 'compose') return lib.act(m, spec, { compose: true });
    const t = spec.target;
    const p = lib.position(m, spec, t);
    if (p >= 0) m.scroll = lib.clamp(p - Math.floor((spec.rows - 1) / 2), 0, lib.maxScroll(m, spec));
    let out = lib.act(m, spec, { open: t });
    const mode = lib.mailMode(spec) || (spec.task === 'star-reply' ? 'reply' : null);
    if (mode) out = lib.act(out, spec, mode === 'reply' ? { reply: t, all: false } : { forward: t });
    return out;
  }

  // Level starts (spec.lead, start mode 'off'): see leadOf.
  function initLead(m, spec) {
    if (spec.lead === 'ticked') {
      m.checked = spec.targets.slice(0, spec.leadN);
      return m;
    }
    if (spec.lead === 'scene') return initScene(m, spec);
    // open: the target open and in the list, no composer
    const t = spec.target;
    const p = lib.position(m, spec, t);
    if (p >= 0) m.scroll = lib.clamp(p - Math.floor((spec.rows - 1) / 2), 0, lib.maxScroll(m, spec));
    return lib.act(m, spec, { open: t });
  }

  function initModel(spec, rng) {
    const m = baseModel(spec);
    const mode = spec.startMode;
    if (lib.isUndo(spec)) return initUndo(m, spec, rng, mode === 'off' && spec.lead ? 'scene' : mode);
    if (mode === 'scene') return initScene(m, spec);
    if (mode === 'off' && spec.lead) return initLead(m, spec);
    if (mode !== 'partial' && mode !== 'wrong') return m;
    rng = rng || new env.Rng(7);
    const t = spec.target;
    const n = spec.emails.length;
    const others = spec.emails.map((_, i) => i).filter((i) => !lib.goals(spec).includes(i));
    const want = lib.wantDraft(spec);
    const openT = () => {
      m.open = t;
      m.flags[t].unread = false;
    };
    const half = (s) => s.slice(0, Math.max(1, Math.floor(s.length / 2)));

    if (mode === 'partial') {
      if (lib.isBulk(spec)) {
        const k = spec.targets.length;
        const some = spec.targets.slice(0, Math.max(1, Math.floor(k / 2)));
        if (rng.bool(0.5) && spec.bulk.op !== 'trash') {
          for (const i of some) {
            if (spec.bulk.op === 'archive') m.box[i] = 'archive';
            else if (spec.bulk.op === 'read') m.flags[i].unread = false;
            else m.flags[i].starred = true;
          }
        } else m.checked = some.slice();
      } else if (spec.task === 'compose') {
        m.compose = { mode: 'new', of: null, to: want.to.name, cc: '', subject: rng.bool(0.5) ? want.subject : '', body: '' };
      } else if (spec.task === 'star-reply' && rng.bool(0.5)) {
        m.flags[t].starred = true;
      } else if (want) {
        openT();
        if (want.mode === 'reply') m.compose = { mode: 'reply', of: t, to: spec.emails[t].name, cc: want.cc.map((p) => p.name).join(', '), subject: `Re: ${spec.emails[t].subject}`, body: half(want.body) };
        else m.compose = { mode: 'forward', of: t, to: half(want.to.name), cc: '', subject: `Fwd: ${spec.emails[t].subject}`, body: spec.emails[t].body };
      } else {
        openT();
        if (spec.task === 'move') m.menu = 'move';
      }
      return m;
    }

    // wrong
    const w = others.length ? rng.pick(others) : null;
    if (lib.isBulk(spec)) {
      const k = Math.min(others.length, rng.int(1, 2));
      m.checked = rng.sample(others, k).concat(rng.bool(0.5) ? [spec.targets[0]] : []).sort((x, y) => x - y);
      return m;
    }
    if (spec.task === 'compose') {
      const p = spec.emails[rng.int(0, n - 1)];
      m.compose = { mode: 'new', of: null, to: p.name === want.to.name ? spec.me.name : p.name, cc: '', subject: want.subject, body: '' };
      return m;
    }
    // a reply that wrongly copies the Cc line; not in star-reply, whose designs may show a body-only quick reply
    if (want && want.mode === 'reply' && spec.task !== 'star-reply' && spec.emails[t].cc.length && !spec.replyAll && rng.bool(0.7)) {
      openT();
      m.compose = { mode: 'reply', of: t, to: spec.emails[t].name, cc: spec.emails[t].cc.map((p) => p.name).join(', '), subject: `Re: ${spec.emails[t].subject}`, body: rng.bool(0.5) ? want.body : '' };
      return m;
    }
    if (want && want.mode === 'reply' && spec.replyAll && rng.bool(0.6)) {
      openT();
      m.compose = { mode: 'reply', of: t, to: spec.emails[t].name, cc: '', subject: `Re: ${spec.emails[t].subject}`, body: want.body };
      return m;
    }
    if (want && want.mode === 'forward' && rng.bool(0.6)) {
      openT();
      const pool = spec.emails.filter((e) => e.name !== want.to.name && e.name !== spec.emails[t].name);
      const p = pool.length ? rng.pick(pool) : spec.me;
      m.compose = { mode: 'forward', of: t, to: p.name, cc: '', subject: `Fwd: ${spec.emails[t].subject}`, body: spec.emails[t].body };
      return m;
    }
    if (w === null) {
      openT();
      return m;
    }
    // The task's own action, done to the wrong email (similar sender or neighbour).
    const op = lib.ops(spec)[0];
    const same = others.filter((i) => spec.emails[i].name === spec.emails[t].name);
    const v = same.length && rng.bool(0.6) ? rng.pick(same) : w;
    const toast = rng.bool(0.6);
    const moveWrong = (box) => {
      m.box[v] = box;
      if (toast) m.toast = { kind: box, of: [v], from: ['inbox'] };
    };
    if (op === 'delete') moveWrong('trash');
    else if (op === 'archive') moveWrong('archive');
    else if (op === 'move') moveWrong(spec.folder);
    else if (op === 'star' || op === 'important') {
      m.flags[v][lib.flagOf(op)] = !m.flags[v][lib.flagOf(op)];
      if (rng.bool(0.5)) {
        m.open = v;
        m.flags[v].unread = false;
      }
    } else {
      // unread / reply / forward without a draft: another email opened and starred by mistake.
      m.open = v;
      m.flags[v].unread = false;
      m.flags[v].starred = !m.flags[v].starred;
    }
    if (rng.bool(0.3) && spec.searchKey) m.query = spec.emails[v].name === spec.emails[t].name ? '' : spec.emails[v].name;
    if (m.query && !lib.matches(spec, v, m.query)) m.query = '';
    return m;
  }

  // ---------------------------------------------------------------- plan / solve

  // Steps that make email i's row clickable in the list, or null when it already is.
  function reach(model, spec, i, { search = false } = {}) {
    if (!lib.listShown(model)) return { click: { back: 1 } };
    if (!lib.inView(model, i, model.view)) return { click: { folder: model.box[i] } };
    if (search && spec.route === 'search' && spec.searchKey && lib.low(model.query) !== lib.low(spec.searchKey) && !lib.visible(spec, model, i)) {
      return { type: [{ search: 1 }, spec.searchKey] };
    }
    if (!lib.matches(spec, i, model.query)) return { type: [{ search: 1 }, ''] };
    if (lib.visible(spec, model, i)) return null;
    const p = lib.position(model, spec, i);
    const s = lib.clamp(p - Math.floor((spec.rows - 1) / 2), 0, lib.maxScroll(model, spec));
    if (spec.route === 'wheel') {
      const dy = Math.round((s - (model.scroll || 0)) * (model.rowPx || 64));
      if (Math.abs(dy) >= 4) return { wheel: [{ list: 1 }, dy] };
    }
    return { drag: [{ thumb: 'list' }, { scroll: s }] };
  }
  // Open email i in the message view.
  const openStep = (model, spec, i, o) => (model.open === i && !model.compose ? null : reach(model, spec, i, o) || { click: { row: i } });

  // Toolbar / key step that puts email i (open) back where it belongs.
  function fixStep(model, spec, i) {
    const w = lib.wantBox(spec, i);
    const op = w === 'inbox' ? 'inbox' : w === 'trash' ? 'delete' : w === 'archive' ? 'archive' : w === 'spam' ? 'spam' : 'move';
    if (!lib.toolbarOps(model, i).includes(op)) return { click: { action: 'inbox' } };
    if (op === 'move') return model.menu === 'move' ? { click: { moveTo: w } } : { click: { action: 'move' } };
    if (op === 'delete' && spec.keyDel) return { key: 'Delete' };
    return { click: { action: op } };
  }

  // Widget traits on top of the plan: select 'modifier' clients tick rows with Ctrl-click.
  function planOf(model, spec) {
    const step = planRaw(model, spec);
    if (step && spec.ctrlTick && step.click && step.click.check !== undefined && !step.modifiers) return { ...step, modifiers: ['Control'] };
    return step;
  }

  function planRaw(model, spec) {
    if (lib.errorOf(model, spec) === 0) return null;
    const want = lib.wantDraft(spec);

    // 1. a pending confirmation
    if (model.confirm) return { click: { confirm: model.confirm.of.every((i) => lib.shouldTrash(spec, i)) ? 'ok' : 'cancel' } };
    // 2. a toast whose action was wrong: undo it
    const tt = model.toast;
    if (tt) {
      const undesired = (i) => (tt.kind === 'trash' ? !lib.shouldTrash(spec, i) : lib.wantBox(spec, i) !== null && lib.wantBox(spec, i) !== tt.kind);
      const bad = tt.kind === 'send' ? tt.at < model.sent.length && !lib.draftRight(tt.msg, want)
        : tt.of.some((i, k) => model.box[i] === tt.kind && tt.from[k] !== tt.kind && undesired(i));
      if (bad) return { click: { toast: 'undo' } };
    }
    // 3. the draft
    if (model.compose) {
      const c = model.compose;
      const pendingMail = want && !model.sent.some((s) => lib.draftRight(s, want));
      const useful = pendingMail && c.mode === want.mode && c.of === want.of;
      if (!useful) return { click: { compose: 'discard' } };
      if (lib.toScore(c.to, want.to) !== 1) return { type: [{ field: 'to' }, want.to.name] };
      if (lib.ccScore(c.cc, want.cc) !== 1) return { type: [{ field: 'cc' }, want.cc.map((p) => p.name).join(', ')] };
      if (want.mode === 'new' && lib.normBody(c.subject) !== lib.normBody(want.subject)) return { type: [{ field: 'subject' }, want.subject] };
      if (lib.normBody(c.body) !== lib.normBody(want.body)) return { type: [{ field: 'body' }, want.body] };
      return { click: { compose: 'send' } };
    }
    // 4. a stray "Move to" menu
    const misplaced = lib.wrongTrash(model, spec).concat(lib.wrongMoves(model, spec));
    const needMenu = (spec.task === 'move' && model.open === spec.target && !lib.opDone(model, spec, spec.target, 'move'))
      || (misplaced.includes(model.open) && lib.isFolder(spec, lib.wantBox(spec, model.open)));
    if (model.menu && !needMenu) return { click: { action: 'move' } };
    // 5. emails that left the inbox although they should stay (undo: left the box they live in)
    if (misplaced.length) {
      const i = misplaced[0];
      return openStep(model, spec, i) || fixStep(model, spec, i);
    }
    // 6. flag side effects
    const side = lib.sideEffects(model, spec);
    if (side.length) {
      const [i, op] = side[0];
      if (model.open === i && !model.compose) return { click: { action: op } };
      if (lib.visible(spec, model, i) && lib.iconOk(spec, op)) return { click: { rowIcon: [i, op] } };
      return openStep(model, spec, i);
    }
    // 7. stray checkboxes
    const stray = lib.strayChecks(model, spec);
    if (stray.length) {
      const i = stray[0];
      if (!lib.inView(model, i, model.view) || !lib.matches(spec, i, model.query)) return { click: { folder: model.view } }; // re-entering the folder clears ticks
      return reach(model, spec, i) || { click: { check: i } };
    }

    // 8. the task
    if (lib.isBulk(spec)) return bulkPlan(model, spec);
    if (spec.task === 'compose') return { click: { compose: 'new' } };
    const t = spec.target;
    if (lib.isUndo(spec)) return openStep(model, spec, t, { search: true }) || { click: { action: 'inbox' } };
    for (const op of lib.ops(spec)) {
      if (op === 'reply' || op === 'forward') {
        if (model.sent.some((s) => lib.draftRight(s, want))) continue;
        const o = openStep(model, spec, t, { search: true });
        if (o) return o;
        return { click: { action: op === 'reply' ? (want.cc.length ? 'replyall' : 'reply') : 'forward' } };
      }
      if (lib.opDone(model, spec, t, op)) continue;
      if (spec.direct && ['star', 'important', 'delete'].includes(op) && lib.iconOk(spec, op) && !(op === 'delete' && spec.keyDel)
        && model.open !== t && lib.visible(spec, model, t) && model.box[t] === 'inbox') {
        return { click: { rowIcon: [t, op] } };
      }
      const o = openStep(model, spec, t, { search: true });
      if (o) return o;
      if (op === 'move') return model.menu === 'move' ? { click: { moveTo: spec.folder } } : { click: { action: 'move' } };
      if (!lib.toolbarOps(model, t).includes(op)) return { click: { action: 'inbox' } };
      if (op === 'delete' && spec.keyDel) return { key: 'Delete' };
      return { click: { action: op } };
    }
    return null;
  }

  function bulkPlan(model, spec) {
    const op = spec.bulk.op;
    const pending = spec.targets.filter((t) => !lib.opDone(model, spec, t, op));
    if (!pending.length) return null;
    // Targets that left the list view (a stray folder, an earlier archive) are reached one at a time.
    const order = lib.listOrder(model, spec);
    const need = pending.filter((t) => !model.checked.includes(t));
    if (!need.length) return { click: { bulk: op } };
    if (spec.route === 'search' && !model.checked.length && model.view === 'inbox' && pending.every((t) => model.box[t] === 'inbox')) {
      if (lib.low(model.query) !== lib.low(spec.searchKey)) return { type: [{ search: 1 }, spec.searchKey] };
      return { click: { checkAll: 1 } };
    }
    // Shift-click a contiguous run: tick the first, then Shift-click the last.
    const pos = pending.map((t) => order.indexOf(t));
    const run = pos.every((p) => p >= 0) && pos.length >= 3 && pos.every((p, k) => k === 0 || p === pos[k - 1] + 1);
    if (spec.shift && run) {
      const first = pending[0];
      const last = pending[pending.length - 1];
      if (!model.checked.length) return reach(model, spec, first) || { click: { check: first } };
      if (model.anchor === first && model.checked.length === 1 && model.checked[0] === first) {
        return reach(model, spec, last) || { click: { check: last }, modifiers: ['Shift'] };
      }
    }
    const t = need[0];
    return reach(model, spec, t) || { click: { check: t } };
  }

  // Model-space effect of one plan step, as the base widget implements it (selfTest, solve).
  function stepAction(model, spec, step) {
    if (step.drag) return { scroll: lib.clamp(step.drag[1].scroll, 0, lib.maxScroll(model, spec)) };
    if (step.wheel) return { scroll: lib.clamp((model.scroll || 0) + step.wheel[1] / (model.rowPx || 64), 0, lib.maxScroll(model, spec)) };
    if (step.type) {
      const [t, v] = step.type;
      return t.search ? { query: v } : { field: [t.field, v] };
    }
    if (step.key === 'Delete') return model.open === null || model.open === undefined ? {} : { move: [[model.open], 'trash'] };
    const t = step.click;
    if (!t) return {};
    if (t.row !== undefined) return spec.ctrlTick ? { open: t.row, only: true } : { open: t.row };
    if (t.rowIcon) return t.rowIcon[1] === 'delete' ? { move: [[t.rowIcon[0]], 'trash'] } : { flag: t.rowIcon };
    if (t.check !== undefined) return { check: t.check, range: !!(step.modifiers && step.modifiers.includes('Shift')) };
    if (t.checkAll) {
      const order = lib.listOrder(model, spec);
      return { checkAll: !(order.length && order.every((i) => model.checked.includes(i))) };
    }
    if (t.bulk) return { bulk: t.bulk };
    if (t.folder !== undefined) return { view: t.folder };
    if (t.back) return { back: true };
    if (t.moveTo) return { move: [[model.open], t.moveTo] };
    if (t.confirm) return { confirm: t.confirm === 'ok' };
    if (t.toast) return t.toast === 'undo' ? { undo: true } : { toastClose: true };
    if (t.compose) return t.compose === 'new' ? { compose: true } : t.compose === 'send' ? { send: true } : { discard: true };
    if (t.action) {
      const i = model.open;
      switch (t.action) {
        case 'delete': return { move: [[i], 'trash'] };
        case 'archive': return { move: [[i], 'archive'] };
        case 'spam': return { move: [[i], 'spam'] };
        case 'inbox': return { move: [[i], 'inbox'] };
        case 'move': return { menu: model.menu === 'move' ? null : 'move' };
        case 'unread': return { mark: [[i], true] };
        case 'star': case 'important': return { flag: [i, t.action] };
        case 'reply': return { reply: i };
        case 'replyall': return { reply: i, all: true };
        case 'forward': return { forward: i };
        default: return {};
      }
    }
    return {};
  }
  const simulate = (model, spec, step) => lib.act(model, spec, stepAction(model, spec, step));

  // Whether a step is possible in the base widget's state (selfTest guard).
  function stepValid(model, spec, step) {
    const t = step.click || (step.type && step.type[0]) || null;
    if (step.drag || step.wheel) return lib.listShown(model);
    if (step.key) return step.key === 'Delete' && !!spec.keyDel && model.open !== null && !model.compose && !model.checked.length;
    if (!t) return true;
    if (t.rowIcon && !lib.iconOk(spec, t.rowIcon[1])) return false;
    if (t.row !== undefined || t.rowIcon || t.check !== undefined) {
      const i = t.row !== undefined ? t.row : t.rowIcon ? t.rowIcon[0] : t.check;
      return lib.visible(spec, model, i);
    }
    if (t.search) return true;
    if (t.checkAll) return lib.listShown(model);
    if (t.bulk) return model.checked.length > 0 && lib.listShown(model);
    if (t.back) return !!model.stack;
    if (t.moveTo) return model.menu === 'move' && model.open !== null;
    if (t.confirm) return !!model.confirm;
    if (t.toast) return !!model.toast;
    if (t.field) return !!model.compose;
    if (t.compose) return t.compose === 'new' ? true : !!model.compose;
    if (t.action) {
      if (model.open === null || model.compose) return false;
      if (spec.ctrlTick && model.checked.length) return false; // the toolbar acts on the ticked rows
      if (['reply', 'replyall', 'forward'].includes(t.action)) return true;
      return lib.toolbarOps(model, model.open).includes(t.action);
    }
    return true;
  }

  function solveOf(spec, model) {
    let m = lib.clone(model);
    for (let k = 0; k < 60 && lib.errorOf(m, spec) > 0; k++) {
      const step = planOf(m, spec);
      if (!step) break;
      m = simulate(m, spec, step);
    }
    return m;
  }

  Object.assign(lib, {
    baseModel, initModel, planOf, simulate, stepValid, solveOf
  });
})();
