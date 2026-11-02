// Design on the shared transfer-items/dual template.
env.widget({
  task: 'transfer-items',
  site: 'design-transfer-items-ordered-05',
  name: 'design',
  split: 'train',
  scenarios: ['ordered'],
  template: 'transfer-items/dual',
  design: {
    title: 'Bundle items', note: '', leftLabel: 'Available', rightLabel: 'Selected',
    cardPadding: '28px', buttonHeight: 52, buttonColumnWidth: 82, orderColumnWidth: 50, columnGap: 14,
    fontSizes: { title: 36, note: 0, head: 20, count: 0, filter: 13, index: 11.5, more: 12, button: 20, order: 22, status: 0, ghost: 14, row: 18, compact: 16 },
    parts: {
      locate: (base, S) => (target) => {
        let row = null;
        if (target.item !== undefined) row = S.st.rows.L.get(target.item) || S.st.rows.R.get(target.item);
        if (target.slot !== undefined) row = S.st.rows.R.get(S.st.ctx.model.right[target.slot]);
        if (row) {
          const list = row.parentElement;
          const top = row.offsetTop;
          if (top < list.scrollTop) list.scrollTop = top;
          else if (top + row.offsetHeight > list.scrollTop + list.clientHeight)
            list.scrollTop = top + row.offsetHeight - list.clientHeight;
        }
        return base(target);
      },
      rowContent: (base, S) => (ctx, el, key, x, i) => {
        const shapes = [
          '<path d="M14 34l12-19 9 3-7 18 10 9-8 12-13-8-10 12-10-9 13-19z" fill="#32383b"/><circle cx="31" cy="18" r="5" fill="#14191d"/>',
          '<rect x="20" y="11" width="22" height="53" rx="4" fill="#bec5c5" stroke="#626b6d"/><rect x="24" y="5" width="14" height="9" rx="2" fill="#252a2b"/>',
          '<path d="M7 21h52v39H7z" fill="#303537" stroke="#171b1d"/><path d="M7 21l10-8h32l10 8M20 21v39M46 21v39" fill="none" stroke="#596064" stroke-width="2"/>',
          '<path d="M5 39c10-20 19-19 29-7 8 9 14 2 22 8 7 6 3 17-8 17H15C4 57 1 48 5 39z" fill="#168af1"/><path d="M17 31c-4 5-4 15 0 21m20-21c-4 5-4 15 0 21" stroke="#72baff" fill="none"/>',
          '<path d="M17 20h30l11 28-11 13H18L6 48z" fill="#272c2f"/><circle cx="25" cy="45" r="7" fill="#111719"/><circle cx="25" cy="45" r="3" fill="#798389"/>',
          '<path d="M7 10h22v23H7zm27 0h22v23H34zM7 37h22v23H7zm27 0h22v23H34z" fill="#303639" stroke="#202528"/>',
          '<rect x="18" y="9" width="30" height="54" rx="5" fill="#b2271d" stroke="#5e1b17"/><ellipse cx="33" cy="53" rx="10" ry="8" fill="#df3c24"/><path d="M23 22h20v13H23z" fill="#f8e4b5"/>',
          '<path d="M5 22 55 11l5 43L10 62z" fill="#2c3235" stroke="#111"/><path d="M11 33l47-8M13 47l45-8M21 18l5 39M42 14l5 39" stroke="#50585d"/>',
          '<path d="M7 41c15 0 17-16 29-16 7 0 10 9 19 11l5 10c-4 9-13 13-24 12H15C5 57 2 48 7 41z" fill="#252a2c" stroke="#111"/>',
          '<path d="M7 12h50v45H7z" fill="none" stroke="#20262a" stroke-width="4"/><path d="M7 12 57 57M57 12 7 57M19 12v45m13-45v45m13-45v45M7 27h50M7 42h50" stroke="#20262a" stroke-width="1.5"/>'
        ];
        const thumb=ctx.util.el('span','tl-thumb',el);
        thumb.innerHTML=`<svg viewBox="0 0 66 70" aria-hidden="true">${shapes[(key==='L'?i:i+6)%shapes.length]}</svg>`;
        ctx.util.el('span','tl-item-name',el,x);
      },
      button: (base, S) => (ctx, parent, key, text) => {
        const b=base(ctx,parent,key,text);
        if (key==='up'||key==='down') b.innerHTML=key==='up'?'↑':'↓';
        return b;
      }
    }
  },
});
