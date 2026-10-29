(function () {
  'use strict';
  const C = {
    'site': 'design-fill-form-card-12',
    'brand': 'Contact Manager',
    'title': 'Add Contact',
    'instruction': 'left',
    'rail': '',
    'menu': '',
    'briefTitle': 'Instructions',
  };
  env.site({
    name: C.site,
    styles: ['site.css', 'site2.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util;
      const top = u.el('header', 'ds-top', document.body);
      u.el('span', 'ds-brand', top, C.brand);
      u.el('span', 'ds-wc', top, '—    ▢    ✕');
      if (C.menu) {
        const nav = u.el('nav', 'ds-menu', document.body);
        C.menu.split('|').forEach((t) => u.el('span', '', nav, t));
      }
      const ribbon = u.el('div', 'ds-ribbon', document.body);
      const paths = {
        person: 'M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10M3 24c0-12 18-12 18 0M22 8v10M17 13h10',
        edit: 'M5 2h14v22H5zM10 17l10-10 4 4-10 10-5 1z',
        delete: 'M5 4l17 18M22 4L5 22',
        import: 'M5 1h13l5 5v19H5zM14 7v12m-5-5 5 5 5-5',
        export: 'M5 1h13l5 5v19H5zM14 19V7m-5 5 5-5 5 5',
        group:
          'M7 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8M19 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8M0 25c0-13 14-13 14 0M14 25c0-13 14-13 14 0',
        grid: 'M2 2h10v10H2zM16 2h10v10H16zM2 16h10v10H2zM16 16h10v10H16z',
        gear: 'M14 6v-5M14 27v-5M6 14H1M27 14h-5M8 8 4 4M24 24l-4-4M8 20l-4 4M24 4l-4 4M14 6a8 8 0 1 0 0 16 8 8 0 0 0 0-16',
        help: 'M14 2a12 12 0 1 0 0 24 12 12 0 0 0 0-24M10 9c1-7 12-3 6 2l-2 2v3M14 21v-1',
      };
      [
        ['New Contact', 'person'],
        ['Edit', 'edit'],
        ['Delete', 'delete'],
        ['Import', 'import'],
        ['Export', 'export'],
        ['Address Book', 'group'],
        ['Categories', 'grid'],
        ['Options', 'gear'],
        ['Help', 'help'],
      ].forEach(([label, key]) => {
        const b = u.el('button', 'ds-ribbon-item', ribbon);
        b.type = 'button';
        b.innerHTML =
          '<svg viewBox="-2 -2 32 32" width="38" height="38"><path d="' +
          paths[key] +
          '" fill="' +
          (key === 'grid' ? '#efbf3e' : '#9fc5e5') +
          '" stroke="' +
          (key === 'delete' ? '#bd514d' : '#4f7598') +
          '" stroke-width="2" stroke-linejoin="round"/></svg>';
        u.el('span', '', b, label);
      });
      const items = [...ribbon.children];
      [
        ['Manage', 3],
        ['Data', 2],
        ['Organize', 2],
        ['Support', 2],
      ].forEach(([label, n]) => {
        const g = u.el('div', 'ds-ribbon-group', ribbon);
        for (let i = 0; i < n; i++) g.append(items.shift());
        u.el('span', 'ds-ribbon-caption', g, label);
      });
      const status = u.el('div', 'ds-statusbar', document.body);
      u.el('span', '', status, 'Ready');
      u.el('span', '', status, '▤  ▦   100%   − ━━━━━━━ +');
      const body = u.el('div', 'ds-body', document.body);
      if (C.rail) {
        const rail = u.el('aside', 'ds-rail', body);
        C.rail.split('|').forEach((t) => u.el('div', '', rail, t));
      }
      const content = u.el('div', 'ds-content', body);
      const natural = C.instruction;
      const mode = ctx.display || natural;
      function briefing(parent, cls) {
        const b = u.el('aside', cls, parent);
        if (cls === 'ds-brief') u.el('h2', '', b, 'Task');
        u.el('div', 'ds-instruction', b, ctx.instruction);
        return b;
      }
      if (mode === 'header') briefing(content, 'ds-header-note');
      const main = u.el('div', 'ds-main', content);
      if (mode === 'panel') {
        const b = briefing(main, 'ds-brief');
      }
      const stage = u.el('main', 'ds-stage', main);
      const tools = u.el('div', 'ds-tools', main);
      [
        '<path d="M6 3l0 22 6-6 4 8 4-2-4-8 8 0z"/>',
        '<rect x="5" y="5" width="18" height="18" stroke-dasharray="3 3"/>',
        '<circle cx="14" cy="14" r="8"/><path d="M14 2v24M2 14h24"/>',
        '<path d="M5 23L23 5"/>',
        '<rect x="5" y="5" width="18" height="18"/>',
        '<path d="M6 5h16M14 5v20"/>',
        '<rect x="3" y="10" width="22" height="8"/><path d="M8 10v4M13 10v4M18 10v4"/>',
      ].forEach((p, i) => {
        const t = u.el('div', 'ds-tool' + (i === 0 ? ' on' : ''), tools);
        t.innerHTML =
          '<svg viewBox="0 0 28 28" width="28" height="28" fill="none" stroke="#bfe6f5" stroke-width="2">' +
          p +
          '</svg>';
      });
      u.el('div', 'ds-readout', stage.parentNode, 'X: 412.6  Y: 93.4\nSCALE 1:1\nGRID  10');
      if (mode === 'toast') {
        const note = briefing(content, 'ds-toast');
        content.insertBefore(note, main);
      }
      const foot = u.el('footer', 'ds-footer', content);
      u.el('span', '', foot, 'Ready');
      let submit = null;
      const END = (ctx.content && ctx.content.END_LABELS) || [
        'Submit',
        'Done',
        'Finish',
        'Continue',
        'Save',
        'OK',
        'Confirm',
        'Apply',
        'Complete',
      ];
      const er = ctx.rng.fork('chrome/end');
      const placement = ctx.finish ? null : er.pick(['form', 'form', 'form', 'toolbar', 'link']);
      const label = ctx.finish
        ? null
        : er.bool(0.5)
          ? 'Submit'
          : er.pick(END.filter((x) => (typeof x === 'string' ? x : x.label) !== 'Submit'));
      const cr = ctx.rng.fork('chrome/collide');
      const collide = cr.bool(0.3)
        ? cr.pick(
            END.map((x) => (typeof x === 'string' ? x : x.label)).filter(
              (x) => x.toLowerCase() !== String(label).toLowerCase(),
            ),
          )
        : null;
      const decoy = (parent, text, collision) => {
        const b = u.el('button', collision ? 'ds-pq' : 'ds-xtra', parent, text);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () =>
          env.log('decoy', collision ? { label: text, collide: true } : { label: text }),
        );
        return b;
      };
      if (!ctx.finish && placement === 'toolbar') {
        submit = u.el('button', 'ds-submit ds-toolbar-end', tools, label);
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.addEventListener('click', () => ctx.submit());
      }
      if (collide) decoy(tools, collide, true);
      if (!ctx.finish && placement === 'form') {
        submit = u.el('button', 'ds-submit', foot, label);
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.addEventListener('click', () => ctx.submit());
      }
      if (!ctx.finish && placement === 'link') {
        submit = u.el('a', 'ds-endlink', foot, label + ' ›');
        submit.href = '#';
        submit.dataset.role = 'submit';
        submit.setAttribute('aria-label', label);
        submit.title = label;
        submit.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
      }
      const cancel = u.el('button', 'ds-cancel', foot, 'Cancel');
      cancel.type = 'button';
      return { stage, submit };
    },
    overlay(ctx) {
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
      texts.banner =
        'You have unsaved layout changes. Continuing will discard your layout changes, but keep your data.';
      const tb = u.el('div', 'ds-dtitle', el);
      u.el('span', 'ds-warn', tb).innerHTML =
        '<svg viewBox="0 0 36 36" width="36" height="36"><path d="M18 3L34 32H2Z" fill="#ffdc29" stroke="#213f50" stroke-width="1.5"/><path d="M18 11v11" stroke="#213f50" stroke-width="3"/><circle cx="18" cy="27" r="1.7" fill="#213f50"/></svg>';
      u.el('span', '', tb, 'Unsaved layout changes');
      u.el('span', 'ds-dx', tb, '✕');
      const bd = u.el('div', 'ds-dbody', el);
      u.el('div', '', bd, texts[ctx.kind]);
      const row = u.el('div', 'ds-drow', bd);
      const dismiss = u.el(
        'button',
        'ds-dok',
        row,
        ctx.kind === 'cookie' ? 'Accept all' : ctx.kind === 'banner' ? 'Continue without saving' : 'Close',
      );
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      const cn = u.el('button', '', row, 'Cancel');
      cn.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  });
})();
