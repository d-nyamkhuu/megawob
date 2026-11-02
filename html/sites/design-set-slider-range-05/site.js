/* Metro-style "Image Adjuster" desktop window: command rail, wide content field, seeded task note. */
(function () {
  'use strict';
  const ICONS = {
    Adjust: '<rect x="3" y="5" width="30" height="26" rx="2" fill="none" stroke="#fff" stroke-width="3"/><circle cx="12" cy="13" r="3" fill="#fff"/><path d="M5 29l9-9 6 6 5-5 8 8z" fill="#fff"/>',
    Crop: '<path d="M10 2v24h24M2 10h24v24" fill="none" stroke="currentColor" stroke-width="4"/>',
    Filters: '<circle cx="18" cy="10" r="9" fill="currentColor"/><circle cx="10" cy="23" r="9" fill="currentColor"/><circle cx="25" cy="23" r="9" fill="currentColor"/><path d="M13 17a8 8 0 0 0 10 0M17 17a8 8 0 0 0 0 13M11 24a8 8 0 0 0 14 0" fill="none" stroke="#4a535c" stroke-width="2"/>',
    Settings: '<path d="M15 1h6l1 5 4 2 5-2 3 5-4 4v5l4 4-3 5-5-2-4 2-1 5h-6l-1-5-4-2-5 2-3-5 4-4v-5l-4-4 3-5 5 2 4-2z" fill="currentColor"/><circle cx="18" cy="18" r="7" fill="#293138"/>',
    Help: '<circle cx="18" cy="18" r="17" fill="currentColor"/><text x="18" y="26" text-anchor="middle" font-size="24" font-weight="700" font-family="Segoe UI,Arial,sans-serif" fill="#252c36">?</text>',
  };
  function drawOverlay(ctx) {
    const u = ctx.util;
    const el = u.el('aside', 'metro-dialog overlay-' + ctx.kind, document.body);
    el.setAttribute('role', 'dialog');
    const title = {chat:'Feedback', cookie:'Privacy', toast:'Notice', promo:'Upgrade Image Adjuster', banner:'Service notice'}[ctx.kind];
    u.el('h2', '', el, title);
    const x = u.el('button', 'dlg-x', el, '×');
    x.setAttribute('aria-label', 'Close notice'); x.onclick = () => ctx.dismiss('close');
    u.el('p', '', el, {chat:'How is Image Adjuster working for you?', cookie:'This app can remember your display preferences.', toast:'Your changes are ready to review.', promo:'Try the new filters pack today.', banner:'Image Adjuster is running in offline mode.'}[ctx.kind]);
    const dismiss = u.el('button', 'dlg-btn', el, ctx.kind === 'cookie' ? 'Reject optional' : 'Dismiss');
    dismiss.type = 'button'; dismiss.onclick = () => ctx.dismiss('dismiss');
    return {el, dismiss, ttlSteps: ctx.kind === 'toast' ? 5 : 0};
  }
  // Format only the template's note; no goal copy exists elsewhere in the frame.
  function formatNote(el, u) {
    if (!el) return;
    const text = el.textContent;
    const match = /^(.*?\.)\s+(.+)$/s.exec(text);
    el.textContent = '';
    u.el('div', 'note-main', el, match ? match[1] : text);
    if (match) u.el('div', 'note-sub', el, match[2]);
  }
  const palette = {bg:'#f3f6fa', panel:'#fff', fg:'#1b1f24', muted:'#6f747b', line:'#c3c5c8'};
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('metro', 'instruction-' + _c.display);
      const title = u.el('header', 'titlebar', document.body);
      u.el('span', 'app-title', title, 'Image Adjuster');
      const wc = u.el('div', 'wincontrols', title);
      u.el('span', 'wc min', wc);
      u.el('span', 'wc max', wc);
      u.el('span', 'wc close', wc, '✕');
      const app = u.el('div', 'app', document.body);
      const rail = u.el('nav', 'rail', app);
      for (const name of ['Adjust', 'Crop', 'Filters', 'Settings', 'Help']) {
        const item = u.el('div', 'rail-item' + (name === 'Adjust' ? ' active' : ''), rail);
        item.innerHTML = `<svg viewBox="0 0 36 36" width="40" height="40" aria-hidden="true">${ICONS[name]}</svg>`;
        u.el('span', '', item, name);
      }
      const content = u.el('section', 'content', app);
      u.el('h1', '', content, 'Adjust Image');
      u.el('p', 'subtitle', content, 'Fine-tune the values below to get the best result.');
      const notes = u.el('div', 'note-slot', content);
      Object.assign(_c, {header:content, contentPane:content, notes});
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.notes;
      base(_c);
      _c.header = header;
      const note = _c.notes.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('task-note');
        formatNote(note, _c.util);
      }
    },
    'frame.tools': (base) => (_c) => { base(_c); },
    'frame.body': () => (_c) => { _c.body = _c.contentPane; },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.notes;
      base(_c);
      _c.body = body;
      const panel = _c.notes.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('task-note');
        formatNote(panel.querySelector('.ref-panel-text'), _c.util);
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'record-stage', _c.body);
      _c.stage.dataset.role = 'stage';
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        _c.notes.appendChild(note);
        note.classList.add('task-note');
        formatNote(note.querySelector('.ref-note-text'), _c.util);
      }
    },
    'frame.footer': (base) => (_c) => {
      const footer = _c.util.el('footer', 'footer', _c.contentPane);
      const reset = _c.util.el('button', 'btn reset', footer, 'Reset All');
      reset.type = 'button';
      reset.dataset.action = 'reset';
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      footer.appendChild(foot);
      _c.footer = footer;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.footer.appendChild(dock);
    },
    overlay: () => drawOverlay,
  };
  env.site({
    name:'design-set-slider-range-05',
    template:'site/base',
    langs:['en'],
    styles:['templates/site/css/base-hooks.css', 'site.css'],
    design:{THEMES:{site:palette}, LOW_THEME:palette, ACCENTS:['#0f78d7'], LOW_ACCENTS:['#0f78d7'], parts},
  });
})();
