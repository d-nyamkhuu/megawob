/*
 * base / scroll-page / longform: a long content page that scrolls as a whole under the site's sticky
 * header. Page kinds (spec.kind): news article, docs page, help-center FAQ, product page, terms of service.
 *   layout       'docs' (a sticky "On this page" column on the left; wide docs pages), 'rail' (a right rail of
 *                related links, decorative) or 'single' (one column with an inline table of contents when
 *                spec.toc). Column width and stage alignment vary per episode.
 *   header       breadcrumb, title, meta line and the page toolbar (spec.tools, real actions), then the copy
 *                field or the value card (copy scenario), the inline table of contents, and a figure / intro
 *                card whose height is grown until the target sits below the fold.
 *   sections     heading, paragraphs, actions (links inline at the end of a paragraph or in a row, buttons in
 *                a row); the FAQ block (accordion; exclusive or not) and the scroll pane (nested; custom
 *                scrollbar beside a native overflow list, so the wheel and a thumb drag both work; two levels
 *                with ood) follow their sections.
 *   bottom       "Was this helpful?" (inert), the bottom toolbar (top scenario: same labels as the page
 *                toolbar, wrong ones), an inline "Back to top" link, a page footer (inert), and a floating
 *                "Back to top" button once the page is scrolled.
 *   wrong click  a full-page "linked page" panel under the site header with a Back button (recoverable mode;
 *                without it the episode has already ended).
 *   containers   the scroll-container scenarios share the pane section slot: hscroll (a strip of cards with its own
 *                horizontal scrollbar), carousel (scroll-snap slides with prev / next arrows, swipe and wheel-dx
 *                handled here so a step always lands on a slide), sticky (an opaque sticky header row inside the
 *                list; clicks on rows that are not fully below it are ignored), lazy (rows appended from the
 *                scroll handler when the list ends, driven by model.loaded; a "Loading more" row sits at the
 *                end) and siblings (two panes side by side, only one holds the target).
 * Mirrored layout facts (ctx.update on scroll): seen / where (target vs viewport), atTop, pane layout, slide.
 * locate() is occlusion-aware: a target whose centre is covered by a sticky or fixed element (site header,
 * instruction note, floating buttons) is reported just off-screen on that side, so the kit scrolls the page.
 * The page header block is the anchor (nothing above it ever changes size).
 */
(function () {
  'use strict';

  const CSS = `
  .ps-wrap { align-self: flex-start; margin: 22px 26px 0; color: var(--fg); user-select: text; -webkit-user-select: text; }
  .ps-wrap.docs { display: grid; grid-template-columns: 196px minmax(0, 1fr); column-gap: 36px; }
  .ps-wrap.rail { display: grid; grid-template-columns: minmax(0, 1fr) 230px; column-gap: 34px; }
  .ps-side { position: sticky; align-self: start; font-size: 13.5px; }
  .ps-side h4, .ps-rail h4 { margin: 4px 0 10px; font-size: 11.5px; letter-spacing: .07em; text-transform: uppercase; color: var(--muted); }
  .ps-side a { display: block; padding: 5px 0 5px 10px; border-left: 2px solid var(--line); color: var(--muted); text-decoration: none; cursor: pointer; }
  .ps-side a:hover { color: var(--fg); border-left-color: var(--accent); }
  .ps-rail { align-self: start; padding: 16px 18px; border: 1px solid var(--line); border-radius: 10px; background: var(--panel); font-size: 13.5px; }
  .ps-rail span { display: block; padding: 6px 0; color: var(--muted); border-bottom: 1px dashed var(--line); }
  .ps-main { min-width: 0; }
  .ps-head { padding-bottom: 14px; border-bottom: 1px solid var(--line); }
  .ps-crumbs { font-size: 13px; color: var(--muted); }
  .ps-crumbs b { color: var(--accent); font-weight: 600; }
  .ps-title { margin: 8px 0 6px; font-size: 30px; line-height: 1.18; letter-spacing: -.01em; }
  .ps-title.serif { font-family: Georgia, "Times New Roman", "Liberation Serif", serif; font-size: 33px; }
  .ps-meta { font-size: 13.5px; color: var(--muted); }
  .ps-tools { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }
  .ps-tool { padding: 6px 12px; border: 1px solid var(--line); border-radius: 999px; background: var(--panel); color: var(--fg); font: inherit; font-size: 13.5px; cursor: pointer; }
  .ps-tool:hover { border-color: var(--accent); }
  .ps-card { margin: 18px 0 4px; padding: 14px 16px; border: 1px solid var(--line); border-radius: 10px; background: var(--panel); }
  .ps-card label { display: block; font-size: 13px; font-weight: 650; margin-bottom: 6px; }
  .ps-card .row { display: flex; gap: 8px; align-items: center; }
  .ps-input { flex: 1; min-width: 0; max-width: 340px; height: 36px; padding: 0 10px; border: 1px solid var(--line); border-radius: 7px; background: var(--bg); color: var(--fg); font: inherit; font-size: 15px; }
  .ps-input:focus { outline: 2px solid color-mix(in srgb, var(--accent) 50%, transparent); border-color: var(--accent); }
  .ps-inert { padding: 8px 14px; border: 0; border-radius: 7px; background: color-mix(in srgb, var(--fg) 9%, var(--panel)); color: var(--fg); font: inherit; font-size: 14px; cursor: pointer; }
  .ps-code { font-family: ui-monospace, Menlo, Consolas, "DejaVu Sans Mono", monospace; font-size: 14.5px; padding: 1px 6px; border-radius: 5px; background: color-mix(in srgb, var(--accent) 10%, var(--panel)); }
  .ps-toc { margin: 16px 0 0; padding: 12px 16px; border-left: 3px solid var(--accent); background: color-mix(in srgb, var(--fg) 3%, var(--panel)); font-size: 14px; }
  .ps-toc b { display: block; margin-bottom: 6px; font-size: 12px; letter-spacing: .06em; text-transform: uppercase; color: var(--muted); }
  .ps-toc a { display: inline-block; margin: 2px 14px 2px 0; color: var(--accent); text-decoration: none; cursor: pointer; }
  .ps-toc a:hover { text-decoration: underline; }
  .ps-fig { margin: 18px 0 0; border-radius: 10px; display: flex; align-items: flex-end; padding: 12px 14px; font-size: 12.5px; color: var(--muted);
    background: linear-gradient(135deg, color-mix(in srgb, var(--accent) 18%, var(--panel)), color-mix(in srgb, var(--fg) 8%, var(--panel))); }
  .ps-intro { margin: 18px 0 0; padding: 16px 18px; border: 1px solid var(--line); border-radius: 10px; background: var(--panel); font-size: 15px; line-height: 1.55; }
  .ps-sec { padding: 22px 0 8px; }
  .ps-sec h2 { margin: 0 0 10px; font-size: 21px; line-height: 1.25; }
  .ps-sec p { margin: 0 0 12px; line-height: 1.62; font-size: 15.5px; }
  .ps-link { color: var(--accent); text-decoration: underline; text-underline-offset: 2px; cursor: pointer; }
  .ps-acts { display: flex; flex-wrap: wrap; gap: 10px 18px; align-items: center; margin: 4px 0 6px; }
  .ps-btn { padding: 7px 14px; border: 1px solid var(--accent); border-radius: 7px; background: transparent; color: var(--accent); font: inherit; font-size: 14px; font-weight: 600; cursor: pointer; }
  .ps-btn:hover { background: color-mix(in srgb, var(--accent) 10%, transparent); }
  .ps-done { outline: 2px solid color-mix(in srgb, var(--accent) 55%, transparent); outline-offset: 3px; border-radius: 4px; }
  .ps-ok { display: none; margin-left: 4px; font-size: 13px; color: #2b8a3e; font-weight: 600; }
  .ps-ok.on { display: inline; }
  .ps-faq h2 { margin: 0 0 12px; font-size: 21px; }
  .ps-item { border-top: 1px solid var(--line); }
  .ps-item:last-child { border-bottom: 1px solid var(--line); }
  .ps-q { display: flex; align-items: center; gap: 10px; width: 100%; padding: 13px 4px; border: 0; background: none; color: var(--fg); font: inherit; font-size: 15.5px; font-weight: 600; text-align: left; cursor: pointer; }
  .ps-q i { flex: none; width: 18px; color: var(--muted); font-style: normal; transition: none; }
  .ps-a { display: none; padding: 0 4px 12px 32px; }
  .ps-item.open .ps-a { display: block; }
  .ps-a p { margin: 0 0 8px; line-height: 1.55; font-size: 15px; }
  .ps-pane { position: relative; display: flex; margin: 10px 0 8px; border: 1px solid var(--line); border-radius: 9px; background: var(--panel); overflow: hidden; }
  .ps-pane > .ps-list { flex: 1; min-width: 0; overflow-y: auto; overscroll-behavior: contain; scrollbar-width: none; }
  .ps-list::-webkit-scrollbar { display: none; }
  .ps-track { position: relative; flex: none; width: 13px; border-left: 1px solid var(--line); background: color-mix(in srgb, var(--fg) 3%, var(--panel)); touch-action: none; }
  .ps-thumb { position: absolute; left: 2px; right: 2px; border-radius: 6px; background: color-mix(in srgb, var(--fg) 28%, var(--panel)); cursor: grab; touch-action: none; }
  .ps-thumb:hover { background: color-mix(in srgb, var(--fg) 45%, var(--panel)); }
  .ps-row { display: flex; align-items: center; gap: 12px; box-sizing: border-box; padding: 0 12px; border-bottom: 1px solid var(--line); }
  .ps-row .t { flex: none; font-weight: 650; font-size: 14.5px; }
  .ps-row .m { flex: 1; min-width: 0; color: var(--muted); font-size: 13px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .ps-row .ps-btn { padding: 4px 10px; font-size: 13px; }
  .ps-group { box-sizing: border-box; padding: 8px 10px 10px; border-bottom: 1px solid var(--line); }
  .ps-group h5 { margin: 0 0 6px; font-size: 13px; letter-spacing: .03em; color: var(--muted); }
  .ps-group .ps-pane { margin: 0; }
  .ps-pane.ps-hbox { flex-direction: column; }
  .ps-pane.ps-hbox > .ps-list { flex: none; overflow-x: auto; overflow-y: hidden; display: flex; overscroll-behavior-y: auto; }
  .ps-hbox > .ps-track { width: auto; height: 13px; border-left: 0; border-top: 1px solid var(--line); }
  .ps-hbox .ps-thumb { left: auto; right: auto; top: 2px; bottom: 2px; }
  .ps-hcard { flex: none; box-sizing: border-box; display: flex; flex-direction: column; gap: 6px; padding: 12px 14px; border-right: 1px solid var(--line); }
  .ps-hcard .t { font-weight: 650; font-size: 15px; }
  .ps-hcard .m { color: var(--muted); font-size: 12.5px; flex: 1; overflow: hidden; }
  .ps-hcard .ps-btn { padding: 4px 10px; font-size: 13px; align-self: flex-start; }
  .ps-hcard .acts { display: flex; flex-wrap: wrap; gap: 6px; }
  .ps-pane.ps-car > .ps-list { flex: none; width: 100%; overflow-x: auto; overflow-y: hidden; display: flex; scroll-snap-type: x mandatory; overscroll-behavior-y: auto; }
  .ps-slide { flex: none; box-sizing: border-box; scroll-snap-align: start; display: flex; flex-direction: column; gap: 8px; padding: 18px 62px 30px; user-select: none; -webkit-user-select: none; }
  .ps-slide .t { font-size: 22px; font-weight: 650; }
  .ps-slide .m { color: var(--muted); font-size: 14px; flex: 1; }
  .ps-slide .acts { display: flex; gap: 10px; }
  .ps-arrow { position: absolute; top: 50%; width: 38px; height: 38px; margin-top: -19px; border-radius: 50%; border: 1px solid var(--line); background: var(--bg); color: var(--fg); font-size: 18px; cursor: pointer; z-index: 2; box-shadow: 0 2px 8px rgba(0,0,0,.14); }
  .ps-arrow.prev { left: 10px; }
  .ps-arrow.next { right: 10px; }
  .ps-dots { position: absolute; left: 0; right: 0; bottom: 9px; display: flex; justify-content: center; gap: 7px; pointer-events: none; z-index: 2; }
  .ps-dots i { width: 8px; height: 8px; border-radius: 50%; background: color-mix(in srgb, var(--fg) 22%, var(--panel)); }
  .ps-dots i.on { background: var(--accent); }
  .ps-shead { position: sticky; top: 0; z-index: 3; box-sizing: border-box; display: flex; align-items: center; gap: 12px; padding: 0 12px; background: var(--panel); border-bottom: 2px solid var(--line); box-shadow: 0 3px 8px rgba(0,0,0,.12); font-size: 12.5px; letter-spacing: .05em; text-transform: uppercase; color: var(--muted); font-weight: 650; }
  .ps-shead b { color: var(--fg); letter-spacing: 0; text-transform: none; font-size: 14.5px; margin-right: auto; }
  .ps-sent { display: flex; align-items: center; justify-content: center; box-sizing: border-box; color: var(--muted); font-size: 13.5px; }
  .ps-sib { display: flex; flex-wrap: wrap; gap: 14px; margin: 10px 0 8px; }
  .ps-sibcol { flex: 1 1 300px; min-width: 0; }
  .ps-sibcol .ps-pane { margin: 4px 0 0; }
  .ps-sibcol h3 { margin: 0 0 2px; font-size: 16px; }
  .ps-sib .ps-row .t { flex: 1 1 auto; min-width: 0; font-size: 13.5px; line-height: 1.25; }
  .ps-sib .ps-row .m { display: none; }
  .ps-sib .ps-row .ps-btn { flex: none; }
  .ps-help { display: flex; gap: 10px; align-items: center; margin-top: 26px; padding: 14px 0; border-top: 1px solid var(--line); font-size: 14px; color: var(--muted); }
  .ps-bottomtools { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; padding: 10px 0; font-size: 13.5px; color: var(--muted); }
  .ps-totop-inline { display: inline-block; margin: 10px 0; color: var(--accent); cursor: pointer; text-decoration: none; font-size: 14px; }
  .ps-foot { margin-top: 18px; padding: 22px 0 240px; border-top: 1px solid var(--line); font-size: 12.5px; color: var(--muted); }
  .ps-foot span { margin-right: 16px; }
  .ps-float { position: fixed; right: 24px; bottom: 86px; z-index: 22; width: 44px; height: 44px; border-radius: 50%; border: 1px solid var(--line);
    background: var(--panel); color: var(--fg); font-size: 18px; cursor: pointer; box-shadow: 0 4px 14px rgba(0,0,0,.18); visibility: hidden; }
  .ps-float.on { visibility: visible; }
  .ps-away { position: fixed; inset: 0; z-index: 25; display: none; padding: 120px 26px 40px; background: var(--bg); overflow: hidden; }
  .ps-away.on { display: block; }
  .ps-away .card { max-width: 640px; margin: 0 auto; padding: 22px 26px; border: 1px solid var(--line); border-radius: 12px; background: var(--panel); }
  .ps-away h2 { margin: 14px 0 8px; font-size: 24px; }
  .ps-away p { color: var(--muted); line-height: 1.55; }
  .ps-back { padding: 7px 14px; border: 1px solid var(--line); border-radius: 7px; background: var(--panel); color: var(--fg); font: inherit; font-size: 14px; cursor: pointer; }
  `;

  function ensureStyle() {
    if (document.getElementById('ps-style')) return;
    const s = document.createElement('style');
    s.id = 'ps-style';
    s.textContent = CSS;
    document.head.append(s);
  }

  let view = null;
  let listening = false;

  const docTop = (el) => el.getBoundingClientRect().top + window.scrollY;
  const stickyBottom = () => {
    const h = document.querySelector('body > header');
    if (!h) return 0;
    const cs = getComputedStyle(h);
    return cs.position === 'sticky' || cs.position === 'fixed' ? h.getBoundingClientRect().bottom : 0;
  };
  const hits = (el, x, y) => {
    const e = document.elementFromPoint(x, y);
    return !!e && (e === el || el.contains(e));
  };
  // Candidate points of el: the centre and both ends of every line box (inline links may wrap).
  function candidates(el) {
    const boxes = [...el.getClientRects()].filter((r) => r.width >= 1 && r.height >= 1);
    if (!boxes.length) boxes.push(el.getBoundingClientRect());
    const out = [];
    for (const r of boxes) {
      const y = r.top + r.height / 2;
      const inset = Math.min(8, r.width / 3);
      out.push([r.left + r.width / 2, y], [r.left + inset, y], [r.right - inset, y]);
    }
    return out;
  }
  // Visible point of el, or a point just off-screen on the side where it is covered (the kit then scrolls).
  function pointOf(el) {
    const H = window.innerHeight;
    const pts = candidates(el);
    const onScreen = pts.filter(([, y]) => y >= 0 && y <= H);
    if (!onScreen.length) return pts[0];
    for (const [x, y] of onScreen) if (hits(el, x, y)) return [x, y];
    window.__psStats = window.__psStats || { occluded: 0 };
    window.__psStats.occluded++;
    const [x, y] = onScreen[0];
    return y < H / 2 ? [x, 40] : [x, H + 40];
  }
  function visible(el) {
    if (!el) return false;
    const H = window.innerHeight;
    return candidates(el).some(([x, y]) => y >= 0 && y <= H && hits(el, x, y));
  }

  function build(ctx) {
    const { util, spec } = ctx;
    const fam = env.taskDef;
    const rng = ctx.rng;
    // Workaround (base site.css): on scrollable pages '.ref-stage { flex: none }' makes the stage as wide
    // as its content inside the row-flex body, so ctx.size.width is ~0 before rendering. Let the stage fill
    // the row again and measure it ourselves.
    ctx.stage.style.flex = '1 1 0%';
    const W = ctx.stage.getBoundingClientRect().width;
    const el = util.el;

    const layout = spec.kind === 'docs' && W >= 900 && spec.toc ? 'docs'
      : W >= 1060 && rng.bool(0.45) ? 'rail' : 'single';
    const wrap = el('div', `ps-wrap ${layout}`, ctx.stage);
    const side = layout === 'docs' ? 196 + 36 : layout === 'rail' ? 230 + 34 : 0;
    const colMax = rng.int(640, 860);
    const width = Math.max(420, Math.min(W - 52, colMax + side));
    wrap.style.width = width + 'px';
    if (rng.bool(0.3)) wrap.style.marginTop = rng.int(8, 40) + 'px';

    let sideNav = null;
    if (layout === 'docs') sideNav = el('nav', 'ps-side', wrap);
    const main = el('article', 'ps-main', wrap);
    if (layout === 'rail') {
      const rail = el('aside', 'ps-rail', wrap);
      el('h4', '', rail, rng.pick(['Related', 'Popular now', 'More to explore', 'You may also like']));
      const c = env.content || {};
      const pool = c.HEADLINES && spec.kind === 'article' ? c.HEADLINES : c.TOPICS || ['Getting started', 'Billing basics', 'Security tips'];
      for (const t of rng.sample(pool, 5)) el('span', '', rail, t);
    }

    const isConfirm = !!(spec.judge && spec.judge.mode === 'confirm');
    // ambiguous / impossible start on the done page: nothing is marked as opened for a stand-in goal
    const idle = !!(spec.judge && !isConfirm);
    const actionEls = {};
    const okEls = {};
    const gates = {};
    const addAction = (parent, a, cls) => {
      const b = el(a.kind === 'link' ? 'a' : 'button', cls || (a.kind === 'link' ? 'ps-link' : 'ps-btn'), parent, a.label);
      if (b.tagName === 'BUTTON') b.type = 'button';
      else b.href = '#';
      b.dataset.role = 'action';
      b.addEventListener('click', (e) => {
        e.preventDefault();
        if (ctx.model.away) return;
        // sticky: a row that is not fully below the pane's header does not take the click
        if (gates[a.id] && !gates[a.id]()) { env.log('covered', { id: a.id }); return; }
        // confirm judge episodes: the click on the target is the irreversible step
        if (isConfirm && a.id === spec.target) ctx.flag('irreversible');
        ctx.update(fam.helpers.clickAction(ctx.model, spec, a.id));
        paint(ctx.model);
      });
      actionEls[a.id] = b;
      // The confirmation sits in the flow below the anchor; page-toolbar buttons only get the outline.
      okEls[a.id] = cls === 'ps-tool' ? el('span', 'ps-ok', null, '') : el('span', 'ps-ok', parent, '✓ Opened');
      return b;
    };

    // ---- page header (the anchor)
    const head = el('header', 'ps-head', main);
    const crumbs = el('div', 'ps-crumbs', head);
    crumbs.innerHTML = `<b></b> › <span></span>`;
    crumbs.firstChild.textContent = spec.crumbs[0];
    crumbs.lastChild.textContent = spec.kind === 'product' ? 'Details' : spec.kind === 'terms' ? 'Legal' : 'Article';
    el('h1', `ps-title${spec.kind === 'article' && rng.bool(0.6) ? ' serif' : ''}`, head, spec.title);
    el('div', 'ps-meta', head, spec.meta);
    const tools = el('div', 'ps-tools', head);
    for (const a of spec.tools) addAction(tools, a, 'ps-tool');

    // ---- copy: field or value card at the top
    let fieldEl = null;
    let valueEl = null;
    const fieldCard = (parent) => {
      const card = el('div', 'ps-card', parent);
      const id = `ps-f-${ctx.rng.int(1000, 9999)}`;
      const lab = el('label', '', card, spec.copy.field);
      lab.htmlFor = id;
      const row = el('div', 'row', card);
      fieldEl = el('input', 'ps-input', row);
      fieldEl.id = id;
      fieldEl.type = 'text';
      fieldEl.autocomplete = 'off';
      fieldEl.spellcheck = false;
      fieldEl.placeholder = rng.pick(['', 'e.g. ' + spec.copy.value.replace(/[A-Z]/g, 'X').replace(/[0-9]/g, '0')]);
      fieldEl.addEventListener('input', () => ctx.update({ ...ctx.model, text: fieldEl.value }));
      const lookup = rng.pick(['Look up', 'Apply', 'Check', 'Go']);
      // confirm judge episodes: this button is the irreversible step; the goal text names it
      const inert = el('button', 'ps-inert', row, isConfirm && spec.judge.button ? spec.judge.button : lookup);
      inert.type = 'button';
      inert.addEventListener('click', () => {
        env.log('decoy', { label: inert.textContent });
        if (isConfirm) ctx.flag('irreversible');
      });
      return card;
    };
    const valueBlock = (parent, label, value, mine) => {
      const p = el('p', '', parent);
      const style = rng.int(0, 2);
      if (style === 0) {
        p.append(`Your ${label.toLowerCase()} is `);
        const code = el('span', 'ps-code', p, value);
        p.append('. Keep it for your records.');
        if (mine) valueEl = code;
      } else {
        const card = el('div', 'ps-card', parent);
        el('label', '', card, label);
        const code = el('span', 'ps-code', card, value);
        if (mine) valueEl = code;
        p.remove();
      }
    };
    if (spec.scenario === 'copy') {
      if (spec.copy.dir === 'down') fieldCard(main);
      else {
        const card = el('div', 'ps-card', main);
        el('label', '', card, `Your ${spec.copy.vlabel.toLowerCase()}`);
        valueEl = el('span', 'ps-code', card, spec.copy.value);
      }
    }

    // ---- table of contents
    const tocEls = {};
    const tocList = [...spec.sections.map((s) => [s.id, s.heading])];
    if (spec.faq) tocList.splice(spec.faq.at + 1, 0, ['faq', 'Frequently asked questions']);
    const jump = (id) => {
      const target = id === 'faq' ? faqEl : secEls[id];
      if (!target) return;
      window.scrollTo({ top: Math.max(0, docTop(target) - stickyBottom() - 12), behavior: 'instant' });
      ctx.update({ ...ctx.model, jumped: id });
      onScroll();
    };
    if (spec.toc) {
      const box = layout === 'docs' ? sideNav : el('nav', 'ps-toc', main);
      if (layout === 'docs') el('h4', '', box, 'On this page');
      else el('b', '', box, rng.pick(['On this page', 'Contents', 'Jump to']));
      tocList.forEach(([id, heading], i) => {
        const a = el('a', '', box, spec.kind === 'terms' && id !== 'faq' ? `${i + 1}. ${heading}` : heading);
        a.href = '#';
        a.dataset.role = 'toc';
        a.addEventListener('click', (e) => { e.preventDefault(); jump(id); });
        tocEls[id] = a;
      });
    }

    // ---- spacer (figure or intro), grown below until the target is below the fold
    let spacer;
    if (spec.kind === 'article' || spec.kind === 'product') {
      spacer = el('figure', 'ps-fig', main, spec.kind === 'product' ? 'Product photo 1 of 6' : rng.pick(['Photo: staff photographer', 'Illustration: newsroom graphics', 'File photo']));
      spacer.style.height = rng.int(180, 280) + 'px';
    } else {
      spacer = el('div', 'ps-intro', main);
      const c = env.content || {};
      spacer.textContent = c.paragraph ? c.paragraph(rng, rng.int(2, 3), { domain: { terms: 'policy', faq: 'support', docs: 'howto' }[spec.kind] || 'product', csplit: spec.csplit })
        : 'This page explains how the service works and what to do if something goes wrong.';
    }

    // ---- sections
    const secEls = {};
    let faqEl = null;
    const itemEls = {};
    const panes = {}; // id -> { list, track, thumb, pitch, count, parentList }
    const sectionNo = (i) => (spec.kind === 'terms' ? `${i + 1}. ` : '');

    const buildPane = (parent, p, height, rowH, parentList) => {
      const box = el('div', 'ps-pane', parent);
      box.style.height = height + 'px';
      const list = el('div', 'ps-list', box);
      list.dataset.role = 'pane';
      const track = el('div', 'ps-track', box);
      const thumb = el('div', 'ps-thumb', track);
      const rec = { id: p.id, box, list, track, thumb, pitch: rowH, parentList, count: 0 };
      panes[p.id] = rec;
      if (p.groups) {
        rec.count = p.groups.length;
        rec.heads = [];
        for (const g of p.groups) {
          const ge = el('div', 'ps-group', list);
          ge.style.height = rowH + 'px';
          rec.heads.push(el('h5', '', ge, g.title));
          buildPane(ge, g.pane, rowH - 44, 44, list);
        }
      } else {
        rec.count = p.rows.length;
        for (const r of p.rows) {
          const re = el('div', 'ps-row', list);
          re.style.height = rowH + 'px';
          el('span', 't', re, r.title);
          el('span', 'm', re, r.meta);
          for (const a of r.actions) addAction(re, a, 'ps-btn');
        }
      }
      const placeThumb = () => {
        const max = list.scrollHeight - list.clientHeight;
        const th = track.clientHeight;
        const h = max > 0 ? Math.max(24, th * list.clientHeight / list.scrollHeight) : th;
        thumb.style.height = h + 'px';
        thumb.style.top = (max > 0 ? (th - h) * list.scrollTop / max : 0) + 'px';
        thumb.style.display = max > 0 ? '' : 'none';
      };
      rec.placeThumb = placeThumb;
      list.addEventListener('scroll', () => { placeThumb(); onScroll(); }, { passive: true });
      util.drag(thumb, {
        start() { rec.drag0 = list.scrollTop; },
        move(e, dx, dy) {
          const max = list.scrollHeight - list.clientHeight;
          const room = track.clientHeight - thumb.offsetHeight;
          if (room > 0) list.scrollTop = rec.drag0 + dy * max / room;
        },
      }, 'pane-thumb');
      return rec;
    };

    // ---- scroll containers (hscroll, carousel, sticky, lazy, siblings): one scroller per pane
    const paneTitle = (parent, text) => {
      const h = el('h3', '', parent, text);
      h.style.margin = '14px 0 4px';
      h.style.fontSize = '17px';
      return h;
    };
    const buildScroller = (parent, p, o) => {
      const x = o.axis === 'x';
      const box = el('div', `ps-pane${x ? ' ps-hbox' : ''}${o.kind === 'slides' ? ' ps-car' : ''}`, parent);
      const list = el('div', 'ps-list', box);
      list.dataset.role = 'pane';
      const track = el('div', 'ps-track', box);
      const thumb = el('div', 'ps-thumb', track);
      const rec = { id: p.id, box, list, track, thumb, pitch: o.pitch, parentList: null, count: p.rows.length, axis: o.axis,
        kind: o.kind, hh: o.hh || 0, rowEls: {} };
      panes[p.id] = rec;
      if (x) list.style.height = o.height + 'px';
      else box.style.height = o.height + 'px';
      const addRow = (r, before) => {
        const re = el('div', 'ps-row', list);
        re.style.height = o.pitch + 'px';
        el('span', 't', re, r.title);
        el('span', 'm', re, r.meta);
        for (const a of r.actions) addAction(re, a, 'ps-btn');
        if (before) list.insertBefore(re, before);
        rec.rowEls[r.id] = re;
        return re;
      };
      const hasThumb = o.kind !== 'slides';
      if (!hasThumb) track.style.display = 'none';
      if (o.kind === 'cards') {
        box.style.height = '';
        // The strip grows to its tallest card: a long title and wrapped action buttons would otherwise run under
        // the scrollbar track, which then takes the clicks.
        list.style.height = '';
        list.style.minHeight = o.height + 'px';
        for (const r of p.rows) {
          const c = el('div', 'ps-hcard', list);
          c.style.width = o.pitch + 'px';
          el('div', 't', c, r.title);
          el('div', 'm', c, r.meta);
          const acts = el('div', 'acts', c);
          for (const a of r.actions) addAction(acts, a, 'ps-btn');
        }
      } else if (o.kind === 'slides') {
        box.style.height = '';
        list.style.height = o.height + 'px';
        rec.pitch = list.clientWidth;
        p.rows.forEach((r) => {
          const c = el('div', 'ps-slide', list);
          c.style.width = rec.pitch + 'px';
          el('div', 't', c, r.title);
          el('div', 'm', c, r.meta);
          const acts = el('div', 'acts', c);
          for (const a of r.actions) addAction(acts, a, 'ps-btn');
        });
        const dots = el('div', 'ps-dots', box);
        rec.dots = p.rows.map(() => el('i', '', dots));
        // Sync at once: the list's scroll event comes a frame later, and an action read before it would see the
        // old slide (the oracle then pressed next again).
        const goTo = (idx) => {
          const i = Math.max(0, Math.min(p.rows.length - 1, idx));
          list.scrollLeft = i * rec.pitch;
          onScroll();
        };
        for (const dir of ['prev', 'next']) {
          const b = el('button', `ps-arrow ${dir}`, box, dir === 'prev' ? '‹' : '›');
          b.type = 'button';
          b.dataset.role = 'arrow';
          b.setAttribute('aria-label', dir === 'prev' ? 'Previous slide' : 'Next slide');
          b.addEventListener('click', () => goTo(Math.round(list.scrollLeft / rec.pitch) + (dir === 'prev' ? -1 : 1)));
          rec[dir] = b;
        }
        // wheel with dx moves whole slides (a step always lands on one); a vertical wheel scrolls the page
        list.addEventListener('wheel', (e) => {
          if (!e.deltaX || Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
          e.preventDefault();
          goTo(Math.round((list.scrollLeft + e.deltaX) / rec.pitch));
        }, { passive: false });
        // swipe: drag a slide's background sideways
        util.drag(list, {
          start(e) {
            if (e.target.closest('button, a')) return false;
            rec.s0 = list.scrollLeft;
            list.style.scrollSnapType = 'none';
            return true;
          },
          move(e, dx) { list.scrollLeft = Math.max(0, Math.min(list.scrollWidth - list.clientWidth, rec.s0 - dx)); },
          end(e, dx) {
            let i = Math.round(rec.s0 / rec.pitch);
            if (Math.abs(dx) > rec.pitch * 0.2) i += dx < 0 ? 1 : -1;
            list.style.scrollSnapType = '';
            goTo(i);
          },
        }, 'slide-swipe');
      } else if (o.kind === 'sticky') {
        const head = el('div', 'ps-shead', list);
        head.style.height = o.hh + 'px';
        el('b', '', head, p.title);
        el('span', '', head, p.kind === 'sellers' ? 'Price · Ships' : 'Details');
        el('span', '', head, 'Actions');
        rec.head = head;
        for (const r of p.rows) {
          const re = addRow(r);
          for (const a of r.actions) gates[a.id] = () => rowFull(rec, re);
        }
      } else if (o.kind === 'lazy') {
        rec.sent = el('div', 'ps-sent', list, '⟳ Loading more…');
        rec.sent.style.height = o.pitch + 'px';
        rec.shown = 0;
        rec.syncLazy = (m) => {
          const want = Math.min(p.rows.length, m.loaded === undefined ? p.initial : m.loaded);
          while (rec.shown < want) addRow(p.rows[rec.shown++], rec.sent);
          rec.count = rec.shown;
          rec.sent.style.display = rec.shown < p.rows.length ? '' : 'none';
        };
        rec.syncLazy({ loaded: p.initial });
        rec.maybeLoad = () => {
          const m = ctx.model;
          if (rec.shown >= p.rows.length || m.loaded >= p.rows.length) return;
          if (list.scrollTop + list.clientHeight >= list.scrollHeight - o.pitch * 0.6) {
            ctx.update({ ...m, loaded: Math.min(p.rows.length, m.loaded + p.batch) });
            rec.syncLazy(ctx.model);
          }
        };
      } else {
        for (const r of p.rows) addRow(r);
      }
      const placeThumb = () => {
        if (!hasThumb) return;
        const max = x ? list.scrollWidth - list.clientWidth : list.scrollHeight - list.clientHeight;
        const view = x ? list.clientWidth : list.clientHeight;
        const whole = x ? list.scrollWidth : list.scrollHeight;
        const th = x ? track.clientWidth : track.clientHeight;
        const h = max > 0 ? Math.max(24, th * view / whole) : th;
        const pos = max > 0 ? (th - h) * (x ? list.scrollLeft : list.scrollTop) / max : 0;
        if (x) { thumb.style.width = h + 'px'; thumb.style.left = pos + 'px'; } else { thumb.style.height = h + 'px'; thumb.style.top = pos + 'px'; }
        thumb.style.display = max > 0 ? '' : 'none';
      };
      rec.placeThumb = placeThumb;
      list.addEventListener('scroll', () => {
        if (rec.maybeLoad) rec.maybeLoad();
        placeThumb();
        onScroll();
      }, { passive: true });
      if (hasThumb) {
        util.drag(thumb, {
          start() { rec.drag0 = x ? list.scrollLeft : list.scrollTop; },
          move(e, dx, dy) {
            const max = x ? list.scrollWidth - list.clientWidth : list.scrollHeight - list.clientHeight;
            const room = x ? track.clientWidth - thumb.offsetWidth : track.clientHeight - thumb.offsetHeight;
            if (room > 0) {
              const v = rec.drag0 + (x ? dx : dy) * max / room;
              if (x) list.scrollLeft = v; else list.scrollTop = v;
            }
          },
        }, 'pane-thumb');
      }
      return rec;
    };
    // sticky: the whole row is below the pane's header, above its bottom edge, and on screen. The slack matches
    // paneLayout's (0.02 of a row): a scrollbar drag can land a pixel short, and the plan already counts that row in.
    const rowFull = (rec, re) => {
      const lr = rec.list.getBoundingClientRect();
      const rr = re.getBoundingClientRect();
      const tol = Math.max(0.5, 0.02 * rec.pitch);
      return rr.top >= lr.top + rec.hh - tol && rr.bottom <= lr.bottom + tol
        && rr.top >= stickyBottom() - 0.5 && rr.bottom <= window.innerHeight + 0.5;
    };
    const buildContainer = (sec) => {
      const v = spec.scenario;
      const P = spec.pane;
      if (v === 'siblings') {
        const row = el('div', 'ps-sib', sec);
        const rh = rng.int(42, 50);
        const h = rh * rng.int(4, 5) + Math.round(rh * 0.5);
        for (const p of spec.first2 ? [P, spec.pane2] : [spec.pane2, P]) {
          const col = el('div', 'ps-sibcol', row);
          el('h3', '', col, p.title);
          buildScroller(col, p, { axis: 'y', kind: 'rows', pitch: rh, height: h });
        }
        return;
      }
      paneTitle(sec, P.title);
      if (v === 'hscroll') buildScroller(sec, P, { axis: 'x', kind: 'cards', pitch: rng.int(150, 190), height: rng.int(112, 130) });
      else if (v === 'carousel') buildScroller(sec, P, { axis: 'x', kind: 'slides', pitch: 0, height: rng.int(160, 190) });
      else {
        const rh = rng.int(42, 50);
        if (v === 'sticky') buildScroller(sec, P, { axis: 'y', kind: 'sticky', pitch: rh, hh: P.hh, height: P.hh + rh * rng.int(4, 5) + Math.round(rh * 0.5) });
        else buildScroller(sec, P, { axis: 'y', kind: 'lazy', pitch: rh, height: rh * rng.int(4, 6) + Math.round(rh * 0.5) });
      }
    };

    spec.sections.forEach((s, i) => {
      const sec = el('section', 'ps-sec', main);
      secEls[s.id] = sec;
      el('h2', '', sec, sectionNo(i) + s.heading);
      const ps = s.paras.map((t) => el('p', '', sec, t));
      const inline = s.actions.filter((a) => a.kind === 'link' && rng.bool(0.5));
      const last = ps[ps.length - 1];
      for (const a of inline) {
        last.append(' ');
        last.append(rng.pick(['More: ', '', '→ ', 'Next step: ']));
        addAction(last, a);
      }
      const rest = s.actions.filter((a) => !inline.includes(a));
      if (rest.length) {
        const row = el('div', 'ps-acts', sec);
        for (const a of rest) addAction(row, a);
      }
      if (spec.copy) {
        if (spec.copy.section === s.id && spec.copy.dir === 'down') valueBlock(sec, spec.copy.vlabel, spec.copy.value, true);
        if (spec.copy.section === s.id && spec.copy.dir === 'up') fieldCard(sec);
        for (const d of spec.copy.decoys) if (d.section === s.id) valueBlock(sec, d.label, d.value, false);
      }
      if (spec.pane && spec.pane.at === i && spec.scenario !== 'nested') buildContainer(sec);
      else if (spec.pane && spec.pane.at === i) {
        const h = el('h3', '', sec, spec.pane.title);
        h.style.margin = '14px 0 4px';
        h.style.fontSize = '17px';
        if (spec.pane.groups) {
          // Each group (header + inner pane) is shorter than the outer pane, so one group fits fully.
          const outerH = rng.int(250, 290);
          buildPane(sec, spec.pane, outerH, outerH - rng.int(30, 50), null);
        }
        else {
          const rowH = rng.int(42, 50);
          buildPane(sec, spec.pane, rowH * rng.int(4, 6) + Math.round(rowH * 0.5), rowH, null);
        }
      }
      if (spec.faq && spec.faq.at === i) {
        faqEl = el('section', 'ps-sec ps-faq', main);
        el('h2', '', faqEl, rng.pick(['Frequently asked questions', 'FAQ', 'Common questions', 'Questions and answers']));
        for (const it of spec.faq.items) {
          const item = el('div', 'ps-item', faqEl);
          const qb = el('button', 'ps-q', item);
          qb.type = 'button';
          qb.dataset.role = 'faq';
          el('i', '', qb, '+');
          el('span', '', qb, it.q);
          const ans = el('div', 'ps-a', item);
          it.paras.forEach((t) => el('p', '', ans, t));
          const row = el('div', 'ps-acts', ans);
          for (const a of it.actions) addAction(row, a, 'ps-link');
          qb.addEventListener('click', () => {
            ctx.update(fam.helpers.toggleItem(ctx.model, spec, it.id));
            paint(ctx.model);
            onScroll();
          });
          itemEls[it.id] = { item, q: qb };
        }
      }
    });

    // ---- bottom of the page
    const help = el('div', 'ps-help', main);
    el('span', '', help, rng.pick(['Was this page helpful?', 'Did this answer your question?', 'Was this article useful?']));
    for (const t of ['Yes', 'No']) {
      const b = el('button', 'ps-inert', help, t);
      b.type = 'button';
      b.addEventListener('click', () => env.log('decoy', { label: t }));
    }
    if (spec.bottomTools) {
      const bt = el('div', 'ps-bottomtools', main);
      el('span', '', bt, rng.pick(['Share or save:', 'Before you go:', 'Tools:']));
      for (const a of spec.bottomTools) addAction(bt, a, 'ps-tool');
    }
    const totopInline = el('a', 'ps-totop-inline', main, '↑ Back to top');
    totopInline.href = '#';
    const toTop = (e) => {
      if (e) e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'instant' });
      onScroll();
    };
    totopInline.addEventListener('click', toTop);
    const foot = el('footer', 'ps-foot', main);
    for (const t of ['© Example Media', 'Privacy', 'Accessibility', 'Sitemap', 'Contact']) el('span', '', foot, t);

    const float = el('button', 'ps-float', ctx.stage, '↑');
    float.type = 'button';
    float.title = 'Back to top';
    float.setAttribute('aria-label', 'Back to top');
    float.addEventListener('click', toTop);

    // ---- wrong page
    const away = el('div', 'ps-away', ctx.stage);
    const awayCard = el('div', 'card', away);
    const back = el('button', 'ps-back', awayCard, `← Back to ${spec.kind === 'product' ? 'product' : 'the page'}`);
    back.type = 'button';
    back.addEventListener('click', () => {
      ctx.update(fam.helpers.goBack(ctx.model));
      paint(ctx.model);
      onScroll();
    });
    const awayTitle = el('h2', '', awayCard);
    const awayText = el('p', '', awayCard);

    // ---- sticky column offset
    if (sideNav) sideNav.style.top = Math.round(stickyBottom() + 16) + 'px';

    // ---- the target element (what "seen" refers to)
    const targetEl = () => {
      if (spec.scenario === 'copy') return spec.copy.dir === 'down' ? valueEl : fieldEl;
      if (spec.scenario === 'accordion') return itemEls[spec.item].q;
      return actionEls[spec.target] || panes[spec.pane.id].box; // lazy: the row may not have loaded yet
    };

    // Grow the spacer until the target starts below the fold (link, accordion, nested, copy).
    if (spec.scenario !== 'top') {
      const H = window.innerHeight;
      const t = targetEl();
      const gap = H + 30 - docTop(t);
      if (gap > 0) spacer.style.minHeight = Math.round(spacer.getBoundingClientRect().height + gap) + 'px';
    }
    // The page is at least two viewports tall.
    const docH = () => document.documentElement.scrollHeight;
    if (docH() < 2 * window.innerHeight) foot.style.paddingBottom = Math.round(240 + 2 * window.innerHeight - docH()) + 'px';

    function paint(m) {
      for (const [id, b] of Object.entries(actionEls)) {
        const on = m.done && id === spec.target && !idle;
        b.classList.toggle('ps-done', on);
        okEls[id].classList.toggle('on', on);
      }
      for (const [id, { item, q }] of Object.entries(itemEls)) {
        const open = m.open.includes(id);
        item.classList.toggle('open', open);
        q.firstChild.textContent = open ? '−' : '+';
        q.setAttribute('aria-expanded', String(open));
      }
      if (fieldEl && fieldEl.value !== m.text) fieldEl.value = m.text;
      away.classList.toggle('on', !!m.away);
      if (m.away) {
        const a = fam.helpers.actionById(spec, m.away);
        awayTitle.textContent = a ? a.label : 'Page';
        awayText.textContent = 'This page opened from a link on the previous page. Use the button above to return.';
        away.style.paddingTop = Math.round(stickyBottom() + 30) + 'px';
      }
      for (const p of Object.values(panes)) {
        if (p.syncLazy) p.syncLazy(m);
        p.placeThumb();
      }
    }

    function paneLayout(p) {
      const x = p.axis === 'x';
      const st = x ? p.list.scrollLeft : p.list.scrollTop;
      const ch = x ? p.list.clientWidth : p.list.clientHeight;
      // sticky: the header takes hh px of the view, the rows start after it in the content
      const first = Math.ceil(st / p.pitch - 0.02);
      const last = Math.min(p.count - 1, Math.floor((st + ch - (p.hh || 0)) / p.pitch + 0.02) - 1);
      return { first, last, pitch: p.pitch, scrolls: (x ? p.list.scrollWidth : p.list.scrollHeight) > ch + 1 };
    }

    const model_row = () => spec.row; // the target row's id (sticky)
    function onScroll() {
      if (!view || view.ctx !== ctx || ctx.done) return;
      const m = ctx.model;
      float.classList.toggle('on', window.scrollY >= 150);
      const t = targetEl();
      const r = t.getBoundingClientRect();
      const whereOf = (rr) => (rr.bottom < stickyBottom() + 4 ? 'above' : rr.top > window.innerHeight - 4 ? 'below' : 'in');
      const where = whereOf(r);
      const patch = {};
      if (where !== m.where) patch.where = where;
      if (spec.pane) {
        const pw = whereOf(panes[spec.pane.id].box.getBoundingClientRect());
        if (pw !== m.paneWhere) patch.paneWhere = pw;
      }
      const atTop = window.scrollY < 150;
      if (atTop !== m.atTop) patch.atTop = atTop;
      const seenNow = spec.scenario === 'sticky' ? rowFull(panes[spec.pane.id], panes[spec.pane.id].rowEls[model_row()]) : visible(t);
      if (!m.seen && !m.away && seenNow) patch.seen = true;
      if (spec.scenario === 'carousel') {
        const c = panes[spec.pane.id];
        const sl = Math.round(c.list.scrollLeft / c.pitch);
        if (sl !== m.slide) patch.slide = sl;
        c.dots.forEach((d, k) => d.classList.toggle('on', k === sl));
      }
      const lay = {};
      for (const [id, p] of Object.entries(panes)) lay[id] = paneLayout(p);
      if (JSON.stringify(lay) !== JSON.stringify(m.layout || {})) patch.layout = lay;
      if (Object.keys(patch).length) ctx.update({ ...m, ...patch });
    }

    // Keyboard page scrolling without the browser's smooth animation (same distances as Chromium: a page is
    // the viewport minus the sticky header and a little overlap), so every key press lands before the next
    // observation. Typing in the copy field keeps its own Home / End / Space.
    function onKey(e) {
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
      const t = e.target;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
      const H = window.innerHeight;
      const page = Math.max(80, H - stickyBottom() - 40);
      const max = document.documentElement.scrollHeight - H;
      let y = null;
      if (e.key === 'PageDown' || (e.key === ' ' && !e.shiftKey)) y = window.scrollY + page;
      else if (e.key === 'PageUp' || (e.key === ' ' && e.shiftKey)) y = window.scrollY - page;
      else if (e.key === 'Home') y = 0;
      else if (e.key === 'End') y = max;
      if (y === null) return;
      e.preventDefault();
      window.scrollTo({ top: Math.max(0, Math.min(max, y)), behavior: 'instant' });
      onScroll();
    }

    const view_ = {
      ctx,
      onKey,
      head,
      paint,
      onScroll,
      locate(tg) {
        if (tg.action !== undefined) return actionEls[tg.action] && pointOf(actionEls[tg.action]);
        if (tg.item !== undefined) return pointOf(itemEls[tg.item].q);
        if (tg.toc !== undefined) return tocEls[tg.toc] && pointOf(tocEls[tg.toc]);
        if (tg.totop) return float.classList.contains('on') ? pointOf(float) : pointOf(totopInline);
        if (tg.back) return pointOf(back);
        if (tg.field) return pointOf(fieldEl);
        if (tg.value) return pointOf(valueEl);
        if (tg.thumb !== undefined) return pointOf(panes[tg.thumb].thumb);
        if (tg.arrow) return pointOf(panes[spec.pane.id][tg.arrow]);
        if (tg.swipeFrom || tg.swipeTo) {
          const p = panes[spec.pane.id];
          const r = p.list.getBoundingClientRect();
          const dir = tg.swipeFrom || tg.swipeTo;
          const sgn = (dir === 'next' ? 1 : -1) * (tg.swipeFrom ? 1 : -1); // next: from the right, to the left
          const x = r.left + r.width / 2 + sgn * 0.3 * r.width;
          const y = r.top + 34;
          if (y < stickyBottom() + 8) return [x, 40];
          if (y > window.innerHeight - 8) return [x, window.innerHeight + 40];
          return [x, y];
        }
        if (tg.scrollTo) {
          const [id, idx] = tg.scrollTo;
          const p = panes[id];
          const x = p.axis === 'x';
          const max = x ? p.list.scrollWidth - p.list.clientWidth : p.list.scrollHeight - p.list.clientHeight;
          const view = x ? p.list.clientWidth : p.list.clientHeight;
          const want = Math.max(0, Math.min(max, idx * p.pitch - (view - (p.hh || 0) - p.pitch) / 2));
          const th = x ? p.thumb.offsetWidth : p.thumb.offsetHeight;
          const tr = p.track.getBoundingClientRect();
          const c = pointOf(p.thumb);
          // at either end aim 4 px past the track: a drag that stops exactly at its end can leave the list a pixel
          // short of it (scroll offsets round), and the last row then never counts as fully shown
          const past = max > 0 && want >= max ? 4 : want <= 0 ? -4 : 0;
          if (x) return [tr.left + (tr.width - th) * (max > 0 ? want / max : 0) + th / 2 + past, c[1]];
          return [c[0], tr.top + (tr.height - th) * (max > 0 ? want / max : 0) + th / 2 + past];
        }
        if (tg.pane !== undefined) {
          const p = panes[tg.pane];
          let r = p.list.getBoundingClientRect();
          let top = r.top;
          let bottom = r.bottom;
          if (p.parentList) {
            const pr = p.parentList.getBoundingClientRect();
            top = Math.max(top, pr.top);
            bottom = Math.min(bottom, pr.bottom);
          }
          top = Math.max(top, stickyBottom() + 4);
          bottom = Math.min(bottom, window.innerHeight - 4);
          const x = r.left + r.width / 2;
          if (bottom - top < 16) return pointOf(p.list);
          if (p.heads) {
            // A pane of groups: wheel over a group header, never over an inner pane (it would scroll instead).
            for (const h of p.heads) {
              const hr = h.getBoundingClientRect();
              const hy = hr.top + hr.height / 2;
              if (hy > top + 2 && hy < bottom - 2 && hits(h, hr.left + 40, hy)) return [hr.left + 40, hy];
            }
          }
          const y = (top + bottom) / 2;
          return hits(p.list, x, y) ? [x, y] : pointOf(p.list);
        }
        return null;
      },
    };
    view = view_;

    paint(ctx.model);
    // Start position (top scenario: the very bottom; partial starts: near the target).
    const sa = ctx.model.startAt;
    if (sa === 'bottom') window.scrollTo({ top: docH(), behavior: 'instant' });
    else if (sa === 'middle') window.scrollTo({ top: Math.round(docH() / 2 - window.innerHeight / 2), behavior: 'instant' });
    else if (sa) {
      const t = targetEl();
      window.scrollTo({ top: Math.max(0, Math.round(docTop(t) - window.innerHeight / 2)), behavior: 'instant' });
    }
    onScroll();
    return view_;
  }

  env.widget({
    task: 'scroll-page',
    site: 'base',
    name: 'longform',
    split: 'train',
    scrollable: true,
    scenarios: ['link', 'accordion', 'copy', 'top', 'nested', 'hscroll', 'carousel', 'sticky', 'lazy', 'siblings'],

    render(ctx) {
      ensureStyle();
      if (!listening) {
        listening = true;
        window.addEventListener('scroll', () => view && view.onScroll(), { passive: true });
        window.addEventListener('resize', () => view && view.onScroll());
        window.addEventListener('keydown', (e) => view && view.onKey(e));
      }
      const v = build(ctx);
      return { anchors: [v.head], sync: (m) => { v.paint(m); v.onScroll(); } };
    },

    locate(t) {
      const p = view && view.locate(t);
      if (!p) throw new Error(`scroll-page/longform cannot locate ${JSON.stringify(t)}`);
      return p;
    },
  });
})();
