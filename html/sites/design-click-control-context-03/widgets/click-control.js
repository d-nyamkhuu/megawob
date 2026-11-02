// Design on templates/click-control/base.js: the base site's click-control widget for this scenario (it was scaffolded from
// it), with the units this site changed as parts.
env.widget({
  task: 'click-control',
  site: 'design-click-control-context-03',
  name: 'design',
  split: 'train',
  scenarios: ['context'],
  template: 'click-control/base',
  design: {
    parts: {
      'fileIcon': (base, S) => function fileIcon(kind) {
        const { FILE_COLORS } = S;
        const c = FILE_COLORS[kind] || '#868e96';
        if (kind === 'folder') return `<svg class="uc-ficon file-folder" viewBox="0 0 34 40"><path d="M2 8h12l4 5h14v21H2z" fill="${c}"/><path d="M2 15h30v19H2z" fill="#58a9f6"/></svg>`;
        const label = String(kind).slice(0, 4).toUpperCase();
        const doc = kind === 'xlsx' || kind === 'csv'
          ? `<rect x="2" y="18" width="26" height="14" rx="1" fill="${c}"/><path d="M10.7 19v12M19.3 19v12M3 24.8h24" stroke="#fff" stroke-width="1.4"/>`
          : kind === 'pdf'
            ? `<rect x="2" y="18" width="26" height="14" rx="1" fill="${c}"/><path d="M10 29c3-5 4-9 3-11-1-2-3 0-1 4 2 4 5 6 7 5 2-1 0-3-2-2-3 1-7 4-8 5" fill="none" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/>`
            : kind === 'jpg' || kind === 'jpeg' || kind === 'png' || kind === 'heic'
              ? `<rect x="2" y="18" width="26" height="14" rx="1" fill="#91c6e9"/><circle cx="21" cy="22" r="2" fill="#fff4c8"/><path d="m3 30 8-8 5 5 4-4 7 8" fill="#5b9d61"/>`
              : kind === 'docx' || kind === 'doc' || kind === 'txt' || kind === 'md'
                ? `<rect x="2" y="18" width="26" height="14" rx="1" fill="${c}"/><path d="M8 22h14M8 25h14M8 28h10" stroke="#fff" stroke-width="1.5"/>`
                : `<rect x="2" y="21" width="26" height="11" rx="2" fill="${c}"/><text x="15" y="29.2" font-size="7.5" font-weight="700" fill="#fff" text-anchor="middle" font-family="sans-serif">${label}</text>`;
        return `<svg class="uc-ficon file-${kind}" viewBox="0 0 34 40"><path d="M5 2h17l8 8v28H5z" fill="var(--panel)" stroke="color-mix(in srgb, var(--fg) 35%, var(--line))" stroke-width="1.4"/>`
          + `<path d="M22 2v8h8" fill="none" stroke="color-mix(in srgb, var(--fg) 35%, var(--line))" stroke-width="1.4"/>${doc}</svg>`;
      },
    },
  },
});
