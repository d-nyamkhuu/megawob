(function () {
  'use strict';
  const cfg = {
    title: 'Research Notes',
    menus: ['File', 'Edit', 'View', 'Go', 'Tabs', 'Window', 'Help'],
    clock: 'Mon Mar 14  9:27 AM',
  };
  // The document scrollbar follows the active tab's inner scroll pane.
  function documentScrollbar(stage, vs) {
    const thumb = vs.querySelector('.thumb');
    const activePanel = () => stage.querySelector('.uc-tabpanel:not([hidden])');
    const scrollGeometry = () => {
      const p = activePanel(),
        track = Math.max(0, vs.clientHeight - 68),
        range = p ? Math.max(0, p.scrollHeight - p.clientHeight) : 0;
      const height = range ? Math.max(48, (track * p.clientHeight) / p.scrollHeight) : Math.min(100, track);
      return { p, range, height, travel: track - height };
    };
    const syncScroll = () => {
      const g = scrollGeometry();
      thumb.style.height = g.height + 'px';
      thumb.style.top = 34 + (g.range ? (g.p.scrollTop / g.range) * g.travel : 0) + 'px';
    };
    stage.addEventListener('scroll', syncScroll, true);
    stage.addEventListener('click', syncScroll);
    vs.querySelector('.up').addEventListener('click', () => {
      const p = activePanel();
      if (p) p.scrollTop -= 80;
      syncScroll();
    });
    vs.querySelector('.down').addEventListener('click', () => {
      const p = activePanel();
      if (p) p.scrollTop += 80;
      syncScroll();
    });
    thumb.addEventListener('pointerdown', (e) => {
      const g = scrollGeometry();
      if (!g.p || !g.range) return;
      const y = e.clientY,
        start = g.p.scrollTop;
      thumb.setPointerCapture(e.pointerId);
      const move = (ev) => {
        g.p.scrollTop = start + ((ev.clientY - y) * g.range) / Math.max(1, g.travel);
        syncScroll();
      };
      const end = () => {
        thumb.removeEventListener('pointermove', move);
        thumb.removeEventListener('pointerup', end);
        thumb.removeEventListener('pointercancel', end);
      };
      thumb.addEventListener('pointermove', move);
      thumb.addEventListener('pointerup', end);
      thumb.addEventListener('pointercancel', end);
    });
  }

  const parts = {
    'frame.theme': (base) => (_c) => {
      base(_c);
      document.body.className = 'ref mac';
    },
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The reference has a permanent margin, also at the smallest viewport.
      _c.display = _c.ctx.display || 'header';
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const bar = u.el('header', 'mbar', document.body);
      const apple = u.el('span', 'apple', bar);
      apple.innerHTML =
        '<svg viewBox="0 0 24 28"><path d="M17 15c0-3 2.5-4.2 2.6-4.3-1.4-2-3.600-2.300-4.400-2.300-1.900-.2-3.600 1.100-4.600 1.100s-2.400-1.100-4-1C4.500 8.500 2.600 9.700 1.600 11.600c-2.100 3.600-.5 8.900 1.500 11.800 1 1.400 2.200 3 3.800 3 1.500-.1 2.100-1 3.900-1s2.300 1 3.900 1 2.700-1.500 3.700-2.900c1.100-1.600 1.600-3.200 1.600-3.300 0 0-3-1.200-3-4.700ZM14 6.200c.8-1 1.400-2.400 1.200-3.800-1.200.1-2.700.8-3.500 1.800-.8.900-1.400 2.300-1.200 3.700 1.300.1 2.700-.7 3.500-1.700Z"/></svg>';
      cfg.menus.forEach((m) => u.el('span', 'mi', bar, m));
      u.el('span', 'grow', bar);
      const ic = u.el('span', 'mclock-ic', bar);
      ic.innerHTML =
        '<svg viewBox="0 0 36 26"><rect x="1.500" y="1.500" width="33" height="23" fill="#fff" stroke="#000" stroke-width="2"/><path d="M6 8h24M6 13h18M6 18h20" stroke="#000" stroke-width="2"/></svg>';
      u.el('span', 'mclock', bar, cfg.clock);
      const win = u.el('main', 'win', document.body);
      const tb = u.el('div', 'titlebar', win);
      u.el('span', 'closebox', tb);
      u.el('span', 'wtitle', tb, cfg.title);
      const margin = u.el('aside', 'margin ref-task', document.body);
      Object.assign(_c, { win, tb, margin, header: margin });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('instruction');
    },
    'frame.body': () => (_c) => {
      _c.body = _c.util.el('div', 'wbody ref-body', _c.win);
    },
    'frame.panel': (base) => (_c) => {
      const { margin, util: u } = _c;
      base({ ..._c, body: margin });
      const panel = margin.querySelector('.ref-panel');
      if (panel) {
        margin.classList.add('episode-panel');
        panel.querySelector('.ref-panel-text').classList.add('instruction');
        margin.prepend(panel);
      }
      const notes = u.el('div', 'notes', margin);
      notes.hidden = _c.display === 'hidden';
      u.el('div', 'nh', notes, 'Notes:');
      const ul = u.el('ul', '', notes);
      u.el('li', '', ul, 'The tabs contain project notes and references.');
      u.el('li', '', ul, 'Links open related documents.');
    },
    'frame.stage': () => (_c) => {
      const { util: u, body } = _c;
      const stage = u.el('div', 'stage', body);
      const vs = u.el('div', 'vscroll', body);
      vs.innerHTML = '<i class="up"></i><b class="thumb"></b><i class="down"></i>';
      documentScrollbar(stage, vs);
      _c.stage = stage;
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('instruction-toast');
        note.querySelector('.ref-note-text').classList.add('instruction');
        _c.margin.prepend(note);
      }
    },
    'frame.end': (base) => (_c) => {
      // Keep the template's controls and their behavior in this design's margin.
      for (const selector of ['.ref-foot', '.ref-float-dock']) {
        const dock = document.body.querySelector(selector);
        if (dock) _c.margin.append(dock);
      }
      if (_c.submit) {
        _c.submit.classList.add('submit');
        if (_c.placement === 'header' || _c.placement === 'icon') {
          _c.submit.classList.add('submit-notes');
        }
      }
      return base(_c);
    },
  };

  const mono = { bg: '#fff', panel: '#fff', fg: '#000', muted: '#000', line: '#000' };
  env.site({
    name: 'design-click-control-tab-07',
    template: 'site/base',
    styles: ['site.css', 'mac.css'],
    design: {
      THEMES: { light: mono },
      LOW_THEME: mono,
      ACCENTS: ['#000'],
      LOW_ACCENTS: ['#000'],
      LANGS: ['en'],
      parts,
    },
  });
})();
