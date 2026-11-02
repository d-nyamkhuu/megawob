(function () {
  'use strict';
  const palette = { bg: '#f6f7f9', panel: '#fafbfc', fg: '#131722', muted: '#6b727c', line: '#dde0e5' };
  const notes = [
    'Enter the information exactly as shown on the receipt.',
    'If a field is not on the receipt, leave it blank.',
    'Check that all entered information matches the receipt.',
  ];
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original uses its dedicated left pane even on compact screens.
      _c.display = _c.ctx.display || 'header';
      document.body.classList.toggle('ref-has-note', _c.display === 'toast');
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const top = u.el('header', 'ds-top', document.body);
      const act = u.el('span', 'ds-act', top);
      act.innerHTML =
        '<svg viewBox="0 0 16 20" width="14" height="18"><path d="M8 1 3 6v4L1 12l3 6 6 1 4-5-2-5-4-1V5l3-2z" fill="white"/><path d="M5 10h5v5H6" fill="none" stroke="#333"/></svg><span>Activities</span>';
      const app = u.el('span', 'ds-app', top);
      app.innerHTML =
        '<svg viewBox="0 0 16 16" width="16" height="16"><rect x="1" y="1" width="14" height="14" rx="3" fill="#2b7bf0"/><path d="M5 5h6M5 8h6M5 11h4" stroke="#fff" stroke-width="1.4"/></svg>';
      u.el('span', '', app, 'Receipt Entry');
      u.el('span', 'ds-clock', top, 'Sat Sep 13  10:24');
      const sys = u.el('span', 'ds-sys', top);
      sys.innerHTML =
        '<svg viewBox="0 0 24 24"><path d="M2 8q10-8 20 0M5 11q7-6 14 0M8 14q4-3 8 0" fill="none" stroke="white" stroke-width="2.7"/><path d="m10 17 2 3 2-3z" fill="white"/></svg><svg viewBox="0 0 24 24"><path d="M3 9h4l5-5v16l-5-5H3z" fill="white"/><path d="M16 7q6 5 0 10M19 4q8 8 0 16" fill="none" stroke="white" stroke-width="1.8"/></svg><svg viewBox="0 0 28 24"><rect x="2" y="5" width="22" height="14" rx="2" fill="none" stroke="white" stroke-width="2"/><path d="M25 10h2v4h-2M5 8h16v8H5z" fill="white"/></svg>';
      const head = u.el('div', 'ds-head', document.body);
      const ht = u.el('div', 'ds-head-t', head);
      u.el('b', '', ht, 'Receipt Entry');
      u.el('span', '', ht, 'Enter the details from the receipt');
      const wc = u.el('div', 'ds-wc', head);
      const group = u.el('div', 'ds-wc-group', wc);
      ['–', '▫'].forEach((t) => u.el('span', '', group, t));
      u.el('span', 'ds-wc-close', wc, '×');
      const body = u.el('div', 'ds-body');
      const content = u.el('div', 'ds-content', body);
      const main = u.el('div', 'ds-main', content);
      const brief = u.el('aside', 'ds-brief', main);
      brief.hidden = !['header', 'panel'].includes(_c.display);
      if (!brief.hidden) {
        const ic = u.el('div', 'ds-icon', brief);
        ic.innerHTML =
          '<svg viewBox="0 0 36 36" width="36" height="36"><rect width="36" height="36" rx="9" fill="#2b7bf0"/><path d="M11 8h10l5 5v15H11z" fill="#fff"/><path d="M14 17h8M14 21h8M14 25h6" stroke="#2b7bf0" stroke-width="2"/></svg>';
        u.el('h2', '', brief, 'Task');
      }
      const right = u.el('div', 'ds-right', main);
      Object.assign(_c, { head, body, content, main, brief, right, header: brief });
    },
    'frame.nav': () => () => {},
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.head;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      document.body.appendChild(_c.body);
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.brief;
      base(_c);
      _c.body = body;
      if (!_c.brief.hidden) {
        const u = _c.util;
        u.el('hr', '', _c.brief);
        u.el('h3', '', _c.brief, 'Notes');
        const ul = u.el('ul', 'ds-notes', _c.brief);
        notes.forEach((t) => u.el('li', '', ul, t));
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.right);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.content.insertBefore(note, _c.main);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      foot.querySelector('.ref-foot-text').remove();
      _c.right.appendChild(foot);
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
    name: 'design-fill-form-invoice-06',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-fill-form-invoice-06': palette },
      LOW_THEME: palette,
      ACCENTS: ['#0868f9'],
      LOW_ACCENTS: ['#0868f9'],
      parts,
    },
  });
})();
