env.widget({
  task: 'use-text-editor',
  site: 'design-use-text-editor-multiline-05',
  name: 'design',
  split: 'train',
  scenarios: ['multiline'],
  traits: { doc: 'code' },
  template: 'use-text-editor/classic',
  design: {
    fontFamily: "'Monaco', 'DejaVu Sans Mono', 'Liberation Mono', 'Courier New', monospace",
    minLineHeight: 12, maxLineHeight: 32,
    minFontSize: 10, maxFontSize: 20,
    fontRatio: 0.74,
    codePadding: 20,
    minWidth: 400,
    parts: {
      status: (base, S) => function (ctx, status, ...rest) {
        base(ctx, status, ...rest);
        const sp = status.querySelector('.sp');
        const right = [];
        for (const k of [...status.children]) { if (k === sp) break; right.push(k); }
        const mk = (t) => { const s = document.createElement('span'); s.textContent = t; return s; };
        status.replaceChildren(mk('Python'), mk('Tabs: 2 spaces'), mk('UTF-8'), sp, ...right);
      },
    },
  },
});
