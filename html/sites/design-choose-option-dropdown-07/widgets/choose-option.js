// Preserves this site's task-form backdrop, label sizing, and custom dropdown chevron.
(function () {
  'use strict';

  env.widget({
    task: 'choose-option',
    site: 'design-choose-option-dropdown-07',
    name: 'design',
    split: 'train',
    scenarios: ['dropdown'],
    template: 'choose-option/widgets',
    design: {
      motif: false,
      chevron: '<svg class="fp-chev" viewBox="0 0 30 38"><path d="M7 15h16l-8 9z" fill="#111"/></svg>',
      parts: {
        details: () => (ctx) => {
          const { util } = ctx;
          const S = (cls, txt, pos, par) => {
            const e = util.el('div', 'bt-s ' + cls, par || ctx.stage, txt);
            Object.keys(pos).forEach((k) => (e.style[k] = 'calc(var(--u)*' + pos[k] + ')'));
            return e;
          };
          const editable = (e, value) => {
            const input = util.el('input', 'bt-edit', e);
            input.type = 'text';
            input.value = value;
            return input;
          };
          S('bt-lbl', 'Title:', { left: 26, top: 70 });
          editable(S('bt-inp', '', { left: 165, top: 64, width: 545, height: 45 }), 'Prepare quarterly report');
          S('bt-lbl', 'Description:', { left: 26, top: 134 });
          const ta = S('bt-inp bt-ta', 'Gather revenue data, update charts, and prepare for review meeting.', {
            left: 167,
            top: 131,
            width: 568,
            height: 155,
          });
          util.el('i', 'bt-sb up', ta);
          util.el('i', 'bt-sb dn', ta);
          S('bt-lbl', 'Priority:', { left: 771, top: 140 });
          S('bt-lbl', 'Due Date:', { left: 771, top: 208 });
          editable(S('bt-inp bt-xtra', '', { left: 899, top: 132, width: 244, height: 40 }), 'Medium');
          editable(S('bt-inp bt-xtra', '', { left: 899, top: 200, width: 244, height: 40 }), 'Apr 24, 1991');
          S('bt-lbl', 'Status:', { left: 771, top: 298 });
          const sel = S('bt-inp bt-sel', '', { left: 899, top: 294, width: 244, height: 40 });
          editable(sel, 'Not Started');
          util.el('i', 'bt-chev', sel);
          S('bt-lbl', 'Attachments:', { left: 26, top: 316 });
          const al = S('bt-inp bt-att', '', { left: 26, top: 354, width: 530, height: 148 });
          [
            ['revenue-plan.pdf', 'pdf'],
            ['chart-draft.xlsx', 'xls'],
          ].forEach((a) => {
            const r = util.el('div', 'bt-file', al);
            const icon = util.el('i', 'bt-fi ' + a[1], r);
            icon.innerHTML =
              '<svg viewBox="0 0 34 38"><path d="M9 2h17l7 7v27H9z" fill="#fff" stroke="#46505d" stroke-width="1.6"/><path d="M26 2v8h7" fill="#d8dee8" stroke="#46505d" stroke-width="1.4"/><path d="M14 15h13M14 20h13M14 26h13M14 31h13" stroke="#9aa2b0"/><rect x="1" y="7" width="20" height="12" fill="' +
              (a[1] === 'pdf' ? '#cd3434' : '#1760b3') +
              '" stroke="#46505d"/><path d="M3 9h15" stroke="#fff" stroke-width="2"/>' +
              (a[1] === 'pdf'
                ? '<path d="M16 28q8-18 3-13q0 12 11 11q-8-6-14 2" fill="none" stroke="#d33"/>'
                : '<rect x="5" y="10" width="7" height="6" fill="none" stroke="white"/><path d="M18 22h10v8H18zM23 22v8M18 26h10" fill="none" stroke="#517398"/>') +
              '</svg>';
            util.el('span', '', r, a[0]);
          });
          ['Add...', 'Remove', 'Open'].forEach((t, i) => {
            S('bt-btn', t, { left: 581, top: 354 + i * 53, width: 148, height: 40 });
          });
          S('bt-rule', '', { left: 26, top: 536, right: 22 });
        },
        heading: () => (ctx, card) => {
          ctx.util.el('div', 'fp-note', card, ctx.spec.note);
        },
        label: (base) => (ctx, field) => {
          const label = base(ctx, field);
          if (ctx.spec.label.length > 11) label.classList.add('fp-long-label');
          return label;
        },
      },
    },
  });
})();
