(function () {
  'use strict';
  // Reference coordinates (1672x941) -> percentages of the viewport.
  const W = 1672,
    H = 941;
  const pos = (e, x, y, w, h) => {
    const s = e.style;
    s.left = (x / W) * 100 + '%';
    s.top = (y / H) * 100 + '%';
    if (w !== undefined) s.width = (w / W) * 100 + '%';
    if (h !== undefined) s.height = (h / H) * 100 + '%';
    return e;
  };
  const fs = (e, px) => {
    e.style.fontSize = 'calc(var(--w-unit) * ' + px + ')';
    return e;
  };
  const art = {
    pm: '<path fill="#111" d="M13 7l5-5h37v33l6 6v14l-5 7H1V50l6-11h4V12z"/><path fill="#777" d="M18 4h35v30l-7 6H12V10zM8 40h44l7 7v7l-5 6H2V51z"/><path fill="#eee" d="M18 4h34v2H17l-3 4h-2V8zM12 11h3v27h30v2H10zM8 41h43v2H9l-4 7H3zM3 55h52v3H2z"/><path fill="#b7b7b7" d="M16 10h31v27H14zM8 43h42l6 6H5zM5 50h48v4H5z"/><path fill="#444" d="M18 12h27v21H16V14zM10 45h20v4H10zM36 44h12v4H36zM8 51h36v2H8z"/><path fill="#deded4" d="M20 14h23v17H18V16z"/><path fill="#252655" d="M21 16h20v13H19V18z"/><path fill="#73779e" d="M24 19h14v8H22v-6z"/><path fill="#b8b9d3" d="M27 20h9v2h-9zM25 24h6v2h-6z"/><path fill="#fff" d="M13 45h12v1H13zM38 45h8v1h-8zM11 51h30v1H11zM5 57h46v1H5z"/><path fill="#222" d="M48 10h3v25l-4 3zM3 59h50v2H3zM52 51h5v4h-5z"/>',
    folder:
      '<path fill="#111" d="M5 12h23l6 6h25v38H2V18z"/><path fill="#ffffaa" d="M7 12h20l6 6H4z"/><path fill="#99994d" d="M3 18h55v36H3z"/><path fill="#e3e073" d="M5 20h51v32H5z"/><path fill="#fffeb3" d="M5 19h51v3H5zM4 22h2v30H4z"/><path fill="#55552b" d="M56 19h3v36H4v-2h52z"/>',
    fm: '<path fill="#111" d="M16 8h39v48l-8 8H8V20z"/><path fill="#ffffb0" d="M18 9h34v45l-7 8H10V20z"/><path fill="#8a874d" d="M45 18h9v37l-7 8h-2z"/><path fill="#e6df72" d="M10 20h34v42H10z"/><path fill="#fff" d="M18 10h32v3H18zM11 20h31v3H11zM11 23h2v37h-2z"/><path fill="#444" d="M20 10h29v3H20zM17 28h20v5H17zM17 41h20v4H17zM17 54h20v4H17z"/><path fill="#fff5af" d="M14 25h25v2H14zM14 37h25v2H14zM14 50h25v2H14z"/><path fill="#eee" d="M18 28h18v2H18zM18 41h18v1H18zM18 54h18v1H18z"/><path fill="#343428" d="M44 20h2v43h-2zM49 15h2v39h-2z"/>',
    bin: '<path fill="#111" d="M6 12l22-9 29 12-9 40-17 8-18-10z"/><path fill="#ddd" d="M7 13l22-9 27 11-21 11z"/><path fill="#777" d="M13 13l16-6 19 8-14 6z"/><path fill="#bfbfbf" d="M9 18l23 10v31L16 51z"/><path fill="#999" d="M33 28l21-10-8 34-13 7z"/><path fill="#fff" d="M8 13l24 11 22-9v3L33 28 9 18zM16 22l3 2 5 25-3-1z"/><path fill="#187c24" d="M24 29l6 3-2 7-2-3-5 5-3-5 4-4-2-2zM23 42l7 3v-4l5 7-5 6v-4l-8-4zM38 32l5 3-4 8-4-2 3-6-3 1z"/>',
  };
  const fitNote = (note, mode) => {
    const t = note.querySelector('.ref-instruction, .ref-panel-text, .ref-note-text');
    let size = mode === 'header' ? 44 : 26;
    fs(t, size);
    while (t.scrollHeight > note.clientHeight - (mode === 'header' ? 2 : note.firstChild.offsetHeight + 12) && size > 18) fs(t, --size);
  };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const ctx = _c.ctx;
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const sel = window.getSelection();
      if (sel) sel.removeAllRanges();
      const u = ctx.util;
      const desk = u.el('div', 'w-desk', document.body);
      desk.style.setProperty('--w-unit', Math.min(desk.clientWidth / W, desk.clientHeight / H) + 'px');
      // desktop icons
      [
        ['Program Manager', 20, 'pm'],
        ['My Documents', 165, 'folder'],
        ['File Manager', 306, 'fm'],
        ['Recycle Bin', 451, 'bin'],
      ].forEach(([t, y, k]) => {
        const ic = pos(u.el('div', 'w-icon', desk), 0, y, 132);
        u.el('div', 'w-glyph w-g-' + k, ic).innerHTML =
          '<svg viewBox="0 0 64 64" aria-hidden="true" shape-rendering="crispEdges">' + art[k] + '</svg>';
        fs(u.el('div', 'w-cap', ic, t), 22);
      });
      // notebook tabs
      [
        ['General', 112, 112, 1],
        ['Office', 228, 114],
        ['Users', 345, 113],
        ['Reports', 462, 114],
        ['Advanced', 580, 114],
      ].forEach(([t, y, h, on]) => {
        const tab = pos(u.el('div', 'w-tab' + (on ? ' w-act' : ''), desk), on ? 162 : 172, y, on ? 160 : 150, h);
        u.el('span', '', tab, t);
        fs(tab, 25);
        tab.style.width = ((on ? 160 : 150) / W) * 100 + '%';
      });
      // window
      pos(u.el('div', 'w-sheet', desk), 313, 39, 1328, 869);
      pos(u.el('div', 'w-frame', desk), 332, 18, 1325, 904);
      const win = pos(u.el('div', 'w-win', desk), 320, 76, 1336, 849);
      const tb = pos(u.el('div', 'w-title', desk), 336, 22, 1316, 52);
      fs(u.el('span', '', tb, 'Company Settings'), 29);
      ['min', 'max', 'close'].forEach((k) => u.el('span', 'w-tbtn w-tbtn-' + k, tb));
      const rings = pos(u.el('div', 'w-rings', desk), 310, 123, 38, 777);
      for (let i = 0; i < 13; i++)
        u.el('span', '', rings).innerHTML =
          '<svg viewBox="0 0 40 25" aria-hidden="true"><path fill="#090909" d="M27 2h9l4 4v14h-9l-4-4z"/><path fill="#555" d="M28 4h6v13h-6z"/><path d="M29 20V8C13 3 2 4 3 16l13 4" fill="none" stroke="#222" stroke-width="8"/><path d="M28 18V7C13 2 2 5 3 14l13 4" fill="none" stroke="#bbb" stroke-width="6"/><path d="M28 9C15 4 4 5 4 10" fill="none" stroke="#fff" stroke-width="3"/><path d="M3 14l13 4" fill="none" stroke="#777" stroke-width="2"/><path d="M7 8v7m4-8v9m5-9v11m5-10v10" fill="none" stroke="#888" stroke-width="1"/><path d="M8 7v6m5-7v8m5-7v9" fill="none" stroke="#eee" stroke-width="1"/></svg>';
      const header = pos(u.el('div', 'w-note-host', desk), 413, 123, 983, 72);
      const toolbar = pos(u.el('div', 'w-toolbar', desk), 1420, 132, 177, 57);
      Object.assign(_c, { desk, header, toolbar });
      pos(u.el('div', 'w-rule', desk), 373, 218, 1220, 0);
      pos(u.el('div', 'w-rule', desk), 373, 817, 1237, 0);
      // static form labels / fields
      const lab = (t, x, y) => fs(pos(u.el('div', 'w-lab', desk), x, y), 26).appendChild(document.createTextNode(t));
      lab('Company name:', 414, 272);
      lab('Office location:', 414, 334);
      lab('Time zone:', 414, 627);
      lab('Language:', 414, 689);
      desk.querySelectorAll('.w-lab')[1].dataset.role = 'picker-label';
      const inp = (t, x, y, w, h, cls) => {
        const e = pos(u.el('div', 'w-in ' + (cls || ''), desk), x, y, w, h);
        fs(u.el('span', '', e, t), 26);
        return e;
      };
      inp('Riverton Technologies', 629, 266, 374, 46);
      const dd = (t, y) => {
        const e = inp(t, 629, y, 374, 46, 'dd');
        u.el('span', 'w-arr', e);
      };
      dd('(GMT-8:00) Pacific Time', 620);
      dd('English (United States)', 692);
      const cb = pos(u.el('div', 'w-cb', desk), 634, 760, 26, 26);
      fs(pos(u.el('div', 'w-lab', desk), 676, 759), 26).textContent = 'Set as default office';
      // office details group
      pos(u.el('div', 'w-group', desk), 1062, 271, 527, 391);
      fs(pos(u.el('div', 'w-legend', desk), 1078, 256), 26).textContent = 'Office Details';
      lab('Address:', 1094, 322);
      lab('Phone:', 1094, 515);
      lab('Manager:', 1094, 588);
      const addr = inp('', 1212, 340, 333, 126, 'tall');
      addr.firstChild.innerHTML = '1000 Pine St.<br>Seattle, WA&nbsp; 98101';
      inp('(206) 555-0100', 1212, 508, 333, 46);
      inp('Taylor Kim', 1212, 581, 333, 46);
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const text = _c.header.querySelector('.ref-instruction');
      if (text) {
        _c.header.classList.add('w-note');
        fitNote(_c.header, 'header');
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => { _c.body = _c.desk; },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const note = _c.body.querySelector('.ref-panel');
      if (note) {
        note.classList.add('w-note', 'panel');
        pos(note, 1062, 686, 527, 110);
        note.querySelector('.ref-panel-title').textContent = 'Task details';
        fitNote(note, 'panel');
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = pos(_c.util.el('main', 'ds-stage', _c.desk), 629, 332, 375, 262);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        _c.desk.appendChild(note);
        note.classList.add('w-note', 'toast');
        pos(note, 1062, 686, 527, 110);
        const caption = _c.util.el('div', 'w-note-caption', null, 'Company Settings — Message');
        note.prepend(caption);
        fitNote(note, 'toast');
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      _c.desk.appendChild(foot);
      pos(foot, 373, 834, 1237, 57);
      foot.querySelector('.ref-foot-text').hidden = true;
      const tools = foot.querySelector('.ref-tools');
      for (const button of [..._c.headerTools.querySelectorAll('.ref-xtra')]) tools.prepend(button);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) {
        _c.desk.appendChild(dock);
        pos(dock, 413, 834, 177, 57);
        _c.foot.style.paddingRight = 'calc(var(--w-unit) * 200)';
      }
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
  const palette = { bg: '#008080', panel: '#c0c0c0', fg: '#000000', muted: '#808080', line: '#404040' };
  env.site({
    name: 'design-choose-option-listbox-02',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-choose-option-listbox-02': palette },
      LOW_THEME: palette,
      ACCENTS: ['#000080'],
      LOW_ACCENTS: ['#000080'],
      parts,
    },
  });
})();
