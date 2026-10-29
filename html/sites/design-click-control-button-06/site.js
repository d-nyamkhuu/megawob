(function () {
  'use strict';
  const BOOK =
    '<svg viewBox="0 0 150 112" aria-hidden="true"><g fill="none" stroke="#611b20" stroke-width="2.7" stroke-linejoin="round"><path d="M3 25V108h62q10 4 20 0h62V25h-5M8 22V103h55q12 4 24 0h55V22h-5M13 20v78h46q16 4 32 0h46V20h-5M18 16v78c22-1 37-5 57 12 20-17 35-13 57-12V16M23 12v76c18 11 33-7 52 17 19-24 34-6 52-17V12C111 25 95-6 75 20 55-6 39 25 23 12Z"/><path d="M75 20v85M18 94c20 6 37-8 57 12 20-20 37-6 57-12M13 98c25 3 43-6 62 8 19-14 37-5 62-8"/></g><path d="M75 1c-7-6-8 5 0 12 8-7 7-18 0-12ZM70 3c-7-4-4 6 5 9-3-5-3-7-5-9Zm10 0c7-4 4 6-5 9 3-5 3-7 5-9Z" fill="#611b20"/></svg>';
  const ROWS = [
    ['1', 'Pride and Prejudice', 'Austen, Jane', '1813', 'Book', 'Available', 1],
    ['2', 'Pride and Prejudice (Modern Library Edition)', 'Austen, Jane', '2000', 'Book', 'Checked Out', 1],
    ['3', 'The Jane Austen Companion', 'Ferguson, Margaret', '1996', 'Book', 'Available', 0],
  ];
  env.site({
    name: 'design-click-control-button-06',
    styles: ['site.css'],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'ref lib';
      const shell = u.el('main', 'shell', document.body);
      const sw = (ctx.size && (ctx.size.width || ctx.size.w || ctx.size[0])) || document.documentElement.clientWidth,
        display = ctx.display === 'panel' && sw < 1260 ? 'header' : ctx.display;
      const er = ctx.rng.fork('chrome/end'),
        cr = ctx.rng.fork('chrome/collide'),
        bank = ctx.content.END_LABELS || [
          'Submit',
          'Done',
          'Finish',
          'Continue',
          'Save',
          'OK',
          'Confirm',
          'Apply',
          'Complete',
          "I'm done",
        ],
        labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x)),
        referenceEnd = er.bool(0.5),
        label = referenceEnd ? 'Submit' : labelOf(er.pick(bank)),
        placement = er.pick(referenceEnd ? ['bottom'] : ['help', 'mast']);
      let collide = null;
      if (cr.bool(0.3)) {
        const options = [...new Set(bank.map(labelOf))].filter(
          (x) => x.trim().toLowerCase() !== label.trim().toLowerCase(),
        );
        if (options.length) collide = labelOf(cr.pick(options));
      }
      shell.dataset.display = display;
      shell.dataset.end = ctx.finish ? 'none' : placement;
      shell.classList.toggle('finish-mode', ctx.finish);
      const head = u.el('header', 'lib-head', shell);
      const logo = u.el('div', 'lib-logo', head);
      logo.innerHTML = BOOK;
      const t = u.el('div', 'lib-titles', head);
      u.el('div', 'lib-name', t, 'Riverton Public Library');
      u.el('div', 'lib-sub', t, 'Catalog Search');
      const mo = u.el('div', 'lib-motto', head);
      mo.innerHTML = 'Knowledge<br>Builds Community<br>Since 1896<span>❧</span>';
      const note = u.el('div', 'instruction', head, ctx.instruction);
      note.dataset.display = display;
      note.hidden = display === 'hidden';
      if (display === 'toast') note.classList.add('instruction-toast');
      const main = u.el('section', 'lib-main', shell);
      u.el('h2', '', main, 'Search the Catalog');
      const form = u.el('div', 'lib-form', main);
      const f = (cl, l, v, sel) => {
        const r = u.el('div', 'fr ' + cl, form);
        u.el('label', '', r, l);
        const i = u.el('div', sel ? 'fld sel' : 'fld', r, v || '');
        return r;
      };
      f('r1 c1', 'Title:', 'Pride and Prejudice');
      f('r2 c1', 'Author:', '');
      f('r3 c1', 'Subject:', '');
      f('r1 c2', 'Material Type:', 'All', 1);
      const y = f('r2 c2', 'Year:', '');
      y.innerHTML = '<label>Year:</label><div class="fld sm"></div><span>-</span><div class="fld sm"></div>';
      f('r3 c2', 'Sort by:', 'Relevance', 1);
      const bs = u.el('div', 'lib-btns', main);
      u.el('span', 'nbtn', bs, 'Search');
      u.el('span', 'nbtn', bs, 'Clear');
      u.el('h3', '', main, 'Search Results');
      u.el('p', 'recs', main, '3 record(s) found.');
      const tb = u.el('table', 'lib-table', main);
      const th = u.el('tr', '', u.el('thead', '', tb));
      ['#', 'Title', 'Author', 'Year', 'Format', 'Availability'].forEach((s) => u.el('th', '', th, s));
      const tbody = u.el('tbody', '', tb);
      ROWS.forEach((r) => {
        const tr = u.el('tr', '', tbody);
        r.slice(0, 6).forEach((s, i) => {
          const td = u.el('td', '', tr);
          if (i === 1 && r[6]) {
            const p = s.replace('Pride and Prejudice', '');
            u.el('a', '', td, 'Pride and Prejudice');
            td.appendChild(document.createTextNode(p));
          } else td.textContent = s;
        });
      });
      const side = u.el('aside', 'lib-side', shell);
      const sh = u.el('div', 'side-h', side, 'My Selections');
      if (display === 'panel') {
        side.appendChild(note);
        note.hidden = false;
        note.classList.add('instruction-panel');
      }
      u.el('p', 'none', side, 'No items selected.');
      u.el('hr', '', side);
      u.el('h3', '', side, 'Send to');
      const rg = u.el('div', 'radios', side);
      ['My Library Card', 'Email', 'Print'].forEach((s, i) => {
        const r = u.el('div', 'rad' + (i === 0 ? ' on' : ''), rg);
        u.el('i', '', r);
        u.el('span', '', r, s);
      });
      const stage = u.el('div', 'stage', side);
      u.el('hr', '', side);
      u.el('h3', '', side, 'Help');
      const helps = u.el('div', 'helps', side);
      ['Searching the Catalog', 'Renewing Materials', 'Contact Us'].forEach((s) => u.el('a', '', helps, s));
      const acts = u.el('div', 'lib-acts', side);
      let submit = null;
      if (!ctx.finish) {
        const parent = placement === 'help' ? helps : placement === 'mast' ? head : acts;
        submit = u.el(
          'button',
          'submit ' + (placement === 'help' ? 'submit-help' : placement === 'mast' ? 'submit-mast' : ''),
          parent,
          label,
        );
        submit.type = 'button';
        submit.title = label;
        submit.setAttribute('aria-label', label);
        submit.addEventListener('click', ctx.submit);
      }
      const status = u.el('div', 'task-status', side);
      status.hidden = true;
      [
        ['Current Step:', '1 of 4'],
        ['Status:', 'Not completed'],
        ['Attempts:', '0'],
        ['Result:', '—'],
      ].forEach(([label, value]) => {
        const row = u.el('div', 'status-row', status);
        u.el('span', 'status-label', row, label);
        u.el('span', 'status-value', row, value);
      });
      if (collide) {
        const d = u.el('button', 'end-xtra', helps, collide);
        d.type = 'button';
        d.addEventListener('click', () => env.log('decoy', { label: collide, collide: true }));
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const el = ctx.util.el('section', 'perturb ' + ctx.kind, document.body);
      ctx.util.el(
        'strong',
        '',
        el,
        {
          cookie: 'Cookie preferences',
          toast: 'Notification',
          chat: 'Support',
          promo: 'A special offer',
          banner: 'Service notice',
        }[ctx.kind],
      );
      ctx.util.el(
        'p',
        '',
        el,
        {
          cookie: 'Choose your preferences to continue.',
          toast: 'Your workspace is ready.',
          chat: 'How can we help?',
          promo: 'Explore the latest tools.',
          banner: 'A new update is available.',
        }[ctx.kind],
      );
      const dismiss = ctx.util.el('button', 'dismiss', el, ctx.kind === 'cookie' ? 'Accept' : 'Close');
      dismiss.type = 'button';
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  });
})();
