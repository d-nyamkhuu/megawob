(function () {
  'use strict';
  const palette = { bg: '#aaa', panel: '#aaa', fg: '#000', muted: '#555', line: '#ddd' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // Both panes exist at every viewport, including the compact layouts.
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
      document.body.classList.add('amiga');
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'amiga-head', shell);
      const ico = u.el('span', 'a-ico', head);
      ico.innerHTML =
        '<svg viewBox="0 0 28 28"><path fill="#171717" d="M2 2h24v24H2z"/><path fill="#9d9077" d="M9 7h9v3h3v9h-4v4H7v-7H5v-5h4z"/><path fill="#242424" d="M11 5h7v6h-4v4H8v-4h3z"/><path fill="#d5c9ac" d="M14 12h5v5h-3v3h-5v-3h3z"/></svg>';
      u.el('span', 'a-title-l', head, 'Amiga Workbench');
      u.el('span', 'a-title-c', head, 'Task Window');
      const gad = u.el('span', 'a-gads', head);
      u.el('i', '', gad);
      u.el('i', '', gad);
      const work = u.el('div', 'a-work', shell);
      const left = u.el('section', 'a-pane a-left', work);
      const lt = u.el('div', 'a-bar', left);
      u.el('b', 'a-g', lt);
      u.el('span', '', lt, 'Instructions');
      u.el('b', 'a-g r', lt);
      const lb = u.el('div', 'a-body', left);
      const row = u.el('div', 'a-instr-row', lb);
      const doc = u.el('span', 'a-doc', row);
      doc.innerHTML =
        '<svg viewBox="0 0 88 110"><path d="M3 3h66l16 16v88H3z" fill="#bbb" stroke="#001e69" stroke-width="4"/><path d="M7 7h59v17h15v78H7z" fill="#ccc" stroke="#fff" stroke-width="2"/><path d="M68 4v17h16" fill="#aaa" stroke="#001e69" stroke-width="3"/><path d="M18 24h42M18 39h54M18 54h54M18 69h54M18 84h54" stroke="#111" stroke-width="4"/></svg>';
      row.hidden = _c.display === 'hidden';
      const subhint = u.el('p', 'a-sub', lb, 'When you are ready, continue.');
      subhint.hidden = _c.display === 'hidden';
      const right = u.el('section', 'a-pane a-right', work);
      const rt = u.el('div', 'a-bar', right);
      u.el('b', 'a-g', rt);
      u.el('span', '', rt, 'Your Response');
      const barTools = u.el('span', 'a-tools', rt);
      u.el('b', 'a-g r', rt);
      const rb = u.el('div', 'a-body', right);
      const frame = u.el('div', 'a-frame', rb);
      const pointer = u.el('span', 'a-pointer', frame);
      pointer.setAttribute('aria-hidden', 'true');
      pointer.innerHTML =
        '<svg viewBox="0 0 42 68"><path d="M3 3v49l10-10 11 22 9-5-11-22h16z" fill="white" stroke="black" stroke-width="3" stroke-linejoin="miter"/></svg>';
      const sub = u.el('div', 'a-submit-wrap', frame);
      u.el('p', 'a-ready', sub, _c.ctx.finish ? 'Ready to finish?' : 'Ready to continue?');
      Object.assign(_c, { shell, work, row, lb, frame, sub, barTools, header: sub });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.row;
      base(_c);
      _c.header = header;
      const note = _c.row.querySelector('.ref-instruction');
      if (note) note.classList.add('instruction');
    },
    'frame.tools': (base) => (_c) => {
      base(_c);
      for (const button of _c.headerTools.querySelectorAll('.ref-xtra')) _c.barTools.appendChild(button);
      if (_c.placement === 'icon') _c.barTools.appendChild(_c.submit);
    },
    'frame.body': () => (_c) => { _c.body = _c.work; },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.row;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('div', 'stage', _c.frame);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.lb.appendChild(note);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('a-foot');
      _c.shell.appendChild(foot);
      const text = foot.querySelector('.ref-foot-text');
      text.remove();
      const ready = _c.util.el('button', 'reset-task a-ready-box', foot, 'Ready');
      ready.type = 'button';
      foot.prepend(ready);
      _c.util.el('span', 'a-clock', foot, 'Mon  Apr 16  1990  10:24');
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.sub.appendChild(dock);
    },
    overlay: () => (ctx) => {
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
    name: 'design-click-control-button-05',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css', 'amiga.css'],
    design: {
      THEMES: { 'design-click-control-button-05': palette },
      LOW_THEME: palette,
      ACCENTS: ['#003393'],
      LOW_ACCENTS: ['#003393'],
      parts,
    },
  });
})();
