// Metro chrome on the shared frame; episode behavior comes from site/base.
(function () {
  'use strict';

  const ITEMS = [
    ['Home', 'M12 2 2 11h3v10h6v-6h3v6h6V11h3z'],
    ['Search', 'M10 2a8 8 0 1 0 5.3 14l5.2 5.2 2-2-5.2-5.2A8 8 0 0 0 10 2m0 3a5 5 0 1 1 0 10 5 5 0 0 1 0-10'],
    ['Notes', 'M5 2h14v20H5zm3 4v2h8V6zm0 4v2h8v-2zm0 4v2h8v-2zm0 4v1h8v-1'],
    ['Bookmarks', 'm12 2 3 7 7 .5-5.5 4.6 1.8 7L12 17l-6.3 4.1 1.8-7L2 9.5 9 9z'],
    ['Settings', 'M12 2l2 1 2-.5 2 2-.5 2 1 2 2 1v3l-2 1-1 2 .5 2-2 2-2-.5-2 1-1 2h-3l-1-2-2-1-2 .5-2-2 .5-2-1-2-2-1v-3l2-1 1-2-.5-2 2-2 2 .5 2-1 1-2h3zm-1.5 6a4 4 0 1 0 3 7.4 4 4 0 0 0-3-7.4'],
    ['Help', 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20m0 2a8 8 0 1 1 0 16 8 8 0 0 1 0-16m0 2c-2 0-3.5 1.2-3.7 3h2c.2-.8.7-1.2 1.7-1.2 1 0 1.6.5 1.6 1.3 0 .7-.4 1.1-1.4 1.8-1.2.8-1.8 1.5-1.8 3v.5h2v-.4c0-.9.3-1.3 1.4-2.1 1.3-.9 1.9-1.7 1.9-2.9C15.7 7.3 14.2 6 12 6m-1 11h2v2h-2z'],
  ];
  const PALETTE = { bg: '#f1f4f7', panel: '#fff', fg: '#111', muted: '#7e8997', line: '#c6d0d9' };

  function emphasizeHot(u, heading) {
    const text = heading.textContent;
    heading.replaceChildren();
    for (const part of text.split(/(HOT)/g)) u.el(part === 'HOT' ? 'strong' : 'span', '', heading, part);
  }

  env.site({
    name: 'design-solve-puzzle-hot-cold-03',
    template: 'site/base',
    styles: ['site.css'],
    design: {
      THEMES: { metro: PALETTE },
      LOW_THEME: PALETTE,
      ACCENTS: ['#087de1'],
      LOW_ACCENTS: ['#087de1'],
      parts: {
        'frame.layout': (base) => (_c) => {
          base(_c);
          // The panel stacks at narrow widths through this design's existing CSS.
          _c.display = _c.ctx.display;
          document.body.className = 'metro instruction-' + _c.display;
        },
        'frame.header': () => (_c) => {
          const u = _c.util;
          const app = u.el('main', 'app', document.body);
          const top = u.el('header', 'top', app);
          u.el('span', 'window-title', top, 'Discovery Finder');
          const wc = u.el('div', 'native-window-controls', top);
          for (const kind of ['min', 'max', 'close']) {
            const svg = u.svg('svg', { width: 20, height: 20, viewBox: '0 0 20 20' }, wc);
            u.svg('path', {
              d: kind === 'min' ? 'M3 12h14' : kind === 'max' ? 'M4 4h12v12H4z' : 'M4 4l12 12M16 4L4 16',
              fill: 'none', stroke: 'currentColor', 'stroke-width': 1.7,
            }, svg);
          }
          const header = u.el('nav', 'ribbon', app);
          for (const [i, [label, path]] of ITEMS.entries()) {
            const item = u.el('div', 'ribbon-item' + (i === 0 ? ' active' : ''), header);
            const svg = u.svg('svg', { viewBox: '0 0 24 24', width: 48, height: 48 }, item);
            u.svg('path', { d: path, fill: 'currentColor' }, svg);
            u.el('span', '', item, label);
          }
          Object.assign(_c, { app, header });
        },
        'frame.nav': () => () => {},
        'frame.instruction': (base) => (_c) => {
          const { app, display, util: u } = _c;
          const body = u.el('div', 'center', app);
          const brief = u.el('div', 'brief', body);
          base({ ..._c, header: brief });
          if (display === 'header') {
            const heading = brief.querySelector('.ref-instruction');
            heading.classList.add('brief-heading');
            emphasizeHot(u, heading);
            u.el('div', 'brief-help', brief,
              'Click around the image to find the hidden area. The hints will tell you if you’re getting warmer or colder.');
          }
          Object.assign(_c, { body, brief });
        },
        'frame.body': () => () => {},
        'frame.panel': (base) => (_c) => {
          base(_c);
          const panel = _c.body.querySelector('.ref-panel');
          if (panel) {
            _c.brief.remove();
            panel.classList.add('brief');
            const heading = panel.querySelector('.ref-panel-text');
            heading.classList.add('brief-heading');
            emphasizeHot(_c.util, heading);
          }
        },
        'frame.stage': () => (_c) => {
          _c.stage = _c.util.el('section', 'stage', _c.body);
        },
        'frame.toast': (base) => (_c) => {
          base(_c);
          const note = document.querySelector('.ref-note');
          if (note) {
            _c.brief.replaceChildren(note);
            emphasizeHot(_c.util, note.querySelector('.ref-note-text'));
          }
        },
        'frame.footer': (base) => (_c) => {
          base(_c);
          const footer = document.querySelector('.ref-foot') || _c.util.el('footer', '', _c.app);
          footer.classList.add('bottom');
          _c.app.appendChild(footer);
          _c.footer = footer;
        },
        'frame.floating': (base) => (_c) => {
          base(_c);
          const dock = document.querySelector('.ref-float-dock');
          if (dock) _c.footer.appendChild(dock);
        },
        'frame.end': (base) => (_c) => {
          const { headerTools, placement, submit } = _c;
          headerTools.classList.add('ribbon-tools');
          for (const button of document.querySelectorAll('.ref-xtra')) button.classList.add('metro-xtra');
          if (submit) {
            submit.classList.add('submit', 'end-' + (placement === 'header' || placement === 'icon' ? 'ribbon' : placement));
          }
          return base(_c);
        },
      },
    },
  });
})();
