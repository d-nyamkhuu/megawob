(function () {
  'use strict';
  const palette = { bg: '#17121f', panel: '#211c2b', fg: '#f5f2fa', muted: '#c4bad8', line: '#393246' };
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = _c.util;
      const top = u.el('header', 'ds-top', document.body);
      u.el('span', 'ds-brand', top, 'Nimbus Mail');
      const nav = u.el('nav', 'ds-menu', top);
      'Home|Mail|Calendar|Contacts|Files|Settings'.split('|').forEach((t) => {
        const n = u.el('span', '', nav, t);
        if (t === 'Settings') n.className = 'active';
      });
      const meta = u.el('div', 'ds-window-meta', top);
      ['⌕', '♧', '?', 'JD', '−', '□', '×'].forEach((t) => u.el('span', 'ds-tool', meta, t));
      const content = u.el('div', 'ds-content');
      Object.assign(_c, { header: meta, contentPane: content });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.contentPane;
      base(_c);
      _c.header = header;
      const note = _c.contentPane.querySelector('.ref-instruction');
      if (note) note.classList.add('ds-header-note');
    },
    'frame.tools': (base) => (_c) => {
      base(_c);
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const body = u.el('div', 'ds-body', document.body);
      const rail = u.el('aside', 'ds-rail', body);
      u.el('h2', '', rail, 'Settings');
      'Account|Security|Devices|Privacy|Notifications|Appearance|Apps'.split('|').forEach((t, i) => {
        u.el('div', i === 0 ? 'selected' : '', rail, t);
      });
      body.appendChild(_c.contentPane);
      const main = u.el('div', 'ds-main', _c.contentPane);
      Object.assign(_c, { body: main });
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.body.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('ds-brief');
        const title = panel.querySelector('.ref-panel-title');
        title.textContent = 'Task';
        panel.querySelector('.ref-panel-text').classList.add('ds-instruction');
      }
    },
    'frame.stage': () => (_c) => {
      const u = _c.util;
      const stage = u.el('main', 'ds-stage', _c.body);
      _c.body.prepend(stage);
      _c.stage = stage;
      const side = u.el('aside', 'ds-summary', _c.body);
      u.el('h3', '', side, 'Recent sign-ins');
      [
        ['▱', 'Windows PC', 'Seattle, WA', 'Today, 9:14 AM'],
        ['▯', 'iPhone', 'Seattle, WA', 'Apr 27, 2026, 6:32 PM'],
        ['▱', 'Windows PC', 'Portland, OR', 'Apr 24, 2026, 11:03 AM'],
      ].forEach((a) => {
        const r = u.el('div', 'ds-signin', side);
        u.el('b', '', r, a[0]);
        const d = u.el('div', '', r);
        u.el('strong', '', d, a[1]);
        u.el('small', '', d, a[2]);
        u.el('time', '', r, a[3]);
      });
      u.el('h3', 'ds-summary-title', side, 'Security summary');
      [
        ['♢', 'Two-step verification', 'On'],
        ['▣', 'Trusted devices', '4 devices'],
        ['⚿', 'App passwords', '1 password'],
      ].forEach((a) => {
        const r = u.el('div', 'ds-security', side);
        u.el('b', '', r, a[0]);
        const d = u.el('div', '', r);
        u.el('strong', '', d, a[1]);
        u.el('small', '', d, a[2]);
      });
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('ds-toast');
        note.querySelector('.ref-note-text').classList.add('ds-instruction', 'ds-instruction-toast');
        _c.contentPane.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) {
        foot.classList.add('ds-footer');
        _c.contentPane.appendChild(foot);
      }
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.contentPane.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util,
        el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
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
    name: 'design-act-in-time-toast-03',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-act-in-time-toast-03': palette },
      LOW_THEME: palette,
      ACCENTS: ['#ff7274'],
      LOW_ACCENTS: ['#ff7274'],
      parts,
    },
  });
})();
