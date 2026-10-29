// This design stacks each contact's address under the name and fits email and phone text to their columns.
env.widget({
  task: 'find-fact',
  site: 'design-find-fact-phone-book-07',
  name: 'design',
  split: 'train',
  scenarios: ['phone-book'],
  template: 'find-fact/phone-book',
  design: {
    headers: ['Name', 'Email', 'Phone'],
    widths: ['28%', '40%', '32%'],
    props: ['email', 'phone'],
    parts: {
      row: (base, S) => (ctx, B, tr, c, i, picked, els) => {
        const { util } = ctx;
        const nameCell = util.el('td', 'name', tr);
        util.el('span', 'ol-person', nameCell, c.name);
        const address = util.el('div', 'ol-address', nameCell);
        els.push(S.P.link(ctx, address, c, i, 'address', picked.has(`${i}:address`)));
        for (const prop of S.D.props) {
          els.push(S.P.link(ctx, util.el('td', '', tr), c, i, prop, picked.has(`${i}:${prop}`)));
        }
      },
      rowsRendered: (base, S) => (ctx, B) => {
        const { results } = B;
        const measure = document.createElement('canvas').getContext('2d');
        for (const el of results.querySelectorAll('td > .rl-link, .ol-person')) {
          const cell = el.closest('td');
          const cs = getComputedStyle(cell);
          const baseSize = parseFloat(cs.fontSize);
          measure.font = `${baseSize}px Arial`;
          const available = cell.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
          const fit = Math.min(baseSize, (baseSize * (available - 4)) / Math.max(1, measure.measureText(el.textContent).width));
          el.style.setProperty('font-family', 'Arial, sans-serif', 'important');
          el.style.setProperty('font-size', `${Math.max(11, fit)}px`, 'important');
          if (fit >= 11) el.style.whiteSpace = 'nowrap';
        }
      },
    },
  },
});
