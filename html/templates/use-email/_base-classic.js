/* use-email/_base-classic.js: classic client construction and rendering.
 * Each render owns one page state; scope getters keep reference design overrides live.
 * Existing reference units delegate here with their live scope, preserving design overrides. */
(function () {
  'use strict';

  function buildList(page, m) {
    page.lb.replaceChildren();
    page.list = page.util.el('div', 'cl-list', page.lb);
    page.list.dataset.role = 'listbox';
    const track = page.util.el('div', 'cl-track', page.lb);
    track.dataset.role = 'scrollbar';
    const thumb = page.util.el('div', 'cl-thumb', track);
    thumb.dataset.role = 'thumb';
    const order = page.fam.helpers.listOrder(m, page.spec);
    page.rowEls = {};
    for (const i of order) {
      const e = page.spec.emails[i];
      const row = page.util.el('div', 'cl-row', page.list);
      row.dataset.role = 'email';
      row.style.height = page.rowH + 'px';
      row.addEventListener('click', (ev) => { page.mods = { ctrl: ev.ctrlKey || ev.metaKey, shift: ev.shiftKey }; });
      const ft = page.on(page.util.el('span', 'ft', row), { flag: [i, 'star'] });
      ft.innerHTML = page.scope.I.star;
      ft.title = 'Flag';
      ft.dataset.role = 'icon';
      const rd = page.util.el('span', 'rd', row);
      const at = page.util.el('span', 'at', row);
      if (e.att.length) at.innerHTML = page.scope.I.clip;
      page.util.el('span', 'fr', row, e.name);
      page.util.el('span', 'sj', row, e.subject);
      page.util.el('span', 'tm', row, e.time);
      page.reg.set(`ri:${i}:star`, ft);
      page.rowEls[i] = { row, ft, rd };
    }
    if (!order.length) page.util.el('div', 'cl-empty', page.list, m.query ? `No items match "${m.query}".` : 'There are no items to show in this view.');
    const mine = page.list;
    page.lbx = env.ui.listbox(page.list, {
      label: 'inbox',
      options: order.map((i) => [i, page.rowEls[i].row]),
      onChange(values, v) {
        const k = page.mods;
        page.mods = { ctrl: false, shift: false };
        page.up(k.ctrl ? { check: v } : k.shift ? { check: v, range: true } : { open: v, only: true });
      },
      onScroll(idx) {
        if (page.list !== mine) return; // a pending scroll event of a list that was rebuilt since: the new list owns the scroll
        const s = Math.round(idx * 1000) / 1000;
        if (s !== page.ctx.model.scroll) page.ctx.update({ ...page.ctx.model, scroll: s });
      },
      scrollbar: { track, thumb, pad: 0, minThumb: 24 },
    });
    track.classList.toggle('off', order.length <= page.spec.rows);
    page.lbx.set({ scroll: m.scroll || 0 });
    const s = Math.round(page.lbx.scrollIndex() * 1000) / 1000;
    if (s !== (page.ctx.model.scroll || 0) && page.listKey !== null) page.ctx.update({ ...page.ctx.model, scroll: s });
  }

  function paintList(page, m) {
    const order = page.fam.helpers.listOrder(m, page.spec);
    const key = JSON.stringify([m.view, m.query, order, order.map((i) => m.box[i])]);
    if (key !== page.listKey) {
      page.buildList(m);
      page.listKey = key;
    }
    for (const i of order) {
      const r = page.rowEls[i];
      r.row.classList.toggle('open', m.open === i);
      r.row.classList.toggle('unread', !!m.flags[i].unread);
      r.row.classList.toggle('checked', m.checked.includes(i));
      r.ft.classList.toggle('on', !!m.flags[i].starred);
      r.rd.innerHTML = m.flags[i].unread ? page.scope.I.unread : page.scope.I.read;
    }
    const live = page.spec.emails.map((_, i) => i);
    const count = (f) => live.filter(f).length;
    const setN = (k, v) => { if (page.folders[k]) page.folders[k].n.textContent = v ? `(${v})` : ''; };
    setN('inbox', count((i) => m.box[i] === 'inbox' && m.flags[i].unread));
    setN('drafts', m.compose ? 1 : 0);
    for (const f of page.spec.folders) setN(f, count((i) => m.box[i] === f && m.flags[i].unread));
    for (const [k, f] of Object.entries(page.folders)) f.el.classList.toggle('on', k === (m.view || 'inbox'));
    if (page.sField.get() !== (m.query || '')) page.sField.set(m.query || '');
    // toolbar state
    const n = m.checked.length;
    const i = m.open;
    const one = i !== null && i !== undefined && !m.compose;
    const ops = one ? page.fam.helpers.toolbarOps(m, i) : [];
    for (const [op, b] of Object.entries(page.tbs)) {
      let ok;
      if (op === 'new') ok = true;
      else if (n) ok = !!page.BULK[op];
      else if (!one) ok = false;
      else if (['reply', 'replyall', 'forward'].includes(op)) ok = true;
      else ok = ops.includes(op);
      b.classList.toggle('dis', !ok);
    }
    const inb = page.tbs.inbox.querySelector('span');
    const lab = !n && one && m.box[i] === 'spam' ? 'Not Junk' : !n && one && m.box[i] === 'trash' ? 'Restore' : 'Move to Inbox';
    if (inb.textContent !== lab) inb.textContent = lab;
    page.tbs.move.classList.toggle('pressed', m.menu === 'move');
  }

  function buildRead(page, m) {
    page.read.replaceChildren();
    if (page.menuEl) page.menuEl.remove();
    for (const k of [...page.reg.keys()]) if (k.startsWith('fld:') || k.startsWith('c:') || k.startsWith('mt:')) page.reg.delete(k);
    page.comp = null;
    page.menuEl = null;
    if (m.compose) {
      const c = m.compose;
      const box = page.util.el('div', 'cl-comp', page.read);
      const bar = page.util.el('div', 'cl-cbar', box);
      page.reg.set('c:send', page.on(page.util.el('button', 'cl-btn', bar, 'Send'), { send: true }));
      page.reg.set('c:discard', page.on(page.util.el('button', 'cl-btn', bar, 'Discard'), { discard: true }));
      page.util.el('b', '', bar, c.mode === 'new' ? 'Untitled - Message' : c.mode === 'reply' ? (c.cc ? 'Reply to All' : 'Reply') : 'Forward');
      const fields = {};
      const row = (k, label) => {
        const r = page.util.el('div', 'cl-crow', box);
        page.util.el('label', '', r, label);
        const inp = page.util.el('input', '', r);
        inp.type = 'text';
        inp.spellcheck = false;
        inp.autocomplete = 'off';
        inp.dataset.role = k;
        fields[k] = env.ui.textField(inp, { value: c[k] || '', label: k, onInput: (v) => page.setField(k, v) });
        page.reg.set(`fld:${k}`, inp);
      };
      row('to', 'To:');
      row('cc', 'Cc:');
      if (c.mode === 'new') row('subject', 'Subject:');
      else {
        const r = page.util.el('div', 'cl-crow', box);
        page.util.el('label', '', r, 'Subject:');
        page.util.el('span', 'subj', r, c.subject);
      }
      const ta = page.util.el('textarea', '', box);
      ta.spellcheck = false;
      ta.dataset.role = 'body';
      fields.body = env.ui.textField(ta, { value: c.body || '', label: 'body', onInput: (v) => page.setField('body', v) });
      page.reg.set('fld:body', ta);
      page.comp = { fields };
      return;
    }
    if (m.open === null || m.open === undefined) {
      page.util.el('div', 'cl-blank', page.read, 'Select an item to read its contents.');
      return;
    }
    const i = m.open;
    const e = page.spec.emails[i];
    const head = page.util.el('div', 'cl-head', page.read);
    page.util.el('h2', '', head, e.subject);
    const line = (k, v, t) => {
      const d = page.util.el('div', '', head);
      page.util.el('b', '', d, k);
      page.util.el('span', '', d, v);
      if (t) page.util.el('span', 'tmr', d, t);
    };
    line('From:', `${e.name} [${e.addr}]`, e.date ? e.date.line : e.time);
    line('To:', page.spec.me.name);
    if (e.cc.length) line('Cc:', e.cc.map((p) => p.name).join('; '));
    if (e.att.length) {
      const d = page.util.el('div', '', head);
      page.util.el('b', '', d, 'Files:');
      const chips = page.util.el('span', 'cl-chips', d);
      for (const a of e.att) {
        const c = page.util.el('span', 'cl-chip', chips);
        c.innerHTML = a.group === 'image' ? page.scope.I.image : page.scope.I.file;
        page.util.el('span', '', c, `${a.file} (${a.size})`);
      }
    }
    const txt = page.util.el('div', 'cl-text', page.read, e.body);
    for (const s of m.sent.filter((x) => x.of === i)) {
      const to = String(s.to || '').trim() || '(no recipient)';
      page.util.el('div', 'cl-note', txt, s.mode === 'reply' ? `You replied to ${to}${s.cc && s.cc.trim() ? `, cc ${s.cc.trim()}` : ''}: “${String(s.body || '').trim()}”.` : `You forwarded this message to ${to}.`);
    }
    page.menuEl = page.util.el('div', 'cl-menu-pop', page.app);
    page.menuEl.hidden = true;
    page.menuEl.setAttribute('role', 'menu');
    for (const f of page.spec.folders) {
      const it = page.util.el('div', 'cl-mi', page.menuEl);
      it.innerHTML = page.scope.I.folder;
      page.util.el('span', '', it, f);
      it.setAttribute('role', 'menuitem');
      page.on(it, { move: [[i], f] });
      page.reg.set(`mt:${f}`, it);
    }
  }

  function setField(page, k, v) {
    if (!page.ctx.model.compose) return;
    page.ctx.update(page.fam.helpers.act(page.ctx.model, page.spec, { field: [k, v] }));
  }

  function paintRead(page, m) {
    const shown = m.compose ? ['c', m.compose.mode, m.compose.of] : m.open !== null && m.open !== undefined ? ['m', m.open, JSON.stringify(m.sent)] : ['b'];
    const key = JSON.stringify(shown);
    if (key !== page.readKey) {
      page.readKey = key;
      page.buildRead(m);
    } else if (page.comp && m.compose) {
      for (const [k, f] of Object.entries(page.comp.fields)) if (f.get() !== (m.compose[k] || '')) f.set(m.compose[k] || '');
    }
    if (page.menuEl) {
      const show = m.menu === 'move';
      if (show && page.menuEl.hidden) {
        page.menuEl.hidden = false;
        const ar = page.app.getBoundingClientRect();
        const r = page.tbs.move.getBoundingClientRect();
        page.menuEl.style.left = Math.round(r.left - ar.left) + 'px';
        page.menuEl.style.top = Math.round(r.bottom - ar.top + 1) + 'px';
      } else if (!show) page.menuEl.hidden = true;
    }
  }

  function paintStatus(page, m) {
    const order = page.fam.helpers.listOrder(m, page.spec);
    const t = m.toast;
    const key = JSON.stringify([t, order.length, m.checked.length]);
    if (key === page.statusKey) return;
    page.statusKey = key;
    page.status.replaceChildren();
    for (const k of [...page.reg.keys()]) if (k.startsWith('t:')) page.reg.delete(k);
    page.util.el('span', '', page.status, m.checked.length ? `${m.checked.length} items selected` : `${order.length} Items`);
    if (t) {
      const box = page.util.el('div', 'cl-toast', page.status);
      const n = t.kind === 'send' ? 1 : t.of.length;
      const what = n > 1 ? `${n} items` : 'Item';
      const text = t.kind === 'send' ? page.scope.sentText(t) : t.kind === 'trash' ? `${what} moved to Deleted Items.`
        : t.kind === 'archive' ? `${what} archived.` : t.kind === 'inbox' ? `${what} moved to Inbox.` : t.kind === 'spam' ? `${what} moved to Junk E-mail.`
          : `${what} moved to ${t.kind}.`;
      page.util.el('span', '', box, text);
      const u = page.on(page.util.el('button', '', box, 'Undo'), { undo: true });
      u.type = 'button';
      page.reg.set('t:undo', u);
      const x = page.on(page.util.el('button', 'cx', box, '×'), { toastClose: true });
      x.type = 'button';
      page.reg.set('t:close', x);
    }
    page.util.el('span', 'r', page.status, 'Connected to mail server');
  }

  function paintModal(page, m) {
    const key = JSON.stringify(m.confirm);
    if (key === page.modalKey) return;
    page.modalKey = key;
    page.modalHost.replaceChildren();
    for (const k of [...page.reg.keys()]) if (k.startsWith('cf:')) page.reg.delete(k);
    if (!m.confirm) return;
    const back = page.util.el('div', 'cl-modal', page.modalHost);
    const dlg = page.util.el('div', 'cl-dlg', back);
    dlg.setAttribute('role', 'dialog');
    page.util.el('div', 'tt', dlg, 'Confirm Delete');
    page.util.el('p', '', dlg, m.confirm.of.length > 1 ? 'Are you sure you want to move these items to the Deleted Items folder?' : 'Are you sure you want to move this item to the Deleted Items folder?');
    const row = page.util.el('div', 'row', dlg);
    page.reg.set('cf:ok', page.on(page.util.el('button', 'cl-btn', row, 'Yes'), { confirm: true }));
    page.reg.set('cf:cancel', page.on(page.util.el('button', 'cl-btn', row, 'No'), { confirm: false }));
  }

  function paint(page, m) {
    page.paintList(m);
    page.listDesign = page.scope.classicListPaint(page.ctx, { app: page.app, lbox: page.lbox }, page.listDesign, m);
    page.paintRead(m);
    page.paintStatus(m);
    page.paintModal(m);
  }

  function mountFrame(page) {
    ({ util: page.util, rng: page.rng, spec: page.spec } = page.ctx);
    page.fam = env.taskDef;
    ({ appW: page.appW, treeW: page.treeW, appH: page.appH, rowH: page.rowH, left: page.left, mx: page.mx } = page.scope.classicGeometry(page.ctx));
    page.app = page.util.el('div', 'cl-app', page.ctx.stage);
    Object.assign(page.app.style, { width: page.appW + 'px', height: page.appH + 'px', left: page.left + 'px', top: page.mx + 'px' });
    page.up = (a) => {
      const prev = page.ctx.model;
      const next = page.fam.helpers.act(prev, page.spec, a);
      page.ctx.update(next);
      if (next.touched && !prev.touched && page.spec.judge && page.spec.judge.mode === 'confirm') page.ctx.flag('irreversible'); // the final press
      page.paint(page.ctx.model);
    };
    page.on = (el, a) => {
      el.addEventListener('click', (ev) => {
        ev.stopPropagation();
        page.up(typeof a === 'function' ? a(ev) : a);
      });
      return el;
    };
    page.reg = new Map();
    page.center = (el) => {
      if (!el || !el.isConnected) return null;
      const r = el.getBoundingClientRect();
      return r.width && r.height ? Object.defineProperty([r.left + r.width / 2, r.top + r.height / 2], 'element', { value: el }) : null;
    };
    page.title = page.util.el('div', 'cl-title', page.app);
    page.title.innerHTML = page.scope.I.logo;
    page.util.el('span', '', page.title, `Inbox - ${page.rng.pick(['Mail Express', 'Postbox 2003', 'Courier Mail', 'Office Mail'])}`);
    page.util.el('span', 'sp', page.title);
    page.util.el('i', '', page.title);
    page.util.el('i', '', page.title);
    page.util.el('i', '', page.title);
    page.menu = page.util.el('div', 'cl-menu', page.app);
    for (const t of ['File', 'Edit', 'View', 'Go', 'Tools', 'Actions', 'Help']) page.util.el('span', '', page.menu, t);
    page.sl = page.util.el('label', '', page.menu, 'Search:');
    page.sInput = page.util.el('input', '', page.sl);
    page.sInput.type = 'text';
    page.sInput.spellcheck = false;
    page.sInput.autocomplete = 'off';
    page.sInput.dataset.role = 'search';
    page.sField = env.ui.textField(page.sInput, { value: page.ctx.model.query || '', label: 'search', onInput: (v) => page.up({ query: v }) });
    page.reg.set('search', page.sInput);
    page.tools = page.util.el('div', 'cl-tools', page.app);
    page.tbs = {};
    page.BULK = { delete: 'trash', archive: 'archive', unread: 'unread', read: 'read', star: 'star' };
    page.SINGLE = { delete: 'trash', archive: 'archive', inbox: 'inbox', spam: 'spam' };
  }

  function mountToolbar(page) {
    page.tb = (op, icon, label, cls) => {
      const b = page.util.el('button', 'cl-tb' + (cls ? ' ' + cls : ''), page.tools);
      b.type = 'button';
      b.innerHTML = icon;
      page.util.el('span', '', b, label);
      b.title = label;
      b.dataset.op = op;
      b.addEventListener('click', (ev) => {
        ev.stopPropagation();
        const m = page.ctx.model;
        if (b.classList.contains('dis')) return;
        if (op === 'new') return page.up({ compose: true });
        if (m.checked.length && page.BULK[op]) return page.up({ bulk: page.BULK[op] });
        const i = m.open;
        if (i === null || i === undefined || m.compose) return;
        if (op === 'reply') return page.up({ reply: i });
        if (op === 'replyall') return page.up({ reply: i, all: true });
        if (op === 'forward') return page.up({ forward: i });
        if (op === 'move') return page.up({ menu: m.menu === 'move' ? null : 'move' });
        if (op === 'unread') return page.up({ mark: [[i], true] });
        if (op === 'star' || op === 'important') return page.up({ flag: [i, op] });
        if (page.SINGLE[op]) return page.up({ move: [[i], page.SINGLE[op]] });
      });
      page.reg.set(`a:${op}`, b);
      page.tbs[op] = b;
      return b;
    };
    page.sep = () => page.util.el('span', 'sep', page.tools);
    page.tb('new', page.scope.I.pen, 'New');
    page.sep();
    page.tb('reply', page.scope.I.reply, 'Reply');
    page.tb('replyall', page.scope.I.replyAll, 'Reply to All');
    page.tb('forward', page.scope.I.forward, 'Forward');
    page.sep();
    page.tb('delete', page.scope.I.trash, 'Delete', 'del');
    page.tb('archive', page.scope.I.archive, 'Archive');
    page.tb('move', page.scope.I.moveTo, 'Move to');
    if (page.spec.spam) page.tb('spam', page.scope.I.spam, 'Junk');
    page.tb('inbox', page.scope.I.restore, 'Restore');
    page.sep();
    page.tb('unread', page.scope.I.unread, 'Unread');
    page.tb('read', page.scope.I.read, 'Read');
    page.tb('star', page.scope.I.star, 'Flag', 'star');
    page.tb('important', page.scope.I.imp, 'Important');
    page.body = page.util.el('div', 'cl-body', page.app);
    page.tree = page.util.el('nav', 'cl-tree', page.body);
    page.tree.style.width = page.treeW + 'px';
    page.folders = {};
    page.addFolder = (key, label, deco, indent, bold) => {
      const f = page.util.el('div', 'cl-fo' + (deco ? ' deco' : '') + (bold ? ' bold' : ''), page.tree);
      f.style.paddingLeft = 6 + indent * 14 + 'px';
      f.innerHTML = page.scope.I.folder;
      page.util.el('span', 'lb', f, label);
      f.title = label;
      page.folders[key] = { el: f, n: page.util.el('b', '', f) };
      if (!deco) {
        page.on(f, { view: key });
        page.reg.set(`f:${key}`, f);
      }
    };
    page.util.el('div', 'cl-th', page.tree, 'Mail Folders');
    page.addFolder('personal', 'Personal Folders', true, 0, true);
    page.addFolder('inbox', 'Inbox', false, 1, true);
    page.addFolder('drafts', 'Drafts', true, 1);
    page.addFolder('sent', 'Sent Items', true, 1);
  }

  function mountPanes(page) {
    page.addFolder('archive', 'Archive', false, 1);
    if (page.spec.spam) page.addFolder('spam', 'Junk E-mail', false, 1);
    page.addFolder('trash', 'Deleted Items', false, 1);
    for (const f of page.spec.folders) page.addFolder(f, f, false, 1);
    page.addFolder('search', 'Search Folders', true, 0, true);
    page.addFolder('starred', 'Flagged Mail', false, 1);
    page.addFolder('important', 'Important Mail', false, 1);
    page.right = page.util.el('div', 'cl-right', page.body);
    page.lbox = page.util.el('div', 'cl-listbox', page.right);
    page.col = page.util.el('div', 'cl-col', page.lbox);
    page.colDef = [['ft', 22, '!'], ['rd', 20, ''], ['at', 18, ''], ['fr', 0, 'From'], ['sj', 0, 'Subject'], ['tm', 92, 'Received']];
    for (const [k, w, t] of page.colDef) {
      const c = page.util.el('span', k, page.col, t);
      if (w) c.style.width = w + 'px';
      else if (k === 'fr') c.style.width = '26%';
      else c.style.flex = '1';
    }
    page.util.el('span', '', page.col).style.width = '16px';
    page.lb = page.util.el('div', 'cl-lb', page.lbox);
    page.lb.style.height = page.spec.rows * page.rowH + 'px';
    page.read = page.util.el('section', 'cl-read', page.right);
    page.status = page.util.el('div', 'cl-status', page.app);
    page.modalHost = page.util.el('div', '', page.app);
    page.lbx = null;
    page.list = null;
    page.rowEls = {};
    page.listKey = null;
    page.mods = { ctrl: false, shift: false };
    page.readKey = null;
    page.comp = null;
    page.menuEl = null;
    page.statusKey = null;
    page.modalKey = null;
    page.listDesign = null;
    page.paint(page.ctx.model);
    page.listDesign = page.scope.classicListMounted(page.ctx, { app: page.app, lbox: page.lbox });
    if (page.tools.scrollWidth > page.tools.clientWidth + 1) page.tools.classList.add('ic');
    if (page.ctx.model.rowPx !== page.rowH || page.ctx.model.stack) {
      page.ctx.update({ ...page.ctx.model, rowPx: page.rowH, stack: false });
      page.paint(page.ctx.model);
    }
    page.find = (k) => page.reg.get(k) || null;
  }

  function interaction(page) {
    return {
      app: page.app,
      sync: (m) => page.paint(m),
      outside(e) {
        if (!page.menuEl || !page.ctx.model.menu) return;
        if (page.menuEl.contains(e.target) || page.tbs.move.contains(e.target)) return;
        page.up({ menu: null });
      },
      // Delete key: trash the open message (when no rows are ticked and no field has the focus).
      key(e) {
        const m = page.ctx.model;
        if (e.key !== 'Delete' || m.compose || m.checked.length || m.open === null || m.open === undefined) return;
        if (e.target && /^(INPUT|TEXTAREA)$/.test(e.target.tagName)) return;
        page.up({ move: [[m.open], 'trash'] });
      },
      locate(t) {
        if (t.row !== undefined) return page.lbx.locateOption(t.row);
        if (t.thumb !== undefined) return page.lbx.locateThumb();
        if (t.scroll !== undefined) return page.lbx.locateThumbFor(t.scroll);
        if (t.list) return page.center(page.list);
        if (t.search) return page.center(page.sInput);
        if (t.rowIcon) return page.center(page.find(`ri:${t.rowIcon[0]}:${t.rowIcon[1]}`));
        if (t.check !== undefined) return page.lbx.locateOption(t.check); // Ctrl-click on the row
        if (t.bulk) return page.center(page.find(`a:${{ trash: 'delete', archive: 'archive', read: 'read', unread: 'unread', star: 'star' }[t.bulk]}`));
        if (t.folder !== undefined) return page.center(page.find(`f:${t.folder}`));
        if (t.action) return page.center(page.find(`a:${t.action}`));
        if (t.moveTo) return page.center(page.find(`mt:${t.moveTo}`));
        if (t.field) return page.center(page.find(`fld:${t.field}`));
        if (t.compose) return page.center(t.compose === 'new' ? page.find('a:new') : page.find(`c:${t.compose}`));
        if (t.confirm) return page.center(page.find(`cf:${t.confirm}`));
        if (t.toast) return page.center(page.find(`t:${t.toast}`));
        return null;
      },
    };
  }

  function buildClassic(ctx, scope) {
    const page = { ctx, scope };
    page.buildList = (...args) => buildList(page, ...args);
    page.paintList = (...args) => paintList(page, ...args);
    page.buildRead = (...args) => buildRead(page, ...args);
    page.setField = (...args) => setField(page, ...args);
    page.paintRead = (...args) => paintRead(page, ...args);
    page.paintStatus = (...args) => paintStatus(page, ...args);
    page.paintModal = (...args) => paintModal(page, ...args);
    page.paint = (...args) => paint(page, ...args);
    mountFrame(page);
    mountToolbar(page);
    mountPanes(page);
    return interaction(page);
  }

  env.template('use-email/_base-classic', () => ({ buildClassic }));
})();
