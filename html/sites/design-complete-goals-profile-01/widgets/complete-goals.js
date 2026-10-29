// Design of this site on the composition/sections template (templates/complete-goals/sections.js).
env.widget({
  task: 'complete-goals',
  site: 'design-complete-goals-profile-01',
  name: 'design',
  split: 'train',
  scenarios: ['profile'],
  template: 'complete-goals/sections',
  design: {
    wrapPadding: '24px 0 14px', headingGap: '0', titleSize: '0px', subtitleSize: '0px',
      labelSize: '0px', cardRadius: '0px', cardPadding: '16px 26px 24px',
      cardBackground: '#fff', gapRange: [24, 24], columnRange: [720, 900], gridMinWidth: 0,
      heightRange: [650, 650], heightInset: 0, cardInset: 0, minBoxHeight: 150,
      contentMargin: 18, growMargin: 12,
    parts: {
      frame: (base, S) => (ctx, look, at, W) => {
        const host = base(ctx, look, at, W);
        host.classList.add('profile-layout');
        return host;
      },
      heading: () => () => {},
      card: (base) => (ctx, host, part, i, look) => {
        const card = document.createElement('section');
        card.className = 'cp-card cards profile-card';
        card.dataset.task = part.task;
        card.dataset.partIndex = String(i);
        host.append(card);
        return card;
      },
      label: () => (ctx, card, part) => {
        const title = part.task === 'pick-color' ? 'Color' : part.task === 'type-text' ? 'Details' : 'Publishing';
        const label = document.createElement('h2');
        label.className = 'profile-card-title';
        label.textContent = title;
        card.append(label);
        return label;
      },
      box: (base) => (ctx, card, part, i) => {
        const box = document.createElement('div');
        box.className = 'cp-box profile-box';
        box.dataset.part = String(i);
        card.append(box);
        return box;
      },
      boxWidth: (base, S) => (ctx, look, at) => {
        const box = S.st.host.lastElementChild.querySelector('.profile-box');
        return Math.floor(box.getBoundingClientRect().width) || base(ctx, look, at);
      },
    },
  },
});
