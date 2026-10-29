env.widget({
  task: 'use-text-editor',
  site: 'design-use-text-editor-cursor-03',
  name: 'design',
  split: 'train',
  scenarios: ['cursor'],
  traits: { doc: 'code' },
  template: 'use-text-editor/classic',
  design: {
    minLineHeight: 1,
    minFontSize: 1,
    parts: {
      metrics: (base, S) => function metrics(ctx, box, controls) {
        // This editor shares the stage row with the release notes. Fit its
        // longest line as well as its line count before anchors are captured.
        const lines = [ctx.spec.base, ctx.spec.target, ctx.model.text]
          .flatMap((text) => env.taskDef.helpers.lines(text));
        const columns = Math.max(...lines.map((line) => line.length)) + 1;
        const measured = base(ctx, box, controls);
        if (columns * measured.cw + measured.PAD * 2 <= measured.codeW) return measured;

        const miniWidth = controls.mini ? 57 : 0;
        const available = box.w - 12 - miniWidth;
        const fs = Math.max(1, Math.floor(Math.min(measured.fs,
          (available - 23 - measured.PAD * 2) / (columns + 3) / (measured.cw / measured.fs)) * 2) / 2);
        const font = `${fs}px/${measured.lh}px ${S.D.fontFamily}`;
        const probe = ctx.util.el('span', '', controls.code, 'M'.repeat(80));
        probe.style.cssText = `position:absolute;visibility:hidden;white-space:pre;font:${font};`;
        const cw = probe.getBoundingClientRect().width / 80;
        probe.remove();
        const gutterWidth = Math.ceil(cw * 3 + 22);
        const codeW = Math.floor(available - gutterWidth);
        controls.gutter.style.font = font;
        controls.gutter.style.width = `${gutterWidth}px`;
        controls.code.style.font = font;
        controls.code.style.width = `${codeW}px`;
        controls.card.style.width = `${gutterWidth + codeW + miniWidth + 2}px`;
        return { ...measured, fs, cw, codeW };
      },
    },
  },
});
