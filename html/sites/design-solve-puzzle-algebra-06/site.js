(function () {
  'use strict';
  const C = { site: 'design-solve-puzzle-algebra-06', task: 'solve-puzzle', scenario: 'algebra', title: 'Math Practice' };
  env.site({
    name: C.site,
    styles: ['site.css'],
    frame(ctx) {
      let display = ctx.display || 'header';
      if ((display === 'panel' && window.innerWidth < 1260) ||
          (display === 'toast' && (window.innerWidth < 1260 || window.innerHeight < 700))) display = 'header';
      document.body.className = 'forum-stacked instruction-' + display;
      const u = ctx.util;
      const app = u.el('main', 'app main-window', document.body);
      const top = u.el('header', 'top', app);
      const book = u.svg('svg', { width: 50, height: 42, viewBox: '0 0 50 42', class: 'bookmark' }, top);
      u.svg('path', { d: 'M4 5Q14 1 24 7Q34 1 46 5V36Q35 32 25 38Q15 32 4 36Z', fill: '#f7fbff', stroke: '#163e70', 'stroke-width': 2 }, book);
      u.svg('path', { d: 'M25 7V37M8 10Q16 7 21 11V31Q15 27 8 30ZM29 11Q36 7 42 10V30Q35 27 29 31Z', fill: 'none', stroke: '#5b81ab', 'stroke-width': 1.4 }, book);
      const brand = u.el('div', 'brand', top);
      u.el('b', '', brand, 'Math Practice');
      u.el('span', '', brand, 'Build Your Skills');
      const account = u.el('div', 'account', top);
      ['My Account', 'Help', 'Log Out'].forEach((v, i) => { if (i) u.el('i', 'divider', account, '│'); u.el('span', '', account, v); });
      const nav = u.el('nav', 'menu', app);
      ['Home', 'Practice', 'Progress', 'Resources', 'Messages'].forEach((v, i) => u.el('div', i === 1 ? 'active' : '', nav, v));
      const center = u.el('div', 'center', app);
      const bar = u.el('div', 'sectionbar', center);
      u.el('b', '', bar, 'Algebra Practice');
      u.el('span', '', bar, 'Question 1 of 10');
      if (display === 'header' || display === 'panel') u.el('div', 'brief ' + (display === 'panel' ? 'note-panel' : ''), center, ctx.instruction);
      const stage = u.el('section', 'stage', center);
      const footer = u.el('footer', 'bottom', app);
      const navbox = u.el('div', 'question-nav', footer);
      u.el('b', '', navbox, 'Question Navigator');
      const numbers = u.el('div', 'question-numbers', navbox);
      for (let i = 1; i <= 10; i++) u.el('span', i === 1 ? 'current' : '', numbers, String(i));
      const meta = u.el('div', 'topic-meta', footer);
      u.el('div', '', meta, 'Topic: Linear Equations');
      u.el('div', '', meta, 'Difficulty: Basic');
      const aside = u.el('aside', 'aside help-window', document.body);
      const helpbar = u.el('header', 'helpbar', aside);
      u.el('b', 'help-mark', helpbar, '?');
      u.el('b', '', helpbar, 'Study Help');
      const ctr = u.el('div', 'help-controls', helpbar);
      ['−', '□', '×'].forEach((x, i) => u.el('span', 'window-btn ' + (i === 2 ? 'close-btn' : ''), ctr, x));
      const tabs = u.el('div', 'help-tabs', aside);
      ['Tips', 'Examples', 'Related Topics'].forEach((x, i) => u.el('span', i === 0 ? 'selected' : '', tabs, x));
      const helpbody = u.el('div', 'help-body', aside);
      u.el('h2', '', helpbody, 'Solving Linear Equations');
      u.el('p', '', helpbody, 'A linear equation can be solved by using inverse operations to isolate the variable.');
      u.el('h3', '', helpbody, 'Steps (in general):');
      const list = u.el('ol', '', helpbody);
      ['Simplify both sides, if needed.', 'Use inverse operations to get the variable by itself.', 'Check your answer.'].forEach(x => u.el('li', '', list, x));
      const links = u.el('div', 'help-links', helpbody);
      ['Sample Problem (different numbers)', 'More Help', 'Watch a Video', 'See Worked Examples', 'Practice Another Problem'].forEach((x, i) => {
        const row = u.el('div', 'help-link', links);
        u.el('span', 'triangle', row, i < 2 ? '▶' : '▸');
        u.el('a', '', row, x);
      });
      if (display === 'toast') {
        const note = u.el('div', 'instruction-toast', document.body, ctx.instruction);
        note.setAttribute('role', 'note');
      }
      let submit = null;
      if (!ctx.finish) {
        const er = ctx.rng.fork('chrome/end');
        const cr = ctx.rng.fork('chrome/collide');
        const bank = ctx.content && ctx.content.END_LABELS || ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
        const labelOf = x => typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x);
        const labels = bank.map(labelOf);
        const label = er.bool(.5) ? 'Submit' : labelOf(er.pick(labels));
        const placement = er.pick(['footer', 'footer', 'footer', 'toolbar', 'link']);
        const decoy = (parent, text, collide) => {
          const b = u.el('button', 'chrome-xtra', parent, text);
          b.type = 'button';
          b.addEventListener('click', () => env.log('decoy', collide ? { label: text, collide: true } : { label: text }));
        };
        const end = (parent, cls, text) => {
          const b = u.el(cls === 'chrome-end-link' ? 'a' : 'button', cls, parent, text);
          if (b.tagName === 'BUTTON') b.type = 'button'; else b.href = '#';
          b.setAttribute('aria-label', label);
          b.title = label;
          b.addEventListener('click', e => { e.preventDefault(); ctx.submit(); });
          return b;
        };
        let collision = null;
        if (cr.bool(.3)) {
          const candidates = [...new Set(labels)].filter(x => x.trim().toLowerCase() !== label.trim().toLowerCase());
          if (candidates.length) collision = { text: cr.pick(candidates), where: cr.pick(['toolbar', 'footer']) };
        }
        footer.classList.add('has-end');
        if (collision && collision.where === 'toolbar') decoy(bar, collision.text, true);
        if (placement === 'toolbar') submit = end(bar, 'chrome-end toolbar-end', label);
        else if (placement === 'link') submit = end(footer, 'chrome-end-link', label + ' ›');
        else submit = end(footer, 'chrome-end footer-end', label);
        if (collision && collision.where === 'footer') decoy(footer, collision.text, true);
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      const el = u.el('div', 'overlay ' + ctx.kind, document.body);
      const messages = { cookie: 'This application stores preferences on your device.', toast: 'Your workspace has been synced.', chat: 'Need help with this exercise?', promo: 'Try the new practice collection.', banner: 'An updated practice collection is available.' };
      u.el('span', '', el, messages[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept' : 'Dismiss');
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    }
  });
})();
