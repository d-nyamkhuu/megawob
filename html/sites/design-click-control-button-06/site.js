(function () {
  'use strict';
  const BOOK =
    '<svg viewBox="0 0 150 112" aria-hidden="true"><g fill="none" stroke="#611b20" stroke-width="2.7" stroke-linejoin="round"><path d="M3 25V108h62q10 4 20 0h62V25h-5M8 22V103h55q12 4 24 0h55V22h-5M13 20v78h46q16 4 32 0h46V20h-5M18 16v78c22-1 37-5 57 12 20-17 35-13 57-12V16M23 12v76c18 11 33-7 52 17 19-24 34-6 52-17V12C111 25 95-6 75 20 55-6 39 25 23 12Z"/><path d="M75 20v85M18 94c20 6 37-8 57 12 20-20 37-6 57-12M13 98c25 3 43-6 62 8 19-14 37-5 62-8"/></g><path d="M75 1c-7-6-8 5 0 12 8-7 7-18 0-12ZM70 3c-7-4-4 6 5 9-3-5-3-7-5-9Zm10 0c7-4 4 6-5 9 3-5 3-7 5-9Z" fill="#611b20"/></svg>';
  const ROWS = [
    ['1', 'Pride and Prejudice', 'Austen, Jane', '1813', 'Book', 'Available', 1],
    ['2', 'Pride and Prejudice (Modern Library Edition)', 'Austen, Jane', '2000', 'Book', 'Checked Out', 1],
    ['3', 'The Jane Austen Companion', 'Ferguson, Margaret', '1996', 'Book', 'Available', 0],
  ];
  const palette = { bg: '#fcf8ed', panel: '#e4e0dc', fg: '#1c1414', muted: '#4a3a3a', line: '#6b1a22' };
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('ref', 'lib');
      const shell = u.el('main', 'shell', document.body);
      shell.dataset.display = _c.display;
      shell.dataset.end = _c.ctx.finish ? 'none' : (_c.placement === 'header' || _c.placement === 'icon' ? 'mast' : 'bottom');
      shell.classList.toggle('finish-mode', _c.ctx.finish);
      const head = u.el('header', 'lib-head', shell);
      const logo = u.el('div', 'lib-logo', head);
      logo.innerHTML = BOOK;
      const t = u.el('div', 'lib-titles', head);
      u.el('div', 'lib-name', t, 'Riverton Public Library');
      u.el('div', 'lib-sub', t, 'Catalog Search');
      const mo = u.el('div', 'lib-motto', head);
      mo.innerHTML = 'Knowledge<br>Builds Community<br>Since 1896<span>❧</span>';
      Object.assign(_c, { shell, header: head });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('instruction');
        note.dataset.display = _c.display;
      }
    },
    'frame.tools': (base) => (_c) => {
      base(_c);
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const main = u.el('section', 'lib-main', _c.shell);
      u.el('h2', '', main, 'Search the Catalog');
      const form = u.el('div', 'lib-form', main);
      const f = (cl, l, v, sel) => {
        const r = u.el('div', 'fr ' + cl, form);
        u.el('label', '', r, l);
        u.el('div', sel ? 'fld sel' : 'fld', r, v || '');
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
      const side = u.el('aside', 'lib-side', _c.shell);
      u.el('div', 'side-h', side, 'My Selections');
      Object.assign(_c, { body: side, side });
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const note = _c.side.querySelector('.ref-panel');
      if (note) {
        note.classList.add('instruction', 'instruction-panel');
        note.dataset.display = _c.display;
      }
    },
    'frame.stage': () => (_c) => {
      const u = _c.util;
      const side = _c.side;
      u.el('p', 'none', side, 'No items selected.');
      u.el('hr', '', side);
      u.el('h3', '', side, 'Send to');
      const rg = u.el('div', 'radios', side);
      ['My Library Card', 'Email', 'Print'].forEach((s, i) => {
        const r = u.el('div', 'rad' + (i === 0 ? ' on' : ''), rg);
        u.el('i', '', r);
        u.el('span', '', r, s);
      });
      _c.stage = u.el('div', 'stage', side);
      u.el('hr', '', side);
      u.el('h3', '', side, 'Help');
      const helps = u.el('div', 'helps', side);
      ['Searching the Catalog', 'Renewing Materials', 'Contact Us'].forEach((s) => u.el('a', '', helps, s));
      _c.acts = u.el('div', 'lib-acts', side);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        note.classList.add('instruction', 'instruction-toast');
        note.dataset.display = _c.display;
        _c.header.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      _c.acts.appendChild(foot);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.acts.appendChild(dock);
    },
    overlay: () => (ctx) => {
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
  };
  env.site({
    name: 'design-click-control-button-06',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { library: palette },
      LOW_THEME: palette,
      ACCENTS: ['#6b1a22'],
      LOW_ACCENTS: ['#6b1a22'],
      parts,
    },
  });
})();
