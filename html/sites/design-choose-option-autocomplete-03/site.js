(function () {
  'use strict';
  const palette = { bg: '#9a9aa6', panel: '#bdbdbd', fg: '#101010', muted: '#404040', line: '#202020' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The notebook has room for its own note cards at every supported size.
      _c.display = _c.ctx.display || 'header';
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
      u.el('span', 'ds-logo', top);
      u.el('span', 'ds-brand', top, 'Amiga Workbench');
      u.el('span', 'ds-clock', top, 'Mon  Apr 22  1991   10:24');
      const gad = u.el('span', 'ds-gads', top);
      u.el('i', '', gad);
      u.el('i', '', gad);
      const shell = u.el('div', 'ds-body', document.body);
      const tabs = u.el('aside', 'ds-tabs', shell);
      ['Trip Details', 'Traveller Info', 'Preferences', 'Review', 'Confirm'].forEach((t, i) =>
        u.el('div', 'ds-tab' + (i === 0 ? ' on' : ''), tabs, t),
      );
      const rings = u.el('div', 'ds-rings', shell);
      for (let i = 0; i < 13; i++) u.el('i', '', rings);
      const content = u.el('div', 'ds-content', shell);
      const title = u.el('div', 'ds-ptitle', content);
      u.el('span', 'ds-title-text', title, 'Plan a Trip');
      Object.assign(_c, { content, title, header: content });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('ds-header-note', 'ds-instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.title;
      base(_c);
      _c.header = header;
      _c.headerTools.classList.add('ds-title-tools');
    },
    'frame.body': () => (_c) => {
      _c.body = _c.util.el('div', 'ds-main', _c.content);
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.body.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('ds-brief');
        panel.querySelector('.ref-panel-text').classList.add('ds-instruction');
      }
    },
    'frame.stage': () => (_c) => {
      const u = _c.util;
      const form = u.el('div', 'ds-form', _c.body);
      _c.stage = u.el('main', 'ds-stage', form);
      [
        ['From:', 'London', 'ds-r1 ds-l'],
        ['Depart Date:', 'May 14, 1991', 'ds-r1 ds-r'],
        ['Return Date:', 'May 28, 1991', 'ds-r2 ds-r'],
        ['Passengers:', '1', 'ds-r4 ds-l ds-sm'],
        ['Class:', 'Economy', 'ds-r4 ds-r'],
      ].forEach((a) => {
        const row = u.el('div', 'ds-row ' + a[2], form);
        u.el('span', 'ds-lab', row, a[0]);
        const f = u.el('span', 'ds-fake', row);
        u.el('span', '', f, a[1]);
        u.el('b', 'ds-btn', f, a[0] === 'Passengers:' ? '▲▼' : a[0].indexOf('Date') > 0 ? '▦' : '▼');
      });
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('ds-toast');
        note.querySelector('.ref-note-text').classList.add('ds-instruction');
        _c.content.insertBefore(note, _c.body);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      _c.content.appendChild(foot);
      const cancel = _c.util.el('button', 'ds-travel-cancel', foot, 'Cancel');
      cancel.type = 'button';
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.insertBefore(dock, _c.foot.querySelector('.ds-travel-cancel'));
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
    name: 'design-choose-option-autocomplete-03',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette },
      LOW_THEME: palette,
      ACCENTS: ['#ff8c28'],
      LOW_ACCENTS: ['#ff8c28'],
      parts,
    },
  });
})();
