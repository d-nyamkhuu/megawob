(function () {
  'use strict';
  const palette = { bg: '#cccac5', panel: '#d5d4ce', fg: '#111211', muted: '#555555', line: '#858684' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      const { ctx, W, H } = _c;
      _c.display = ctx.display === 'panel' && W < 1180 ? 'header' : ctx.display === 'toast' && H < 680 ? 'header' : ctx.display || 'header';
      document.body.classList.toggle('ref-has-note', _c.display === 'toast');
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = _c.util;
      const win = u.el('div', 'nm-window', document.body);
      const top = u.el('header', 'nm-titlebar', win);
      u.el('span', 'nm-appicon', top, '▤');
      u.el('span', 'nm-title', top, 'Newsletter Manager');
      const winbtns = u.el('div', 'nm-winbtns', top);
      ['−', '□', '×'].forEach((x) => u.el('button', '', winbtns, x));
      const menu = u.el('nav', 'nm-menu', win);
      ['File', 'Edit', 'View', 'Tools', 'Help'].forEach((x) => u.el('span', '', menu, x));
      const header = u.el('div', 'nm-note-slot', win);
      Object.assign(_c, { win, header });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('nm-tasknote');
    },
    'frame.tools': (base) => (_c) => {
      const u = _c.util;
      const heading = u.el('div', 'nm-mainhead');
      u.el('h1', '', heading, 'Subscriber Preferences');
      const tools = u.el('div', 'nm-headtools', heading);
      const header = _c.header;
      _c.header = tools;
      base(_c);
      _c.header = header;
      _c.heading = heading;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const contentRoot = u.el('div', 'nm-content', _c.win);
      const side = u.el('aside', 'nm-sidebar', contentRoot);
      const section = (title, rows, cls) => {
        const s = u.el('section', 'nm-section ' + (cls || ''), side);
        u.el('h2', '', s, title);
        const list = u.el('div', 'nm-rows', s);
        rows.forEach(([icon, text, count]) => {
          const r = u.el('div', 'nm-row', list);
          u.el('span', 'nm-rowicon', r, icon);
          u.el('span', 'nm-rowtext', r, text);
          if (count) u.el('span', 'nm-count', r, count);
        });
      };
      section('Newsletter', [['✉', 'Subscribers', '248'], ['▤', 'Active', '230'], ['⊘', 'Unsubscribed', '18']]);
      section('Topics', [['◩', 'Available Topics', '6'], ['▤', 'In Use', '4'], ['◌', 'Not In Use', '2']]);
      section('Recent Activity', [['▤', 'Newsletter sent', 'Apr 12, 2004'], ['♙', 'New subscriber', 'Apr 11, 2004'], ['⊘', 'Unsubscribed', 'Apr 9, 2004']], 'nm-activity');
      const main = u.el('main', 'nm-main', contentRoot);
      main.appendChild(_c.heading);
      const identity = u.el('div', 'nm-identity', main);
      [['Email Address:', 'r.martin@example.org'], ['Full Name:', 'Rachel Martin']].forEach(([label, value]) => {
        const row = u.el('div', 'nm-idrow', identity);
        u.el('label', '', row, label);
        u.el('div', 'nm-idvalue', row, value);
      });
      u.el('div', 'nm-separator', main);
      Object.assign(_c, { body: contentRoot, side, main });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.side;
      base(_c);
      _c.body = body;
      const panel = _c.side.querySelector('.ref-panel');
      if (panel) panel.classList.add('nm-panelnote');
    },
    'frame.stage': () => (_c) => {
      const u = _c.util, main = _c.main;
      const pref = u.el('div', 'nm-pref', main);
      u.el('div', 'nm-pref-label', pref, 'Newsletter Topics:');
      const below = u.el('div', 'nm-below', main);
      const delivery = u.el('div', 'nm-delivery', below);
      u.el('div', 'nm-delivery-label', delivery, 'Delivery Format:');
      const radios = u.el('div', 'nm-radios', delivery);
      [['◉', 'HTML (recommended)', true], ['◯', 'Plain Text', false]].forEach(([icon, text, active]) => {
        const r = u.el('div', 'nm-radio', radios);
        r.classList.toggle('selected', active);
        u.el('span', '', r, icon);
        u.el('span', '', r, text);
      });
      const schedule = u.el('div', 'nm-schedule', below);
      u.el('span', '', schedule, 'Delivery Schedule:');
      const select = u.el('div', 'nm-select', schedule, 'Weekly (Monday)');
      u.el('span', 'nm-select-arrow', select, '▼');
      _c.stage = u.el('section', 'nm-stage', main);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('nm-toast');
        _c.win.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      const u = _c.util;
      const dock = u.el('footer', 'nm-dock', _c.win);
      [['✉', 'Subscribers'], ['▤', 'Newsletters'], ['▱', 'Topics'], ['▥', 'Reports'], ['⚙', 'Settings']].forEach(([icon, text], i) => {
        const b = u.el('button', 'nm-dockitem' + (!i ? ' active' : ''), dock);
        b.type = 'button';
        u.el('span', 'nm-dockicon', b, icon);
        u.el('span', '', b, text);
      });
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('nm-foottools');
      dock.appendChild(foot);
      _c.dock = dock;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.dock.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util,
        el = u.el('section', 'nm-overlay nm-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = {
        cookie: 'This application stores preferences on this computer.',
        toast: 'Newsletter preferences updated.',
        chat: 'Newsletter support. How can we help?',
        promo: 'Discover the new campaign tools.',
        banner: 'System notice: scheduled maintenance tonight.',
      };
      u.el('div', 'nm-overlay-text', el, texts[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  };
  env.site({
    name: 'design-choose-option-chips-03',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: { THEMES: { site: palette }, LOW_THEME: palette, ACCENTS: ['#285878'], LOW_ACCENTS: ['#285878'], parts },
  });
})();
