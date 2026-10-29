// Keeps this site's proportional font sizing and title-led sections on the shared phrase design.
env.widget({
  task: 'select-text',
  site: 'design-select-text-phrase-06',
  name: 'design',
  split: 'train',
  scenarios: ['phrase'],
  traits: { pane: true, marks: true },
  template: 'select-text/paragraphs',
  design: {
    headings: null,
    clearSelection: true,
    parts: {
      font: () => (ctx) => Math.min(28, (28 * ctx.size.width) / 1110),
      textCreated: (base, S) => (ctx) => {
        const title = S.head.querySelector('.hl-title').textContent;
        const documentTitle = ctx.util.el('h1', 'document-title', S.textEl, title);
        documentTitle.dataset.skip = '';
      },
      paneChrome: (base, S) => () => [...S.card.children]
        .filter((child) => child !== S.pane.parentElement)
        .reduce((height, child) => height + child.getBoundingClientRect().height, 0)
        + S.pane.parentElement.offsetHeight
        - S.pane.offsetHeight,
      overflows: (base, S) => (ctx, room) => {
        if (!S.D.sections) return S.card.getBoundingClientRect().height > room;
        return S.textEl.scrollHeight > S.textEl.clientHeight + 1 || [...S.textEl.querySelectorAll('.hl-section')].some((section) => {
          const box = section.getBoundingClientRect();
          const last = section.lastElementChild.getBoundingClientRect();
          return last.bottom - box.top + parseFloat(getComputedStyle(section).paddingBottom) > box.height + 1;
        });
      },
    },
  },
});
