// Site design on templates/handle-text/editor.js; shared behavior and part signatures are documented there.
env.widget({
  task: 'handle-text',
  site: 'design-handle-text-copy-paste-2-07',
  name: 'design',
  split: 'train',
  scenarios: ['copy-paste-2'],
  template: 'handle-text/editor',
  design: {
    dockAnswer: false,
    parts: {
      usable: (base, S) => (ctx) => {
        const box = { x: 0, y: 0, w: Math.min(ctx.size.width, ctx.stage.clientWidth), h: Math.min(ctx.size.height, ctx.stage.clientHeight) };
        const sr = ctx.stage.getBoundingClientRect();
        const sub = env.submitEl && env.submitEl.getBoundingClientRect();
        if (sub && env.submitEl.dataset.placement === 'footer' && sub.width && sub.left < sr.right && sub.right > sr.left && sub.top < sr.bottom && sub.bottom > sr.top) {
          const cutH = sr.bottom - sub.top + 10;
          const cutW = sr.right - sub.left + 10;
          if (cutH * box.w <= cutW * box.h) box.h -= cutH;
          else box.w -= cutW;
        }
        return box;
      },
      rendered: (base, S) => (ctx, view) => {
        const end = document.querySelector('.submit');
        const answer = view.card.querySelector('.ut-fieldrow');
        if (end && answer && end.dataset.placement === 'footer') answer.append(end);
        const clear = document.querySelector('.station-clear');
        if (clear && answer) answer.append(clear);
        for (const text of view.card.querySelectorAll('.ut-text.lines')) {
          const rows = [...text.querySelectorAll('.ut-ln')];
          if (!rows.length) continue;
          const cs = getComputedStyle(text);
          const rowHeight = parseFloat(getComputedStyle(rows[0]).lineHeight);
          const available = text.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
          let scale = Math.min(1, available / (rows.length * rowHeight));
          for (const row of rows) {
            const content = row.lastElementChild;
            const room = text.getBoundingClientRect().right - content.getBoundingClientRect().left - 2;
            if (content.scrollWidth > room) scale = Math.min(scale, room / content.scrollWidth);
          }
          if (scale >= 1) continue;
          const fontSize = parseFloat(cs.fontSize) * scale;
          text.style.fontSize = fontSize + 'px';
          for (const row of rows) {
            row.style.lineHeight = rowHeight * scale + 'px';
            const number = row.querySelector('.ut-num');
            if (number) {
              number.style.fontSize = fontSize + 'px';
              number.style.lineHeight = rowHeight * scale + 'px';
            }
          }
        }
      },
    },
  },
});
