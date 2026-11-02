// Amiga Workbench frame on site/base; task rendering stays in the widget template.
(function () {
  'use strict';
  const C = { title: 'Pie Menu Trainer', os: 'Amiga Workbench', clock: 'Mon  Apr 16 1990  10:24' };
  const SQ =
    '<svg viewBox="0 0 32 32" shape-rendering="crispEdges"><path d="M4 4h23v24H4z" fill="#999" stroke="#000" stroke-width="2"/><path d="M6 6h19v18H6z" fill="#ddd"/><path d="M8 8h15v4H11v10H8z" fill="#222"/><path d="M10 10h12" stroke="#fff" stroke-width="2"/></svg>';
  const DISK =
    '<svg viewBox="0 0 32 32" shape-rendering="crispEdges"><path d="M3 3h23l4 4v23H3z" fill="#0645b0" stroke="#000" stroke-width="2"/><path d="M6 4h18v14H6z" fill="#ccc"/><path d="M22 4v7h4V4" fill="#333"/><path d="M6 23h20v5H6z" fill="#aaa" stroke="#000"/></svg>';

  function pane(util, parent, cls, title) {
    const el = util.el('section', 'pane ' + cls, parent);
    const head = util.el('div', 'phead', el);
    util.el('span', '', head, title);
    util.el('i', 'pgad', head).innerHTML = SQ;
    return el;
  }

  const parts = {
    // The fixed two-pane layout has room for panel and toast instructions at every viewport.
    'frame.layout': () => function (_c) {
      const W = window.innerWidth;
      const H = window.innerHeight;
      Object.assign(_c, { W, H, roomy: W >= 1260, tall: H >= 700, display: _c.ctx.display || 'header' });
    },
    'frame.header': () => function (_c) {
      const u = _c.util;
      document.body.className = 'ref amiga';
      const shell = u.el('main', 'shell', document.body);
      const bar = u.el('header', 'wbbar', shell);
      const disk = u.el('span', 'wb-disk', bar);
      disk.innerHTML = DISK;
      u.el('span', 'wb-name', bar, C.os);
      u.el('span', 'wb-clock', bar, C.clock);
      const front = u.el('span', 'wb-front', bar);
      front.innerHTML = DISK;

      const win = u.el('div', 'win', shell);
      const tb = u.el('div', 'wintitle', win);
      const g1 = u.el('span', 'gad', tb);
      g1.innerHTML = SQ;
      u.el('span', 'wt', tb, C.title);
      const g2 = u.el('span', 'gad close', tb);
      g2.innerHTML =
        '<svg viewBox="0 0 32 32" shape-rendering="crispEdges"><path d="M4 4l24 24M28 4L4 28" stroke="#000" stroke-width="5"/><path d="M4 4l24 24M28 4L4 28" stroke="#0645b0" stroke-width="3"/></svg>';
      Object.assign(_c, { win, header: tb, close: g2 });
    },
    'frame.nav': () => () => {},
    // Instructions belong in the left Task pane, which is built by frame.body below.
    'frame.instruction': (base) => function (_c) {
      // This section runs before the Task pane exists; render it when frame.panel runs.
      _c.drawHeaderInstruction = () => {
        base({ ..._c, header: _c.tbody });
        const note = _c.tbody.firstElementChild;
        note.classList.add('instruction');
        note.dataset.display = _c.display;
      };
    },
    'frame.tools': (base) => function (_c) {
      base(_c);
      const { header, headerTools, close } = _c;
      headerTools.classList.add('chrome-tools');
      header.insertBefore(headerTools, close);
      for (const button of headerTools.children) button.classList.add('chrome-btn');
    },
    'frame.body': () => function (_c) {
      const { util, win } = _c;
      const rows = util.el('div', 'rows', win);
      const body = util.el('div', 'toprow ref-body', rows);
      const task = pane(util, body, 'task', 'Task');
      const tbody = util.el('div', 'pbody', task);
      Object.assign(_c, { rows, body, tbody });
    },
    'frame.panel': (base) => function (_c) {
      const { display, tbody, util } = _c;
      if (display === 'header') {
        _c.drawHeaderInstruction();
      } else if (display === 'panel') {
        base({ ..._c, body: tbody });
        const note = tbody.firstElementChild;
        note.classList.add('instruction', 'instruction-panel');
        note.dataset.display = display;
        note.firstElementChild.classList.add('note-caption');
      }
      util.el('hr', '', tbody);
      util.el('h4', '', tbody, 'Details');
      util.el('p', '', tbody, 'A pie menu is shown in the workspace. Use its center gadget to expand the sectors.');
      util.el('h4', '', tbody, 'Workbench');
      util.el('p', '', tbody, 'Pie Menu Trainer — command workspace.');
      if (display === 'toast') tbody.classList.add('toast-body');
    },
    'frame.stage': () => function (_c) {
      const ws = pane(_c.util, _c.body, 'work', 'Workspace');
      _c.stage = _c.util.el('div', 'stage', ws);
    },
    'frame.toast': (base) => function (_c) {
      if (_c.display !== 'toast') return;
      base(_c);
      const note = document.querySelector('.ref-note');
      note.classList.add('instruction', 'instruction-toast');
      note.dataset.display = 'toast';
      _c.tbody.appendChild(note);
    },
    'frame.footer': (base) => function (_c) {
      const { util: u, rows, decoyBtn, placement, wantFooter } = _c;
      const act = pane(u, rows, 'actions', 'Actions');
      const strip = u.el('div', 'strip', act);
      const mk = (txt, ico, dis) => {
        decoyBtn(strip, txt);
        const b = strip.lastElementChild;
        b.classList.add('abtn');
        if (dis) b.classList.add('dis');
        b.innerHTML = ico;
        u.el('span', '', b, txt);
        return b;
      };
      mk(
        'Show Menu',
        '<svg viewBox="0 0 32 32" shape-rendering="crispEdges"><circle cx="16" cy="16" r="14" fill="#ddd" stroke="#000" stroke-width="2"/><path d="M16 2a14 14 0 0 1 0 28z" fill="#0645b0" stroke="#000"/><path d="M2 16a14 14 0 0 1 14-14v14z" fill="#777" stroke="#000"/></svg>',
      );
      mk(
        'Clear Selection',
        '<svg viewBox="0 0 32 32" shape-rendering="crispEdges"><path d="M7 3l9 9 9-9 5 5-9 9 9 9-5 5-9-9-9 9-5-5 9-9-9-9z" fill="#777" stroke="#111"/></svg>',
        true,
      );
      mk(
        'Reset',
        '<svg viewBox="0 0 32 32" shape-rendering="crispEdges"><path d="M11 3L2 12l9 7v-6h7c10 0 13 11 3 17l-3-3c8-5 5-10-1-10h-6z" fill="#0645b0" stroke="#000" stroke-width="1.3"/></svg>',
      );
      base(_c);
      if (wantFooter) {
        const foot = document.querySelector('.ref-foot');
        strip.appendChild(foot);
        for (const button of foot.querySelectorAll('.ref-xtra')) {
          _c.headerTools.appendChild(button);
          button.classList.add('chrome-btn');
        }
      }
      if (placement === 'footer') {
        _c.submit.classList.add('abtn', 'submit');
        _c.submit.insertAdjacentHTML('afterbegin', '<svg viewBox="0 0 32 32" shape-rendering="crispEdges"><path d="M2 17l5-5 7 7L27 3l5 5-18 22z" fill="#35b61e" stroke="#000" stroke-width="1.2"/></svg>');
      } else if (placement === 'link') {
        _c.submit.classList.add('end-link');
      }
      _c.strip = strip;
    },
    'frame.floating': (base) => function (_c) {
      base(_c);
      if (_c.placement === 'floating') {
        const dock = _c.submit.parentElement;
        dock.classList.add('end-dock');
        _c.submit.classList.add('abtn', 'submit');
        _c.tbody.parentElement.appendChild(dock);
      }
    },
    overlay: () => function (ctx) {
      const el = ctx.util.el('section', 'perturb ' + ctx.kind, document.body);
      ctx.util.el(
        'strong',
        '',
        el,
        {
          cookie: 'Cookie preferences',
          toast: 'Notification',
          chat: 'Support',
          promo: 'A special offer',
          banner: 'Service notice',
        }[ctx.kind],
      );
      ctx.util.el(
        'p',
        '',
        el,
        {
          cookie: 'Choose your preferences to continue.',
          toast: 'Your workspace is ready.',
          chat: 'How can we help?',
          promo: 'Explore the latest tools.',
          banner: 'A new update is available.',
        }[ctx.kind],
      );
      const dismiss = ctx.util.el('button', 'dismiss', el, ctx.kind === 'cookie' ? 'Accept' : 'Close');
      dismiss.type = 'button';
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  };

  env.site({
    name: 'design-click-control-pie-08',
    template: 'site/base',
    langs: ['en'],
    design: { parts },
  });
})();
