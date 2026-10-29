// Design on templates/site/form-fill-receipt-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-fill-form-claim-02',
    styles: ['site.css'],
    scripts: [],
    template: 'site/fill-form-receipt-03',
    design: {
      C: {
        'site': 'design-fill-form-claim-02',
        'brand': 'Insurance Claims',
        'title': 'Insurance Claim Form',
        'instruction': 'left',
        'rail': 'Claims|Policies|Customers|Reports|Settings',
        'menu': '',
        'briefTitle': 'Instructions',
      },
      parts: {
        'frame.40': (base, S) =>
          function (_c) {
            const { ctx, natural, u } = _c;
            const mode =
              ctx.display === 'hidden'
                ? 'hidden'
                : ctx.display === 'toast'
                  ? 'toast'
                  : ctx.display === 'panel'
                    ? 'left'
                    : ctx.display === 'header'
                      ? 'top'
                      : natural;
            function briefing(parent, cls) {
              const b = u.el('aside', cls, parent);
              if (cls === 'ds-brief') u.el('h2', '', b, 'Help & Tips');
              const note = u.el('div', 'ds-instruction', b, ctx.instruction);
              if (ctx.display !== 'panel') {
                note.style.display = 'none';
                note.classList.add('is-hidden');
              }
              if (cls === 'ds-brief') {
                const tips = u.el('div', 'ds-tips', b);
                tips.innerHTML =
                  'Fill the form using the information in the document.<ul><li>Copy values exactly as they appear.</li><li>Leave a field blank if the document does not contain the information.</li><li>Use the date format shown in the field.</li><li>Select the closest match for any choice fields.</li></ul>';
                b.insertBefore(tips, note);
                const guide = u.el('div', 'ds-guide', b);
                guide.innerHTML =
                  '<h3>ⓘ Field Guide</h3><b>Claimant Name</b><br>Full name of the person filing the claim.<br><br><b>Date of Loss</b><br>Date the incident occurred (MM/DD/YYYY).<br><br><b>Type of Loss</b><br>Select the kind of incident.<br><br><b>Description of Loss</b><br>Brief details from the document.<br><br><b>Estimated Loss Amount</b><br>Enter the amount shown on the document.<br><br><b>Claim Number</b><br>Enter if provided in the document.';
              }
              return b;
            }
            Object.assign(_c, { briefing, mode });
          },
        'frame.41': () => () => {},
        'frame.44': (base, S) =>
          function (_c) {
            const { briefing, main, mode } = _c;
            {
              const b = briefing(main, 'ds-brief');
              if (mode === 'right') b.style.order = '2';
            }
          },
        'frame.46': () => () => {},
        'frame.47': () => () => {},
        'frame.48': () => () => {},
      },
    },
  });
})();
