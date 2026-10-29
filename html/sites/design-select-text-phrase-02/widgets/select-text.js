// Design on templates/select-text/paragraphs.js.
env.widget({
  task: 'select-text',
  site: 'design-select-text-phrase-02',
  name: 'design',
  split: 'train',
  scenarios: ['phrase'],
  traits: { pane: true, marks: true },
  template: 'select-text/paragraphs',
  design: {
    fontMax: 30, fontDivisor: 50, lineHeight: 1.43, clearSelection: true, dragEndpoints: 'checked',
    parts: {
      selectionBound: () => (ctx, textEl, selection) => {
        const locate = selection.locate.bind(selection);
        selection.locate = (t) => {
          const point = locate(t);
          if (t.char === undefined || !document.caretRangeFromPoint) return point;
          const wanted = t.char + (t.edge === 'after' ? 1 : 0);
          const x = Math.round(point[0]), y = Math.round(point[1]);
          const hits = (px) => {
            const caret = document.caretRangeFromPoint(px, y);
            return caret && textEl.contains(caret.startContainer) &&
              selection.offsetAt(caret.startContainer, caret.startOffset) === wanted;
          };
          if (hits(x)) return [x, y];
          for (let delta = 1; delta <= 12; delta++) {
            if (hits(x - delta)) return [x - delta, y];
            if (hits(x + delta)) return [x + delta, y];
          }
          return point;
        };
      },
    },
  },
});
