// Design of this site on the fill-form/document template (templates/fill-form/document.js): a profile
// card with a leaf drawing and a title, every document style shown as a contact, a three-column form on
// tabbed pages, a Clear button wired to the page footer, and fitting for exceptional cards.
(function () {
  'use strict';

  const LEAVES = [[119, 39, 8], [118, 64, -40], [126, 85, 28], [127, 110, -45], [139, 137, 24], [146, 169, -22], [68, 92, -60],
    [84, 120, 6], [99, 141, -65], [112, 163, -70], [45, 107, -85], [73, 121, 2], [92, 135, -62]];

  env.widget({
    task: 'fill-form',
    site: 'design-fill-form-card-08',
    name: 'design',
    split: 'train',
    scenarios: ['card'],
    template: 'fill-form/document',
    design: {
      parts: {
        // The entire action band can cover options, including its inert buttons.
        showList: () => (dd, btn, list, open) => {
          dd.classList.toggle('open', open);
          if (!open) return;
          dd.classList.remove('up');
          const r = btn.getBoundingClientRect();
          const end = document.querySelector('.ds-footer')?.getBoundingClientRect();
          const limit = end ? Math.min(window.innerHeight - 6, end.top - 8) : window.innerHeight - 6;
          const room = Math.max(r.top - 10, limit - r.bottom - 4);
          list.style.maxHeight = 'none';
          list.style.fontSize = '';
          const height = list.offsetHeight;
          if (height > room) {
            const font = parseFloat(getComputedStyle(list).fontSize);
            list.style.fontSize = Math.max(10, font * (room - 8) / height) + 'px';
          }
          const h = list.offsetHeight;
          if (r.bottom + 4 + h > limit && r.top - 4 - h > 6) dd.classList.add('up');
        },
        cardFill: (base) => (util, card, d) => {
          base(util, card, d);
          if (d.style !== 'contact') {
            const rows = [...d.rows, ...d.extras];
            const name = rows.find((r) => /^(name|full name)$/i.test(r.label));
            const first = rows.find((r) => /^(given name|first name)$/i.test(r.label));
            const last = rows.find((r) => /^(surname|family name|last name)$/i.test(r.label));
            const named = !!(first && last);
            card.replaceChildren();
            card.classList.remove('ff-profile');
            const box = util.el('div', 'ff-contact', card);
            const head = util.el('div', 'ff-chead', box);
            const heading = named ? first.value + ' ' + last.value : d.heading || (name && name.value) || d.issuer;
            util.el('div', 'ff-avatar', head, d.initials || heading.split(/[ ,]+/).filter(Boolean).slice(0, 2).map((s) => s[0]).join(''));
            const who = util.el('div', '', head);
            util.el('div', 'ff-doclabel', who, d.issuer);
            util.el('div', 'ff-cname', who, heading);
            if (d.subtitle || d.org) util.el('div', 'ff-csub', who, d.subtitle || d.org);
            if (named) util.el('div', 'ff-doclabel', who, first.label + ': ' + first.value + ' · ' + last.label + ': ' + last.value);
            const table = util.el('div', 'ff-ctable', box);
            for (const r of rows) {
              if ((r === name && !d.heading) || (named && (r === first || r === last))) continue;
              util.el('div', 'ff-doclabel', table, r.label);
              util.el('div', 'ff-v', table, r.value).style.whiteSpace = 'pre-line';
            }
          }
          {
            const table = card.querySelector('.ff-ctable');
            const who = card.querySelector('.ff-chead > div:last-child');
            const labels = [...table.querySelectorAll('.ff-doclabel')];
            const mail = labels.find((x) => /e-?mail/i.test(x.textContent));
            if (mail) {
              const value = mail.nextElementSibling;
              const line = util.el('div', 'ff-csub qf-mail', who);
              line.textContent = mail.textContent + ': ' + value.textContent;
              mail.remove(); value.remove();
            }
            for (const label of [...table.querySelectorAll('.ff-doclabel')]) {
              const value = label.nextElementSibling;
              const detail = util.el('div', 'qf-detail', table);
              if (value.textContent.length + label.textContent.length > 16 || value.textContent.includes('\n')) detail.classList.add('qf-detail-wide');
              detail.append(label, value);
            }
          }
        },
        panes: () => (ctx, R) => {
          const { util } = ctx;
          const t = util.el('div', 'qf-title', R.docPane);
          util.el('div', 'qf-title-h', t, 'Contact Profile');
          util.el('div', 'qf-title-s', t, 'Use the details below to complete the form.');
          const lf = util.el('div', 'qf-leaf', R.docPane);
          let lv = '<svg viewBox="0 0 170 215" preserveAspectRatio="xMaxYMin meet"><g fill="none" stroke="#b4a37d" stroke-width="1.6"><path d="M159 214 Q102 156 68 92 M165 198 Q133 139 121 80 Q114 41 119 0 M130 163 Q89 132 32 101"/>';
          LEAVES.forEach(([x, y, a]) => {
            lv += '<g transform="translate(' + x + ' ' + y + ') rotate(' + a + ')"><path d="M0 0 Q-12 -15 0 -36 Q11 -17 0 0Z" fill="#dfd6bd" fill-opacity=".35"/><path d="M0 0 Q2 -19 0 -36 M1 -10 L-4 -18 M1 -17 L5 -25" stroke-width=".7"/></g>';
          });
          lf.innerHTML = lv + '</g></svg>';
        },
        arranged: (base, S) => (ctx, R) => {
          const { spec } = ctx;
          const L = spec.layout;
          const br = document.querySelector('.ds-brief');
          if (br) R.formPane.insertBefore(br, R.formPane.firstChild);
          R.root.classList.toggle('qf-dense', spec.fields.length > 4);
          R.root.classList.toggle('qf-many', spec.fields.length > 6);
          if (L.tabs && spec.fields.length > 6) R.formPane.querySelector('.ff-grid').style.setProperty('grid-template-columns', 'repeat(3,minmax(0,1fr))', 'important');
          const clearForm = document.querySelector('.ds-clear');
          if (clearForm) {
            clearForm.onclick = () => {
              const fields = {};
              for (const f of spec.fields) {
                fields[f.id] = f.kind === 'checkbox' ? false : '';
                const x = S.el[f.id];
                if (x.input) { x.input.value = ''; x.input.parentElement.classList.remove('filled'); }
                if (x.w && typeof x.w.set === 'function') { if (f.kind === 'checkbox') x.w.set([]); else x.w.set(null); }
                for (const input of R.root.querySelectorAll('input[type="radio"],input[type="checkbox"]')) input.checked = false;
                if (x.dd) {
                  x.dd.querySelector('.ff-ddval').textContent = 'Select…';
                  x.dd.querySelector('.ff-ddval').classList.add('empty');
                  x.dd.classList.remove('open');
                  for (const o of Object.values(x.opts)) o.classList.remove('sel');
                }
              }
              ctx.update({ ...ctx.model, fields, open: null });
            };
          }
        },
        // Fit exceptional cards before anchors are captured. The normal reference layout is untouched.
        fit: (base) => (ctx, R) => {
          const grid = R.formPane.querySelector('.ff-grid');
          const formOverflows = () => grid.getBoundingClientRect().bottom > R.formPane.getBoundingClientRect().bottom - 6;
          if (formOverflows()) R.root.classList.add('qf-tight');
          if (formOverflows()) R.root.classList.add('qf-tightest');
          base(ctx, R);
        },
      },
    },
  });
})();
