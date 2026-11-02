/* click-control/_base-desktop: desktop units of the base template.
 * scopeRef is the live reference scope; reference.js retains their design.parts keys and overrides.
 */
(function () {
  'use strict';

  /*
   * reference / click-control / desktop: the same mechanics (env.ui primitives) in a desktop-app window with a
   * title bar, a horizontal menubar and a status bar, to show that layout and look are the widget's choice.
   * The window's size and position inside the stage are sampled.
   *   tab          a vertical tab rail on the left (orientation 'vertical')
   *   menu         'bar': the menubar itself is the root menu, dropdowns open downward and deeper
   *                submenus to the right; 'button': a "Menu" button at the right end of the toolbar, the
   *                dropdown is right-aligned and submenus open to the LEFT. Submenus open on click only
   *                (traits.menuOpen = ['click'])
   *   collapsible  a grid of cards with +/- toggles; any number may be open (no accordion)
   *   pie          a marking menu: press anywhere on the canvas, round item bubbles appear around the press
   *                point (clamped inside the canvas) counter-clockwise from 9 o'clock; click or drag-release
   *                on an item
   *   dialog       a bottom sheet with full-width buttons rising over a dimmed window body
   *   context      desktop icons in columns (top to bottom, like a file manager's icon view); right-click
   *                opens a context menu
   *   open         the same icon view; double-click opens the item in an inner document window with a
   *                "Back" button (or select + the toolbar Open button)
   * Recoverable mode: the Undo toast sits above the status bar; links / opened files show a Back view.
   */

  const CSS2 = `
      .ud-win { position: absolute; display: flex; flex-direction: column; overflow: hidden; border-radius: 12px;
        border: 1px solid color-mix(in srgb, var(--fg) 25%, var(--line)); background: var(--bg);
        box-shadow: 0 22px 60px rgba(0,0,0,.22), 0 2px 8px rgba(0,0,0,.08); font-size: 14px; }
      .ud-title { flex: none; position: relative; display: flex; align-items: center; justify-content: center; height: 34px;
        background: color-mix(in srgb, var(--fg) 10%, var(--panel)); font-weight: 600; font-size: 13px; color: var(--muted); white-space: nowrap; }
      .ud-dots { position: absolute; left: 14px; top: 11px; display: flex; gap: 8px; }
      .ud-dots i { width: 12px; height: 12px; border-radius: 50%; background: #ff5f57; }
      .ud-dots i:nth-child(2) { background: #febc2e; } .ud-dots i:nth-child(3) { background: #28c840; }
      .ud-bar { flex: none; position: relative; z-index: 6; display: flex; align-items: stretch; height: 32px; padding: 0 6px;
        border-bottom: 1px solid var(--line); background: var(--panel); }
      .ud-bar .deco { display: flex; align-items: center; padding: 0 10px; color: var(--muted); }
      .ud-tools { margin-left: auto; display: flex; align-items: center; gap: 6px; position: relative; }
      .ud-body { flex: 1; min-height: 0; position: relative; display: flex; }
      .ud-status { flex: none; display: flex; gap: 18px; align-items: center; height: 26px; padding: 0 12px; font-size: 12px;
        color: var(--muted); border-top: 1px solid var(--line); background: var(--panel); }
      .ud-pane { flex: 1; min-width: 0; padding: 16px 20px; position: relative; }
      .ud-btn { height: 28px; padding: 0 12px; border-radius: 4px; border: 1px solid color-mix(in srgb, var(--fg) 25%, var(--line));
        background: linear-gradient(var(--panel), color-mix(in srgb, var(--fg) 6%, var(--panel))); color: var(--fg); font: inherit; font-size: 13px; cursor: pointer; }
      .ud-btn.accent { background: var(--accent); color: #fff; border-color: var(--accent); }
      .ud-btn.dis { opacity: .5; }

      .ud-mtop { display: flex; align-items: center; gap: 6px; height: 100%; padding: 0 12px; cursor: default; white-space: nowrap; }
      .ud-mtop[data-open], .ud-mtop[data-active] { background: var(--accent); color: #fff; }
      .ud-mtop svg, .ud-mi svg { width: 15px; height: 15px; flex: none; }
      .ud-mwrap { position: relative; display: flex; }
      .ud-drop { position: absolute; z-index: 7; min-width: 160px; padding: 4px 0; background: var(--panel);
        border: 1px solid color-mix(in srgb, var(--fg) 30%, var(--line)); box-shadow: 2px 4px 14px rgba(0,0,0,.25); }
      .ud-drop[hidden] { display: none !important; }
      .ud-mwrap > .ud-drop { top: 100%; left: 0; }
      .ud-mrow { position: relative; }
      .ud-mrow > .ud-drop { top: -5px; left: 100%; }
      .ud-left .ud-mrow > .ud-drop { left: auto; right: 100%; }
      .ud-tools > .ud-drop { top: calc(100% + 2px); right: 0; }
      .ud-mi { display: flex; align-items: center; gap: 8px; height: 27px; padding: 0 14px 0 12px; white-space: nowrap; cursor: default; }
      .ud-mi .car { margin-left: auto; padding-left: 16px; font-size: 10px; }
      .ud-mi .sc { margin-left: auto; padding-left: 20px; font-size: 12px; opacity: .7; }
      .ud-left .ud-mi .car { order: -1; margin-left: 0; padding: 0 6px 0 0; }
      .ud-mi[data-active], .ud-mi[data-open] { background: var(--accent); color: #fff; }
      .ud-mi.dis { opacity: .45; }
      .ud-mi.dis[data-active] { background: transparent; color: inherit; }

      .ud-rail { flex: none; width: 172px; padding: 10px 0; border-right: 1px solid var(--line); background: color-mix(in srgb, var(--fg) 4%, var(--panel)); overflow: hidden; }
      .ud-vtab { display: block; width: 100%; height: 36px; padding: 0 16px; text-align: left; border: 0; border-left: 3px solid transparent;
        background: transparent; color: var(--muted); font: inherit; cursor: pointer; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .ud-vtab[data-active] { border-left-color: var(--accent); color: var(--fg); font-weight: 700; background: var(--panel); }
      .ud-vpanel { max-width: 560px; line-height: 1.7; font-size: 14.5px; }
      .ud-vpanel[hidden] { display: none; }
      .ud-vpanel h4 { margin: 0 0 8px; font-size: 18px; }

      .ud-grid { display: grid; gap: 12px; align-items: start; }
      .ud-card { border: 1px solid var(--line); border-radius: 10px; background: var(--panel); overflow: hidden; }
      .ud-card-h { display: flex; align-items: center; justify-content: space-between; gap: 8px; min-height: 42px; padding: 7px 14px;
        box-sizing: border-box; font-weight: 650; cursor: pointer; line-height: 1.3; }
      .ud-pm { flex: none; width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
        background: color-mix(in srgb, var(--accent) 14%, var(--panel)); color: var(--accent); font-weight: 700; }
      .ud-pm::after { content: '+'; }
      .ud-card-h[aria-expanded="true"] .ud-pm::after { content: '\\2212'; }
      .ud-card-b { padding: 0 14px 10px; line-height: 1.55; font-size: 13.5px; }
      .ud-card-b[hidden] { display: none; }

      .ud-canvas { position: relative; height: 100%; border: 2px dashed color-mix(in srgb, var(--fg) 20%, var(--line)); border-radius: 10px;
        background: color-mix(in srgb, var(--fg) 3%, var(--panel)); overflow: hidden; touch-action: none; }
      .ud-canvas .msg { position: absolute; left: 0; right: 0; top: 14px; text-align: center; color: var(--muted); }
      .ud-ring { position: absolute; width: 0; height: 0; }
      .ud-ring[hidden] { display: none; }
      .ud-hub { position: absolute; left: -7px; top: -7px; width: 14px; height: 14px; border-radius: 50%; background: var(--fg); }
      .ud-bub { position: absolute; width: 46px; height: 46px; margin: -23px 0 0 -23px; border-radius: 50%; display: flex; align-items: center;
        justify-content: center; font-weight: 800; font-size: 17px; color: var(--fg); background: var(--panel);
        border: 2px solid color-mix(in srgb, var(--fg) 35%, var(--line)); box-shadow: 0 3px 10px rgba(0,0,0,.18); }
      .ud-bub[data-active] { background: var(--accent); color: #fff; border-color: var(--accent); }

      .ud-list { width: 100%; max-width: 640px; }
      .ud-list div { display: flex; justify-content: space-between; height: 32px; align-items: center; padding: 0 10px; border-bottom: 1px solid var(--line); }
      .ud-shade { position: absolute; inset: 0; z-index: 8; background: rgba(0,0,0,.38); }
      .ud-shade[hidden], .ud-sheet[hidden] { display: none; }
      .ud-sheet { position: absolute; z-index: 9; bottom: 0; border-radius: 16px 16px 0 0; background: var(--panel); padding: 10px 22px 16px;
        box-shadow: 0 -10px 30px rgba(0,0,0,.25); }
      .ud-grab { width: 44px; height: 5px; border-radius: 3px; margin: 0 auto 10px; background: color-mix(in srgb, var(--fg) 20%, var(--panel)); }
      .ud-sheet-h { display: flex; align-items: center; font-size: 17px; font-weight: 700; }
      .ud-x { margin-left: auto; flex: none; width: 32px; height: 32px; border-radius: 50%; border: 0; font: inherit; font-size: 18px; cursor: pointer;
        background: color-mix(in srgb, var(--fg) 8%, var(--panel)); color: var(--fg); }
      .ud-sheet p { margin: 8px 0 12px; color: var(--muted); line-height: 1.45; }
      .ud-sheet .ud-big { display: block; width: 100%; height: 38px; margin-top: 7px; border-radius: 8px; font-size: 15px; font-weight: 600; }

      .ud-desk { position: relative; height: 100%; display: grid; grid-auto-flow: column; justify-content: start; align-content: start; gap: 6px 10px;
        padding: 4px; }
      .ud-icon { width: 96px; display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 6px 2px; border-radius: 6px;
        font-size: 12px; text-align: center; cursor: default; user-select: none; }
      .ud-icon .nm { padding: 1px 4px; border-radius: 3px; }
      .ud-icon[data-sel] .nm { background: var(--accent); color: #fff; }
      .ud-icon[data-sel] svg { filter: brightness(.85); }
      .ud-cm { position: absolute; z-index: 25; min-width: 180px; padding: 3px 0; border: 1px solid color-mix(in srgb, var(--fg) 30%, var(--line));
        background: var(--panel); box-shadow: 2px 5px 16px rgba(0,0,0,.28); font-size: 13px; }
      .ud-cm[hidden] { display: none; }
      .ud-cm .ce { height: 24px; display: flex; align-items: center; padding: 0 22px; cursor: default; white-space: nowrap; }
      .ud-cm .ce:hover { background: var(--accent); color: #fff; }
      .ud-cm .ce.dis { opacity: .45; }
      .ud-cm .ce.dis:hover { background: transparent; color: inherit; }
      .ud-cm .hr { height: 1px; margin: 3px 0; background: var(--line); }
      .ud-docwin { position: absolute; inset: 14px 24px; z-index: 20; display: flex; flex-direction: column; border-radius: 9px; overflow: hidden;
        border: 1px solid color-mix(in srgb, var(--fg) 30%, var(--line)); background: var(--panel); box-shadow: 0 14px 40px rgba(0,0,0,.3); }
      .ud-docwin[hidden] { display: none; }
      .ud-dochead { flex: none; display: flex; align-items: center; gap: 12px; height: 34px; padding: 0 10px;
        background: color-mix(in srgb, var(--fg) 8%, var(--panel)); font-weight: 600; font-size: 13px; }
      .ud-docbody { flex: 1; padding: 14px 18px; overflow: hidden; color: var(--muted); }
      `;

  function window2(scopeRef, ctx) {
    const { util, rng } = ctx;
    const W = ctx.size.width;
    const H = ctx.size.height;
    const win = util.el('div', 'ud-win', ctx.stage);
    const ww = Math.round(Math.min(W - 24, Math.max(Math.min(760, W - 24), W * rng.float(0.8, 0.96))));
    const wh = Math.round(H - 2 * rng.int(10, 18));
    const fx = rng.pick([0.1, 0.5, 0.5, 0.9]);
    win.style.width = ww + 'px';
    win.style.height = wh + 'px';
    win.style.left = Math.round(12 + fx * Math.max(0, W - 24 - ww)) + 'px';
    win.style.top = Math.round((H - wh) / 2) + 'px';
    const title = util.el('div', 'ud-title', win, rng.pick(['Workbench', 'Notebook', 'Inspector', 'Organizer', 'Finder', 'Explorer']) + ' — ' + scopeRef.TITLES[ctx.spec.scenario]);
    title.insertAdjacentHTML('afterbegin', '<span class="ud-dots"><i></i><i></i><i></i></span>');
    const bar = util.el('div', 'ud-bar', win);
    const body = util.el('div', 'ud-body', win);
    const status = util.el('div', 'ud-status', win);
    util.el('span', '', status, 'Ready');
    util.el('span', '', status, `${rng.int(2, 40)} items`);
    util.el('span', '', status, 'UTF-8');
    return { win, bar, body };
  }

  function dTab(scopeRef, ctx, w, up) {
    const { spec, util } = ctx;
    scopeRef.decoMenus(ctx, w.bar);
    const rail = util.el('div', 'ud-rail', w.body);
    const pane = util.el('div', 'ud-pane', w.body);
    const tabEls = [];
    const panels = [];
    let links = [];
    const r = w.body.getBoundingClientRect();
    const th = Math.max(26, Math.min(36, Math.floor((r.height - 20) / spec.tabs.length)));
    spec.tabs.forEach((t, i) => {
      const b = util.el('button', 'ud-vtab', rail, t.label);
      b.type = 'button';
      b.style.height = th + 'px';
      tabEls.push(b);
      const p = util.el('div', 'ud-vpanel', pane);
      util.el('h4', '', p, t.label);
      links = links.concat(scopeRef.paragraph(ctx, p, t.words, i, 'div'));
      panels.push(p);
    });
    const tabs = scopeRef.env.ui.tabs(tabEls, panels, { value: ctx.model.active, orientation: 'vertical', onChange: (k) => up({ active: k }) });
    const lk = scopeRef.env.ui.buttons(links, { label: 'link', point: scopeRef.linkPoint, history: ctx.model.clicks, onChange: (h) => up({ clicks: h }) });
    return {
      sync(m) { tabs.set(m.active); lk.set(m.clicks); },
      locate: (t) => (t.tab !== undefined ? tabs.locate(t.tab) : t.link !== undefined ? lk.locate(t.link) : null),
      recover: 'view',
      area: pane,
    };
  }

  function dMenu(scopeRef, ctx, w, up) {
    const { spec, util } = ctx;
    const pane = util.el('div', 'ud-pane', w.body);
    util.el('div', '', pane, spec.mode === 'bar' ? 'Pick a person from the menubar.' : 'Use the Menu button in the toolbar.').style.color = 'var(--muted)';
    let trigger = null;
    let root = null;
    const build = (nodes, panel, top) => nodes.map((n) => {
      const row = util.el('div', top ? 'ud-mwrap' : 'ud-mrow', panel);
      const el = util.el('div', (top ? 'ud-mtop' : 'ud-mi') + (n.disabled ? ' dis' : ''), row);
      if (spec.mode === 'button') el.innerHTML = scopeRef.icon(n.icon);
      util.el('span', '', el, n.label);
      const item = { key: n.key, el, disabled: !!n.disabled };
      if (n.children) {
        if (!top) util.el('span', 'car', el, spec.mode === 'button' ? '◀' : '▶');
        item.panel = util.el('div', 'ud-drop', row);
        item.children = build(n.children, item.panel, false);
      } else if (!top && n.shortcut && spec.mode === 'button') util.el('span', 'sc', el, n.shortcut);
      return item;
    });
    let items;
    if (spec.mode === 'bar') {
      items = build(spec.tree, w.bar, true);
    } else {
      for (const l of ['File', 'Edit', 'View']) util.el('div', 'deco', w.bar, l);
      const tools = util.el('div', 'ud-tools', w.bar);
      trigger = util.el('button', 'ud-btn', tools, 'Menu');
      trigger.type = 'button';
      root = util.el('div', 'ud-drop ud-left', tools);
      items = build(spec.tree, root, false);
    }
    const menu = scopeRef.env.ui.menu(trigger, {
      root,
      items,
      value: ctx.model.path,
      open: 'click',
      onChange: (path) => up({ path }),
      onSelect: (key) => up({ clicks: ctx.model.clicks.concat([key]) }),
    });
    return {
      sync(m) { menu.set(m.path); },
      locate: (t) => (t.trigger ? menu.locateTrigger() : t.item !== undefined ? menu.locate(t.item) : null),
      recover: 'toast',
    };
  }

  function dCollapsible(scopeRef, ctx, w, up) {
    const { spec, util } = ctx;
    scopeRef.decoMenus(ctx, w.bar);
    const pane = util.el('div', 'ud-pane', w.body);
    const grid = util.el('div', 'ud-grid', pane);
    const r = w.body.getBoundingClientRect();
    const cols = spec.sections.length > 4 ? 3 : 2;
    const cw = Math.min(330, Math.floor((r.width - 40 - (cols - 1) * 12) / cols));
    grid.style.gridTemplateColumns = `repeat(${cols}, ${cw}px)`;
    const secs = [];
    let links = [];
    const report = () => up({ open: secs.map((s, i) => (s.get() ? i : -1)).filter((i) => i >= 0) });
    spec.sections.forEach((s, i) => {
      const card = util.el('div', 'ud-card', grid);
      const h = util.el('div', 'ud-card-h', card);
      util.el('span', '', h, s.title);
      util.el('span', 'ud-pm', h);
      const b = util.el('div', 'ud-card-b', card);
      links = links.concat(scopeRef.paragraph(ctx, b, s.words, i, 'div'));
      secs.push(scopeRef.env.ui.collapsible(h, b, { open: ctx.model.open.includes(i), onChange: report }));
    });
    const lk = scopeRef.env.ui.buttons(links, { label: 'link', point: scopeRef.linkPoint, history: ctx.model.clicks, onChange: (h) => up({ clicks: h }) });
    return {
      sync(m) { secs.forEach((s, i) => s.set(m.open.includes(i))); lk.set(m.clicks); },
      locate: (t) => (t.section !== undefined ? secs[t.section] && secs[t.section].locate() : t.link !== undefined ? lk.locate(t.link) : null),
      recover: 'view',
      area: pane,
    };
  }

  function dPie(scopeRef, ctx, w, up) {
    const { spec, util, rng } = ctx;
    scopeRef.decoMenus(ctx, w.bar);
    const pane = util.el('div', 'ud-pane', w.body);
    const canvas = util.el('div', 'ud-canvas', pane);
    util.el('div', 'msg', canvas, 'Press anywhere on the canvas to open the radial menu');
    const ring = util.el('div', 'ud-ring', canvas);
    util.el('div', 'ud-hub', ring);
    const n = spec.items.length;
    const R = n > 8 ? rng.int(100, 112) : rng.int(78, 92);
    const start = -90;
    const bubs = spec.items.map((label, i) => {
      const a = ((start - i * (360 / n)) * Math.PI) / 180;
      const d = util.el('div', 'ud-bub', ring, label);
      d.style.left = (R * Math.sin(a)).toFixed(1) + 'px';
      d.style.top = (-R * Math.cos(a)).toFixed(1) + 'px';
      return d;
    });
    const margin = R + 30;
    const pie = scopeRef.env.ui.pieMenu(canvas, {
      items: spec.items,
      slices: bubs,
      panel: ring,
      start,
      dir: -1,
      inner: 22,
      outer: R + 34,
      constrain([x, y]) {
        const r = canvas.getBoundingClientRect();
        return [scopeRef.env.util.clamp(x, r.left + margin, r.right - margin), scopeRef.env.util.clamp(y, r.top + margin, r.bottom - margin)];
      },
      openAt() {
        const r = canvas.getBoundingClientRect();
        return [r.left + r.width * 0.42, r.top + r.height * 0.55];
      },
      onChange: (open) => up({ open }),
      onSelect: (k) => up({ clicks: ctx.model.clicks.concat([k]) }),
    });
    pie.set(ctx.model.open);
    return {
      sync(m) { pie.set(m.open); },
      locate: (t) => (t.pie ? pie.locateOpen() : t.slice !== undefined ? pie.locate(t.slice) : null),
      recover: 'toast',
    };
  }

  function dDialog(scopeRef, ctx, w, up) {
    const { spec, util, rng } = ctx;
    const tools = scopeRef.decoMenus(ctx, w.bar);
    let opener = null;
    if (spec.opener) {
      opener = util.el('button', 'ud-btn accent', tools, spec.opener);
      opener.type = 'button';
    }
    util.el('button', 'ud-btn', tools, 'Refresh').type = 'button';
    const pane = util.el('div', 'ud-pane', w.body);
    const list = util.el('div', 'ud-list', pane);
    for (let i = 0; i < 6; i++) {
      const row = util.el('div', '', list);
      util.el('span', '', row, `${rng.pick(['Quarterly', 'Team', 'Draft', 'Archive', 'Client', 'Travel', 'Hiring'])} ${rng.pick(['notes', 'budget', 'roadmap', 'photos', 'contract', 'plans'])}`);
      util.el('span', '', row, `${rng.int(1, 30)} files`).style.color = 'var(--muted)';
    }
    const shade = util.el('div', 'ud-shade', w.body);
    const sheet = util.el('div', 'ud-sheet', w.body);
    const r = w.body.getBoundingClientRect();
    const sw = Math.min(520, r.width - 40);
    sheet.style.width = sw + 'px';
    sheet.style.left = Math.round(rng.float(0.1, 0.9) * (r.width - sw)) + 'px';
    util.el('div', 'ud-grab', sheet);
    const head = util.el('div', 'ud-sheet-h', sheet);
    util.el('span', '', head, spec.title);
    const x = util.el('button', 'ud-x', head, '×');
    x.type = 'button';
    util.el('p', '', sheet, spec.text);
    const btns = spec.buttons.slice().reverse().map((l, i) => {
      const b = util.el('button', 'ud-btn ud-big' + (i === 0 ? ' accent' : ''), sheet, l);
      b.type = 'button';
      return [l, b];
    });
    const dlg = scopeRef.env.ui.dialog(sheet, {
      open: ctx.model.open,
      opener: opener || [],
      close: x,
      closeResult: 'x',
      buttons: btns,
      backdrop: shade,
      onChange: (open, result) => up(result ? { open, clicks: ctx.model.clicks.concat([result]) } : { open }),
    });
    return {
      sync(m) { dlg.set(m.open); },
      locate: (t) => (t.opener ? dlg.locateOpener() : t.dialog !== undefined ? dlg.locate(t.dialog) : null),
      recover: 'toast',
    };
  }

  function deskIcons(scopeRef, ctx, pane, items) {
    const { util } = ctx;
    const desk = util.el('div', 'ud-desk', pane);
    const r = pane.getBoundingClientRect();
    const rows = Math.max(2, Math.floor((r.height - 36) / 110));
    desk.style.gridTemplateRows = `repeat(${rows}, 104px)`;
    const els = {};
    for (const it of items) {
      const d = util.el('div', 'ud-icon', desk);
      d.innerHTML = scopeRef.fileIcon(it.kind);
      util.el('span', 'nm', d, it.name);
      d.title = it.name;
      d.dataset.role = 'file';
      els[it.key] = d;
    }
    return els;
  }

  function dContext(scopeRef, ctx, w, up) {
    const { spec, util } = ctx;
    scopeRef.decoMenus(ctx, w.bar);
    const pane = util.el('div', 'ud-pane', w.body);
    const els = scopeRef.deskIcons(ctx, pane, spec.items);
    const menu = util.el('div', 'ud-cm', w.body);
    menu.hidden = true;
    const entries = {};
    for (const a of spec.actions) {
      if (a.sep) util.el('div', 'hr', menu);
      const e = util.el('div', 'ce' + (a.disabled ? ' dis' : ''), menu, a.label);
      e.addEventListener('click', (ev) => {
        if (ev.button !== 0 || a.disabled || ctx.model.menuFor === null) return;
        up({ clicks: ctx.model.clicks.concat([`${ctx.model.menuFor}|${a.key}`]), menuFor: null });
      });
      entries[a.key] = e;
    }
    let sel = null;
    let at = null;
    const paint = () => { for (const it of spec.items) { if (sel === it.key) els[it.key].setAttribute('data-sel', 'true'); else els[it.key].removeAttribute('data-sel'); } };
    for (const it of spec.items) {
      els[it.key].addEventListener('click', (ev) => { if (ev.button === 0) { sel = it.key; paint(); } });
      els[it.key].addEventListener('contextmenu', (ev) => {
        const br = w.body.getBoundingClientRect();
        at = [ev.clientX - br.left + 2, ev.clientY - br.top + 2];
        sel = it.key;
        paint();
        up({ menuFor: it.key });
      });
    }
    const onDown = (ev) => {
      if (!w.body.isConnected) { document.removeEventListener('pointerdown', onDown, true); return; }
      if (ctx.model.menuFor === null || menu.contains(ev.target) || scopeRef.fromNotice(ev)) return;
      up({ menuFor: null });
    };
    document.addEventListener('pointerdown', onDown, true);
    function sync(m) {
      if (m.menuFor === null) { menu.hidden = true; at = null; return; }
      menu.hidden = false;
      const br = w.body.getBoundingClientRect();
      let [x, y] = at || (() => { const er = els[m.menuFor].getBoundingClientRect(); return [er.left - br.left + er.width / 2, er.top - br.top + er.height / 2]; })();
      if (x + menu.offsetWidth > br.width - 4) x = Math.max(4, x - menu.offsetWidth);
      if (y + menu.offsetHeight > br.height - 4) y = Math.max(4, br.height - menu.offsetHeight - 4);
      menu.style.left = Math.round(x) + 'px';
      menu.style.top = Math.round(y) + 'px';
    }
    return {
      sync,
      locate(t) {
        if (t.item2 !== undefined) return scopeRef.env.util.center(els[t.item2]);
        if (t.centry !== undefined) return menu.hidden ? null : scopeRef.env.util.center(entries[t.centry]);
        return null;
      },
      recover: 'toast',
    };
  }

  function dOpen(scopeRef, ctx, w, up) {
    const { spec, util, rng } = ctx;
    const tools = scopeRef.decoMenus(ctx, w.bar);
    const openBtn = util.el('button', 'ud-btn accent', tools, 'Open');
    openBtn.type = 'button';
    const pane = util.el('div', 'ud-pane', w.body);
    const els = scopeRef.deskIcons(ctx, pane, spec.items);
    const win = util.el('div', 'ud-docwin', w.body);
    win.hidden = true;
    const head = util.el('div', 'ud-dochead', win);
    const back = util.el('button', 'ud-btn', head, rng.pick(['◀ Back', 'Close', '← Back']));
    back.type = 'button';
    const name = util.el('span', '', head);
    const body = util.el('div', 'ud-docbody', win);
    for (const it of spec.items) {
      els[it.key].addEventListener('click', (ev) => { if (ev.button === 0 && ctx.model.sel !== it.key) up({ sel: it.key }); });
      els[it.key].addEventListener('dblclick', () => up({ sel: it.key, clicks: ctx.model.clicks.concat([it.key]) }));
    }
    openBtn.addEventListener('click', () => { if (ctx.model.sel !== null) up({ clicks: ctx.model.clicks.concat([ctx.model.sel]) }); });
    back.addEventListener('click', () => {
      const F = scopeRef.fam();
      if (F.helpers.pending(ctx.model, spec)) up(F.helpers.undoModel(ctx.model, spec));
      else up({ clicks: [] });
    });
    function sync(m) {
      for (const it of spec.items) { if (m.sel === it.key) els[it.key].setAttribute('data-sel', 'true'); else els[it.key].removeAttribute('data-sel'); }
      openBtn.classList.toggle('dis', m.sel === null);
      const last = m.clicks.length ? m.clicks[m.clicks.length - 1] : null;
      win.hidden = last === null;
      if (last !== null) {
        const it = spec.items.find((x) => x.key === last);
        name.textContent = it ? it.name : '';
        body.textContent = it && it.kind === 'folder' ? `${it.size} · folder` : `${it ? it.size : ''} · preview`;
      }
    }
    sync(ctx.model);
    return {
      sync,
      locate(t) {
        if (t.item2 !== undefined) return win.hidden ? scopeRef.env.util.center(els[t.item2]) : null;
        if (t.openbtn) return scopeRef.env.util.center(openBtn);
        if (t.undo) return win.hidden ? null : scopeRef.env.util.center(back);
        return null;
      },
      recover: null,
    };
  }

  function initialize(scopeRef, set, __has, __parts) {
    set('CSS2', __has('CSS2') ? __parts['CSS2'](undefined, scopeRef) : (CSS2));
    set('view2', __has('view2') ? __parts['view2'](undefined, scopeRef) : (null));
    set('decoMenus', __has('decoMenus') ? __parts['decoMenus'](undefined, scopeRef) : { decoMenus: (ctx, bar) => {
        for (const l of ['File', 'Edit', 'View', 'Window', 'Help']) ctx.util.el('div', 'deco', bar, l);
        return ctx.util.el('div', 'ud-tools', bar);
      } }.decoMenus);
    set('BUILDERS2', __has('BUILDERS2') ? __parts['BUILDERS2'](undefined, scopeRef) : ({ tab: scopeRef.dTab, menu: scopeRef.dMenu, collapsible: scopeRef.dCollapsible, pie: scopeRef.dPie, dialog: scopeRef.dDialog, context: scopeRef.dContext, open: scopeRef.dOpen }));
    scopeRef.env.widget({
      task: 'click-control',
      site: 'base',
      name: 'desktop',
      split: 'train',
      scenarios: ['tab', 'menu', 'collapsible', 'pie', 'dialog', 'context', 'open'],
      traits: { menuOpen: ['click'] },

      render(ctx) {
        scopeRef.ensureStyle('ud-style', scopeRef.CSS2);
        scopeRef.ensureStyle('uc-style', scopeRef.CSS); // toast / navigated view styles
        const w = scopeRef.window2(ctx);
        scopeRef.blankEl = w.win.querySelector('.ud-title');
        scopeRef.view2 = scopeRef.mount(ctx, w.win, w.body, (c, body, up) => scopeRef.BUILDERS2[c.spec.scenario](c, w, up));
        return { anchors: [w.win], sync: (m) => scopeRef.view2.sync(m) };
      },

      locate(t) {
        const p = scopeRef.view2 && scopeRef.view2.locate(t);
        if (!p) throw new Error(`click-control/desktop cannot locate ${JSON.stringify(t)}`);
        return p;
      },
    });
  }

  env.template('click-control/_base-desktop', () => ({ functions: { window2, dTab, dMenu, dCollapsible, dPie, dDialog, deskIcons, dContext, dOpen }, initialize }));
})();
