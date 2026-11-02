// Thunderbird design with its compact, row-mapped message list and toolbar decoys.
(function () {
  'use strict';
  env.widget({
    task: 'use-email',
    site: 'design-use-email-important-10',
    name: 'design',
    split: 'train',
    scenarios: ['important'],
    template: 'use-email/mail',
    design: {
      rowHeight: 50,
      ledgerTitle: 'Mail - Inbox',
      importantLabel: 'Mark as Important',
      parts: {
        newButton: (base, S) => () => {
          const { toolbar } = S.els;
          const read = S.el('button', 'xtra read', toolbar, 'Mark as Read');
          read.type = 'button';
          read.addEventListener('click', (ev) => ev.stopPropagation());
          const move = S.el('button', 'xtra moveto', toolbar, 'Move To...');
          move.type = 'button';
          move.addEventListener('click', (ev) => ev.stopPropagation());
          S.el('span', '', move, '▼');
          return base();
        },
        occupiedKeep: (base, S) => (v) => v !== S.els.listWrap && getComputedStyle(v).position !== 'absolute',
        rowHeightPx: (base, S) => (avail) =>
          Math.floor(Math.min(avail / S.spec.rows, Math.max(22, (S.D.rowHeight * S.els.root.clientWidth) / 1672))),
        listSize: (base, S) => (avail, rowH) => {
          S.els.listWrap.style.flex = '1';
          S.els.list.style.paddingBottom = Math.max(0, avail - S.spec.rows * rowH) + 'px';
        },
        listboxOptions: (base, S) => (m, order, rowH) => {
          const options = base(m, order, rowH);
          options.onScroll = () => {
            const scroll = Math.max(0, Math.min(Math.max(0, order.length - S.spec.rows), Math.round(S.els.list.scrollTop / rowH)));
            if (scroll !== S.ctx.model.scroll) S.ctx.update({ ...S.ctx.model, scroll });
          };
          return options;
        },
        applyScroll: (base, S) => (m) => {
          S.els.list.scrollTop = (m.scroll || 0) * (parseFloat(S.els.root.style.getPropertyValue('--rowpx')) || 1);
          S.els.track.style.visibility = S.els.list.scrollHeight > S.els.list.clientHeight ? 'visible' : 'hidden';
        },
        paintClasses: (base, S) => (m) => {
          base(m);
          S.els.root.classList.toggle('recovering', S.fam.helpers.sideEffects(m, S.spec).length > 0);
        },
      },
    },
  });
})();
