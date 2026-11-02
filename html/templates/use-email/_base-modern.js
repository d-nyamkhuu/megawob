/* use-email/_base-modern.js: modern client construction and rendering.
 * Each render owns one page state; scope getters keep reference design overrides live.
 * Existing reference units delegate here with their live scope, preserving design overrides. */
(function () {
  'use strict';

  function attBadge(page, e, parent) {
    if (!e.att.length) return;
    const c = page.util.el('span', 'am-clip', parent);
    c.innerHTML = page.scope.I.clip;
    page.util.el('span', '', c, page.scope.GROUP_BADGE[e.att[0].group] || '');
    c.title = e.att.map((a) => a.file).join(', ');
  }

  function buildList(page, m) {
    page.lb.replaceChildren();
    page.reg.list.clear();
    page.scope.mailListHeading(page.ctx, page.lb);
    page.list = page.util.el('div', 'am-list', page.lb);
    page.list.dataset.role = 'listbox';
    const track = page.util.el('div', 'am-track', page.lb);
    track.dataset.role = 'scrollbar';
    const thumb = page.util.el('div', 'am-thumb', track);
    thumb.dataset.role = 'thumb';
    const order = page.fam.helpers.listOrder(m, page.spec);
    page.rowEls = {};
    for (const i of order) {
      const e = page.spec.emails[i];
      const row = page.util.el('div', `am-row ${page.rowKind}`, page.list);
      row.dataset.role = 'email';
      row.style.height = page.rowH + 'px';
      const gut = page.util.el('div', 'am-gut', row);
      const cw = page.util.el('span', 'cbw', gut);
      const cb = page.util.el('input', '', cw);
      cb.type = 'checkbox';
      cb.title = 'Select';
      cb.dataset.role = 'row-check';
      cb.addEventListener('click', (ev) => {
        ev.stopPropagation();
        page.up({ check: i, range: ev.shiftKey });
      });
      cw.addEventListener('click', (ev) => ev.stopPropagation());
      const st = page.on(page.util.el('span', 'am-ico star', gut), { flag: [i, 'star'] });
      st.innerHTML = page.scope.I.star;
      st.title = 'Star';
      const im = page.on(page.util.el('span', 'am-ico imp', gut), { flag: [i, 'important'] });
      im.innerHTML = page.scope.I.imp;
      im.title = 'Mark as important';
      const txt = page.util.el('div', 'am-txt', row);
      const l1 = page.util.el('div', 'am-l1', txt);
      page.util.el('span', 'am-from', l1, e.name);
      const subj = page.util.el('span', 'am-subj', null, e.subject);
      const snip = page.util.el('span', 'am-snip', null, page.snippet(e));
      if (page.rowKind === 'tall') {
        page.attBadge(e, l1);
        page.util.el('span', 'am-time', l1, page.scope.mailTime(e));
        txt.append(subj);
        subj.style.display = 'block';
        const l2 = page.util.el('div', 'am-l2', txt);
        if (e.att.length) {
          const chips = page.util.el('div', 'am-chips', l2);
          for (const a of e.att.slice(0, 2)) {
            const c = page.util.el('span', 'am-chip', chips);
            c.innerHTML = a.group === 'image' ? page.scope.I.image : page.scope.I.file;
            page.util.el('span', '', c, a.file);
          }
        } else l2.append(snip);
      } else if (page.rowKind === 'medium') {
        page.attBadge(e, l1);
        page.util.el('span', 'am-time', l1, page.scope.mailTime(e));
        const l2 = page.util.el('div', 'am-l2', txt);
        l2.append(subj, snip);
      } else {
        const l2 = page.util.el('div', 'am-l2', txt);
        l2.append(subj, snip);
        page.attBadge(e, l2);
        page.util.el('span', 'am-time', l2, page.scope.mailTime(e));
      }
      const ract = page.util.el('div', 'am-ract', row);
      if (m.box[i] !== 'archive' && m.box[i] !== 'trash' && m.box[i] !== 'spam') {
        const ar = page.on(page.util.el('span', 'am-ico arch', ract), { move: [[i], 'archive'] });
        ar.innerHTML = page.scope.I.archive;
        ar.title = 'Archive';
        page.reg.list.set(`ri:${i}:archive`, ar);
      }
      if (m.box[i] !== 'trash') {
        const tr = page.on(page.util.el('span', 'am-ico trash', ract), { move: [[i], 'trash'] });
        tr.innerHTML = page.scope.I.trash;
        tr.title = 'Delete';
        page.reg.list.set(`ri:${i}:delete`, tr);
      }
      for (const el of row.querySelectorAll('.am-ico')) el.dataset.role = 'icon';
      page.reg.list.set(`ri:${i}:star`, st);
      page.reg.list.set(`ri:${i}:important`, im);
      page.reg.list.set(`cb:${i}`, cb);
      page.rowEls[i] = { row, cb, st, im };
    }
    if (!order.length) {
      const v = m.view || 'inbox';
      page.util.el('div', 'am-empty-list', page.list, m.query ? `No messages match "${m.query}"` : `${page.fam.helpers.viewLabel(v)} is empty`);
    }
    const mine = page.list;
    page.lbx = env.ui.listbox(page.list, {
      label: 'inbox',
      options: order.map((i) => [i, page.rowEls[i].row]),
      onChange(values, v) { page.up({ open: v }); },
      onScroll(idx) {
        if (page.list !== mine) return; // a pending scroll event of a list that was rebuilt since: the new list owns the scroll
        const s = Math.round(idx * 1000) / 1000;
        if (s !== page.ctx.model.scroll) {
          page.ctx.update({ ...page.ctx.model, scroll: s });
          page.paintRange(page.ctx.model);
        }
      },
      scrollbar: { track, thumb, pad: 2, minThumb: 30, onDrag: (d) => thumb.classList.toggle('dragging', d) },
    });
    track.classList.toggle('off', order.length <= page.spec.rows);
    page.lbx.set({ scroll: m.scroll || 0 });
    const s = Math.round(page.lbx.scrollIndex() * 1000) / 1000;
    if (s !== (page.ctx.model.scroll || 0) && page.listKey !== null) page.ctx.update({ ...page.ctx.model, scroll: s });
  }

  function paintRange(page, m) {
    const n = page.fam.helpers.listOrder(m, page.spec).length;
    if (!n) {
      page.range.textContent = '0 messages';
      return;
    }
    const a = Math.min(n, Math.floor((m.scroll || 0) + 0.5) + 1);
    const b = Math.min(n, a + page.spec.rows - 1);
    page.range.textContent = `${a}–${b} of ${n}`;
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
      r.cb.checked = m.checked.includes(i);
      r.st.classList.toggle('on', !!m.flags[i].starred);
      r.im.classList.toggle('on', !!m.flags[i].important);
    }
    page.paintRange(m);
    // header: title or bulk toolbar
    const n = m.checked.length;
    page.all.checked = !!order.length && order.every((i) => m.checked.includes(i));
    page.all.indeterminate = n > 0 && !page.all.checked;
    page.headTitle.hidden = n > 0;
    page.bulkBar.hidden = n === 0;
    page.range.hidden = n > 0;
    page.headTitle.textContent = m.query ? `Search results` : page.fam.helpers.viewLabel(m.view || 'inbox');
    page.cnt.textContent = `${n} selected`;
    if (n > 0 && page.lhead.scrollWidth > page.lhead.clientWidth + 1) page.bulkBar.classList.add('am-icons');
    if (n > 0 && page.lhead.scrollWidth > page.lhead.clientWidth + 1) page.cnt.hidden = true;
    // sidebar
    const live = page.spec.emails.map((_, i) => i);
    const count = (f) => live.filter(f).length;
    const setN = (k, v) => { if (page.folders[k]) page.folders[k].n.textContent = v ? String(v) : ''; };
    setN('inbox', count((i) => m.box[i] === 'inbox' && m.flags[i].unread));
    setN('starred', count((i) => m.box[i] !== 'trash' && m.box[i] !== 'spam' && m.flags[i].starred));
    setN('important', count((i) => m.box[i] !== 'trash' && m.box[i] !== 'spam' && m.flags[i].important));
    setN('spam', count((i) => m.box[i] === 'spam'));
    setN('sent', m.sent.length);
    setN('drafts', m.compose ? 1 : 0);
    setN('archive', count((i) => m.box[i] === 'archive'));
    setN('trash', count((i) => m.box[i] === 'trash'));
    for (const f of page.spec.folders) setN(f, count((i) => m.box[i] === f));
    for (const [k, f] of Object.entries(page.folders)) f.el.classList.toggle('on', k === (m.view || 'inbox'));
    if (page.sField.get() !== (m.query || '')) page.sField.set(m.query || '');
    page.sx.hidden = !m.query;
  }

  function buildRead(page, m) {
    page.read.replaceChildren();
    page.reg.read.clear();
    page.comp = null;
    page.msgFlags = null;
    page.menuEl = null;
    page.moveBtn = null;
    const backBtn = (parent) => {
      if (!page.scope.mailShowBack(page.stack)) return;
      const b = page.on(page.button('am-tb back', page.scope.I.back, '', parent, 'Back to list'), { back: true });
      page.reg.read.set('back', b);
    };
    if (m.compose) {
      const c = m.compose;
      const box = page.util.el('div', 'am-comp', page.read);
      const head = page.util.el('div', 'am-chead', box);
      backBtn(head);
      page.util.el('span', '', head, c.mode === 'new' ? 'New message' : c.mode === 'reply' ? (c.cc ? 'Reply all' : 'Reply') : 'Forward');
      const x = page.on(page.button('am-x', '', '', head, 'Discard draft'), { discard: true });
      x.textContent = '×';
      const fields = {};
      const row = (k, label, ph) => {
        const r = page.util.el('div', 'am-crow', box);
        page.util.el('label', '', r, label);
        const inp = page.util.el('input', '', r);
        inp.type = 'text';
        inp.spellcheck = false;
        inp.autocomplete = 'off';
        inp.placeholder = ph;
        inp.dataset.role = k;
        fields[k] = env.ui.textField(inp, { value: c[k] || '', label: k, onInput: (v) => page.setField(k, v) });
        page.reg.read.set(`fld:${k}`, inp);
      };
      row('to', 'To', 'Recipients');
      row('cc', 'Cc', '');
      if (c.mode === 'new') row('subject', 'Subject', 'Subject');
      else {
        const r = page.util.el('div', 'am-crow', box);
        page.util.el('label', '', r, 'Subject');
        page.util.el('span', 'subj', r, c.subject);
      }
      const bodyEl = page.util.el('textarea', '', box);
      bodyEl.spellcheck = false;
      bodyEl.placeholder = c.mode === 'reply' ? 'Write your reply…' : 'Message';
      bodyEl.dataset.role = 'body';
      fields.body = env.ui.textField(bodyEl, { value: c.body || '', label: 'body', onInput: (v) => page.setField('body', v) });
      page.reg.read.set('fld:body', bodyEl);
      const f = page.util.el('div', 'am-cfoot', box);
      const send = page.on(page.button('am-btn primary', page.scope.I.sent, 'Send', f), { send: true });
      const discard = page.on(page.button('am-link', '', 'Discard', f), { discard: true });
      page.reg.read.set('c:send', send);
      page.reg.read.set('c:discard', discard);
      page.comp = { fields };
      return;
    }
    if (m.open === null || m.open === undefined) {
      const b = page.util.el('div', 'am-blank', page.read);
      b.innerHTML = page.scope.I.logo;
      page.util.el('div', '', b, page.scope.mailBlank());
      return;
    }
    const i = m.open;
    const e = page.spec.emails[i];
    const bar = page.util.el('div', 'am-bar' + (page.labels ? '' : ' am-icons'), page.read);
    backBtn(bar);
    const OPS = {
      archive: ['', page.scope.I.archive, 'Archive'],
      delete: ['del', page.scope.I.trash, 'Delete'],
      inbox: ['', page.scope.I.restore, m.box[i] === 'trash' ? 'Restore' : m.box[i] === 'spam' ? 'Not spam' : 'Move to Inbox'],
      spam: ['', page.scope.I.spam, 'Report spam'],
      move: ['', page.scope.I.moveTo, 'Move to'],
      unread: ['', page.scope.I.unread, 'Mark unread'],
      star: ['star', page.scope.I.star, 'Star'],
      important: ['imp', page.scope.I.imp, 'Important'],
    };
    for (const op of page.fam.helpers.toolbarOps(m, i)) {
      const [cls, icon, label] = OPS[op];
      const b = page.button('am-tb ' + cls, icon, label, bar, label);
      if (op === 'move') {
        page.moveBtn = b;
        page.on(b, () => ({ menu: page.ctx.model.menu === 'move' ? null : 'move' }));
      } else if (op === 'delete') page.on(b, { move: [[i], 'trash'] });
      else if (op === 'archive') page.on(b, { move: [[i], 'archive'] });
      else if (op === 'inbox') page.on(b, { move: [[i], 'inbox'] });
      else if (op === 'spam') page.on(b, { move: [[i], 'spam'] });
      else if (op === 'unread') page.on(b, { mark: [[i], true] });
      else page.on(b, { flag: [i, op] });
      page.reg.read.set(`a:${op}`, b);
      if (op === 'star') page.msgFlags = { ...(page.msgFlags || {}), st: b };
      if (op === 'important') page.msgFlags = { ...(page.msgFlags || {}), im: b };
    }
    page.util.el('span', 'sp', bar);
    if (page.labels || page.stack) page.util.el('span', 'when', bar, e.time);
    // Labels that do not fit fall back to icons with tooltips.
    if (bar.scrollWidth > bar.clientWidth + 1) {
      bar.classList.add('am-icons');
      const w = bar.querySelector('.when');
      if (w && bar.scrollWidth > bar.clientWidth + 1) w.remove();
    }
    if (page.moveBtn) {
      page.menuEl = page.util.el('div', 'am-menu', bar);
      page.menuEl.hidden = true;
      page.menuEl.setAttribute('role', 'menu');
      page.util.el('div', 'hd', page.menuEl, 'Move to');
      for (const f of page.spec.folders) {
        const it = page.util.el('div', 'am-mi', page.menuEl);
        it.innerHTML = page.scope.I.folder;
        page.util.el('span', '', it, f);
        it.setAttribute('role', 'menuitem');
        page.on(it, { move: [[i], f] });
        page.reg.read.set(`mt:${f}`, it);
      }
    }
    const msg = page.util.el('div', 'am-msg', page.read);
    page.util.el('h2', '', msg, e.subject);
    const who = page.util.el('div', 'am-who', msg);
    const av = page.util.el('div', 'am-av', who, page.scope.initials(e.name));
    av.style.background = page.scope.hashColor(e.name);
    const wd = page.util.el('div', '', who);
    const nm = page.util.el('div', 'nm', wd, e.name);
    page.util.el('small', '', nm, `<${e.addr}>`);
    page.util.el('div', 'to', wd, e.cc.length ? `to me, cc: ${e.cc.map((p) => p.name).join(', ')}` : 'to me');
    if (e.date) page.util.el('div', 'to', wd, e.date.line);   // traits.fullDate
    if (e.att.length) {
      const chips = page.util.el('div', 'am-chips', msg);
      for (const a of e.att) {
        const c = page.util.el('span', 'am-chip', chips);
        c.innerHTML = a.group === 'image' ? page.scope.I.image : page.scope.I.file;
        page.util.el('span', '', c, a.file);
        page.util.el('small', '', c, a.size);
        c.title = a.file;
      }
    }
    page.util.el('div', 'am-text', msg, e.body);
    for (const s of m.sent.filter((x) => x.of === i)) {
      const note = page.util.el('div', 'am-note', msg);
      note.innerHTML = page.scope.I.check;
      const to = String(s.to || '').trim() || '(no recipient)';
      page.util.el('span', '', note, s.mode === 'reply' ? `Reply sent to ${to}${s.cc && s.cc.trim() ? `, cc ${s.cc.trim()}` : ''}: “${String(s.body || '').trim()}”` : `Forwarded to ${to}`);
    }
    const acts = page.util.el('div', 'am-acts', page.read);
    page.reg.read.set('a:reply', page.on(page.button('am-btn', page.scope.I.reply, 'Reply', acts), { reply: i }));
    page.reg.read.set('a:replyall', page.on(page.button('am-btn', page.scope.I.replyAll, 'Reply all', acts), { reply: i, all: true }));
    page.reg.read.set('a:forward', page.on(page.button('am-btn', page.scope.I.forward, 'Forward', acts), { forward: i }));
  }

  function setField(page, k, v) {
    const cur = page.ctx.model.compose;
    if (!cur) return;
    page.ctx.update(page.fam.helpers.act(page.ctx.model, page.spec, { field: [k, v] }));
    page.paintList(page.ctx.model);
  }

  function paintRead(page, m) {
    const shown = m.compose ? ['c', m.compose.mode, m.compose.of] : m.open !== null && m.open !== undefined ? ['m', m.open, m.box[m.open], JSON.stringify(m.sent)] : ['b'];
    const key = JSON.stringify(shown);
    if (key !== page.readKey) {
      page.readKey = key;
      page.buildRead(m);
    } else if (page.comp && m.compose) {
      for (const [k, f] of Object.entries(page.comp.fields)) if (f.get() !== (m.compose[k] || '')) f.set(m.compose[k] || '');
    }
    if (page.msgFlags && m.open !== null && m.open !== undefined) {
      const f = m.flags[m.open];
      if (page.msgFlags.st) {
        page.msgFlags.st.classList.toggle('on', !!f.starred);
        page.msgFlags.st.querySelector('span').textContent = f.starred ? 'Starred' : 'Star';
      }
      if (page.msgFlags.im) page.msgFlags.im.classList.toggle('on', !!f.important);
    }
    if (page.moveBtn) page.moveBtn.classList.toggle('pressed', m.menu === 'move');

    if (page.menuEl) {
      const show = m.menu === 'move';
      if (show && page.menuEl.hidden) {
        page.menuEl.hidden = false;
        const bar = page.menuEl.parentElement;
        const br = bar.getBoundingClientRect();
        const r = page.moveBtn.getBoundingClientRect();
        const w = page.menuEl.getBoundingClientRect().width || 190;
        page.menuEl.style.left = Math.max(4, Math.min(br.width - w - 4, r.left - br.left)) + 'px';
        page.menuEl.style.top = (r.bottom - br.top + 4) + 'px';
      } else if (!show) page.menuEl.hidden = true;
    }
  }

  function paintStatus(page, m) {
    const t = m.toast;
    const key = JSON.stringify(t);
    if (key === page.statusKey) return;
    page.statusKey = key;
    page.status.replaceChildren();
    page.reg.status.clear();
    if (t) {
      const box = page.util.el('div', 'am-toast', page.status);
      const n = t.kind === 'send' ? 1 : t.of.length;
      const what = n > 1 ? `${n} conversations` : 'Conversation';
      const text = t.kind === 'send' ? page.scope.sentText(t) : t.kind === 'trash' ? `${what} moved to Trash.`
        : t.kind === 'archive' ? `${what} archived.` : t.kind === 'inbox' ? `${what} moved to Inbox.` : t.kind === 'spam' ? `${what} reported as spam.` : `${what} moved to ${t.kind}.`;
      page.util.el('span', '', box, text);
      page.reg.status.set('t:undo', page.on(page.button('', '', 'Undo', box), { undo: true }));
      const cl = page.on(page.button('cl', '', '', box, 'Dismiss'), { toastClose: true });
      cl.textContent = '×';
      page.reg.status.set('t:close', cl);
    }
    const u = page.util.el('div', 'used', page.status);
    if (page.appW >= 700 || !t) {
      u.style.setProperty('--used', page.used + '%');
      page.util.el('i', '', u);
      page.util.el('span', '', u, `${(page.used * 0.15).toFixed(1)} GB of 15 GB used`);
    }
  }

  function paintModal(page, m) {
    const key = JSON.stringify(m.confirm);
    if (key === page.modalKey) return;
    page.modalKey = key;
    page.modalHost.replaceChildren();
    page.reg.modal.clear();
    if (!m.confirm) return;
    const back = page.util.el('div', 'am-modal', page.modalHost);
    back.addEventListener('click', (ev) => {
      if (ev.target === back) page.up({ confirm: false });
    });
    const dlg = page.util.el('div', 'am-dlg', back);
    dlg.setAttribute('role', 'dialog');
    const n = m.confirm.of.length;
    page.util.el('h3', '', dlg, n > 1 ? `Delete ${n} conversations?` : 'Delete this conversation?');
    page.util.el('p', '', dlg, n > 1 ? 'They will be moved to Trash.' : 'It will be moved to Trash.');
    const row = page.util.el('div', 'row', dlg);
    page.reg.modal.set('cf:cancel', page.on(page.button('am-btn', '', 'Cancel', row), { confirm: false }));
    page.reg.modal.set('cf:ok', page.on(page.button('am-btn danger', '', 'Delete', row), { confirm: true }));
  }

  function paint(page, m) {
    // List-then-detail: the list hides while a message or draft is shown; when it comes back, restore its
    // scroll position from the model (a hidden pane loses it).
    const detail = page.stack && !page.fam.helpers.listShown({ ...m, stack: true });
    const was = page.app.classList.contains('am-detail');
    page.app.classList.toggle('am-detail', detail);
    page.paintList(m);
    if (was && !detail && page.lbx) {
      page.lbx.set({ scroll: page.ctx.model.scroll || 0 });
      const s = Math.round(page.lbx.scrollIndex() * 1000) / 1000;
      if (s !== (page.ctx.model.scroll || 0)) page.ctx.update({ ...page.ctx.model, scroll: s });
      page.paintRange(page.ctx.model);
    }
    page.paintRead(m);
    page.scope.mailPaintSidebar(page.ctx, page.sidebarDesign, m);
    page.scope.mailPaintTop(page.ctx, page.topDesign, m);
    page.paintStatus(m);
    page.paintModal(m);
  }

  function mountFrame(page) {
    ({ util: page.util, rng: page.rng, spec: page.spec } = page.ctx);
    page.ads = page.style === 'ads';
    page.fam = env.taskDef;
    ({ appW: page.appW, appH: page.appH, rail: page.rail, sideW: page.sideW, stack: page.stack, adCol: page.adCol, bannerH: page.bannerH, sponsorK: page.sponsorK, listW: page.listW, readW: page.readW, rowH: page.rowH, rowKind: page.rowKind, left: page.left, top: page.top, lr: page.lr } = page.scope.mailGeometry(page.ctx, page.ads));
    page.hoverActs = page.listW < 440 || page.lr.bool(0.4);
    page.app = page.util.el('div', 'am-app' + (page.stack ? ' am-stack' : '') + (page.hoverActs ? ' hover-acts' : ''), page.ctx.stage);
    Object.assign(page.app.style, { width: page.appW + 'px', height: page.appH + 'px', left: Math.round(page.left) + 'px', top: Math.round(page.top) + 'px' });
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
    page.button = (cls, icon, label, parent, title) => {
      const b = page.util.el('button', cls, parent);
      b.type = 'button';
      b.innerHTML = icon || '';
      if (label) page.util.el('span', '', b, label);
      if (title) {
        b.title = title;
        b.setAttribute('aria-label', title);
      }
      return b;
    };
    page.reg = { list: new Map(), read: new Map(), fixed: new Map(), head: new Map(), status: new Map(), modal: new Map() };
    page.topEl = page.util.el('div', 'am-top', page.app);
    page.brand = page.util.el('div', 'am-brand', page.topEl);
    page.brand.innerHTML = page.scope.I.logo;
    if (page.appW >= 720) page.util.el('span', '', page.brand, page.rng.pick(page.scope.BRANDS));
    page.composeInSide = page.ads && !page.rail;
    page.newBtn = page.on(page.button('am-new', page.scope.I.pen, 'Compose', page.composeInSide ? null : page.topEl), { compose: true });
    page.reg.fixed.set('c:new', page.newBtn);
    page.topDesign = page.scope.mailTopActions(page.ctx, { app: page.app, topEl: page.topEl, composeInSide: page.composeInSide, newBtn: page.newBtn, on: page.on, button: page.button, reg: page.reg });
    page.search = page.util.el('label', 'am-search', page.topEl);
    page.search.innerHTML = page.scope.I.search;
    page.sInput = page.util.el('input', '', page.search);
    page.sInput.type = 'text';
    page.sInput.placeholder = page.rng.pick(['Search mail', 'Search', 'Search messages', 'Search in mail']);
    page.sInput.spellcheck = false;
    page.sInput.autocomplete = 'off';
    page.sInput.dataset.role = 'search';
    page.sField = env.ui.textField(page.sInput, { value: page.ctx.model.query || '', label: 'search', onInput: (v) => page.up({ query: v }) });
    page.sx = page.on(page.button('am-sx', '', '×', page.search, 'Clear search'), { query: '' });
    page.sx.textContent = '×';
    page.reg.fixed.set('search', page.sInput);
    page.me = page.util.el('div', 'am-me', page.topEl, page.scope.initials(page.spec.me.name));
    page.me.title = `${page.spec.me.name} <${page.spec.me.addr}>`;
    if (page.bannerH) page.scope.buildBanner(page.util, page.app, page.rng.fork('ads'), page.bannerH);
    page.body = page.util.el('div', 'am-body', page.app);
    page.side = page.util.el('nav', 'am-side' + (page.rail ? ' am-rail' : ''), page.body);
    page.side.style.width = page.sideW + 'px';
    if (page.composeInSide) {
      page.newBtn.classList.add('wide');
      page.side.append(page.newBtn);
    }
    page.sideH = page.appH - 50 - 34 - 2 - page.bannerH - (page.composeInSide ? 44 : 0);
    page.custom = page.spec.folders;
  }

  function mountSidebar(page) {
    page.builtins = [['inbox', 'Inbox', page.scope.I.inbox], ['starred', 'Starred', page.scope.I.star], ['important', 'Important', page.scope.I.imp],
      ['sent', 'Sent', page.scope.I.sent, true], ['drafts', 'Drafts', page.scope.I.draft, true], ['archive', 'Archive', page.scope.I.archive],
      ...(page.spec.spam ? [['spam', 'Spam', page.scope.I.spam]] : []), ['trash', 'Trash', page.scope.I.trash]];
    page.fit = (k) => Math.floor((page.sideH - 12 - (page.rail ? 14 : 24)) / k);
    page.itemH = page.fit(page.builtins.length + page.custom.length);
    if (page.itemH < 26) {
      page.builtins = page.builtins.filter((b) => !b[3]);
      page.itemH = page.fit(page.builtins.length + page.custom.length);
    }
    page.itemH = Math.max(22, Math.min(page.rail ? 38 : 34, page.itemH));
    page.folders = {};
    page.addFolder = (key, label, icon, deco) => {
      const f = page.util.el('div', 'am-folder' + (deco ? ' deco' : ''), page.side);
      f.style.height = page.itemH + 'px';
      if (icon) f.innerHTML = icon;
      else {
        const d = page.util.el('span', 'am-dot', f, label.charAt(0).toUpperCase());
        d.style.background = page.scope.hashColor(label);
      }
      page.util.el('span', 'lb', f, label);
      f.title = label;
      page.folders[key] = { el: f, n: page.util.el('span', 'n', f) };
      if (!deco) {
        page.on(f, { view: key });
        page.reg.fixed.set(`f:${key}`, f);
      }
    };
    for (const [key, label, icon, deco] of page.builtins) page.addFolder(key, label, icon, deco);
    page.util.el('div', 'am-flabel', page.side, 'Folders');
    for (const f of page.custom) page.addFolder(f, f, null, false);
    page.sidebarDesign = page.scope.mailSidebar(page.ctx, page.side);
    page.main = page.util.el('div', 'am-main', page.body);
    page.pane = page.util.el('section', 'am-listpane', page.main);
    if (!page.stack) page.pane.style.width = page.listW + 'px';
    page.lhead = page.util.el('div', 'am-lhead', page.pane);
    if (page.sponsorK) page.scope.buildSponsored(page.util, page.pane, page.rng.fork('spons'), page.sponsorK, page.rowH);
    page.lb = page.util.el('div', 'am-lb', page.pane);
    page.lb.style.height = page.spec.rows * page.rowH + 'px';
    page.read = page.util.el('section', 'am-read', page.main);
    if (page.adCol) page.scope.buildAdColumn(page.util, page.main, page.rng.fork('adcol'), page.appH - 50 - page.bannerH - 34);
    page.labels = page.readW >= 600;
    page.status = page.util.el('div', 'am-status', page.app);
    page.modalHost = page.util.el('div', '', page.app);
    page.cbw = page.util.el('span', 'cbw', page.lhead);
    page.all = page.util.el('input', '', page.cbw);
    page.all.type = 'checkbox';
    page.all.title = 'Select all';
    page.all.dataset.role = 'select-all';
    page.all.addEventListener('click', (ev) => {
      ev.stopPropagation();
      const order = page.fam.helpers.listOrder(page.ctx.model, page.spec);
      page.up({ checkAll: !(order.length && order.every((i) => page.ctx.model.checked.includes(i))) });
    });
    page.reg.fixed.set('cball', page.all);
    page.headTitle = page.util.el('b', '', page.lhead);
    page.bulkBar = page.util.el('div', 'am-bulk', page.lhead);
    page.bulkLabels = page.listW >= 620;
    page.bulkOps = [['archive', page.scope.I.archive, 'Archive'], ['trash', page.scope.I.trash, 'Delete'], ['read', page.scope.I.read, 'Mark as read'],
      ['unread', page.scope.I.unread, 'Mark as unread'], ['star', page.scope.I.star, 'Star']];
    for (const [k, icon, label] of page.bulkOps) {
      const b = page.on(page.button('am-tb' + (k === 'trash' ? ' del' : ''), icon, page.bulkLabels ? label.replace('Mark as ', 'Mark ') : '', page.bulkBar, label), { bulk: k });
      if (!page.bulkLabels) b.classList.add('ic');
      page.reg.head.set(`bulk:${k}`, b);
    }
    if (!page.bulkLabels) page.bulkBar.classList.add('am-icons');
  }

  function mountPanes(page) {
    page.cnt = page.util.el('span', 'cnt', page.bulkBar);
    page.range = page.util.el('span', 'rg', page.lhead);
    page.list = null;
    page.lbx = null;
    page.rowEls = {};
    page.listKey = null;
    page.snippet = (e) => {
      const parts = e.body.split('\n\n');
      return (parts[1] || parts[0]).replace(/\s+/g, ' ');
    };
    page.readKey = null;
    page.comp = null;
    page.msgFlags = null;
    page.menuEl = null;
    page.moveBtn = null;
    page.used = page.lr.int(12, 78);
    page.statusKey = null;
    page.modalKey = null;
    page.paint(page.ctx.model);
    page.row0 = page.list && [...page.list.children].find((r) => r.style.height);
    page.shownH = page.row0 ? page.row0.getBoundingClientRect().height : 0;
    page.rowPx = page.shownH && Math.abs(page.shownH - page.rowH) > 0.5 ? page.shownH : page.rowH;
    if (page.rowPx !== page.rowH) page.lb.style.height = page.spec.rows * page.rowPx + 'px';
    page.scope.mailSized(page.ctx, page.lbx);
    if (page.ctx.model.rowPx !== page.rowPx || !!page.ctx.model.stack !== page.stack) {
      page.ctx.update({ ...page.ctx.model, rowPx: page.rowPx, stack: page.stack });
      page.paint(page.ctx.model);
    }
    page.center = (el) => {
      if (!el || !el.isConnected) return null;
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) return null;
      return Object.defineProperty([r.left + r.width / 2, r.top + r.height / 2], 'element', { value: el });
    };
    page.find = (k) => {
      for (const mp of Object.values(page.reg)) if (mp.has(k)) {
        const el = mp.get(k);
        const r = el.isConnected && el.getBoundingClientRect();
        if (r && r.width && r.height) return el;
      }
      return null;
    };
  }

  function interaction(page) {
    return {
      app: page.app,
      sync: (m) => page.paint(m),
      outside(e) {
        if (!page.menuEl || !page.ctx.model.menu) return;
        if (page.menuEl.contains(e.target) || (page.moveBtn && page.moveBtn.contains(e.target))) return;
        page.up({ menu: null });
      },
      locate(t) {
        if (t.row !== undefined) return page.lbx.locateOption(t.row);
        if (t.thumb !== undefined) return page.lbx.locateThumb();
        if (t.scroll !== undefined) return page.lbx.locateThumbFor(t.scroll);
        if (t.list) return page.center(page.list);
        if (t.search) return page.center(page.sInput);
        if (t.rowIcon) return page.center(page.find(`ri:${t.rowIcon[0]}:${t.rowIcon[1]}`));
        if (t.check !== undefined) return page.center(page.find(`cb:${t.check}`));
        if (t.checkAll) return page.center(page.all);
        if (t.bulk) return page.center(page.find(`bulk:${t.bulk}`));
        if (t.folder !== undefined) return page.center(page.find(`f:${t.folder}`));
        if (t.action) return page.center(page.find(`a:${t.action}`));
        if (t.moveTo) return page.center(page.find(`mt:${t.moveTo}`));
        if (t.back) return page.center(page.find('back'));
        if (t.field) return page.center(page.find(`fld:${t.field}`));
        if (t.compose) return page.center(page.find(`c:${t.compose}`));
        if (t.confirm) return page.center(page.find(`cf:${t.confirm}`));
        if (t.toast) return page.center(page.find(`t:${t.toast}`));
        return null;
      },
    };
  }

  function build(ctx, style, scope) {
    const page = { ctx, style, scope };
    page.attBadge = (...args) => attBadge(page, ...args);
    page.buildList = (...args) => buildList(page, ...args);
    page.paintRange = (...args) => paintRange(page, ...args);
    page.paintList = (...args) => paintList(page, ...args);
    page.buildRead = (...args) => buildRead(page, ...args);
    page.setField = (...args) => setField(page, ...args);
    page.paintRead = (...args) => paintRead(page, ...args);
    page.paintStatus = (...args) => paintStatus(page, ...args);
    page.paintModal = (...args) => paintModal(page, ...args);
    page.paint = (...args) => paint(page, ...args);
    mountFrame(page);
    mountSidebar(page);
    mountPanes(page);
    return interaction(page);
  }

  env.template('use-email/_base-modern', () => ({ build }));
})();
