// Blue file icons, responsive tree indentation, and the original welcome preview.
(function () {
  'use strict';

  env.widget({
    task: 'use-desktop-tools',
    site: 'design-use-desktop-tools-tree-04',
    name: 'design',
    split: 'train',
    scenarios: ['tree'],
    template: 'use-desktop-tools/workspace',
    design: {
      icons: {
        files: '<path d="M2 5A2 2 0 0 1 4 3h5l2 2h9a2 2 0 0 1 2 2v13H2z" fill="#398df2"/><path d="M2 8h20v11a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z" fill="#3488ed"/><path d="M3 8h18" stroke="#c3e2ff" stroke-width="1.2"/>',
        search: '<circle cx="10.5" cy="10.5" r="7" stroke-width="2"/><path d="M15.5 15.5L20.5 20.5" stroke-width="2"/>',
        gear: '<path fill="currentColor" fill-rule="evenodd" stroke="none" d="M10 2h4l.5 3 1.5.6 2.5-1.8 2.8 2.8-1.8 2.5.6 1.5 3 .5v4l-3 .5-.6 1.5 1.8 2.5-2.8 2.8-2.5-1.8-1.5.6-.5 3h-4l-.5-3-1.5-.6-2.5 1.8-2.8-2.8 1.8-2.5-.6-1.5-3-.5v-4l3-.5.6-1.5L3.8 6.7l2.8-2.8 2.5 1.8 1.5-.6z M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"/>',
      },
      folder: (open) => open
        ? '<svg class="ico" viewBox="0 0 20 20"><path d="M1 4a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2z" fill="#5ca5f6"/><path d="M1 6h18v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2z" fill="#5aa3f0"/></svg>'
        : '<svg class="ico" viewBox="0 0 20 20"><path d="M1 4a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2z" fill="#5ca5f6"/></svg>',
      file: (name, cls, S) => {
        const m = /\.(tar\.gz|[A-Za-z0-9]+)$/.exec(name);
        const c = S.extColor(name);
        return `<svg class="${cls}" viewBox="0 0 20 20"><path d="M3 1h9l5 5v13H3z" fill="color-mix(in srgb, ${c} 14%, transparent)" stroke="${c}" stroke-width="1.3" stroke-linejoin="round"/><path d="M12 1v5h5" fill="none" stroke="${c}" stroke-width="1.3"/></svg>`;
      },
      explorerTitle: 'Project Files',
      rowRange: [21, 27],
      emptyTitle: 'No file open',
      emptyTitleClass: '',
      emptyClose: null,
      emptyIcon: null,
      emptyHeading: null,
      emptyHint: 'Select a file to view its contents.',
      parts: {
        rowIndent: () => (T, r) => `calc(1.3vw + ${r.depth} * 1.8vw)`,
      },
    },
  });
})();
