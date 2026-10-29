// Lime file-tree frame on the shared site template. Task mechanics stay in the widget.
(function () {
  'use strict';

  const palette = {
    bg: '#0c0e12', panel: '#fbfaf5', fg: '#0d0f14', accent: '#c5fa4d',
    line: '#2a2d35', muted: '#5f6a78', 'button-fg': '#0b0c10',
    font: "Inter,'Helvetica Neue',Arial,sans-serif",
  };

  function findCard(util, note) {
    const card = util.el('div', 'find-card', note);
    card.innerHTML = '<svg viewBox="0 0 40 52" preserveAspectRatio="none" fill="none" stroke="#0b0c10" stroke-width="3.5" stroke-linejoin="round"><path d="M4 3h22l10 10v36H4z"/><path d="M26 3v10h10"/></svg>';
    const text = util.el('div', '', card);
    util.el('div', 'fl', text, 'FILE EXPLORER');
    util.el('div', 'fn', text, 'Browse files');
  }

  function footerLabel(util, footer) {
    const label = util.el('span', 'footer-label');
    label.innerHTML = '<svg viewBox="0 0 38 38" fill="none" stroke="#c5fa4d" stroke-width="2.5"><circle cx="19" cy="19" r="16"/><path d="M19 17v10M19 10.5v2.5"/></svg>';
    util.el('span', '', label, 'Expand folders to browse project files.');
    footer.querySelector('.ref-foot-text').replaceWith(label);
  }

  env.site({
    name: 'design-use-desktop-tools-tree-05',
    template: 'site/base',
    design: {
      THEMES: { lime: palette },
      LOW_THEME: palette,
      ACCENTS: ['#c5fa4d'],
      LOW_ACCENTS: ['#c5fa4d'],
      LANGS: ['en'],
      parts: {
        'frame.layout': (base) => (_c) => {
          base(_c);
          // This design keeps its full-width brief even at the smallest viewport.
          _c.display = _c.ctx.display;
          document.body.className = 'top instruction-' + _c.display;
        },
        'frame.placement': (base) => (_c) => {
          base(_c);
          // The reference always has a footer, including when the end control is elsewhere.
          _c.wantFooter = true;
        },
        'frame.header': () => (_c) => {
          const { ctx, display, util } = _c;
          const shell = util.el('div', 'site-shell', document.body);
          const chrome = util.el('header', 'design-header', shell);
          util.el('div', 'design-brand', chrome, 'Files');
          util.el('nav', 'design-nav', chrome, 'Terminal    Edit    Settings    Help');
          const body = util.el('div', 'design-body ref-body', shell);
          const header = util.el('section', 'task-note', body);
          header.dataset.role = 'instruction';
          header.dataset.finish = String(ctx.finish);
          header.style.setProperty('--instruction-length', Math.max(1, (ctx.instruction || '').length));
          header.hidden = display !== 'header' && display !== 'panel';
          if (!header.hidden) findCard(util, header);
          Object.assign(_c, { shell, body, header });
        },
        'frame.nav': () => () => {},
        'frame.body': () => () => {},
        'frame.panel': (base) => (_c) => {
          // Keep the template's panel text and heading inside the design's cream brief.
          base({ ..._c, body: _c.header });
        },
        'frame.stage': () => (_c) => {
          _c.stage = _c.util.el('main', 'stage', _c.body);
        },
        'frame.footer': (base) => (_c) => {
          base(_c);
          const footer = document.querySelector('.ref-foot');
          footer.classList.add('design-footer');
          _c.shell.append(footer);
          footerLabel(_c.util, footer);
          const tools = footer.querySelector('.ref-tools');
          // Header decoys belong beside the reference's Reset button, outside the brief.
          for (const decoy of _c.headerTools.querySelectorAll('[data-role="xtra"]')) tools.prepend(decoy);
          if (!_c.ctx.finish) {
            _c.decoyBtn(tools, 'Reset');
            tools.lastElementChild.classList.add('foot-reset');
            tools.prepend(tools.lastElementChild);
          }
          if (_c.header.hidden) tools.prepend(_c.headerTools);
          else if (_c.headerTools.querySelector('[data-role="submit"]')) _c.header.classList.add('has-end');
          for (const button of footer.querySelectorAll('.ref-submit')) button.classList.add('end-control');
          for (const button of footer.querySelectorAll('.ref-endlink')) button.classList.add('footer-link');
          for (const button of _c.header.querySelectorAll('.ref-submit')) button.classList.add('header-end');
          Object.assign(_c, { footer, footerTools: tools });
        },
        'frame.floating': (base) => (_c) => {
          base(_c);
          if (_c.placement === 'floating') {
            // Dock in the footer so it reserves space without shrinking or covering the tree.
            _c.footerTools.append(_c.submit.parentElement);
            _c.submit.classList.add('end-control');
          }
        },
      },
    },
  });
})();
