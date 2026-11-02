// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) =>
      function (_c) {
        const { display, lr, nav, rng, util, word } = _c;
        const { K, TITLES } = S;
        const header = util.el('header', 'ref-task', document.body);
        const rail = util.el('nav', 'nb-rail', document.body);
        const railItems = [
          [
            '<path d="M13 3h21l11 11v36H13z" fill="#f4e4bf" stroke="#172b35" stroke-width="3"/><path d="M34 3v12h11M20 23h18M20 30h18M20 37h18" fill="none" stroke="#273746" stroke-width="3"/>',
            'Forms',
            true,
          ],
          [
            '<path d="M16 6h26v36H16zM10 12h26v36H10z" fill="#e9d7ad" stroke="#182c36" stroke-width="3"/><path d="M16 21h14M16 28h14M16 35h14" stroke="#33444a" stroke-width="2"/>',
            'Responses',
            false,
          ],
          [
            '<path d="M9 37h9v14H9zM22 24h9v27h-9zM35 11h9v40h-9z" fill="#e7bd47" stroke="#25373a" stroke-width="2"/><path d="M6 52h42" stroke="#e9dfbf" stroke-width="3"/>',
            'Reports',
            false,
          ],
          [
            '<circle cx="20" cy="18" r="8" fill="#e7b37b" stroke="#28383b" stroke-width="2"/><circle cx="36" cy="18" r="8" fill="#f0d29b" stroke="#28383b" stroke-width="2"/><path d="M7 48c0-11 5-17 13-17s13 6 13 17M24 48c0-11 5-17 12-17s12 6 12 17" fill="#28758a" stroke="#28383b" stroke-width="3"/>',
            'Contacts',
            false,
          ],
          [
            '<path d="M25 5h8l2 7 6 3 7-3 5 7-5 5v7l5 5-5 7-7-3-6 3-2 7h-8l-2-7-6-3-7 3-5-7 5-5v-7l-5-5 5-7 7 3 6-3z" transform="translate(-1 -1) scale(.96)" fill="#aab9b9" stroke="#27363b" stroke-width="3"/><circle cx="29" cy="29" r="9" fill="#164e5b" stroke="#27363b" stroke-width="3"/>',
            'Settings',
            false,
          ],
        ];
        for (const [drawing, text, active] of railItems) {
          const item = util.el('a', `nb-rail-item${active ? ' is-active' : ''}`, rail);
          item.href = '#';
          item.addEventListener('click', (e) => {
            e.preventDefault();
            env.log('decoy', { what: 'nav', label: text });
          });
          const icon = util.el('span', 'nb-rail-icon', item);
          icon.innerHTML = `<svg viewBox="0 0 58 58" aria-hidden="true">${drawing}</svg>`;
          util.el('span', 'nb-rail-label', item, text);
        }
        if (display !== 'header' || nav) {
          rng.pick(TITLES); // retain the original seeded draw
          const title = 'Ninebark Landscaping · Workshop survey';
          const brand = util.el('div', 'ref-brand', header, word ? word(lr.pick(K.brand)) : title);
          brand.dataset.role = 'brand';
        }
        Object.assign(_c, { header, rail, railItems });
      },
    'frame.body': (base, S) =>
      function (_c) {
        const { util } = _c;
        const body = util.el('div', 'ref-body', document.body);
        const overview = util.el('aside', 'ref-overview', body);
        util.el('div', 'ref-overview-head', overview, 'Survey Overview');
        util.el('div', 'ref-overview-line', overview, 'Title　　Ninebark Landscaping · Workshop survey');
        util.el('div', 'ref-overview-line', overview, 'Status　　Draft');
        util.el('div', 'ref-overview-line', overview, 'Created　　Feb 20, 1997');
        util.el('div', 'ref-overview-line', overview, 'Last edited　 Feb 20, 1997');
        util.el('div', 'ref-overview-rule', overview);
        util.el('div', 'ref-overview-subhead', overview, 'Sections　　　3');
        util.el('div', 'ref-overview-line', overview, 'Questions　　 8');
        util.el('div', 'ref-overview-line', overview, 'Estimated time　4 minutes');
        util.el('div', 'ref-overview-rule', overview);
        util.el('div', 'ref-overview-subhead', overview, 'Response summary');
        util.el('div', 'ref-overview-line', overview, 'Total responses　　 0');
        util.el('div', 'ref-overview-line', overview, 'Completed　　　　 0');
        util.el('div', 'ref-overview-line', overview, 'Partial　　　　　 0');
        util.el('div', 'ref-overview-rule', overview);
        util.el('div', 'ref-overview-subhead', overview, 'Response policy');
        util.el('div', 'ref-overview-line', overview, 'Collect email addresses　 No');
        util.el('div', 'ref-overview-line', overview, 'One response per person　No');
        util.el('div', 'ref-overview-line', overview, 'Scheduled closing　　　Not set');
        S.frameSidebar(_c, body);
        Object.assign(_c, { body, overview });
      },
  };

  env.site({
    name: 'design-use-form-builder-settings-01',
    template: 'site/base',
    design: { parts },
  });
})();
