/* 2013 bootstrap-style admin: Edit Image workspace anchored right of a briefing column. */
(function () {
  'use strict';
  function drawOverlay(ctx) {
    const u = ctx.util;
    const el = u.el('aside', 'adm-overlay overlay-' + ctx.kind, document.body);
    el.setAttribute('role', 'dialog');
    const title = {chat:'Feedback',cookie:'Cookies',toast:'Notice',promo:'Upgrade your library',banner:'Service notice'}[ctx.kind] || 'Notice';
    u.el('h2', '', el, title);
    const x = u.el('button', 'adm-x', el, '×'); x.type = 'button'; x.setAttribute('aria-label', 'Close notice'); x.onclick = () => ctx.dismiss('close');
    u.el('p', '', el, {cookie:'This tool remembers your display preferences.',toast:'The image is ready for editing.',promo:'Try the new image tools today.',banner:'The image editor is available offline.',chat:'Tell us how the editor is working for you.'}[ctx.kind] || 'Notice');
    const dismiss = u.el('button', 'btn btn-primary', el, ctx.kind === 'cookie' ? 'Reject optional' : 'Dismiss');
    dismiss.type = 'button'; dismiss.onclick = () => ctx.dismiss('dismiss');
    return {el, dismiss, ttlSteps: ctx.kind === 'toast' ? 5 : 0};
  }
  function fakeSlider(parent, u, label, pos) {
    const row = u.el('div', 'fake-row', parent);
    const body = u.el('div', 'fake-body', row);
    u.el('div', 'fake-label', body, label);
    const rail = u.el('div', 'fake-rail', body);
    const th = u.el('div', 'fake-thumb', rail); th.style.left = pos + '%';
    u.el('div', 'fake-val', row, '0');
  }
  function styleInstruction(el, display, ctx) {
    if (!el) return;
    el.classList.add('instruction', 'display-' + display);
    if (ctx.instruction.length > 70) el.classList.add('verbose');
  }
  const palette = { bg:'#f4f6f8', panel:'#ffffff', fg:'#1d2733', muted:'#6b7580', line:'#d3d8de' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The briefing column accommodates every note mode at every viewport.
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('adm', 'instruction-' + _c.display);
      const nav = u.el('header', 'adm-nav', document.body);
      u.el('div', 'adm-nav-fill', nav);
      const tabs = u.el('nav', 'adm-tabs', nav);
      for (const t of ['Library', 'Edit', 'Organize', 'Share']) u.el('span', 'adm-tab' + (t === 'Edit' ? ' on' : ''), tabs, t);
      const utility = u.el('div', 'adm-util', nav);
      ['Help', 'Settings', 'Sign Out'].forEach((t) => u.el('span', '', utility, t));
      const brief = u.el('aside', 'adm-brief');
      u.el('div', 'adm-kicker', brief, 'TASK');
      const noteHost = u.el('div', 'adm-note-host', brief);
      u.el('p', '', brief, 'Adjust the image overlay using the slider on the right.');
      u.el('p', '', brief, 'Image adjustments are displayed in the panel on the right; the preview is updated as you work.');
      u.el('hr', '', brief);
      u.el('div', 'adm-notes', brief, 'Notes:');
      const ul = u.el('ul', '', brief);
      u.el('li', '', ul, 'Use the slider, not the Quick action button (it’s disabled).');
      u.el('li', '', ul, 'You do not need to type anything.');
      const work = u.el('section', 'adm-work');
      const head = u.el('div', 'adm-head', work);
      u.el('h1', '', head, 'Edit Image');
      u.el('div', 'adm-file', head, 'File: mountain.jpg');
      Object.assign(_c, { brief, noteHost, work, head, header:noteHost });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      styleInstruction(_c.header.querySelector('.ref-instruction'), 'header', _c.ctx);
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.head;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const body = _c.util.el('div', 'adm-body', document.body);
      body.append(_c.brief, _c.work);
      _c.body = body;
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.noteHost;
      base(_c);
      _c.body = body;
      styleInstruction(_c.noteHost.querySelector('.ref-panel'), 'panel', _c.ctx);
    },
    'frame.stage': () => (_c) => {
      const u = _c.util;
      const row = u.el('div', 'adm-row', _c.work);
      const fig = u.el('div', 'adm-photo', row);
      u.el('div', 'adm-caption', fig, 'Preview (overlay applied)');
      const panel = u.el('div', 'adm-panel', row);
      u.el('div', 'adm-panel-head', panel, 'Adjustments');
      const decor = u.el('div', 'adm-decor', panel);
      fakeSlider(decor, u, 'Brightness', 50);
      fakeSlider(decor, u, 'Contrast', 50);
      const stage = u.el('main', 'adm-stage', panel); stage.dataset.role = 'stage';
      const quick = u.el('div', 'adm-quick', panel);
      u.el('div', 'adm-quick-title', quick, 'Quick action');
      const qrow = u.el('div', 'adm-quick-row', quick);
      const qb = u.el('button', 'btn btn-disabled', qrow, 'Auto Enhance'); qb.type = 'button'; qb.disabled = true;
      u.el('span', 'adm-quick-note', qrow, 'This feature is currently unavailable.');
      _c.stage = stage;
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        styleInstruction(note, 'toast', _c.ctx);
        const close = note.querySelector('.ref-note-x');
        close.classList.add('instruction-close');
        close.textContent = 'Close';
        _c.noteHost.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('adm-foot');
      _c.work.appendChild(foot);
      const reset = _c.util.el('button', 'btn btn-default', null, 'Reset');
      reset.type = 'button'; reset.dataset.action = 'reset';
      foot.insertBefore(reset, foot.firstChild);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
    },
    overlay: () => drawOverlay,
  };
  env.site({
    name:'design-set-slider-vertical-12',
    template:'site/base',
    langs:['en'],
    styles:['templates/site/css/base-hooks.css', 'site.css'],
    design:{ THEMES:{ site:palette }, LOW_THEME:palette, ACCENTS:['#1e73e0'], LOW_ACCENTS:['#1e73e0'], parts },
  });
})();
