// Site design on find-fact/phone-book; shared widget code lives in templates/find-fact/phone-book.js.
env.widget({
  task: 'find-fact',
  site: 'design-find-fact-phone-book-12',
  name: 'design',
  split: 'train',
  scenarios: ['phone-book'],
  template: 'find-fact/phone-book',
  design: {
    headers: ['Name ▲', 'Phone', 'Email', 'Address', 'Notes'],
    widths: ['19%', '15.5%', '27%', '15%', '23.5%'],
    footClass: 'rl-bookfoot', idleClass: ' idle',
    parts: {
      book: (base, S) => (ctx, B) => {
        const { spec } = ctx;
        const { bc } = B;
        bc.querySelector('h3').textContent = 'Contacts';
        const totalLabel = document.querySelector('.ds-total');
        if (totalLabel) totalLabel.textContent = `${spec.contacts.length} contacts`;
      },
      results: (base, S) => (ctx, B) => {
        const { util } = ctx;
        const { body, search } = B;
        const resultWrap = util.el('div', 'rl-result-wrap', body);
        const results = util.el('div', 'rl-results', resultWrap);
        const scrollRail = util.el('div', 'rl-scrollrail', resultWrap);
        const scrollTrack = util.el('div', 'rl-scrolltrack', scrollRail);
        const scrollThumb = util.el('div', 'rl-scrollthumb', scrollTrack);
        if (search) {
          for (const [key, glyph] of [['prev', '▲'], ['next', '▼']]) {
            const arrow = util.el('span', 'rl-scrollarrow', scrollRail, glyph);
            arrow.dataset.key = key;
            arrow.setAttribute('aria-hidden', 'true');
          }
        }
        B.scrollThumb = scrollThumb;
        B.scrollRail = scrollRail;
        return results;
      },
      pager: (base, S) => (ctx, B, pageEls) => {
        const { scrollRail } = B;
        for (const b of pageEls) {
          if (b.dataset.key === 'prev' || b.dataset.key === 'next') {
            b.classList.add('rl-scrollarrow');
            b.textContent = b.dataset.key === 'prev' ? '▲' : '▼';
            b.title = b.dataset.key === 'prev' ? 'Previous contacts' : 'Next contacts';
            scrollRail.append(b);
          }
        }
      },
      row: (base, S) => (ctx, B, tr, c, i, picked, els) => {
        // Keep the template's links, event binding and locator. Present its pages
        // as positions in one continuous contact sheet, rather than separate cards.
        const body = tr.parentElement;
        if (B.search) {
          base(ctx, B, tr, c, i, picked, els);
          ctx.util.el('td', 'rl-contact-note', tr, '');
          return;
        }
        if (body.dataset.contactSheet) { tr.remove(); return; }
        body.dataset.contactSheet = 'true';
        ctx.spec.contacts.forEach((contact, index) => {
          const row = index === 0 ? tr : ctx.util.el('tr', '', body);
          row.dataset.contactIndex = String(index);
          base(ctx, B, row, contact, index, picked, els);
          ctx.util.el('td', 'rl-contact-note', row, '');
        });
      },
      picked: (base, S) => (ctx, B, m, last, bad) => {
        const { spec } = ctx;
        const { fam, search, scrollThumb } = B;
        const selectionLabel = document.querySelector('.ds-sel');
        if (selectionLabel) selectionLabel.textContent = last ? `${spec.contacts[last.contact].name}: ${fam.helpers.PROPS[last.prop]}` : 'No contact selected';
        const pages = search ? 1 : fam.helpers.pageCount(spec);
        const thumbSize = Math.max(48, 100 / pages);
        scrollThumb.style.height = thumbSize + '%';
        scrollThumb.style.top = (pages > 1 ? (m.page / (pages - 1)) * (100 - thumbSize) : 0) + '%';
        if (!search) {
          const results = B.results;
          const header = results.querySelector('thead');
          const available = results.clientHeight - (header ? header.offsetHeight : 35) - 2;
          const sheetHeight = Math.min(28, Math.max(24, Math.floor(available / spec.contacts.length)));
          const rowHeight = Math.max(18, Math.min(sheetHeight, Math.floor(available / spec.perPage)));
          results.style.setProperty('--book-row-height', rowHeight + 'px');
          const row = results.querySelector(`[data-contact-index="${m.page * spec.perPage}"]`);
          if (row) results.scrollTop = Math.max(0, row.offsetTop - (header ? header.offsetHeight : 35));
        }
      },
    },
  },
});
