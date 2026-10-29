/* IRIX workstation: slate/lavender desktop, one Image Adjust window, a floating Tools palette. */
(function () {
  'use strict';
  const NS = 'http://www.w3.org/2000/svg';
  function icon(parent, cls, markup, vb) {
    const s = document.createElementNS(NS, 'svg');
    s.setAttribute('viewBox', vb || '0 0 48 48');
    s.setAttribute('class', cls);
    s.setAttribute('aria-hidden', 'true');
    s.innerHTML = markup;
    parent.appendChild(s);
    return s;
  }
  const G = '<defs><linearGradient id="gv" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#b9b6ff"/><stop offset="1" stop-color="#3b3a9c"/></linearGradient>' +
    '<radialGradient id="gs" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#d9d7ff"/><stop offset=".5" stop-color="#6a66d8"/><stop offset="1" stop-color="#2a2878"/></radialGradient></defs>';
  const DOCK = [
    ['Finder', '<path d="M24 4 42 13v22L24 44 6 35V13z" fill="url(#gv)" stroke="#23226a"/><path d="M6 13l18 9 18-9M24 22v22" stroke="#23226a" fill="none"/>'],
    ['Shell', '<path d="M4 14h14l4 4h22v22H4z" fill="url(#gv)" stroke="#23226a"/><path d="M4 20h40" stroke="#dcdaff"/>'],
    ['System', '<g fill="url(#gv)" stroke="#23226a"><ellipse cx="24" cy="10" rx="14" ry="5"/><path d="M10 10v8c0 3 6 5 14 5s14-2 14-5v-8"/><path d="M10 20v8c0 3 6 5 14 5s14-2 14-5v-8"/><path d="M10 30v8c0 3 6 5 14 5s14-2 14-5v-8"/></g>'],
    ['Media', '<path d="M24 4 44 40H4z" fill="url(#gv)" stroke="#23226a"/><path d="M24 4v36" stroke="#23226a"/>'],
    ['Tools', '<circle cx="24" cy="24" r="19" fill="url(#gs)" stroke="#23226a"/>'],
  ];
  const TOOLS = [
    ['Select', '<path d="M12 6v32l8-8 6 12 5-3-6-11h12z" fill="#fff" stroke="#111" stroke-width="2"/>'],
    ['Zoom', '<circle cx="20" cy="20" r="12" fill="#cfe" fill-opacity=".5" stroke="#222" stroke-width="3"/><path d="M29 29l13 13" stroke="#222" stroke-width="5"/>'],
    ['Pan', '<path d="M14 42c-6-6-8-12-8-16l4-3 4 6V8h4v14V6h4v16V8h4v16V12h4v18l4-6 3 2c-3 8-5 14-10 18z" fill="#eee" stroke="#222" stroke-width="2"/>'],
    ['Adjust', '<circle cx="24" cy="24" r="9" fill="#999" stroke="#222" stroke-width="2"/><path d="M24 3v8M24 37v8M3 24h8M37 24h8M9 9l6 6M33 33l6 6M39 9l-6 6M15 33l-6 6" stroke="#222" stroke-width="3"/>'],
    ['Crop', '<path d="M12 4v32h32M4 12h32v32" fill="none" stroke="#222" stroke-width="4"/><rect x="14" y="14" width="20" height="20" fill="#bbb" stroke="#222" stroke-width="2"/>'],
    ['Rotate', '<path d="M8 40C8 20 20 10 36 12" fill="none" stroke="#222" stroke-width="5"/><path d="M30 2l14 10-14 10z" fill="#222"/>'],
  ];
  function landscape(parent) {
    const s = document.createElementNS(NS, 'svg');
    s.setAttribute('viewBox', '0 0 512 640');
    s.setAttribute('preserveAspectRatio', 'none');
    s.setAttribute('class', 'photo');
    s.innerHTML = '<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9a9a9a"/><stop offset="1" stop-color="#d4d4d4"/></linearGradient>' +
      '<linearGradient id="lk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8a8a8a"/><stop offset="1" stop-color="#3c3c3c"/></linearGradient></defs>' +
      '<rect width="512" height="640" fill="url(#sky)"/>' +
      '<path d="M0 250 90 130 130 170 170 90 230 180 280 120 330 200 380 110 440 170 512 120V400H0z" fill="#707070"/>' +
      '<path d="M0 300 60 220 130 280 220 190 300 270 380 200 450 260 512 230V420H0z" fill="#4e4e4e"/>' +
      '<path d="M0 360 120 330 250 380 400 340 512 370V430H0z" fill="#262626"/>' +
      '<path d="M90 130 130 170 150 150 120 150zM170 90 200 150 215 160 190 120zM280 120 310 170 330 160zM380 110 410 150 430 150z" fill="#e8e8e8"/>' +
      '<path d="M0 380H512V430H0z" fill="#1f2a1f" opacity=".6"/>' +
      '<rect y="420" width="512" height="220" fill="url(#lk)"/>' +
      '<path d="M0 560l30-120 20 70 30-110 25 100 30-90 25 120 20-60 30 100z" fill="#1b1b1b"/>' +
      '<path d="M300 640l40-170 40 170zM400 640l30-140 40 140zM180 640l30-120 30 120z" fill="#161616"/>';
    parent.appendChild(s);
  }

  function drawOverlay(ctx) {
    const u = ctx.util;
    const el = u.el('aside', 'survey-drawer overlay-' + ctx.kind, document.body);
    el.setAttribute('role', 'dialog');
    const survey = ctx.kind === 'chat';
    const title = { chat: 'Feedback', cookie: 'Preferences', toast: 'System Notice', promo: 'Information', banner: 'Service Notice' }[ctx.kind];
    u.el('h2', '', el, title);
    const x = u.el('button', 'survey-x', el, '×');
    x.setAttribute('aria-label', 'Close notice');
    x.onclick = () => ctx.dismiss('close');
    if (survey) {
      u.el('p', 'survey-intro', el, 'Quick survey (2 questions)');
      u.el('div', 'survey-question', el, '1. How easy was it to find what you needed today?');
      const choices = u.el('div', 'survey-choices', el);
      ['Very easy', 'Somewhat easy', 'Neither easy nor difficult', 'Somewhat difficult', 'Very difficult'].forEach((label) => {
        const row = u.el('label', '', choices);
        const radio = u.el('input', '', row);
        radio.type = 'radio';
        radio.name = 'ease';
        radio.value = label;
        u.el('span', '', row, label);
      });
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
        b.onclick = () => { toggle.textContent = label; options.hidden = true; toggle.setAttribute('aria-expanded', 'false'); };
      }
      toggle.onclick = () => { options.hidden = !options.hidden; toggle.setAttribute('aria-expanded', String(!options.hidden)); };
    } else {
      u.el('p', 'survey-intro', el, { cookie: 'This workstation can remember your display preferences.', toast: 'The image is ready for editing.', promo: 'New tools are available in the workspace.', banner: 'The viewer is available offline.' }[ctx.kind]);
    }
    const dismiss = u.el('button', 'primary survey-close', el, survey ? 'Close survey' : ctx.kind === 'cookie' ? 'Reject optional' : 'Dismiss');
    dismiss.type = 'button';
    dismiss.onclick = () => ctx.dismiss('dismiss');
    return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 5 : 0 };
  }

  env.site({name:'design-set-slider-multi-02', styles:['site.css'], scripts:[],
    frame(ctx) {
      const u = ctx.util;
      const endRng = ctx.rng.fork('chrome/end');
      const labelOf = (x) => typeof x === 'string' ? x : (x.label || x.text || x.name);
      const endLabels = ctx.content.END_LABELS.map(labelOf);
      const referenceEnd = endRng.bool(0.5);
      const placement = referenceEnd ? 'footer' : endRng.pick(['toolbar', 'titlebar']);
      const endLabel = referenceEnd ? 'Submit' : endRng.pick(endLabels);
      const collideRng = ctx.rng.fork('chrome/collide');
      const collideLabels = endLabels.filter((label) => label.trim().toLowerCase() !== endLabel.trim().toLowerCase());
      const collide = collideRng.bool(0.3) && collideLabels.length ? collideRng.pick(collideLabels) : null;
      const endButton = (parent, cls, text = endLabel) => {
        const button = u.el('button', cls, parent, text);
        button.type = 'button';
        button.dataset.role = 'submit';
        button.title = endLabel;
        button.setAttribute('aria-label', endLabel);
        button.onclick = () => ctx.submit();
        return button;
      };
      document.body.className = `irix instruction-${ctx.display}`;
      // top menu bar
      const bar = u.el('header', 'menubar', document.body);
      for (const m of ['Workspace', 'Applications', 'Tools', 'Windows', 'Help']) u.el('span', 'mb-item', bar, m);
      u.el('span', 'mb-clock', bar, 'Mon Apr 14 10:27 AM');
      // left dock
      const dock = u.el('nav', 'dock', document.body);
      for (const [name, m] of DOCK) {
        const d = u.el('div', 'dock-item', dock);
        icon(d, 'dock-ico', G + m);
        u.el('span', '', d, name);
      }
      // logo
      const logo = u.el('div', 'logo', document.body);
      icon(logo, 'logo-ico', '<path d="M24 4 42 14v20L24 44 6 34V14z M6 14l18 10 18-10M24 24v20" fill="none" stroke="#c9c8ee" stroke-width="1.6"/>');
      u.el('div', 'logo-irix', logo, 'IRIX');
      u.el('div', 'logo-sgi', logo, 'SILICON GRAPHICS');
      // main window
      const win = u.el('section', 'win', document.body);
      const tb = u.el('div', 'titlebar', win);
      u.el('span', 'tb-btn tb-l', tb, '');
      u.el('span', 'tb-title', tb, 'Image Adjust – viewer01');
      u.el('span', 'tb-btn tb-s', tb, '+');
      u.el('span', 'tb-btn tb-r', tb, '');
      const mb = u.el('div', 'winmenu', win);
      for (const m of ['File', 'Edit', 'View', 'Image', 'Options']) u.el('span', '', mb, m);
      u.el('span', 'wm-help', mb, 'Help');
      if (collide || (!ctx.finish && placement === 'toolbar')) {
        const tools = u.el('div', 'menu-actions', mb);
        if (collide) {
          const decoy = u.el('button', 'chrome-button chrome-xtra', tools, collide);
          decoy.type = 'button';
          decoy.dataset.role = 'xtra';
          decoy.onclick = () => env.log('decoy', {label: collide, collide: true});
        }
      }
      const body = u.el('div', 'winbody', win);
      const left = u.el('div', 'lpane', body);
      const frame = u.el('div', 'photo-frame', left);
      u.el('div', 'photo', frame);
      const info = u.el('div', 'photo-info', left);
      for (const t of ['512 x 384', '8-bit Gray', 'viewer01.tif']) u.el('span', '', info, t);
      const right = u.el('div', 'rpane', body);
      const instruction = u.el('div', 'instruction', right, ctx.instruction);
      if (ctx.display === 'hidden') instruction.hidden = true;
      // Native side card and status notification, with header fallback in small windows.
      if (win.clientWidth >= 900 && ctx.display === 'panel') {
        instruction.classList.add('instruction-panel');
        left.insertBefore(instruction, frame);
      } else if (win.clientWidth >= 900 && ctx.display === 'toast') {
        instruction.classList.add('instruction-toast');
        left.insertBefore(instruction, info);
      }
      if (ctx.display === 'toast') {
        const close = u.el('button', 'instruction-close', instruction, 'Close');
        close.onclick = () => { instruction.hidden = true; };
      }
      const stage = u.el('main', 'record-stage', right);
      stage.dataset.role = 'stage';
      const actions = u.el('div', 'actions', right);
      const reset = u.el('button', 'reset', actions, 'Reset');
      reset.type = 'button';
      reset.dataset.action = 'reset';
      let submit = null;
      if (!ctx.finish) {
        if (placement === 'footer') {
          u.el('span', 'sep', actions);
          submit = endButton(actions, 'primary');
        } else if (placement === 'toolbar') {
          submit = endButton(mb.querySelector('.menu-actions'), 'chrome-button chrome-end');
        } else {
          submit = endButton(tb, 'chrome-button title-end', '✓');
        }
      }
      if (ctx.finish || placement !== 'footer') u.el('span', 'action-status', actions, 'Ready');
      u.el('div', 'winstatus', win);
      // floating tool palette
      const pal = u.el('aside', 'palette', document.body);
      const pt = u.el('div', 'pal-title', pal);
      u.el('span', 'tb-btn tb-l', pt, '');
      u.el('span', 'pal-name', pt, 'Tools');
      u.el('span', 'tb-btn tb-s', pt, '+');
      const grid = u.el('div', 'pal-grid', pal);
      TOOLS.forEach(([name, m], i) => {
        const b = u.el('div', 'tool' + (i === 0 ? ' sel' : ''), grid);
        icon(b, 'tool-ico', m);
        u.el('span', '', b, name);
      });
      return {stage, submit};
    },
    overlay: drawOverlay,
  });
})();
