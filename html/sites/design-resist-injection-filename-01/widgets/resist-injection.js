// Design on the shared resist-injection workspace.
env.widget({
  task: 'resist-injection',
  site: 'design-resist-injection-filename-01',
  name: 'design',
  split: 'train',
  scenarios: ['filename'],
  template: 'resist-injection/classic',
  design: {
    appRadius: '16px', appShadow: '0 12px 34px rgba(20,32,48,.24)',
    fontSize: '15px', topHeight: '46px', statusHeight: '0px',
    navWidth: '0px', editorWidth: '300px', compactEditorWidth: '260px',
    widthInset: 0, heightInset: 0, compactWidth: 700,
    titles: { filename: 'Move Files' },
    parts: {
      frame: (base) => (ctx) => {
        const el = (tag, cls, parent, text) => ctx.util.el(tag, cls, parent, text);
        const backdrop = el('div', 'ipad-workspace-backdrop', ctx.stage);
        backdrop.setAttribute('aria-hidden', 'true');
        const list = el('div', 'ipad-backdrop-list', backdrop);
        el('div', 'ipad-backdrop-head', list, 'Name　　　　　　　　　　　 Modified　　　　　　　　　 Size　　　　　 Kind');
        const fileNames = (ctx.spec.choices || []).concat((ctx.spec.items || []).slice(1).map((x) => x.name));
        const modified = ['Mar 12, 2019　10:24 AM','Mar 11, 2019　2:03 PM','Mar 10, 2019　4:18 PM','Mar 8, 2019　11:27 AM','Mar 6, 2019　9:14 AM','Mar 4, 2019　1:20 PM','Feb 28, 2019　5:06 PM','Feb 25, 2019　3:17 PM'];
        const sizes = ['24 KB','18 KB','942 KB','1.2 MB','3.4 MB','1.1 MB','46 KB','12 KB'];
        const kinds = ['Word Document','Excel Spreadsheet','PNG Image','PDF Document','PowerPoint Presentation','JPEG Image','Word Document','Plain Text'];
        fileNames.forEach((name, i) => {
          const row = el('div', 'ipad-backdrop-row', list);
          el('span', '', row, name); el('span', '', row, modified[i % modified.length]);
          el('span', '', row, sizes[i % sizes.length]); el('span', '', row, kinds[i % kinds.length]);
        });
        const preview = el('div', 'ipad-backdrop-preview', backdrop);
        el('div', 'ipad-pdf-mark', preview, 'PDF');
        el('strong', '', preview, fileNames[0] || 'Shared file');
        el('p', '', preview, 'PDF Document · 1.2 MB');
        el('p', '', preview, 'Modified　　 Mar 8, 2019 11:27 AM');
        el('p', '', preview, 'Created　　　Mar 8, 2019 11:27 AM');
        el('p', '', preview, 'Kind　　　　 PDF Document');
        el('p', '', preview, 'Size　　　　 1.2 MB');
        el('hr', '', preview); el('strong', '', preview, 'Tags');
        el('div', 'ipad-tags-pill', preview, 'Add Tags…');
        return base(ctx);
      },
    },
  },
});
