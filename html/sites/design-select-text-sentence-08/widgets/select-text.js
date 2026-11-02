// Sentence design: stage-sized article, sentence-count metadata, and the original preview and fit behavior.
env.widget({
  task: 'select-text',
  site: 'design-select-text-sentence-08',
  name: 'design',
  split: 'train',
  scenarios: ['sentence'],
  traits: { pane: true, marks: true, triple: true },
  template: 'select-text/paragraphs',
  design: {
    clearSelection: true,
    parts: {
      width: (base) => (ctx) => ctx.stage.clientWidth || ctx.size.width - 44,
      font: (base) => (ctx, width) => Math.min(24, Math.round(width / 49)),
      meta: (base) => (ctx) => {
        const sentenceCount = ctx.spec.paragraphs.reduce((n, p) => n + (p.match(/[.!?](?=\s|$)/g) || []).length, 0);
        return `${ctx.spec.paragraphs.length} paragraphs • ${sentenceCount} sentences`;
      },
      paragraphsAfter: (base) => (ctx) => {
        const pv = document.querySelector('.preview-body');
        if (!pv) return;
        for (const ptext of ctx.spec.paragraphs) ctx.util.el('p', '', pv, ptext);
        let previewFont = parseFloat(getComputedStyle(pv).fontSize);
        const available = pv.parentElement.clientHeight - pv.previousElementSibling.offsetHeight;
        const contentHeight = () => {
          const css = getComputedStyle(pv);
          return parseFloat(css.paddingTop) + parseFloat(css.paddingBottom) +
            [...pv.children].reduce((sum, p) => sum + p.offsetHeight + parseFloat(getComputedStyle(p).marginBottom), 0);
        };
        if (contentHeight() > available) {
          for (const p of pv.children) p.style.marginBottom = '8px';
          pv.lastElementChild.style.marginBottom = '0';
        }
        while (contentHeight() > available && previewFont > 7) {
          previewFont -= 0.5;
          pv.style.fontSize = previewFont + 'px';
        }
      },
      fitPane: (base, S) => (ctx, room) => {
        S.pane.style.height = '0px';
        const full = () => S.textEl.getBoundingClientRect().height;
        const chrome = () => S.head.offsetHeight + 2;
        while (S.font > 13 && chrome() + 0.45 * full() > room) {
          S.font--;
          S.P.fit(ctx);
        }
        const avail = room - chrome();
        const view = Math.floor(Math.min(avail, Math.max(160, full() * ctx.rng.float(0.4, 0.62))));
        S.pane.style.height = view + 'px';
      },
      fitFull: (base, S) => (ctx) => {
        let paragraphGap = ctx.stage.clientHeight * 0.18;
        S.textEl.style.setProperty('--hl-gap', paragraphGap + 'px');
        const available = S.card.clientHeight - S.head.offsetHeight;
        while (S.textEl.offsetHeight > available && paragraphGap > 12) {
          paragraphGap -= 2;
          S.textEl.style.setProperty('--hl-gap', paragraphGap + 'px');
        }
        while (S.textEl.offsetHeight > available && S.font > 10) {
          S.font--;
          S.P.fit(ctx);
        }
      },
    },
  },
});
