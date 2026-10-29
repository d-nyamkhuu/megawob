/* click-control/_base-navigation: navigation units of the base template.
 * scopeRef is the live reference scope; reference.js retains their design.parts keys and overrides.
 */
(function () {
  'use strict';

  const CSS_HIDDEN = `
      .uc-nav.uc-hnav { position: relative; z-index: 12; }
      .uc-hnav .uc-navlinks { align-self: stretch; gap: 2px; overflow: visible; color: var(--fg); }
      .uc-htop { position: relative; display: flex; align-items: center; padding: 0 11px; cursor: default; white-space: nowrap; }
      .uc-htop .lbl { display: inline-flex; align-items: center; gap: 5px; height: 30px; padding: 0 2px; border-bottom: 2px solid transparent; }
      .uc-htop .lbl svg { width: 11px; height: 11px; transform: rotate(90deg); opacity: .6; }
      .uc-htop[data-open] .lbl { color: var(--accent); border-bottom-color: var(--accent); }
      .uc-hdrop { position: absolute; top: 100%; left: 0; z-index: 13; display: flex; gap: 26px; padding: 14px 18px 12px;
        border: 1px solid var(--line); border-radius: 0 0 9px 9px; background: var(--panel); box-shadow: 0 14px 30px rgba(0,0,0,.16); }
      .uc-hdrop[hidden] { display: none !important; }
      .uc-hcol { display: flex; flex-direction: column; min-width: 140px; }
      .uc-hcol .ttl { font-size: 11.5px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: var(--muted); margin: 0 0 6px 8px; }
      .uc-hlink { display: flex; align-items: center; height: 30px; padding: 0 8px; border-radius: 5px; font-size: 14px; cursor: pointer; }
      .uc-hlink:hover { background: color-mix(in srgb, var(--accent) 11%, var(--panel)); color: var(--accent); }
      .uc-hero { max-width: 760px; padding: 18px 22px; border: 1px solid var(--line); border-radius: 10px;
        background: linear-gradient(120deg, color-mix(in srgb, var(--accent) 10%, var(--panel)), var(--panel)); }
      .uc-hero h2 { margin: 0 0 8px; font-size: 22px; }
      .uc-hero p { margin: 0; color: var(--muted); line-height: 1.55; font-size: 14.5px; }
      .uc-feats { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; max-width: 760px; margin-top: 14px; }
      .uc-feat { padding: 12px 14px; border: 1px solid var(--line); border-radius: 9px; font-size: 13.5px; color: var(--muted); line-height: 1.45; }
      .uc-feat b { display: block; margin-bottom: 4px; color: var(--fg); font-size: 14px; }

      .uc-shopbar { display: flex; align-items: center; gap: 14px; flex-wrap: nowrap; padding: 0 0 12px; border-bottom: 1px solid var(--line); }
      .uc-flywrap { position: relative; flex: none; }
      .uc-flytrig { display: inline-flex; align-items: center; gap: 8px; height: 36px; padding: 0 14px; border-radius: 7px; cursor: pointer;
        font-weight: 600; font-size: 14px; color: #fff; background: color-mix(in srgb, var(--accent) 85%, #000); border: 0; }
      .uc-flytrig svg { width: 15px; height: 15px; }
      .uc-flytrig[aria-expanded="true"] { border-radius: 7px 7px 0 0; }
      .uc-flywrap > .uc-mpanel { top: 100%; left: 0; border-radius: 0 7px 7px 7px; min-width: 196px; }
      .uc-flywrap .uc-mpanel { min-width: 176px; }
      .uc-flywrap .uc-mrow > .uc-mpanel { left: 100%; }
      .uc-shoplinks { display: flex; gap: 16px; font-size: 14px; color: var(--muted); white-space: nowrap; overflow: hidden; }
      .uc-shopsearch { flex: 1; min-width: 120px; max-width: 360px; height: 34px; border-radius: 17px; border: 1px solid var(--line);
        display: flex; align-items: center; padding: 0 14px; color: var(--muted); font-size: 13.5px; }
      .uc-prods { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 12px; margin-top: 14px; max-width: 820px; }
      .uc-prod { border: 1px solid var(--line); border-radius: 9px; padding: 10px; font-size: 13px; color: var(--muted); }
      .uc-prod i { display: block; height: 70px; margin-bottom: 8px; border-radius: 6px; background: color-mix(in srgb, var(--fg) 7%, var(--panel)); }
      .uc-prod b { display: block; color: var(--fg); font-weight: 600; margin-bottom: 2px; }

      .uc-rr tr[data-menu] td { background: color-mix(in srgb, var(--accent) 6%, var(--panel)); }
      .uc-rr tr[data-menu] .uc-acts { visibility: visible; }
      .uc-rr .uc-more { width: 30px; padding: 0; font-size: 17px; font-weight: 700; letter-spacing: 1px; }
      .uc-rmenu { position: absolute; z-index: 25; min-width: 176px; padding: 4px; border: 1px solid var(--line); border-radius: 7px;
        background: var(--panel); box-shadow: 0 10px 28px rgba(0,0,0,.2); font-size: 13.5px; }
      .uc-rmenu[hidden] { display: none; }
      .uc-rmenu .ce { height: 28px; display: flex; align-items: center; padding: 0 12px; border-radius: 4px; cursor: pointer; white-space: nowrap; }
      .uc-rmenu .ce:hover { background: color-mix(in srgb, var(--accent) 13%, var(--panel)); }
      .uc-rmenu .ce.danger { color: #d6336c; }
      .uc-rmenu .hr { height: 1px; margin: 4px 6px; background: var(--line); }
      `;

  function buildHoverMenu(scopeRef, ctx, content, up, page) {
    const { spec, util, rng } = ctx;
    scopeRef.ensureStyle('uc-style-hidden', scopeRef.CSS_HIDDEN);
    const nav = page.querySelector('.uc-nav');
    nav.classList.add('uc-hnav');
    const links = nav.querySelector('.uc-navlinks');
    links.textContent = '';
    const search = nav.querySelector('.uc-search');
    if (search && spec.tops.length > 4) search.remove();
    const tops = {};
    const leaves = {};
    for (const t of spec.tops) {
      const wrap = util.el('div', 'uc-htop', links);
      wrap.dataset.role = 'navitem';
      const lbl = util.el('span', 'lbl', wrap);
      util.el('span', '', lbl, t.label);
      lbl.insertAdjacentHTML('beforeend', scopeRef.CHEVRON);
      const drop = util.el('div', 'uc-hdrop', wrap);
      drop.dataset.role = 'menu';
      for (const g of t.groups) {
        const col = util.el('div', 'uc-hcol', drop);
        util.el('div', 'ttl', col, g.title);
        for (const it of g.items) {
          const a = util.el('div', 'uc-hlink', col, it.label);
          a.dataset.role = 'menuitem';
          a.addEventListener('click', (e) => {
            if (e.button !== 0 || ctx.model.open !== t.key) return;
            scopeRef.env.log('select', { what: 'nav', key: it.key });
            up({ clicks: ctx.model.clicks.concat([it.key]), open: null, out: false, outMs: 0 });
          });
          leaves[it.key] = a;
        }
      }
      wrap.addEventListener('pointerenter', () => {
        if (ctx.model.open !== t.key || ctx.model.out) up({ open: t.key, out: false, outMs: 0 });
      });
      wrap.addEventListener('pointerleave', () => {
        if (ctx.model.open === t.key && !ctx.model.out) up({ out: true, outMs: 0 });
      });
      tops[t.key] = { wrap, lbl, drop };
    }
    // Keep each dropdown inside the page: measure it once (layout is deterministic) and shift it left when needed.
    const pr = page.getBoundingClientRect();
    for (const t of spec.tops) {
      const { drop } = tops[t.key];
      drop.hidden = false;
      const r = drop.getBoundingClientRect();
      const over = r.right - (pr.right - 10);
      if (over > 0) drop.style.left = -Math.ceil(over) + 'px';
      drop.hidden = true;
    }
    const [h2, p] = rng.pick(scopeRef.HERO);
    const hero = util.el('div', 'uc-hero', content);
    util.el('h2', '', hero, h2);
    util.el('p', '', hero, p);
    const feats = util.el('div', 'uc-feats', content);
    for (const [b, d] of rng.sample(scopeRef.FEATS, 3)) {
      const f = util.el('div', 'uc-feat', feats);
      util.el('b', '', f, b);
      f.append(d);
    }
    return {
      sync(m) {
        for (const t of spec.tops) {
          const { wrap, drop } = tops[t.key];
          drop.hidden = m.open !== t.key;
          if (m.open === t.key) wrap.setAttribute('data-open', 'true');
          else wrap.removeAttribute('data-open');
        }
      },
      locate(tg) {
        if (tg.top !== undefined) return scopeRef.env.util.center(tops[tg.top].lbl);
        if (tg.nav !== undefined) {
          const el = leaves[tg.nav];
          return el && el.offsetParent ? scopeRef.env.util.center(el) : null;
        }
        return null;
      },
      recover: 'view',
    };
  }

  function buildFlyout(scopeRef, ctx, content, up, page) {
    const { spec, util, rng } = ctx;
    scopeRef.ensureStyle('uc-style-hidden', scopeRef.CSS_HIDDEN);
    const side = page.querySelector('.uc-side');
    if (side) side.remove(); // the flyout needs the page width (up to four panels side by side)
    const bar = util.el('div', 'uc-shopbar', content);
    const wrap = util.el('div', 'uc-flywrap', bar);
    const trig = util.el('button', 'uc-flytrig', wrap);
    trig.type = 'button';
    trig.innerHTML = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M2.5 4h11M2.5 8h11M2.5 12h11"/></svg>';
    util.el('span', '', trig, spec.trigger);
    const root = util.el('div', 'uc-mpanel', wrap);
    util.el('div', 'uc-shopsearch', bar, rng.pick(['Search the store', 'What are you looking for?', 'Search products']));
    const sl = util.el('div', 'uc-shoplinks', bar);
    for (const l of rng.sample(scopeRef.SHOP_LINKS, 3)) util.el('span', '', sl, l);
    const grid = util.el('div', 'uc-prods', content);
    for (const name of rng.sample(scopeRef.PRODUCTS, 8)) {
      const c = util.el('div', 'uc-prod', grid);
      util.el('i', '', c);
      util.el('b', '', c, name);
      c.append(`$${rng.int(6, 89)}.${rng.pick(['00', '50', '99'])}`);
    }
    function build(nodes, panel) {
      return nodes.map((n) => {
        const row = util.el('div', 'uc-mrow', panel);
        const el = util.el('div', 'uc-mi', row);
        el.dataset.role = 'menuitem';
        util.el('span', '', el, n.label);
        const item = { key: n.key, el };
        if (n.children) {
          util.el('span', 'car', el, '▶');
          const sub = util.el('div', 'uc-mpanel', row);
          item.panel = sub;
          item.children = build(n.children, sub);
        }
        return item;
      });
    }
    const items = build(spec.tree, root);
    // A submenu that would run past the bottom of the page moves up (measured when it opens).
    const show = (panel, vis) => {
      panel.hidden = !vis;
      if (!vis || panel === root) return;
      panel.style.top = '-5px';
      const lim = page.getBoundingClientRect().bottom - 10;
      const over = panel.getBoundingClientRect().bottom - lim;
      if (over > 0) panel.style.top = -5 - Math.ceil(over) + 'px';
    };
    const menu = scopeRef.env.ui.menu(null, {
      root, items, value: ctx.model.path, open: 'hover', hoverDelay: spec.hoverDelay, clock: ctx.clock, show,
      label: 'categories',
      onChange: (path) => up({ path: ctx.model.path === null && path && !path.length ? null : path }),
      onSelect: (key) => up({ clicks: ctx.model.clicks.concat([key]), path: null }),
    });
    // by 'clue': a click on a category picks it (task flyPick); hovering it still opens its sub-categories.
    // The capture listener runs before the kit menu's click handler, which would only open the submenu.
    const each = (list, fn) => list.forEach((it) => { fn(it); if (it.children) each(it.children, fn); });
    each(items, (it) => {
      if (!it.children || !scopeRef.fam().helpers.flyPick(spec, it.key)) return;
      it.el.addEventListener('click', (e) => {
        if (e.button !== 0 || !menu.visible(it.key)) return;
        e.stopImmediatePropagation();
        up({ clicks: ctx.model.clicks.concat([it.key]), path: null });
      }, true);
    });
    const open = () => {
      if (ctx.model.path === null || ctx.model.out) up({ path: ctx.model.path === null ? [] : ctx.model.path, out: false, outMs: 0 });
    };
    trig.addEventListener('pointerenter', open);
    trig.addEventListener('click', (e) => { if (e.button === 0) open(); });
    wrap.addEventListener('pointerenter', () => { if (ctx.model.out) up({ out: false, outMs: 0 }); });
    wrap.addEventListener('pointerleave', () => { if (ctx.model.path !== null && !ctx.model.out) up({ out: true, outMs: 0 }); });
    // A press outside the trigger and the open panels closes the whole menu (the kit's root-less menu only
    // collapses to the root panel).
    const onDown = (ev) => {
      if (!page.isConnected) { document.removeEventListener('pointerdown', onDown, true); return; }
      if (ctx.model.path === null || wrap.contains(ev.target) || scopeRef.fromNotice(ev)) return;
      up({ path: null, out: false, outMs: 0 });
    };
    document.addEventListener('pointerdown', onDown, true);
    return {
      sync(m) {
        menu.set(m.path);
        menu.poll();
        trig.setAttribute('aria-expanded', String(m.path !== null));
      },
      locate(t) {
        if (t.trigger) return scopeRef.env.util.center(trig);
        if (t.item !== undefined) return menu.locate(t.item);
        return null;
      },
      recover: 'toast',
    };
  }

  function buildRowReveal(scopeRef, ctx, content, up, page) {
    const { spec, util, rng } = ctx;
    scopeRef.ensureStyle('uc-style-hidden', scopeRef.CSS_HIDDEN);
    const b = scopeRef.box(ctx, content, { top: true });
    const r = content.getBoundingClientRect();
    const rowH = Math.max(28, Math.min(40, Math.floor((r.height - 36) / spec.rows.length)));
    const table = util.el('table', 'uc-table uc-rows uc-rr', b);
    table.style.setProperty('--rowh', rowH + 'px');
    table.style.width = Math.min(720, Math.floor(r.width)) + 'px';
    const head = util.el('tr', '', table);
    spec.columns.forEach((c) => util.el('th', '', head, c));
    util.el('th', '', head, '');
    const icons = spec.style === 'icons';
    const trs = {};
    const quick = {};
    const mores = {};
    for (const row of spec.rows) {
      const tr = util.el('tr', '', table);
      tr.dataset.role = 'row';
      row.cells.forEach((c, i) => {
        const td = util.el('td', '', tr, c);
        if (i) td.style.color = 'var(--muted)';
        if (i === 0) { td.style.maxWidth = '260px'; td.style.overflow = 'hidden'; td.style.textOverflow = 'ellipsis'; }
      });
      const td = util.el('td', '', tr);
      td.style.width = `${spec.quick.length * (icons ? 32 : 76) + 38}px`;
      const acts = util.el('div', 'uc-acts', td);
      for (const a of spec.quick) {
        const el = util.el('button', 'uc-act' + (icons ? ' icononly' : ''), acts);
        el.type = 'button';
        if (icons) { el.innerHTML = scopeRef.icon(a.icon); el.setAttribute('aria-label', a.label); el.title = a.label; } else el.textContent = a.label;
        const key = `${row.key}|${a.key}`;
        el.addEventListener('click', (e) => {
          if (e.button !== 0) return;
          scopeRef.env.log('select', { what: 'row-action', key });
          up({ clicks: ctx.model.clicks.concat([key]), menuFor: null });
        });
        quick[key] = el;
      }
      const more = util.el('button', 'uc-act uc-more', acts, '⋯');
      more.type = 'button';
      more.setAttribute('aria-label', spec.moreLabel);
      more.title = spec.moreLabel;
      more.addEventListener('click', (e) => {
        if (e.button !== 0) return;
        scopeRef.env.log(ctx.model.menuFor === row.key ? 'close' : 'open', { what: 'row-menu', key: row.key });
        up({ menuFor: ctx.model.menuFor === row.key ? null : row.key, hover: row.key });
      });
      mores[row.key] = more;
      tr.addEventListener('pointerenter', () => { if (ctx.model.hover !== row.key) up({ hover: row.key }); });
      tr.addEventListener('pointerleave', () => { if (ctx.model.hover === row.key) up({ hover: null }); });
      trs[row.key] = tr;
    }
    const menu = util.el('div', 'uc-rmenu', page);
    menu.dataset.role = 'menu';
    menu.hidden = true;
    const entries = {};
    const danger = (l) => /delete|remove|trash|suspend|reset password/i.test(l);
    // Destructive entries go last, under a separator (the task's order otherwise).
    const order = spec.more.filter((a) => !danger(a.label)).concat(spec.more.filter((a) => danger(a.label)));
    order.forEach((a, i) => {
      if (i && danger(a.label) && !danger(order[i - 1].label)) util.el('div', 'hr', menu);
      const e = util.el('div', 'ce' + (danger(a.label) ? ' danger' : ''), menu, a.label);
      e.dataset.role = 'menuitem';
      e.addEventListener('click', (ev) => {
        if (ev.button !== 0 || ctx.model.menuFor === null) return;
        const key = `${ctx.model.menuFor}|${a.key}`;
        scopeRef.env.log('select', { what: 'row-menu', key });
        up({ clicks: ctx.model.clicks.concat([key]), menuFor: null });
      });
      entries[a.key] = e;
    });
    const onDown = (ev) => {
      if (!page.isConnected) { document.removeEventListener('pointerdown', onDown, true); return; }
      if (ctx.model.menuFor === null || menu.contains(ev.target) || mores[ctx.model.menuFor].contains(ev.target) || scopeRef.fromNotice(ev)) return;
      up({ menuFor: null });
    };
    document.addEventListener('pointerdown', onDown, true);
    const done = rng.pick(['Done', 'Updated', 'Applied']);
    function place(m) {
      if (m.menuFor === null) { menu.hidden = true; return; }
      menu.hidden = false;
      const pr = page.getBoundingClientRect();
      const br = mores[m.menuFor].getBoundingClientRect();
      const mw = menu.offsetWidth;
      const mh = menu.offsetHeight;
      let x = br.right - pr.left - mw;
      let y = br.bottom - pr.top + 4;
      if (y + mh > pr.height - 8) y = br.top - pr.top - mh - 4;
      x = Math.max(6, Math.min(pr.width - mw - 6, x));
      menu.style.left = Math.round(x) + 'px';
      menu.style.top = Math.round(Math.max(6, y)) + 'px';
    }
    return {
      sync(m) {
        for (const row of spec.rows) {
          const tr = trs[row.key];
          if (m.hover === row.key) tr.setAttribute('data-hover', 'true');
          else tr.removeAttribute('data-hover');
          if (m.menuFor === row.key) tr.setAttribute('data-menu', 'true');
          else tr.removeAttribute('data-menu');
          const hit = m.clicks.find((k) => k.startsWith(`${row.key}|`));
          tr.classList.toggle('dead', !!hit && /delete|remove|trash|suspend|archive/.test(hit));
          const first = tr.firstChild;
          let badge = first.querySelector('.uc-badge');
          if (hit && !badge) badge = util.el('span', 'uc-badge', first);
          if (badge) {
            if (hit) {
              const a = spec.quick.concat(spec.more).find((x) => `${row.key}|${x.key}` === hit);
              badge.textContent = a ? (scopeRef.PAST[a.label] || done) : done;
            } else badge.remove();
          }
        }
        place(m);
      },
      locate(t) {
        if (t.row !== undefined) return scopeRef.env.util.center(trs[t.row].firstChild);
        if (t.more !== undefined) return scopeRef.env.util.center(mores[t.more]);
        if (t.action !== undefined) return scopeRef.env.util.center(quick[`${t.action[0]}|${t.action[1]}`]);
        if (t.mentry !== undefined) return menu.hidden ? null : scopeRef.env.util.center(entries[t.mentry]);
        return null;
      },
      recover: 'toast',
    };
  }

  function initialize(scopeRef, set, __has, __parts) {
    set('CSS_HIDDEN', __has('CSS_HIDDEN') ? __parts['CSS_HIDDEN'](undefined, scopeRef) : (CSS_HIDDEN));
    set('HERO', __has('HERO') ? __parts['HERO'](undefined, scopeRef) : ([['Plan, track and ship together', 'One workspace for your team: projects, documents and conversations in one place.'],
        ['Everything your team needs', 'Bring your work together and keep every project moving, from the first idea to launch day.'],
        ['Work faster with fewer tools', 'Replace scattered spreadsheets and chat threads with one shared, searchable home.'],
        ['Built for growing teams', 'Start free, invite your colleagues and add more as you grow. No setup required.']]));
    set('FEATS', __has('FEATS') ? __parts['FEATS'](undefined, scopeRef) : ([['Shared boards', 'See who is doing what at a glance.'], ['Smart reminders', 'Never miss a due date again.'],
        ['Reports', 'Weekly summaries delivered to your inbox.'], ['Templates', 'Start from proven setups.'],
        ['Guest access', 'Invite clients without extra seats.'], ['Offline mode', 'Keep working on the go.']]));
    set('PRODUCTS', __has('PRODUCTS') ? __parts['PRODUCTS'](undefined, scopeRef) : (['Weekend pack', 'Trail lantern', 'Desk organizer', 'Cotton throw', 'Travel mug', 'Kids kite', 'Pocket notebook',
        'Ceramic bowl', 'Garden gloves', 'Wireless buds', 'Yoga block', 'Linen napkins']));
    set('SHOP_LINKS', __has('SHOP_LINKS') ? __parts['SHOP_LINKS'](undefined, scopeRef) : (["Today's deals", 'Gift ideas', 'New in', 'Customer service', 'Sell with us', 'Registry']));
  }

  env.template('click-control/_base-navigation', () => ({ functions: { buildHoverMenu, buildFlyout, buildRowReveal }, initialize }));
})();
