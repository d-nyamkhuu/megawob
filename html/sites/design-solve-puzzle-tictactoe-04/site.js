(function () {
  'use strict';
  const C = {
    site: 'design-solve-puzzle-tictactoe-04',
    task: 'solve-puzzle',
    scenario: 'tictactoe',
    style: 'openlook',
    title: 'Tic-Tac-Toe',
    menu: 'Game    Options    Help',
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    frame(ctx) {
      let display = ctx.display || 'panel';
      if ((display === 'panel' || display === 'toast') && (window.innerWidth < 1180 || window.innerHeight < 700))
        display = 'header';
      document.body.className = 'openlook instruction-' + display;
      const u = ctx.util,
        app = u.el('main', 'app', document.body),
        bar = u.el('header', 'desktopbar', app);
      u.el('span', 'workbench-mark', bar, '◈');
      u.el('strong', 'workbench-name', bar, 'Workbench');
      u.el('nav', 'desktop-menu', bar, 'File　 Edit　 View　 Options　 Help');
      u.el('span', 'desktop-clock', bar, 'Mon Apr 6 1992　10:24 AM');
      const icons = u.el('div', 'desktop-icons', app);
      [
        ['▣', 'Workspace'],
        ['▱', 'Documents'],
        ['▤', 'Trash'],
      ].forEach(([glyph, label]) => {
        const item = u.el('div', 'desktop-icon', icons);
        u.el('span', 'desktop-glyph', item, glyph);
        u.el('span', '', item, label);
      });
      const win = u.el('section', 'workspace-dialog', app),
        top = u.el('header', 'top', win);
      u.el('span', 'app-diamond', top, '◆');
      u.el('strong', 'window-title', top, C.title);
      u.el('button', 'window-minimize', top, '▬');
      const menu = u.el('nav', 'menu', win);
      u.el('span', 'pin-gadget', menu, '◆');
      u.el('span', 'window-menu-items', menu, C.menu);
      const center = u.el('div', 'center', win),
        stage = u.el('section', 'stage', center);
      let aside = null;
      if (display === 'panel') {
        aside = u.el('aside', 'aside', app);
        u.el('span', 'note-pin', aside, '◆');
        u.el('p', 'aside-copy', aside, ctx.instruction);
      }
      if (display === 'header' || display === 'toast') {
        const note = u.el('aside', display === 'header' ? 'episode-note header-note' : 'episode-note toast-note', app);
        u.el('span', 'note-pin', note, '◆');
        u.el('p', 'aside-copy', note, ctx.instruction);
      }
      const footer = u.el('footer', 'bottom', win);
      const clear = u.el('button', 'clear-game', footer, 'Clear');
      clear.type = 'button';
      clear.addEventListener('click', () => {
        const reset = document.querySelector('.reference-reset');
        if (reset) reset.click();
      });
      let submit = null;
      const er = ctx.rng.fork('chrome/end'),
        cr = ctx.rng.fork('chrome/collide');
      const labels = (ctx.content && ctx.content.END_LABELS) || [
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
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const placement = ctx.finish ? null : er.pick(['footer', 'footer', 'footer', 'header', 'link', 'icon']);
      const label = labelOf(er.pick(labels));
      const collide = cr.bool(0.3)
        ? labelOf(cr.pick(labels.filter((x) => labelOf(x).toLowerCase() !== label.toLowerCase())))
        : null;
      const decoy = (parent, text, isEnd) => {
        const b = u.el('button', isEnd ? 'pqd-xtra' : 'filler-xtra', parent, text);
        b.type = 'button';
        b.addEventListener('click', () => env.log('decoy', isEnd ? { label: text, collide: true } : { label: text }));
      };
      const makeSubmit = (parent, cls, text) => {
        const b = u.el('button', cls, parent, text);
        b.type = 'button';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.addEventListener('click', ctx.submit);
        return b;
      };
      if (placement === 'header' || placement === 'icon') {
        const tools = u.el('div', 'menu-tools', menu);
        if (collide) decoy(tools, collide, true);
        submit = makeSubmit(
          tools,
          placement === 'icon' ? 'submit icon-submit' : 'submit header-submit',
          placement === 'icon' ? '✓' : label,
        );
      } else if (collide) {
        decoy(footer, collide, true);
      }
      if (!ctx.finish && placement === 'footer') submit = makeSubmit(footer, 'submit', label);
      if (!ctx.finish && placement === 'link') submit = makeSubmit(footer, 'submit-link', label + ' ›');
      if (!ctx.finish && placement !== 'header' && placement !== 'icon' && collide == null && er.bool(0.25))
        decoy(footer, labelOf(er.pick(labels.filter((x) => labelOf(x).toLowerCase() !== label.toLowerCase()))), true);
      return { stage, submit: ctx.finish ? null : submit };
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
