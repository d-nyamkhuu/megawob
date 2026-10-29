(function () {
  'use strict';
  const C = {
    'site': 'design-choose-option-dropdown-01',
    'brand': 'Task Manager',
    'title': 'Task Details',
    'instruction': 'top',
    'rail': '',
    'menu': 'File|Edit|View|Tasks|Options',
    'briefTitle': 'Instructions',
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util;
      const endRng = ctx.rng.fork('chrome/end');
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const endLabels =
        ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
          ? ctx.content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
      const label = endRng.bool(0.5) ? 'Submit' : labelOf(endRng.pick(endLabels));
      const placement = ctx.finish ? null : endRng.pick(['button', 'button', 'link', 'icon']);
      const collideRng = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (!ctx.finish && collideRng.bool(0.3)) {
        const options = [...new Set(endLabels.map(labelOf))].filter(
          (x) => x.trim().toLowerCase() !== label.trim().toLowerCase(),
        );
        if (options.length) collide = collideRng.pick(options);
      }
      const top = u.el('header', 'ds-top', document.body);
      u.el('span', 'ds-brand', top, C.brand);
      u.el('span', '', top, '−    □    ×');
      if (C.menu) {
        const nav = u.el('nav', 'ds-menu', document.body);
        C.menu.split('|').forEach((t) => u.el('span', '', nav, t));
      }
      const tasks = u.el('section', 'ds-tasklist', document.body);
      u.el('b', '', tasks, 'Open Tasks');
      const table = u.el('table', '', tasks);
      const head = u.el('tr', '', table);
      ['ID', 'Title', 'Assignee', 'Priority', 'Status', 'Due Date'].forEach((t) => u.el('th', '', head, t));
      [
        ['1021', 'Update user guide', 'Chen', 'Medium', 'In Progress', 'Apr 24, 1991'],
        ['1022', 'Fix build script', 'Patel', 'High', 'Open', 'Apr 25, 1991'],
        ['1023', 'Design settings dialog', 'Nguyen', 'Medium', 'Open', 'Apr 26, 1991'],
        ['1024', 'Verify data export', 'Lopez', 'Low', 'Open', 'Apr 28, 1991'],
        ['1025', 'Prepare release notes', 'Kim', 'Medium', 'In Progress', 'Apr 30, 1991'],
      ].forEach((row) => {
        const tr = u.el('tr', '', table);
        row.forEach((t) => u.el('td', '', tr, t));
      });
      const body = u.el('div', 'ds-body', document.body);
      if (C.rail) {
        const rail = u.el('aside', 'ds-rail', body);
        C.rail.split('|').forEach((t) => u.el('div', '', rail, t));
      }
      const content = u.el('div', 'ds-content', body);
      const natural = C.instruction;
      const mode =
        ctx.display === 'hidden'
          ? 'hidden'
          : ctx.display === 'toast'
            ? 'toast'
            : ctx.display === 'panel'
              ? 'left'
              : natural;
      function briefing(parent, cls) {
        const b = u.el('aside', cls, parent);
        if (cls === 'ds-brief') u.el('h2', '', b, C.briefTitle || 'Task');
        u.el('div', 'ds-instruction', b, ctx.instruction);
        return b;
      }
      if (mode === 'top') {
        const note = briefing(content, 'ds-header-note');
        u.el('h2', 'ds-task-legend', note, 'Task Details');
      }
      const main = u.el('div', 'ds-main', content);
      if (mode === 'left' || mode === 'right') {
        const b = briefing(main, 'ds-brief');
        if (mode === 'right') b.style.order = '2';
      }
      const stage = u.el('main', 'ds-stage', main);
      const details = u.el('aside', 'ds-task-description', stage);
      u.el('label', '', details, 'Description:');
      u.el(
        'div',
        'ds-staticarea',
        details,
        'Revise the Getting Started and Installation sections based on QA feedback.',
      );
      u.el('label', '', details, 'Attachments:');
      u.el('div', 'ds-staticarea', details, 'user_guide_draft.txt\nqa_notes.txt');
      if (mode === 'toast') {
        const note = briefing(content, 'ds-toast');
        content.insertBefore(note, main);
      }
      const status = u.el('div', 'ds-motif-status', document.body);
      u.el('span', '', status, 'Ready.');
      u.el('span', '', status, 'Mon Apr 22 1991  10:14 AM');
      const foot = u.el('footer', 'ds-footer', content);
      u.el('span', '', foot, 'Ready');
      let submit = null;
      if (!ctx.finish) {
        if (collide) {
          const d = u.el('button', 'ds-motif-action ds-xtra', foot, collide);
          d.type = 'button';
          d.dataset.role = 'xtra';
          d.addEventListener('click', () => env.log('decoy', { label: collide, collide: true }));
        }
        if (placement === 'link') {
          submit = u.el('a', 'ds-submit ds-submit-link', foot, label + ' ›');
          submit.href = '#';
        } else if (placement === 'icon') {
          submit = u.el('button', 'ds-submit ds-submit-icon', foot, '✓');
          submit.type = 'button';
          submit.title = label;
          submit.setAttribute('aria-label', label);
        } else {
          submit = u.el('button', 'ds-submit', foot, label);
          submit.type = 'button';
        }
        submit.dataset.role = 'submit';
        submit.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
      }
      ['Cancel', 'Reset'].forEach((t) => {
        const b = u.el('button', 'ds-motif-action', foot, t);
        b.type = 'button';
      });
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
      u.el('div', '', el, texts[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  });
})();
