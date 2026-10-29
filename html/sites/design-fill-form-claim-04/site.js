// Design on templates/site/form-fill-receipt-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-fill-form-claim-04',
    styles: ['site.css'],
    scripts: [],
    template: 'site/fill-form-receipt-03',
    design: {
      C: {
        'site': 'design-fill-form-claim-04',
        'brand': 'People Manager',
        'title': 'Add Contact',
        'instruction': 'left',
        'rail': '',
        'menu': 'Home|Contacts|View|Tools|Help',
        'briefTitle': 'Instructions',
      },
      parts: {
        'frame.20': (base, S) =>
          function (_c) {
            const { C } = S;
            const { u } = _c;
            if (C.menu) {
              const nav = u.el('nav', 'ds-menu', document.body);
              C.menu.split('|').forEach((t, i) => {
                u.el('span', i === 0 ? 'active' : '', nav, t);
              });
            }
            const summary = u.el('section', 'claim-summary', document.body);
            summary.innerHTML =
              '<div class="claim-head"><h2>Claim Processing</h2><div><span>Claim Number:</span><b>CLM-004872</b><span>Policy Number:</span><b>POL-312770</b></div><div><span>Insured:</span><b>Robert J. Miller</b><span>Type:</span><b>Auto</b></div><div><span>Date Received:</span><b>Mar 14, 1994</b><span>Status:</span><b>New</b></div></div><div class="claim-doc"><h2>Document</h2><div><span>Type:</span><b>Loss Notice</b></div><div><span>Pages:</span><b>1</b></div><div><span>Received:</span><b>Mar 14, 1994</b></div></div>';
            Object.assign(_c, { summary });
          },
        'frame.46': () => () => {},
        'frame.47': () => () => {},
        'frame.48': () => () => {},
      },
    },
  });
})();
