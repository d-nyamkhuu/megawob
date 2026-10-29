(function () {
  'use strict';
  const C = { site: 'design-solve-puzzle-hot-cold-10', title: 'Treasure Finder' };
  env.site({
    name: C.site,
    styles: ['site.css'],
    frame(ctx) {
      document.body.className = 'motif-workstation instruction-' + ctx.display;
      const u = ctx.util,
        app = u.el('main', 'mw-app', document.body),
        desktop = u.el('header', 'mw-desktop', app);
      const icon = u.el('span', 'mw-app-icon', desktop);
      icon.setAttribute('aria-hidden', 'true');
      u.el('span', 'mw-app-name', desktop, C.title);
      if (ctx.display === 'header') u.el('div', 'mw-header-instruction', desktop, ctx.instruction);
      u.el('span', 'mw-clock', desktop, 'Mon Apr 15 1991   10:24 AM');
      const work = u.el('div', 'mw-work', app),
        brief = u.el('aside', 'mw-brief', work);
      u.el('div', 'mw-brief-title', brief, 'Task Briefing');
      if (ctx.display === 'panel') u.el('div', 'mw-instruction', brief, ctx.instruction);
      if (ctx.display === 'toast') u.el('div', 'mw-toast-instruction', brief, ctx.instruction);
      const section = (title, copy) => {
        u.el('b', 'mw-section-title', brief, title);
        u.el('p', 'mw-copy', brief, copy);
      };
      section(
        'Goal',
        'Explore the interface on the right. Click different elements to search for the hidden hot spot.',
      );
      section(
        'Feedback',
        'After each click, you’ll get a hint (HOT or COLD). A previous click is shown on the right with its result.',
      );
      section(
        'Controls',
        'Use the mouse to click. You can also use the keyboard (Tab to move focus, Enter to activate buttons).',
      );
      const win = u.el('section', 'mw-window', work);
      const title = u.el('div', 'mw-window-title', win);
      u.el('span', 'mw-window-icon', title, '▰');
      u.el('span', '', title, 'File Explorer - /usr/local/documents');
      const controls = u.el('span', 'mw-window-controls', title);
      for (const kind of ['_', '□', '×']) u.el('i', '', controls, kind);
      const menu = u.el('nav', 'mw-menu', win);
      for (const item of ['File', 'Edit', 'View', 'Go', 'Bookmarks']) u.el('span', '', menu, item);
      u.el('span', 'mw-help', menu, 'Help');
      const tear = u.el('div', 'mw-tearoff', win);
      for (const item of ['Large Icons', 'Small Icons', 'List', 'Tear Off'])
        u.el('div', item === 'Tear Off' ? 'tear-item' : '', tear, item);
      const toolbar = u.el('div', 'mw-toolbar', win);
      for (const [ico, label] of [
        ['⬅', 'Back'],
        ['➡', 'Forward'],
        ['⌂', 'Home'],
        ['⬆', 'Up'],
        ['⟳', 'Reload'],
        ['⬢', 'Stop'],
      ]) {
        const b = u.el('div', 'mw-tool', toolbar);
        u.el('span', 'mw-tool-icon', b, ico);
        u.el('span', '', b, label);
      }
      const loc = u.el('div', 'mw-location', win);
      u.el('label', '', loc, 'Location:');
      u.el('div', 'mw-location-field', loc, '/usr/local/documents');
      u.el('span', 'mw-drop', loc, '▾');
      const body = u.el('div', 'mw-browser', win);
      const tree = u.el('div', 'mw-tree', body);
      const rows = [
        ['⊟', '/', 'root'],
        ['⊟', 'usr', 'indent'],
        ['', 'bin', 'deep'],
        ['', 'lib', 'deep'],
        ['⊟', 'local', 'deep'],
        ['', 'documents', 'selected'],
        ['', 'images', 'deep'],
        ['', 'tools', 'deep'],
        ['⊞', 'etc', 'indent'],
        ['⊞', 'var', 'indent'],
      ];
      rows.forEach(([sign, name, cls]) => {
        const row = u.el('div', 'mw-tree-row ' + cls, tree);
        u.el('span', 'mw-expander', row, sign);
        u.el('span', 'mw-folder', row, '');
        u.el('span', 'mw-folder-name', row, name);
      });
      const files = u.el('section', 'mw-files', body);
      const heads = u.el('div', 'mw-file-head', files);
      for (const label of ['Name', 'Size', 'Modified']) u.el('span', '', heads, label);
      const stage = u.el('div', 'stage mw-stage', files);
      const footer = u.el('footer', 'mw-footer', win);
      u.el('span', 'mw-count', footer, '0 items');
      u.el('button', 'mw-open', footer, 'Open');
      u.el('button', 'mw-properties', footer, 'Properties');
      let submit = null;
      if (!ctx.finish) {
        const er = ctx.rng.fork('chrome/end'),
          labels = (ctx.content && ctx.content.END_LABELS) || [
            'Submit',
            'Done',
            'Finish',
            'Continue',
            'Save',
            'OK',
            'Confirm',
            'Apply',
            '✓',
          ];
        const value = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
        const label = er.bool(0.5) ? 'Submit' : value(er.pick(labels));
        const placement = er.pick(['footer', 'footer', 'toolbar', 'link']);
        const button = (parent, cls, text, link) => {
          const b = u.el(link ? 'a' : 'button', cls, parent, text);
          if (link) {
            b.href = '#';
            b.addEventListener('click', (e) => e.preventDefault());
          } else b.type = 'button';
          b.setAttribute('aria-label', label);
          b.title = label;
          b.addEventListener('click', ctx.submit);
          return b;
        };
        if (placement === 'footer') submit = button(footer, 'submit mw-submit', label, false);
        else if (placement === 'link') submit = button(footer, 'mw-end-link', label + ' ›', true);
        else submit = button(toolbar, 'mw-toolbar-submit', label, false);
        const cr = ctx.rng.fork('chrome/collide');
        if (cr.bool(0.3)) {
          const pool = labels.map(value).filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
          if (pool.length) {
            const text = value(cr.pick(pool)),
              decoy = u.el('button', 'mw-end-xtra', toolbar, text);
            decoy.type = 'button';
            decoy.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
          }
        }
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        el = u.el('div', 'overlay ' + ctx.kind, document.body);
      const messages = {
        cookie: 'This application stores preferences on your device.',
        toast: 'Your workspace has been synced.',
        chat: 'Need help with this exercise?',
        promo: 'Try the new practice collection.',
        banner: 'An updated practice collection is available.',
      };
      u.el('span', '', el, messages[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept' : 'Dismiss');
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  });
})();
