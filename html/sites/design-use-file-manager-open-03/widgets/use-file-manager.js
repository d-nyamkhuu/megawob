// Design on the shared use-file-manager/explorer template.
env.widget({
  task: 'use-file-manager',
  site: 'design-use-file-manager-open-03',
  name: 'design',
  split: 'train',
  scenarios: ['open'],
  template: 'use-file-manager/explorer',
  design: {
    parts: {
      fileSvg: (base, S) => (kind, ext, size) => {
        const color = S.D.kindColors[kind] || S.D.fileFallbackColor;
        const suffix = String(ext || '').toLowerCase();
        const badge = kind === 'spreadsheet' || suffix === 'xlsx' || suffix === 'xls' ? 'X'
          : kind === 'presentation' || suffix === 'ppt' || suffix === 'pptx' ? 'P'
            : kind === 'pdf' || suffix === 'pdf' ? 'PDF' : '';
        const badgeColor = badge === 'X' ? '#168447' : badge === 'P' ? '#d94416' : '#d32124';
        const lines = kind === 'text' || kind === 'document' || kind === 'web'
          ? '<path d="M18 26h29M18 32h29M18 38h29M18 44h26M18 50h29" stroke="#7188a8" stroke-width="1.7"/>'
          : '<path d="M18 29h29M18 35h29M18 41h29M18 47h26" stroke="#9ba8b8" stroke-width="1.5"/>';
        const app = badge ? `<rect x="5" y="30" width="19" height="20" rx="1.5" fill="${badgeColor}"/><text x="14.5" y="44" text-anchor="middle" fill="#fff" font-family="Arial,sans-serif" font-size="${badge === 'PDF' ? 6 : 12}" font-weight="bold">${badge}</text>` : '';
        const mark = kind === 'pdf' ? '<path d="M20 26c-2 7-4 13-8 19m0-15c6 1 11 1 17 0m-15 7c5 2 9 5 12 9" fill="none" stroke="#d32124" stroke-width="2"/>' : '';
        const width = Math.min(60, Math.round(size * 1.1));
        const height = Math.min(72, Math.round(size * 1.2));
        return `<svg class="fm-classic-doc" width="${width}" height="${height}" viewBox="0 0 56 64" aria-hidden="true"><path d="M8 1.5h27l14 14V61H8z" fill="#fff" stroke="#24272c" stroke-width="1.5"/><path d="M35 2v14h14" fill="#e7eaf0" stroke="#24272c" stroke-width="1.2"/><path d="M37 4v9h9" fill="none" stroke="#fff" stroke-width="1"/>${app}${lines}${mark}</svg>`;
      },
    },
  },
});
