(function () {
  'use strict';
  const palette = { bg: '#eef4f9', panel: '#f1f5f9', fg: '#15182c', muted: '#66717e', line: '#b9c4d0' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
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
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = _c.util;
      const top = u.el('header', 'ds-top', document.body);
      u.el('span', 'ds-brand', top, 'Customer Intake');
      const wc = u.el('span', 'ds-wc', top);
      u.el('i', '', wc, '–');
      u.el('i', '', wc, '□');
      u.el('i', 'x', wc, '✕');
      const outer = u.el('div', 'ds-body', document.body);
      const content = u.el('div', 'ds-content', outer);
      Object.assign(_c, { top, wc, content, header: content });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('ds-header-note', 'ds-instruction');
        note.dataset.display = _c.display;
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.top;
      base(_c);
      _c.header = header;
      _c.headerTools.classList.add('ds-tools');
      _c.top.insertBefore(_c.headerTools, _c.wc);
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
        const note = panel.querySelector('.ref-panel-text');
        note.classList.add('ds-instruction');
        note.dataset.display = _c.display;
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('ds-toast');
        const text = note.querySelector('.ref-note-text');
        text.classList.add('ds-instruction');
        text.dataset.display = _c.display;
        _c.content.insertBefore(note, _c.body);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      foot.querySelector('.ref-foot-text').textContent = 'Ready';
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
      if (ctx.kind === 'cookie') {
        const el = u.el('section', 'ds-overlay ds-initial ds-initial-consent ds-consent-overlay', document.body);
        el.dataset.role = 'overlay';
        u.el('h2', '', el, 'Data Consent');
        u.el('p', '', el, 'We need your consent to process and store\nthis information for customer intake purposes.');
        u.el('p', '', el, 'Do you agree to allow your entries to be stored\nin our system?');
        const btns = u.el('div', 'ds-btns', el);
        const dismiss = u.el('button', '', btns, 'Reject (optional)');
        const agree = u.el('button', 'ds-agree', btns, 'I Agree');
        dismiss.type = agree.type = 'button';
        dismiss.addEventListener('click', () => ctx.dismiss('close'));
        agree.addEventListener('click', () => ctx.dismiss('close'));
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
    name: 'design-fill-form-email-11',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    initialOverlay: { kind: 'cookie' },
    design: {
      THEMES: { site: palette },
      LOW_THEME: palette,
      ACCENTS: ['#1476bf'],
      LOW_ACCENTS: ['#1476bf'],
      parts,
    },
  });
})();
