(function () {
  'use strict';
  const palette = { bg: '#eaf2f9', panel: '#fff', fg: '#102751', muted: '#385273', line: '#b7cde0' };
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const nav = u.el('nav', 'ds-menu', document.body);
      'Data Entry|Documents|Batches|Reports|Administration'.split('|').forEach((t, i) => {
        u.el('span', i ? '' : 'active', nav, t);
      });
      const body = u.el('div', 'ds-body', document.body);
      const rail = u.el('aside', 'ds-rail', body);
      const box = (title, rows) => {
        const p = u.el('section', 'ds-summary', rail);
        u.el('h2', '', p, title);
        rows.forEach(([k, v]) => {
          const row = u.el('div', 'ds-summary-row', p);
          u.el('span', '', row, k);
          u.el('b', '', row, v);
        });
      };
      box('Batch Status', [
        ['Total Documents', '24'],
        ['Completed', '18'],
        ['Remaining', '6'],
      ]);
      box('Current Document', [['Document 19 of 24', '']]);
      const area = u.el('div', 'ds-content', body);
      Object.assign(_c, { body, rail, area, header: area });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('ds-header-note');
    },
    'frame.tools': (base) => (_c) => {
      base(_c);
      _c.headerTools.classList.add('ds-toolbar');
    },
    'frame.body': () => () => {},
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.rail;
      base(_c);
      _c.body = body;
      const panel = _c.rail.querySelector('.ref-panel');
      if (panel) panel.classList.add('ds-brief');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.area);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('ds-toast');
        _c.area.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      _c.area.appendChild(foot);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
      // Reserve clearance before the widget measures its stage. The old floating
      // chrome could cover the first row of the document at some viewports.
      const tools = _c.headerTools;
      const notes = [..._c.area.querySelectorAll('.ref-instruction, .ref-note')];
      const across = (a, b) => a.left < b.right && a.right > b.left;
      const toolRect = tools.getBoundingClientRect();
      for (const note of notes) {
        const r = note.getBoundingClientRect();
        if (tools.children.length && across(r, toolRect) && r.top < toolRect.bottom && r.bottom > toolRect.top) {
          note.style.translate = `0 ${toolRect.bottom + 8 - r.top}px`;
        }
      }
      const stage = _c.stage;
      const r = stage.getBoundingClientRect();
      let top = r.top;
      for (const el of [...notes, ...(tools.children.length ? [tools] : [])]) {
        const box = el.getBoundingClientRect();
        if (across(r, box) && box.top < r.bottom && box.bottom > r.top) top = Math.max(top, box.bottom + 8);
      }
      const foot = _c.foot.getBoundingClientRect();
      const bottom = across(r, foot) && foot.top < r.bottom ? Math.min(r.bottom, foot.top - 8) : r.bottom;
      const above = top - r.top;
      const below = r.bottom - bottom;
      if (above || below) {
        stage.style.marginTop = `${above}px`;
        stage.style.marginBottom = `${below}px`;
        stage.style.height = `${Math.max(1, r.height - above - below)}px`;
      }
    },
    overlay: () => (ctx) => {
      const u = ctx.util;
      const el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      u.el(
        'div',
        '',
        el,
        {
          cookie: 'We use cookies to remember your preferences.',
          toast: 'Changes synced.',
          chat: 'Hello. How can we help?',
          promo: 'Try our new workspace.',
          banner: 'Scheduled maintenance tonight.',
        }[ctx.kind],
      );
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  };
  env.site({
    name: 'design-fill-form-fix-04',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-fill-form-fix-04': palette },
      LOW_THEME: palette,
      ACCENTS: ['#2c659f'],
      LOW_ACCENTS: ['#2c659f'],
      parts,
    },
  });
})();
