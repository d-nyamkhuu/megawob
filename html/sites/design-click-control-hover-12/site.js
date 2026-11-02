(function () {
  'use strict';
  const NOTES = [
    'The practice area is on the left side of this window.',
    'Your current progress is shown inside the practice area.',
    'Mouse input is enabled.',
    'If the layout looks wrong, click “Use default layout” to restore the task.',
    'The session remains open while you practice.',
  ];
  const palette = { bg: '#032c63', panel: '#fbf8ee', fg: '#0b2252', muted: '#0a2251', line: '#0a3d85' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // This frame has a dedicated margin for every instruction mode.
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
      document.body.className = 'ref px';
      const shell = u.el('main', 'pxshell', document.body);
      const head = u.el('header', 'pxhead', shell);
      const brand = u.el('div', 'pxbrand', head);
      brand.innerHTML =
        '<svg viewBox="0 0 40 40" width="40" height="40" shape-rendering="crispEdges"><path d="M2 0h23v19H2z" fill="#a9d6fa"/><path d="M5 19h20v3H5z" fill="#3577a8"/><path d="M28 6h11v17H28z" fill="#67cece"/><path d="M0 18h9v16H0zM12 23h22v17H12z" fill="#ffe227"/><path d="M9 20h25v3H9v17H6V20z" fill="#1a80a4"/></svg>';
      u.el('span', 'pxname', brand, 'Task Trainer');
      u.el('div', 'pxuser', head, 'User: guest   |   Mon Apr 18, 2005   10:24 AM');
      // Build the margin now so template notes and tools can use their original places.
      const side = u.el('aside', 'pxside');
      const copy = u.el('div', 'pxcopy', side);
      const actions = u.el('div', 'pxactions', side);
      Object.assign(_c, { shell, head, side, copy, actions, header: copy });
    },
    'frame.nav': () => (_c) => {
      const tabs = _c.util.el('nav', 'pxtabs', _c.shell);
      ['Task', 'Settings', 'Help', 'About'].forEach((t, i) => _c.util.el('span', i === 0 ? 'pxtab on' : 'pxtab', tabs, t));
    },
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.copy.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('instruction', 'px-instruction-header');
        note.dataset.display = _c.display;
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.actions;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const body = u.el('div', 'pxwork', _c.shell);
      const doc = u.el('section', 'pxdoc', body);
      u.el('h1', 'pxh1', doc, 'Mouse Control Practice');
      body.appendChild(_c.side);
      Object.assign(_c, { body, doc });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.copy;
      base(_c);
      _c.body = body;
      const panel = _c.copy.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('instruction', 'px-instruction-panel');
        panel.dataset.display = _c.display;
      }
    },
    'frame.stage': () => (_c) => {
      const u = _c.util;
      _c.stage = u.el('div', 'stage', _c.doc);
      const cursor = u.el('div', 'pxpointer', _c.doc);
      cursor.innerHTML =
        '<svg viewBox="0 0 32 52" width="32" height="52" shape-rendering="crispEdges"><path d="M2 2v40l9-9 9 18 7-4-9-17 12-1Z" fill="white" stroke="#111" stroke-width="2.5"/><path d="M5 8v27l7-8 12 1Z" fill="#f7f7f7"/></svg>';
      u.el('div', 'pxhint', _c.doc, 'Mouse input is enabled in this area.');
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('instruction', 'px-instruction-toast');
        note.dataset.display = _c.display;
        _c.copy.appendChild(note);
      }
      const u = _c.util;
      if (_c.display !== 'hidden') u.el('hr', 'pxrule', _c.copy);
      u.el('h2', 'pxnotes', _c.copy, 'Notes:');
      // The widget customizes legacy list items with goal details. Neutral paragraphs
      // keep that obsolete secondary instruction path off the page in every mode.
      const list = u.el('div', 'pxlist', _c.copy);
      NOTES.forEach((t) => u.el('div', 'pxitem', list, t));
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (_c.placement === 'footer' || _c.placement === 'link') {
        _c.shell.appendChild(foot);
        foot.classList.add('pxstatus');
        foot.querySelector('.ref-foot-text').textContent = 'Ready';
      } else {
        _c.actions.appendChild(foot);
        foot.querySelector('.ref-foot-text').textContent = '';
      }
      _c.foot = foot;
      if (!_c.ctx.finish || _c.actions.querySelector('.ref-xtra')) {
        const rule = _c.util.el('hr', 'pxrule lower');
        _c.actions.prepend(rule);
      }
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.side.prepend(dock);
      const { copy, side } = _c;
      // Fit the copy only; controls and the stage retain fixed anchors.
      side.fitNotes = () => {
        const items = [...copy.querySelectorAll('.instruction,.pxnotes,.pxlist')];
        for (const item of items) item.style.removeProperty('font-size');
        if (copy.scrollHeight <= copy.clientHeight + 1) return;
        const sizes = items.map((item) => parseFloat(getComputedStyle(item).fontSize));
        const apply = (scale) => items.forEach((item, i) => item.style.setProperty('font-size', Math.max(11, sizes[i] * scale) + 'px', 'important'));
        let lo = 0.35, hi = 1;
        for (let pass = 0; pass < 9; pass++) {
          const mid = (lo + hi) / 2;
          apply(mid);
          if (copy.scrollHeight <= copy.clientHeight) lo = mid;
          else hi = mid;
        }
        apply(lo);
      };
      side.fitNotes();
    },
    overlay: () => (ctx) => {
      const u = ctx.util;
      const el = u.el('section', 'perturb pxdialog ' + ctx.kind, document.body);
      const bar = u.el('div', 'pxdbar', el);
      u.el('span', '', bar, 'Layout Error');
      const x = u.el('button', 'pxdx', bar, '×');
      x.type = 'button';
      x.addEventListener('click', ctx.dismiss);
      const body = u.el('div', 'pxdbody', el);
      body.innerHTML =
        '<svg class="pxwarn" viewBox="0 0 44 44" width="88" height="88" shape-rendering="crispEdges"><path d="M20 2h5v3h2v4h2v4h2v4h3v4h2v4h2v4h2v4h2v7H1v-7h2v-4h2v-4h2v-4h2v-4h2v-4h2V9h2V5h3V2z" fill="#0b285a"/><path d="M21 5h3v4h2v4h2v4h2v4h2v4h2v4h3v4h2v4H4v-4h2v-4h2v-4h2v-4h2v-4h2v-4h2V9h3V5z" fill="#ffdf22"/><path d="M20 12h4v11h-1v4h-2v-4h-1zM20 31h4v4h-4z" fill="#09295d"/></svg>';
      const txt = u.el('div', 'pxdtxt', body);
      u.el('strong', '', txt, 'Layout could not be restored.');
      u.el('p', '', txt, 'Your previous layout could not be restored due to a settings error.');
      u.el('p', '', txt, 'This may affect how the page is displayed. Do you want to use the default layout?');
      const btns = u.el('div', 'pxdbtns', txt);
      const dismiss = u.el('button', 'dismiss primary', btns, 'Use default layout');
      dismiss.type = 'button';
      dismiss.addEventListener('click', ctx.dismiss);
      const keep = u.el('button', 'keep', btns, 'Keep current layout');
      keep.type = 'button';
      keep.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  };
  env.site({
    name: 'design-click-control-hover-12',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css', 'px.css'],
    initialOverlay: { kind: 'promo' },
    design: { THEMES: { site: palette }, LOW_THEME: palette, ACCENTS: ['#0e9aa8'], LOW_ACCENTS: ['#0e9aa8'], parts },
  });
})();
