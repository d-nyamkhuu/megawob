(function () {
  'use strict';
  const SITE = 'design-choose-option-checkbox-10';
  const palette = { bg: '#c9d9c4', panel: '#e8e4d6', fg: '#111111', muted: '#66717e', line: '#6b7aa8' };
  const description = 'Choose the topics you’re interested in. This helps us show you relevant news, events, and discussion groups.';
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // All four displays have their own place in the original content pane.
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
      const u = _c.util;
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const top = u.el('header', 'ds-top', document.body);
      const nav = u.el('nav', 'ds-menu', top);
      ['Home', 'Our Town', 'Events', 'Interest Groups', 'Photo Gallery', 'Guestbook'].forEach((t) => {
        const a = u.el('a', '', nav, t);
        a.addEventListener('click', () => env.log('decoy', { label: t }));
      });
      const mast = u.el('div', 'ds-mast', top);
      const mt = u.el('div', 'ds-mast-t', mast);
      u.el('span', 'ds-tree', mt);
      u.el('span', 'ds-mast-h', mt, 'Maple Grove Community');
      u.el('span', 'ds-tree', mt);
      u.el('div', 'ds-mast-s', mast, 'Neighbors ✦ Ideas ✦ A Brighter Tomorrow');
      u.el('div', 'ds-house', top, '⌂');
      u.el('div', 'ds-tag', top, 'Small Town\nBig Friendships');
      u.el('span', 'ds-flowers', top);
      const wel = u.el('div', 'ds-welcome', top);
      u.el('h3', '', wel, 'Welcome to Maple Grove!');
      u.el('p', '', wel, 'Maple Grove is a friendly online home for neighbors, hobbyists, and lifelong learners. Explore interest groups, share ideas, and find local events.');
      const wq = u.el('div', 'ds-wq', wel);
      u.el('div', 'ds-pic', wq);
      u.el('em', '', wq, '“A stronger community grows together.”');
      const ql = u.el('div', 'ds-ql', top);
      const toolbar = u.el('h3', '', ql, 'Quick Links');
      ['Community Calendar', 'Local Resources', 'Neighborhood Directory', 'Contact Us'].forEach((t, i) => {
        const a = u.el('a', '', ql);
        const icon = u.el('img', 'ds-link-icon', a);
        icon.src = 'sites/' + SITE + '/assets/' + ['calendar', 'people', 'book', 'mail'][i] + '.webp';
        icon.alt = '';
        u.el('span', '', a, t);
      });
      u.el('div', 'ds-split', document.body);
      const body = u.el('div', 'ds-body', document.body);
      const content = u.el('div', 'ds-content', body);
      const lh = u.el('div', 'ds-lhead', content);
      u.el('span', 'ds-checklist', lh);
      u.el('span', 'ds-lh-h', lh, 'Update Your Interests');
      u.el('span', 'ds-lh-d', lh, 'Tuesday, April 16, 1996');
      const header = u.el('div', _c.display === 'header' ? 'ds-header-note' : 'ds-note-host', content);
      Object.assign(_c, { header, toolbar, body, content });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('ds-instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      if (_c.display === 'header') _c.util.el('div', 'ds-desc', _c.content, description);
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
        panel.querySelector('.ref-panel-title').textContent = 'Your Task';
        panel.querySelector('.ref-panel-text').classList.add('ds-instruction');
        _c.util.el('div', 'ds-desc', panel, description);
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.main);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('ds-toast');
        note.querySelector('.ref-note-text').classList.add('ds-instruction');
        _c.content.insertBefore(note, _c.main);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) {
        foot.classList.add('ds-footer');
        foot.querySelector('.ref-foot-text').remove();
        _c.content.appendChild(foot);
      }
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
    },
    'overlay': () => (ctx) => {
      const u = ctx.util;
      if (ctx.initial) {
        const el = u.el('section', 'ds-initial ds-initial-tour', document.body);
        el.dataset.role = 'overlay';
        u.el('h2', '', el, 'Welcome!');
        u.el('p', '', el, 'Take a quick tour to learn about setting your preferences.');
        const dismiss = u.el('button', '', el, 'Guestbook');
        dismiss.title = 'Skip tour';
        dismiss.type = 'button';
        dismiss.addEventListener('click', () => ctx.dismiss('close'));
        return { el, dismiss, ttlSteps: 0 };
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
    name: SITE,
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    initialOverlay: { kind: 'toast' },
    design: {
      THEMES: { site: palette },
      LOW_THEME: palette,
      ACCENTS: ['#4d82b2'],
      LOW_ACCENTS: ['#4d82b2'],
      parts,
    },
  });
})();
