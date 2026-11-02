(function () {
  'use strict';
  const palette = { bg: '#f3f7fb', panel: '#ecf2f8', fg: '#0b2444', muted: '#4a5a73', line: '#a9bdd6' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original reservation notice needs the taller layout.
      if (_c.display === 'toast' && _c.H <= 760) _c.display = 'header';
      document.body.classList.toggle('ref-has-note', _c.display === 'toast');
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const top = u.el('header', 'ds-top', document.body);
      u.el('span', 'ds-brand', top, 'Vehicle Rental Reservations');
      u.el('span', 'ds-toplinks', top, 'Help   |   My Account   |   Sign Out');
      top.hidden = _c.display === 'header';
      if (top.hidden) top.style.display = 'none';
      const body = u.el('div', 'ds-body', document.body);
      const content = u.el('div', 'ds-content', body);
      Object.assign(_c, { top, outerBody: body, content, header: content });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('ds-header-note', 'ds-instruction');
        if (_c.ctx.instruction.length > 70) note.classList.add('ds-long-instruction');
      }
      _c.header.querySelector('.ref-spacer')?.remove();
    },
    'frame.tools': (base) => (_c) => {
      const u = _c.util;
      const secBar = u.el('div', 'ds-secbar', _c.content, '1. Select Dates');
      const header = _c.header;
      _c.header = secBar;
      base(_c);
      _c.header = header;
      u.el('div', 'ds-intro', _c.content, 'Choose your pick-up and return dates using the calendars below.');
    },
    'frame.body': () => (_c) => {
      _c.body = _c.util.el('div', 'ds-main', _c.content);
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.body.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('ds-brief');
        panel.querySelector('.ref-panel-title').textContent = 'Your Task';
        panel.querySelector('.ref-panel-text').classList.add('ds-instruction');
      }
      _c.body.classList.remove('ref-panel-right');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        note.classList.add('ds-toast');
        note.querySelector('.ref-note-text').classList.add('ds-instruction');
        _c.content.insertBefore(note, _c.body);
      }
    },
    'frame.footer': (base) => (_c) => {
      const u = _c.util;
      const rent = u.el('section', 'ds-rental', _c.content);
      u.el('div', 'ds-secbar', rent, '2. Rental Details');
      [
        ['Vehicle type:', 'Standard Car'],
        ['Pick-up location:', 'Downtown'],
        ['Return location:', 'Same as pick-up'],
      ].forEach((r) => {
        const row = u.el('div', 'ds-rrow', rent);
        u.el('span', 'ds-rlab', row, r[0]);
        const s = u.el('span', 'ds-rsel', row);
        const label = u.el('span', '', s, r[1]);
        u.el('i', '', s, '▾');
        s.tabIndex = 0;
        s.setAttribute('role', 'combobox');
        s.setAttribute('aria-expanded', 'false');
        const choices =
          r[0] === 'Vehicle type:'
            ? ['Standard Car', 'Compact Car', 'SUV']
            : r[0] === 'Pick-up location:'
              ? ['Downtown', 'Airport', 'Train Station']
              : ['Same as pick-up', 'Downtown', 'Airport'];
        function toggle() {
          const old = s.querySelector('.ds-options');
          if (old) {
            old.remove();
            s.setAttribute('aria-expanded', 'false');
            return;
          }
          s.setAttribute('aria-expanded', 'true');
          const menu = u.el('div', 'ds-options', s);
          (s.dataset.sceneValue ? [s.dataset.sceneValue] : choices).forEach((t) => {
            const option = u.el('button', '', menu, t);
            option.type = 'button';
            option.addEventListener('click', (e) => {
              e.stopPropagation();
              label.textContent = t;
              menu.remove();
              s.setAttribute('aria-expanded', 'false');
            });
          });
        }
        s.addEventListener('click', toggle);
        s.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggle();
          }
          if (e.key === 'Escape') {
            s.querySelector('.ds-options')?.remove();
            s.setAttribute('aria-expanded', 'false');
          }
        });
      });
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      foot.querySelector('.ref-foot-text').remove();
      _c.content.appendChild(foot);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
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
    name: 'design-set-date-range-02',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-set-date-range-02': palette },
      LOW_THEME: palette,
      ACCENTS: ['#3d6aa0'],
      LOW_ACCENTS: ['#3d6aa0'],
      parts,
    },
  });
})();
