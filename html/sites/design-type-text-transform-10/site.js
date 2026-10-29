// OpenLook workspace: custom chrome on the shared site/base frame sections.
(function () {
  'use strict';
  const C = {
    menu: 'File|Edit|Transform|Options',
    tools: ['Uppercase', 'Lowercase', 'Capitalize Words', 'Swap Case'],
    spaces: ['Workspace 1', 'Workspace 2', 'Workspace 3', 'Workspace 4'],
  };
  const palette = { bg: '#aab4c4', panel: '#c8ced9', fg: '#101b30',
    muted: '#4a5568', line: '#8e98a8' };

  // Restyle the template's controls without replacing their labels or handlers.
  function dressControls(parent, region) {
    for (const button of parent.children) {
      button.className = button.dataset.role === 'submit'
        ? 'ol-btn ds-submit' + (region === 'foot' ? '' : ' ol-end-' + region)
        : 'ol-xtra ol-xtra-' + region;
    }
  }

  const parts = {
    'frame.layout': (base) => function (_c) {
      base(_c);
      // The briefing column has room for panel and toast modes at every viewport.
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => function (_c) {
      base(_c);
      // The design always has a tool footer; filler navigation has no extra pane.
      _c.wantFooter = true;
      _c.sidebar = false;
      _c.nav = false;
    },
    'frame.header': () => function (_c) {
      const { ctx, display, util: u } = _c;
      const desk = u.el('div', 'ol-desk', document.body);
      const mode = display;
      // left briefing column
      const left = u.el('aside', 'ol-left', desk);
      u.el('div', 'ol-title ol-title-left', left, 'Task');
      const lbody = u.el('div', 'ol-left-body', left);
      if (mode !== 'toast')
        u.el('p', 'ol-note', lbody, ctx.finish
          ? 'Use the text tools on the right to transform the string as instructed, then enter your answer in the field.'
          : 'Use the text tools on the right to transform the string as instructed, then enter your answer in the field and complete the task.');
      u.el('hr', 'ol-rule', lbody);
      const source = ctx.spec.given || '';
      u.el('div', 'ol-lbl', lbody, 'Source string:');
      u.el('div', 'ol-source', lbody, source);
      // right window
      const win = u.el('section', 'ol-win', desk);
      const tb = u.el('div', 'ol-title ol-title-win', win);
      const ic = u.el('span', 'ol-doc', tb);
      ic.innerHTML =
        '<svg viewBox="0 0 24 28" width="30" height="34"><path d="M3 1h13l6 6v20H3z" fill="#fff" stroke="#222" stroke-width="1.6"/><path d="M16 1v7h6M6 6h6M6 11h13M6 15h13M6 19h13M6 23h13" stroke="#444" stroke-width="1.2" fill="none"/></svg>';
      u.el('span', 'ol-wtitle', tb, 'Text Tools');
      const wb = u.el('span', 'ol-wbtns', tb);
      ['_', '□', '×'].forEach((t) => u.el('i', '', wb, t));
      Object.assign(_c, { desk, lbody, win, header: tb, wb, source });
    },
    'frame.nav': () => function (_c) {
      const { util: u, win } = _c;
      const menu = u.el('nav', 'ol-menu', win);
      C.menu.split('|').forEach((t) => {
        const s = u.el('span', '', menu);
        s.innerHTML = '<u>' + t[0] + '</u>' + t.slice(1);
      });
      const h = u.el('span', 'ol-help', menu);
      h.innerHTML = '<u>H</u>elp';
      Object.assign(_c, { menu });
    },
    'frame.instruction': (base) => function (_c) {
      base({ ..._c, header: _c.lbody });
      const instruction = _c.lbody.querySelector('.ref-instruction');
      if (instruction) instruction.className = 'ol-instruction';
      const spacer = _c.lbody.querySelector('.ref-spacer');
      if (spacer) spacer.remove();
    },
    'frame.tools': (base) => function (_c) {
      base(_c);
      dressControls(_c.headerTools, 'title');
      _c.header.insertBefore(_c.headerTools, _c.wb);
    },
    'frame.body': () => function (_c) {
      const { util: u, win, menu, source, lbody } = _c;
      const pane = u.el('div', 'ol-pane', win);
      u.el('div', 'ol-plbl', pane, 'Input Text');
      const inbox = u.el('div', 'ol-text ol-in', pane);
      u.el('div', 'ol-textv', inbox, source);
      const sb = u.el('div', 'ol-sb', inbox);
      u.el('i', '', sb, '▲');
      u.el('b', '', sb);
      u.el('i', '', sb, '▼');
      const row = u.el('div', 'ol-tools', pane);
      C.tools.forEach((t, i) => {
        const b = u.el('button', 'ol-btn', row, t);
        b.type = 'button';
        b.addEventListener('click', () => {
          const text = inbox.querySelector('.ol-textv').textContent;
          out.querySelector('.ol-textv').textContent =
            i === 0
              ? text.toUpperCase()
              : i === 1
                ? text.toLowerCase()
                : i === 2
                  ? text.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())
                  : Array.from(text, (c) => (c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase())).join('');
        });
      });
      u.el('div', 'ol-plbl', pane, 'Output Text');
      const out = u.el('div', 'ol-text ol-out', pane);
      u.el('div', 'ol-textv', out);
      const sb2 = u.el('div', 'ol-sb', out);
      u.el('i', '', sb2, '▲');
      u.el('b', '', sb2);
      u.el('i', '', sb2, '▼');
      const foot = u.el('div', 'ol-foot', pane);
      const clr = u.el('button', 'ol-btn ol-clear', foot, 'Clear');
      clr.type = 'button';
      clr.addEventListener('click', () => {
        out.querySelector('.ol-textv').textContent = '';
      });
      u.el('span', 'ol-grow', foot);
      const cl = u.el('button', 'ol-btn ol-close', foot, 'Close');
      cl.type = 'button';
      Object.assign(_c, { body: lbody, pane, foot, close: cl });
    },
    'frame.panel': (base) => function (_c) {
      base(_c);
      const panel = _c.body.querySelector('.ref-panel');
      if (panel) {
        panel.className = 'ol-instruction ol-panel-instruction';
        panel.querySelector('.ref-panel-title').remove();
        panel.querySelector('.ref-panel-text').className = 'ds-instruction';
      }
    },
    'frame.stage': () => function (_c) {
      _c.stage = _c.util.el('main', 'ds-stage ol-stage', _c.lbody);
    },
    'frame.toast': (base) => function (_c) {
      base(_c);
      const note = document.querySelector('.ref-note');
      if (note) {
        note.className = 'ds-toast ol-instruction';
        note.querySelector('.ref-note-text').className = 'ds-instruction';
        _c.lbody.append(note);
      }
    },
    'frame.footer': (base) => function (_c) {
      base(_c);
      const footer = document.querySelector('.ref-foot');
      const controls = footer.querySelector('.ref-tools');
      dressControls(controls, 'foot');
      _c.foot.insertBefore(controls, _c.close);
      footer.remove();
      const u = _c.util;
      // taskbar
      const bar = u.el('footer', 'ol-bar', document.body);
      const sun = u.el('span', 'ol-sun', bar);
      sun.innerHTML =
        '<svg viewBox="0 0 36 36" width="34" height="34"><g transform="rotate(45 18 18)" fill="none" stroke="#23516b" stroke-width="1.3"><path d="M5 5h26v26H5zM8 8h20v20H8z"/><path id="sun-u" d="M11 11v7h7v-7h-4v4h-1v-4z"/><use href="#sun-u" transform="rotate(90 18 18)"/><use href="#sun-u" transform="rotate(180 18 18)"/><use href="#sun-u" transform="rotate(270 18 18)"/></g></svg><i>Sun</i>';
      C.spaces.forEach((t, i) => u.el('span', 'ol-ws' + (i === 0 ? ' on' : ''), bar, t));
      u.el('span', 'ol-grow', bar);
      const ico = u.el('span', 'ol-icons', bar);
      ico.innerHTML =
        '<svg viewBox="0 0 32 32"><path d="M3 4h11l3 4h12v23H3z" fill="#d1d6dc" stroke="#171c23" stroke-width="1.5"/><path d="M6 9h24v22H6z" fill="#c2c7ce" stroke="#171c23"/><path d="M7 11h21M5 6h8" stroke="#fff"/></svg><svg viewBox="0 0 32 32"><rect x="2" y="4" width="28" height="26" fill="#d8dde2" stroke="#111"/><rect x="5" y="7" width="22" height="20" fill="#25313d" stroke="#111"/><path d="M8 11h4M8 14h2M13 24h4" stroke="#d9e1e8"/><path d="M4 5h24v23" stroke="#fff" fill="none"/></svg><svg viewBox="0 0 32 32"><path d="M9 2h14v13H9z" fill="#e5e8ec" stroke="#111"/><path d="M6 11h20v5h4v13H2V16h4z" fill="#c6cbd2" stroke="#111"/><path d="M8 21h16v10H8z" fill="#eef0f3" stroke="#111"/><path d="M11 5h9M11 8h9M5 17h22M11 24h10M11 27h10" stroke="#53606d"/><path d="M4 18h24" stroke="#fff"/></svg>';
      u.el('span', 'ol-clock', bar, 'Mon Apr 20 1992   10:24 AM');
    },
    'frame.floating': (base) => function (_c) {
      base(_c);
      const dock = document.querySelector('.ref-float-dock');
      if (dock) {
        dressControls(dock, 'menu');
        _c.menu.insertBefore(dock, _c.menu.querySelector('.ol-help'));
      }
    },
    'frame.end': (base) => function (_c) {
      const { lbody } = _c;
      // Fit longer seeded instruction templates in the briefing without moving task anchors.
      const briefing = lbody.querySelector('.ol-instruction');
      if (briefing && lbody.querySelector('.ol-note')) {
        const available =
          lbody.querySelector('.ol-note').getBoundingClientRect().top - briefing.getBoundingClientRect().top - 12;
        for (let i = 0; i < 24 && briefing.getBoundingClientRect().height > available; i++) {
          const size = parseFloat(getComputedStyle(briefing).fontSize);
          briefing.style.fontSize = Math.max(12, size * 0.97) + 'px';
        }
      }
      return base(_c);
    },
  };

  env.site({
    name: 'design-type-text-transform-10',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-overlays.css', 'templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { openlook: palette },
      LOW_THEME: palette,
      ACCENTS: ['#2f5da8'],
      LOW_ACCENTS: ['#2f5da8'],
      parts,
    },
  });
})();
