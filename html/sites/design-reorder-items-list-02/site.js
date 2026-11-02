(function () {
  "use strict";
  const palette = { bg: "#cfd9e6", panel: "#fbfcfd", fg: "#1c2128", muted: "#6c7580", line: "#d9e0e9" };
  const parts = {
    "frame.layout": (base) => (_c) => {
      base(_c);
      let display = _c.ctx.display || "header";
      if ((display === "panel" || display === "toast") && _c.W < 1100) display = "header";
      _c.display = display;
      document.body.classList.toggle("ref-has-note", display === "toast");
      document.body.classList.toggle("has-instruction-toast", _c.ctx.display === "toast");
    },
    "frame.placement": (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    "frame.header": () => (_c) => {
      const { ctx, util: u } = _c;
      const body = document.body;
      body.classList.add("design", "adw");
      document.documentElement.style.setProperty("--font", "Cantarell, Inter, Segoe UI, Helvetica Neue, Arial, sans-serif");
      const shell = u.el("div", "shell", body);
      const art = u.svg('svg', { class: 'adw-art', viewBox: '0 0 1672 941', preserveAspectRatio: 'none', 'aria-hidden': 'true' }, shell);
      const defs = u.svg('defs', {}, art);
      const g = u.svg('linearGradient', { id: 'adw-sky', x1: '0', y1: '0', x2: '0', y2: '1' }, defs);
      u.svg('stop', { offset: '0', 'stop-color': '#cdd8e4' }, g);
      u.svg('stop', { offset: '1', 'stop-color': '#d7dfe8' }, g);
      u.svg('rect', { x: 0, y: 0, width: 1672, height: 941, fill: 'url(#adw-sky)' }, art);
      const hills = u.svg('linearGradient', { id: 'adw-hills', x1: '0', y1: '0', x2: '0.25', y2: '1' }, defs);
      u.svg('stop', { offset: '0', 'stop-color': '#a9b9cf' }, hills);
      u.svg('stop', { offset: '1', 'stop-color': '#d4dfe8' }, hills);
      u.svg('path', { d: 'M0 506C103 510 182 560 289 574S440 608 578 626C837 687 1086 724 1278 636C1320 620 1363 606 1409 605S1589 541 1672 527V941H0Z', fill: 'url(#adw-hills)' }, art);
      const front = u.svg('linearGradient', { id: 'adw-front', x1: '0', y1: '0', x2: '0.2', y2: '1' }, defs);
      u.svg('stop', { offset: '0', 'stop-color': '#9daec6' }, front);
      u.svg('stop', { offset: '1', 'stop-color': '#ccd9e5' }, front);
      u.svg('path', { d: 'M0 640C141 601 224 653 394 696S694 808 914 803C1173 797 1278 763 1393 743S1575 700 1672 706V941H0Z', fill: 'url(#adw-front)' }, art);
      const glow = u.svg('radialGradient', { id: 'adw-glow', cx: '0.28', cy: '0.4', r: '0.8' }, defs);
      u.svg('stop', { offset: '0', 'stop-color': '#fff', 'stop-opacity': '.15' }, glow);
      u.svg('stop', { offset: '1', 'stop-color': '#fff', 'stop-opacity': '0' }, glow);
      u.svg('rect', { x: 0, y: 0, width: 1672, height: 941, fill: 'url(#adw-glow)' }, art);
      const texture = u.svg('filter', { id: 'adw-texture', x: '0', y: '0', width: '100%', height: '100%' }, defs);
      u.svg('feTurbulence', { type: 'fractalNoise', baseFrequency: '.025', numOctaves: '3', seed: '4', stitchTiles: 'stitch' }, texture);
      u.svg('feColorMatrix', { type: 'saturate', values: '0' }, texture);
      u.svg('rect', { x: 0, y: 0, width: 1672, height: 941, filter: 'url(#adw-texture)', opacity: '.085', style: 'mix-blend-mode:soft-light' }, art);
      const bar = u.el('header', 'adw-bar', shell);
      u.el('span', 'adw-act', bar, 'Activities');
      const app = u.el('span', 'adw-app', bar);
      const fi = u.svg('svg', { width: 20, height: 16, viewBox: '0 0 20 16' }, app);
      u.svg('path', { d: 'M1 2Q1 1 2 1H7L9 3H18Q19 3 19 4V14Q19 15 18 15H2Q1 15 1 14Z', fill: '#c6ccd4' }, fi);
      u.el('span', '', app, 'Tasks');
      u.el('span', 'adw-clock', bar, 'Oct 26  10:14');
      const tray = u.el('span', 'adw-tray', bar);
      const ti = u.svg('svg', { width: 90, height: 20, viewBox: '0 0 90 20', fill: '#fff' }, tray);
      u.svg('path', { d: 'M2 7Q10 0 18 7L16.500 8.500Q10 3.500 3.500 8.500ZM5 11Q10 7 15 11L13.500 12.500Q10 10 6.500 12.500ZM10 14.500L12 17L10 19L8 17Z' }, ti);
      u.svg('path', { d: 'M30 8H34L39 4V16L34 12H30Z' }, ti);
      u.svg('path', { d: 'M41 7Q44 10 41 13M43 5Q48 10 43 15', fill: 'none', stroke: '#fff', 'stroke-width': 1.6 }, ti);
      u.svg('rect', { x: 65, y: 4, width: 11, height: 14, rx: 2, fill: 'none', stroke: '#fff', 'stroke-width': 1.6 }, ti);
      u.svg('rect', { x: 68, y: 6, width: 5, height: 10, rx: 0.5 }, ti);
      u.svg('rect', { x: 68, y: 2, width: 5, height: 3, rx: 1 }, ti);
      const dlg = u.el('div', 'adw-dlg', shell);
      const hb = u.el('div', 'adw-hb', dlg);
      const back = u.el('button', 'adw-back', hb);
      back.type = 'button';
      const bi = u.svg('svg', { width: 20, height: 20, viewBox: '0 0 14 14', fill: 'none', stroke: '#2b3037', 'stroke-width': 1.6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, back);
      u.svg('path', { d: 'M9 2L4 7L9 12' }, bi);
      back.onclick = () => env.log('window-control', { label: 'back' });
      const ttl = u.el('div', 'adw-ttl', hb);
      const ic = u.svg('svg', { width: 32, height: 36, viewBox: '0 0 32 36' }, ttl);
      const idefs = u.svg('defs', {}, ic);
      const blue = u.svg('linearGradient', { id: 'adw-icon', x1: '0', y1: '0', x2: '1', y2: '1' }, idefs);
      u.svg('stop', { offset: '0', 'stop-color': '#63b2ff' }, blue);
      u.svg('stop', { offset: '1', 'stop-color': '#2872ee' }, blue);
      u.svg('rect', { x: 2, y: 3, width: 28, height: 32, rx: 5, fill: 'url(#adw-icon)' }, ic);
      u.svg('rect', { x: 10, y: 0, width: 12, height: 6, rx: 2, fill: '#75b4fb' }, ic);
      u.svg('path', { d: 'M9 20L14 25L23 14', fill: 'none', stroke: '#fff', 'stroke-width': 2.4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, ic);
      const tt = u.el('div', 'adw-tt', ttl);
      u.el('b', '', tt, 'Task Practice');
      u.el('small', '', tt, 'Reorder items');
      const wc = u.el('div', 'adw-wc', hb);
      for (const [k, p] of [['min', 'M1 7H13'], ['max', 'M2 2H12V12H2Z'], ['close', 'M2 2L12 12M12 2L2 12']]) {
        const b = u.el('button', '', wc);
        b.type = 'button';
        const s = u.svg('svg', { width: 14, height: 14, viewBox: '0 0 14 14', fill: 'none', stroke: '#1c2128', 'stroke-width': 1.8 }, b);
        u.svg('path', { d: p }, s);
        b.onclick = () => env.log('window-control', { label: k });
      }
      const panel = u.el("section", "adw-panel", dlg);
      Object.assign(_c, { shell, dlg, hb, header: panel, panel });
    },
    "frame.nav": () => () => {},
    "frame.instruction": (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector(".ref-instruction");
      if (note) note.classList.add("instruction");
    },
    "frame.tools": (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.hb;
      base(_c);
      _c.header = header;
      _c.headerTools.classList.add("adw-end-tools");
      const tools = _c.headerTools.getBoundingClientRect();
      const title = _c.hb.querySelector(".adw-ttl").getBoundingClientRect();
      if (tools.width && tools.left < title.right + 8) {
        _c.headerTools.classList.add("adw-compact-tools");
        _c.headerTools.style.maxWidth = `${Math.max(80, title.left - _c.hb.getBoundingClientRect().left - 72)}px`;
      }
    },
    "frame.body": () => (_c) => {
      _c.body = _c.panel;
      _c.noteHost = _c.util.el("div", "adw-note-host", _c.shell);
    },
    "frame.panel": (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.noteHost;
      base(_c);
      _c.body = body;
      const note = _c.noteHost.querySelector(".ref-panel");
      if (note) {
        note.classList.add("task-note");
        note.querySelector(".ref-panel-title").textContent = "Task";
      }
    },
    "frame.stage": () => (_c) => {
      _c.stage = _c.util.el("main", "stage", _c.panel);
      _c.stage.dataset.role = "stage";
    },
    "frame.toast": (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector(".ref-note");
      if (note) {
        note.classList.add("task-note", "instruction-toast");
        const label = _c.util.el("div", "note-label", null, "Task");
        note.insertBefore(label, note.firstChild);
        _c.noteHost.appendChild(note);
      }
    },
    "frame.footer": (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector(".ref-foot");
      foot.classList.add("footer");
      _c.dlg.appendChild(foot);
      const reset = _c.util.el("button", "adw-reset", null, "Reset");
      reset.type = "button";
      reset.onclick = () => env.widgetDef.clear?.();
      foot.insertBefore(reset, foot.firstChild);
      _c.foot = foot;
    },
    "frame.floating": (base) => (_c) => {
      base(_c);
    },
    overlay: () => (ctx) => {
      const u = ctx.util, kind = ctx.kind;
      const el = u.el('section', 'obstruction obstruction-' + kind, document.body);
      el.dataset.role = 'overlay';
      const box = u.el('div', 'obstruction-box', el);
      const title = { cookie: 'Your privacy', toast: 'Changes saved', chat: 'Support', promo: 'Workspace update', banner: 'Service notice' }[kind];
      const text = { cookie: 'This application stores optional cookies.', toast: 'Your changes have been saved.', chat: 'Need a hand with this workspace?', promo: 'Explore the latest workspace features.', banner: 'You are viewing a shared workspace.' }[kind];
      u.el('h3', '', box, title);
      u.el('p', '', box, text);
      const dismiss = u.el('button', 'dismiss', box, kind === 'cookie' ? 'Reject optional' : 'Close');
      dismiss.type = 'button';
      dismiss.onclick = () => ctx.dismiss('close');
      if (kind === 'cookie') {
        const a = u.el('button', 'dismiss', box, 'Accept optional');
        a.onclick = () => ctx.dismiss('accept');
      }
      return { el, dismiss, ttlSteps: kind === 'toast' ? 5 : 0 };
    },
  };
  env.site({
    name: "design-reorder-items-list-02",
    template: "site/base",
    langs: ["en"],
    styles: ["templates/site/css/base-hooks.css", "site.css", "adw.css"],
    design: {
      THEMES: { "design-reorder-items-list-02": palette },
      LOW_THEME: palette,
      ACCENTS: ["#3b82f6"],
      LOW_ACCENTS: ["#3b82f6"],
      parts,
    },
  });
})();
