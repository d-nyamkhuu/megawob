/* Asset Studio: 2000s intranet notebook app with a top ribbon, one task stage and a status footer. */
(function () {
  'use strict';
  const ICONS = {
    New: '<path d="M8 4h14l8 8v24H8z"/><path d="M22 4v8h8"/>',
    Open: '<path d="M5 12V7h11l4 5h13v23H5z"/><path d="M5 16h28"/>',
    Save: '<rect x="6" y="5" width="28" height="30"/><path d="M12 5v13h16V5M10 32h20"/>',
    Undo: '<path d="M17 10L8 18l9 2z" fill="currentColor"/><path d="M10 18h12q14 0 10 14"/>',
    Redo: '<path d="M23 10l9 8-9 2z" fill="currentColor"/><path d="M30 18H18Q4 18 8 32"/>',
    Crop: '<path d="M11 4v24h24"/><path d="M4 11h24v24"/>',
    Rotate: '<path d="M32 20a12 12 0 1 1-4-9"/><path d="M29 3v9h-9"/>',
    Resize: '<rect x="5" y="5" width="30" height="30"/><path d="M12 28L28 12M20 12h8v8"/>',
    Brightness: '<circle cx="20" cy="20" r="7"/><path d="M20 4v5M20 31v5M4 20h5M31 20h5M9 9l3 3M28 28l3 3M31 9l-3 3M12 28l-3 3"/>',
    Contrast: '<circle cx="20" cy="20" r="14"/><path d="M20 6a14 14 0 0 1 0 28z" fill="currentColor"/>',
    Opacity: '<rect x="6" y="6" width="28" height="28"/><path d="M6 6h7v7H6zM20 6h7v7h-7zM13 13h7v7h-7zM27 13h7v7h-7zM6 20h7v7H6zM20 20h7v7h-7zM13 27h7v7h-7zM27 27h7v7h-7z" fill="currentColor"/>',
    Sharpen: '<rect x="4" y="6" width="32" height="28"/><path d="M4 30l9-11 7 8 6-6 10 9z" fill="currentColor"/><circle cx="26" cy="14" r="2.5"/>',
    Blur: '<circle cx="20" cy="20" r="12" stroke-dasharray="3 4.5"/>',
    Fit: '<rect x="5" y="5" width="30" height="30"/><path d="M5 20h30M20 5v30"/>',
    '100%': '<circle cx="17" cy="17" r="11"/><path d="M25 25l10 10"/>',
  };
  const GROUPS = [
    ['File', ['New', 'Open', 'Save']],
    ['Edit', ['Undo', 'Redo']],
    ['Transform', ['Crop', 'Rotate', 'Resize']],
    ['Adjust', ['Brightness', 'Contrast', 'Opacity']],
    ['Effects', ['Sharpen', 'Blur']],
    ['View', ['Fit', '100%']],
  ];
  const TABS = ['Home', 'Image', 'Adjust', 'Filters', 'Annotate', 'View'];
  function icon(parent, name) {
    const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    s.setAttribute('viewBox', '0 0 40 40');
    s.setAttribute('class', 'ico');
    s.setAttribute('fill', 'none');
    s.setAttribute('stroke', 'currentColor');
    s.setAttribute('stroke-width', '2.7');
    s.setAttribute('stroke-linejoin', 'round');
    s.innerHTML = ICONS[name] || '';
    parent.append(s);
  }

  function drawOverlay(ctx) {
    const u = ctx.util;
    const el = u.el('aside', 'notice-box overlay-' + ctx.kind, document.body);
    el.setAttribute('role', 'dialog');
    const title = { chat: 'Help desk', cookie: 'Privacy settings', toast: 'Studio notice', promo: 'Upgrade your plan', banner: 'Service notice' }[ctx.kind];
    const bar = u.el('div', 'notice-bar', el);
    u.el('span', '', bar, title);
    const x = u.el('button', 'notice-x', bar, '×');
    x.type = 'button';
    x.setAttribute('aria-label', 'Close notice');
    x.onclick = () => ctx.dismiss('close');
    u.el('p', '', el, {
      chat: 'Need help with the current adjustment? Ask the help desk.',
      cookie: 'This workspace can remember your display preferences.',
      toast: 'Your project was autosaved.',
      promo: 'Try Asset Studio Pro for batch editing.',
      banner: 'Scheduled maintenance tonight at 22:00.',
    }[ctx.kind]);
    const dismiss = u.el('button', 'primary notice-close', el, ctx.kind === 'cookie' ? 'Reject optional' : 'Dismiss');
    dismiss.type = 'button';
    dismiss.onclick = () => ctx.dismiss('dismiss');
    return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 5 : 0 };
  }

  // Keep template instructions in the adjustment panel, with the studio's original card styling.
  function instructionCard(node, ctx) {
    if (!node) return;
    node.classList.add('instruction');
    node.classList.toggle('long', (ctx.instruction || '').length > 80);
  }

  const theme = { bg: '#e8f1ec', panel: '#f3f8f5', fg: '#172831', muted: '#4a5c54', line: '#b9cfcc' };
  env.site({
    name: 'design-set-slider-log-09',
    template: 'site/base',
    langs: ['en'],
    styles: ['site.css', 'templates/site/css/base-hooks.css', 'frame-support.css'],
    design: {
      THEMES: { studio: theme },
      LOW_THEME: theme,
      ACCENTS: ['#2a5c46'],
      LOW_ACCENTS: ['#2a5c46'],
      parts: {
        'frame.layout': (base) => (_c) => {
          base(_c);
          // This frame has room for every instruction mode even at the smallest viewport.
          _c.display = _c.ctx.display || 'header';
          document.body.className = `studio instruction-${_c.display}`;
        },
        'frame.placement': (base) => (_c) => {
          base(_c);
          // The image editor always has its status footer, and no filler navigation/sidebar.
          Object.assign(_c, { wantFooter: true, nav: false, sidebar: false });
        },
        'frame.header': () => (_c) => {
          const { util: u } = _c;
          const header = u.el('header', 'app-top', document.body);
          u.el('div', 'app-name', header, 'Asset Studio');
          const tabs = u.el('nav', 'tabs', header);
          TABS.forEach((t, i) => {
            const tab = u.el('div', 'tab' + (i === 0 ? ' on' : ''), tabs);
            u.el('span', 'num', tab, String(i + 1));
            u.el('span', '', tab, t);
          });
          const who = u.el('div', 'who', header);
          u.el('span', '', who, 'Project: Product Shots');
          u.el('i', '', who);
          u.el('span', '', who, 'User: jcarter');
          u.el('b', 'caret', who);
          const ribbon = u.el('div', 'ribbon', document.body);
          for (const [name, tools] of GROUPS) {
            const g = u.el('section', 'rgroup g-' + name.toLowerCase(), ribbon);
            const row = u.el('div', 'rtools', g);
            for (const t of tools) {
              const b = u.el('div', 'rtool' + (t === 'Opacity' ? ' on' : ''), row);
              icon(b, t);
              u.el('span', '', b, t);
              if (t === 'Save') u.el('em', 'dd', b);
            }
            u.el('div', 'rname', g, name);
          }
          _c.header = header;
        },
        'frame.nav': () => () => {},
        'frame.instruction': (base) => (_c) => {
          base(_c);
          _c.instruction = _c.header.querySelector('.ref-instruction');
          instructionCard(_c.instruction, _c.ctx);
        },
        'frame.body': () => (_c) => {
          const { util: u, instruction, headerTools } = _c;
          const main = u.el('div', 'studio-main ref-body', document.body);
          const left = u.el('section', 'panel p-task', main);
          u.el('h2', 'bar', left, 'Opacity Adjustment');
          const body = u.el('div', 'pbody', left);
          if (instruction) body.append(instruction);
          const right = u.el('section', 'panel p-preview', main);
          const previewBar = u.el('h2', 'bar preview-bar', right, 'Image Preview');
          headerTools.classList.add('end-tools');
          previewBar.append(headerTools);
          const view = u.el('div', 'preview', right);
          const img = u.el('div', 'preview-img', view);
          img.style.backgroundImage = 'url(sites/design-set-slider-log-09/assets/mountain-lake.webp)';
          const badge = u.el('div', 'badge', view, 'Opacity: ');
          badge.dataset.live = 'Opacity: ';
          _c.body = body;
        },
        'frame.panel': (base) => (_c) => {
          base(_c);
          instructionCard(_c.body.querySelector('.ref-panel'), _c.ctx);
        },
        'frame.stage': () => (_c) => {
          const { util: u, body } = _c;
          const stage = u.el('main', 'record-stage', body);
          stage.dataset.role = 'stage';
          const info = u.el('dl', 'info', body);
          const row = (label, key, text) => {
            u.el('dt', '', info, label);
            const dd = u.el('dd', '', info, text || '');
            if (key) dd.dataset.info = key;
          };
          row('Minimum:', 'min');
          row('Maximum:', 'max');
          row('Scale:', '', 'Logarithmic (×10)');
          row('Control:', '', 'Drag the handle');
          row('Preview:', '', 'Updates as you drag');
          _c.stage = stage;
        },
        'frame.toast': (base) => (_c) => {
          base(_c);
          const note = document.querySelector('.ref-note');
          if (note) {
            instructionCard(note, _c.ctx);
            _c.body.prepend(note);
          }
        },
        'frame.footer': (base) => (_c) => {
          base(_c);
          const { util: u } = _c;
          const footer = document.querySelector('.ref-foot');
          footer.classList.add('status');
          const facts = footer.querySelector('.ref-foot-text');
          facts.classList.add('facts');
          facts.textContent = '';
          for (const text of ['Image: lake.jpg', '1920 × 1080', 'Zoom: 100%']) {
            u.el('span', '', facts, text);
            u.el('i', '', facts);
          }
          const opacity = u.el('span', '', facts, 'Opacity: ');
          opacity.dataset.live = 'Opacity: ';
          const actions = footer.querySelector('.ref-tools');
          actions.classList.add('actions');
          const reset = u.el('button', 'reset', null, 'Reset');
          reset.type = 'button';
          reset.dataset.action = 'reset';
          const preview = u.el('button', 'preview-btn', null, 'Preview');
          preview.type = 'button';
          preview.onclick = () => env.log('decoy', { label: 'Preview' });
          actions.prepend(reset, preview);
          _c.actions = actions;
        },
        'frame.floating': (base) => (_c) => {
          base(_c);
          const dock = document.querySelector('.ref-float-dock');
          // Reserve the floating control's slot inside the existing status bar.
          if (dock) _c.actions.append(dock);
        },
        'frame.end': (base) => (_c) => {
          if (_c.submit) {
            const toolbar = _c.headerTools.contains(_c.submit);
            _c.submit.classList.add(_c.placement === 'link' ? 'end-link' : toolbar ? 'end-toolbar' : 'primary');
          }
          return base(_c);
        },
        overlay: () => drawOverlay,
      },
    },
  });
})();
