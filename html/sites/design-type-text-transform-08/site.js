(function () {
  'use strict';
  const palette = { bg: '#3f6e70', panel: '#fbf3e3', fg: '#6a0f26', muted: '#5b6b6b', line: '#2c6b6b' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      const small = _c.ctx.size && (_c.ctx.size.width < 1100 || _c.ctx.size.height < 700);
      _c.display = _c.ctx.display || 'header';
      if (small && (_c.display === 'panel' || _c.display === 'toast')) _c.display = 'header';
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
      const tabs = u.el('nav', 'nb-tabs', document.body);
      ['Task', 'Notes', 'Tools', 'Reference'].forEach((t, i) => u.el('div', 'nb-tab' + (i === 0 ? ' on' : ''), tabs, t));
      const rings = u.el('div', 'nb-rings', document.body);
      for (let i = 0; i < 12; i++) u.el('i', '', rings);
      const page = u.el('div', 'nb-page', document.body);
      const head = u.el('header', 'nb-head', page);
      u.el('h1', '', head, 'Text Transformation');
      const tag = u.el('div', 'nb-tag', head);
      ['Simple tools', 'for clear work'].forEach((t) => u.el('span', '', tag, t));
      Object.assign(_c, { page, head, header: page });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('ds-header-note');
        const text = note.textContent;
        note.textContent = '';
        _c.util.el('div', 'nb-kicker', note, 'Instruction');
        _c.util.el('div', 'ds-instruction', note, text);
        const length = text.length;
        if (length > 140) note.style.setProperty('--fit', Math.sqrt(140 / length).toFixed(3));
      }
    },
    'frame.tools': (base) => (_c) => {
      const h = _c.header;
      _c.header = _c.head;
      base(_c);
      _c.header = h;
      _c.headerTools.classList.add('ds-head-tools');
    },
    'frame.body': () => (_c) => {
      _c.body = _c.util.el('div', 'ds-main' + (_c.display === 'panel' ? ' panel' : ''), _c.page);
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.body.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('ds-brief');
        panel.querySelector('.ref-panel-title').classList.add('nb-kicker');
        panel.querySelector('.ref-panel-title').textContent = 'Instruction';
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
        const kicker = _c.util.el('div', 'nb-kicker', null, 'Instruction');
        note.prepend(kicker);
        note.querySelector('.ref-note-text').classList.add('ds-instruction');
        _c.page.insertBefore(note, _c.body);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      _c.page.appendChild(foot);
      foot.querySelector('.ref-foot-text').remove();
      const clear = _c.util.el('button', 'nb-clear', null, 'Clear');
      clear.type = 'button';
      clear.addEventListener('click', () => {
        const inp = _c.stage.querySelector('input,textarea');
        if (inp) {
          inp.value = '';
          inp.dispatchEvent(new Event('input', { bubbles: true }));
          inp.focus();
        }
      });
      foot.prepend(clear);
      _c.foot = foot;
      const leaf = _c.util.el('div', 'nb-leaf', _c.page);
      leaf.innerHTML =
        '<svg viewBox="0 0 100 110" width="100%" height="100%" fill="#6e9692" stroke="#779b94" stroke-width="1.1"><path fill="none" d="M92 104Q53 81 76 9M90 102Q53 76 8 100M68 78L43 57"/><path d="M76 33Q64 15 81 2Q86 20 76 33ZM74 51Q66 35 79 25Q85 40 74 51ZM72 65Q68 48 85 39Q86 56 72 65ZM73 80Q75 61 91 56Q89 73 73 80ZM68 59Q55 54 57 36Q70 42 68 59ZM66 76Q52 72 50 56Q64 59 66 76ZM59 86Q44 84 40 67Q53 69 59 86ZM40 94Q26 103 9 101Q24 88 40 94ZM57 94Q43 107 30 104Q42 92 57 94ZM73 99Q62 109 48 108Q57 97 73 99Z"/><g fill="none" stroke="#d7dfcf" stroke-width=".8"><path d="M78 8L76 26M80 31L75 46M82 44L74 60M87 62L76 75M59 42L66 56M53 60L63 73M44 73L55 83M15 99L34 96M36 102L52 96M54 106L69 101"/></g></svg>';
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
    name: 'design-type-text-transform-08',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-type-text-transform-08': palette }, LOW_THEME: palette,
      ACCENTS: ['#7a1c2e'], LOW_ACCENTS: ['#7a1c2e'], parts,
    },
  });
})();
