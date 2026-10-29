// Design on templates/select-text/base.js: the base site's select-text widget for this scenario (it was scaffolded from
// it), with the units this site changed as parts.
env.widget({
  task: 'select-text',
  site: 'design-select-text-word-04',
  name: 'design',
  split: 'train',
  scenarios: ['word'],
  template: 'select-text/base',
  design: {
    parts: {
      'paragraphs.render': (base, S) => function render(ctx) {
        const { KICKERS, TITLES, bindSelection, ensureStyle, fillParagraph, scrollPane } = S;
        ensureStyle();
        const { rng, util, size, spec } = ctx;

        const maxW = Math.min(880, size.width - 120);
        const width = rng.int(Math.min(560, maxW), maxW);
        const serif = rng.bool(spec.source === 'message' ? 0.2 : 0.5);
        let font = rng.int(16, 19);
        const lh = rng.pick([1.5, 1.6, 1.7]);
        const marker = spec.source === 'message' ? 'none' : rng.pick(['none', 'numbered', 'pilcrow', 'indent']);
        const gap = rng.int(10, 18);
        const selAlpha = rng.int(28, 42);

        const card = util.el('div', 'gtk-document', ctx.stage);
        card.style.width = width + 'px';
        card.style.margin = `${rng.int(4, 12)}px ${rng.int(8, 30)}px`;
        // The document window owns its geometry; CSS must not override the fit pass.
        let windowTop = Math.min(209, Math.max(44, size.height - 350));
        const summaryWidth = Math.min(0.27 * (size.width - 20), 280);
        Object.assign(card.style, {
          width: Math.max(0, size.width - 20) + 'px',
          margin: `${windowTop}px 12px 12px 8px`,
          display: 'flex', flexDirection: 'column', position: 'relative',
          boxSizing: 'border-box', overflow: 'hidden', zIndex: '2',
        });
        card.style.setProperty('--gtk-summary-width', summaryWidth + 'px');
        card.style.setProperty('--hl-sel', `color-mix(in srgb, var(--accent) ${selAlpha}%, transparent)`);
        const head = util.el('div', 'hl-head', card);
        Object.assign(head.style, { display: 'flex', height: '86px', minHeight: '86px', flex: 'none',
          alignItems: 'flex-start', padding: '9px 14px', position: 'relative', boxSizing: 'border-box' });
        if (spec.source === 'message') {
          util.el('span', 'hl-kicker', head, rng.pick(['Inbox', 'Message', 'Support', 'Mail']));
          const subj = ctx.content.EMAIL_SUBJECTS ? ctx.content.pick(rng, ctx.content.EMAIL_SUBJECTS, { csplit: spec.csplit }) : 'Your request';
          util.el('span', 'hl-title', head, subj);
          util.el('span', 'hl-meta', head, rng.pick(['Today', 'Yesterday', '2 days ago', 'Mon', 'Fri']));
        } else {
          util.el('span', 'hl-kicker', head, rng.pick(KICKERS));
          const title = spec.source === 'real' && ctx.content.HEADLINES ? ctx.content.pick(rng, ctx.content.HEADLINES, { csplit: spec.csplit }) : rng.pick(TITLES);
          util.el('span', 'hl-title', head, title);
          util.el('span', 'hl-meta', head, `${spec.paragraphs.length} paragraphs`);
        }

        let pane = null;
        let host = card;
        let bar = null;
        let thumb = null;
        if (spec.pane) {
          const row = util.el('div', 'hl-panerow', card);
          Object.assign(row.style, { width: `calc(100% - ${summaryWidth}px)`,
            flex: 'none', minHeight: '0', padding: '0 6px 0 0', gap: '6px', boxSizing: 'border-box' });
          pane = util.el('div', 'hl-pane', row);
          pane.style.minWidth = '0';
          bar = util.el('div', 'hl-bar', row);
          thumb = util.el('div', 'hl-thumb', bar);
          thumb.dataset.role = 'scrollbar';
          host = pane;
        }
        const textEl = util.el('div', 'gtk-document-text', host);
        Object.assign(textEl.style, { width: pane ? '100%' : `calc(100% - ${summaryWidth}px)`,
          boxSizing: 'border-box', padding: '18px 16px', fontFamily: 'Arial, Helvetica, sans-serif',
          userSelect: 'text', cursor: 'text' });
        textEl.dataset.role = 'text';
        if (serif) textEl.classList.add('serif');
        if (marker !== 'none') textEl.classList.add(marker);
        textEl.style.setProperty('--hl-gap', gap + 'px');
        const segments = [];
        let base = 0;
        const marks = spec.marks || [];
        // Hover-only tooltips (tip scenario): a dark box under the word while the pointer is over it.
        let tipBox = null;
        const hooks = {
          tip(m, el) {
            el.addEventListener('mouseenter', () => {
              if (!tipBox) {
                tipBox = util.el('div', 'hl-tipbox', card);
                tipBox.dataset.skip = '1';
              }
              tipBox.textContent = m.tip;
              const cr = card.getBoundingClientRect();
              const r = el.getBoundingClientRect();
              tipBox.style.display = 'block';
              tipBox.style.left = Math.max(6, Math.min(cr.width - tipBox.offsetWidth - 6, r.left - cr.left)) + 'px';
              tipBox.style.top = r.bottom - cr.top + 6 + 'px';
              if (spec.ask && spec.ask.anchorAt === m.start && !ctx.model.tipSeen) ctx.update({ ...ctx.model, tipSeen: true });
            });
            el.addEventListener('mouseleave', () => { if (tipBox) tipBox.style.display = 'none'; });
          },
        };
        const grid = util.el('table', 'hl-gtk-grid', textEl);
        const gridHead = util.el('thead', '', grid);
        const headings = util.el('tr', '', gridHead);
        for (const label of ['Person', 'Role', 'Responsibilities', 'Key Milestones', 'Status']) util.el('th', '', headings, label);
        const gridBody = util.el('tbody', '', grid);
        for (const [i, ptext] of spec.paragraphs.entries()) {
          const row = util.el('tr', '', gridBody);
          util.el('td', 'hl-gtk-index', row, `Section ${i + 1}`);
          util.el('td', 'hl-gtk-role', row, 'Document');
          const textCell = util.el('td', 'hl-gtk-copy', row);
          const p = util.el('p', '', textCell);
          p.style.margin = '0';
          util.el('td', 'hl-gtk-type', row, 'Read and review');
          util.el('td', 'hl-gtk-status', row, 'On file');
          const mine = marks.filter((m) => m.start >= base && m.end <= base + ptext.length);
          if (mine.length) {
            fillParagraph(util, p, ptext, base, mine, hooks);
            segments.push({ node: p, start: base });
          } else {
            const node = document.createTextNode(ptext);
            p.append(node);
            segments.push({ node, start: base });
          }
          base += ptext.length + 2;
        }
        if (rng.bool(0.5)) util.el('div', 'hl-foot', card, rng.pick(['Drag across the text to select it.', 'Select text with the mouse.',
          'Tip: double-click selects a word.', 'Selections are highlighted.']));

        const fit = () => {
          textEl.style.fontSize = font + 'px';
          textEl.style.lineHeight = '1.35';
          textEl.style.setProperty('--hl-lh', font * 1.35 + 'px');
        };
        font = Math.min(font, 16);
        fit();
        const room = size.height - 12;
        if (pane) {
          // Shrink the type a little if needed so a pane of at least ~45% of the text fits.
          const chrome = () => card.getBoundingClientRect().height - pane.getBoundingClientRect().height;
          pane.style.height = '0px';
          const full = () => textEl.getBoundingClientRect().height;
          while (font > 13 && chrome() + 0.45 * full() > room - windowTop) { font--; fit(); }
          const avail = room - windowTop - chrome();
          const view = Math.floor(Math.min(avail, Math.max(160, full() * rng.float(0.4, 0.62))));
          pane.style.height = view + 'px';
        } else {
          // Shrink the type until the card fits the stage (layout is deterministic, so is the result).
          while (card.getBoundingClientRect().height > room - windowTop && font > 12) {
            font--;
            fit();
          }
          // Long seeded paragraphs need more of the window than the decorative file list.
          if (card.getBoundingClientRect().height > room - windowTop) {
            const widths = [9, 10, 62, 11, 8];
            [...headings.children].forEach((cell, i) => { cell.style.width = widths[i] + '%'; });
            textEl.style.padding = '8px';
            grid.classList.add('hl-gtk-compact');
            windowTop = Math.min(windowTop, Math.max(44, room - card.getBoundingClientRect().height));
            card.style.marginTop = windowTop + 'px';
            while (card.getBoundingClientRect().height > room - windowTop && font > 9) {
              font--; fit();
            }
            if (card.getBoundingClientRect().height > room - windowTop) {
              grid.classList.add('hl-gtk-tight');
            }
          }
        }
        card.style.height = Math.max(card.getBoundingClientRect().height, room - windowTop) + 'px';
        card.style.setProperty('--gtk-summary-font',
          Math.min(15, Math.max(10, (parseFloat(card.style.height) - 119) / 22.2)) + 'px');

        S.sel = bindSelection(ctx, textEl, segments);
        S.scroller = null;
        if (pane) {
          S.scroller = scrollPane(ctx, pane, textEl, bar, thumb);
          S.scroller.init(S.sel);
        }
        return { anchors: [card], sync: (m) => S.sel.set(m) };
      },
    },
  },
});
