env.widget({
  task: 'type-text',
  site: 'design-type-text-single-07',
  name: 'design',
  split: 'train',
  scenarios: ['single'],
  template: 'type-text/fields',
  design: {
    layout: 'inline',
    title: 'Verification',
    parts: {
      // A partner-portal page around the card: title bar, instruction rows, buttons, an activity table.
      finish: (base, S) => (ctx, card) => {
        const { st } = S;
        const U = ctx.util, stg = st.host;
        const tbar = U.el('div', 'dt-title', stg, 'Partner Access Verification');
        stg.insertBefore(tbar, card);
        const intro = U.el('p', 'dt-intro', stg, 'For security, please complete the verification below to continue to the requested resource.');
        stg.insertBefore(intro, card);
        const wrapC = U.el('div', 'dt-wrap', stg);
        stg.insertBefore(wrapC, card);
        wrapC.appendChild(card);
        const irow = U.el('div', 'dt-row dt-instr', card);
        U.el('div', 'dt-l', irow, 'Instruction');
        const itxt = ctx.instruction || (document.querySelector('.ds-instruction') || {}).textContent || '';
        U.el('div', 'dt-v', irow, itxt);
        if (!itxt) irow.style.display = 'none';
        card.insertBefore(irow, card.querySelector('.ft-grid'));
        [['Purpose', 'Confirms partner access for order management.'], ['Reference', 'REQ-4492']].forEach(([a, b]) => {
          const r = U.el('div', 'dt-row', card);
          U.el('div', 'dt-l', r, a);
          U.el('div', 'dt-v', r, b);
        });
        const btns = U.el('div', 'dt-btns', wrapC);
        const sub = document.querySelector('.ds-submit');
        if (sub) btns.appendChild(sub);
        const clr = U.el('button', 'dt-clear', btns, 'Clear');
        clr.type = 'button';
        clr.addEventListener('click', () => {
          for (const [id, x] of Object.entries(st.inputs)) { x.w.set(''); }
          S.update({ fields: Object.fromEntries(Object.keys(st.inputs).map((id) => [id, ''])), saved: false });
        });
        const act = U.el('div', 'dt-act', wrapC);
        U.el('div', 'dt-acth', act, 'Recent Access Activity');
        const tb = U.el('table', 'dt-tab', act);
        const hr = U.el('tr', '', U.el('thead', '', tb));
        ['Date / Time', 'User', 'Action', 'Status'].forEach((t) => U.el('th', '', hr, t));
        const tbody = U.el('tbody', '', tb);
        [['Mar 12, 1999 08:14', 'Viewed Inventory'], ['Mar 12, 1999 07:52', 'Updated Order 3387'], ['Mar 11, 1999 16:03', 'Viewed Reports'], ['Mar 11, 1999 11:27', 'Logged In']].forEach(([d, a]) => {
          const r = U.el('tr', '', tbody);
          U.el('td', '', r, d);
          U.el('td', '', r, 'jcarter');
          U.el('td', '', r, a);
          U.el('td', '', r, 'Success');
        });
      },
    },
  },
});
