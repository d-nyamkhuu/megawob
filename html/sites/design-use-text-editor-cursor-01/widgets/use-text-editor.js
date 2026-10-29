env.widget({
  task: 'use-text-editor',
  site: 'design-use-text-editor-cursor-01',
  name: 'design',
  split: 'train',
  scenarios: ['cursor'],
  traits: { doc: 'code' },
  template: 'use-text-editor/classic',
  design: {
    parts: {
      metrics: (base, S) => function (ctx, box, controls) {
        const metrics = base(ctx, box, controls);
        const { code, gutter, mini } = controls;
        const longest = Math.max(...[ctx.spec.base, ctx.spec.target]
          .flatMap((text) => text.split('\n').map((line) => line.length)));
        const miniW = mini ? 57 : 0;
        // Keep every seeded line, including its insertion point, inside the code pane.
        let fs = metrics.fs;
        let cw = metrics.cw;
        const probe = S.P.el('span', '', 'M'.repeat(80));
        probe.style.cssText = 'position:absolute;visibility:hidden;white-space:pre;';
        code.append(probe);
        let gutterW, codeW;
        do {
          probe.style.font = `${fs}px/${metrics.lh}px ${S.D.fontFamily}`;
          cw = probe.getBoundingClientRect().width / 80;
          gutterW = Math.ceil(cw * 3 + 22);
          codeW = Math.floor(box.w - 12 - gutterW - miniW);
          if ((longest + 1) * cw + metrics.PAD * 2 <= codeW) break;
          fs -= 0.25;
        } while (fs > 1);
        probe.remove();
        const font = `${fs}px/${metrics.lh}px ${S.D.fontFamily}`;
        code.style.font = font;
        gutter.style.font = font;
        gutter.style.width = `${gutterW}px`;
        code.style.width = `${codeW}px`;
        controls.card.style.width = `${gutterW + codeW + miniW + 2}px`;
        return { ...metrics, fs, cw, codeW };
      },
    },
  },
});
