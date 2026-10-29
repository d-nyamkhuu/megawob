// Sentence article design with this site's preview fill and seeded stage-fit room.
env.widget({
  task: 'select-text',
  site: 'design-select-text-sentence-12',
  name: 'design',
  split: 'train',
  scenarios: ['sentence'],
  traits: { pane: true, marks: true },
  template: 'select-text/paragraphs',
  design: {
    parts: {
      paragraphsAfter: (base) => (ctx) => {
        base(ctx);
        const prev = document.querySelector('.xp-prev');
        if (prev && !prev.children.length) {
          ctx.spec.paragraphs.forEach((text, i) => ctx.util.el('p', '', prev, `Paragraph ${i + 1}: ${text}`));
        }
        for (const box of [prev, document.querySelector('.xp-side .task-note')]) {
          if (!box || !box.clientHeight) continue;
          let fontSize = parseFloat(getComputedStyle(box).fontSize);
          while (box.scrollHeight > box.clientHeight + 1 && fontSize > 8) {
            fontSize -= 0.5;
            box.style.fontSize = fontSize + 'px';
          }
        }
      },
      room: (base, S) => (ctx) => Math.max(0,
        Math.min(ctx.size.height, ctx.stage.clientHeight) -
          parseFloat(getComputedStyle(S.card).marginTop) - 2),
    },
  },
});
