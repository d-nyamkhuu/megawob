// Design of this site on click-control/controls: add numbered accordion headers and the page's section count.
env.widget({
  task: 'click-control',
  site: 'design-click-control-collapsible-06',
  name: 'design',
  split: 'train',
  scenarios: ['collapsible'],
  traits: { menuOpen: ['hover', 'click'] },
  template: 'click-control/controls',
  design: {
    parts: {
      colHeader: () => (ctx, sec, h, s, i) => {
        h.innerHTML = '<span class="a"><svg viewBox="0 0 16 21" aria-hidden="true"><path d="M2 1L15 10.5L2 20Z"/></svg></span>';
        const numM = /\d+/.exec(s.title);
        ctx.util.el('span', '', h.firstChild, numM ? numM[0] : String(i + 1));
        ctx.util.el('span', 'c', h, s.title);
        ctx.util.el('span', 'c s', h, ((i * 3 + 3) % 5 + 2) + ' items');
        ctx.util.el('span', 'c s', h, 'Apr ' + (10 + i) + ', 2000');
      },
      colBuilt: () => (ctx) => {
        const count = document.querySelector('.mac .foot .ready');
        if (count) count.textContent = ctx.spec.sections.length + ' sections';
      },
    },
  },
});
