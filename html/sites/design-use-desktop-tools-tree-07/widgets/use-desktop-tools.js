// CD-ROM tree frame, classic folder rows, and the original empty-file details panel.
env.widget({
  task: 'use-desktop-tools',
  site: 'design-use-desktop-tools-tree-07',
  name: 'design',
  split: 'train',
  scenarios: ['tree'],
  template: 'use-desktop-tools/workspace',
  design: {
    chev: '<svg class="chev" viewBox="0 0 16 16" fill="none" stroke="#555" stroke-width="1"><rect x="2.5" y="2.5" width="11" height="11" fill="#fff"/><path d="M5 8h6"/><path class="v" d="M8 5v6"/></svg>',
    explorerTitle: null,
    rowRange: [21, 27],
    indent: [40, 34],
    parts: {
      beforeList: (base, S) => (T) => {
        const { util, main } = T;
        const tabs = util.el('div', 'cd-tabs', main);
        util.el('span', 'on', tabs, 'File Tree');
        util.el('span', '', tabs, 'File Contents');
        util.el('span', '', tabs, 'Notes');
        const bar = util.el('div', 'cd-btns', main);
        const mkBtn = (label, disabled) => {
          const b = util.el('span', disabled ? 'dis' : '', bar);
          const icons = {
            open: S.FOLDER(true),
            new: S.FOLDER(false),
            up: S.svg('<path d="M12 2L3 12h6v10h6V12h6z" fill="#bbb" stroke="#999"/>'),
            ref: S.svg('<path d="M20 6a9 9 0 1 0 1 11l-3-2a6 6 0 1 1-1-7l-4 1 8 2V2z" fill="#4cadd4" stroke="#267a9e"/>'),
          };
          b.innerHTML = icons[label[0]] + label[1];
        };
        mkBtn(['open', 'Open']);
        mkBtn(['up', 'Go Up'], true);
        mkBtn(['ref', 'Refresh']);
        mkBtn(['new', 'New Folder']);
      },
      listBuilt: (base, S) => (T) => {
        const { util, list } = T;
        const drive = T.drive = util.el('div', 'at-row cd-root');
        drive.innerHTML = S.CHEV + '<svg class="ico" viewBox="0 0 24 24"><path d="M2 16h20v5H2z" fill="#c3c7c7" stroke="#67797b"/><ellipse cx="12" cy="10" rx="8" ry="7" fill="#deeff1" stroke="#718c98"/><ellipse cx="12" cy="10" rx="2" ry="2" fill="#a8bfd0" stroke="#718c98"/><path d="M5 8l6-4M13 16l6-5M4 19h12" stroke="#fff"/></svg><span class="nm">CD-ROM (D:)</span>';
        drive.dataset.open = '';
      },
      rowsLead: (base) => (T) => [T.drive],
      rowStyle: (base) => (T, row, r) => {
        row.style.setProperty('--indent', `${40 + r.depth * 34}px`);
      },
      infoCard: (base) => (T, card, node) => {
        card.classList.add('cd-info');
      },
      previewEmpty: (base) => (T) => {
        const { util, crumbs, pbody } = T;
        util.el('span', '', crumbs, 'No file open');
        const e = util.el('div', 'cd-info', pbody);
        util.el('h3', '', e, 'No file selected');
        for (const label of ['Name:', 'Type:', 'Size:', 'Modified:']) {
          const row = util.el('div', 'cd-kv', e);
          util.el('span', '', row, label);
          util.el('span', '', row, '—');
        }
      },
    },
  },
});
