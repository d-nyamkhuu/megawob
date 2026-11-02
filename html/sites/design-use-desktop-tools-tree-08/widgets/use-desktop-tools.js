// Explorer metadata and classic file icons distinguish this tree design.
env.widget({
  task: 'use-desktop-tools',
  site: 'design-use-desktop-tools-tree-08',
  name: 'design',
  split: 'train',
  scenarios: ['tree'],
  template: 'use-desktop-tools/workspace',
  design: {
    chev: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" class="chev"><path d="M1 1L15 8 1 15Z" fill="#82827e" stroke="none"/></svg>',
    folder: () => '<svg class="ico" viewBox="0 0 32 32"><defs><linearGradient id="human-folder" x2="0" y2="1"><stop stop-color="#f9d69b"/><stop offset="1" stop-color="#e3a34f"/></linearGradient></defs><path d="M3 9V6.5Q3 5 5 5h8l3 3h11q2 0 2 2v17H3Z" fill="#ebc78b" stroke="#92744f" stroke-width="1.4"/><path d="M2.5 10h27l-1 17H3.5Z" style="fill:url(#human-folder)!important" stroke="#97734b" stroke-width="1.4"/><path d="M4 12h23" stroke="#fff2d3" stroke-width="1.3"/></svg>',
    file: (name, cls) => '<svg class="' + cls + '" viewBox="0 0 32 32"><path d="M6 2h13l8 8v20H6Z" fill="#fff" stroke="#6a6b67" stroke-width="1.5" stroke-linejoin="round"/><path d="M19 2v8h8M10 14h13M10 17h13M10 20h13M10 23h13M10 26h10" fill="none" stroke="#8a8a85" stroke-width="1"/></svg>',
    explorerTitle: (project) => `Explorer · ${project}`,
    rowRange: [21, 27],
    indent: [18, 32],
    loadIndent: [6, 18],
    emptyTitle: 'No file open',
    emptyTitleClass: '',
    emptyClose: null,
    emptyIcon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" ><path d="M3 6.5A1.5 1.5 0 0 1 4.5 5h4l2 2h8A1.5 1.5 0 0 1 20 8.5v9A1.5 1.5 0 0 1 18.5 19h-14A1.5 1.5 0 0 1 3 17.5z"/></svg>',
    emptyHeading: null,
    emptyHint: 'Click a file in the Explorer to open it.',
    parts: {
      rowStyle: () => (T, row, r) => {
        const hash = [...r.name].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
        const ext = r.name.split('.').pop().toLowerCase();
        row.dataset.size = r.dir ? '–' : `${1 + (hash % 6)} KB`;
        row.dataset.type = r.dir
          ? 'Folder'
          : ({
              py: 'Python script',
              js: 'JavaScript',
              txt: 'Text document',
              md: 'Text document',
              ods: 'Spreadsheet',
              xlsx: 'Spreadsheet',
              csv: 'Spreadsheet',
              pptx: 'Presentation',
              pdf: 'PDF document',
              png: 'Image',
              jpg: 'Image',
            }[ext] || 'Document');
        row.dataset.date = `${r.dir ? 'Feb' : 'Mar'} ${r.dir ? 20 + (hash % 8) : 1 + (hash % 3)}, 2006`;
      },
      rowBuilt: () => (T, row) => {
        T.util.el('span', 'row-date', row, row.dataset.date);
      },
      backButton: (base) => (T) => {
        base(T);
        const b = T.pbody.querySelector('.at-back');
        const toolbarBack = document.querySelector('.g-tool > .tb');
        if (toolbarBack) b.innerHTML = toolbarBack.innerHTML;
      },
      paintPreview: (base) => (T, m) => {
        T.pv.classList.toggle('has-recovery', T.mode === 'tree' && T.spec.recoverable && m.clicks.length > 0);
        base(T, m);
      },
    },
  },
});
