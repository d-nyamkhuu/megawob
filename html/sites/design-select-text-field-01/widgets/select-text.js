// Design on templates/select-text/base.js: the base site's select-text widget for this scenario (it was scaffolded from
// it), with the units this site changed as parts.
env.widget({
  task: 'select-text',
  site: 'design-select-text-field-01',
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

        const card = util.el('div', 'hl-card', ctx.stage);
        card.style.width = width + 'px';
        card.style.margin = `${rng.int(4, 12)}px ${rng.int(8, 30)}px`;
        card.style.setProperty('--hl-sel', `color-mix(in srgb, var(--accent) ${selAlpha}%, transparent)`);
        const head = util.el('div', 'hl-head', card);
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
        if (spec.source === 'message') {
          const table = util.el('div', 'mac-mail-table', card);
          for (const [label, value] of [['To', 'Taylor Kim <taylor.kim@northfieldtech.com>'], ['From', 'Jordan Smith <jordan.smith@brightpathco.com>'], ['Date', 'Mar 14, 2024 at 9:28 AM'], ['Subject', head.querySelector('.hl-title')?.textContent || 'Message']]) {
            const cell = util.el('div', 'mac-mail-cell', table);
            util.el('b', '', cell, label);
            util.el('span', '', cell, value);
          }
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
        const textEl = util.el('div', 'mac-mail-body', host);
        textEl.dataset.role = 'text';
        if (serif) textEl.classList.add('serif');
        if (marker !== 'none') textEl.classList.add(marker);
        textEl.style.setProperty('--hl-gap', gap + 'px');
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
        if (spec.source === 'message') {
          const sign = util.el('div', 'mac-mail-signature', card);
          util.el('b', '', sign, 'Signature');
          const details = util.el('div', '', sign);
          util.el('strong', '', details, 'Jordan Smith');
          util.el('span', '', details, 'Account Manager');
          util.el('span', '', details, 'BrightPath Co.');
          util.el('span', 'mac-mail-email', details, 'jordan.smith@brightpathco.com');
          util.el('span', '', details, '(415) 555-0136');
        }
        if (rng.bool(0.5)) util.el('div', 'hl-foot', card, rng.pick(['Drag across the text to select it.', 'Select text with the mouse.',
          'Tip: double-click selects a word.', 'Selections are highlighted.']));

        // Preserve the mail typography when it fits; compact the whole document
        // together when episode frame leaves less room in the stage.
        const mailFont = parseFloat(getComputedStyle(textEl.firstElementChild).fontSize);
        font = mailFont;
        const fit = () => {
          const scale = font / mailFont;
          card.style.setProperty('--mail-scale', String(scale));
          card.style.setProperty('--mail-font', font + 'px');
          textEl.style.fontSize = font + 'px';
          textEl.style.lineHeight = '1.38';
          textEl.style.padding = `${10 * scale}px ${14 * scale}px`;
          for (const [i, p] of [...textEl.children].entries()) {
            p.style.margin = i ? `${14 * scale}px 0 0` : '0';
          }
          textEl.style.setProperty('--hl-lh', font * lh + 'px');
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
          while (card.getBoundingClientRect().height > room && font > 8) {
            font -= 0.5;
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
      'textbox.render': (base, S) => function render(ctx) {
        const { ensureStyle, ensureStyle3, paragraphAt } = S;
        ensureStyle();
        ensureStyle3();
        const { rng, util, size, spec } = ctx;
        const one = spec.native === 'input';
        const maxW = Math.min(size.width - 120, one ? 820 : 760);
        const width = rng.int(Math.min(one ? 600 : 520, maxW), maxW);
        let font = rng.int(one ? 15 : 14, one ? 18 : 17);
        const lh = rng.pick([1.45, 1.55, 1.65]);
        const card = util.el('div', 'hl-card tb-card', ctx.stage);
        card.style.width = `${width}px`;
        card.style.margin = `${rng.int(4, 10)}px ${rng.int(8, 30)}px`;
        card.style.setProperty('--hl-sel', `color-mix(in srgb, var(--accent) ${rng.int(28, 42)}%, transparent)`);
        const look = one ? 'row' : rng.pick(['composer', 'note']);
        let el;
        if (one) {
          const head = util.el('div', 'hl-head', card);
          util.el('span', 'hl-kicker', head, rng.pick(['Quick reply', 'Subject', 'Status update', 'Search']));
          const row = util.el('div', 'tb-row', card);
          util.el('label', '', row, rng.pick(['Message', 'Text', 'Note', 'Draft']));
          el = util.el('input', 'tb-in', row);
          el.type = 'text';
          el.style.flex = '1';
          util.el('span', 'btn', row, rng.pick(['Send', 'Save', 'Go']));
        } else if (look === 'composer') {
          const bar = util.el('div', 'tb-bar', card);
          util.el('span', '', bar, 'To');
          util.el('input', '', bar).value = rng.pick(['support@example.com', 'team@example.org', 'all@company.test']);
          util.el('span', '', bar, rng.pick(['Cc', 'Bcc']));
          const tb = util.el('div', 'tb-toolbar', card);
          for (const t of ['B', 'I', 'U', 'Link', 'List']) util.el('span', '', tb, t);
          el = util.el('textarea', 'tb-ta', card);
        } else {
          const head = util.el('div', 'hl-head', card);
          util.el('span', 'hl-kicker', head, rng.pick(['Notes', 'Memo', 'Journal', 'Scratchpad']));
          util.el('span', 'hl-title', head, rng.pick(['Untitled note', 'Meeting notes', 'Draft', 'Reading list']));
          el = util.el('textarea', 'tb-ta paper', card);
        }
        el.dataset.role = 'text';
        el.readOnly = true;
        el.spellcheck = false;
        el.value = spec.doc;
        el.setAttribute('aria-label', 'Text');
        let mailMeta = null, mailSignature = null;
        if (!one) {
          mailMeta = util.el('div', 'mac-mail-meta', card);
          util.el('div', 'mac-mail-subject', mailMeta, 'Message');
          const table = util.el('div', 'mac-mail-table', mailMeta);
          for (const [label, value] of [['To', 'Taylor Kim <taylor.kim@northfieldtech.com>'], ['From', 'Jordan Smith <jordan.smith@brightpathco.com>'], ['Date', 'Mar 14, 2024 at 9:28 AM'], ['Subject', 'Re: Q2 Marketing Campaign']]) {
            const cell = util.el('div', 'mac-mail-cell', table);
            util.el('b', '', cell, label);
            util.el('span', '', cell, value);
          }
          mailSignature = util.el('div', 'mac-mail-signature', card);
          util.el('b', '', mailSignature, 'Signature');
          const sign = util.el('div', '', mailSignature);
          util.el('strong', '', sign, 'Jordan Smith');
          util.el('span', '', sign, 'Account Manager');
          util.el('span', '', sign, 'BrightPath Co.');
          const email = util.el('span', 'mac-mail-email', sign, 'jordan.smith@brightpathco.com');
          util.el('span', '', sign, '(415) 555-0136');
          card.insertBefore(mailMeta, el);
        }
        if (!one && look === 'composer') {
          const f = util.el('div', 'tb-foot', card);
          util.el('span', '', f, `${spec.doc.length} characters`);
          util.el('span', 'btn', f, 'Send');
        }
        const fit = () => {
          card.style.fontSize = `${font}px`;
          card.style.lineHeight = String(lh);
          card.style.setProperty('--hl-lh', `${font * lh}px`);
          if (!one) {
            el.style.height = 'auto';
            el.style.height = `${el.scrollHeight}px`;
          }
        };
        fit();
        const room = size.height - 32;
        while (card.getBoundingClientRect().height > room && font > 12) { font--; fit(); }
        if (one) {
          // Wide enough for the whole line, so the field never scrolls horizontally.
          while (el.scrollWidth > el.clientWidth && font > 11) { font--; fit(); }
        }

        S.field = el;
        let last = [-1, -1];
        const read = () => {
          const a = el.selectionStart;
          const b = el.selectionEnd;
          if (a === last[0] && b === last[1]) return;
          last = [a, b];
          ctx.update({ ...ctx.model, start: a, end: b });
        };
        const set = (m) => {
          if (el.selectionStart !== m.start || el.selectionEnd !== m.end) el.setSelectionRange(m.start, m.end);
          last = [m.start, m.end];
        };
        set(ctx.model);
        const refocus = S.fieldFocus === ctx.episode;
        el.addEventListener('focus', () => { S.fieldFocus = ctx.episode; });
        // Removing the field blurs it while it is still connected: only a blur that leaves it on the page counts.
        el.addEventListener('blur', () => queueMicrotask(() => { if (el.isConnected) S.fieldFocus = null; }));
        for (const ev of ['select', 'keyup', 'pointerup', 'dblclick', 'focus']) el.addEventListener(ev, read);
        el.addEventListener('click', (e) => {
          if (e.button !== 0 || e.shiftKey || util.clickCount(e) < 3) return;
          const range = paragraphAt(spec, el.selectionStart);
          el.setSelectionRange(range.start, range.end);
          read();
        });
        el.addEventListener('pointermove', (e) => { if (e.buttons & 1) read(); });
        document.addEventListener('selectionchange', () => { if (el.isConnected && document.activeElement === el) read(); });
        if (refocus) el.focus({ preventScroll: true });
        return { anchors: [card], sync: set };
      },
    },
  },
});
