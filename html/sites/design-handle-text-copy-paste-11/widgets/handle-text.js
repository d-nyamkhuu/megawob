// Site design on templates/handle-text/editor.js; shared behavior and part signatures are documented there.
env.widget({
  task: 'handle-text',
  site: 'design-handle-text-copy-paste-11',
  name: 'design',
  split: 'train',
  scenarios: ['copy-paste'],
  template: 'handle-text/editor',
  design: {
    parts: {
      rendered: (base, S) => (ctx, view) => {
        const boxes = view.card.querySelector('.ut-boxes');
        if (!boxes) return;
        const texts = [...boxes.querySelectorAll('.ut-text')];
        if (boxes.scrollHeight <= boxes.clientHeight + 2 && texts.every(el =>
          el.scrollHeight <= el.clientHeight + 2 && el.scrollWidth <= el.clientWidth + 2)) return;
        const sizes = texts.map(el => parseFloat(getComputedStyle(el).fontSize));
        for (const el of texts) {
          Object.assign(el.style, {height: 'auto', minHeight: '32px', overflow: 'visible',
            whiteSpace: 'pre-wrap', overflowWrap: 'anywhere'});
          for (const row of el.querySelectorAll('.ut-ln')) {
            Object.assign(row.style, {minHeight: '0', lineHeight: 'inherit'});
            for (const span of row.querySelectorAll('span:not(.ut-num)'))
              Object.assign(span.style, {minWidth: '0', whiteSpace: 'pre-wrap', overflowWrap: 'anywhere'});
          }
        }
        if (boxes.scrollHeight > boxes.clientHeight + 2) {
          boxes.style.gap = '5px';
          texts.forEach(el => Object.assign(el.style, {padding: '4px 7px', lineHeight: '1.25', minHeight: '26px'}));
          for (let scale = .95; scale >= .6 && boxes.scrollHeight > boxes.clientHeight + 2; scale -= .05)
            texts.forEach((el, i) => { el.style.fontSize = Math.max(11, sizes[i] * scale) + 'px'; });
        }
      },
    },
  },
});
