/* click-control/_base-records: records units of the base template.
 * scopeRef is the live reference scope; reference.js retains their design.parts keys and overrides.
 */
(function () {
  'use strict';

  function tooltip(scopeRef, ctx, page) {
    const tip = ctx.util.el('div', 'uc-tip', page);
    tip.dataset.role = 'tooltip';
    tip.hidden = true;
    return {
      show(el, text) {
        if (!el) { tip.hidden = true; return; }
        tip.textContent = text;
        tip.hidden = false;
        const pr = page.getBoundingClientRect();
        const r = el.getBoundingClientRect();
        const tw = tip.offsetWidth;
        const th = tip.offsetHeight;
        let x = r.left - pr.left + r.width / 2 - tw / 2;
        x = Math.max(6, Math.min(pr.width - tw - 6, x));
        let y = r.top - pr.top - th - 7;
        if (y < 4) y = r.bottom - pr.top + 7;
        tip.style.left = Math.round(x) + 'px';
        tip.style.top = Math.round(y) + 'px';
      },
      hide() { tip.hidden = true; },
    };
  }

  function buildTooltip(scopeRef, ctx, content, up, page) {
    const { spec, util, rng } = ctx;
    const b = scopeRef.box(ctx, content, { top: spec.mode === 'id' });
    const tip = scopeRef.tooltip(ctx, page);
    const hoverIn = (k) => { if (ctx.model.hover !== k) up({ hover: k, hoverMs: 0, tip: null }); };
    const hoverOut = (k) => { if (ctx.model.hover === k) up({ hover: null, hoverMs: 0, tip: null }); };
    if (spec.mode === 'icon') {
      const bar = util.el('div', 'uc-tools', b);
      const els = {};
      spec.tools.forEach((t, i) => {
        if (i && rng.bool(0.18)) util.el('span', 'sep', bar).style.cssText = 'width:1px;height:22px;align-self:center;background:var(--line);margin:0 3px';
        const el = util.el('button', 'uc-tool', bar);
        el.type = 'button';
        el.innerHTML = scopeRef.icon(t.icon);
        el.setAttribute('aria-label', t.tip);
        el.dataset.key = t.key;
        el.addEventListener('pointerenter', () => hoverIn(t.key));
        el.addEventListener('pointerleave', () => hoverOut(t.key));
        els[t.key] = el;
      });
      const doc = util.el('div', 'uc-doc', b);
      doc.innerHTML = `<b>${rng.pick(['Untitled document', 'Meeting notes', 'Project brief', 'Weekly update', 'Draft reply'])}</b>`;
      const lines = util.el('div', '', doc);
      for (let i = 0; i < 4; i++) util.el('div', 'uc-vline', lines).style.width = `${rng.int(55, 100)}%`;
      doc.style.width = '520px';
      doc.style.maxWidth = '100%';
      const tools = scopeRef.env.ui.buttons(spec.tools.map((t) => els[t.key]), { label: 'tool', history: ctx.model.clicks,
        onChange: (h) => up({ clicks: h }) });
      return {
        sync(m) {
          tools.set(m.clicks);
          const t = m.tip !== null ? spec.tools.find((x) => x.key === m.tip) : null;
          if (t && m.hover === m.tip) tip.show(els[t.key], t.tip);
          else tip.hide();
        },
        locate: (t) => (t.tool !== undefined ? tools.locate(t.tool) : null),
        recover: 'toast',
      };
    }
    // mode 'id': duplicate names, the ID shows in a tooltip over the name.
    const r = content.getBoundingClientRect();
    const rowH = Math.max(28, Math.min(38, Math.floor((r.height - 40) / spec.rows.length)));
    const table = util.el('table', 'uc-table', b);
    table.style.setProperty('--rowh', rowH + 'px');
    table.style.width = Math.min(640, Math.floor(r.width)) + 'px';
    table.innerHTML = '<tr><th>Name</th><th>Office</th><th></th></tr>';
    const names = {};
    const acts = {};
    const infoIcons = rng.bool(0.5);
    for (const row of spec.rows) {
      const tr = util.el('tr', '', table);
      const td = util.el('td', '', tr);
      const nm = util.el('span', 'uc-idname', td, row.name);
      nm.dataset.role = 'tip';
      const inf = util.el('span', 'uc-idinfo', td);
      inf.innerHTML = scopeRef.icon('info');
      inf.style.display = infoIcons ? '' : 'none';
      [nm, inf].forEach((el) => {
        el.addEventListener('pointerenter', () => hoverIn(row.key));
        el.addEventListener('pointerleave', (e) => {
          if (e.relatedTarget && (e.relatedTarget === nm || e.relatedTarget === inf || nm.contains(e.relatedTarget))) return;
          hoverOut(row.key);
        });
      });
      names[row.key] = nm;
      util.el('td', '', tr, row.meta).style.color = 'var(--muted)';
      const tdA = util.el('td', '', tr);
      tdA.style.textAlign = 'right';
      const a = util.el('button', 'uc-act', tdA, spec.action);
      a.type = 'button';
      a.dataset.key = row.key;
      acts[row.key] = a;
    }
    const ab = scopeRef.env.ui.buttons(spec.rows.map((x) => acts[x.key]), { label: 'row-action', history: ctx.model.clicks,
      onChange: (h) => up({ clicks: h }) });
    return {
      sync(m) {
        ab.set(m.clicks);
        const row = m.tip !== null ? spec.rows.find((x) => x.key === m.tip) : null;
        if (row && m.hover === m.tip) tip.show(names[row.key], `${spec.idLabel} ${row.id} · ${row.meta}`);
        else tip.hide();
        for (const x of spec.rows) acts[x.key].closest('tr').classList.toggle('dead', m.clicks.includes(x.key));
      },
      locate(t) {
        if (t.tip !== undefined) return scopeRef.env.util.center(names[t.tip]);
        if (t.act !== undefined) return ab.locate(t.act);
        return null;
      },
      recover: 'toast',
    };
  }

  function buildRows(scopeRef, ctx, content, up) {
    const { spec, util, rng } = ctx;
    const b = scopeRef.box(ctx, content, { top: true });
    const r = content.getBoundingClientRect();
    const rowH = Math.max(28, Math.min(40, Math.floor((r.height - 36) / spec.rows.length)));
    const table = util.el('table', 'uc-table uc-rows', b);
    table.style.setProperty('--rowh', rowH + 'px');
    table.style.width = Math.min(720, Math.floor(r.width)) + 'px';
    const head = util.el('tr', '', table);
    spec.columns.forEach((c) => util.el('th', '', head, c));
    util.el('th', '', head, '');
    const trs = {};
    const actEls = [];
    const actKeys = [];
    const icons = spec.style === 'icons';
    for (const row of spec.rows) {
      const tr = util.el('tr', '', table);
      tr.dataset.role = 'row';
      row.cells.forEach((c, i) => {
        const td = util.el('td', '', tr, c);
        if (i) td.style.color = 'var(--muted)';
        if (i === 0) { td.style.maxWidth = '260px'; td.style.overflow = 'hidden'; td.style.textOverflow = 'ellipsis'; }
      });
      const td = util.el('td', '', tr);
      td.style.width = `${spec.actions.length * (icons ? 32 : 76)}px`;
      const wrap = util.el('div', 'uc-acts', td);
      for (const a of spec.actions) {
        const el = util.el('button', 'uc-act' + (icons ? ' icononly' : ''), wrap);
        el.type = 'button';
        if (icons) { el.innerHTML = scopeRef.icon(a.icon); el.title = a.label; el.setAttribute('aria-label', a.label); }
        else el.textContent = a.label;
        actEls.push(el);
        actKeys.push(`${row.key}|${a.key}`);
      }
      tr.addEventListener('pointerenter', () => { if (ctx.model.hover !== row.key) up({ hover: row.key }); });
      tr.addEventListener('pointerleave', () => { if (ctx.model.hover === row.key) up({ hover: null }); });
      trs[row.key] = tr;
    }
    const acts = scopeRef.env.ui.buttons(actEls, { keys: actKeys, label: 'row-action', history: ctx.model.clicks, onChange: (h) => up({ clicks: h }) });
    const done = rng.pick(['Done', 'Updated', 'Applied']);
    function sync(m) {
      acts.set(m.clicks);
      for (const row of spec.rows) {
        const tr = trs[row.key];
        if (m.hover === row.key) tr.setAttribute('data-hover', 'true');
        else tr.removeAttribute('data-hover');
        const hit = m.clicks.find((k) => k.startsWith(`${row.key}|`));
        tr.classList.toggle('dead', !!hit && /delete|remove|archive/.test(hit));
        const first = tr.firstChild;
        let badge = first.querySelector('.uc-badge');
        if (hit && !badge) badge = util.el('span', 'uc-badge', first);
        if (badge) {
          if (hit) {
            const a = spec.actions.find((x) => `${row.key}|${x.key}` === hit);
            badge.textContent = a ? (scopeRef.PAST[a.label] || done) : done;
          } else badge.remove();
        }
      }
    }
    return {
      sync,
      locate(t) {
        if (t.row !== undefined) return scopeRef.env.util.center(trs[t.row].firstChild);
        if (t.action !== undefined) return acts.locate(`${t.action[0]}|${t.action[1]}`);
        return null;
      },
      recover: 'toast',
    };
  }

  function fileView(scopeRef, ctx, parent, items, layout, avail) {
    const { util } = ctx;
    const els = {};
    let host;
    if (layout === 'list') {
      host = util.el('div', 'uc-card', parent);
      host.style.padding = '6px';
      host.style.width = Math.min(560, avail.w) + 'px';
      host.style.boxSizing = 'border-box';
      const rh = Math.max(24, Math.min(34, Math.floor((avail.h - 20) / items.length)));
      for (const it of items) {
        const row = util.el('div', 'uc-frow', host);
        row.style.height = rh + 'px';
        row.innerHTML = scopeRef.fileIcon(it.kind);
        util.el('span', 'nm', row, it.name);
        util.el('span', 'sz', row, it.size);
        row.dataset.role = 'file';
        els[it.key] = row;
      }
    } else {
      host = util.el('div', 'uc-files', parent);
      const tw = 104;
      const cols = Math.max(3, Math.min(7, Math.floor((Math.min(avail.w, 760) + 8) / (tw + 8))));
      host.style.gridTemplateColumns = `repeat(${cols}, ${tw}px)`;
      for (const it of items) {
        const t = util.el('div', 'uc-ftile', host);
        t.innerHTML = scopeRef.fileIcon(it.kind);
        util.el('span', 'nm', t, it.name);
        t.dataset.role = 'file';
        t.title = it.name;
        els[it.key] = t;
      }
    }
    return { els, host };
  }

  function chooseLayout(scopeRef, spec, avail) {
    if (spec.layout === 'list' && spec.items.length * 24 + 24 <= avail.h) return 'list';
    return 'grid';
  }

  function buildContext(scopeRef, ctx, content, up, page) {
    const { spec, util, rng } = ctx;
    const r = content.getBoundingClientRect();
    const avail = { w: Math.floor(r.width), h: Math.floor(r.height) };
    util.el('div', 'uc-hint', content, rng.pick(['Right-click a file for more options.', 'Tip: right-click items for actions.', `${spec.items.length} items`])).style.margin = '0 0 8px';
    const b = scopeRef.box(ctx, content, { top: true });
    const { els } = scopeRef.fileView(ctx, b, spec.items, scopeRef.chooseLayout(spec, { w: avail.w, h: avail.h - 30 }), { w: avail.w, h: avail.h - 30 });
    let sel = null;
    let at = null; // page-local point of the last right-click
    const menu = util.el('div', 'uc-cmenu', page);
    menu.dataset.role = 'contextmenu';
    menu.hidden = true;
    const entries = {};
    for (const a of spec.actions) {
      if (a.sep) util.el('div', 'hr', menu);
      const e = util.el('div', 'ce' + (a.disabled ? ' dis' : ''), menu, a.label);
      e.dataset.role = 'menuitem';
      e.addEventListener('click', (ev) => {
        if (ev.button !== 0 || a.disabled || ctx.model.menuFor === null) { scopeRef.env.log('disabled', { what: 'context', key: a.key }); return; }
        scopeRef.env.log('select', { what: 'context', key: a.key });
        up({ clicks: ctx.model.clicks.concat([`${ctx.model.menuFor}|${a.key}`]), menuFor: null });
      });
      entries[a.key] = e;
    }
    const pr = () => page.getBoundingClientRect();
    for (const it of spec.items) {
      const el = els[it.key];
      el.addEventListener('click', (ev) => { if (ev.button === 0) { sel = it.key; paintSel(); } });
      el.addEventListener('contextmenu', (ev) => {
        const p = pr();
        at = [ev.clientX - p.left, ev.clientY - p.top];
        sel = it.key;
        paintSel();
        scopeRef.env.log('open', { what: 'context', key: it.key });
        up({ menuFor: it.key });
      });
    }
    // A press outside the open menu closes it (a right-click on another item reopens it there).
    const onDown = (ev) => {
      if (!page.isConnected) { document.removeEventListener('pointerdown', onDown, true); return; }
      if (ctx.model.menuFor === null || menu.contains(ev.target) || scopeRef.fromNotice(ev)) return;
      up({ menuFor: null });
    };
    document.addEventListener('pointerdown', onDown, true);
    function paintSel() { for (const it of spec.items) { if (sel === it.key) els[it.key].setAttribute('data-sel', 'true'); else els[it.key].removeAttribute('data-sel'); } }
    function sync(m) {
      if (m.menuFor === null) { menu.hidden = true; return; }
      menu.hidden = false;
      const p = pr();
      let [x, y] = at || (() => {
        const er = els[m.menuFor].getBoundingClientRect();
        return [er.left - p.left + er.width * 0.6, er.top - p.top + er.height * 0.6];
      })();
      const mw = menu.offsetWidth;
      const mh = menu.offsetHeight;
      if (x + mw > p.width - 6) x = Math.max(6, x - mw);
      if (y + mh > p.height - 6) y = Math.max(6, p.height - mh - 6);
      menu.style.left = Math.round(x) + 'px';
      menu.style.top = Math.round(y) + 'px';
    }
    return {
      sync(m) { if (m.menuFor === null) at = null; sync(m); },
      locate(t) {
        if (t.item2 !== undefined) return scopeRef.env.util.center(els[t.item2]);
        if (t.centry !== undefined) return menu.hidden ? null : scopeRef.env.util.center(entries[t.centry]);
        return null;
      },
      recover: 'toast',
    };
  }

  function buildOpen(scopeRef, ctx, content, up) {
    const { spec, util, rng } = ctx;
    const r = content.getBoundingClientRect();
    const bar = util.el('div', 'uc-toolbar', content);
    const openBtn = util.el('button', 'uc-btn primary', bar, rng.pick(['Open', 'Open', 'View']));
    openBtn.type = 'button';
    for (const l of rng.sample(['New folder', 'Upload', 'Share', 'Sort'], 2)) util.el('button', 'uc-btn', bar, l).type = 'button';
    const avail = { w: Math.floor(r.width), h: Math.floor(r.height) - 50 };
    const b = scopeRef.box(ctx, content, { top: true });
    const { els } = scopeRef.fileView(ctx, b, spec.items, scopeRef.chooseLayout(spec, avail), avail);
    // Viewer over the content area: the opened item, with a Back link.
    const viewer = util.el('div', 'uc-viewer', content);
    viewer.hidden = true;
    const vh = util.el('div', 'uc-vhead', viewer);
    const back = util.el('span', 'uc-back', vh, rng.pick(['← Back', '‹ All files', '← Documents']));
    back.dataset.role = 'back';
    const vname = util.el('span', '', vh);
    const vbody = util.el('div', 'uc-vbody', viewer);
    for (const it of spec.items) {
      const el = els[it.key];
      el.addEventListener('click', (ev) => { if (ev.button === 0 && ctx.model.sel !== it.key) up({ sel: it.key }); });
      el.addEventListener('dblclick', () => {
        scopeRef.env.log('open', { what: 'file', key: it.key });
        up({ sel: it.key, clicks: ctx.model.clicks.concat([it.key]) });
      });
    }
    openBtn.addEventListener('click', () => {
      if (ctx.model.sel === null) { scopeRef.env.log('disabled', { what: 'open' }); return; }
      up({ clicks: ctx.model.clicks.concat([ctx.model.sel]) });
    });
    back.addEventListener('click', () => {
      const F = scopeRef.fam();
      if (F.helpers.pending(ctx.model, spec)) up(F.helpers.undoModel(ctx.model, spec));
      else up({ clicks: [] });
    });
    let shown = null;
    function sync(m) {
      for (const it of spec.items) { if (m.sel === it.key) els[it.key].setAttribute('data-sel', 'true'); else els[it.key].removeAttribute('data-sel'); }
      openBtn.classList.toggle('dis', m.sel === null);
      const last = m.clicks.length ? m.clicks[m.clicks.length - 1] : null;
      viewer.hidden = last === null;
      if (last !== null && shown !== last) {
        shown = last;
        const it = spec.items.find((x) => x.key === last);
        vname.textContent = it ? it.name : '';
        vbody.replaceChildren();
        if (it && it.kind === 'folder') {
          const vr = ctx.rng.fork(`v${last}`);
          for (let i = 0; i < 4; i++) {
            const row = util.el('div', 'uc-frow', vbody);
            row.style.height = '28px';
            row.innerHTML = scopeRef.fileIcon('pdf');
            util.el('span', 'nm', row, scopeRef.env.content.fileName ? scopeRef.env.content.fileName(vr) : `file-${i}`);
          }
        } else {
          util.el('div', '', vbody, it ? `${it.size} · ${String(it.kind).toUpperCase()}` : '');
          for (let i = 0; i < 6; i++) util.el('div', 'uc-vline', vbody).style.width = `${50 + ((i * 37) % 50)}%`;
        }
      }
      if (last === null) shown = null;
    }
    sync(ctx.model);
    return {
      sync,
      locate(t) {
        if (t.item2 !== undefined) return viewer.hidden ? scopeRef.env.util.center(els[t.item2]) : null;
        if (t.openbtn) return scopeRef.env.util.center(openBtn);
        if (t.undo) return viewer.hidden ? null : scopeRef.env.util.center(back);
        return null;
      },
      recover: null, // the viewer's Back link is the way back
    };
  }

  function initialize(scopeRef, set, __has, __parts) {

  }

  env.template('click-control/_base-records', () => ({ functions: { tooltip, buildTooltip, buildRows, fileView, chooseLayout, buildContext, buildOpen }, initialize }));
})();
