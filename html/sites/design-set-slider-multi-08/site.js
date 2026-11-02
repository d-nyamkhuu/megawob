/* Image Adjuster: 2007 Vista-glass utility window with a bottom tool dock. */
(function () {
  'use strict';
  const NS = 'http://www.w3.org/2000/svg';
  function svgIcon(parent, cls, inner, vb) {
    const s = document.createElementNS(NS, 'svg');
    s.setAttribute('viewBox', vb || '0 0 48 48');
    s.setAttribute('class', cls);
    s.setAttribute('aria-hidden', 'true');
    s.innerHTML =
      '<defs><linearGradient id="vistaGold" x2="0" y2="1"><stop stop-color="#fff5b6"/><stop offset=".45" stop-color="#ffe18a"/><stop offset="1" stop-color="#efb744"/></linearGradient><linearGradient id="vistaBlue" x2="0" y2="1"><stop stop-color="#9ebeff"/><stop offset=".5" stop-color="#5486e5"/><stop offset="1" stop-color="#2756b3"/></linearGradient></defs>' +
      inner;
    parent.appendChild(s);
    return s;
  }
  const ICONS = {
    open: '<path d="M3 11Q3 7 7 7h12l5 5h17q4 0 4 4v24q0 4-4 4H7q-4 0-4-4z" fill="url(#vistaGold)" stroke="#bf800f"/><path d="M4 18q0-3 3-3h34q3 0 3 3v22q0 3-3 3H7q-3 0-3-3z" fill="url(#vistaGold)" stroke="#d79520"/><path d="M6 19v20q0 2 2 2h31M7 17h33" fill="none" stroke="#fff8d7" stroke-width="1.5"/>',
    reset:
      '<path d="M8 20C12 3 35 3 41 22h-7C30 10 16 10 13 21l5 1-10 9L2 20zM40 28C36 45 13 45 7 26h7c4 12 18 12 21 1l-5-1 10-9 6 11z" fill="url(#vistaBlue)" stroke="#3260ac"/><path d="M12 13c9-8 20-5 24 2M14 37c8 5 15 2 19-2" fill="none" stroke="#bad4ff"/>',
    fit: '<rect x="5" y="6" width="38" height="28" rx="3" fill="#dfe9f5" stroke="#5d7491" stroke-width="2"/><rect x="9" y="10" width="30" height="20" fill="#7fc0ee"/><path d="M9 30l9-11 8 8 5-5 8 8z" fill="#4c9a55"/><rect x="18" y="37" width="12" height="4" fill="#8a97a8"/><rect x="12" y="41" width="24" height="3" rx="1" fill="#6f7f93"/>',
    zoom: '<circle cx="20" cy="20" r="14" fill="#e8f3fd" stroke="#4a6585" stroke-width="3.5"/><path d="M13 20h14M20 13v14" stroke="#2f77c6" stroke-width="4"/><path d="M30 30l14 14" stroke="#3d4a5c" stroke-width="6" stroke-linecap="round"/>',
    undo: '<path d="M20 6L3 20l17 12v-9c12 0 20 5 19 18 10-19-1-29-19-28z" fill="url(#vistaBlue)" stroke="#3260ac"/><path d="M7 20l11-9M23 16c10 1 17 7 18 13" fill="none" stroke="#bdd4ff"/>',
    redo: '<path d="M28 6l17 14-17 12v-9C16 23 8 28 9 41-1 22 10 12 28 13z" fill="#9eaabe" stroke="#8894a8"/><path d="M41 20L30 10M25 16C15 17 8 23 7 29" fill="none" stroke="#cdd6e3"/>',
    app: '<rect x="3" y="7" width="42" height="34" rx="3" fill="#dfe9f5" stroke="#4b6483" stroke-width="3"/><rect x="8" y="12" width="32" height="24" fill="#76b9ec"/><path d="M8 36l10-12 8 8 6-6 8 10z" fill="#46934f"/>',
  };
  function landscape(parent) {
    const s = document.createElement('img');
    s.src = 'sites/design-set-slider-multi-08/assets/mountain-lake.webp';
    s.className = 'photo';
    s.alt = 'Mountain lake and wooden dock';
    parent.appendChild(s);
    return s;
  }
  function drawOverlay(ctx) {
    const u = ctx.util;
    const el = u.el('aside', 'survey-drawer overlay-' + ctx.kind, document.body);
    el.setAttribute('role', 'dialog');
    const survey = ctx.kind === 'chat';
    const title = {
      chat: 'Feedback',
      cookie: 'Privacy',
      toast: 'Image Adjuster',
      promo: 'Image Adjuster',
      banner: 'Notice',
    }[ctx.kind];
    u.el('h2', '', el, title);
    const x = u.el('button', 'survey-x', el, '×');
    x.setAttribute('aria-label', 'Close notice');
    x.onclick = () => ctx.dismiss('close');
    if (survey) {
      u.el('p', 'survey-intro', el, 'Quick survey (2 questions)');
      u.el('div', 'survey-question', el, '1. How easy was it to find what you needed today?');
      const choices = u.el('div', 'survey-choices', el);
      ['Very easy', 'Somewhat easy', 'Neither easy nor difficult', 'Somewhat difficult', 'Very difficult'].forEach(
        (label) => {
          const row = u.el('label', '', choices);
          const radio = u.el('input', '', row);
          radio.type = 'radio';
          radio.name = 'ease';
          radio.value = label;
          u.el('span', '', row, label);
        },
      );
      u.el('div', 'survey-question second', el, '2. What could we improve?');
      const dropdown = u.el('div', 'survey-dropdown', el);
      const toggle = u.el('button', 'survey-select', dropdown, 'Select an option…');
      toggle.type = 'button';
      toggle.setAttribute('aria-expanded', 'false');
      const options = u.el('div', 'survey-options', dropdown);
      options.hidden = true;
      for (const label of ['Finding records', 'Image quality', 'Help and guidance']) {
        const b = u.el('button', '', options, label);
        b.type = 'button';
        b.onclick = () => {
          toggle.textContent = label;
          options.hidden = true;
          toggle.setAttribute('aria-expanded', 'false');
        };
      }
      toggle.onclick = () => {
        options.hidden = !options.hidden;
        toggle.setAttribute('aria-expanded', String(!options.hidden));
      };
    } else {
      u.el(
        'p',
        'survey-intro',
        el,
        {
          cookie: 'This app can remember your display preferences.',
          toast: 'Settings are ready for editing.',
          promo: 'Try the new Image Adjuster tools.',
          banner: 'Image Adjuster is running offline.',
        }[ctx.kind],
      );
    }
    const dismiss = u.el(
      'button',
      'primary survey-close',
      el,
      survey ? 'Close survey' : ctx.kind === 'cookie' ? 'Reject optional' : 'Dismiss',
    );
    dismiss.type = 'button';
    dismiss.onclick = () => ctx.dismiss('dismiss');
    return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 5 : 0 };
  }
  const palette = { bg: '#6f9bd0', panel: '#ffffff', fg: '#071733', muted: '#3b4b60', line: '#bfc6cf' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The editor has a dedicated instruction card in its right pane in every mode.
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('vista', 'instruction-' + _c.display);
      const win = u.el('div', 'win', document.body);
      const title = u.el('header', 'titlebar', win);
      svgIcon(title, 'app-ico', ICONS.app);
      u.el('span', 'title-text', title, 'Image Adjuster');
      const caps = u.el('div', 'caps', title);
      u.el('span', 'cap cap-min', caps, '');
      u.el('span', 'cap cap-max', caps, '');
      u.el('span', 'cap cap-close', caps, '✕');
      const menu = u.el('nav', 'menubar', win);
      for (const m of ['File', 'Edit', 'View', 'Help']) u.el('span', 'menu-item', menu, m);
      const work = u.el('div', 'work', win);
      const pic = u.el('div', 'pic', work);
      landscape(pic);
      const side = u.el('section', 'side', work);
      const task = u.el('aside', 'catalog-task', side);
      const dock = u.el('footer', 'dock', win);
      const tools = u.el('div', 'tools', dock);
      const defs = [
        ['Open Image', 'open'], ['Reset', 'reset'], ['Fit to Window', 'fit'],
        ['Actual Size', 'zoom'], ['Undo', 'undo'], ['Redo', 'redo'],
      ];
      defs.forEach(([label, ic], i) => {
        const b = u.el('button', 'tool' + (i === 0 || i === 1 || i === 3 || i === 5 ? ' sep' : ''), tools);
        b.type = 'button';
        const icon = u.el('img', 'tool-ico', b);
        icon.src = 'sites/design-set-slider-multi-08/assets/tool-' + ic + '.webp';
        icon.alt = '';
        u.el('span', '', b, label);
        if (ic === 'reset') b.dataset.action = 'reset';
        b.addEventListener('click', () => env.log('decoy', { label }));
      });
      const actions = u.el('div', 'dock-actions', dock);
      const status = u.el('div', 'statusbar', win);
      Object.assign(_c, { win, work, side, task, actions, status, menu, header: task });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.task.querySelector('.ref-instruction');
      if (note) note.classList.add('instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.actions;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => { _c.body = _c.work; },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.task;
      base(_c);
      _c.body = body;
      const text = _c.task.querySelector('.ref-panel-text');
      if (text) text.classList.add('instruction');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'record-stage', _c.side);
      _c.stage.dataset.role = 'stage';
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        _c.task.appendChild(note);
        note.classList.add('instruction');
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) _c.status.appendChild(foot);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.menu.appendChild(dock);
    },
    overlay: () => drawOverlay,
  };
  env.site({
    name: 'design-set-slider-multi-08',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-set-slider-multi-08': palette },
      LOW_THEME: palette,
      ACCENTS: ['#4c97e3'],
      LOW_ACCENTS: ['#4c97e3'],
      parts,
    },
  });
})();
