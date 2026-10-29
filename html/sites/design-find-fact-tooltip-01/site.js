// Motif workstation chrome on the shared site frame.
(function () {
  'use strict';

  const palette = { bg: '#aaa9a6', panel: '#c4c3bf', fg: '#111', muted: '#444', line: '#7d7c79' };

  // Keep the existing stylesheet's names while retaining the template's event handlers.
  const skinControl = (el) => {
    el.className = el.className.replace(/\bref-/g, 'ds-');
    return el;
  };

  const parts = {
    'frame.header': () => (_c) => {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const { util: u } = _c;
      const header = u.el('header', 'ds-top', document.body);
      const icon = u.el('span', 'ds-window-icon', header);
      icon.setAttribute('aria-hidden', 'true');
      u.el('span', 'ds-brand', header, 'Shipping Records');
      const controls = u.el('div', 'ds-window-controls', header);
      ['_', '□', '×'].forEach((x, i) => {
        const b = u.el('span', 'ds-window-control', controls, x);
        b.setAttribute('aria-hidden', 'true');
        if (i === 2) b.classList.add('close');
      });
      const body = u.el('div', 'ds-content ref-body', document.body);
      Object.assign(_c, { header, controls, body });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      if (_c.display !== 'header') return;
      base({ ..._c, header: _c.body });
      const note = _c.body.lastElementChild;
      note.className = 'ds-header-note';
      note.setAttribute('aria-live', 'polite');
    },
    'frame.controls': (base) => (_c) => {
      base(_c);
      const { decoyBtn, endBtn } = _c;
      _c.decoyBtn = (parent, text, collides) => {
        decoyBtn(parent, text, collides);
        skinControl(parent.lastElementChild);
      };
      _c.endBtn = (parent, cls, text) => skinControl(endBtn(parent, cls, text));
    },
    'frame.tools': (base) => (_c) => {
      base(_c);
      _c.controls.append(..._c.headerTools.children);
      _c.headerTools.remove();
      _c.headerTools = _c.controls;
      if (_c.submit) _c.submit.classList.add('ds-header-submit');
    },
    'frame.body': () => () => {},
    'frame.panel': (base) => (_c) => {
      base(_c);
      if (_c.display !== 'panel') return;
      _c.panel = _c.body.lastElementChild;
      _c.panel.className = 'ds-brief';
      _c.panel.firstElementChild.className = 'ds-panel-title';
      _c.panel.lastElementChild.className = 'ds-instruction';
    },
    'frame.stage': (base) => (_c) => {
      base(_c);
      _c.stage.className = 'ds-stage';
      if (_c.panel) _c.body.append(_c.panel);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display !== 'toast') return;
      const note = document.body.lastElementChild;
      note.className = 'ds-toast';
      note.firstElementChild.className = '';
      note.lastElementChild.className = 'ds-close';
      _c.body.append(note);
    },
    'frame.footer': (base) => (_c) => {
      const { util: u, body } = _c;
      const help = u.el('section', 'ds-help', body);
      const glyph = u.el('div', 'ds-help-icon', help);
      glyph.innerHTML =
        '<svg viewBox="0 0 40 52" aria-hidden="true"><path d="M4 2h22l10 10v37H4z" fill="#fafafa" stroke="#222" stroke-width="2"/><path d="M26 2v11h10" fill="#ddd" stroke="#222"/><path d="M12 22h16M12 28h16M12 34h14" stroke="#555" stroke-width="2"/><text x="13" y="23" font-family="serif" font-size="22" font-weight="bold" fill="#174ba8">i</text></svg>';
      const helpText = u.el('div', 'ds-help-copy', help);
      u.el('strong', '', helpText, 'Help');
      u.el('div', '', helpText, 'Each row shows one shipment with its contents');
      u.el('div', '', helpText, 'Click the information icon to view details such as item weights.');
      // The status strip is always present in this workstation design.
      base({ ..._c, wantFooter: true,
        decoys: _c.wantFooter ? _c.decoys : [],
        collide: _c.wantFooter ? _c.collide : null });
      const foot = document.body.lastElementChild;
      foot.className = 'ds-footer';
      foot.firstElementChild.className = 'ds-ready';
      foot.firstElementChild.textContent = 'Ready';
      foot.lastElementChild.className = 'ds-tools';
      body.append(foot);
      _c.foot = foot;
      _c.submit = foot.querySelector('[data-role="submit"]') || _c.submit;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      if (_c.placement !== 'floating') return;
      const dock = document.body.lastElementChild;
      dock.className = 'ds-float-dock';
      _c.foot.append(dock);
    },
    // These workstation popups already have the design's raised grey borders.
    overlay: () => (ctx) => {
      const u = ctx.util,
        el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = {
        cookie: 'This workstation stores preferences locally.',
        toast: 'Changes saved.',
        chat: 'Help desk: How can we assist?',
        promo: 'New shipment tools are available.',
        banner: 'System notice: records are being refreshed.',
      };
      u.el('div', '', el, texts[ctx.kind] || 'System message');
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept' : 'Close');
      dismiss.type = 'button';
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  };

  env.site({
    name: 'design-find-fact-tooltip-01',
    template: 'site/base',
    styles: ['site.css', 'templates/site/css/base-hooks.css'],
    design: {
      THEMES: { motif: palette },
      LOW_THEME: palette,
      ACCENTS: ['#26345f'],
      LOW_ACCENTS: ['#26345f'],
      LANGS: ['en'],
      parts,
    },
  });
})();
