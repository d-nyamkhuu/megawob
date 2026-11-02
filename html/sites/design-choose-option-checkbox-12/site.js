(function () {
  'use strict';
  const palette = { bg: '#f5f5f5', panel: '#ffffff', fg: '#212839', muted: '#5f6675', line: '#e0e3ea' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // This frame has room for its original inline notes at every viewport.
      _c.display = _c.ctx.display || 'header';
      document.body.classList.toggle('ref-has-note', _c.display === 'toast');
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
      const win = u.el('div', 'sf-win', document.body);
      const top = u.el('header', 'ds-top', win);
      u.el('span', 'sf-home', top);
      u.el('span', 'ds-brand', top, 'StayFinder');
      ['Stays', 'Experiences', 'Saved', 'Trips'].forEach((t) => u.el('span', 'sf-nav', top, t));
      u.el('span', 'sf-avatar', top);
      const hero = u.el('div', 'sf-hero', win);
      u.el('div', 'sf-h1', hero, 'Explore your next stay');
      u.el('div', 'sf-h2', hero, 'Homes, apartments and more');
      u.el('span', 'sf-mount', hero);
      const body = u.el('div', 'ds-body', win);
      const rail = u.el('aside', 'ds-rail', body);
      u.el('div', 'sf-ft', rail, 'Filters');
      u.el('div', 'sf-fs', rail, 'Narrow down your results');
      ['Location', 'Dates', 'Guests', 'Amenities', 'Property type'].forEach((t) => {
        const it = u.el('div', 'sf-item' + (t === 'Amenities' ? ' on' : ''), rail);
        u.el('span', 'sf-ic', it);
        u.el('span', '', it, t);
      });
      const side = u.el('aside', 'sf-side', document.body);
      const sh = u.el('div', 'sf-sh', side, 'Your search');
      u.el('span', '', sh, '—');
      ['San Diego, CA', 'Apr 12, 2015 – Apr 18, 2015', '2 guests'].forEach((t) => {
        const r = u.el('div', 'sf-row', side);
        u.el('span', 'sf-ic sm', r);
        u.el('span', '', r, t);
      });
      u.el('hr', 'sf-hr', side);
      u.el('div', 'sf-img', side);
      u.el('div', 'sf-pt', side, 'Find the perfect place');
      u.el('div', 'sf-ps', side, 'Apply filters to see updated results.');
      const content = u.el('div', 'ds-content', body);
      Object.assign(_c, { win, top, content, header: content, body });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('ds-header-note', 'ds-instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.top;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      _c.main = _c.util.el('div', 'ds-main', _c.content);
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.main;
      base(_c);
      _c.body = body;
      const panel = _c.main.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('ds-brief');
        panel.querySelector('.ref-panel-text').classList.add('ds-instruction');
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.main);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        note.classList.add('ds-toast');
        note.querySelector('.ref-note-text').classList.add('ds-instruction');
        _c.content.insertBefore(note, _c.main);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      _c.win.appendChild(foot);
      foot.querySelector('.ref-foot-text').textContent = 'Clear all filters';
      _c.foot = foot;
    },
    overlay: () => (ctx) => {
      const u = ctx.util;
      if (ctx.initial) {
        const stage = document.querySelector('.ds-stage');
        if (stage) stage.inert = true;
        const obstacle = u.el('section', 'ds-initial ds-initial-tour', document.body);
        const close = u.el('button', '', obstacle, 'Expand tools  ⌄');
        close.type = 'button';
        close.addEventListener('click', () => {
          if (stage) stage.inert = false;
          ctx.dismiss('close');
          env.log('reference-obstruction-dismiss', { kind: 'tour' });
        });
        return { el: obstacle, dismiss: close };
      }
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
    name: 'design-choose-option-checkbox-12',
    template: 'site/base',
    langs: ['en'],
    initialOverlay: { kind: 'tour' },
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-choose-option-checkbox-12': palette },
      LOW_THEME: palette,
      ACCENTS: ['#3350c4'],
      LOW_ACCENTS: ['#3350c4'],
      parts,
    },
  });
})();
