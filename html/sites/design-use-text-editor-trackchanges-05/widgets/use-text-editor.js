env.widget({
  task: 'use-text-editor',
  site: 'design-use-text-editor-trackchanges-05',
  name: 'design',
  split: 'train',
  scenarios: ['trackchanges'],
  traits: { doc: 'prose' },
  template: 'use-text-editor/rich',
  design: {
    parts: {
      render: (base) => function (ctx) {
        const rendered = base(ctx);
        const bar = ctx.stage.querySelector('.tr-bar');
        if (bar) {
          const mode = bar.querySelector('.tr-mode');
          const menu = bar.querySelector('.tr-menu');
          if (mode && menu) bar.append(mode);
          const grow = bar.querySelector('.tr-grow');
          const undo = bar.querySelector('[title="Undo"]');
          const redo = bar.querySelector('[title="Redo"]');
          if (grow && undo && redo) { bar.insertBefore(undo, grow); bar.insertBefore(redo, grow); }
          for (const button of bar.querySelectorAll('button.tr-b')) {
            if (button.textContent.includes('Normal text')) { button.textContent = 'Paragraph ⌄'; button.classList.add('civic-paragraph'); }
            if (button.textContent === 'Find and replace') { button.classList.add('civic-find'); button.title = 'Find and replace'; }
          }
          const formatting = ctx.util.el('div', 'civic-format-tools');
          formatting.setAttribute('aria-hidden', 'true');
          const shapes = [
            '<circle cx="4" cy="6" r="1.5"/><circle cx="4" cy="12" r="1.5"/><circle cx="4" cy="18" r="1.5"/><path d="M9 6h12M9 12h12M9 18h12"/>',
            '<path d="M10 6h11M10 12h11M10 18h11"/><text x="1" y="8">1</text><text x="1" y="15">2</text><text x="1" y="22">3</text>',
            '<path d="M3 5h18M3 10h12M3 15h18M3 20h12"/>',
            '<path d="M3 5h18M6 10h12M3 15h18M6 20h12"/>',
            '<path d="M3 5h18M9 10h12M3 15h18M9 20h12"/>',
            '<path d="M3 5h18M3 10h18M3 15h18M3 20h18"/>',
            '<path d="m9 15 6-6M8 17l-2 2a4 4 0 0 1-5-5l5-5a4 4 0 0 1 5 0m2 6a4 4 0 0 0 5 0l5-5a4 4 0 0 0-5-5l-2 2"/>',
            '<path d="M3 3h18v14H9l-5 4v-4H3Z"/><path d="M7 7h10M7 10h10M7 13h6"/>',
          ];
          for (const shape of shapes) {
            const icon = ctx.util.el('span', '', formatting);
            icon.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">' + shape + '</svg>';
          }
          bar.insertBefore(formatting, undo || grow || bar.firstChild);
        }
        const margin = ctx.stage.querySelector('.tr-margin');
        if (margin) {
          const cards = [...margin.querySelectorAll('.tr-card')];
          const heading = ctx.util.el('header', 'civic-suggestion-head', null, cards.length + ' suggestions');
          margin.prepend(heading);
          const stageBox = ctx.stage.getBoundingClientRect();
          if (cards.length < 4 && stageBox.width > 1200 && stageBox.height > 560) {
            margin.classList.add('civic-review');
            for (const card of cards) { const actions = card.querySelector('.ac'); if (actions) card.append(actions); }
          }
        }
        return rendered;
      },
    },
    marginWidth: 300,
    minPageWidth: 360,
    maxPageWidth: 1600,
    fontSizes: [22, 21, 20, 19],
    fontFamilies: ["Arial, 'Segoe UI', sans-serif", "Arial, sans-serif", "Georgia, serif"],
    lineHeight: 1.45,
  },
});
