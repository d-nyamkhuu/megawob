(function () {
  'use strict';
  const palette = { bg: '#e9dfcb', panel: '#fffaf0', fg: '#211a14', muted: '#756858', line: '#d5c8b2' };
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const top = u.el('header', 'ds-top', document.body);
      u.el('span', 'ds-brand', top, 'Mail Organizer');
      _c.header = top;
    },
    'frame.nav': () => (_c) => {
      const u = _c.util;
      const menu = u.el('nav', 'ds-menu', document.body);
      ['File', 'Edit', 'View', 'Message', 'Tools', 'Help'].forEach((t) => u.el('span', '', menu, t));
      const toolbar = u.el('div', 'ds-toolbar', document.body);
      [
        ['✉', 'New Message'], ['↶', 'Reply'], ['↶', 'Reply All'], ['➜', 'Forward'],
        ['✖', 'Delete'], ['▣', 'Move⌄'], ['◆', 'Label⌄'], ['▤', 'Print'],
      ].forEach(([i, t]) => {
        const b = u.el('div', 'ds-tool', toolbar);
        u.el('b', '', b, i);
        u.el('span', '', b, t);
      });
    },
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('ds-instruction', 'ds-header-note');
    },
    'frame.tools': (base) => (_c) => {
      base(_c);
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const body = u.el('div', 'ds-body', document.body);
      const rail = u.el('aside', 'ds-rail', body);
      [['📥', 'Inbox'], ['▤', 'Sent'], ['📁', 'Drafts'], ['▧', 'Trash'], ['📂', 'Spam']].forEach(([i, t], n) => {
        const x = u.el('div', n === 0 ? 'active' : '', rail);
        u.el('b', '', x, i);
        u.el('span', '', x, t);
      });
      u.el('div', 'ds-folder-label', rail, 'Folders');
      ['Family', 'Work', 'Travel', 'Receipts', 'Archive'].forEach((t) => {
        const x = u.el('div', 'ds-folder', rail);
        u.el('b', '', x, '📁');
        u.el('span', '', x, t);
      });
      const content = u.el('div', 'ds-content', body);
      const main = u.el('div', 'ds-main', content);
      const side = u.el('aside', 'ds-side', body);
      const calendar = u.el('section', 'ds-calendar', side);
      u.el('header', '', calendar, '‹　　 April 2010　　 ›');
      u.el('div', 'ds-week', calendar, 'Sun　 Mon　 Tue　 Wed　 Thu　 Fri　 Sat');
      const days = u.el('div', 'ds-days', calendar);
      ['', '', '', '', '1', '2', '3', '4', '5', '6', '7', '14', '9', '10', '11', '12', '13',
        '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27',
        '28', '29', '30', ''].forEach((d, i) => {
        u.el('span', d === '14' && i === 11 ? 'selected' : '', days, d);
      });
      const tips = u.el('section', 'ds-tips', side);
      u.el('h2', '', tips, '💡　Quick Tips　📌');
      ['Click a message to read it in the preview pane.', 'Use the toolbar to reply, forward or delete.',
        'Organize with folders and labels.'].forEach((t) => u.el('p', '', tips, '•　' + t));
      Object.assign(_c, { body, content, main, side });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.side;
      base(_c);
      _c.body = body;
      const note = _c.side.querySelector('.ref-panel');
      if (note) note.classList.add('ds-instruction', 'ds-panel-note');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.main);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('ds-instruction', 'ds-instruction-toast');
        _c.content.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      const foot = _c.util.el('footer', 'ds-footer', _c.content);
      base(_c);
      const controls = document.body.querySelector('.ref-foot');
      if (controls) foot.appendChild(controls);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
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
    name: 'design-act-in-time-refresh-04',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-act-in-time-refresh-04': palette },
      LOW_THEME: palette,
      ACCENTS: ['#b44b2d'],
      LOW_ACCENTS: ['#b44b2d'],
      parts,
    },
  });
})();
