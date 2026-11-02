/* use-desktop-tools/_workspace-tree: Explorer tree, file actions and preview.
 * install(S, BASE) installs the existing design parts and returns the builder; S keeps the live
 * tokens and resolved parts. Each build owns its rendering, painting and input state.
 */
(function () {
  'use strict';
  function install(S, BASE) {
    // ================================================================ tree

    // Parts of the Explorer + preview, called with T = { ctx, util, spec, fam, main, mainR, mode, ex, head, list, pv,
    // crumbs, pbody, rowEls, cache, rowH, commit(m), paint(m), flag(el, key, on), info(p, m, id) }:
    // the first four are set when the part runs after them.
    BASE.explorerHead = (T) => {
      const project = T.ctx.rng.pick(S.PROJECTS);
      const title = S.D.explorerTitle;
      T.util.el('span', '', T.head, title === null ? `Explorer · ${project}` : typeof title === 'function' ? title(project, S) : title);
    };
    BASE.beforeList = () => {};
    BASE.treeList = (T) => T.util.el('div', 'at-tree', T.ex);
    BASE.listBuilt = () => {};
    BASE.previewPane = (T) => {
      const { util } = T;
      T.pv = util.el('div', 'at-preview', T.main);
      T.crumbs = util.el('div', 'at-crumbs', T.pv);
      T.pbody = util.el('div', '', T.pv);
      T.pbody.style.cssText = 'flex: 1; min-height: 0; display: flex; flex-direction: column;';
    };
    BASE.paneBuilt = () => {};
    // Row height: every node fits when it can (the list still scrolls when it cannot).
    BASE.rowHeight = (T) => {
      const listH = T.list.getBoundingClientRect().height - 24;
      const want = Math.min(T.spec.nodes.length, 17);
      return Math.round(S.clamp(Math.floor(listH / Math.max(1, want)), S.D.rowRange[0], S.D.rowRange[1]));
    };
    BASE.rowsLead = () => []; // elements before the first row of the list
    BASE.rowIndent = (T, r) => `${S.D.indent[0] + r.depth * S.D.indent[1]}px`;
    BASE.loadIndent = (T, r, ld) => `${S.D.loadIndent[0] + (r.depth + 1) * S.D.loadIndent[1] + 20}px`;
    BASE.rowStyle = () => {}; // after the row's role and indent are set (r: the row of fam.rows)
    BASE.rowIcons = (T, row, r, open) => {
      row.innerHTML = r.dir ? S.CHEV + S.FOLDER(open) : '<span class="sp"></span>' + S.FILE(r.name);
    };
    BASE.rowName = (T, row, r) => { T.util.el('span', 'nm', row, r.name); };
    BASE.rowBuilt = () => {}; // after the row's icon and name
    BASE.listSwapped = () => {}; // after the list's rows are replaced
    BASE.listPainted = () => {}; // after the scroll position is restored
    BASE.paintPreview = (T, m) => {
      T.crumbs.replaceChildren();
      T.pbody.replaceChildren();
      S.P.previewBody(T, m);
    };
    BASE.previewBody = (T, m) => {
      const last = m.clicks[m.clicks.length - 1];
      if (last === undefined) S.P.previewEmpty(T, m);
      else S.P.previewFile(T, m, last);
    };
    BASE.previewEmpty = (T) => {
      const { util } = T;
      util.el('span', S.D.emptyTitleClass, T.crumbs, S.D.emptyTitle);
      if (S.D.emptyClose !== null) util.el('span', 'at-tabx', T.crumbs, S.D.emptyClose);
      const e = util.el('div', 'at-empty', T.pbody);
      e.innerHTML = S.D.emptyIcon === null ? S.svg(S.ICONS.files) : S.D.emptyIcon;
      if (S.D.emptyHeading !== null) util.el('div', 'at-empty-h', e, S.D.emptyHeading);
      util.el('div', '', e, S.D.emptyHint);
    };
    BASE.backButton = (T) => {
      const b = T.util.el('button', 'at-back', T.pbody, '← Back');
      b.type = 'button';
      b.dataset.role = 'back';
      b.addEventListener('click', () => T.commit(T.fam.treeBack(T.ctx.model, T.spec)));
    };
    BASE.previewFile = (T, m, last) => {
      if (T.spec.recoverable) S.P.backButton(T);
      T.info(T.pbody, m, last);
    };
    BASE.infoCard = () => {}; // after the file / folder card of the preview is built (card, node)
    BASE.viewPx = (T) => T.rowH; // the row height reported to the plan
    BASE.treeLocate = () => undefined; // before the tree's own locate; a point, null or undefined (not handled)

    function buildTree(ctx, main) {
      return build(ctx, main, S);
    }
    return buildTree;
  }
  function paintList(state, m) {
    const R = state.fam.rows(m, state.spec);
    const keep = state.list.scrollTop;
    state.rowEls.clear();
    const order = [...state.P.rowsLead(state.T)];
    for (const r of R) {
      const open = r.dir && state.fam.isOpen(m, r.id);
      const sig = `${r.dir}|${r.depth}|${r.name}|${open}`;
      let row = state.cache.get(r.id);
      if (!row) {
        row = state.util.el('div', 'at-row');
        row.dataset.id = r.id;
        state.cache.set(r.id, row);
      }
      if (row.dataset.sig !== sig) {
        row.dataset.sig = sig;
        row.dataset.role = r.dir ? 'folder' : 'file';
        row.style.paddingLeft = state.P.rowIndent(state.T, r);
        state.P.rowStyle(state.T, row, r);
        state.flag(row, 'open', open);
        state.P.rowIcons(state.T, row, r, open);
        state.P.rowName(state.T, row, r);
        state.P.rowBuilt(state.T, row, r);
      }
      state.flag(row, 'sel', m.sel === r.id || m.clicks.includes(r.id));
      state.rowEls.set(r.id, row);
      order.push(row);
      if (open && !state.fam.isLoaded(m, state.spec, r.id)) {
        let ld = state.cache.get(`ld:${r.id}`);
        if (!ld) {
          ld = state.util.el('div', 'at-row at-loading');
          state.cache.set(`ld:${r.id}`, ld);
        }
        ld.style.paddingLeft = state.P.loadIndent(state.T, r, ld);
        const t0 = (m.loading && m.loading[r.id]) || 0;
        ld.innerHTML = state.SPIN(Math.round(((state.ctx.clock() - t0) / 125) * 45) % 360);
        state.util.el('span', '', ld, 'Loading…');
        order.push(ld);
      }
    }
    if (!R.length) {
      let empty = state.cache.get('empty');
      if (!empty) {
        empty = state.util.el('div', 'at-empty', null, 'This folder is empty.');
        state.cache.set('empty', empty);
      }
      order.push(empty);
    }
    const cur = state.list.children;
    if (cur.length !== order.length || order.some((el, i) => cur[i] !== el)) state.list.replaceChildren(...order);
    state.P.listSwapped(state.T, m);
    state.list.scrollTop = keep;
    state.P.listPainted(state.T, m);
  }

  function info(state, p, m, id) {
    const L = state.fam.live(m, state.spec);
    const n = L.byId.get(id);
    if (!n) return;
    const path = [];
    for (let x = n; x && x.parent !== null; x = L.byId.get(x.parent)) path.unshift(L.byId.get(x.parent).name);
    state.T.crumbs.replaceChildren();
    path.forEach((s) => { state.util.el('span', '', state.T.crumbs, s); state.util.el('span', '', state.T.crumbs, '›'); });
    state.util.el('b', '', state.T.crumbs, n.name);
    const card = state.util.el('div', 'at-card', p);
    card.innerHTML = n.dir ? state.FOLDER(false).replace('class="ico"', '') : state.FILE(n.name, '');
    const txt = state.util.el('div', '', card);
    state.util.el('h3', '', txt, n.name || 'New folder');
    const h = [...n.name].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
    if (n.dir) state.util.el('p', '', txt, `Folder · ${(L.kids.get(id) || []).length} items`);
    else state.util.el('p', '', txt, `${((h % 900) / 10 + 1.2).toFixed(1)} ${h % 3 ? 'KB' : 'MB'} · modified ${1 + (h % 27)} days ago`);
    state.util.el('p', '', txt, `/${path.concat([n.name]).join('/')}`);
    state.P.infoCard(state.T, card, n);
  }

  function mirror(state) {
    const m = state.ctx.model;
    const lr = state.list.getBoundingClientRect();
    const R = state.fam.rows(m, state.spec);
    let first = -1;
    let last = -1;
    R.forEach((r, i) => {
      const el = state.rowEls.get(r.id);
      if (!el) return;
      const b = el.getBoundingClientRect();
      if (b.top >= lr.top - 1 && b.bottom <= lr.bottom + 1) {
        if (first < 0) first = i;
        last = i;
      }
    });
    const v = { first, last, px: state.P.viewPx(state.T) };
    if (!state.same(v, m.view)) state.ctx.update({ ...m, view: v });
  }

  function paint(state, m) {
    state.paintList(m);
    state.P.paintPreview(state.T, m);
    state.mirror();
  }

  function commit(state, m) {
    state.ctx.update(m);
    state.paint(state.ctx.model);
  }

  function buildExplorer(state) {
    ({ util: state.util, spec: state.spec } = state.ctx);
    state.fam = env.taskDef.helpers;
    state.T = { ctx: state.ctx, util: state.util, spec: state.spec, fam: state.fam, main: state.main, mode: state.spec.scenario, mainR: state.main.getBoundingClientRect(), rowEls: new Map(), cache: new Map() };
    state.T.ex = state.util.el('div', 'at-explorer', state.main);
    state.T.ex.style.width = `${Math.round(state.clamp(state.T.mainR.width * 0.47, 230, 360))}px`;
    state.T.head = state.util.el('div', 'at-pane-h', state.T.ex);
    state.P.explorerHead(state.T);
    state.P.beforeList(state.T);
    state.list = state.T.list = state.P.treeList(state.T);
    state.list.tabIndex = 0;
    state.list.dataset.role = 'tree';
    state.P.listBuilt(state.T);
    state.P.previewPane(state.T);
    ({ pbody: state.pbody, rowEls: state.rowEls, cache: state.cache } = state.T);
    state.toast = state.util.el('div', 'at-toast', state.main);
    state.toast.hidden = true;
    state.util.el('span', '', state.toast);
    state.util.el('button', '', state.toast, 'Undo').type = 'button';
    state.util.el('div', 'at-ghost', state.main).hidden = true;
    state.util.el('div', 'at-menu', state.main).hidden = true;
    state.P.paneBuilt(state.T);
    state.rowH = state.T.rowH = state.P.rowHeight(state.T);
    state.list.style.setProperty('--rowh', `${state.rowH}px`);
    state.list.style.setProperty('--rowf', state.rowH >= 25 ? '14px' : '13px');
    state.flag = state.T.flag = (el, k, on) => {
      if (on) el.dataset[k] = '';
      else delete el.dataset[k];
    };
    state.T.info = state.info;
    state.T.mirror = state.mirror;
    state.T.paint = state.paint;
    state.T.commit = state.commit;
    state.list.addEventListener('scroll', () => state.mirror());
    state.list.addEventListener('click', (e) => {
      if (state.isField(e.target)) return;
      const row = e.target.closest('.at-row[data-id]');
      if (!row) return;
      const id = row.dataset.id;
      const m = state.ctx.model;
      const now = state.ctx.clock();
      if (row.dataset.role === 'folder') state.commit({ ...state.fam.toggleFolder(m, state.spec, id, now), sel: id });
      else state.commit(state.fam.treeClickFile(m, state.spec, id));
    });
    state.list.addEventListener('contextmenu', (e) => e.preventDefault());
    state.paint(state.ctx.model);
  }

  function handlers(state) {
    return {
      sync: state.paint,
      onKey(e) {
        if (state.isField(e.target)) return;
        const m = state.ctx.model;
        if (state.spec.keys) {
          if (!/^(ArrowUp|ArrowDown|ArrowLeft|ArrowRight|Home|End|Enter| )$/.test(e.key)) return;
          e.preventDefault();
          state.commit(state.fam.treeKey(m, state.spec, e.key, state.ctx.clock()));
          const r = state.rowEls.get(state.ctx.model.sel);
          if (r) r.scrollIntoView({ block: 'nearest' });
        }
      },
      locate(t) {
        const own = state.P.treeLocate(state.T, t);
        if (own !== undefined) return own;
        const lr = state.list.getBoundingClientRect();
        if (t.node !== undefined) {
          const row = state.rowEls.get(t.node);
          if (!row) return null;
          const rr = row.getBoundingClientRect();
          if (rr.top < lr.top - 1 || rr.bottom > lr.bottom + 1) return null;
          const nm = row.querySelector('.nm') || row;
          return state.hitPoint(nm, [0.5, 0.25, 0.75, 0.1], [0.5]);
        }
        if (t.pane === 'tree') {
          const rows = [...state.rowEls.values()];
          const lastB = rows.length ? rows[rows.length - 1].getBoundingClientRect().bottom : lr.top;
          if (lr.bottom - lastB > 14) return [lr.left + lr.width / 2, (lastB + lr.bottom) / 2];
          return [lr.left + lr.width / 2, lr.top + lr.height / 2];
        }
        if (t.back) return state.hitPoint(state.pbody.querySelector('.at-back'));
        return null;
      },
    };
  }

  function build(ctx, main, scope) {
    const state = {
      ctx, main, clamp: scope.clamp, P: scope.P, SPIN: scope.SPIN, FOLDER: scope.FOLDER,
      FILE: scope.FILE, same: scope.same, isField: scope.isField, hitPoint: scope.hitPoint,
    };
    state.paintList = (m) => paintList(state, m);
    state.info = (p, m, id) => info(state, p, m, id);
    state.mirror = () => mirror(state);
    state.paint = (m) => paint(state, m);
    state.commit = (m) => commit(state, m);
    buildExplorer(state);
    return handlers(state);
  }
  env.template('use-desktop-tools/_workspace-tree', () => ({ install }));
})();
