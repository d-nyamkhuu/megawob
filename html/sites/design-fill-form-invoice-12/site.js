(function () {
  'use strict';
  const palette = { bg: '#a1a3ac', panel: '#aaaab0', fg: '#0d0f17', muted: '#72747c', line: '#15182a' };
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
      u.el('span', 'ds-ball', top);
      u.el('span', 'ds-brand', top, 'Amiga  Workbench');
      u.el('span', 'ds-mem', top, '2,048,000 graphics mem   1,024,000 other mem');
      u.el('span', 'ds-clock', top, 'Mon 14 Sep 2026   10:24');
      u.el('span', 'ds-front', top);
      const desktop = u.el('div', 'ds-body', document.body);
      const icons = u.el('aside', 'ds-icons', desktop);
      const pictures = {
        disk: '<path d="M11 3H65L74 10V69H11Z" fill="#063fb4"/><path d="M23 4H61V31H23Z" fill="#d5d6d9"/><path d="M49 8H58V24H49Z" fill="#777"/><path d="M21 35H63V66H21Z" fill="#eee"/><path d="M25 40H60M25 45H60M25 50H60M25 55H60M25 60H60" stroke="#777"/><path d="M15 5V66M25 7H45" stroke="white"/>',
        drawer: '<path d="M2 22L15 10H83V48L72 61H2Z" fill="#a4a4a4"/><path d="M2 22H72L83 10M72 22V61" fill="none"/><path d="M8 28H65V54H8Z" fill="#ddd"/><path d="M12 32H61V49H12Z" fill="#999"/><path d="M30 37H47V42H30Z" fill="#ddd"/><path d="M5 24H69M10 29H62M17 13H78" stroke="white"/>',
        trash: '<path d="M22 18L25 70Q45 79 65 70L68 18Z" fill="#aaa"/><path d="M27 24L30 69M36 26V71M45 27V73M54 26V71M63 24L60 69" stroke="#111" stroke-width="4"/><path d="M25 24L28 68M40 28V69M57 28V68" stroke="white"/><ellipse cx="45" cy="18" rx="29" ry="10" fill="#ddd"/><ellipse cx="45" cy="17" rx="22" ry="5" fill="#555"/><path d="M35 16V6H55V16" fill="none" stroke-width="5"/><path d="M38 12V7H52" stroke="white"/>',
      };
      [['Ram Disk', 'disk'], ['Work', 'drawer'], ['Documents', 'drawer'], ['Wastebasket', 'trash']].forEach(([t, k]) => {
        const i = u.el('div', 'ds-icon ds-icon-' + k, icons);
        const pic = u.el('i', '', i);
        pic.innerHTML = '<svg viewBox="' + (k === 'drawer' ? '0 5 90 65' : k === 'disk' ? '5 0 75 74' : '0 0 90 82') + '" shape-rendering="crispEdges"><g stroke="#111" stroke-width="2" stroke-linejoin="miter">' + pictures[k] + '</g></svg>';
        u.el('span', '', i, t);
      });
      const win = u.el('div', 'ds-window', desktop);
      const toolbar = u.el('div', 'ds-titlebar', win);
      u.el('b', 'ds-gad ds-close', toolbar);
      u.el('span', 'ds-wtitle', toolbar, 'Invoice Entry');
      u.el('b', 'ds-gad ds-zoom', toolbar);
      u.el('b', 'ds-gad ds-max', toolbar);
      u.el('b', 'ds-gad ds-close2', toolbar);
      const content = u.el('div', 'ds-content', win);
      Object.assign(_c, { toolbar, content, header: content });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('ds-header-note');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
      _c.headerTools.classList.add('ds-title-tools');
      _c.toolbar.insertBefore(_c.headerTools, _c.toolbar.querySelector('.ds-zoom'));
    },
    'frame.body': () => (_c) => {
      _c.body = _c.util.el('div', 'ds-main', _c.content);
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.body.querySelector('.ref-panel');
      if (panel) panel.classList.add('ds-brief');
    },
    'frame.stage': () => (_c) => {
      const u = _c.util;
      _c.stage = u.el('main', 'ds-stage', _c.body);
      const view = u.el('aside', 'ds-view', _c.body);
      u.el('div', 'ds-view-h', view, 'View Options');
      const vb = u.el('div', 'ds-view-b', view);
      [['Show grid', true], ['Fit to window', false], ['Monochrome', false]].forEach(([t, on]) => {
        const r = u.el('button', 'ds-chk' + (on ? ' on' : ''), vb);
        r.type = 'button';
        r.setAttribute('aria-pressed', String(on));
        u.el('i', '', r);
        u.el('span', '', r, t);
        r.addEventListener('click', () => {
          r.classList.toggle('on');
          r.setAttribute('aria-pressed', String(r.classList.contains('on')));
        });
      });
      u.el('hr', '', vb);
      const sv = u.el('button', 'ds-save', vb, 'Save view');
      sv.type = 'button';
      const saveNote = u.el('div', 'ds-save-note', vb, '(Saves only presentation preferences)');
      sv.addEventListener('click', () => {
        env.log('decoy', { label: 'Save view' });
        view.dataset.preferences = JSON.stringify([...vb.querySelectorAll('.ds-chk')].map((r) => r.classList.contains('on')));
        saveNote.textContent = '(View preferences saved)';
      });
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('ds-toast');
        _c.content.insertBefore(note, _c.body);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      _c.content.appendChild(foot);
      const cancel = _c.util.el('button', 'ds-cancel', foot, 'Clear Fields');
      cancel.type = 'button';
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.prepend(dock);
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
    name: 'design-fill-form-invoice-12',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-fill-form-invoice-12': palette },
      LOW_THEME: palette,
      ACCENTS: ['#003bbb'],
      LOW_ACCENTS: ['#003bbb'],
      parts,
    },
  });
})();
