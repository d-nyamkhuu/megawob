(function () {
  'use strict';
  const palette = { bg: '#88898b', panel: '#b8b8b8', fg: '#080a17', muted: '#333', line: '#080a17' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = _c.util;
      const bar = u.el('header', 'ds-bar', document.body);
      u.el('span', '', bar, 'Amiga Workbench');
      u.el('span', '', bar, 'Workbench');
      const clk = u.el('span', 'clk', bar);
      u.el('i', 'ds-flop', clk);
      u.el('span', '', clk, '14:27');
      const icons = u.el('div', 'ds-icons', document.body);
      [['Workbench', 'fl'], ['RAM Disk', ''], ['Work', '']].forEach(([t, c]) => {
        const d = u.el('div', 'ds-icon ' + c, icons);
        u.el('i', '', d);
        u.el('div', '', d, t);
      });
      const win = u.el('section', 'ds-win ds-main', document.body);
      const tb = u.el('div', 'ds-title', win);
      u.el('i', 'g', tb);
      u.el('span', '', tb, 'Task Entry - Notes');
      const gs = u.el('span', 'gs', tb);
      u.el('i', '', gs);
      u.el('i', '', gs);
      u.el('i', '', gs);
      const menu = u.el('div', 'ds-menu', win);
      ['File', 'Edit', 'Note', 'Help'].forEach((t) => u.el('span', '', menu, t));
      const det = u.el('div', 'ds-details');
      u.el('span', 'lg', det, 'Task Details');
      const brief = u.el('aside', 'ds-brief', det);
      const btns = u.el('div', 'ds-btns');
      ['New', 'Save', 'Delete'].forEach((t) => {
        const b = u.el('button', 'ds-btn', btns, t);
        b.type = 'button';
      });
      Object.assign(_c, { win, menu, det, btns, header: brief });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('ds-instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.btns;
      base(_c);
      _c.header = header;
      // Extra actions belong in the menu, leaving the form's action row intact.
      for (const b of _c.headerTools.querySelectorAll('.ref-xtra')) _c.menu.appendChild(b);
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const inner = u.el('div', 'ds-inner', _c.win);
      const led = u.el('div', 'ds-ledger', inner);
      const tw = u.el('div', 'ds-tablewrap', led);
      const th = u.el('div', 'ds-thead', tw);
      ['#', 'Title', 'Date', 'Status'].forEach((t) => u.el('span', '', th, t));
      [
        ['1', 'Buy supplies', '2024-05-10'],
        ['2', 'Call the workshop', '2024-05-10'],
        ['3', 'Plan weekend', '2024-05-11'],
        ['4', 'Repair lamp', '2024-05-11'],
        ['5', 'Read manual', '2024-05-12'],
      ].forEach((r, i) => {
        const tr = u.el('div', 'ds-tr' + (i === 0 ? ' sel' : ''), tw);
        r.forEach((t) => u.el('span', '', tr, t));
        u.el('span', '', tr, 'Open');
      });
      const sc = u.el('div', 'ds-scroll', led);
      u.el('b', '', sc, '▲');
      u.el('div', 'th', sc);
      u.el('b', '', sc, '▼');
      inner.appendChild(_c.det);
      _c.body = inner;
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = document.body;
      base(_c);
      _c.body = body;
      const note = document.body.querySelector('.ref-panel');
      if (note) {
        note.classList.add('ds-mode-note', 'ds-mode-panel');
        note.querySelector('.ref-panel-title').classList.add('ds-mode-heading');
        note.querySelector('.ref-panel-title').textContent = 'Task Note';
        note.querySelector('.ref-panel-text').classList.add('ds-instruction');
      }
    },
    'frame.stage': () => (_c) => {
      const u = _c.util;
      const det = _c.det;
      const row = (label) => {
        const r = u.el('div', 'ds-row', det);
        u.el('span', 'l', r, label);
        return r;
      };
      u.el('div', 'ds-box', row('Title:'), 'Buy supplies');
      _c.stage = u.el('main', 'ds-stage', det);
      const dd = u.el('div', 'ds-drop', row('Due Date:'));
      u.el('div', 'ds-box', dd, '2024-05-10');
      u.el('i', 'ds-cal', dd);
      [['Priority:', 'Normal'], ['Status:', 'Open']].forEach(([l, v]) => {
        const d = u.el('div', 'ds-drop', row(l));
        u.el('div', 'ds-box', d, v);
        u.el('b', '', d, '▼');
      });
      det.appendChild(_c.btns);
      const pv = u.el('section', 'ds-win ds-preview', document.body);
      const pt = u.el('div', 'ds-title', pv);
      u.el('i', 'g', pt);
      u.el('span', '', pt, 'Preview');
      const pg = u.el('span', 'gs', pt);
      u.el('i', '', pg);
      u.el('i', '', pg);
      const pb = u.el('div', 'body', pv);
      ['Buy supplies', 'Text:', 'Due: 2024-05-10', 'Priority: Normal', 'Status: Open'].forEach((t, i) =>
        u.el('div', i === 1 ? 'ds-preview-text' : '', pb, t),
      );
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('ds-mode-note', 'ds-mode-toast');
        note.querySelector('.ref-note-text').classList.add('ds-instruction');
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      for (const b of foot.querySelectorAll('.ref-xtra')) _c.menu.appendChild(b);
      _c.btns.appendChild(foot);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
    },
    overlay: () => (ctx) => {
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
  };
  env.site({
    name: 'design-type-text-single-06',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-type-text-single-06': palette },
      LOW_THEME: palette,
      ACCENTS: ['#002ba7'],
      LOW_ACCENTS: ['#002ba7'],
      parts,
    },
  });
})();
