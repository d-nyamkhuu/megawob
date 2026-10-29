(function () {
  'use strict';
  const C = {
    'site': 'design-choose-option-listbox-08',
    'brand': 'Employee Record',
    'instruction': 'top',
    'briefTitle': 'Instructions',
    tabs: ['Personal', 'Employment', 'Compensation', 'Benefits', 'Review'],
    details: [
      ['Record Type', 'Employee'],
      ['Record ID', 'E10427'],
      ['Last Updated', 'Apr 28, 2025 10:14 AM'],
      ['Updated By', 'A. Chen'],
    ],
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
      const top = u.el('header', 'ds-top', document.body);
      u.el('span', 'ds-brand', top, C.brand);
      u.el('span', 'ds-meta', top, 'HR Portal  |  v2.4.1  |  Mon, Apr 28, 2025');
      const body = u.el('div', 'ds-body', document.body);
      const content = u.el('div', 'ds-content', body);
      const tabs = u.el('nav', 'ds-tabs', content);
      C.tabs.forEach((t, i) => {
        const tb = u.el('div', 'ds-tab' + (i === 0 ? ' on' : ''), tabs);
        u.el('b', '', tb, String(i + 1));
        u.el('span', '', tb, t);
      });
      const natural = C.instruction;
      const mode =
        ctx.display === 'hidden'
          ? 'hidden'
          : ctx.display === 'toast'
            ? 'toast'
            : ctx.display === 'panel'
              ? document.body.clientWidth <= 1300
                ? natural
                : 'panel'
              : natural;
      function briefing(parent, cls) {
        const b = u.el('aside', cls, parent);
        u.el('div', 'ds-instruction', b, ctx.instruction);
        return b;
      }
      if (mode === 'top') briefing(content, 'ds-header-note');
      const main = u.el('div', 'ds-main', content);
      if (mode === 'left' || mode === 'right') {
        const b = briefing(main, 'ds-brief');
        if (mode === 'right') b.style.order = '2';
      }
      const col = u.el('div', 'ds-col', main);
      const sec = u.el('section', 'ds-sec', col);
      u.el('div', 'ds-bar', sec, 'Employee Information');
      const stage = u.el('main', 'ds-stage', sec);
      const fake = u.el('div', 'ds-fake', sec);
      ['Employee ID|E10427|ro', 'First Name|Jordan', 'Last Name|Miller', 'Email|jordan.miller@company.com'].forEach(
        (s) => {
          const p = s.split('|');
          const r = u.el('div', 'ds-frow', fake);
          u.el('label', '', r, p[0]);
          u.el('div', 'ds-fin' + (p[2] ? ' ro' : ''), r, p[1]);
        },
      );
      const fake2 = u.el('div', 'ds-fake ds-fake2', sec);
      [
        ['Department', 'Product', 'sel'],
        ['Job Title', 'Product Manager'],
      ].forEach((p) => {
        const r = u.el('div', 'ds-frow', fake2);
        u.el('label', '', r, p[0]);
        u.el('div', 'ds-fin' + (p[2] ? ' sel' : ''), r, p[1]);
      });
      const sec2 = u.el('section', 'ds-sec ds-sec2', col);
      u.el('div', 'ds-bar', sec2, 'Additional Details');
      const g = u.el('div', 'ds-grid2', sec2);
      [
        ['Employment Type', 'Full Time'],
        ['Work Arrangement', 'Hybrid'],
        ['Start Date', '2023-06-12'],
        ['Time Zone', 'Pacific (PT)'],
        ['Manager', 'Taylor Kim'],
        ['Employee Status', 'Active'],
      ].forEach((p) => {
        const r = u.el('div', 'ds-frow' + (p[0] === 'Start Date' ? ' ds-date' : ''), g);
        u.el('label', '', r, p[0]);
        u.el('div', 'ds-fin' + (p[0] === 'Start Date' ? '' : ' sel'), r, p[1]);
        if (p[0] === 'Start Date') {
          const icon = u.el('span', 'ds-calendar', r);
          icon.innerHTML =
            '<svg viewBox="0 0 24 24" width="23" height="23" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="17" rx="1"/><path d="M3 9h18M8 2v5M16 2v5M7 12h2m3 0h2m3 0h1M7 16h2m3 0h2m3 0h1"/></svg>';
        }
      });
      const sec3 = u.el('section', 'ds-sec ds-sec3', col);
      u.el('div', 'ds-bar', sec3, 'Notes');
      u.el('div', 'ds-notes', sec3, 'Add any relevant notes here...');
      u.el('div', 'ds-count', sec3, '0 / 500');
      if (mode === 'toast') {
        const note = briefing(content, 'ds-toast');
        content.insertBefore(note, main);
      }
      const foot = u.el('footer', 'ds-footer', content);
      const clear = u.el('button', 'ds-travel-cancel', foot, 'Clear Form');
      clear.type = 'button';
      const save = u.el('button', 'ds-travel-cancel', foot, 'Save Draft');
      save.type = 'button';
      for (const b of [clear, save]) {
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', { label: b.textContent }));
      }
      const endRng = ctx.rng.fork('chrome/end');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const endLabels = ctx.content.END_LABELS.map(labelOf);
      const placement = endRng.pick(['footer', 'footer', 'header', 'link']);
      const label = placement === 'footer' && endLabels.includes('Submit') ? 'Submit' : endRng.pick(endLabels);
      const collideRng = ctx.rng.fork('chrome/collide');
      if (collideRng.bool(0.3)) {
        const pool = endLabels.filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
        if (pool.length) {
          const text = collideRng.pick(pool);
          const b = u.el('button', 'ds-travel-cancel ds-pq', foot, text);
          b.type = 'button';
          b.dataset.role = 'xtra';
          b.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
        }
      }
      u.el('span', 'ds-spacer', foot);
      let submit = null;
      if (!ctx.finish) {
        submit = u.el(
          placement === 'link' ? 'a' : 'button',
          'ds-submit' + (placement === 'header' ? ' ds-end-header' : placement === 'link' ? ' ds-end-link' : ''),
          placement === 'header' ? top : foot,
          label,
        );
        if (placement === 'link') submit.href = '#';
        else submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.title = label;
        submit.setAttribute('aria-label', label);
        submit.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
      }
      const insp = u.el('aside', 'ds-insp', body);
      if (mode === 'panel') {
        const p = u.el('section', 'ds-panel ds-task-panel', insp);
        u.el('div', 'ds-bar', p, C.briefTitle);
        briefing(p, 'ds-panel-note');
      }
      const p1 = u.el('div', 'ds-panel', insp);
      u.el('div', 'ds-bar', p1, 'Record Details');
      const pb = u.el('div', 'ds-pbody', p1);
      C.details.forEach((d) => {
        const r = u.el('div', 'ds-drow', pb);
        u.el('span', '', r, d[0]);
        u.el('span', '', r, d[1]);
      });
      const p2 = u.el('div', 'ds-panel', insp);
      u.el('div', 'ds-bar', p2, 'Field Help');
      const hb = u.el('div', 'ds-help', p2);
      u.el('h4', '', hb, 'Office Location');
      u.el(
        'p',
        '',
        hb,
        "Select the employee's primary office location from the list. Choose the location that best represents where they work most often.",
      );
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
