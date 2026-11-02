(function () {
  'use strict';
  const palette = { bg: '#f3f1ea', panel: '#f9f8f3', fg: '#15151a', muted: '#66707d', line: '#bbc2c9' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
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
      u.el('span', 'np-logo', top);
      u.el('span', 'ds-brand', top, 'NotePad Pro');
      const mn = u.el('span', 'np-menu', top);
      ['File', 'Edit', 'View', 'Format', 'Help'].forEach((t) => u.el('span', '', mn, t));
      const wins = u.el('span', 'np-win', top);
      ['minimize', 'maximize', 'close'].forEach((k) => u.el('i', 'np-win-' + k, wins));
      const tools = u.el('div', 'np-tools', document.body);
      [['New'], ['Open'], ['Save'], ['|'], ['Undo'], ['Redo'], ['|'], ['Plain Text ▾']].forEach((t) => {
        if (t[0] === '|') u.el('i', 'np-sep', tools);
        else {
          const icon = u.el('b', 'np-ic np-ic-' + t[0].split(' ')[0].toLowerCase(), tools);
          const paths = {
            New: '<path d="M5 2h14l8 8v23H5z M19 2v9h8"/>',
            Open: '<path d="M2 11h30v21H2z" fill="currentColor" stroke="none"/><path d="M3 8V5h10l4 4h14"/>',
            Save: '<path d="M3 2h25l5 5v27H3z M9 2v12h17V2 M10 34V21h16v13"/>',
            Undo: '<path d="M12 5L3 13l9 8 M4 13h16a11 11 0 0 1 0 22H13"/>',
            Redo: '<path d="M23 5l9 8-9 8 M31 13H15a11 11 0 0 0 0 22h7"/>',
            'Plain Text ▾': '<path d="M2 8h20 M12 8v25 M22 18h12 M28 18v15"/>',
          };
          icon.innerHTML = '<svg viewBox="0 0 36 38" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linejoin="miter">' + paths[t[0]] + '</svg>';
          u.el('span', 'np-tl' + (t[0] === 'Redo' ? ' dim' : ''), tools, t[0]);
        }
      });
      const foot = u.el('footer', 'ds-footer');
      if (_c.display === 'header') u.el('span', 'np-tasklbl', foot, 'Task:');
      Object.assign(_c, { toolbar: tools, foot, header: foot });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('ds-header-note', 'ds-instruction');
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
      const icon = _c.toolbar.querySelector('.ref-icon');
      if (icon) {
        const title = document.body.querySelector('.ds-top');
        const home = _c.util.el('div', 'np-title-end');
        home.appendChild(icon);
        title.insertBefore(home, title.querySelector('.np-win'));
      }
      document.body.classList.toggle('np-no-footer-end', !['footer', 'link', 'floating'].includes(_c.placement));
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const body = u.el('div', 'ds-body', document.body);
      const rail = u.el('aside', 'ds-rail', body);
      ['Contacts', 'Calendar', 'Notes', 'Settings'].forEach((t) => u.el('div', '', rail, t));
      const content = u.el('div', 'ds-content', body);
      const main = u.el('div', 'ds-main', content);
      content.appendChild(_c.foot);
      Object.assign(_c, { body: main, content });
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.body.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('ds-brief');
        panel.querySelector('.ref-panel-title').textContent = 'Instructions';
        panel.querySelector('.ref-panel-text').classList.add('ds-instruction');
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
        note.querySelector('.ref-note-text').classList.add('ds-instruction');
        _c.content.insertBefore(note, _c.body);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      _c.foot.appendChild(foot);
      foot.querySelector('.ref-foot-text').remove();
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
        cookie:
          'We use optional cookies to improve your experience, analyze usage, and show personalized content. You can accept all cookies or reject optional ones. Essential cookies will always be used.',
        toast: 'Changes synced.',
        chat: 'Hello. How can we help?',
        promo: 'Try our new workspace.',
        banner: 'Scheduled maintenance tonight.',
      };
      if (ctx.kind === 'cookie') u.el('h2', '', el, 'We value your privacy');
      u.el('div', 'np-ov-t', el, texts[ctx.kind]);
      if (ctx.kind === 'cookie') u.el('a', 'np-learn', el, 'Learn more');
      const row = u.el('div', 'np-ov-row', el);
      const dismiss = u.el('button', 'np-rej', row, ctx.kind === 'cookie' ? 'Reject optional' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      if (ctx.kind === 'cookie') {
        const acc = u.el('button', 'np-acc', row, 'Accept all');
        acc.addEventListener('click', () => ctx.dismiss('close'));
      }
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  };
  env.site({
    name: 'design-find-fact-find-word-11',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    initialOverlay: { kind: 'cookie' },
    design: {
      THEMES: { site: palette },
      LOW_THEME: palette,
      ACCENTS: ['#ee6a1a'],
      LOW_ACCENTS: ['#ee6a1a'],
      parts,
    },
  });
})();
