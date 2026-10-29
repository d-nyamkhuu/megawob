(function () {
  'use strict';
  env.site({
    name: 'design-act-in-time-loading-02',
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util;
      const title = u.el('header', 'os-title', document.body);
      u.el('span', 'os-appicon', title, '▣');
      u.el('strong', '', title, 'IBM Books - Search');
      const win = u.el('div', 'os-window', title);
      ['−', '□', '×'].forEach((x) => u.el('span', 'os-window-btn', win, x));
      const menu = u.el('nav', 'os-menu', document.body);
      ['File', 'Edit', 'View', 'Search', 'Bookmarks', 'Options', 'Help'].forEach((x) => u.el('span', '', menu, x));
      const tools = u.el('div', 'os-tools', document.body);
      [
        ['↶', 'Back'],
        ['↷', 'Forward'],
        ['⌂', 'Home'],
        ['⌕', 'Search'],
        ['◫', 'Topics'],
        ['▤', 'Library'],
      ].forEach(([i, t]) => {
        const b = u.el('div', 'os-tool', tools);
        u.el('b', '', b, i);
        u.el('span', '', b, t);
      });
      const apphead = u.el('div', 'os-apphead', document.body);
      u.el('span', 'os-bookmark', apphead, '◫');
      u.el('strong', '', apphead, 'IBM Books');
      u.el('i', '', apphead, 'Technical and General Reading for a Smarter Workplace');
      let submit = null,
        label = 'Done',
        placement = 'toolbar';
      if (!ctx.finish) {
        const labels = (ctx.content && ctx.content.END_LABELS) || [
          'Submit',
          'Done',
          'Finish',
          'Continue',
          'Save',
          'OK',
          'Confirm',
          'Apply',
        ];
        const er = ctx.rng.fork('chrome/end');
        label = er.bool(0.5) ? 'Done' : String(er.pick(labels));
        placement = er.pick(['toolbar', 'footer', 'link']);
        const collide = ctx.rng.fork('chrome/collide');
        if (collide.bool(0.3)) {
          const pool = labels.filter((x) => String(x).toLowerCase() !== label.toLowerCase());
          if (pool.length) {
            const d = u.el('button', 'os-xtra', tools, String(collide.pick(pool)));
            d.type = 'button';
            d.addEventListener('click', () => env.log('decoy', { label: d.textContent, collide: true }));
          }
        }
        if (placement === 'toolbar') {
          submit = u.el('button', 'os-done', tools, label);
          submit.type = 'button';
          submit.addEventListener('click', () => ctx.submit());
        }
      }
      const frame = u.el('div', 'os-frame', document.body);
      const stage = u.el('main', 'ds-stage', frame);
      const searchrow = u.el('div', 'os-query', frame);
      u.el('label', '', searchrow, 'Search for:');
      const blank = u.el('div', 'os-queryspace', searchrow);
      const help = u.el('footer', 'os-help', frame);
      u.el('b', '', help, 'Search Tips');
      [
        ['▪', 'Type one or more words and click Search.'],
        ['▪', 'Use quotes for an exact phrase (e.g. “road map”).'],
        ['▪', 'You can use AND, OR to combine words (e.g. computer AND hardware).'],
        ['▪', "Browse Categories if you're not sure of the exact words."],
      ].forEach(([b, t]) => {
        const item = u.el('div', 'os-tip', help);
        u.el('b', '', item, b);
        u.el('span', '', item, t);
      });
      const end = u.el('div', 'os-end', frame);
      if (!ctx.finish && placement === 'footer') {
        submit = u.el('button', 'os-done', end, label);
        submit.type = 'button';
        submit.addEventListener('click', () => ctx.submit());
      }
      if (!ctx.finish && placement === 'link') {
        submit = u.el('button', 'os-link', end, label);
        submit.type = 'button';
        submit.addEventListener('click', () => ctx.submit());
      }
      if (ctx.display && ctx.display !== 'hidden') {
        const note = u.el('div', 'os-note os-note-' + ctx.display, document.body, ctx.instruction);
        if (ctx.display === 'header') apphead.appendChild(note);
      }
      if (ctx.display === 'panel') u.el('div', 'os-panel', document.body, ctx.instruction);
      if (ctx.display === 'toast') u.el('div', 'os-toast', document.body, ctx.instruction);
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      const el = u.el('section', 'os-overlay os-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = {
        cookie: 'This site uses cookies to remember your preferences.',
        toast: 'Your search preferences have been saved.',
        chat: 'IBM Books help desk. How may we assist?',
        promo: 'Discover the latest workplace titles.',
        banner: 'Library services are available during regular business hours.',
      };
      u.el('span', '', el, texts[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  });
})();
