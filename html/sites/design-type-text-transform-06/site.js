(function () {
  'use strict';
  const C = {
    site: 'design-type-text-transform-06',
    instruction: 'top',
    nav: ['Search', 'Advanced Search', 'Browse', 'My Account', 'Help'],
    rows: [
      ['1', 'The Quiet Earth', 'Harper, Louise', '1991', 'FIC HAR', 'Available'],
      ['2', 'Maps of the Mind', 'Delacourt, Pierre', '1988', '153.4 DEL', 'Checked Out'],
      ['3', 'A History of Rivers', 'Nguyen, Kam', '1994', '551.48 NGU', 'Available'],
      ['4', 'The Stone Garden', 'Matsuda, Erin', '1990', 'FIC MAT', 'Available'],
      ['5', 'Weather and the World', 'Ellison, Mark', '1987', '551.6 ELL', 'Checked Out'],
      ['6', 'Letters from the North', 'Bjornstad, Lise', '1992', '914.8 BJO', 'Available'],
      ['7', 'The Created Self', 'Ramirez, Daniel', '1995', '155.2 RAM', 'Available'],
      ['8', 'Gardening Through the Seasons', 'Whitfield, Nora', '1989', '635 WHI', 'Checked Out'],
    ],
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util;
      const el = u.el;
      const page = el('div', 'lc-page', document.body);
      // Scale the fixed catalog coordinates to the available page in both dimensions.
      page.style.setProperty('--page-x', document.documentElement.clientWidth / 1672);
      page.style.setProperty('--page-y', document.documentElement.clientHeight / 941);
      // banner
      const top = el('header', 'lc-banner', page);
      const logo = el('span', 'lc-logo', top);
      logo.setAttribute('role', 'img');
      logo.setAttribute('aria-label', 'Open book');
      const bt = el('div', 'lc-title', top);
      el('div', 'lc-name', bt, 'Riverton Public Library');
      el('div', 'lc-sub', bt, 'Catalog');
      el('div', 'lc-motto', top, 'Knowledge Serves a Greater Tomorrow');
      const nav = el('nav', 'lc-nav', page);
      C.nav.forEach((t, i) => {
        if (i) el('span', 'lc-sep', nav, '|');
        el('span', t === 'Browse' ? 'lc-navi lc-u' : 'lc-navi', nav, t);
      });
      el('span', 'lc-date', nav, 'Mon, Apr 21, 1997');
      const rr = ctx.rng.fork('chrome/end');
      const placements = ['form', 'form', 'form', 'header', 'link'];
      const placement = ctx.finish ? null : rr.pick(placements);
      const labels =
        ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
          ? ctx.content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const endLabel = placement === 'form' ? 'Submit' : labelOf(rr.pick(labels));
      const cr = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (!ctx.finish && cr.bool(0.3)) {
        const options = [...new Set(labels.map(labelOf))].filter(
          (x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase(),
        );
        if (options.length) collide = labelOf(cr.pick(options));
      }
      const decoy = (parent, text, isCollide) => {
        const b = el('button', 'lc-xtra', parent, text);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () =>
          env.log('decoy', isCollide ? { label: text, collide: true } : { label: text }),
        );
        return b;
      };
      const endButton = (parent, cls, text) => {
        const b = el('button', cls, parent, text);
        b.type = 'button';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', text);
        b.title = text;
        b.addEventListener('click', () => ctx.submit());
        return b;
      };
      let submit = null;
      if (placement === 'header') submit = endButton(nav, 'lc-end-header', endLabel);
      // catalog
      const cat = el('section', 'lc-cat', page);
      el('h1', 'lc-h1', cat, 'Library Catalog');
      const sr = el('div', 'lc-search', cat);
      el('span', 'lc-slabel', sr, 'Search for:');
      const si = el('div', 'lc-sinput', sr);
      const sel = el('div', 'lc-sel', sr, 'Title');
      el('span', 'lc-caret', sel, '⌄');
      el('div', 'lc-btn lc-sbtn', sr, 'Search');
      el('span', 'lc-more', sr, 'More Search Options');
      const tbl = el('table', 'lc-table', cat);
      const th = el('tr', '', el('thead', '', tbl));
      ['No.', 'Title', 'Author', 'Year', 'Call Number', 'Availability'].forEach((h) => el('th', '', th, h));
      const tb = el('tbody', '', tbl);
      C.rows.forEach((r, row) => {
        const tr = el('tr', '', tb);
        r.forEach((c, i) => {
          const td = el('td', '', tr, c);
          if (
            (i === 5 && c === 'Available') ||
            (i === 4 && [0, 3, 5, 6, 7].includes(row)) ||
            (row === 7 && [1, 2, 3].includes(i))
          )
            td.classList.add('lc-ul');
        });
      });
      // task panel
      const task = el('section', 'lc-task', page);
      el('div', 'lc-taskbar', task, 'Text Transformation Task');
      const natural = 'header';
      let mode =
        ctx.display === 'hidden'
          ? 'hidden'
          : ctx.display === 'toast'
            ? 'toast'
            : ctx.display === 'panel'
              ? 'panel'
              : natural;
      if (
        (mode === 'panel' && document.documentElement.clientWidth < 1260) ||
        (mode === 'toast' && document.documentElement.clientHeight < 700)
      )
        mode = natural;
      let note = null;
      if (mode === 'header') {
        note = el('aside', 'lc-instr', task);
        const ins = el('div', 'ds-instruction', note, ctx.instruction);
        const n = String(ctx.instruction).length;
        if (n > 65) {
          ins.style.fontSize = 'calc(var(--u)*' + (n > 100 ? 30 : 34) + ')';
          ins.style.lineHeight = 'calc(var(--u)*' + (n > 100 ? 34 : 38) + ')';
        }
      }
      const stage = el('main', 'lc-stage', task);
      const btns = el('div', 'lc-btns', task);
      if (mode === 'panel' || mode === 'toast') {
        const host = el('aside', mode === 'panel' ? 'lc-note-panel' : 'lc-note-toast', page);
        if (mode === 'panel') el('div', 'lc-note-title', host, 'Task Note');
        el('div', 'ds-instruction', host, ctx.instruction);
      }
      if (placement === 'form') submit = endButton(btns, 'lc-submit', endLabel);
      if (placement === 'link') {
        const link = el('a', 'lc-end-link', task, endLabel + ' ›');
        link.href = '#';
        link.dataset.role = 'submit';
        link.setAttribute('aria-label', endLabel);
        link.title = endLabel;
        link.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        submit = link;
      }
      if (collide) decoy(nav, collide, true);
      const clr = el('button', 'lc-btn lc-clear', btns, 'Clear');
      clr.type = 'button';
      const rst = el('button', 'lc-btn lc-clear', btns, 'Reset');
      rst.type = 'button';
      clr.addEventListener('click', () => stage.dispatchEvent(new CustomEvent('library-clear')));
      rst.addEventListener('click', () => stage.dispatchEvent(new CustomEvent('library-reset')));
      // preview
      const pv = el('aside', 'lc-prev', page);
      el('div', 'lc-prevbar', pv, 'Item Preview');
      const cov = el('div', 'lc-cover', pv);
      cov.setAttribute('role', 'img');
      cov.setAttribute('aria-label', 'The Quiet Earth, by Louise Harper');
      const inf = el('div', 'lc-info', pv);
      el('div', 'lc-it', inf, 'The Quiet Earth');
      [
        'Author: Harper, Louise',
        'Year: 1991',
        'Call Number: FIC HAR',
        'Format: Hardcover',
        'Availability: Available',
      ].forEach((t) => el('div', 'lc-il', inf, t));
      el('div', 'lc-rule', inf);
      el('div', 'lc-full', inf, 'View Full Record');
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      const el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = {
        cookie: 'We use cookies to remember your preferences.',
        toast: 'Changes synced.',
        chat: 'Hello. How can we help?',
        promo: 'Try our new workspace.',
        banner: 'Scheduled maintenance tonight.',
      };
      u.el('div', '', el, texts[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  });
})();
