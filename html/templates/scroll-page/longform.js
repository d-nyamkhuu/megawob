/*
 * scroll-page/longform: the shared long page, copy/FAQ blocks and native scroll containers.
 * Scenarios: link, accordion, copy, top, nested, hscroll, carousel, sticky, lazy, siblings.
 * design: {} reproduces design-scroll-page-<scenario>-01 for every scenario above, respectively.
 * Scenario presets: none; the seeded spec selects each widget on the same page shell.
 * Tokens (defaults; px unless stated):
 *   css = CSS: structural stylesheet.
 *   foreground = 'var(--fg)': text color.
 *   muted = 'var(--muted)': secondary text color.
 *   accent = 'var(--accent)': accent color.
 *   panel = 'var(--panel)': panel color.
 *   background = 'var(--bg)': input and page color.
 *   line = 'var(--line)': border color.
 *   fontFamily = null: page font family; null inherits the site font.
 *   titleSize = 30: title size in px.
 *   serifTitleSize = 33: article serif title size in px.
 *   sectionTitleSize = 21: section and FAQ title size in px.
 *   bodySize = 15.5: section body size in px.
 *   radius = 10: card, figure and rail radius in px.
 *   columnWidth = [640, 860]: rng column width range in px.
 *   minimumWidth = 420: minimum page width in px.
 *   widthInset = 52: space reserved beside the page in px.
 *   docsWidth = 196: docs navigation column width in px.
 *   docsGap = 36: docs column gap in px.
 *   railWidth = 230: related rail width in px.
 *   railGap = 34: related rail gap in px.
 *   rowHeight = [42, 50]: rng vertical row height range in px.
 *   siblingRows = [4, 5]: rng sibling and sticky visible-row count range.
 *   verticalRows = [4, 6]: rng nested and lazy visible-row count range.
 *   cardWidth = [150, 190]: rng horizontal card width range in px.
 *   cardHeight = [112, 130]: rng horizontal strip minimum height range in px.
 *   slideHeight = [160, 190]: rng carousel height range in px.
 *   groupHeight = [250, 290]: rng nested group outer height range in px.
 *   groupInset = [30, 50]: rng nested group row inset range in px.
 *   figureHeight = [180, 280]: rng figure height range in px.
 *   thumbMinimum = 24: minimum scrollbar thumb length in px.
 *   openedText = '✓ Opened': action confirmation text.
 *   contentsLabels = ['On this page', 'Contents', 'Jump to']: rng inline contents labels.
 *   railLabels = ['Related', 'Popular now', 'More to explore', 'You may also like']: rng related rail headings.
 *   faqLabels = ['Frequently asked questions', 'FAQ', 'Common questions', 'Questions and answers']: rng FAQ headings.
 *   inlinePrefixes = ['More: ', '', '→ ', 'Next step: ']: rng prefixes before inline actions.
 *   helpLabels = ['Was this page helpful?', 'Did this answer your question?', 'Was this article useful?']: rng feedback prompts.
 *   feedbackLabels = ['Yes', 'No']: inert feedback buttons.
 *   bottomLabels = ['Share or save:', 'Before you go:', 'Tools:']: rng bottom toolbar labels.
 *   footerLabels = ['© Example Media', 'Privacy', 'Accessibility', 'Sitemap', 'Contact']: inert footer labels.
 *   topText = '↑ Back to top': inline return label.
 *   topLabel = 'Back to top': floating return title and accessible name.
 *   topIcon = '↑': floating return icon.
 *   loadingText = '⟳ Loading more…': lazy loading sentinel text.
 * Parts (overrides: (base, S) => replacement; all calls use P):
 * st is the episode state: ctx/util/spec/fam/rng/el, frame elements, action/FAQ/contents maps,
 * panes and copy targets. Element builders return the element or record described below.
 *   styles(ctx): install tokenized structural CSS once; no episode DOM.
 *   docTop(el): return document y of an element.
 *   stickyBottom(): return the site header bottom, or zero.
 *   hits(el, x, y): return whether the point hits the element or a descendant.
 *   candidates(el): return line-box centre and end candidate points.
 *   pointOf(el): return an unobscured point or an offscreen scroll hint.
 *   visible(el): return whether any candidate point is visible.
 *   frame(st): return wrap, main, sideNav and seeded layout; preserve all layout draws.
 *   rail(st, wrap): draw the related-links panel with its original rng draws.
 *   actionElement(st, parent, a, cls): return a link or button with action semantics.
 *   action(st, parent, a, cls): wire action updates, sticky gates and confirmation; return the control.
 *   confirmation(st, parent, cls): return the confirmation span; tool confirmations stay detached.
 *   header(st): return the stable page-header anchor, including the seeded title and toolbar.
 *   fieldCard(st, parent): return the copy card layout and call its control parts; preserve id draw.
 *   copyInput(st, row, id): return a bound copy text input; preserve placeholder draw.
 *   lookup(st, row): return the lookup control with confirm flagging; preserve label draw.
 *   valueBlock(st, parent, label, value, mine): draw inline or card copy value; save the target element when mine.
 *   copyStart(st): draw the top copy field or value card.
 *   jump(st, id): scroll a contents destination into view and update jumped.
 *   toc(st): draw sidebar or inline contents and bind jump links.
 *   spacer(st): return the figure or intro; preserve caption, size and paragraph draws.
 *   paneFrame(st, parent, className): return the pane box, list, track and thumb.
 *   decorated(st, element, kind, data): item decoration hook for row, card, slide and faq; default no-op.
 *   row(st, list, r, pitch): return a vertical row with title, metadata and actions.
 *   group(st, list, g, rowH): return a group heading after building its inner pane.
 *   pane(st, parent, p, height, rowH, parentList): build a nested pane, groups or rows; return its geometry record.
 *   paneTitle(st, parent, text): return the container title.
 *   card(st, list, r, width, slide): return a horizontal card or carousel slide with actions.
 *   cards(st, rec, p, o): build horizontal cards; let their tallest content determine height.
 *   slides(st, rec, p, o): build slide cards and call slideControls.
 *   arrow(st, box, dir): return a previous or next slide control with accessible semantics.
 *   slideControls(st, rec, p): build dots and arrows; bind immediate slide sync, wheel and swipe behavior.
 *   stickyHeader(st, list, p, o): return the opaque sticky header.
 *   sticky(st, rec, p, o): build rows and install full-row visibility gates.
 *   lazy(st, rec, p, o): append rows from model.loaded and load batches when the list reaches its end.
 *   addRow(st, rec, r, before): insert a row, register it for sticky visibility, and return it.
 *   placeThumb(st, rec): size and place a native-scroll-backed horizontal or vertical thumb.
 *   scrollbar(st, rec): bind scroll synchronization and thumb dragging.
 *   scroller(st, parent, p, o): build one container pane and delegate its content and behavior.
 *   rowFull(st, rec, re, hit?): return whether a complete row is below the pane's sticky header and visible (hit, a
 *   click gate's control, is what must clear the site's sticky header and the window bottom).
 *   siblings(st, sec): build two independently scrolling sibling columns with the original height draws.
 *   container(st, sec): select the scroller type and draw the original container size values.
 *   sectionCopy(st, sec, s): draw a section copy field, target value and decoys.
 *   nested(st, sec): build nested panes with the original grouped or flat height draws.
 *   faqItem(st, parent, it): draw a question and answer, bind toggling, and register the item.
 *   faq(st): draw the FAQ section and its seeded heading.
 *   section(st, s, i): draw one heading, paragraph list, inline/row actions and its scenario widget.
 *   help(st): draw the inert feedback prompt and buttons.
 *   bottomTools(st): draw the optional seeded bottom toolbar.
 *   toTop(st, e): prevent navigation and scroll instantly to the page top.
 *   footer(st): return the inline back-to-top link and inert page footer.
 *   floatButton(st): return the floating back-to-top control.
 *   away(st): return the recoverable linked-page panel and bind Back.
 *   target(st): return the current goal element, falling back to an unloaded lazy pane.
 *   docH(): return the page content height.
 *   fitPage(st): grow the spacer below the fold and ensure two viewports of page height.
 *   paint(st, m): sync action, FAQ, field, linked-page and lazy-pane DOM from the model.
 *   paneLayout(st, p): return fully visible row bounds, pitch and overflow fact.
 *   onScroll(st): mirror seen, where, atTop, slide and pane layout; ignore stale episode events.
 *   onKey(st, e): handle instant page keys while leaving editable controls alone.
 *   locate(st, tg): return an occlusion-aware action, field, scrollbar, swipe or pane point.
 *   start(st): apply the original bottom, middle or near-target start scroll.
 *   rendered(st): decoration hook after construction and start synchronization; default no-op.
 *   build(ctx): build a fresh episode state and return the page view; callbacks retain that episode.
 * S.st/ctx/spec/view read live page state; S.D/P read resolved tokens/parts. Mutate st geometry
 * when replacing layout parts so synchronization and locate continue to use the drawn elements.
 * No DOM in the factory. Keep every reference rng draw in order; extras use ctx.rng.fork(label).
 * Implementation: _longform-assets.js holds CSS and tokens; _longform-panes.js installs pane parts.
 * Named installers below keep the remaining parts in page order; S reads the resolved design and parts live.
 */
(function () {
  'use strict';

  function installGeometry(BASE, S) {
    BASE.styles = (ctx) => {
      if (document.getElementById('ps-style')) return;
      const style = document.createElement('style');
      style.id = 'ps-style';
      style.textContent = S.D.css
        .replaceAll('var(--fg)', S.D.foreground).replaceAll('var(--muted)', S.D.muted)
        .replaceAll('var(--accent)', S.D.accent).replaceAll('var(--panel)', S.D.panel)
        .replaceAll('var(--bg)', S.D.background).replaceAll('var(--line)', S.D.line)
        .replace('color: ' + S.D.foreground + '; user-select:', 'color: ' + S.D.foreground + (S.D.fontFamily ? '; font-family: ' + S.D.fontFamily : '') + '; user-select:')
        .replace('196px minmax(0, 1fr); column-gap: 36px', `${S.D.docsWidth}px minmax(0, 1fr); column-gap: ${S.D.docsGap}px`)
        .replace('minmax(0, 1fr) 230px; column-gap: 34px', `minmax(0, 1fr) ${S.D.railWidth}px; column-gap: ${S.D.railGap}px`)
        .replaceAll('font-size: 30px', `font-size: ${S.D.titleSize}px`)
        .replaceAll('font-size: 33px', `font-size: ${S.D.serifTitleSize}px`)
        .replaceAll('font-size: 21px', `font-size: ${S.D.sectionTitleSize}px`)
        .replaceAll('font-size: 15.5px', `font-size: ${S.D.bodySize}px`)
        .replaceAll('border-radius: 10px', `border-radius: ${S.D.radius}px`);
      document.head.append(style);
    };

    BASE.docTop = (el) => {
      return el.getBoundingClientRect().top + window.scrollY;
    };

    BASE.stickyBottom = () => {
      const h = document.querySelector('body > header');
      if (!h) return 0;
      const cs = getComputedStyle(h);
      return cs.position === 'sticky' || cs.position === 'fixed' ? h.getBoundingClientRect().bottom : 0;
    };

    BASE.hits = (el, x, y) => {
      const e = document.elementFromPoint(x, y);
      return !!e && (e === el || el.contains(e));
    };

    BASE.candidates = (el) => {
      const boxes = [...el.getClientRects()].filter((r) => r.width >= 1 && r.height >= 1);
      if (!boxes.length) boxes.push(el.getBoundingClientRect());
      const out = [];
      for (const r of boxes) {
        const y = r.top + r.height / 2;
        const inset = Math.min(8, r.width / 3);
        out.push([r.left + r.width / 2, y], [r.left + inset, y], [r.right - inset, y]);
      }
      return out;
    };

    BASE.pointOf = (el) => {
      const H = window.innerHeight;
      const pts = S.P.candidates(el);
      const onScreen = pts.filter(([, y]) => y >= 0 && y <= H);
      if (!onScreen.length) return pts[0];
      for (const [x, y] of onScreen) if (S.P.hits(el, x, y)) return [x, y];
      window.__psStats = window.__psStats || { occluded: 0 };
      window.__psStats.occluded++;
      const [x, y] = onScreen[0];
      return y < H / 2 ? [x, 40] : [x, H + 40];
    };

    BASE.visible = (el) => {
      if (!el) return false;
      const H = window.innerHeight;
      return S.P.candidates(el).some(([x, y]) => y >= 0 && y <= H && S.P.hits(el, x, y));
    };
  }

  function installPageHeader(BASE, S) {
    BASE.frame = (st) => {
      const { ctx, spec, rng, el } = st;
      // Workaround (base site.css): on scrollable pages '.ref-stage { flex: none }' makes the stage as wide
      // as its content inside the row-flex body, so ctx.size.width is ~0 before rendering. Let the stage fill
      // the row again and measure it ourselves.
      ctx.stage.style.flex = '1 1 0%';
      const W = ctx.stage.getBoundingClientRect().width;

      const layout = spec.kind === 'docs' && W >= 900 && spec.toc ? 'docs'
        : W >= 1060 && rng.bool(0.45) ? 'rail' : 'single';
      const wrap = el('div', `ps-wrap ${layout}`, ctx.stage);
      const side = layout === 'docs' ? S.D.docsWidth + S.D.docsGap : layout === 'rail' ? S.D.railWidth + S.D.railGap : 0;
      const colMax = rng.int(...S.D.columnWidth);
      const width = Math.max(S.D.minimumWidth, Math.min(W - S.D.widthInset, colMax + side));
      wrap.style.width = width + 'px';
      if (rng.bool(0.3)) wrap.style.marginTop = rng.int(8, 40) + 'px';

      let sideNav = null;
      if (layout === 'docs') sideNav = el('nav', 'ps-side', wrap);
      const main = el('article', 'ps-main', wrap);
      if (layout === 'rail') S.P.rail(st, wrap);
      return { wrap, main, sideNav, layout };
    };

    BASE.rail = (st, wrap) => {
      const { el, rng, spec } = st;
      const rail = el('aside', 'ps-rail', wrap);
      el('h4', '', rail, rng.pick(S.D.railLabels));
      const c = env.content || {};
      const pool = c.HEADLINES && spec.kind === 'article' ? c.HEADLINES : c.TOPICS || ['Getting started', 'Billing basics', 'Security tips'];
      for (const t of rng.sample(pool, 5)) el('span', '', rail, t);
    };

    BASE.actionElement = (st, parent, a, cls) => {
      const { el } = st;
      const b = el(a.kind === 'link' ? 'a' : 'button', cls || (a.kind === 'link' ? 'ps-link' : 'ps-btn'), parent, a.label);
      if (b.tagName === 'BUTTON') b.type = 'button';
      else b.href = '#';
      b.dataset.role = 'action';
      return b;
    };

    BASE.action = (st, parent, a, cls) => {
      const { ctx, spec, fam, isConfirm, gates, actionEls, okEls } = st;
      const b = S.P.actionElement(st, parent, a, cls);
      b.addEventListener('click', (e) => {
        e.preventDefault();
        if (ctx.model.away) return;
        // sticky: a row that is not fully below the pane's header does not take the click
        if (gates[a.id] && !gates[a.id]()) { env.log('covered', { id: a.id }); return; }
        // confirm judge episodes: the click on the target is the irreversible step
        if (isConfirm && a.id === spec.target) ctx.flag('irreversible');
        ctx.update(fam.helpers.clickAction(ctx.model, spec, a.id));
        S.P.paint(st, ctx.model);
      });
      actionEls[a.id] = b;
      // The confirmation sits in the flow below the anchor; page-toolbar buttons only get the outline.
      okEls[a.id] = S.P.confirmation(st, parent, cls);
      return b;
    };

    BASE.confirmation = (st, parent, cls) => {
      const { el } = st;
      return cls === 'ps-tool' ? el('span', 'ps-ok', null, '') : el('span', 'ps-ok', parent, S.D.openedText);
    };

    BASE.header = (st) => {
      const { el, main, spec, rng } = st;
      const head = el('header', 'ps-head', main);
      const crumbs = el('div', 'ps-crumbs', head);
      crumbs.innerHTML = `<b></b> › <span></span>`;
      crumbs.firstChild.textContent = spec.crumbs[0];
      crumbs.lastChild.textContent = spec.kind === 'product' ? 'Details' : spec.kind === 'terms' ? 'Legal' : 'Article';
      el('h1', `ps-title${spec.kind === 'article' && rng.bool(0.6) ? ' serif' : ''}`, head, spec.title);
      el('div', 'ps-meta', head, spec.meta);
      const tools = el('div', 'ps-tools', head);
      for (const a of spec.tools) S.P.action(st, tools, a, 'ps-tool');

      return head;
    };
  }

  function installCopyAndContents(BASE, S) {
    BASE.fieldCard = (st, parent) => {
      const { ctx, spec, el } = st;
      const card = el('div', 'ps-card', parent);
      const id = `ps-f-${ctx.rng.int(1000, 9999)}`;
      const lab = el('label', '', card, spec.copy.field);
      lab.htmlFor = id;
      const row = el('div', 'row', card);
      st.fieldEl = S.P.copyInput(st, row, id);
      S.P.lookup(st, row);
      return card;
    };

    BASE.copyInput = (st, row, id) => {
      const { ctx, spec, el, rng } = st;
      const input = el('input', 'ps-input', row);
      input.id = id;
      input.type = 'text';
      input.autocomplete = 'off';
      input.spellcheck = false;
      input.placeholder = rng.pick(['', 'e.g. ' + spec.copy.value.replace(/[A-Z]/g, 'X').replace(/[0-9]/g, '0')]);
      input.addEventListener('input', () => ctx.update({ ...ctx.model, text: input.value }));
      return input;
    };

    BASE.lookup = (st, row) => {
      const { ctx, spec, el, rng, isConfirm } = st;
      const lookup = rng.pick(['Look up', 'Apply', 'Check', 'Go']);
      // confirm judge episodes: this button is the irreversible step; the goal text names it
      const inert = el('button', 'ps-inert', row, isConfirm && spec.judge.button ? spec.judge.button : lookup);
      inert.type = 'button';
      inert.addEventListener('click', () => {
        env.log('decoy', { label: inert.textContent });
        if (isConfirm) ctx.flag('irreversible');
      });
      return inert;
    };

    BASE.valueBlock = (st, parent, label, value, mine) => {
      const { el, rng } = st;
      const p = el('p', '', parent);
      const style = rng.int(0, 2);
      if (style === 0) {
        p.append(`Your ${label.toLowerCase()} is `);
        const code = el('span', 'ps-code', p, value);
        p.append('. Keep it for your records.');
        if (mine) st.valueEl = code;
      } else {
        const card = el('div', 'ps-card', parent);
        el('label', '', card, label);
        const code = el('span', 'ps-code', card, value);
        if (mine) st.valueEl = code;
        p.remove();
      }
    };

    BASE.copyStart = (st) => {
      const { spec, main, el } = st;
      if (spec.copy.dir === 'down') S.P.fieldCard(st, main);
      else {
        const card = el('div', 'ps-card', main);
        el('label', '', card, `Your ${spec.copy.vlabel.toLowerCase()}`);
        st.valueEl = el('span', 'ps-code', card, spec.copy.value);
      }
    };

    BASE.jump = (st, id) => {
      const { ctx, secEls } = st;
      const target = id === 'faq' ? st.faqEl : secEls[id];
      if (!target) return;
      window.scrollTo({ top: Math.max(0, S.P.docTop(target) - S.P.stickyBottom() - 12), behavior: 'instant' });
      ctx.update({ ...ctx.model, jumped: id });
      S.P.onScroll(st);
    };

    BASE.toc = (st) => {
      const { spec, layout, sideNav, main, el, rng, tocEls } = st;
      if (!spec.toc) return;
      const tocList = [...spec.sections.map((s) => [s.id, s.heading])];
      if (spec.faq) tocList.splice(spec.faq.at + 1, 0, ['faq', 'Frequently asked questions']);

      const box = layout === 'docs' ? sideNav : el('nav', 'ps-toc', main);
      if (layout === 'docs') el('h4', '', box, 'On this page');
      else el('b', '', box, rng.pick(S.D.contentsLabels));
      tocList.forEach(([id, heading], i) => {
        const a = el('a', '', box, spec.kind === 'terms' && id !== 'faq' ? `${i + 1}. ${heading}` : heading);
        a.href = '#';
        a.dataset.role = 'toc';
        a.addEventListener('click', (e) => { e.preventDefault(); S.P.jump(st, id); });
        tocEls[id] = a;
      });
    };

    BASE.spacer = (st) => {
      const { spec, main, el, rng } = st;
      let spacer;
      if (spec.kind === 'article' || spec.kind === 'product') {
        spacer = el('figure', 'ps-fig', main, spec.kind === 'product' ? 'Product photo 1 of 6' : rng.pick(['Photo: staff photographer', 'Illustration: newsroom graphics', 'File photo']));
        spacer.style.height = rng.int(...S.D.figureHeight) + 'px';
      } else {
        spacer = el('div', 'ps-intro', main);
        const c = env.content || {};
        spacer.textContent = c.paragraph ? c.paragraph(rng, rng.int(2, 3), { domain: { terms: 'policy', faq: 'support', docs: 'howto' }[spec.kind] || 'product', csplit: spec.csplit })
          : 'This page explains how the service works and what to do if something goes wrong.';
      }

      return spacer;
    };
  }

  function installSections(BASE, S) {
    BASE.siblings = (st, sec) => {
      const { spec, rng, el } = st;
      const pane = spec.pane;

      const row = el('div', 'ps-sib', sec);
      const rh = rng.int(...S.D.rowHeight);
      const h = rh * rng.int(...S.D.siblingRows) + Math.round(rh * 0.5);
      for (const p of spec.first2 ? [pane, spec.pane2] : [spec.pane2, pane]) {
        const col = el('div', 'ps-sibcol', row);
        el('h3', '', col, p.title);
        S.P.scroller(st, col, p, { axis: 'y', kind: 'rows', pitch: rh, height: h });
      }
    };

    BASE.container = (st, sec) => {
      const { spec, rng } = st;
      const v = spec.scenario;
      const pane = spec.pane;
      if (v === 'siblings') return S.P.siblings(st, sec);
      S.P.paneTitle(st, sec, pane.title);
      if (v === 'hscroll') S.P.scroller(st, sec, pane, { axis: 'x', kind: 'cards', pitch: rng.int(...S.D.cardWidth), height: rng.int(...S.D.cardHeight) });
      else if (v === 'carousel') S.P.scroller(st, sec, pane, { axis: 'x', kind: 'slides', pitch: 0, height: rng.int(...S.D.slideHeight) });
      else {
        const rh = rng.int(...S.D.rowHeight);
        if (v === 'sticky') S.P.scroller(st, sec, pane, { axis: 'y', kind: 'sticky', pitch: rh, hh: pane.hh, height: pane.hh + rh * rng.int(...S.D.siblingRows) + Math.round(rh * 0.5) });
        else S.P.scroller(st, sec, pane, { axis: 'y', kind: 'lazy', pitch: rh, height: rh * rng.int(...S.D.verticalRows) + Math.round(rh * 0.5) });
      }
    };

    BASE.sectionCopy = (st, sec, s) => {
      const { spec } = st;
      if (spec.copy.section === s.id && spec.copy.dir === 'down') S.P.valueBlock(st, sec, spec.copy.vlabel, spec.copy.value, true);
      if (spec.copy.section === s.id && spec.copy.dir === 'up') S.P.fieldCard(st, sec);
      for (const d of spec.copy.decoys) if (d.section === s.id) S.P.valueBlock(st, sec, d.label, d.value, false);
    };

    BASE.nested = (st, sec) => {
      const { spec, rng } = st;
      S.P.paneTitle(st, sec, spec.pane.title);
      if (spec.pane.groups) {
        // Each group (header + inner pane) is shorter than the outer pane, so one group fits fully.
        const outerH = rng.int(...S.D.groupHeight);
        S.P.pane(st, sec, spec.pane, outerH, outerH - rng.int(...S.D.groupInset), null);
      }
      else {
        const rowH = rng.int(...S.D.rowHeight);
        S.P.pane(st, sec, spec.pane, rowH * rng.int(...S.D.verticalRows) + Math.round(rowH * 0.5), rowH, null);
      }
    };

    BASE.faqItem = (st, parent, it) => {
      const { el, ctx, spec, fam, itemEls } = st;
      const item = el('div', 'ps-item', parent);
      const qb = el('button', 'ps-q', item);
      qb.type = 'button';
      qb.dataset.role = 'faq';
      el('i', '', qb, '+');
      el('span', '', qb, it.q);
      const ans = el('div', 'ps-a', item);
      it.paras.forEach((t) => el('p', '', ans, t));
      const row = el('div', 'ps-acts', ans);
      for (const a of it.actions) S.P.action(st, row, a, 'ps-link');
      qb.addEventListener('click', () => {
        ctx.update(fam.helpers.toggleItem(ctx.model, spec, it.id));
        S.P.paint(st, ctx.model);
        S.P.onScroll(st);
      });
      itemEls[it.id] = { item, q: qb };

      S.P.decorated(st, item, 'faq', it);
    };

    BASE.faq = (st) => {
      const { el, main, spec, rng } = st;
      st.faqEl = el('section', 'ps-sec ps-faq', main);
      el('h2', '', st.faqEl, rng.pick(S.D.faqLabels));
      for (const it of spec.faq.items) S.P.faqItem(st, st.faqEl, it);
    };

    BASE.section = (st, s, i) => {
      const { el, main, spec, rng, secEls } = st;
      const sec = el('section', 'ps-sec', main);
      secEls[s.id] = sec;
      el('h2', '', sec, (spec.kind === 'terms' ? `${i + 1}. ` : '') + s.heading);
      const ps = s.paras.map((t) => el('p', '', sec, t));
      const inline = s.actions.filter((a) => a.kind === 'link' && rng.bool(0.5));
      const last = ps[ps.length - 1];
      for (const a of inline) {
        last.append(' ');
        last.append(rng.pick(S.D.inlinePrefixes));
        S.P.action(st, last, a);
      }
      const rest = s.actions.filter((a) => !inline.includes(a));
      if (rest.length) {
        const row = el('div', 'ps-acts', sec);
        for (const a of rest) S.P.action(st, row, a);
      }
      if (spec.copy) S.P.sectionCopy(st, sec, s);
      if (spec.pane && spec.pane.at === i) {
        if (spec.scenario === 'nested') S.P.nested(st, sec);
        else S.P.container(st, sec);
      }
      if (spec.faq && spec.faq.at === i) S.P.faq(st);
      return sec;
    };
  }

  function installFooter(BASE, S) {
    BASE.help = (st) => {
      const { el, main, rng } = st;
      const help = el('div', 'ps-help', main);
      el('span', '', help, rng.pick(S.D.helpLabels));
      for (const t of S.D.feedbackLabels) {
        const b = el('button', 'ps-inert', help, t);
        b.type = 'button';
        b.addEventListener('click', () => env.log('decoy', { label: t }));
      }
    };

    BASE.bottomTools = (st) => {
      const { spec, el, main, rng } = st;
      if (!spec.bottomTools) return;

      const bt = el('div', 'ps-bottomtools', main);
      el('span', '', bt, rng.pick(S.D.bottomLabels));
      for (const a of spec.bottomTools) S.P.action(st, bt, a, 'ps-tool');
    };

    BASE.toTop = (st, e) => {
      if (e) e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'instant' });
      S.P.onScroll(st);
    };

    BASE.footer = (st) => {
      const { el, main } = st;
      const totopInline = el('a', 'ps-totop-inline', main, S.D.topText);
      totopInline.href = '#';
      totopInline.addEventListener('click', (e) => S.P.toTop(st, e));
      const foot = el('footer', 'ps-foot', main);
      for (const t of S.D.footerLabels) el('span', '', foot, t);
      return { totopInline, foot };
    };

    BASE.floatButton = (st) => {
      const { el, ctx } = st;
      const float = el('button', 'ps-float', ctx.stage, S.D.topIcon);
      float.type = 'button';
      float.title = S.D.topLabel;
      float.setAttribute('aria-label', S.D.topLabel);
      float.addEventListener('click', (e) => S.P.toTop(st, e));

      return float;
    };

    BASE.away = (st) => {
      const { el, ctx, spec, fam } = st;
      const away = el('div', 'ps-away', ctx.stage);
      const awayCard = el('div', 'card', away);
      const back = el('button', 'ps-back', awayCard, `← Back to ${spec.kind === 'product' ? 'product' : 'the page'}`);
      back.type = 'button';
      back.addEventListener('click', () => {
        ctx.update(fam.helpers.goBack(ctx.model));
        S.P.paint(st, ctx.model);
        S.P.onScroll(st);
      });
      const awayTitle = el('h2', '', awayCard);
      const awayText = el('p', '', awayCard);

      return { away, back, awayTitle, awayText };
    };

    BASE.target = (st) => {
      const { spec, itemEls, actionEls, panes } = st;
      if (spec.scenario === 'copy') return spec.copy.dir === 'down' ? st.valueEl : st.fieldEl;
      if (spec.scenario === 'accordion') return itemEls[spec.item].q;
      return actionEls[spec.target] || panes[spec.pane.id].box; // lazy: the row may not have loaded yet
    };

    BASE.docH = () => {
      return document.documentElement.scrollHeight;
    };

    BASE.fitPage = (st) => {
      const { spec, spacer, foot } = st;
      // Grow the spacer until the target starts below the fold (link, accordion, nested, copy).
      if (spec.scenario !== 'top') {
        const H = window.innerHeight;
        const t = S.P.target(st);
        const gap = H + 30 - S.P.docTop(t);
        if (gap > 0) spacer.style.minHeight = Math.round(spacer.getBoundingClientRect().height + gap) + 'px';
      }
      // The page is at least two viewports tall.
      if (S.P.docH() < 2 * window.innerHeight) foot.style.paddingBottom = Math.round(240 + 2 * window.innerHeight - S.P.docH()) + 'px';
    };
  }

  function installSync(BASE, S) {
    BASE.paint = (st, m) => {
      const { spec, idle, actionEls, okEls, itemEls, away, fam, awayTitle, awayText, panes } = st;
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
      if (st.fieldEl && st.fieldEl.value !== m.text) st.fieldEl.value = m.text;
      away.classList.toggle('on', !!m.away);
      if (m.away) {
        const a = fam.helpers.actionById(spec, m.away);
        awayTitle.textContent = a ? a.label : 'Page';
        awayText.textContent = 'This page opened from a link on the previous page. Use the button above to return.';
        away.style.paddingTop = Math.round(S.P.stickyBottom() + 30) + 'px';
      }
      for (const p of Object.values(panes)) {
        if (p.syncLazy) p.syncLazy(m);
        p.placeThumb();
      }
    };

    BASE.paneLayout = (st, p) => {
      const x = p.axis === 'x';
      const offset = x ? p.list.scrollLeft : p.list.scrollTop;
      const ch = x ? p.list.clientWidth : p.list.clientHeight;
      // sticky: the header takes hh px of the view, the rows start after it in the content
      const first = Math.ceil(offset / p.pitch - 0.02);
      const last = Math.min(p.count - 1, Math.floor((offset + ch - (p.hh || 0)) / p.pitch + 0.02) - 1);
      return { first, last, pitch: p.pitch, scrolls: (x ? p.list.scrollWidth : p.list.scrollHeight) > ch + 1 };
    };

    BASE.onScroll = (st) => {
      const { ctx, float, spec, panes } = st;
      if (!S.view || S.view.ctx !== ctx || ctx.done) return;
      const m = ctx.model;
      float.classList.toggle('on', window.scrollY >= 150);
      const t = S.P.target(st);
      const r = t.getBoundingClientRect();
      const whereOf = (rr) => (rr.bottom < S.P.stickyBottom() + 4 ? 'above' : rr.top > window.innerHeight - 4 ? 'below' : 'in');
      const where = whereOf(r);
      const patch = {};
      if (where !== m.where) patch.where = where;
      if (spec.pane) {
        const pw = whereOf(panes[spec.pane.id].box.getBoundingClientRect());
        if (pw !== m.paneWhere) patch.paneWhere = pw;
      }
      const atTop = window.scrollY < 150;
      if (atTop !== m.atTop) patch.atTop = atTop;
      const seenNow = spec.scenario === 'sticky' ? S.P.rowFull(st, panes[spec.pane.id], panes[spec.pane.id].rowEls[spec.row]) : S.P.visible(t);
      if (!m.seen && !m.away && seenNow) patch.seen = true;
      if (spec.scenario === 'carousel') {
        const c = panes[spec.pane.id];
        const sl = Math.round(c.list.scrollLeft / c.pitch);
        if (sl !== m.slide) patch.slide = sl;
        c.dots.forEach((d, k) => d.classList.toggle('on', k === sl));
      }
      const lay = {};
      for (const [id, p] of Object.entries(panes)) lay[id] = S.P.paneLayout(st, p);
      if (JSON.stringify(lay) !== JSON.stringify(m.layout || {})) patch.layout = lay;
      if (Object.keys(patch).length) ctx.update({ ...m, ...patch });
    };

    BASE.onKey = (st, e) => {
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
      const t = e.target;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
      const H = window.innerHeight;
      const page = Math.max(80, H - S.P.stickyBottom() - 40);
      const max = document.documentElement.scrollHeight - H;
      let y = null;
      if (e.key === 'PageDown' || (e.key === ' ' && !e.shiftKey)) y = window.scrollY + page;
      else if (e.key === 'PageUp' || (e.key === ' ' && e.shiftKey)) y = window.scrollY - page;
      else if (e.key === 'Home') y = 0;
      else if (e.key === 'End') y = max;
      if (y === null) return;
      e.preventDefault();
      window.scrollTo({ top: Math.max(0, Math.min(max, y)), behavior: 'instant' });
      S.P.onScroll(st);
    };
  }

  function installLocate(BASE, S) {
    BASE.locate = (st, tg) => {
      const { actionEls, itemEls, tocEls, float, totopInline, back, panes, spec } = st;
      if (tg.action !== undefined) return actionEls[tg.action] && S.P.pointOf(actionEls[tg.action]);
      if (tg.item !== undefined) return S.P.pointOf(itemEls[tg.item].q);
      if (tg.toc !== undefined) return tocEls[tg.toc] && S.P.pointOf(tocEls[tg.toc]);
      if (tg.totop) return float.classList.contains('on') ? S.P.pointOf(float) : S.P.pointOf(totopInline);
      if (tg.back) return S.P.pointOf(back);
      if (tg.field) return S.P.pointOf(st.fieldEl);
      if (tg.value) return S.P.pointOf(st.valueEl);
      if (tg.thumb !== undefined) return S.P.pointOf(panes[tg.thumb].thumb);
      if (tg.arrow) return S.P.pointOf(panes[spec.pane.id][tg.arrow]);
      if (tg.swipeFrom || tg.swipeTo) {
        const p = panes[spec.pane.id];
        const r = p.list.getBoundingClientRect();
        const dir = tg.swipeFrom || tg.swipeTo;
        const sgn = (dir === 'next' ? 1 : -1) * (tg.swipeFrom ? 1 : -1); // next: from the right, to the left
        const x = r.left + r.width / 2 + sgn * 0.3 * r.width;
        const y = r.top + 34;
        if (y < S.P.stickyBottom() + 8) return [x, 40];
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
        const c = S.P.pointOf(p.thumb);
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
        top = Math.max(top, S.P.stickyBottom() + 4);
        bottom = Math.min(bottom, window.innerHeight - 4);
        const x = r.left + r.width / 2;
        if (bottom - top < 16) return S.P.pointOf(p.list);
        if (p.heads) {
          // A pane of groups: wheel over a group header, never over an inner pane (it would scroll instead).
          for (const h of p.heads) {
            const hr = h.getBoundingClientRect();
            const hy = hr.top + hr.height / 2;
            if (hy > top + 2 && hy < bottom - 2 && S.P.hits(h, hr.left + 40, hy)) return [hr.left + 40, hy];
          }
        }
        const y = (top + bottom) / 2;
        return S.P.hits(p.list, x, y) ? [x, y] : S.P.pointOf(p.list);
      }
      return null;
    };

    BASE.start = (st) => {
      const { ctx } = st;
      // Start position (top scenario: the very bottom; partial starts: near the target).
      const sa = ctx.model.startAt;
      if (sa === 'bottom') window.scrollTo({ top: S.P.docH(), behavior: 'instant' });
      else if (sa === 'middle') window.scrollTo({ top: Math.round(S.P.docH() / 2 - window.innerHeight / 2), behavior: 'instant' });
      else if (sa) {
        const t = S.P.target(st);
        window.scrollTo({ top: Math.max(0, Math.round(S.P.docTop(t) - window.innerHeight / 2)), behavior: 'instant' });
      }
    };

    BASE.rendered = (st) => {};
  }

  env.template('scroll-page/longform', (design, def) => {
    const { TOKENS } = env.templateLib('scroll-page/_longform-assets');
    const { installPaneRows, installCards, installRowLoading, installScrollbars } = env.templateLib('scroll-page/_longform-panes');
    let D, P;
    let view = null;
    let state = null;
    let listening = false;
    const BASE = {};
    const S = {
      get st() { return state; },
      get ctx() { return state && state.ctx; },
      get spec() { return state && state.spec; },
      get view() { return view; },
      get D() { return D; },
      get P() { return P; },
    };

    installGeometry(BASE, S);
    installPageHeader(BASE, S);
    installCopyAndContents(BASE, S);
    installPaneRows(BASE, S);
    installCards(BASE, S);
    installRowLoading(BASE, S);
    installScrollbars(BASE, S);
    installSections(BASE, S);
    installFooter(BASE, S);
    installSync(BASE, S);
    installLocate(BASE, S);

    BASE.build = (ctx) => {
      const st = {
        ctx, util: ctx.util, spec: ctx.spec, fam: env.taskDef, rng: ctx.rng, el: ctx.util.el,
        isConfirm: !!(ctx.spec.judge && ctx.spec.judge.mode === 'confirm'),
        idle: !!(ctx.spec.judge && ctx.spec.judge.mode !== 'confirm'),
        actionEls: {}, okEls: {}, gates: {}, tocEls: {}, secEls: {}, itemEls: {}, panes: {},
        fieldEl: null, valueEl: null, faqEl: null,
      };
      state = st;
      Object.assign(st, P.frame(st));
      st.head = P.header(st);
      if (st.spec.scenario === 'copy') P.copyStart(st);
      P.toc(st);
      st.spacer = P.spacer(st);
      st.spec.sections.forEach((s, i) => P.section(st, s, i));
      P.help(st);
      P.bottomTools(st);
      Object.assign(st, P.footer(st));
      st.float = P.floatButton(st);
      Object.assign(st, P.away(st));
      if (st.sideNav) st.sideNav.style.top = Math.round(P.stickyBottom() + 16) + 'px';
      P.fitPage(st);
      const v = {
        ctx,
        head: st.head,
        paint: (m) => P.paint(st, m),
        onScroll: () => P.onScroll(st),
        onKey: (e) => P.onKey(st, e),
        locate: (t) => P.locate(st, t),
      };
      view = v;
      P.paint(st, ctx.model);
      P.start(st);
      P.onScroll(st);
      P.rendered(st);
      return v;
    };

    ({ D, P } = env.templateDesign('scroll-page/longform', design, def, {
      tokens: TOKENS, base: BASE, state: S,
    }));
    return {
      scrollable: true,
      render(ctx) {
        P.styles(ctx);
        if (!listening) {
          listening = true;
          window.addEventListener('scroll', () => view && view.onScroll(), { passive: true });
          window.addEventListener('resize', () => view && view.onScroll());
          window.addEventListener('keydown', (e) => view && view.onKey(e));
        }
        const v = P.build(ctx);
        return { anchors: [v.head], sync: (m) => { v.paint(m); v.onScroll(); } };
      },
      locate(t) {
        const p = view && view.locate(t);
        if (!p) throw new Error(`scroll-page/longform cannot locate ${JSON.stringify(t)}`);
        return p;
      },
    };
  }, { uses: ['scroll-page/_longform-assets', 'scroll-page/_longform-panes'] });
})();
