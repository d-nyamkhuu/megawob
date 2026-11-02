(function () {
  'use strict';
  const palette = { bg: '#267744', panel: '#d1d1d1', fg: '#090909', muted: '#333', line: '#777' };
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = _c.util;
      const header = u.el('header', 'ds-top', document.body);
      u.el('span', 'ds-brand', header, '⚑');
      'Desk|File|Edit|View|Document|Tools|Help'.split('|').forEach((t) => u.el('span', 'ds-menuitem', header, t));
      const desktop = u.el('div', 'ds-body', document.body);
      const rail = u.el('aside', 'ds-rail', desktop);
      'Floppy A:|Hard Disk|Trash'.split('|').forEach((t, i) => {
        const d = u.el('div', 'ds-deskitem', rail);
        u.el('span', 'ds-deskicon', d, ['▣', '▱', '▤'][i]);
        u.el('span', '', d, t);
      });
      const content = u.el('div', 'ds-content', desktop);
      Object.assign(_c, { header, content });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.content;
      base(_c);
      _c.header = header;
      const note = _c.content.querySelector('.ref-instruction');
      if (note) note.classList.add('ds-header-note');
    },
    'frame.tools': (base) => (_c) => {
      base(_c);
      _c.headerTools.classList.add('ds-tools');
    },
    'frame.body': () => (_c) => {
      _c.body = _c.util.el('div', 'ds-main', _c.content);
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.body.querySelector('.ref-panel');
      if (panel) panel.classList.add('ds-brief');
    },
    'frame.stage': () => (_c) => {
      const u = _c.util;
      _c.stage = u.el('main', 'ds-stage', _c.body);
      const insp = u.el('aside', 'ds-inspector', _c.body);
      u.el('h2', '', insp, '▤　Document Details');
      [
        ['Title:', 'Harbor Guide / Marina Information'],
        ['Type:', 'Text Document'],
        ['Size:', '24 KB'],
        ['Modified:', '12 Mar 1986  10:24'],
      ].forEach((row) => {
        const r = u.el('div', 'ds-prop', insp);
        u.el('b', '', r, row[0]);
        u.el('span', '', r, row[1]);
      });
      u.el('hr', '', insp);
      u.el('h2', '', insp, '▤　Sections');
      [
        'Mooring Fees',
        'Docking Fees',
        'Storage Fees',
        'Service Charges',
        'Equipment Rental',
        'Visitor Information',
        'General Regulations',
      ].forEach((x, i) => u.el('div', 'ds-secitem', insp, i + 1 + '.　' + x));
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('ds-toast');
        _c.content.insertBefore(note, _c.body);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) {
        foot.classList.add('ds-footer');
        foot.querySelector('.ref-foot-text').textContent = 'Ready';
        _c.content.appendChild(foot);
      }
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.content.appendChild(dock);
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
    name: 'design-find-fact-locate-02',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-find-fact-locate-02': palette },
      LOW_THEME: palette,
      ACCENTS: ['#111'],
      LOW_ACCENTS: ['#111'],
      parts,
    },
  });
})();
