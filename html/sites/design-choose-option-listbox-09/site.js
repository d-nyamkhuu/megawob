(function () {
  'use strict';
  const palette = { bg: '#cbc9c3', panel: '#ffffff', fg: '#1a1214', muted: '#4a4244', line: '#9a948c' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The briefing column has room for all note modes at every viewport.
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = _c.util;
      const top = u.el('header', 'lc-title', document.body);
      top.innerHTML = '<svg class="lc-ico" viewBox="0 0 30 30"><rect x="2" y="1" width="26" height="21" fill="#c8d4e8" stroke="#223" stroke-width="2"/><rect x="5" y="4" width="20" height="15" fill="#2a58b8" stroke="#111"/><rect x="12" y="23" width="6" height="3" fill="#aaa"/><rect x="8" y="27" width="14" height="2" fill="#ccc" stroke="#222"/></svg>';
      u.el('span', 'lc-brand', top, 'LumiCal 1.2.0  - Display Calibration Utility');
      const wb = u.el('span', 'lc-wbtns', top);
      ['_', '□', '×'].forEach((t) => u.el('i', '', wb, t));
      const nav = u.el('nav', 'lc-menu', document.body);
      ['File', 'Edit', 'Tools', 'Help'].forEach((t) => u.el('span', '', nav, t));
      const body = u.el('div', 'lc-body', document.body);
      const row1 = u.el('div', 'lc-row1', body);
      const task = u.el('section', 'lc-panel lc-task', row1);
      task.dataset.display = _c.display;
      u.el('h2', 'lc-h', task, 'Task');
      const header = u.el('div', 'lc-brief', task);
      Object.assign(_c, { navBar: nav, body, row1, task, header });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('lc-taskin', 'lc-instr');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.navBar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => () => {},
    'frame.panel': (base) => (_c) => {
      base({ ..._c, body: _c.header });
      const panel = _c.header.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('lc-taskcard');
        const title = panel.querySelector('.ref-panel-title');
        title.textContent = 'Instructions';
        panel.querySelector('.ref-panel-text').classList.add('lc-instr');
      }
      _c.util.el('p', 'lc-help', _c.task, 'Choose only the specified colors from the list. You can scroll if needed. Multiple selection is enabled.');
      _c.toastSlot = _c.util.el('div', 'lc-toast-slot', _c.task);
      _c.util.el('div', 'lc-curlab', _c.task, 'Current selection:');
      _c.util.el('div', 'lc-cursel', _c.task);
    },
    'frame.stage': () => (_c) => {
      const u = _c.util;
      const app = u.el('section', 'lc-panel lc-app', _c.row1);
      u.el('h2', 'lc-h', app, 'Appearance Settings');
      const tabs = u.el('div', 'lc-tabs', app);
      ['Colors', 'Fonts', 'Display', 'Advanced'].forEach((t, i) => u.el('span', 'lc-tab' + (i ? '' : ' on'), tabs, t));
      const tb = u.el('div', 'lc-tabbody', app);
      _c.stage = u.el('main', 'ds-stage', tb);
      const side = u.el('div', 'lc-side', tb);
      const pv = u.el('fieldset', 'lc-fs lc-prev', side);
      u.el('legend', '', pv, 'Preview');
      const win = u.el('div', 'lc-win', pv);
      const wt = u.el('div', 'lc-wtitle', win);
      u.el('span', '', wt, 'Sample Window');
      const wbb = u.el('span', 'lc-wbtns sm', wt);
      ['_', '□', '×'].forEach((t) => u.el('i', '', wbb, t));
      const wm = u.el('div', 'lc-wmenu', win);
      ['File', 'Edit', 'View', 'Help'].forEach((t) => u.el('span', '', wm, t));
      const wbody = u.el('div', 'lc-wbody', win);
      u.el('div', '', wbody, 'The quick brown fox');
      u.el('div', '', wbody, 'jumps over the lazy dog.');
      u.el('span', 'lc-ok', wbody, 'OK');
      const ci = u.el('fieldset', 'lc-fs lc-info', side);
      u.el('legend', '', ci, 'Color information');
      [['Name:', '(none)'], ['RGB:', '---'], ['Hex:', '---']].forEach((p) => {
        const r = u.el('div', 'lc-ir', ci);
        u.el('span', '', r, p[0]);
        u.el('span', '', r, p[1]);
      });
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        note.classList.add('ds-toast');
        const title = _c.util.el('div', 'lc-toasttitle', null, 'LumiCal notification');
        note.prepend(title);
        _c.toastSlot.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      const foot = _c.util.el('footer', 'lc-actions', document.body);
      const heading = _c.util.el('h2', 'lc-h', foot, 'Actions');
      base(_c);
      const strip = document.body.querySelector('.ref-foot');
      strip.classList.add('lc-strip');
      foot.appendChild(strip);
      if (_c.placement === 'link' && _c.submit) heading.appendChild(_c.submit);
      _c.strip = strip;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.strip.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util;
      const el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = {
        cookie: 'We use cookies to remember your preferences.',
        toast: 'Changes synced.',
        chat: 'Hello. How can we help?',
        promo: 'Try our new workspace.',
        banner: 'Scheduled maintenance tonight.',
      };
      u.el('div', '', el, texts[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  };
  env.site({
    name: 'design-choose-option-listbox-09',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-choose-option-listbox-09': palette },
      LOW_THEME: palette,
      ACCENTS: ['#6b0020'],
      LOW_ACCENTS: ['#6b0020'],
      parts,
    },
  });
})();
