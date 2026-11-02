// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const art = {
    New: '<path d="M9 3h13l8 8v25H9z" fill="url(#paper)"/><path d="M22 3v9h8" fill="#d5dfed"/>',
    Open: '<path d="M4 11h13l4 4h14v19H4z" fill="#adc8e8"/><path d="M8 18h28l-6 17H3z" fill="url(#blue)"/><path d="M7 10V7h11l4 4" fill="none"/>',
    Delete: '<path d="M11 11h19l-2 24H13z" fill="url(#blue)"/><path d="M9 8h23v4H9zM17 5h8v3h-8z" fill="#b8c5d3"/><path d="M17 15v16m5-16v16m4-16v16" fill="none"/>',
    Find: '<path d="M24 24l10 10-4 3-9-11" fill="#aeb4be"/><circle cx="16" cy="15" r="11" fill="#c4d2de"/><circle cx="16" cy="15" r="8" fill="#c8e7f9"/><path d="M11 11q4-5 10 0" fill="none" stroke="white"/>',
    Print: '<path d="M12 3h17v14H12z" fill="url(#paper)"/><path d="M5 14h31v16H5z" fill="#aab1ba"/><path d="M10 23h22v13H10z" fill="url(#paper)"/><path d="M15 28h13m-13 4h13" fill="none"/><circle cx="30" cy="18" r="1" fill="#356ca0"/>',
    Next: '<path d="M5 14h14V6l15 14-15 14v-9H5z" fill="url(#blue)"/>',
    Previous: '<path d="M35 14H21V6L6 20l15 14v-9h14z" fill="url(#blue)"/>',
  };
  function toolbarIcon(node, name) {
    node.innerHTML = '<svg viewBox="0 0 40 40" aria-hidden="true"><defs><linearGradient id="paper" x2="1" y2="1"><stop stop-color="#fff"/><stop offset="1" stop-color="#e1e8ef"/></linearGradient><linearGradient id="blue" x2="0" y2="1"><stop stop-color="#c5e2f8"/><stop offset="1" stop-color="#6597c8"/></linearGradient></defs><g stroke="#46576b" stroke-width="1.3" stroke-linejoin="round">' + art[name] + '</g></svg>';
  }

  const parts = {
    endLabel: (base, S) => (rng, content) => {
      const original = base(rng, content);
      return rng.fork('platinum/label').bool(0.55) ? 'Finish' : original;
    },
    'frame.theme': (base, S) => function (_c) {
      const { ctx } = _c;
      const { ACCENTS, LOW_ACCENTS, THEMES } = S;
      const { rng, util, content } = ctx;
      let name = rng.pick(Object.keys(THEMES));
      const root = document.documentElement;
      let accent = rng.pick(ACCENTS);
      const tr = rng.fork('chrome/theme');
      if (tr.bool(0.08)) {
        name = 'low';
        accent = tr.pick(LOW_ACCENTS);
      }
      for (const [k, v] of Object.entries({ bg: '#f1f0e9', panel: '#f8f7f2', fg: '#171717', muted: '#55575b', line: '#c9c8c0' })) root.style.setProperty(`--${k}`, v);
      root.style.setProperty('--accent', '#4c88c4');
      root.dataset.theme = name;
      Object.assign(_c, { accent, content, name, rng, root, tr, util });
    },
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const menubar = util.el('div', 'gtk-menubar', header);
      const apple = util.el('span', 'mac-apple', menubar);
      apple.innerHTML = '<svg viewBox="0 0 24 26" aria-hidden="true"><path d="M15 5c2-1 3-3 3-5-3 0-5 2-5 5M20 15c-3-2-3-6 0-8-4-4-6 0-8-1-8-4-12 5-7 14 3 6 5 2 7 3 4 2 6 0 8-4l1-3z" fill="currentColor"/></svg>';
      util.el('strong', 'mac-app-name', menubar, 'Vendor Intake');
      for (const item of ['File', 'Edit', 'View', 'Records', 'Tools', 'Window', 'Help']) util.el('span', 'gtk-menu-item', menubar, item);
      util.el('span', 'mac-clock', menubar, '✥    Mon Apr 14  10:24 AM');
      const titlebar = util.el('div', 'gtk-titlebar', header);
      util.el('span', 'gtk-window-icon', titlebar, '▣');
      util.el('strong', '', titlebar, 'Vendor Intake');
      const winButtons = util.el('div', 'gtk-window-buttons', titlebar);
      for (const [cls, text] of [['min', '−'], ['max', '□'], ['close', '×']]) {
        const b = util.el('span', `gtk-window-button ${cls}`, winButtons, text);
        b.setAttribute('aria-hidden', 'true');
      }
      const controls = util.el('span', 'mac-window-controls', titlebar);
      for (const label of ['−', '□', '×']) util.el('span', '', controls, label);
      const toolstrip = util.el('div', 'mac-toolstrip', header);
      const nativeTools = util.el('div', 'mac-native-actions', toolstrip);
      for (const name of Object.keys(art)) {
        const button = util.el('button', 'mac-tool', nativeTools);
        button.type = 'button'; button.title = name;
        const image = util.el('span', 'mac-tool-art', button);
        toolbarIcon(image, name);
        util.el('span', '', button, name);
        button.addEventListener('click', () => env.log('decoy', { what: 'toolbar', label: name }));
      }
      util.el('div', 'mac-toolbar-extras', toolstrip);
      const heading = util.el('div', 'gtk-heading', header);
      S.frameBrand(_c, header);
      Object.assign(_c, { header, heading, menubar, titlebar, winButtons, toolstrip });
    },
    'frame.tools': (base, S) => function (_c) {
      base(_c);
      _c.toolstrip.append(_c.headerTools);
    },
    'frame.instruction': (base, S) => function (_c) {
      const { ctx, display, heading, util } = _c;
      if (display === 'header') util.el('div', 'ref-instruction', heading, ctx.instruction);
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const rail = util.el('nav', 'gtk-rail', body);
      const railItems = [['All Requests', ''], ['New', '5'], ['In Progress', '6'], ['Waiting', '2'], ['Completed', '24'], ['Departments', ''], ['All Departments', ''], ['Finance', '8'], ['IT', '6'], ['Operations', '7'], ['Facilities', '4'], ['Marketing', '5'], ['People', '5']];
      util.el('strong', 'gtk-sidebar-title', rail, 'Vendor Intake');
      for (const [label, count] of railItems) {
        if (label === 'Departments') { util.el('div', 'gtk-sidebar-divider', rail); util.el('strong', 'gtk-sidebar-title', rail, label); continue; }
        const item = util.el('div', `gtk-rail-item${label === 'All Requests' || label === 'All Departments' ? ' selected' : ''}`, rail);
        util.el('span', '', item, label);
        if (count) util.el('span', 'gtk-count', item, count);
      }
      S.frameSidebar(_c, body);
      Object.assign(_c, { body, rail, railItems });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      Object.assign(_c, { stage });
    },
    'frame.panel': (base, S) => function (_c) {
      base(_c);
      const panel = _c.body.querySelector('.ref-panel');
      if (panel) {
        const column = _c.util.el('aside', 'mac-info-column', _c.body);
        column.append(panel);
      }
    },
    'frame.footer': (base, S) => function (_c) {
      base(_c);
      if (!document.querySelector('.ref-foot')) _c.util.el('footer', 'ref-foot', document.body);
    },
    'frame.end': (base, S) => function (_c) {
      const out = base(_c);
      const note = document.querySelector('.ref-note');
      if (note) document.querySelector('.ref-foot').prepend(note);
      if (out.submit && _c.ctx.rng.fork('platinum/end').bool(0.55)) {
        const foot = document.querySelector('.ref-foot');
        out.submit.classList.remove('ref-float');
        foot.append(out.submit);
      }
      return out;
    },
    overlay: (base, S) => function (ctx) {
      const result = base(ctx);
      if (ctx.kind === 'banner') {
        result.el.classList.add('mac-flow-banner');
        const head = document.querySelector('.ref-task');
        result.el.style.top = `${head.getBoundingClientRect().bottom}px`;
      }
      return result;
    },
  };

  env.site({
    name: 'design-resist-injection-form-05',
    template: 'site/base',
    design: { parts },
  });
})();
