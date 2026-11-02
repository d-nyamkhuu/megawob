// Design on the shared use-file-manager/explorer template.
env.widget({
  task: 'use-file-manager',
  site: 'design-use-file-manager-multimove-01',
  name: 'design',
  split: 'train',
  scenarios: ['multimove'],
  template: 'use-file-manager/explorer',
  design: {
    panel: '#ffffff', fg: '#111827', muted: '#222222', line: '#888784', accent: '#4b74a8',
    fontSize: 16, nameFontSize: 16, detailFontSize: 13, controlFont: '16px Arial, Helvetica, sans-serif',
    windowRadius: 0, margin: 0, titleHeight: 0, toolbarHeight: 56, statusHeight: 26, tileGap: 18,
    treeIndent: 28, folderTone: '#edc678', lightsChance: 0,
    titleLabels: ['Documents'], separators: ['›'],
    parts: {
      fit: (base, S) => ctx => {
        base(ctx);
        // Preserve the template's draws, then fit the Motif window to the stage.
        const { W, H } = S.geo;
        S.geo = { fullW: W, fullH: H, winW: W, winH: H, left: 0, top: 0 };
      },
      css: (base) => ctx => base(ctx) + '\n.fm-title { overflow:hidden; border:0; }',
      fileSvg: (_base, S) => (kind, ext, size) => {
        const suffix = String(ext || '').toLowerCase();
        const color = /pdf/.test(suffix) ? '#c63b20' : /xls|csv/.test(suffix) ? '#43845c' : '#4b82bd';
        const image = /png|jpe?g|webp|gif/.test(suffix);
        const lines = image
          ? '<rect x="5" y="7" width="14" height="10" fill="#a8c7df" stroke="#333"/><path d="M6 16l4-4 3 2 2-3 3 5" fill="#6f9672" stroke="#333"/>'
          : /xls|csv/.test(suffix)
            ? '<path d="M6 9h12M6 13h12M6 17h12M10 7v12M14 7v12" stroke="#43845c" stroke-width="1.3"/>'
            : /pdf/.test(suffix)
              ? '<path d="M6 12h12M6 15h10" stroke="#c63b20" stroke-width="1.4"/>'
              : '<path d="M6 9h12M6 12h12M6 15h12M6 18h10" stroke="#4b82bd" stroke-width="1.2"/>';
        return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 1.5h11l5 5V22H4z" fill="#fff" stroke="#161616" stroke-width="1.1"/><path d="M15 1.8v5h5" fill="#e8e6e1" stroke="#161616" stroke-width="1.1"/>${lines}</svg>`;
      },
    },
  },
});
