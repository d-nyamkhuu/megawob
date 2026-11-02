/* BeOS-style desktop: Image Adjuster window with the task, a Preview decoy window, seeded instruction note. */
(function () {
  'use strict';
  // Decorative crops from the accepted screenshot; interactive controls remain DOM.
  function sprite(parent, box, cls) {
    const svg = env.util.svg('svg', {viewBox: box.join(' '), class: cls, 'aria-hidden': 'true'}, parent);
    env.util.svg('image', {href: 'sites/design-set-slider-multi-12/assets/reference-sprites.webp', width: 1672, height: 941}, svg);
    return svg;
  }
  function titlebar(u, parent, text, buttons) {
    const bar = u.el('div', 'bt-title', parent);
    const ic = sprite(bar, [153, 44, 30, 32], 'bt-ticon');
    ic.setAttribute('aria-hidden', 'true');
    u.el('span', 'bt-ttext', bar, text);
    if (buttons) {
      const b = u.el('span', 'bt-tbtns', bar);
      sprite(b, [1101, 45, 29, 31], 'bt-tbtn');
      sprite(b, [1134, 45, 29, 31], 'bt-tbtn');
    }
    return bar;
  }
  function eye(u, parent) {
    sprite(parent, [1258, 218, 75, 49], 'bt-eye');
  }
  function landscape(u, parent) {
    sprite(parent, [1193, 377, 415, 254], 'bt-photo');
    return;
    const svg = env.util.svg('svg', {viewBox: '0 0 100 62', class: 'bt-photo', preserveAspectRatio: 'none', 'aria-hidden': 'true'}, parent);
    const s = env.util.svg;
    s('rect', {width: 100, height: 62, fill: '#4f86c9'}, svg);
    s('path', {d: 'M0 28 L35 22 L52 8 L62 12 L78 24 L100 26 L100 36 L0 36Z', fill: '#cfd6e0'}, svg);
    s('path', {d: 'M0 30 L100 30 L100 36 L0 36Z', fill: '#25492f'}, svg);
    s('rect', {y: 33, width: 100, height: 14, fill: '#1c3a28'}, svg);
    s('rect', {y: 47, width: 100, height: 15, fill: '#3e6a9c'}, svg);
    s('path', {d: 'M0 47 L100 47 L100 52 L0 52Z', fill: '#274d6e'}, svg);
    s('path', {d: 'M8 33 L12 12 L16 33Z M20 33 L24 16 L28 33Z M0 33 L4 18 L7 33Z', fill: '#16351f'}, svg);
  }
  function drawOverlay(ctx) {
    const u = ctx.util;
    if (ctx.initial) {
      const el = u.el('aside', 'reference-initial', document.querySelector('.bt-prev'));
      el.setAttribute('role', 'dialog');
      el.setAttribute('aria-label', 'Image preview');
      const dismiss = u.el('button', 'bt-bigprev', el);
      dismiss.type = 'button';
      eye(u, dismiss);
      const text = u.el('span', 'bt-bigtxt', dismiss);
      u.el('b', '', text, 'Preview');
      u.el('small', '', text, 'Click to preview changes');
      dismiss.onclick = () => ctx.dismiss('preview');
      return {el, dismiss};
    }
    const el = u.el('aside', 'bt-win survey-drawer overlay-' + ctx.kind, document.body);
    el.setAttribute('role', 'dialog');
    const survey = ctx.kind === 'chat';
    const title = {chat: 'Feedback', cookie: 'Privacy', toast: 'Notice', promo: 'Upgrade', banner: 'System notice'}[ctx.kind];
    titlebar(u, el, title, false);
    const x = u.el('button', 'survey-x', el, '×'); x.setAttribute('aria-label', 'Close notice'); x.onclick = () => ctx.dismiss('close');
    const body = u.el('div', 'bt-dlg', el);
    if (survey) {
      u.el('p', 'survey-intro', body, 'Quick survey (2 questions)');
      u.el('div', 'survey-question', body, '1. How easy was it to find what you needed today?');
      const choices = u.el('div', 'survey-choices', body);
      ['Very easy', 'Somewhat easy', 'Neither easy nor difficult', 'Somewhat difficult', 'Very difficult'].forEach((label) => {
        const row = u.el('label', '', choices); const radio = u.el('input', '', row); radio.type = 'radio'; radio.name = 'ease'; radio.value = label; u.el('span', '', row, label);
      });
      u.el('div', 'survey-question second', body, '2. What could we improve?');
      const dropdown = u.el('div', 'survey-dropdown', body);
      const toggle = u.el('button', 'survey-select', dropdown, 'Select an option…'); toggle.type = 'button'; toggle.setAttribute('aria-expanded', 'false');
      const options = u.el('div', 'survey-options', dropdown); options.hidden = true;
      for (const label of ['Finding records', 'Image quality', 'Help and guidance']) { const b = u.el('button', '', options, label); b.type = 'button'; b.onclick = () => { toggle.textContent = label; options.hidden = true; toggle.setAttribute('aria-expanded', 'false'); }; }
      toggle.onclick = () => { options.hidden = !options.hidden; toggle.setAttribute('aria-expanded', String(!options.hidden)); };
    } else {
      u.el('p', 'survey-intro', body, {cookie: 'This app can remember your display preferences.', toast: 'The image is ready for editing.', promo: 'Discover more tools for your desktop.', banner: 'The image tools are available offline.'}[ctx.kind]);
    }
    const dismiss = u.el('button', 'primary survey-close', body, survey ? 'Close survey' : ctx.kind === 'cookie' ? 'Reject optional' : 'Dismiss'); dismiss.type = 'button'; dismiss.onclick = () => ctx.dismiss('dismiss');
    return {el, dismiss, ttlSteps: ctx.kind === 'toast' ? 5 : 0};
  }
  const palette = { bg: '#285c9f', panel: '#d4d4d4', fg: '#000000', muted: '#222222', line: '#8a8a8a' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display === 'panel' && _c.W < 1180 ? 'header' : (_c.ctx.display || 'header');
      document.body.className = `beos instruction-${_c.display}`;
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const icons = u.el('div', 'bt-icons', document.body);
      ['Home', 'Applications', 'Documents', 'Trash'].forEach((n) => {
        const it = u.el('div', 'bt-icon', icons);
        const box = {Home: [38, 35, 47, 44], Applications: [38, 146, 47, 45], Documents: [39, 264, 43, 48], Trash: [38, 382, 47, 54]}[n];
        sprite(it, box, 'bt-glyph');
        u.el('div', '', it, n);
      });
      const win = u.el('section', 'bt-win bt-main', document.body);
      titlebar(u, win, 'Image Adjuster', true);
      const tabs = u.el('div', 'bt-tabs', win);
      ['Adjust', 'Presets', 'Info'].forEach((t, i) => u.el('span', 'bt-tab' + (i ? '' : ' on'), tabs, t));
      const note = u.el('div', 'bt-note', win);
      note.hidden = !['header', 'toast'].includes(_c.display);
      const tools = u.el('div', 'bt-endtools', win);
      Object.assign(_c, { win, header: note, toolbar: tools });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const pw = u.el('section', 'bt-win bt-prev', document.body);
      titlebar(u, pw, 'Preview', true);
      const big = u.el('button', 'bt-bigprev', pw); big.type = 'button';
      big.dataset.role = 'xtra'; big.onclick = () => env.log('decoy', {label: 'Preview'});
      eye(u, big);
      const bt = u.el('span', 'bt-bigtxt', big);
      u.el('b', '', bt, 'Preview'); u.el('small', '', bt, 'Click to preview changes');
      const photo = u.el('div', 'bt-photobox', pw); landscape(u, photo);
      photo.hidden = _c.display === 'panel';
      const view = u.el('fieldset', 'bt-view', pw);
      u.el('legend', '', view, 'View');
      [['Fit to window', true], ['100% (actual size)', false]].forEach(([t, on]) => {
        const l = u.el('label', '', view); const r = u.el('input', '', l); r.type = 'radio'; r.name = 'view'; r.checked = on; r.disabled = true; u.el('span', '', l, t);
      });
      Object.assign(_c, { body: _c.win, preview: pw });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.preview;
      base(_c);
      _c.body = body;
      const panel = _c.preview.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('bt-note', 'bt-panelnote');
        panel.querySelector('.ref-panel-title').textContent = 'Adjust — Task';
        panel.querySelector('.ref-panel-text').classList.add('instruction');
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'bt-stage', _c.win);
      _c.stage.dataset.role = 'stage';
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        _c.header.appendChild(note);
        note.querySelector('.ref-note-text').classList.add('instruction');
        note.querySelector('.ref-note-x').textContent = 'Close';
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const u = _c.util;
      const actions = u.el('div', 'bt-actions', _c.win);
      const foot = document.body.querySelector('.ref-foot');
      actions.appendChild(foot);
      const bar = u.el('footer', 'bt-bar', document.body);
      const logo = u.el('span', 'bt-logo', bar);
      sprite(logo, [24, 898, 73, 37], 'bt-brand');
      const task1 = u.el('span', 'bt-task', bar); sprite(task1, [152, 904, 28, 27], 'bt-appicon'); u.el('span', '', task1, 'Image Adjuster');
      const task2 = u.el('span', 'bt-task', bar); sprite(task2, [434, 904, 28, 27], 'bt-appicon'); u.el('span', '', task2, 'Preview');
      sprite(bar, [1485, 892, 187, 49], 'bt-tray');
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.querySelector('.ref-tools').appendChild(dock);
    },
    overlay: () => drawOverlay,
  };
  env.site({
    name: 'design-set-slider-multi-12',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    initialOverlay: {kind: 'chat'},
    design: {
      THEMES: { 'design-set-slider-multi-12': palette },
      LOW_THEME: palette,
      ACCENTS: ['#1f48c4'],
      LOW_ACCENTS: ['#1f48c4'],
      parts,
    },
  });
})();
