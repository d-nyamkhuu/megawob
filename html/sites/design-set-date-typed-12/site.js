(function () {
  'use strict';
  const C = {
    site: 'design-set-date-typed-12',
    menus: ['Desk', 'File', 'Edit', 'Format', 'Options', 'Help'],
    clock: 'Mon Jul 31, 2023   10:24 AM',
    title: 'Birthday Entry',
  };
  const DOC =
    '<svg viewBox="0 0 100 110" width="100%" height="100%"><g fill="#fff" stroke="#111" stroke-width="4"><path d="M6 6h46l14 14v54H6z"/><path d="M34 40h46l14 14v52H34z"/></g><g stroke="#111" stroke-width="4"><path d="M14 24h34M14 38h34M14 52h34M42 62h44M42 74h44M42 86h26"/></g></svg>';
  const palette = { bg: '#bdbdbd', panel: '#ffffff', fg: '#111111', muted: '#777777', line: '#111111' };
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
      const top = u.el('header', 'g-menubar', document.body);
      const logo = u.el('span', 'g-logo', top);
      logo.innerHTML =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M5 20L9 4h7l3 16M7 15h11M10 8l6 10M15 7l-5 12M4 21h16M11 2h4"/></svg>';
      C.menus.forEach((t) => u.el('span', 'g-mi', top, t));
      u.el('span', 'g-clock', top, C.clock);
      const body = u.el('div', 'g-body', document.body);
      const idx = u.el('aside', 'g-index', body);
      for (let i = 1; i <= 20; i++) u.el('div', 'g-n' + (i === 1 ? ' on' : ''), idx, String(i));
      const win = u.el('div', 'g-win', body);
      const tb = u.el('div', 'g-title', win);
      const gadget = u.el('span', 'g-tgad', tb);
      gadget.innerHTML =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 5h17l-4 7H7zM5 3l3 6M20 4l-5 8M4 20l6-7h6l5 7M3 15l7 2 8-3"/></svg>';
      u.el('span', 'g-ttext', tb, C.title);
      const gadgets = u.el('span', 'g-gadgets', tb);
      u.el('span', 'g-bgad', gadgets, '□');
      u.el('span', 'g-bgad', gadgets, '✕');
      const band = u.el('div', 'g-band', win);
      const ico = u.el('div', 'g-doc', band);
      ico.innerHTML = DOC;
      const msg = u.el('div', 'g-msg', band);
      u.el('div', 'g-mt', msg, 'Tools are hidden');
      u.el('div', 'g-ms', msg, 'Click "Expand tools" to show available commands.');
      const exp = u.el('button', 'g-expand', band, 'Expand tools ▶');
      exp.type = 'button';
      const strip = u.el('div', 'g-strip', win);
      strip.hidden = true;
      ['Edit date', 'Clear date'].forEach((t) => {
        const b = u.el('button', 'g-tool', strip, t);
        b.type = 'button';
        b.addEventListener('click', () => {
          const field = _c.stage.querySelector('[data-role="field"]');
          if (!field) return;
          if (t === 'Clear date') {
            field.value = '';
            field.dispatchEvent(new Event('input', { bubbles: true }));
          }
          field.focus();
        });
      });
      exp.addEventListener('click', () => {
        const open = strip.hidden;
        strip.hidden = !open;
        msg.style.visibility = open ? 'hidden' : 'visible';
        ico.style.visibility = open ? 'hidden' : 'visible';
        exp.textContent = open ? 'Collapse tools ◀' : 'Expand tools ▶';
      });
      const sheet = u.el('div', 'g-sheet', win);
      Object.assign(_c, { header: sheet, sheet, toolbar: tb, gadgets });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('g-instr', 'g-instr-header', 'ds-instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
      _c.toolbar.insertBefore(_c.headerTools, _c.gadgets);
    },
    'frame.body': () => (_c) => { _c.body = _c.sheet; },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const note = _c.sheet.querySelector('.ref-panel');
      if (note) {
        note.classList.add('g-instr', 'g-instr-panel');
        note.querySelector('.ref-panel-text').classList.add('ds-instruction');
      }
    },
    'frame.stage': () => (_c) => { _c.stage = _c.util.el('main', 'ds-stage', _c.sheet); },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        note.classList.add('g-instr', 'g-instr-toast');
        note.querySelector('.ref-note-text').classList.add('ds-instruction');
        _c.sheet.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('g-foot');
      _c.sheet.appendChild(foot);
      const clr = _c.util.el('button', 'g-btn g-clear', foot, 'Clear');
      clr.type = 'button';
      clr.addEventListener('click', () => {
        const field = _c.stage.querySelector('[data-role="field"]');
        if (field) {
          field.value = '';
          field.dispatchEvent(new Event('input', { bubbles: true }));
          field.focus();
        }
      });
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.insertBefore(dock, _c.foot.querySelector('.g-clear'));
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
    name: C.site,
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-set-date-typed-12': palette },
      LOW_THEME: palette,
      ACCENTS: ['#111111'],
      LOW_ACCENTS: ['#111111'],
      parts,
    },
  });
})();
