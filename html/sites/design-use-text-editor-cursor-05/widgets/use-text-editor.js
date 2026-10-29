env.widget({
  task: 'use-text-editor',
  site: 'design-use-text-editor-cursor-05',
  name: 'design',
  split: 'train',
  scenarios: ['cursor'],
  traits: { doc: 'code' },
  template: 'use-text-editor/classic',
  design: {
    minLineHeight: 12,
    maxLineHeight: 20,
    minFontSize: 10,
    maxFontSize: 18,
    fontRatio: 0.8,
    parts: {
      appearance: (base, S) => function (ctx, look) {
        const sampled = base(ctx, look);
        return { ...sampled, minimap: true };
      },
      metrics: (base, S) => function (ctx, box, controls) {
        const metrics = base(ctx, box, controls);
        const { code, gutter, mini } = controls;
        const baseLines = ctx.spec.base.split('\n');
        const targetLines = ctx.spec.target.split('\n');
        const changed = Math.max(0, targetLines.findIndex((line, i) => line !== baseLines[i]));
        // The oracle may first place the caret on a different line from the edit.
        // Fit every possible line so each reported position remains in the pane.
        const editedLength = Math.max(
          (baseLines[changed] || '').length,
          (targetLines[changed] || '').length,
          ...baseLines.map(line => line.length),
          ...targetLines.map(line => line.length)
        );
        const compact = box.w < 650;
        if (mini && compact) mini.style.display = 'none';
        const miniW = mini && !compact ? 86 : 0;
        // Use the full available height for the numbered lines, while keeping
        // every seeded line and its insertion point inside the editor.
        const lineCount = Math.max(baseLines.length, targetLines.length);
        const lh = Math.max(10, Math.min(31, Math.floor((box.h - 113) / lineCount)));
        let fs = Math.max(10, Math.min(21, Math.round(lh * 0.93)));
        let cw = metrics.cw;
        const probe = S.P.el('span', '', 'M'.repeat(80));
        probe.style.cssText = 'position:absolute;visibility:hidden;white-space:pre;';
        code.append(probe);
        let gutterW, codeW;
        probe.style.font = `${fs}px/${lh}px ${S.D.fontFamily}`;
        cw = probe.getBoundingClientRect().width / 80;
        gutterW = miniW ? 70 : Math.ceil(cw * 3 + 22);
        codeW = Math.floor(box.w - 6 - gutterW - miniW);
        const scaleX = Math.min(1, (codeW - metrics.PAD * 2) / ((editedLength + 1) * cw));
        controls.linesEl.style.transform = `scaleX(${Math.max(.1, scaleX)})`;
        controls.linesEl.style.transformOrigin = 'left top';
        cw *= Math.max(.1, scaleX);
        probe.remove();
        const font = `${fs}px/${lh}px ${S.D.fontFamily}`;
        code.style.font = font;
        gutter.style.font = font;
        gutter.style.width = `${gutterW}px`;
        code.style.width = `${codeW}px`;
        controls.card.style.width = '100%';
        return { ...metrics, lh, fs, cw, codeW, bodyH: lineCount * lh + metrics.TOP * 2 };
      },
      status: (base, S) => function (ctx, status, model, lines, currentLine, currentCol) {
        base(ctx, status, model, lines, currentLine, currentCol);
        const [position, spacer, count, spaces, encoding, ending, language] = [...status.children];
        count.style.display = 'none';
        status.replaceChildren(language, spaces, encoding, ending, count, spacer, position);
      },
      minimap: (base, S) => function (ctx, mini, lines, bodyH) {
        const step = Math.min(18, Math.max(12, Math.floor((bodyH - 12) / Math.max(1, lines.length))));
        const view = S.P.el('div', 'view');
        view.style.height = `${Math.min(bodyH, 170)}px`;
        const rows = [];
        lines.forEach((line, index) => {
          if (!line.trim()) return;
          const indent = line.length - line.trimStart().length;
          const left = Math.min(18, 4 + indent * 0.9);
          const chunks = [line.trim().slice(0, 45), line.trim().slice(45, 90)].filter(Boolean);
          chunks.forEach((chunk, continuation) => {
            const row = S.P.el('div');
            row.style.cssText = `position:absolute;left:${left + continuation * 2}px;top:${4 + index * step + continuation * 6}px;width:140px;height:6px;overflow:hidden;white-space:pre;font:5px/6px monospace;letter-spacing:-.2px;transform:scaleX(.53);transform-origin:left top;color:#333`;
            for (const token of chunk.split(/(\b(?:function|const|let|return|import|from|async|var|if)\b|["'][^"']*["']|\b\d+\b)/g)) {
              if (!token) continue;
              const piece = S.P.el('span', '', token);
              piece.style.color = /^['"]/.test(token) ? '#ad2923' : /^(function|const|let|return|import|from|async|var|if)$/.test(token) ? '#184fba' : /^\d+$/.test(token) ? '#188a24' : '#333';
              row.append(piece);
            }
            rows.push(row);
          });
        });
        mini.replaceChildren(view, ...rows);
      },
      place: (base, S) => function (ctx, box, view) {
        const pr = ctx.rng.fork('place');
        pr.pick([0, 0.5, 0.5, 1]);
        pr.pick([0, 0.5, 1]);
        view.card.style.left = '0';
        view.card.style.top = '0';
        view.card.style.width = '100%';
        view.card.style.height = '100%';
      },
    },
  },
});
