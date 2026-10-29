(function () {
  'use strict';
  env.site({
    name: 'design-act-in-time-delay-05',
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util;
      const title = u.el('header', 'ol-titlebar', document.body);
      u.el('span', 'ol-menu-gadget', title, '✣');
      u.el('strong', 'ol-title', title, 'Data Import Wizard');
      u.el('span', 'ol-window-buttons', title, '−　□　×');
      const menu = u.el('nav', 'ol-menubar', document.body);
      ['File ▾', 'Edit ▾', 'View ▾', 'Tools ▾'].forEach((x) => u.el('span', '', menu, x));
      u.el('span', 'ol-help', menu, 'Help ▾');

      const work = u.el('div', 'ol-work', document.body);
      let note = null;
      if (ctx.display !== 'hidden') {
        let display = ctx.display || 'header';
        if (window.innerWidth < 1260 && (display === 'panel' || display === 'toast')) display = 'header';
        note = u.el('section', 'ol-instruction ol-instruction-' + display, work);
        u.el('strong', '', note, ctx.instruction);
        u.el('span', 'ol-step', note, 'Step 1 of 3');
      }
      const stage = u.el('main', 'ds-stage ol-stage', work);
      const overview = u.el('section', 'ol-overview', work);
      const detail = u.el('div', 'ol-detail', overview);
      u.el('h2', '', detail, 'Import Customer Records');
      u.el('p', '', detail, 'This wizard will import customer records from a CSV file.');
      u.el('ol', '', detail).innerHTML =
        '<li>Select the file to import.</li><li>Review the details.</li><li>Click Next to continue.</li>';
      const file = u.el('div', 'ol-file', detail);
      u.el('span', '', file, 'Selected file:');
      u.el('span', 'ol-file-name', file, 'customers.csv');
      const preview = u.el('div', 'ol-preview', overview);
      u.el('div', 'ol-preview-title', preview, 'Preview (first 5 records)');
      const table = u.el('table', '', preview);
      table.innerHTML =
        '<thead><tr><th>ID</th><th>Name</th><th>City</th><th>Status</th></tr></thead><tbody><tr><td>1001</td><td>Adams, Ruth</td><td>Boston</td><td>Active</td></tr><tr><td>1002</td><td>Baker, Tom</td><td>Chicago</td><td>Active</td></tr><tr><td>1003</td><td>Chen, Li</td><td>Seattle</td><td>Inactive</td></tr><tr><td>1004</td><td>Diaz, Maria</td><td>Austin</td><td>Active</td></tr><tr><td>1005</td><td>Evans, John</td><td>Denver</td><td>Active</td></tr></tbody>';
      const dock = u.el('footer', 'ol-dock', document.body);
      u.el('strong', 'ol-dock-label', dock, 'Tools');
      const tools = u.el('div', 'ol-tools', dock);
      const iconMarkup = [
        '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M5 15h15l4 5h19v21H5z"/><path d="M5 15V8h15l4 5"/></svg>',
        '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M9 5h30v38H9z"/><path d="M15 13h18M15 20h18M15 27h18M15 34h13"/></svg>',
        '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M20 4h8l1.5 5.5a16 16 0 0 1 3.5 1.5l5-2.5 5.5 5.5-2.5 5a16 16 0 0 1 1.5 3.5L48 24v8l-5.5 1.5a16 16 0 0 1-1.5 3.5l2.5 5-5.5 5.5-5-2.5a16 16 0 0 1-3.5 1.5L28 52h-8l-1.5-5.5a16 16 0 0 1-3.5-1.5l-5 2.5L4.5 42l2.5-5a16 16 0 0 1-1.5-3.5L0 32v-8l5.5-1.5A16 16 0 0 1 7 19l-2.5-5L10 8.5l5 2.5a16 16 0 0 1 3.5-1.5z" transform="translate(3 -5) scale(.88)"/><circle cx="24" cy="24" r="7"/></svg>',
        '<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="18"/><path d="M20 18a5 5 0 1 1 8 4c-3 2-4 3-4 7M24 35v1"/></svg>',
      ];
      [
        ['Open File', 0],
        ['View Log', 1],
        ['Preferences', 2],
        ['Help', 3],
      ].forEach(([label, icon]) => {
        const item = u.el('div', 'ol-tool', tools);
        u.el('span', 'ol-tool-icon', item).innerHTML = iconMarkup[icon];
        u.el('span', '', item, label);
      });
      let submit = null;
      if (!ctx.finish) {
        const er = ctx.rng.fork('chrome/end');
        const words =
          ctx.content && Array.isArray(ctx.content.END_LABELS)
            ? ctx.content.END_LABELS
            : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
        const labels = words.map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || 'Submit'));
        const label = er.bool(0.5) ? 'Submit' : er.pick(labels.filter((x) => x.trim().toLowerCase() !== 'submit'));
        const placement = er.pick(['dock', 'dock', 'title', 'link']);
        if (placement !== 'dock') dock.classList.add('ol-submit-' + placement);
        if (placement === 'title') title.classList.add('ol-title-has-submit');
        submit = u.el(
          placement === 'link' ? 'a' : 'button',
          'ds-submit ol-submit',
          placement === 'title' ? title : dock,
          placement === 'link' ? label : label,
        );
        if (submit.tagName === 'A') {
          submit.href = '#';
          submit.addEventListener('click', (e) => e.preventDefault());
        } else submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.addEventListener('click', () => ctx.submit());
        const decoyStack = u.el('div', 'ol-xtra-stack', dock);
        const cr = ctx.rng.fork('chrome/collide');
        if (cr.bool(0.3)) {
          const alternatives = labels.filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
          if (alternatives.length) {
            const decoy = u.el('button', 'ol-xtra ol-xtra-pq', decoyStack, cr.pick(alternatives));
            decoy.type = 'button';
            decoy.dataset.role = 'xtra';
            decoy.addEventListener('click', () => env.log('decoy', { label: decoy.textContent, collide: true }));
          }
        }
        const dr = ctx.rng.fork('chrome/decoy');
        const fillers =
          ctx.content && Array.isArray(ctx.content.DECOY_LABELS)
            ? ctx.content.DECOY_LABELS
            : ['Help', 'Preview', 'Save draft', 'History'];
        const count = dr.int(0, 2);
        for (let i = 0; i < count; i++) {
          const entry = dr.pick(fillers);
          const text = typeof entry === 'string' ? entry : entry.label || entry.text || entry.name || 'Help';
          const decoy = u.el('button', 'ol-xtra ol-xtra-filler', decoyStack, text);
          decoy.type = 'button';
          decoy.dataset.role = 'xtra';
          decoy.addEventListener('click', () => env.log('decoy', { label: text }));
        }
      }
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
