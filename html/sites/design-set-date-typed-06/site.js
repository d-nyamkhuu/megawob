(function () {
  'use strict';
  const palette = { bg: '#faf9f4', panel: '#faf9f4', fg: '#1c2321', muted: '#6b6f6c', line: '#d6d6d0' };
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const top = u.el('header', 'ds-top', document.body);
      u.el('span', 'ds-brand', top, 'Household Ledger');
      const nav = u.el('nav', 'ds-nav', top);
      ['Entries', 'Reports', 'Settings'].forEach((t, i) => u.el('span', i === 0 ? 'on' : '', nav, t));
      u.el('span', 'ds-date', top, 'Aug 11, 2023');
      u.el('span', 'ds-avatar', top, 'JD');
      const body = u.el('div', 'ds-body', document.body);
      const content = u.el('div', 'ds-content', body);
      Object.assign(_c, { top, body, content, header: content });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        const text = _c.util.el('div', 'ds-instruction');
        while (note.firstChild) text.appendChild(note.firstChild);
        note.appendChild(text);
        const style = getComputedStyle(note);
        const room = note.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
        text.style.transform = 'scaleX(' + Math.min(1, room / text.scrollWidth) + ')';
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.top;
      base(_c);
      _c.header = header;
      // The widget moves this template control into its entry-action toolbar.
      if (_c.submit) _c.submit.classList.add('ds-submit');
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      _c.main = u.el('div', 'ds-main', _c.content);
      const pv = u.el('aside', 'ds-preview', _c.body);
      u.el('h3', '', pv, 'Preview');
      const pb = u.el('div', 'ds-pv', pv);
      pb.innerHTML =
        '<svg viewBox="0 0 52 66" preserveAspectRatio="none"><path d="M6 2h28l14 14v46q0 2-2 2H6q-2 0-2-2V4q0-2 2-2z" fill="none" stroke="#080b08" stroke-width="4" stroke-linejoin="round"/><path d="M34 2v14h14" fill="none" stroke="#080b08" stroke-width="4"/><path d="M14 30h24M14 40h24M14 50h24" stroke="#080b08" stroke-width="4" stroke-linecap="round"/></svg>';
      const dl = u.el('dl', '', pb);
      ['Date', 'Description', 'Category', 'Amount'].forEach((k) => {
        u.el('dt', '', dl, k);
        u.el('dd', '', dl, '—');
      });
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.main);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.body.appendChild(note);
    },
    'frame.footer': (base) => (_c) => {
      const status = _c.util.el('footer', 'ds-footer', _c.content);
      _c.util.el('span', '', status, 'Ready');
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) status.appendChild(foot);
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
    name: 'design-set-date-typed-06',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette },
      LOW_THEME: palette,
      ACCENTS: ['#bef65c'],
      LOW_ACCENTS: ['#bef65c'],
      parts,
    },
  });
})();
