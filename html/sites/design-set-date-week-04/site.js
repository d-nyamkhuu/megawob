(function () {
  'use strict';
  const C = { site: 'design-set-date-week-04' };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util,
        body = u.el('div', 'nb-body', document.body),
        mast = u.el('header', 'nb-mast', body),
        brand = u.el('div', 'nb-brand', mast);
      u.el('span', 'nb-globe', brand, '◉');
      const word = u.el('div', 'nb-word', brand);
      u.el('b', '', word, 'NorthBridge');
      u.el('span', '', word, 'Extranet');
      const primary = u.el('nav', 'nb-primary', mast);
      u.el('b', '', primary, 'Projects');
      ['Teams', 'Documents', 'Reports'].forEach((x) => u.el('span', '', primary, x));
      const utility = u.el('div', 'nb-utility', mast);
      ['Help', 'My Profile', 'Sign Out'].forEach((x) => u.el('span', '', utility, x));
      const tabs = u.el('nav', 'nb-tabs', body);
      ['Home', 'Projects', 'Tasks', 'Milestones', 'Time & Expenses', 'Resources', 'Administration'].forEach((x, i) => {
        const t = u.el('div', 'nb-tab' + (i === 1 ? ' active' : ''), tabs, x);
      });
      const shell = u.el('div', 'nb-shell', body),
        left = u.el('aside', 'nb-left', shell);
      const sideHead = u.el('h2', '', left, 'Project Phoenix');
      ['Overview', 'Plan', 'Tasks', 'Issues', 'Risks', 'Team', 'Documents', 'Status Reports'].forEach((x, i) =>
        u.el('div', 'nb-navitem' + (i === 1 ? ' selected' : ''), left, x),
      );
      const related = u.el('section', 'nb-related', left);
      u.el('h2', '', related, 'Related Projects');
      ['Mercury', 'Orion', 'Apollo', 'Gemini'].forEach((x) => u.el('div', '', related, x));
      const work = u.el('main', 'nb-work', shell);
      const head = u.el('section', 'nb-project', work);
      u.el('div', 'nb-projectname', head, 'Project Phoenix');
      u.el('div', 'nb-subtitle', head, 'Product Launch Initiative');
      const facts = u.el('div', 'nb-facts', head);
      [
        ['Project ID:', 'PHX-1003'],
        ['Status:', 'In Progress'],
        ['Start Date:', 'Sep 1, 2026'],
        ['Target Date:', 'Mar 31, 2027'],
      ].forEach(([a, b]) => {
        const row = u.el('div', '', facts);
        u.el('span', '', row, a);
        u.el('b', '', row, b);
      });
      const right = u.el('aside', 'nb-summary', shell);
      u.el('h2', '', right, 'Status Summary');
      [
        ['Total Tasks:', '24'],
        ['Completed:', '9'],
        ['In Progress:', '11'],
        ['Not Started:', '4'],
        ['Overdue:', '0'],
      ].forEach(([a, b]) => {
        const row = u.el('div', 'nb-stat', right);
        u.el('span', '', row, a);
        u.el('b', '', row, b);
      });
      const bottom = u.el('div', 'nb-bottom', work);
      const form = u.el('section', 'nb-form', bottom);
      u.el('h2', '', form, 'Sprint Details');
      const main = u.el('div', 'nb-main', form);
      const taskArea = u.el('div', 'nb-task', main);
      const taskHead = u.el('div', 'nb-taskhead', taskArea);
      u.el('b', '', taskHead, 'Sprint 6');
      function note(parent, cls) {
        const n = u.el('aside', cls, parent);
        u.el('div', 'ds-instruction', n, ctx.instruction);
        return n;
      }
      if (ctx.display !== 'hidden') {
        if (ctx.display === 'panel') note(left, 'ds-brief');
        else if (ctx.display === 'toast') note(body, 'ds-toast');
        else note(form, 'nb-note');
      }
      const staticrows = u.el('div', 'nb-staticrows', taskArea);
      [
        ['Sprint Name:', 'Sprint 6', 'input'],
        ['Project:', 'Project Phoenix (PHX-1003)', 'value'],
        ['Team:', 'Core Product Team', 'select'],
        ['Sprint Goal:', 'User interface polish and performance improvements', 'input'],
      ].forEach(([a, b, k]) => {
        const r = u.el('div', 'nb-staticrow', staticrows);
        u.el('span', '', r, a);
        const v = u.el('div', k === 'value' ? 'nb-staticvalue' : 'nb-staticcontrol', r, b);
        if (k === 'select') u.el('i', '', v, '▼');
      });
      const stage = u.el('div', 'ds-stage', taskArea);
      const sprint = u.el('section', 'nb-sprint', right);
      u.el('h2', '', sprint, 'Sprint Tasks (0)');
      const th = u.el('div', 'nb-th', sprint);
      ['ID', 'Title', 'Status'].forEach((x) => u.el('b', '', th, x));
      u.el('div', 'nb-empty', sprint, 'No tasks in this sprint.');
      const foot = u.el('footer', 'nb-footer', work);
      const endRng = ctx.rng.fork('chrome/end'),
        bank =
          ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
            ? ctx.content.END_LABELS
            : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"],
        labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      let placement = null,
        label = 'Confirm';
      if (!ctx.finish) {
        if (endRng.bool(0.5)) placement = 'header';
        else {
          const opts = bank.map(labelOf).filter((x) => x.toLowerCase() !== 'submit');
          if (opts.length) label = endRng.pick(opts);
          placement = endRng.pick(['footer', 'header', 'link']);
        }
      }
      let submit = null;
      function end(parent, cls, text, link) {
        const b = u.el(link ? 'a' : 'button', cls, parent, text);
        if (link) b.href = '#';
        else b.type = 'button';
        b.dataset.role = 'submit';
        b.title = label;
        b.setAttribute('aria-label', label);
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      }
      if (placement === 'header') submit = end(head, 'nb-end', label, false);
      if (placement === 'footer') submit = end(foot, 'nb-end', label, false);
      if (placement === 'link') submit = end(foot, 'nb-link', label + ' ›', true);
      if (!ctx.finish) {
        const cr = ctx.rng.fork('chrome/collide');
        if (cr.bool(0.3)) {
          const words = bank.map(labelOf).filter((x) => x.toLowerCase() !== label.toLowerCase());
          if (words.length) {
            const v = cr.pick(words),
              d = u.el('button', 'nb-xtra', head, v);
            d.type = 'button';
            d.dataset.role = 'xtra';
            d.addEventListener('click', () => env.log('decoy', { label: v, collide: true }));
          }
        }
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const m = {
        cookie: 'We use cookies to remember your preferences.',
        toast: 'Changes synced.',
        chat: 'Hello. How can we help?',
        promo: 'Try our new workspace.',
        banner: 'Scheduled maintenance tonight.',
      };
      u.el('div', '', el, m[ctx.kind]);
      const d = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      d.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss: d, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  });
})();
