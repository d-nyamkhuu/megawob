(function () {
  'use strict';
  const palette = { bg: '#59acd5', panel: '#f7fbff', fg: '#1d2b43', muted: '#4a5568', line: '#b9cfe3' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // All four displays have a dedicated place in the original briefing pane.
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
      u.el('span', 'ds-appicon', top);
      u.el('span', 'ds-brand', top, 'Memory Pads');
      const controls = u.el('div', 'ds-window-controls', top);
      ['−', '□', '×'].forEach((t, i) => u.el('span', 'ds-window-control c' + i, controls, t));
      const frame = u.el('div', 'ds-frame', document.body);
      const content = u.el('div', 'ds-content', frame);
      const main = u.el('div', 'ds-main', content);
      const brief = u.el('aside', 'ds-brief', main);
      u.el('h1', '', brief, 'Pattern Recall');
      const foot = u.el('footer', 'ds-footer', content);
      const tools = u.el('div', 'ds-toolstrip', foot);
      // These are decorative application chrome; episode controls come from the template.
      for (const [cls, icon, title, subtitle] of [
        ['ds-start', '▶', 'Start', 'New Game'],
        ['ds-reset', '⟳', 'Reset', 'Clear Progress'],
      ]) {
        const tool = u.el('div', 'ds-tool ' + cls, tools);
        u.el('span', 'ds-tool-icon', tool, icon);
        const text = u.el('span', 'ds-tool-text', tool);
        u.el('b', '', text, title);
        u.el('small', '', text, subtitle);
      }
      const sound = u.el('div', 'ds-sound', tools);
      const bars = u.el('span', 'ds-sound-icon', sound);
      [1, 2, 3].forEach(() => u.el('i', '', bars));
      u.el('span', 'ds-tool-text', sound, 'Sound');
      u.el('span', 'ds-check', sound, '✓');
      u.el('span', '', sound, 'On');
      const holder = u.el('div', 'ds-submit-holder', foot);
      holder.dataset.placement = _c.placement || 'none';
      Object.assign(_c, { top, content, main, brief, foot, holder, header: brief });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const instruction = _c.brief.querySelector('.ref-instruction');
      if (instruction) {
        instruction.classList.add('ds-instruction');
        instruction.dataset.mode = _c.display;
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.holder;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => { _c.body = _c.main; },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.brief;
      base(_c);
      _c.body = body;
      const panel = _c.brief.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('ds-instruction');
        panel.dataset.mode = 'panel';
      }
      const u = _c.util;
      u.el('div', 'ds-copy', _c.brief,
        'A sequence of pads will light up. After the sequence finishes, click the pads in the same order.');
      const readout = u.el('div', 'ds-readout', _c.brief);
      u.el('div', 'ds-readout-line', readout, 'Round: 1');
      u.el('div', 'ds-readout-line', readout, 'Sequence length: 3');
      u.el('div', 'ds-readout-line', readout, 'Status: Watch…');
    },
    'frame.stage': () => (_c) => { _c.stage = _c.util.el('main', 'ds-stage', _c.main); },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('ds-toast');
        _c.brief.insertBefore(note, _c.brief.querySelector('.ds-copy'));
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) {
        foot.querySelector('.ref-foot-text').remove();
        _c.holder.appendChild(foot);
      }
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.holder.appendChild(dock);
      // Preserve each template wrapper while putting the action before auxiliary buttons.
      let action = _c.holder.querySelector('[data-role="submit"]');
      while (action && action.parentElement !== _c.holder) {
        const parent = action.parentElement;
        parent.insertBefore(action, parent.firstChild);
        action = parent;
      }
      if (action) _c.holder.insertBefore(action, _c.holder.firstChild);
      if (!_c.holder.querySelector('button, a')) _c.holder.remove();
    },
    overlay: () => (ctx) => {
      const u = ctx.util;
      const el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const title = u.el('header', 'ds-update-title', el);
      u.el('span', 'ds-update-logo', title, '✦');
      u.el('b', '', title, 'Windows Update');
      const x = u.el('button', 'ds-update-x', title, '×');
      x.type = 'button';
      x.setAttribute('aria-label', 'Close');
      x.addEventListener('click', () => ctx.dismiss('close'));
      const body = u.el('div', 'ds-update-body', el);
      const shield = u.el('span', 'ds-shield', body);
      shield.innerHTML =
        '<svg viewBox="0 0 64 76" aria-hidden="true"><defs><linearGradient id="vista-shield" x2="1" y2="1"><stop stop-color="#fff4ae"/><stop offset=".5" stop-color="#ffc63e"/><stop offset="1" stop-color="#da8a08"/></linearGradient></defs><path d="M32 3C23 10 14 13 4 15L6 41C8 55 17 65 32 73C47 65 56 55 58 41L60 15C50 13 41 10 32 3Z" fill="#aebbc1" stroke="#3d4850" stroke-width="3"/><path d="M32 8C24 14 17 16 9 18L11 40C13 52 20 61 32 67C44 61 51 52 53 40L55 18C47 16 40 14 32 8Z" fill="url(#vista-shield)" stroke="#fff0a0" stroke-width="2"/><path d="M32 9V66C21 60 14 52 12 40L10 19C18 17 25 14 32 9Z" fill="#fff" opacity=".18"/><path d="M28 22H36L34.5 45H29.5ZM28.5 51H35.5V58H28.5Z" fill="#253c47"/></svg>';
      const message = u.el('div', 'ds-update-message', body);
      u.el('b', '', message, 'New updates are available');
      u.el('p', '', message, 'Keep your computer more secure and performant with the latest updates from Microsoft.');
      const actions = u.el('div', 'ds-update-actions', el);
      const later = u.el('button', 'ds-remind', actions, 'Remind me later');
      later.type = 'button';
      later.addEventListener('click', () => ctx.dismiss('close'));
      const view = u.el('button', 'ds-view-updates', actions, 'View updates');
      view.type = 'button';
      view.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss: later };
    },
  };
  env.site({
    name: 'design-act-in-time-simon-11',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    initialOverlay: { kind: 'promo' },
    design: {
      THEMES: { 'design-act-in-time-simon-11': palette },
      LOW_THEME: palette,
      ACCENTS: ['#1553c2'],
      LOW_ACCENTS: ['#1553c2'],
      parts,
    },
  });
})();
