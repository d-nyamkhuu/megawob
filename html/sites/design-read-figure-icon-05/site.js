(function () {
  'use strict';
  const FACTS = [['Collection:', 'Pictures'], ['Items:', '12'], ['Size:', '48 KB'], ['Modified:', '3 Apr 1989  10:24']];
  const DETAILS = [['Type:', 'Icon'], ['Size:', '4 KB'], ['Dimensions:', '32 × 32'], ['Colours:', '4'], ['Modified:', '3 Apr 1989  10:24']];
  const FILE_ICON =
    '<svg viewBox="0 0 60 70" width="100%" height="100%"><path d="M4 2h38l14 14v52H4z" fill="#fff" stroke="#000" stroke-width="3"/><path d="M42 2v14h14" fill="#e8e8e8" stroke="#000" stroke-width="2"/><rect x="12" y="22" width="16" height="16" fill="#1e4fd0"/><circle cx="19" cy="52" r="8" fill="#2f9a3a"/><path d="M40 52l8-16 8 16z" fill="#d62020" transform="translate(-6 0)"/></svg>';
  const BOX_ICON =
    '<svg viewBox="0 0 90 80" width="100%" height="100%"><rect x="12" y="2" width="26" height="22" fill="#fff" stroke="#000" stroke-width="2"/><rect x="15" y="5" width="20" height="14" fill="#3b78d8"/><rect x="38" y="0" width="26" height="28" fill="#fff" stroke="#000" stroke-width="2" transform="rotate(10 50 14)"/><circle cx="52" cy="14" r="7" fill="#2f9a3a" transform="rotate(10 50 14)"/><path d="M4 30h58l8-8v46l-8 8H4z" fill="#3d4a66" stroke="#000" stroke-width="2"/><rect x="4" y="30" width="58" height="46" fill="#aab4c8" stroke="#000" stroke-width="3"/></svg>';
  env.site({
    name: 'design-read-figure-icon-05',
    template: 'site/base',
    design: {
      parts: {
        'frame.theme': (base) => (_c) => {
          base(_c);
          // The viewer supplies its own fixed palette, including widget fallbacks.
          for (const key of ['bg', 'panel', 'fg', 'muted', 'line', 'accent']) {
            _c.root.style.removeProperty('--' + key);
          }
          _c.root.removeAttribute('data-theme');
        },
        'frame.header': () =>
          function (_c) {
            const u = _c.util;
            document.body.className = 'ri-body';
            const win = u.el('div', 'ri-win', document.body);
            const title = u.el('div', 'ri-title', win);
            u.el('span', 'ri-appicon', title).innerHTML =
              '<svg viewBox="0 0 24 24" width="24" height="24"><rect x="3" y="2" width="18" height="20" fill="#fff" stroke="#000" stroke-width="1.5"/><rect x="6" y="6" width="6" height="6" fill="#1e4fd0"/><path d="M13 19l4-7 4 7z" fill="#d62020"/></svg>';
            u.el('span', 'ri-titletext', title, 'Icon Viewer');
            u.el('span', 'ri-spacer', title);
            const wc = u.el('div', 'ri-wc', title);
            for (const k of ['min', 'max', 'close']) {
              const g = u.el('span', 'ri-gadget ri-' + k, wc);
              g.innerHTML =
                k === 'min' ? '<i></i>' : k === 'max' ? '<b></b>' : '<svg viewBox="0 0 20 20" width="20" height="20"><path d="M4 4l12 12M16 4L4 16" stroke="#fff" stroke-width="3"/></svg>';
            }
            const band = u.el('div', 'ri-band', win);
            u.el('span', 'ri-boxicon', band).innerHTML = BOX_ICON;
            const facts = u.el('div', 'ri-facts', band);
            for (const [k, v] of FACTS) {
              u.el('span', '', facts, k);
              u.el('span', '', facts, v);
            }
            Object.assign(_c, { win, header: title, band, wc });
          },
        'frame.nav': () => () => {},
        'frame.instruction': (base) => (_c) => {
          const h = _c.header;
          _c.header = _c.band;
          base(_c);
          _c.header = h;
        },
        'frame.tools': (base) => (_c) => {
          base(_c);
          _c.header.appendChild(_c.wc);
        },
        'frame.body': () => (_c) => {
            const u = _c.util;
            const body = u.el('div', 'ri-main', _c.win);
            const stage = u.el('main', 'ri-stage', body);
            const insp = u.el('aside', 'ri-insp', body);
            u.el('div', 'ri-insp-h', insp, 'Item details');
            const ib = u.el('div', 'ri-insp-b', insp);
            if (_c.display !== 'panel') u.el('div', 'ri-preview', ib).innerHTML = FILE_ICON;
            const dl = u.el('div', 'ri-facts ri-dl', ib);
            for (const [k, v] of DETAILS) {
              u.el('span', '', dl, k);
              u.el('span', '', dl, v);
            }
            const foot = u.el('footer', 'ri-foot', _c.win);
            if (_c.ctx.finish || _c.placement === 'header' || _c.placement === 'icon') foot.classList.add('ri-slim');
            Object.assign(_c, { body, stage, ib, foot });
          },
        'frame.panel': (base) => (_c) => {
          const body = _c.body;
          _c.body = _c.ib;
          base(_c);
          _c.body = body;
          if (_c.display === 'panel') _c.ib.prepend(_c.ib.querySelector('.ref-panel'));
        },
        'frame.stage': () => () => {},
        'frame.toast': (base) => (_c) => {
          base(_c);
          const note = document.body.querySelector('.ref-note');
          if (note) _c.foot.appendChild(note);
        },
        'frame.footer': (base) => (_c) => {
          base(_c);
          const foot = document.body.querySelector('.ref-foot');
          if (foot) _c.foot.appendChild(foot);
        },
        'frame.floating': (base) => (_c) => {
          base(_c);
          const dock = document.body.querySelector('.ref-float-dock');
          if (dock) _c.foot.prepend(dock);
          },
      },
    },
  });
})();
