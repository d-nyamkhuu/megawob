/* PhotoStudio: precision-dark editor window beside a white instruction margin; the slider lives in the Adjustments panel. */
(function () {
  'use strict';
  const ICONS = {
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2"/>',
    contrast: '<circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor"/>',
    drop: '<path d="M12 3c4 5 6 8 6 11a6 6 0 0 1-12 0c0-3 2-6 6-11z" fill="currentColor"/><path d="M9 13c-1 2 0 3 1 3" stroke="#2c273b"/>',
    blur: '<path d="M9 4q3-3 6 0l6 13q2 5-4 4H7q-6 1-4-4z"/><path d="M6 17q3-2 6 0"/>',
    sharpen: '<path d="M12 3l9 18H3z"/><circle cx="12" cy="16" r="1" fill="currentColor"/>',
    crop: '<path d="M6 2v16h16M2 6h16v16"/>',
    sliders: '<path d="M2 6h20M2 12h20M2 18h20"/><circle cx="15" cy="6" r="2" fill="#ff7a73"/><circle cx="8" cy="12" r="2" fill="#ff7a73"/><circle cx="12" cy="18" r="2" fill="#ff7a73"/>',
    lasso: '<circle cx="12" cy="12" r="9" stroke-dasharray="4 3"/>',
    pen: '<path d="M4 20l1-5L16 4l4 4L9 19z"/>',
    eraser: '<path d="M3 15L14 4l7 7-10 10H9z"/><path d="M9 9l7 7 5-5-7-7z" fill="currentColor"/>',
    image: '<rect x="3" y="4" width="18" height="16" rx="1"/><circle cx="9" cy="10" r="2"/><path d="M3 18l6-5 5 4 3-3 4 4"/>',
    undo: '<path d="M9 7L4 12l5 5M4 12h11a5 5 0 0 1 0 10h-3"/>',
    redo: '<path d="M15 7l5 5-5 5M20 12H9a5 5 0 0 0 0 10h3"/>',
    down: '<path d="M6 9l6 6 6-6"/>',
  };
  function icon(u, parent, name, cls) {
    const s = u.svg('svg', {viewBox: '0 0 24 24', class: 'ic ' + (cls || ''), fill: 'none', stroke: 'currentColor', 'stroke-width': 1.7, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'aria-hidden': 'true'}, parent);
    s.innerHTML = ICONS[name];
    return s;
  }
  function drawOverlay(ctx) {
    const u = ctx.util;
    const el = u.el('aside', 'ps-dialog overlay-' + ctx.kind, document.body);
    el.setAttribute('role', 'dialog');
    const title = {chat: 'Share feedback', cookie: 'Your privacy matters', toast: 'Studio notice', promo: 'Go Pro', banner: 'Service notice'}[ctx.kind];
    u.el('h2', '', el, title);
    const x = u.el('button', 'ps-x', el, '×');
    x.setAttribute('aria-label', 'Close notice');
    x.onclick = () => ctx.dismiss('close');
    u.el('p', '', el, {chat: 'How is PhotoStudio working for you?', cookie: 'PhotoStudio can remember your panel layout.', toast: 'Your edits were autosaved.', promo: 'Unlock extra adjustment layers.', banner: 'A new version is available.'}[ctx.kind]);
    const dismiss = u.el('button', 'ps-btn ps-dismiss', el, ctx.kind === 'cookie' ? 'Reject optional' : 'Dismiss');
    dismiss.type = 'button';
    dismiss.onclick = () => ctx.dismiss('dismiss');
    return {el, dismiss, ttlSteps: ctx.kind === 'toast' ? 5 : 0};
  }
  // The template owns instruction visibility and controls; this only styles its text.
  function styleInstruction(node, cls) {
    if (!node) return;
    node.classList.add('instruction');
    if (cls) node.classList.add(cls);
    const text = node.textContent;
    node.replaceChildren();
    for (const part of text.split(/(“[^”]*”)/)) {
      if (/^“[^”]*”$/.test(part)) env.util.el('b', '', node, part);
      else if (part) node.append(document.createTextNode(part));
    }
  }

  const studio = { bg: '#241e30', panel: '#2c263b', line: '#777083',
    accent: '#ff837e', muted: '#d9d2e3', fg: '#f4f0f8' };

  env.site({
    name: 'design-set-slider-vertical-03',
    template: 'site/base',
    styles: ['site.css', 'templates/site/css/base-hooks.css'],
    design: {
      // This editor has one dark palette, including its occasional low-contrast theme.
      THEMES: { studio }, LOW_THEME: studio,
      ACCENTS: ['#ff837e'], LOW_ACCENTS: ['#ff837e'], LANGS: ['en'],
      parts: {
        'frame.layout': (base) => function (_c) {
          base(_c);
          const { ctx, util } = _c;
          // The white document margin fits each instruction mode even at 1024px.
          _c.display = ctx.display || 'header';
          document.body.className = `ps instruction-${_c.display}`;
          _c.note = util.el('aside', 'ps-note', document.body);
          _c.app = util.el('div', 'ps-app', document.body);
        },
        'frame.placement': (base) => function (_c) {
          base(_c);
          // A desktop editor always has its status bar, and no web navigation/sidebar.
          _c.wantFooter = true;
          _c.nav = false;
          _c.sidebar = false;
          if (_c.placement === 'floating') _c.placement = 'footer';
        },
        'frame.header': () => function (_c) {
          const { app, note, util: u } = _c;
          const title = u.el('header', 'ps-title', app);
          const logo = u.el('span', 'ps-logo', title);
          icon(u, logo, 'image');
          u.el('span', 'ps-name', title, 'PhotoStudio');
          const wc = u.el('span', 'ps-wc', title);
          u.el('i', 'min', wc); u.el('i', 'max', wc); u.el('i', 'cls', wc);
          Object.assign(_c, { header: note, title, wc });
        },
        'frame.nav': () => () => {},
        'frame.instruction': (base) => function (_c) {
          base(_c);
          styleInstruction(_c.note.querySelector('.ref-instruction'));
        },
        'frame.tools': (base) => function (_c) {
          // Keep the template's inert decoys and header/icon end controls in the title bar.
          base({ ..._c, header: _c.title });
          const tools = _c.title.querySelector('.ref-tools');
          _c.title.insertBefore(tools, _c.wc);
          Object.assign(_c, { headerTools: tools, submit: tools.querySelector('[data-role="submit"]') });
        },
        'frame.body': () => function (_c) {
          const { app, util: u } = _c;
          const body = u.el('div', 'ps-body ref-body', app);
          const canvas = u.el('main', 'ps-canvas', body);
          const photo = u.el('div', 'ps-photo', canvas);
          const documentImage = u.el('img', 'ps-document-image', photo);
          documentImage.src = 'sites/design-set-slider-vertical-03/assets/lake-mountains.webp';
          documentImage.alt = 'Mountain lake at sunset';
          const editorPanel = u.el('aside', 'ps-panel', body);
          u.el('h2', '', editorPanel, 'Adjustments');
          Object.assign(_c, { body, editorPanel });
        },
        'frame.panel': (base) => function (_c) {
          base({ ..._c, body: _c.note });
          styleInstruction(_c.note.querySelector('.ref-panel-text'), 'instruction-card');
        },
        'frame.stage': () => function (_c) {
          const { body, editorPanel, util: u } = _c;
          const mkRow = ([name, label]) => {
            const row = u.el('div', 'ps-row', editorPanel);
            const head = u.el('div', 'ps-rl', row);
            icon(u, head, name);
            u.el('span', '', head, label);
            const tr = u.el('div', 'ps-mini', row);
            u.el('i', '', tr);
            u.el('em', '', row, '0');
          };
          [['sun', 'Brightness'], ['contrast', 'Contrast'], ['drop', 'Saturation']].forEach(mkRow);
          const stage = u.el('main', 'record-stage', editorPanel);
          stage.dataset.role = 'stage';
          [['blur', 'Blur'], ['sharpen', 'Sharpen']].forEach(mkRow);
          const tools = u.el('nav', 'ps-tools', body);
          for (const name of ['crop', 'sliders', 'lasso', 'pen', 'eraser', 'image']) {
            const tool = u.el('span', 'ps-tool' + (name === 'sliders' ? ' on' : ''), tools);
            icon(u, tool, name);
          }
          _c.stage = stage;
        },
        'frame.toast': (base) => function (_c) {
          base(_c);
          const toast = document.querySelector('.ref-note');
          if (toast) {
            _c.note.append(toast);
            toast.classList.add('instruction-toast-card');
            styleInstruction(toast.querySelector('.ref-note-text'));
            toast.querySelector('.ref-note-x').classList.add('instruction-close');
          }
        },
        'frame.footer': (base) => function (_c) {
          base(_c);
          const { app, util: u } = _c;
          const foot = document.querySelector('.ref-foot');
          foot.className = 'ps-foot';
          foot.querySelector('.ref-foot-text').remove();
          foot.querySelector('.ref-tools').classList.add('ps-actions');
          app.append(foot);
          const file = u.el('div', 'ps-file');
          icon(u, file, 'image');
          u.el('span', '', file, 'lake-mountains.jpg');
          u.el('span', 'sep', file);
          u.el('span', '', file, '1920 × 1080');
          const hist = u.el('div', 'ps-hist');
          icon(u, hist, 'undo'); icon(u, hist, 'redo');
          u.el('span', 'sep', hist);
          const zoom = u.el('span', 'ps-zoom', hist, '100%');
          icon(u, zoom, 'down');
          foot.prepend(file, hist);
        },
        'frame.floating': () => () => {},
        // These notices already use PhotoStudio's own dialog styling.
        overlay: () => drawOverlay,
      },
    },
  });
})();
