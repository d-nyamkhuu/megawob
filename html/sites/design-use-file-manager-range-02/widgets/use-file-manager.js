// Design on the shared use-file-manager/explorer template.
env.widget({
  task: 'use-file-manager',
  site: 'design-use-file-manager-range-02',
  name: 'design',
  split: 'train',
  scenarios: ['range'],
  template: 'use-file-manager/explorer',
  design: {
    parts: {
      fileSvg: (base, S) => (kind, ext, size) => {
        const format = String(ext || '').toLowerCase();
        const page = '<path d="M3.2 1.5h12L21 7.2v13.9a1.2 1.2 0 0 1-1.2 1.2H4.4a1.2 1.2 0 0 1-1.2-1.2V2.7a1.2 1.2 0 0 1 1.2-1.2Z" fill="#f7f7f7" stroke="#171717" stroke-width="1.05"/><path d="M15.2 1.8v5.5H21" fill="#ddd" stroke="#171717" stroke-width="1.05"/>';
        const lines = '<path d="M7 11h10M7 13.5h10M7 16h10M7 18.5h5" stroke="#555" stroke-width=".8"/>';
        let art = `${page}${lines}`;
        if (kind === 'image') {
          art = '<rect x="2.8" y="2.8" width="18.4" height="18.4" rx=".7" fill="#e6e6e6" stroke="#171717" stroke-width="1.1"/><circle cx="16.3" cy="7.4" r="2.3" fill="#777"/><path d="M4 18.8 9.5 12l3.4 3.8 2.2-2.5 4.9 5.5Z" fill="#777" stroke="#444" stroke-width=".7"/><path d="M3 20.5h18" stroke="#171717" stroke-width="1"/>';
        } else if (kind === 'design') {
          art = '<rect x="6" y="2" width="12" height="20" rx="5.5" fill="#f5f5f5" stroke="#171717" stroke-width="1.15"/><path d="M12 2h.4a5.6 5.6 0 0 1 0 11.2H12ZM12 13.2h.4a5.6 5.6 0 1 1 0 11.2H12Z" fill="#666"/><circle cx="12" cy="7.6" r="5.4" fill="#bbb" stroke="#171717" stroke-width="1"/><circle cx="12" cy="13.2" r="5.4" fill="#eee" stroke="#171717" stroke-width="1"/><circle cx="12" cy="18.7" r="3.2" fill="#777" stroke="#171717" stroke-width="1"/>';
        } else if (kind === 'spreadsheet' || kind === 'data' || ['xls', 'xlsx', 'csv', 'ods'].includes(format)) {
          art = `${page}<rect x="2" y="12" width="10" height="8" rx=".5" fill="#555"/><path d="M2 14.6h10M5.3 12v8M8.6 12v8" stroke="#fff" stroke-width=".65"/><text x="4" y="19" font-size="4.4" font-family="Arial,sans-serif" font-weight="700" fill="#fff">X</text>`;
        } else if (kind === 'presentation' || ['ppt', 'pptx', 'odp'].includes(format)) {
          art = `${page}<rect x="2" y="12" width="9" height="7" rx=".5" fill="#555"/><text x="4.8" y="17.4" font-size="5" font-family="Arial,sans-serif" font-weight="700" fill="#fff">P</text><path d="M13 13h5M13 15.5h5M13 18h4" stroke="#555" stroke-width=".8"/>`;
        } else if (kind === 'document' && ['doc', 'docx', 'odt'].includes(format)) {
          art = `${page}<rect x="2" y="12" width="9" height="7" rx=".5" fill="#555"/><text x="4.3" y="17.3" font-size="5" font-family="Arial,sans-serif" font-weight="700" fill="#fff">W</text><path d="M13 13h5M13 15.5h5M13 18h4" stroke="#555" stroke-width=".8"/>`;
        } else if (kind === 'document' && format === 'pdf') {
          art = `${page}<path d="M2 12h10v7H2z" fill="#555"/><text x="2.8" y="17.3" font-size="4" font-family="Arial,sans-serif" font-weight="700" fill="#fff">PDF</text><path d="M14 13h4M14 15.5h4M14 18h3" stroke="#555" stroke-width=".8"/>`;
        } else if (kind === 'video') {
          art = `${page}<rect x="2" y="12" width="10" height="7" rx=".5" fill="#555"/><path d="m5 13.5 4 2-4 2Z" fill="#fff"/><path d="M14 13h4M14 15.5h4M14 18h3" stroke="#555" stroke-width=".8"/>`;
        } else if (kind === 'archive') {
          art = `${page}<rect x="2" y="12" width="10" height="6.5" rx=".6" fill="#555"/><path d="M2 14h10M5 12v2M9 12v2" stroke="#fff" stroke-width=".7"/><path d="M14 13h4M14 15.5h4M14 18h3" stroke="#555" stroke-width=".8"/>`;
        }
        return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" aria-hidden="true">${art}</svg>`;
      },
    },
  },
});
