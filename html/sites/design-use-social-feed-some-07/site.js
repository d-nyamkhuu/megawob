// HarborTask's ledger frame, on the shared site's chrome and perturbation behavior.
(function () {
  'use strict';

  const palette = {
    bg: '#070b10', panel: '#0d131b', fg: '#e6edf3', muted: '#8b98a5', line: '#1d2732',
  };
  const SVG = {
    logo: '<svg viewBox="0 0 16 16"><rect x="1" y="1" width="6" height="6" rx="1.5" fill="currentColor"/><rect x="9" y="1" width="6" height="6" rx="1.5" fill="currentColor"/><rect x="1" y="9" width="6" height="6" rx="1.5" fill="currentColor"/><rect x="9" y="9" width="6" height="6" rx="1.5" fill="currentColor"/></svg>',
    target: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M20.5 8.5A9.5 9.5 0 1 0 21.5 12"/><path d="M17 12a5 5 0 1 1-2-4"/><circle cx="12" cy="12" r="1.6" fill="currentColor"/><path d="M12 12l8-8"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 5l14 14M19 5L5 19"/></svg>',
    image: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"><rect x="4" y="4" width="40" height="40" rx="4"/><circle cx="16" cy="16" r="3.5"/><path d="M5 39l26-23 12 12"/></svg>',
  };

  // Keep the template's instruction text and behavior, adding the ledger's icon and emphasis.
  function decorateInstruction(note, text, util, extraClass) {
    note.classList.add('task-note');
    if (extraClass) note.classList.add(extraClass);
    note.dataset.role = 'instruction';
    const icon = util.el('span', 'task-icon');
    icon.innerHTML = SVG.target;
    note.prepend(icon);
    const copy = text.textContent;
    const p = util.el('p', '', text);
    text.firstChild.remove();
    for (const part of copy.split(/(^.*?\d+|@\w+)/)) {
      if (!part) continue;
      if (/^(.*?\d+|@\w+)$/.test(part)) util.el('span', 'hl', p, part);
      else p.append(document.createTextNode(part));
    }
  }

  env.site({
    name: 'design-use-social-feed-some-07',
    template: 'site/base',
    styles: ['templates/site/css/base-overlays.css', 'templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { harbor: palette },
      LOW_THEME: palette,
      ACCENTS: ['#5df08f'],
      LOW_ACCENTS: ['#5df08f'],
      LANGS: ['en'],
      parts: {
        'frame.layout': (base) => (_c) => {
          base(_c);
          // This frame has room for its compact panel and toast at every supported size.
          _c.display = _c.ctx.display || 'header';
          document.body.className = 'instruction-' + _c.display;
        },
        'frame.header': () => (_c) => {
          const { util } = _c;
          const shell = util.el('div', 'site-shell', document.body);
          const header = util.el('header', 'design-header', shell);
          const brand = util.el('div', 'design-brand', header);
          brand.innerHTML = SVG.logo + '<span>HarborTask</span>';
          const nav = util.el('nav', 'design-nav', header);
          for (const title of ['Tasks', 'Social', 'Activity', 'Settings']) {
            util.el('span', 'nav-item' + (title === 'Social' ? ' on' : ''), nav, title);
          }
          util.el('div', 'hdr-spacer', header);
          const online = util.el('div', 'hdr-online', header);
          util.el('i', '', online);
          util.el('span', '', online, 'Online');
          const tools = util.el('div', 'hdr-tools', header);
          util.el('div', 'hdr-avatar', header, 'TU');
          Object.assign(_c, { shell, header, tools });
        },
        'frame.nav': () => () => {},
        'frame.instruction': (base) => (_c) => {
          const { display, shell, util } = _c;
          const note = util.el('section', 'task-note', shell);
          base({ ..._c, header: note });
          if (display === 'header') decorateInstruction(note, note.querySelector('.ref-instruction'), util);
          else note.hidden = true;
          _c.note = note;
        },
        'frame.body': () => (_c) => {
          const { note, shell, util } = _c;
          const body = util.el('div', 'design-body', shell);
          body.append(note);
          const acts = util.el('section', 'task-actions', body);
          const count = util.el('span', 'sel-label', acts);
          count.append('Selected: ');
          util.el('span', 'selected-value', count, '0');
          Object.assign(_c, { body, acts });
        },
        'frame.panel': (base) => (_c) => {
          base(_c);
          const panel = _c.body.querySelector('.ref-panel');
          if (panel) {
            panel.querySelector('.ref-panel-title').remove();
            decorateInstruction(panel, panel.querySelector('.ref-panel-text'), _c.util, 'instruction-panel');
          }
        },
        'frame.stage': () => (_c) => {
          const { body, util } = _c;
          const stage = util.el('main', 'stage', body);
          const preview = util.el('aside', 'preview', body);
          const head = util.el('div', 'pv-head', preview);
          util.el('span', '', head, 'Post Preview');
          const close = util.el('button', 'pv-close', head);
          close.type = 'button';
          close.setAttribute('aria-label', 'Close preview');
          close.innerHTML = SVG.close;
          close.addEventListener('click', () => { preview.hidden = true; });
          const content = util.el('div', 'pv-body', preview);
          util.el('div', 'pv-ico', content).innerHTML = SVG.image;
          util.el('p', '', content, 'Select a post to preview its content here.');
          Object.assign(_c, { stage, preview });
        },
        'frame.toast': (base) => (_c) => {
          base(_c);
          const note = document.querySelector('.ref-note');
          if (note) {
            _c.body.append(note);
            decorateInstruction(note, note.querySelector('.ref-note-text'), _c.util, 'instruction-toast');
          }
        },
        'frame.end': (base) => (_c) => {
          const { acts, headerTools, placement, preview, submit, tools } = _c;
          // The template owns label/placement draws, decoys and all end-control handlers.
          // Fit those controls into the design's shelf, topbar and detached preview.
          tools.append(headerTools);
          const footer = document.querySelector('.ref-foot');
          if (footer) {
            const row = footer.querySelector('.ref-tools');
            if (row.children.length) {
              row.classList.add('preview-actions');
              preview.append(row);
            }
            footer.remove();
          }
          if (submit) {
            submit.classList.add('end-control');
            if (placement === 'header' || placement === 'floating') acts.append(submit);
            else submit.classList.add(placement === 'icon' ? 'end-topbar' : 'end-preview');
          }
          document.querySelector('.ref-float-dock')?.remove();
          for (const decoy of document.querySelectorAll('.ref-xtra')) decoy.classList.add('end-xtra');
          return base(_c);
        },
      },
    },
  });
})();
