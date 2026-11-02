// Design on templates/select-text/base.js: the base site's select-text widget for this scenario (it was scaffolded from
// it), with the units this site changed as parts.
env.widget({
  task: 'select-text',
  site: 'design-select-text-field-04',
  name: 'design',
  split: 'train',
  scenarios: ['field'],
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
        font = Math.max(19, Math.min(22, (size.width + 60) * 0.02024));

        const card = util.el('div', 'hl-card', ctx.stage);
        // Keep the seeded draws, but size the mail card from the stage. Its height
        // must remain intrinsic so the pane fitter can measure the header alone.
        card.style.width = size.width + 'px';
        const margin = `${rng.int(4, 12)}px ${rng.int(8, 30)}px`;
        card.style.margin = '0';
        card.style.minWidth = '0';
        card.style.flex = 'none';
        card.style.setProperty('--hl-sel', `color-mix(in srgb, var(--accent) ${selAlpha}%, transparent)`);
        const head = util.el('div', 'hl-head', card);
        Object.assign(head.style, { display: 'flex', minHeight: '74px', padding: '0 0 16px',
          gap: '16px', alignItems: 'center', position: 'relative' });
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
        head.querySelector('.hl-kicker').style.display = 'none';
        head.querySelector('.hl-title').style.paddingRight = '240px';

        // Mail-like source: expose a sender line in the frame while keeping every selectable text node
        // inside .hl-text. Derive the display data from the seeded message; do not consume another RNG draw.
        if (spec.source === 'message') {
          const allText = spec.paragraphs.join(' ');
          const signature = spec.paragraphs.slice(-2).join(' ');
          const senderMatch = signature.match(/(?:cheers|regards|best|sincerely|thanks)[,!\s]+([A-Z][\w'-]+(?:\s+[A-Z][\w'-]+){1,2})/i);
          const senderName = senderMatch ? senderMatch[1] : 'Message sender';
          const emailMatch = allText.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
          const date = head.querySelector('.hl-meta')?.textContent || '';
          const sender = util.el('div', 'hl-mail-sender', card);
          util.el('span', 'hl-mail-avatar', sender, senderName.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase());
          const identity = util.el('div', 'hl-mail-identity', sender);
          util.el('strong', '', identity, senderName);
          if (emailMatch) util.el('span', '', identity, emailMatch[0]);
          util.el('time', 'hl-mail-date', sender, date);
        }

        let pane = null;
        let host = card;
        let bar = null;
        let thumb = null;
        if (spec.pane) {
          const row = util.el('div', 'hl-panerow', card);
          pane = util.el('div', 'hl-pane', row);
          bar = util.el('div', 'hl-bar', row);
          thumb = util.el('div', 'hl-thumb', bar);
          thumb.dataset.role = 'scrollbar';
          host = pane;
        }
        const textEl = util.el('div', 'hl-text', host);
        textEl.dataset.role = 'text';
        if (serif) textEl.classList.add('serif');
        if (marker !== 'none') textEl.classList.add(marker);
        textEl.style.setProperty('--hl-gap', '18px');
        textEl.style.padding = size.width < 680 ? '20px 4% 20px' : '20px 7% 20px';
        if (marker === 'numbered' || marker === 'pilcrow') textEl.style.paddingLeft = '46px';
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
        for (const ptext of spec.paragraphs) {
          const p = util.el('p', '', textEl);
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
        if (rng.bool(0.5)) {
          const foot = util.el('div', 'hl-foot', card, rng.pick(['Drag across the text to select it.', 'Select text with the mouse.',
            'Tip: double-click selects a word.', 'Selections are highlighted.']));
          foot.style.padding = '8px 7% 18px';
        }

        const fit = () => {
          textEl.style.fontSize = font + 'px';
          textEl.style.lineHeight = '1.48';
          textEl.style.setProperty('--hl-lh', font * 1.48 + 'px');
        };
        fit();
        const room = size.height - 32;
        if (pane) {
          // Shrink the type a little if needed so a pane of at least ~45% of the text fits.
          const chrome = () => card.getBoundingClientRect().height - pane.getBoundingClientRect().height;
          pane.style.height = '0px';
          const full = () => textEl.getBoundingClientRect().height;
          while (font > 13 && chrome() + 0.45 * full() > room) { font--; fit(); }
          const avail = room - chrome();
          const view = Math.floor(Math.min(avail, Math.max(160, full() * rng.float(0.4, 0.62))));
          pane.style.height = view + 'px';
        } else {
          // Shrink the type until the card fits the stage (layout is deterministic, so is the result).
          while (card.getBoundingClientRect().height > room && font > 12) {
            font--;
            fit();
          }
        }

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
