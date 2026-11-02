(function () {
  'use strict';
  const palette = { bg: '#e6eaff', panel: '#ffffff', fg: '#17243a', muted: '#687487', line: '#d8e2e7' };
  const parts = {
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
      const top = u.el('header', 'cc-titlebar', document.body);
      u.el('span', 'cc-mark', top, '◆');
      u.el('strong', '', top, 'ClaimCenter Lite');
      u.el('span', 'cc-window-controls', top, '−　□　×');
      Object.assign(_c, { header: top });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('cc-instruction-header');
    },
    'frame.tools': (base) => (_c) => {
      base(_c);
      for (const b of _c.headerTools.querySelectorAll('.ref-submit')) b.classList.add('cc-end');
      for (const b of _c.headerTools.querySelectorAll('.ref-xtra')) b.classList.add('cc-xtra');
    },
    'frame.body': () => (_c) => {
      _c.body = _c.util.el('div', 'cc-main' + (_c.display === 'toast' ? ' cc-main-toast' : ''), document.body);
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.body.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('cc-instruction-panel');
        panel.querySelector('.ref-panel-title').textContent = 'Task note';
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('cc-toast');
        _c.body.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      const u = _c.util;
      const dock = u.el('footer', 'cc-dock', document.body);
      const nav = u.el('nav', 'cc-nav', dock);
      [
        ['⌂', 'Home'],
        ['▣', 'Document to Form'],
        ['▱', 'Claims'],
        ['▤', 'Documents'],
        ['⚙', 'Settings'],
      ].forEach(([icon, text], i) => {
        const b = u.el('div', i === 1 ? 'cc-navitem active' : 'cc-navitem', nav);
        u.el('span', 'cc-navicon', b, icon);
        u.el('span', '', b, text);
      });
      const stats = u.el('div', 'cc-stats', dock);
      u.el('span', '', stats, '1 document');
      u.el('i', '', stats);
      u.el('span', '', stats, '0 of 6 fields completed');
      u.el('b', 'cc-progress', stats);
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) {
        stats.appendChild(foot);
        const text = foot.querySelector('.ref-foot-text');
        if (text) text.remove();
        for (const b of foot.querySelectorAll('.ref-submit')) b.classList.add('cc-dock-end');
        for (const b of foot.querySelectorAll('.ref-endlink')) b.classList.add('cc-link');
        for (const b of foot.querySelectorAll('.ref-xtra')) b.classList.add('cc-xtra');
      }
      _c.stats = stats;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.stats.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util,
        el = u.el('section', 'cc-overlay cc-overlay-' + ctx.kind, document.body);
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
    name: 'design-fill-form-claim-03',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-fill-form-claim-03': palette },
      LOW_THEME: palette,
      ACCENTS: ['#4169ee'],
      LOW_ACCENTS: ['#4169ee'],
      parts,
    },
  });
})();
