/* click-control/_controls-navigation: navigation parts of click-control/controls.
 * install(BASE, scopeRef) keeps each part replaceable through the parent's design.parts.
 */
(function () {
  'use strict';

  function tabStrip(scopeRef) {}

  function tabLabel(scopeRef, t) { return t.label; }

  function tabButton(scopeRef) {}

  function tabPanel(scopeRef, ctx, p, t, i, links) { links.push(...scopeRef.P.paragraph(ctx, p, t.words, i, 'div')); }

  function tabsBuilt(scopeRef) {}

  function tabsReady(scopeRef) {}

  function buildTab(scopeRef, ctx, content, up) {
    const { spec, util } = ctx;
    const b = scopeRef.P.box(ctx, content);
    const wrap = util.el('div', 'uc-tabs', b);
    const strip = util.el('div', 'uc-strip', wrap);
    scopeRef.P.tabStrip(ctx, wrap, strip);
    const tabEls = [];
    const panels = [];
    const links = [];
    spec.tabs.forEach((t, i) => {
      const tb = util.el('button', 'uc-tab', strip, scopeRef.P.tabLabel(t, i));
      tb.type = 'button';
      tb.dataset.role = 'tab';
      scopeRef.P.tabButton(ctx, tb, t, i);
      tabEls.push(tb);
      const p = util.el('div', 'uc-tabpanel', wrap);
      scopeRef.P.tabPanel(ctx, p, t, i, links);
      panels.push(p);
    });
    scopeRef.P.tabsBuilt(ctx, wrap, strip, tabEls, panels);
    const tabs = env.ui.tabs(tabEls, panels, { value: ctx.model.active, onChange: (k) => up({ active: k }) });
    scopeRef.P.tabsReady(ctx, wrap, strip);
    const lk = env.ui.buttons(links, { label: 'link', point: scopeRef.linkPoint, history: ctx.model.clicks, onChange: (h) => up({ clicks: h }) });
    return {
      sync(m) { tabs.set(m.active); lk.set(m.clicks); },
      locate(t) {
        if (t.tab !== undefined) return tabs.locate(t.tab);
        if (t.link !== undefined) return lk.locate(t.link);
        return null;
      },
      recover: 'view',
    };
  }

  function menuPrelude(scopeRef, ctx, content) {
    const { util } = ctx;
    const list = util.el('div', 'contact-list', content);
    const heading = util.el('div', 'contact-heading', list);
    util.el('span', 'name-column', heading, 'Name');
    util.el('span', 'email-column', heading, 'Email');
    scopeRef.CONTACTS.forEach((name) => {
      const row = util.el('div', 'contact-row', list);
      row.innerHTML = scopeRef.PERSON;
      util.el('span', '', row, name);
    });
  }

  function menuWrapMade(scopeRef) {}

  function menuTrigger(scopeRef) { return `${scopeRef.HAMBURGER}<span>${scopeRef.D.menuLabel}</span>`; }

  function menuHead(scopeRef) {}

  function menuPanel(scopeRef) {}

  function itemIcon(scopeRef, el, n) { if (scopeRef.spec.mode === 'button') el.innerHTML = scopeRef.icon(n.icon); }

  function caret(scopeRef, el) { return scopeRef.ctxRef.util.el('span', 'car', el, '▶'); }

  function decoys(scopeRef, root, cls, list) {
    const { util } = scopeRef.ctxRef;
    const box = util.el('div', 'menu-xtras ' + cls, root);
    for (const d of list) {
      if (typeof d === 'string') util.el('div', '', box, d);
      else {
        const row = util.el('div', '', box);
        row.innerHTML = scopeRef.icon(d[1]);
        util.el('span', '', row, d[0]);
      }
    }
  }

  function menuBuilt(scopeRef) {}

  function menuSynced(scopeRef) {}

  function buildMenu(scopeRef, ctx, content, up) {
    const { spec, util, rng } = ctx;
    scopeRef.P.menuPrelude(ctx, content);
    const wrap = util.el('div', 'uc-menuwrap', content);
    scopeRef.P.menuWrapMade(ctx, wrap, content);
    let trigger = null;
    if (spec.mode === 'button') {
      trigger = util.el('button', 'uc-btn uc-menubtn', wrap);
      trigger.type = 'button';
      trigger.innerHTML = scopeRef.P.menuTrigger();
    }
    scopeRef.P.menuHead(ctx, wrap, trigger);
    const root = util.el('div', 'uc-mpanel' + (trigger ? '' : ' root-static'), wrap);
    const showKeys = rng.bool(0.6);
  function build(nodes, panel) {
      scopeRef.P.menuPanel(panel, nodes);
      return nodes.map((n) => {
        const row = util.el('div', 'uc-mrow', panel);
        const el = util.el('div', 'uc-mi' + (n.disabled ? ' dis' : ''), row);
        el.dataset.role = 'menuitem';
        scopeRef.P.itemIcon(el, n);
        util.el('span', '', el, n.label);
        const item = { key: n.key, el, disabled: !!n.disabled };
        if (n.children) {
          scopeRef.P.caret(el);
          const sub = util.el('div', 'uc-mpanel', row);
          item.panel = sub;
          item.children = build(n.children, sub);
        } else if (showKeys && n.shortcut) util.el('span', 'sc', el, n.shortcut);
        return item;
      });
    }
    if (scopeRef.D.decoysBefore) scopeRef.P.decoys(root, 'menu-before', scopeRef.D.decoysBefore);
    const items = build(spec.tree, root);
    if (scopeRef.D.decoysAfter) scopeRef.P.decoys(root, 'menu-after', scopeRef.D.decoysAfter);
    scopeRef.P.menuBuilt(ctx, content, wrap, root, items);
    const menu = env.ui.menu(trigger, {
      root: trigger ? root : null,
      items,
      value: ctx.model.path,
      open: spec.openBy,
      hoverDelay: rng.int(200, 450),
      clock: ctx.clock,
      onChange: (path) => up({ path }),
      onSelect: (key) => up({ clicks: ctx.model.clicks.concat([key]) }),
    });
    if (spec.aim) {
      // Menu-aim: the task's tick closes open submenus aimDelay ms after the pointer leaves the menu.
      wrap.addEventListener('pointerleave', () => { if (!ctx.model.out) up({ out: true, outMs: 0 }); });
      wrap.addEventListener('pointerenter', () => { if (ctx.model.out) up({ out: false, outMs: 0 }); });
    }
    return {
      sync(m) { menu.set(m.path); menu.poll(); scopeRef.P.menuSynced(ctx, m); },
      locate(t) {
        if (t.trigger) return menu.locateTrigger();
        if (t.item !== undefined) return menu.locate(t.item);
        return null;
      },
      recover: 'toast',
    };
  }

  function colStart(scopeRef) {}

  function colTitle(scopeRef, ctx, b) { if (scopeRef.D.modTitle != null) ctx.util.el('h2', 'module-title', b, scopeRef.D.modTitle); }

  function colAcc(scopeRef) {}

  function colHeader(scopeRef, ctx, sec, h, s) {
    h.innerHTML = scopeRef.D.chevron;
    ctx.util.el('span', '', h, s.title);
  }

  function colBody(scopeRef, ctx, bd, s, i, links) { links.push(...scopeRef.P.paragraph(ctx, bd, s.words, i, 'div')); }

  function colSection(scopeRef) {}

  function colBuilt(scopeRef) {}

  function colSynced(scopeRef) {}

  function buildCollapsible(scopeRef, ctx, content, up) {
    const { spec, util } = ctx;
    scopeRef.P.colStart(ctx, content);
    const b = scopeRef.P.box(ctx, content);
    scopeRef.P.colTitle(ctx, b);
    const acc = util.el('div', 'uc-acc', b);
    scopeRef.P.colAcc(ctx, content, b, acc);
    const group = {};
    const secs = [];
    const links = [];
    const report = () => up({ open: secs.map((s, i) => (s.get() ? i : -1)).filter((i) => i >= 0) });
    spec.sections.forEach((s, i) => {
      const sec = util.el('div', 'uc-sec', acc);
      const h = util.el('div', 'uc-sec-h', sec);
      h.dataset.role = 'header';
      scopeRef.P.colHeader(ctx, sec, h, s, i);
      const bd = util.el('div', 'uc-sec-b', sec);
      scopeRef.P.colBody(ctx, bd, s, i, links, h);
      secs.push(env.ui.collapsible(h, bd, { open: ctx.model.open.includes(i), group, onChange: report }));
      scopeRef.P.colSection(ctx, sec, h, bd, s, i);
    });
    scopeRef.P.colBuilt(ctx, content, acc);
    const lk = env.ui.buttons(links, { label: 'link', point: scopeRef.linkPoint, history: ctx.model.clicks, onChange: (hist) => up({ clicks: hist }) });
    return {
      sync(m) { secs.forEach((s, i) => s.set(m.open.includes(i))); lk.set(m.clicks); scopeRef.P.colSynced(ctx, m); },
      locate(t) {
        if (t.section !== undefined) return secs[t.section] && secs[t.section].locate();
        if (t.link !== undefined) return lk.locate(t.link);
        return null;
      },
      recover: 'view',
    };
  }

  function install(BASE, scopeRef) {
    BASE.tabStrip = (...args) => tabStrip(scopeRef, ...args);
    BASE.tabLabel = (...args) => tabLabel(scopeRef, ...args);
    BASE.tabButton = (...args) => tabButton(scopeRef, ...args);
    BASE.tabPanel = (...args) => tabPanel(scopeRef, ...args);
    BASE.tabsBuilt = (...args) => tabsBuilt(scopeRef, ...args);
    BASE.tabsReady = (...args) => tabsReady(scopeRef, ...args);
    BASE.buildTab = (...args) => buildTab(scopeRef, ...args);
    BASE.menuPrelude = (...args) => menuPrelude(scopeRef, ...args);
    BASE.menuWrapMade = (...args) => menuWrapMade(scopeRef, ...args);
    BASE.menuTrigger = (...args) => menuTrigger(scopeRef, ...args);
    BASE.menuHead = (...args) => menuHead(scopeRef, ...args);
    BASE.menuPanel = (...args) => menuPanel(scopeRef, ...args);
    BASE.itemIcon = (...args) => itemIcon(scopeRef, ...args);
    BASE.caret = (...args) => caret(scopeRef, ...args);
    BASE.decoys = (...args) => decoys(scopeRef, ...args);
    BASE.menuBuilt = (...args) => menuBuilt(scopeRef, ...args);
    BASE.menuSynced = (...args) => menuSynced(scopeRef, ...args);
    BASE.buildMenu = (...args) => buildMenu(scopeRef, ...args);
    BASE.colStart = (...args) => colStart(scopeRef, ...args);
    BASE.colTitle = (...args) => colTitle(scopeRef, ...args);
    BASE.colAcc = (...args) => colAcc(scopeRef, ...args);
    BASE.colHeader = (...args) => colHeader(scopeRef, ...args);
    BASE.colBody = (...args) => colBody(scopeRef, ...args);
    BASE.colSection = (...args) => colSection(scopeRef, ...args);
    BASE.colBuilt = (...args) => colBuilt(scopeRef, ...args);
    BASE.colSynced = (...args) => colSynced(scopeRef, ...args);
    BASE.buildCollapsible = (...args) => buildCollapsible(scopeRef, ...args);
  }

  env.template('click-control/_controls-navigation', () => ({ install }));
})();
