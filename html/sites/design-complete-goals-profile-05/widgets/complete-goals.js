// Design of this site on the composition/sections template (templates/complete-goals/sections.js).
env.widget({
  task: 'complete-goals',
  site: 'design-complete-goals-profile-05',
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
        // Empty record sections are part of the application, even when an episode
        // only assigns work to two of the three profile sections.
        const el = ctx.util.el;
        const record = (task, title) => {
          const card = el('section', 'profile-record', host);
          card.dataset.record = task;
          card.setAttribute('aria-hidden', 'true');
          el('h2', 'profile-card-title', card, title);
          return el('div', 'record-content', card);
        };
        const info = record('type-text', 'Profile Information');
        for (const name of ['Employer:', 'Username:', 'Birth Date:']) {
          const row = el('div', 'record-field', info);
          el('span', '', row, name);
          el('span', 'record-input', row);
          if (name === 'Birth Date:') el('span', 'record-calendar', row, '▦');
        }
        const prefs = record('choose-option', 'Email Preferences');
        el('div', '', prefs, 'Report Frequency:');
        for (const name of ['Weekly', 'Every two weeks', 'Monthly']) {
          const row = el('div', 'record-choice', prefs);
          el('i', '', row);
          el('span', '', row, name);
        }
        const color = record('pick-color', 'Profile Color');
        el('span', 'record-color-label', color, 'Choose a color:');
        const palette = el('div', 'record-palette', color);
        for (const value of ['#cc3e40', '#126ed0', '#359849', '#ffdb21', '#f68024', '#773bb3', '#9c9fa2', '#bcae91']) {
          el('i', '', palette).style.background = value;
        }
        el('span', 'record-preview-label', color, 'Preview:');
        el('div', 'record-preview', color);
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
        const title = part.task === 'pick-color' ? 'Profile Color' : part.task === 'type-text' ? 'Profile Information' : 'Email Preferences';
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
      rendered: (base, S) => ctx => {
        base(ctx);
        // Fit the embedded widget's actual visible content inside its allotted
        // panel before the template publishes its anchors. No model changes.
        for (const entry of S.st.parts) {
          const box = entry.box;
          const panel = entry.card.getBoundingClientRect();
          const origin = box.getBoundingClientRect();
          let right = origin.left;
          let bottom = origin.top;
          for (const node of box.querySelectorAll('*')) {
            if (node.closest('.fp-pop')) continue;
            if (node.children.length && !node.matches('input,textarea,button,svg,.cp-hit,.cp-swatch,.cp-preset')) continue;
            const style = getComputedStyle(node);
            if (style.display === 'none' || style.visibility === 'hidden') continue;
            const rect = node.getBoundingClientRect();
            if (!rect.width || !rect.height) continue;
            right = Math.max(right, rect.right);
            bottom = Math.max(bottom, rect.bottom);
          }
          const roomW = Math.max(1, panel.right - origin.left - 8);
          const roomH = Math.max(1, panel.bottom - origin.top - 8);
          const scale = Math.min(1, roomW / Math.max(1, right - origin.left), roomH / Math.max(1, bottom - origin.top));
          if (scale < 1) box.style.zoom = String(scale);
        }
      },
    },
  },
});
