(function () {
  'use strict';
  const C = {
    site: 'design-choose-option-dropdown-07', brand: 'Task Manager', title: 'Task Details',
    menu: 'File|Edit|Task|Window|Help', notes: 'Review latest figures\nbefore assigning.',
    updated: 'Last updated:   Apr 23, 1999   10:14 AM',
  };
  const PIN = '<svg viewBox="0 0 90 96" width="100%" height="100%"><defs><linearGradient id="paper" x2="0" y2="1"><stop stop-color="#ffffdf"/><stop offset="1" stop-color="#e7e2b4"/></linearGradient><radialGradient id="pin"><stop stop-color="#fff"/><stop offset=".25" stop-color="#ff6b51"/><stop offset=".6" stop-color="#f00"/><stop offset="1" stop-color="#9b0000"/></radialGradient></defs><g transform="rotate(-9 45 48)" stroke="#161616" stroke-width="2.4" stroke-linejoin="round"><path d="M9 18h68v75H9z" fill="#aaa783" opacity=".35" transform="translate(3 3)"/><path d="M6 16h68v74H6z" fill="#e8e4bf"/><path d="M12 10h67v65l6 10H12z" fill="url(#paper)"/><g stroke="#8a886b" stroke-width="1.8"><path d="M22 28h41M22 37h44M22 46h43M22 55h43M22 64h36M22 73h24"/></g></g><path d="M61 22L45 38" stroke="#171717" stroke-width="3"/><ellipse cx="59" cy="22" rx="9" ry="10" fill="url(#pin)" stroke="#111" stroke-width="2.3"/><path d="M61 17l8-11 7 7-10 11" fill="#e60000" stroke="#111" stroke-width="2"/><ellipse cx="70" cy="11" rx="8" ry="8" fill="url(#pin)" stroke="#111" stroke-width="2.3"/><path d="M67 6q-3 3-1 5M55 18q-2 3 0 5" stroke="white" stroke-width="2" fill="none"/></svg>';
  const palette = { bg: '#d4d4d4', panel: '#d4d4d4', fg: '#111111', muted: '#555555', line: '#8a8a8a' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // Preserve the original frame's breakpoint for its dedicated note locations.
      _c.display = _c.ctx.display || 'header';
      if ((_c.display === 'panel' || _c.display === 'toast') && _c.W < 1180) _c.display = 'header';
      document.body.classList.toggle('ref-has-note', _c.display === 'toast');
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
      const tab = u.el('div', 'bt-tab', document.body);
      u.el('span', 'bt-tabicon', tab).innerHTML = PIN;
      u.el('span', '', tab, C.brand);
      u.el('i', 'bt-tabx', tab, 'x');
      const logo = u.el('div', 'bt-logo', document.body);
      logo.append('Be');
      u.el('span', '', logo, 'O');
      logo.append('S');
      const win = u.el('div', 'bt-win', document.body);
      const menu = u.el('nav', 'ds-menu', win);
      C.menu.split('|').forEach((t) => u.el('span', '', menu, t));
      const wb = u.el('div', 'bt-wbtns', menu);
      ['min', 'max', 'close'].forEach((t) => u.el('b', 'bt-window-' + t, wb));
      const body = u.el('div', 'ds-body', win);
      const left = u.el('div', 'bt-left', body);
      Object.assign(_c, { win, menu, body, left, header: left });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('ds-header-note');
        note.dataset.display = 'header';
        const text = _c.util.el('div', 'ds-instruction', null, note.textContent);
        note.textContent = '';
        _c.util.el('span', 'bt-pin', note).innerHTML = PIN;
        note.appendChild(text);
      }
      const spacer = _c.header.querySelector('.ref-spacer');
      if (spacer) spacer.remove();
    },
    'frame.tools': (base) => (_c) => {
      const h = _c.header;
      _c.header = _c.menu;
      base(_c);
      _c.header = h;
      _c.headerTools.classList.add('bt-episode-tools');
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const det = u.el('section', 'bt-details', _c.left);
      u.el('h2', 'bt-tablabel', det, C.title);
      const right = u.el('aside', 'bt-right' + (_c.display === 'panel' ? ' bt-right-panel' : ''), _c.body);
      Object.assign(_c, { det, right });
    },
    'frame.panel': (base) => (_c) => {
      const u = _c.util;
      if (_c.display === 'panel') u.el('h3', '', _c.right, 'Task Instructions');
      const body = _c.body;
      _c.body = _c.right;
      base(_c);
      _c.body = body;
      u.el('h3', _c.display === 'panel' ? 'bt-notes-heading' : '', _c.right, 'Task Notes');
      const nb = u.el('div', 'bt-notes', _c.right, C.notes);
      u.el('i', 'bt-sb up', nb);
      u.el('i', 'bt-sb dn', nb);
      u.el('div', 'bt-upd', _c.right, C.updated);
    },
    'frame.stage': () => (_c) => {
      const u = _c.util;
      const stage = u.el('main', 'ds-stage', _c.det);
      function st(cls, txt, pos) {
        const e = u.el('div', 'bt-s ' + cls, stage, txt);
        Object.keys(pos).forEach((k) => (e.style[k] = 'calc(var(--u)*' + pos[k] + ')'));
        return e;
      }
      st('bt-lbl', 'Title:', { left: 26, top: 70 });
      st('bt-inp', 'Prepare quarterly report', { left: 167, top: 65, width: 544, height: 44 });
      st('bt-lbl', 'Description:', { left: 26, top: 134 });
      const ta = st('bt-inp bt-ta', 'Gather revenue data, update charts, and prepare for review meeting.', { left: 167, top: 131, width: 568, height: 155 });
      u.el('i', 'bt-sb up', ta);
      u.el('i', 'bt-sb dn', ta);
      st('bt-lbl', 'Priority:', { left: 771, top: 140 });
      st('bt-lbl', 'Due Date:', { left: 771, top: 208 });
      st('bt-lbl', 'Status:', { left: 771, top: 298 });
      const sel = st('bt-inp bt-sel', 'Not Started', { left: 899, top: 294, width: 244, height: 38 });
      u.el('i', 'bt-chev', sel);
      st('bt-lbl', 'Attachments:', { left: 26, top: 316 });
      const al = st('bt-inp bt-att', '', { left: 26, top: 354, width: 530, height: 148 });
      [['revenue-plan.pdf', 'pdf'], ['chart-draft.xlsx', 'xls']].forEach((a) => {
        const r = u.el('div', 'bt-file', al);
        u.el('i', 'bt-fi ' + a[1], r);
        u.el('span', '', r, a[0]);
      });
      ['Add...', 'Remove', 'Open'].forEach((t, i) => st('bt-btn', t, { left: 581, top: 354 + i * 53, width: 148, height: 40 }));
      st('bt-rule', '', { left: 26, top: 536, right: 22 });
      _c.stage = stage;
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        note.classList.add('ds-toast');
        note.dataset.display = 'toast';
        note.querySelector('.ref-note-text').classList.add('ds-instruction');
        _c.left.insertBefore(note, _c.det);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      _c.det.appendChild(foot);
      const cancel = _c.util.el('button', 'ds-motif-action', foot, 'Cancel');
      cancel.type = 'button';
      foot.querySelector('.ref-foot-text').remove();
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.det.appendChild(dock);
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
    name: C.site,
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: { THEMES: { site: palette }, LOW_THEME: palette, ACCENTS: ['#0a3fb5'], LOW_ACCENTS: ['#0a3fb5'], parts },
  });
})();
