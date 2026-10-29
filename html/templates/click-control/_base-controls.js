/* click-control/_base-controls: controls units of the base template.
 * scopeRef is the live reference scope; reference.js retains their design.parts keys and overrides.
 */
(function () {
  'use strict';

  /*
     * reference / click-control / controls: a small web-app page (top navigation bar, optional sidebar, breadcrumb,
     * page title) whose content area holds the scenario's controls among distractors. The page frame's width and
     * alignment and the widget's alignment inside the content area are sampled per episode (sized from
     * ctx.size). Mechanics come from env.ui (kit/ui/click.js): buttons() for buttons, links, widgets, text
     * fields, tools, row actions and hover squares, tabs(), menu(), collapsible() (accordion group), dialog()
     * and pieMenu(); tooltips, hover-reveal rows, the context menu and the file browser are local. Navigation
     * bar and sidebar entries are decorative (clicks do nothing).
     *   button       'labels': a flowing card of sentences, labeled inputs and buttons (some styled as links,
     *                disabled decoys greyed out); 'lookalike': a toolbar, card or form footer of look-alike
     *                controls styled as buttons, primary buttons, links, ghost or icon+text buttons, disabled
     *                twins; 'test' / 'pair': buttons placed at the spec's fractions of a dotted control surface
     *   sequence     ONE..FOUR (or short labels) on the control surface; pressed buttons stay marked
     *   link         an article with paragraphs (links are underlined phrases) or a related-links list where
     *                some links are drawn as buttons or chips
     *   tab          a tab strip over panels (links inside in mode 'link'); the strip wraps when long
     *   menu         'bar': an always-visible vertical menu with fly-out submenus to the right;
     *                'button': a "Menu" button with a dropdown of icon items (shortcuts at the right) and
     *                fly-out submenus. Submenus open on hover after a delay on the kit clock (spec.openBy
     *                'hover') or on click; spec.aim: they close aimDelay ms after the pointer leaves the menu
     *   collapsible  an accordion (one section open at a time)
     *   dialog       a modal over a use-file-manager page (dimmed backdrop; clicks on it are ignored);
     *                spec.opener: the dialog starts closed and opens from a toolbar button
     *   pie          a spreader button in the middle of a ring of slices (click it, then click a slice)
     *   widget       stacked form widgets (two columns when many)
     *   focus        a contact form with text fields at jittered offsets
     *   hover        squares on a board; the highlighted one moves (model.hl); a meter shows hover time
     *   tooltip-inspect  'icon': an icon-only toolbar above a document; hovering a tool for spec.delay ms of
     *                kit time shows its tooltip; 'id': a contact list with duplicate names whose names show an
     *                ID tooltip on hover, each row with an action button
     *   rows         a table whose row actions (icons or text buttons) only appear while the row is hovered
     *   context      a file grid or list; right-click opens a context menu at the pointer; left click selects
     *   open         a file browser; click selects, double-click (or the toolbar "Open") opens the item in a
     *                viewer with a Back link
     * Widget 'eras' (below) reuses this frame with four era button styles (button, sequence). 'desktop' is widget 2.
     * Recoverable mode: a pending wrong choice shows an Undo toast at the bottom of the page, or (link, tab
     * link, collapsible link, open) a "navigated" view over the content with a Back link; both map to
     * { undo: true }. The page frame is the anchor; popups, submenus, dialogs, toasts and views are overlays.
     */

  function buildButton(scopeRef, ctx, content, up) {
    const { spec, util, rng } = ctx;
    const els = [];
    if (scopeRef.ERA && scopeRef.ERA.mode === 'fab' && (spec.kind === 'labels' || spec.kind === 'lookalike')) return scopeRef.buildFabScreen(ctx, content, up);
    if (spec.kind === 'labels') {
      const card = util.el('div', 'uc-card uc-flow' + scopeRef.eraHost(), scopeRef.box(ctx, content));
      for (const e of spec.elements) {
        if (e.type === 'text') util.el('div', 'uc-text', card, e.text);
        else if (e.type === 'input') {
          const row = util.el('div', 'uc-inrow', card);
          if (e.label) util.el('span', '', row, e.label + ':');
          const inp = util.el('input', 'uc-input', row);
          inp.type = 'text';
          inp.style.width = e.width + 'px';
        } else {
          els.push(scopeRef.makeButton(ctx, card, e));
          if (e.br) util.el('div', 'uc-br', card);
        }
      }
    } else if (spec.kind === 'lookalike') {
      const b = scopeRef.box(ctx, content);
      let host;
      if (spec.layout === 'toolbar') {
        host = util.el('div', 'uc-bar' + scopeRef.eraHost(), b);
        util.el('div', 'uc-doc', b).innerHTML = `<b>${rng.pick(['Quarterly plan', 'Draft: Spring newsletter', 'Invoice #4821', 'Onboarding checklist', 'Trip to Lisbon'])}</b><br>`
          + 'Last edited a few minutes ago. Use the actions above to continue.';
      } else {
        const card = util.el('div', 'uc-card' + scopeRef.eraHost(), b);
        card.style.width = '480px';
        card.style.maxWidth = '100%';
        card.style.boxSizing = 'border-box';
        util.el('div', '', card, rng.pick(['Edit profile', 'Compose message', 'Project settings', 'Billing details', 'New article'])).style.fontWeight = '700';
        util.el('div', 'uc-doc', card, rng.pick(['Changes are kept locally until you choose what to do with them.',
          'Review the details below before you continue.', 'Your work is not visible to others yet.']));
        host = util.el('div', spec.layout === 'footer' ? 'uc-foot' : 'uc-foot', card);
        if (spec.layout === 'card') host.style.justifyContent = 'flex-start';
      }
      spec.elements.forEach((e, i) => {
        if (spec.layout === 'toolbar' && i && rng.bool(0.2)) util.el('span', 'sep', host);
        els.push(scopeRef.makeButton(ctx, host, e));
      });
    } else {
      const { box: s, W, H } = scopeRef.surface(ctx, content, 560, 320);
      const pad = 18;
      if (scopeRef.ERA) s.classList.add(scopeRef.eraHost().trim());
      for (const e of spec.elements) {
        let b;
        if (scopeRef.ERA) b = scopeRef.eraButton(ctx, s, e.label, e.key, { primary: spec.kind === 'test', fab: true });
        else {
          b = util.el('button', 'uc-btn' + (spec.kind === 'test' ? ' primary' : ''), s, e.label);
          b.type = 'button';
          b.dataset.key = e.key;
        }
        let [w, h] = spec.kind === 'test' ? [Math.round(e.size * 1.3), Math.round(e.size * 1.3)] : [86, 54];
        if (scopeRef.ERA && spec.kind !== 'test') [w, h] = scopeRef.eraFit(b, W, H, pad);
        b.style.width = w + 'px';
        b.style.height = h + 'px';
        if (spec.kind === 'test' && !scopeRef.ERA) b.style.whiteSpace = 'normal';
        b.style.left = Math.round(pad + e.x * Math.max(0, W - w - 2 * pad)) + 'px';
        b.style.top = Math.round(pad + e.y * Math.max(0, H - h - 2 * pad)) + 'px';
        els.push(b);
      }
    }
    const dis = new Set(spec.elements.filter((e) => e.disabled).map((e) => e.key));
    const btns = scopeRef.env.ui.buttons(els, { label: 'button', history: ctx.model.clicks, disabled: (k) => dis.has(k),
      onChange: (h) => up({ clicks: h }) });
    return {
      sync: (m) => btns.set(m.clicks),
      locate: (t) => (t.button !== undefined ? btns.locate(t.button) : null),
      recover: 'toast',
    };
  }

  function buildSequence(scopeRef, ctx, content, up) {
    const { spec, util } = ctx;
    const { box: s, W, H } = scopeRef.surface(ctx, content, 560, 320);
    const pad = 18;
    const natural = scopeRef.ERA ? scopeRef.ERA.size : [spec.labels === 'words' ? 104 : 86, 50];
    if (scopeRef.ERA) s.classList.add(scopeRef.eraHost().trim());
    const els = spec.buttons.map((e) => {
      let b;
      if (scopeRef.ERA) b = scopeRef.eraButton(ctx, s, e.label, e.key, { fab: true });
      else {
        b = util.el('button', 'uc-btn', s, e.label);
        b.type = 'button';
        b.dataset.key = e.key;
        b.style.whiteSpace = 'normal';
      }
      const [w, h] = scopeRef.ERA ? scopeRef.eraFit(b, W, H, pad) : natural;
      b.style.width = w + 'px';
      b.style.height = h + 'px';
      b.style.left = Math.round(pad + e.x * Math.max(0, W - w - 2 * pad)) + 'px';
      b.style.top = Math.round(pad + e.y * Math.max(0, H - h - 2 * pad)) + 'px';
      return b;
    });
    const btns = scopeRef.env.ui.buttons(els, { label: 'sequence', history: ctx.model.clicks, onChange: (hist) => up({ clicks: hist }) });
    return {
      sync: (m) => btns.set(m.clicks),
      locate: (t) => (t.button !== undefined ? btns.locate(t.button) : null),
      recover: 'toast',
    };
  }

  function buildLink(scopeRef, ctx, content, up) {
    const { spec, util, rng } = ctx;
    const b = scopeRef.box(ctx, content, { top: true });
    const art = util.el('div', 'uc-article', b);
    util.el('h3', '', art, spec.heading);
    let links;
    if (spec.mode === 'list') {
      util.el('p', '', art, rng.pick(['Pick a topic to read more.', 'Everything you need, in one place.', 'Handpicked for you.'])).style.color = 'var(--muted)';
      const rc = content.getBoundingClientRect();
      const col = rng.bool(0.4) && spec.blocks[0].length * 40 + 90 < rc.height;
      const list = util.el('div', 'uc-links' + (col ? ' col' : ''), art);
      links = spec.blocks[0].map((w, i) => {
        const a = util.el('span', 'uc-link' + (w.look === 'button' ? ' btnlook' : w.look === 'chip' ? ' chip' : ''), list, w.text);
        a.dataset.key = `0.${i}`;
        a.dataset.role = 'link';
        return a;
      });
    } else links = spec.blocks.flatMap((ws, k) => scopeRef.paragraph(ctx, art, ws, k));
    const lk = scopeRef.env.ui.buttons(links, { label: 'link', point: scopeRef.linkPoint, history: ctx.model.clicks, onChange: (h) => up({ clicks: h }) });
    return {
      sync: (m) => lk.set(m.clicks),
      locate: (t) => (t.link !== undefined ? lk.locate(t.link) : null),
      recover: 'view',
    };
  }

  function buildTab(scopeRef, ctx, content, up) {
    const { spec, util } = ctx;
    const b = scopeRef.box(ctx, content, { top: true });
    const wrap = util.el('div', 'uc-tabs', b);
    const strip = util.el('div', 'uc-strip', wrap);
    const tabEls = [];
    const panels = [];
    let links = [];
    spec.tabs.forEach((t, i) => {
      const tb = util.el('button', 'uc-tab', strip, t.label);
      tb.type = 'button';
      tb.dataset.role = 'tab';
      tabEls.push(tb);
      const p = util.el('div', 'uc-tabpanel', wrap);
      links = links.concat(scopeRef.paragraph(ctx, p, t.words, i, 'div'));
      panels.push(p);
    });
    const tabs = scopeRef.env.ui.tabs(tabEls, panels, { value: ctx.model.active, onChange: (k) => up({ active: k }) });
    const lk = scopeRef.env.ui.buttons(links, { label: 'link', point: scopeRef.linkPoint, history: ctx.model.clicks, onChange: (h) => up({ clicks: h }) });
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

  function buildMenu(scopeRef, ctx, content, up) {
    const { spec, util, rng } = ctx;
    const wrap = util.el('div', 'uc-menuwrap', content);
    let trigger = null;
    if (spec.mode === 'button') {
      trigger = util.el('button', 'uc-btn uc-menubtn', wrap);
      trigger.type = 'button';
      trigger.innerHTML = '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M2.5 4h11M2.5 8h11M2.5 12h11"/></svg><span>Menu</span>';
    }
    const root = util.el('div', 'uc-mpanel' + (trigger ? '' : ' root-static'), wrap);
    const showKeys = rng.bool(0.6);
    function build(nodes, panel) {
      return nodes.map((n) => {
        const row = util.el('div', 'uc-mrow', panel);
        const el = util.el('div', 'uc-mi' + (n.disabled ? ' dis' : ''), row);
        el.dataset.role = 'menuitem';
        if (spec.mode === 'button') el.innerHTML = scopeRef.icon(n.icon);
        util.el('span', '', el, n.label);
        const item = { key: n.key, el, disabled: !!n.disabled };
        if (n.children) {
          util.el('span', 'car', el, '▶');
          const sub = util.el('div', 'uc-mpanel', row);
          item.panel = sub;
          item.children = build(n.children, sub);
        } else if (showKeys && n.shortcut) util.el('span', 'sc', el, n.shortcut);
        return item;
      });
    }
    const items = build(spec.tree, root);
    const menu = scopeRef.env.ui.menu(trigger, {
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
      sync(m) { menu.set(m.path); menu.poll(); },
      locate(t) {
        if (t.trigger) return menu.locateTrigger();
        if (t.item !== undefined) return menu.locate(t.item);
        return null;
      },
      recover: 'toast',
    };
  }

  function buildCollapsible(scopeRef, ctx, content, up) {
    const { spec, util } = ctx;
    const b = scopeRef.box(ctx, content, { top: true });
    const acc = util.el('div', 'uc-acc', b);
    const group = {};
    const secs = [];
    let links = [];
    const report = () => up({ open: secs.map((s, i) => (s.get() ? i : -1)).filter((i) => i >= 0) });
    spec.sections.forEach((s, i) => {
      const sec = util.el('div', 'uc-sec', acc);
      const h = util.el('div', 'uc-sec-h', sec);
      h.dataset.role = 'header';
      h.innerHTML = scopeRef.CHEVRON;
      util.el('span', '', h, s.title);
      const bd = util.el('div', 'uc-sec-b', sec);
      links = links.concat(scopeRef.paragraph(ctx, bd, s.words, i, 'div'));
      secs.push(scopeRef.env.ui.collapsible(h, bd, { open: ctx.model.open.includes(i), group, onChange: report }));
    });
    const lk = scopeRef.env.ui.buttons(links, { label: 'link', point: scopeRef.linkPoint, history: ctx.model.clicks, onChange: (hist) => up({ clicks: hist }) });
    return {
      sync(m) { secs.forEach((s, i) => s.set(m.open.includes(i))); lk.set(m.clicks); },
      locate(t) {
        if (t.section !== undefined) return secs[t.section] && secs[t.section].locate();
        if (t.link !== undefined) return lk.locate(t.link);
        return null;
      },
      recover: 'view',
    };
  }

  function buildDialog(scopeRef, ctx, content, up) {
    const { spec, util, rng } = ctx;
    const bar = util.el('div', 'uc-toolbar', content);
    const tools = rng.sample(['New folder', 'Upload', 'Sort', 'Share', 'Filter'], 2);
    let opener = null;
    const labels = spec.opener ? tools.concat([spec.opener]) : tools;
    for (const l of labels) {
      const b = util.el('button', 'uc-btn' + (l === spec.opener ? ' primary' : ''), bar, l);
      b.type = 'button';
      if (l === spec.opener) opener = b;
    }
    const table = util.el('table', 'uc-table', content);
    table.innerHTML = '<tr><th>Name</th><th>Size</th><th>Modified</th></tr>';
    const C = scopeRef.env.content;
    const r0 = content.getBoundingClientRect();
    const nRows = Math.max(3, Math.min(6, Math.floor((r0.height - 80) / 34)));
    for (let i = 0; i < nRows; i++) {
      const tr = util.el('tr', '', table);
      util.el('td', '', tr, C.fileName ? C.fileName(rng) : `file-${i}.pdf`).style.maxWidth = '300px';
      tr.firstChild.style.overflow = 'hidden';
      tr.firstChild.style.textOverflow = 'ellipsis';
      util.el('td', '', tr, C.fileSize ? C.fileSize(rng) : `${rng.int(12, 980)} KB`);
      util.el('td', '', tr, `${C.MONTHS[rng.int(0, 11)].slice(0, 3)} ${rng.int(1, 28)}`);
    }
    const backdrop = util.el('div', 'uc-backdrop', content);
    const dbox = util.el('div', 'uc-dialog', content);
    dbox.dataset.role = 'dialog';
    const title = util.el('div', 'uc-dlg-t', dbox);
    util.el('span', '', title, spec.title);
    const x = util.el('button', 'uc-dlg-x', title, '×');
    x.type = 'button';
    x.title = 'close';
    util.el('div', 'uc-dlg-b', dbox, spec.text);
    const btns = [];
    if (spec.buttons.length) {
      const foot = util.el('div', 'uc-dlg-f', dbox);
      spec.buttons.forEach((l, i) => {
        const b = util.el('button', 'uc-btn' + (i === spec.buttons.length - 1 ? ' primary' : ''), foot, l);
        b.type = 'button';
        btns.push([l, b]);
      });
    }
    // Place the box somewhere inside the content area.
    const r = content.getBoundingClientRect();
    const bw = Math.min(340, r.width - 10);
    dbox.style.width = bw + 'px';
    const wasHidden = dbox.hidden;
    dbox.hidden = false;
    const bh = dbox.getBoundingClientRect().height || 170;
    dbox.hidden = wasHidden;
    dbox.style.left = Math.round(rng.float(0.1, 0.9) * Math.max(0, Math.min(r.width, 760) - bw)) + 'px';
    dbox.style.top = Math.round(rng.float(0.05, 0.8) * Math.max(0, r.height - bh - 10)) + 'px';
    const dlg = scopeRef.env.ui.dialog(dbox, {
      open: ctx.model.open,
      opener: opener || [],
      close: x,
      closeResult: 'x',
      buttons: btns,
      backdrop,
      onChange: (open, result) => up(result ? { open, clicks: ctx.model.clicks.concat([result]) } : { open }),
    });
    return {
      sync(m) { dlg.set(m.open); },
      locate(t) {
        if (t.opener) return dlg.locateOpener();
        if (t.dialog !== undefined) return dlg.locate(t.dialog);
        return null;
      },
      recover: 'toast',
    };
  }

  function buildPie(scopeRef, ctx, content, up) {
    const { spec, util, rng } = ctx;
    const r = content.getBoundingClientRect();
    const S = Math.max(220, Math.min(320, Math.floor(r.height) - 34, Math.floor(r.width)));
    const b = scopeRef.box(ctx, content);
    const area = util.el('div', 'uc-pie', b);
    area.style.width = S + 'px';
    area.style.height = S + 'px';
    const svg = util.svg('svg', { width: S, height: S, viewBox: `0 0 ${S} ${S}` }, area);
    const c = S / 2;
    const inner = 40;
    const outer = c - 6;
    const n = spec.items.length;
    const w = 360 / n;
    const start = rng.pick([0, 0, 90, -90, w / 2]);
    const g = util.svg('g', {}, svg);
    const pt = (a, rad) => [c + rad * Math.sin((a * Math.PI) / 180), c - rad * Math.cos((a * Math.PI) / 180)];
    const slices = spec.items.map((label, i) => {
      const a0 = start + (i - 0.5) * w;
      const a1 = start + (i + 0.5) * w;
      const [x0, y0] = pt(a0, outer);
      const [x1, y1] = pt(a1, outer);
      const [x2, y2] = pt(a1, inner);
      const [x3, y3] = pt(a0, inner);
      const big = w > 180 ? 1 : 0;
      const d = `M${x0} ${y0}A${outer} ${outer} 0 ${big} 1 ${x1} ${y1}L${x2} ${y2}A${inner} ${inner} 0 ${big} 0 ${x3} ${y3}Z`;
      const p = util.svg('path', { d, class: 'uc-slice' }, g);
      const [lx, ly] = pt(start + i * w, (inner + outer) / 2);
      const tx = util.svg('text', { x: lx, y: ly, class: 'uc-slabel' }, g);
      tx.textContent = label;
      return p;
    });
    const spread = util.svg('g', {}, svg);
    const knob = util.svg('circle', { cx: c, cy: c, r: 26, class: 'uc-spread' }, spread);
    const plus = util.svg('path', { d: `M${c - 9} ${c}h18M${c} ${c - 9}v18`, class: 'uc-spread-i' }, spread);
    plus.style.transformOrigin = `${c}px ${c}px`;
    util.el('div', 'uc-hint', b, 'Tip: the button in the middle expands the menu.');
    const pie = scopeRef.env.ui.pieMenu(area, {
      items: spec.items,
      slices,
      panel: g,
      trigger: knob,
      inner: () => inner,
      outer: () => outer,
      start,
      show: (el, open) => {
        el.style.display = open ? '' : 'none';
        if (open) area.setAttribute('data-open', 'true');
        else area.removeAttribute('data-open');
      },
      onChange: (open) => up({ open }),
      onSelect: (k) => up({ clicks: ctx.model.clicks.concat([k]) }),
    });
    pie.set(ctx.model.open);
    return {
      sync(m) { pie.set(m.open); },
      locate(t) {
        if (t.pie) return pie.locateOpen();
        if (t.slice !== undefined) return pie.locate(t.slice);
        return null;
      },
      recover: 'toast',
    };
  }

  function buildWidget(scopeRef, ctx, content, up) {
    const { spec, util } = ctx;
    const card = util.el('div', 'uc-card uc-wlist', scopeRef.box(ctx, content));
    const r = content.getBoundingClientRect();
    const cols = spec.widgets.length * 50 > r.height - 30 ? 2 : 1;
    card.style.gridTemplateColumns = `repeat(${cols}, max-content)`;
    card.style.minWidth = cols === 1 ? '300px' : '';
    const rows = spec.widgets.map((wd, i) => {
      let row;
      if (wd.type === 'radio' || wd.type === 'checkbox') {
        row = util.el('label', 'uc-widget', card);
        const inp = util.el('input', '', row);
        inp.type = wd.type;
        if (wd.type === 'radio') inp.name = 'uc-radio';
        util.el('span', '', row, wd.text);
      } else if (wd.type === 'text') {
        row = util.el('div', 'uc-widget', card);
        const inp = util.el('input', 'uc-input', row);
        inp.type = 'text';
        inp.value = wd.text;
        inp.style.width = '160px';
      } else if (wd.type === 'textarea') {
        row = util.el('div', 'uc-widget', card);
        util.el('textarea', '', row).value = wd.text;
      } else {
        row = util.el('div', 'uc-widget', card);
        const b = util.el('button', 'uc-btn', row, wd.text);
        b.type = 'button';
      }
      row.dataset.role = 'widget';
      row.dataset.key = String(i);
      return row;
    });
    const ws = scopeRef.env.ui.buttons(rows, { keys: rows.map((_, i) => i), label: 'widget', history: ctx.model.clicks, onChange: (h) => up({ clicks: h }) });
    return {
      sync: (m) => ws.set(m.clicks),
      locate(t) {
        if (t.widget === undefined) return null;
        const row = rows[t.widget];
        const ctl = row && row.querySelector('input, textarea, button');
        return ctl ? scopeRef.env.util.center(ctl) : ws.locate(t.widget);
      },
      recover: 'toast',
    };
  }

  function buildFocus(scopeRef, ctx, content, up) {
    const { spec, util, rng } = ctx;
    const form = util.el('div', 'uc-card uc-form', scopeRef.box(ctx, content));
    const r = content.getBoundingClientRect();
    const n = spec.fields.length;
    const slack = Math.max(0, Math.floor((r.height - 40 - n * 58) / n));
    const inputs = spec.fields.map((f, i) => {
      const fld = util.el('div', 'uc-field', form);
      fld.style.marginLeft = rng.int(0, 40) + 'px';
      fld.style.marginTop = (i === 0 ? rng.int(0, Math.min(30, slack)) : rng.int(Math.min(8, slack), Math.min(30, slack))) + 'px';
      const id = `uc-f${i}`;
      const lab = util.el('label', '', fld, f.label);
      lab.htmlFor = id;
      const inp = util.el('input', 'uc-input', fld);
      inp.type = 'text';
      inp.id = id;
      inp.autocomplete = 'off';
      return inp;
    });
    const fs = scopeRef.env.ui.buttons(inputs, { keys: inputs.map((_, i) => i), on: 'focus', label: 'field', history: ctx.model.clicks, onChange: (h) => up({ clicks: h }) });
    return {
      sync(m) {
        fs.set(m.clicks);
        // After Undo the wrongly focused field gives the focus back.
        if (!m.clicks.length && document.activeElement && inputs.includes(document.activeElement)) document.activeElement.blur();
      },
      locate: (t) => (t.field !== undefined ? fs.locate(t.field) : null),
      recover: 'toast',
    };
  }

  function buildHover(scopeRef, ctx, content, up) {
    const { spec, util } = ctx;
    const r = content.getBoundingClientRect();
    const S = Math.max(220, Math.min(360, Math.floor(r.height) - 44, Math.floor(r.width)));
    const b = scopeRef.box(ctx, content);
    const svg = util.svg('svg', { width: S, height: S, class: 'uc-board' }, b);
    const pad = 10;
    const rects = spec.shapes.map((s) => util.svg('rect', {
      x: pad + s.x * (S - 2 * pad), y: pad + s.y * (S - 2 * pad),
      width: s.size * (S - 2 * pad), height: s.size * (S - 2 * pad), rx: 3, class: 'uc-sq',
    }, svg));
    const meter = util.el('div', 'uc-meter', b);
    util.el('span', '', meter, 'Time on target');
    const bar = util.el('div', 'bar', meter);
    const fill = util.el('i', '', bar);
    const txt = util.el('span', '', meter);
    const sq = scopeRef.env.ui.buttons(rects, { hover: true, label: 'shape', onHover: (k) => up({ over: k }) });
    function sync(m) {
      rects.forEach((el, i) => { el.style.fill = i === m.hl ? scopeRef.HOVER_FILL[spec.color] : ''; });
      const got = Math.min(m.got, spec.need);
      fill.style.width = `${(100 * got) / spec.need}%`;
      txt.textContent = `${(got / 1000).toFixed(1)} s / ${spec.need / 1000} s`;
    }
    sync(ctx.model);
    return { sync, locate: (t) => (t.shape !== undefined ? sq.locate(t.shape) : null), recover: null };
  }

  function initialize(scopeRef, set, __has, __parts) {

  }

  env.template('click-control/_base-controls', () => ({ functions: { buildButton, buildSequence, buildLink, buildTab, buildMenu, buildCollapsible, buildDialog, buildPie, buildWidget, buildFocus, buildHover }, initialize }));
})();
