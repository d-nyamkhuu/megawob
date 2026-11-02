// Design on the shared avoid-dark-patterns/browser template.
env.widget({
  task: 'avoid-dark-patterns',
  site: 'design-avoid-dark-patterns-nag-03',
  name: 'design',
  split: 'train',
  scenarios: ['nag'],
  template: 'avoid-dark-patterns/browser',
  design: {
    parts: {
      pageFor(base, S) {
        return (sid, parent, m) => {
          if (parent.clientWidth < 560 || parent.clientHeight < 360) return base(sid, parent, m);
          const { el } = S.ctx.util;
          const P = S.P;
          const sc = S.spec.screens[sid];
          const page = el('div', 'garden-page', parent);
          page.style.height = Math.min(parent.clientHeight, S.ctx.size.height) + 'px';
          const overview = el('section', 'garden-overview', page);
          const photo = el('img', 'garden-hero-photo', overview);
          photo.src = 'sites/design-avoid-dark-patterns-nag-03/assets/plant-1.jpg';
          photo.alt = '';
          const detail = el('div', 'garden-overview-copy', overview);
          el('h1', 'garden-plant-title', detail, 'Sweet basil');
          el('div', 'garden-scientific', detail, 'Ocimum basilicum');
          const chips = el('div', 'garden-chips', detail);
          for (const label of ['Herb', 'Annual', 'Full sun']) el('span', 'garden-chip', chips, label);
          el('p', 'garden-description', detail, 'A fragrant, fast-growing herb with bright green leaves. Great for pesto, salads and a wide range of dishes. Easy to grow in containers or in the garden.');
          const facts = el('aside', 'garden-facts', overview);
          for (const row of [['☼','Sunlight','Full sun (6+ hours)'],['♧','Water','Keep soil moist'],['♙','Height','30–60 cm'],['▱','Good for','Containers, garden beds']]) {
            const item = el('div', 'garden-fact', facts);
            el('span', 'garden-fact-icon', item, row[0]);
            const copy = el('span', '', item);
            el('b', '', copy, row[1]); el('span', '', copy, row[2]);
          }
          const collections = el('section', 'garden-collections', page);
          el('h2', '', collections, 'Add to a list');
          const choices = el('div', 'garden-choice-list', collections);
          // The botanical overview replaces the template's decorative media block.
          P.blocks(sc.blocks.filter(block => block.t !== 'media'), choices, m);
          if (sc.side) {
            const side = el('div', 'garden-extra', choices);
            P.blocks(sc.side, side, m);
          }
          // Keep unusually long or narrow seeded screens in the template's fitted layout.
          if (page.scrollHeight > page.clientHeight + 1) {
            page.remove();
            return base(sid, parent, m);
          }
        };
      },
      modalEl(base, S) {
        return (parent, md) => {
          const { el } = S.ctx.util;
          const P = S.P;
          const dlg = el('section', 'garden-nag', parent);
          dlg.style.setProperty('--garden-scale', Math.min(1, parent.clientHeight / 700, parent.clientWidth / 620));
          const brand = el('div', 'garden-nag-brand', dlg, 'Gardenly');
          el('span', 'garden-leaf-mark', brand, '');
          const close = el('span', 'garden-nag-close', dlg, '×');
          close.setAttribute('aria-hidden', 'true');
          el('h2', '', dlg, md.title || 'Get the most from Gardenly');
          if (md.text) el('p', 'garden-nag-text', dlg, md.text);
          const benefits = el('div', 'garden-benefits', dlg);
          for (const row of [['♧','Personalised growing advice'],['♜','Seasonal reminders'],['☆','New plant guides and offers']]) {
            const item = el('div', 'garden-benefit', benefits);
            el('span', '', item, row[0]); el('span', '', item, row[1]);
          }
          const actions = el('div', 'garden-nag-actions', dlg);
          for (const id of md.ctls) P.ctlBtn(id, actions);
          return dlg;
        };
      }
    }
  },
});
