(function () {
  'use strict';
  const palette = { bg: '#f0f1f5', panel: '#ffffff', fg: '#23283a', muted: '#6b7183', line: '#d3d6de' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original design has room for its own rail and top notification.
      _c.display = _c.ctx.display || 'header';
      if (_c.display === 'panel' && _c.W < 1180) _c.display = 'header';
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
      const shell = u.el('div', 'ds-body', document.body);
      const content = u.el('div', 'ds-content', shell);
      const top = u.el('header', 'ds-top', content);
      u.el('span', 'ds-brand', top, 'Library Study Room Reservation');
      const intro = u.el('div', 'ds-intro', content);
      u.el('div', '', intro, 'Use this form to view or edit your reservation.');
      const bar = u.el('div', 'ds-note-bar', content);
      bar.hidden = !['header', 'toast'].includes(_c.display);
      if (!bar.hidden) bar.classList.add(_c.display === 'toast' ? 'ds-toast' : 'ds-header-note');
      const toolbar = u.el('div', 'ds-toolbar');
      if (!bar.hidden) bar.appendChild(toolbar);
      Object.assign(_c, { shell, content, top, bar, toolbar, header: bar });
    },
    'frame.nav': () => (_c) => {
      const menu = _c.util.el('nav', 'ds-menu', _c.content, 'Riverside Community Library');
      _c.content.insertBefore(menu, _c.content.querySelector('.ds-intro'));
    },
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.bar.querySelector('.ref-instruction');
      if (note) note.classList.add('ds-instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const main = u.el('div', 'ds-main', _c.content);
      const rail = u.el('aside', 'ds-rail', _c.shell);
      if (_c.display === 'panel') {
        rail.classList.add('ds-panel-active');
        u.el('h2', '', rail, 'Instructions');
      } else {
        u.el('h2', '', rail, 'Your Reservation');
        u.el('div', 'ds-reservation-values', rail);
        const help = u.el('section', 'ds-help', rail);
        u.el('h2', '', help, 'Need Help?');
        u.el('p', '', help, 'If you have trouble editing your reservation, please ask a librarian at the front desk.');
      }
      Object.assign(_c, { body: main, rail });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.rail;
      base(_c);
      _c.body = body;
      const panel = _c.rail.querySelector('.ref-panel');
      if (panel) panel.classList.add('ds-panel-note');
    },
    'frame.stage': () => (_c) => {
      const u = _c.util;
      const stage = u.el('main', 'ds-stage', _c.body);
      const rides = u.el('div', 'ds-rides', _c.body);
      rides.setAttribute('aria-hidden', 'true');
      u.el('div', 'ds-rides-h', rides, 'Ride type');
      const rideRow = u.el('div', 'ds-rides-r', rides);
      [
        ['Standard', 'Everyday rides'],
        ['XL', 'More room'],
        ['Premium', 'Top rated'],
      ].forEach((r, i) => {
        const card = u.el('div', 'ds-ride' + (i ? '' : ' on'), rideRow);
        card.innerHTML =
          '<svg viewBox="0 0 48 48"><path fill="currentColor" d="M10 7h28c2 0 3 1 4 4l4 13v18c0 2-1 3-3 3h-3c-2 0-3-1-3-3v-3H11v3c0 2-1 3-3 3H5c-2 0-3-1-3-3V24l4-13c1-3 2-4 4-4z"/><path fill="white" d="M12 11h24l3 11H9z"/><circle fill="white" cx="10" cy="30" r="3.6"/><circle fill="white" cx="38" cy="30" r="3.6"/><path stroke="white" stroke-width="1.5" d="M18 34h12"/></svg>';
        const text = u.el('div', '', card);
        u.el('b', '', text, r[0]);
        u.el('span', '', text, r[1]);
      });
      const map = u.el('div', 'ds-map', _c.body);
      map.setAttribute('aria-hidden', 'true');
      _c.stage = stage;
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        note.querySelector('.ref-note-text').classList.add('ds-instruction');
        _c.bar.insertBefore(note, _c.toolbar);
      }
    },
    'frame.footer': (base) => (_c) => {
      const footer = _c.util.el('footer', 'ds-footer', _c.content);
      if (_c.bar.hidden) footer.appendChild(_c.toolbar);
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) footer.appendChild(foot);
      const cancel = _c.util.el('button', 'ds-cancel', footer, 'Cancel');
      cancel.type = 'button';
      _c.footer = footer;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.footer.appendChild(dock);
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
    name: 'design-set-date-time-09',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-set-date-time-09': palette },
      LOW_THEME: palette,
      ACCENTS: ['#1a5fe0'],
      LOW_ACCENTS: ['#1a5fe0'],
      parts,
    },
  });
})();
