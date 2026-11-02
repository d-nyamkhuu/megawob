(function () {
  'use strict';
  const C = { 'site': 'design-set-date-time-04', 'title': 'Event Planner — Edit Reservation' };
  const B = '#3b78bd',
    G = '#a3afbc';
  const ICONS = {
    doc: `<path d="M9 4h14l8 8v24H9z" fill="#fff" stroke="${B}" stroke-width="2.5" stroke-linejoin="round"/><path d="M23 4v8h8" fill="none" stroke="${B}" stroke-width="2.5"/>`,
    folder: `<path d="M3 9h12l3 4h19v21H3z" fill="${B}"/><path d="M3 15h34v19H3z" fill="#4f8fd6"/>`,
    save: `<path d="M5 5h26l5 5v26H5z" fill="${B}"/><rect x="11" y="5" width="15" height="10" fill="#fff"/><rect x="21" y="7" width="3" height="6" fill="${B}"/><rect x="10" y="22" width="20" height="14" fill="#dbe8f6"/>`,
    undo: `<path d="M14 9L5 17l9 8v-5c8-1 14 1 18 10 0-11-6-18-18-18z" fill="${G}"/>`,
    redo: `<path d="M26 9l9 8-9 8v-5c-8-1-14 1-18 10 0-11 6-18 18-18z" fill="${G}"/>`,
    cal: `<rect x="5" y="7" width="30" height="28" rx="1" fill="#fff" stroke="${B}" stroke-width="2.5"/><rect x="5" y="7" width="30" height="7" fill="${B}"/><path d="M12 3v7M28 3v7" stroke="${B}" stroke-width="3"/>`,
    people: `<circle cx="20" cy="12" r="6" fill="${B}"/><path d="M8 32c0-8 5-12 12-12s12 4 12 12z" fill="${B}"/><circle cx="8" cy="15" r="4.5" fill="#6aa0dc"/><circle cx="32" cy="15" r="4.5" fill="#6aa0dc"/>`,
    notes: `<rect x="7" y="4" width="26" height="32" rx="2" fill="${B}"/><path d="M12 13h15M12 19h14M12 25h10" stroke="#fff" stroke-width="1.5"/><path d="M27 17l8-8 2 2-8 8-3 1z" fill="#fff" stroke="${B}" stroke-width=".7"/>`,
    gear: `<path d="M16 3h8l1 5 4 2 4-2 4 7-4 3v4l4 3-4 7-5-2-3 2-1 5h-8l-1-5-4-2-4 2-4-7 4-3v-4l-4-3 4-7 5 2 3-2z" fill="${B}"/><circle cx="20" cy="20" r="6" fill="#f3f5f7"/>`,
    mail: `<rect x="4" y="8" width="32" height="24" fill="#fff" stroke="#8fb2dc" stroke-width="2.5"/><path d="M4 9l16 13L36 9" fill="none" stroke="#8fb2dc" stroke-width="2.5"/>`,
    print: `<rect x="11" y="4" width="18" height="9" fill="#fff" stroke="${B}" stroke-width="2.5"/><rect x="3" y="12" width="34" height="16" rx="2" fill="${B}"/><rect x="10" y="22" width="20" height="14" fill="#fff" stroke="${B}" stroke-width="2.5"/>`,
  };
  const ITEMS = [
    [86, 'doc', 'New<br>Reservation', 0],
    [197, 'folder', 'Open', 0],
    [298, 'save', 'Save', 0],
    [423, 'undo', 'Undo', 1],
    [528, 'redo', 'Redo', 1],
    [688, 'cal', 'Add<br>Attendees', 0],
    [826, 'people', 'Check<br>Availability', 0],
    [962, 'notes', 'Add Notes', 0],
    [1132, 'gear', 'Preferences', 0],
    [1265, 'mail', 'Email<br>Confirmation', 0],
    [1380, 'print', 'Print', 0],
  ];
  const SEPS = [360, 597, 1047, 1450];
  const GROUPS = [
    [292, 'File'],
    [821, 'Reservation'],
    [1249, 'Actions'],
  ];
  const rem = (px) => px / 10 + 'rem';
  const palette = { bg: '#f5f6f7', panel: '#f5f6f7', fg: '#102747', muted: '#5d6a78', line: '#b7c0ca' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display;
      if (_c.display === 'panel' && _c.ctx.size && _c.ctx.size.width < 720) _c.display = 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const win = u.el('div', 'ds-win', document.body);
      const tb = u.el('header', 'ds-titlebar', win);
      const ti = u.el('span', 'ds-appicon', tb);
      ti.innerHTML = '<svg viewBox="0 0 20 20"><rect width="20" height="20" rx="2" fill="#2f7fd3"/><path d="M5 5l10 10M15 5L5 15" stroke="#fff" stroke-width="2"/></svg>';
      u.el('span', 'ds-wtitle', tb, C.title);
      const wc = u.el('span', 'ds-wctl', tb);
      wc.innerHTML = '<svg viewBox="0 0 20 20"><path d="M3 10h14" stroke="#222" stroke-width="1.5"/></svg><svg viewBox="0 0 20 20"><rect x="3.5" y="3.5" width="13" height="13" fill="none" stroke="#222" stroke-width="1.5"/></svg><svg viewBox="0 0 20 20"><path d="M3 3l14 14M17 3L3 17" stroke="#222" stroke-width="1.5"/></svg>';
      const tabs = u.el('nav', 'ds-tabs', win);
      ['Home', 'Insert', 'View', 'Tools', 'Help'].forEach((t, i) => u.el('span', 'ds-tab' + (i === 0 ? ' on' : ''), tabs, t));
      const rib = u.el('div', 'ds-ribbon', win);
      ITEMS.forEach(([x, ic, lab, dis]) => {
        const it = u.el('div', 'ds-ritem' + (dis ? ' dis' : ''), rib);
        it.style.left = rem(x);
        const s = u.el('span', 'ds-ricon', it);
        s.innerHTML = '<svg viewBox="0 0 40 40">' + ICONS[ic] + '</svg>';
        u.el('span', 'ds-rlabel', it).innerHTML = lab;
      });
      SEPS.forEach((x) => { u.el('i', 'ds-rsep', rib).style.left = rem(x); });
      GROUPS.forEach(([x, t]) => { u.el('span', 'ds-rgroup', rib, t).style.left = rem(x); });
      const content = u.el('div', 'ds-content', win);
      Object.assign(_c, { win, rib, content, header: content });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        const text = note.textContent;
        note.textContent = '';
        note.classList.add('ds-header-note');
        _c.util.el('span', 'ds-alert', note, '!');
        _c.util.el('div', 'ds-instruction', note, text);
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.rib;
      base(_c);
      _c.header = header;
      _c.headerTools.classList.add('ds-ribbon-actions');
    },
    'frame.body': () => (_c) => {
      const main = _c.util.el('div', 'ds-main', _c.content);
      const stage = _c.util.el('main', 'ds-stage', main);
      const rail = _c.util.el('aside', 'ds-rail', main);
      Object.assign(_c, { body: main, stage, rail });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.rail;
      base(_c);
      _c.body = body;
      const panel = _c.rail.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('ds-task-panel');
        panel.querySelector('.ref-panel-title').textContent = 'Task instructions';
      }
      _c.util.el('h2', '', _c.rail, 'Room details');
      _c.util.el('div', 'ds-reservation-values', _c.rail);
    },
    'frame.stage': () => () => {},
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('ds-toast');
        const alert = _c.util.el('span', 'ds-alert', null, '!');
        note.prepend(alert);
        note.querySelector('.ref-note-text').classList.add('ds-instruction');
        _c.content.insertBefore(note, _c.body);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      _c.win.appendChild(foot);
      const status = foot.querySelector('.ref-foot-text');
      status.classList.add('ds-status');
      status.textContent = 'Ready';
      const chk = _c.util.el('label', 'ds-check');
      const box = _c.util.el('span', 'ds-box', chk);
      box.innerHTML = '<svg viewBox="0 0 20 20"><path d="M4 10l4 4 8-9" fill="none" stroke="#fff" stroke-width="2.4"/></svg>';
      _c.util.el('span', '', chk, 'Send me a confirmation email');
      foot.insertBefore(chk, foot.querySelector('.ref-tools'));
      const cancel = _c.util.el('button', 'ds-cancel', foot, 'Cancel');
      cancel.type = 'button';
      Object.assign(_c, { foot, cancel });
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.insertBefore(dock, _c.cancel);
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
    design: {
      THEMES: { site: palette }, LOW_THEME: palette,
      ACCENTS: ['#1684e8'], LOW_ACCENTS: ['#1684e8'], parts,
    },
  });
})();
