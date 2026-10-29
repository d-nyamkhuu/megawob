// Design on templates/use-desktop-tools/base.js: the base site's use-desktop-tools widget for this scenario, unchanged.
// Restyle it in site.css, set the template's tokens and replace the parts the design draws differently
// (design: { parts: { name: (base, S) => replacement } }; templates/README.md).
env.widget({
  task: 'use-desktop-tools',
  site: 'design-use-desktop-tools-files-05',
  name: 'design',
  split: 'train',
  scenarios: ['files'],
  template: 'use-desktop-tools/base',
  design: { parts: {
    CSS: (base, S) => S.env.templateLib('use-desktop-tools/_styles').workspaceCSS,
    frame: (base, S) => function (ctx) {
      const frame = base(ctx);
      frame.win.removeAttribute('style');
      frame.title.querySelector('b').textContent = 'Files';
      const icon = ctx.util.el('span', 'window-folder', frame.title);
      icon.innerHTML = '<svg viewBox="0 0 24 24"><path d="M2 5a2 2 0 0 1 2-2h5l3 3h8a2 2 0 0 1 2 2v12H2z" fill="#78e871" stroke="#a1f293" stroke-width=".6"/></svg>';
      frame.title.prepend(icon);
      const display = ['header','panel','toast','hidden'].find(mode => document.body.classList.contains('instruction-' + mode));
      const note = document.querySelector('.design-header > .task-note, .side-nav > .task-note');
      if (display === 'header' || (ctx.size.width <= 1100 && display !== 'hidden')) {
        if (note) frame.title.append(note);
      }
      const actions = document.querySelector('.header-actions');
      if (actions) frame.title.append(actions);
      const controls = ctx.util.el('span', 'window-controls', frame.title);
      controls.innerHTML = '<span>⛶</span><span>×</span>';
      return frame;
    },
    FOLDER: (base, S) => (open) => '<svg class="ico folder-icon" viewBox="0 0 24 24"><path d="M2 5a2 2 0 0 1 2-2h5l3 3h8a2 2 0 0 1 2 2v12H2z" fill="#ffe26b" stroke="#fff39a" stroke-width=".8"/></svg>',
    FILE: (base, S) => (name, cls = 'ico') => {
      const detail = /\.(png|jpe?g|heic|webp|gif)$/i.test(name)
        ? '<path d="m6 18 4-5 3 3 2-2 3 4"/><circle cx="9" cy="9" r="1"/>'
        : /\.(wav|mp3|ogg|mov|mp4)$/i.test(name)
          ? '<path d="m10 11 6 4-6 4z"/>'
          : '<path d="M8 12h8M8 16h8M8 19h6"/>';
      return '<svg class="' + cls + '" viewBox="0 0 24 24" fill="none" stroke="#edf0f4" stroke-width="1.7" stroke-linejoin="round"><path d="M4 2h10l6 6v14H4zM14 2v6h6"/>' + detail + '</svg>';
    },
    buildTree: (base, S) => function (ctx, main) {
      const u = ctx.util, fam = S.env.taskDef.helpers;
      const api = base(ctx, main);
      const ex = main.querySelector('.at-explorer'), pv = main.querySelector('.at-preview');
      const tree = ex.querySelector('.at-tree');
      ex.style.width = '';
      tree.style.setProperty('--rowh', Math.max(28, Math.min(40, Math.round(ctx.size.height * 40 / 862))) + 'px');
      const columns = ex.querySelector('.at-pane-h');
      columns.innerHTML = '<span>Name⌄</span><span>Size</span><span>Type</span><span>Date Modified</span>';
      const toolbar = u.el('div', 'files-toolbar', main);
      main.prepend(toolbar);
      const browser = u.el('div', 'browser-toolbar', toolbar);
      browser.innerHTML = '<span class="history-icons"><span>←</span><span>→</span><span>↑</span></span><div class="address-bar"><svg class="address-folder" viewBox="0 0 24 24"><path d="M2 5h7l3 3h10v13H2z" fill="#7ce979"/></svg><span class="address-path"></span><span class="view-switch"><span class="active">☷</span><span>▦</span><span>⋮</span></span></div>';
      const search = u.el('div', 'file-search', toolbar);
      search.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="10" cy="10" r="7"/><path d="m15 15 6 6"/></svg><span></span>';
      const tips = u.el('section', 'files-tips', main);
      tips.innerHTML = '<div class="tips-heading"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M8 17h8M9 20h6M10 23h4M8 14a7 7 0 1 1 8 0v3H8z"/></svg>Tips</div><div class="tips-copy"><p>Right-click a file or folder for more options.</p><div><kbd>F2</kbd> Rename the selected item.</div><div><kbd>Ctrl</kbd> + <kbd>C</kbd> Copy <kbd>Ctrl</kbd> + <kbd>V</kbd> Paste</div><div><kbd>Del</kbd> Move to trash.</div><p>Use the view buttons to change between list and grid views.</p></div>';
      const note = document.querySelector('.side-nav > .task-note');
      if (note) {
        const noteColumn = u.el('aside', 'workspace-note-column', main);
        noteColumn.append(note);
        main.classList.add('with-note');
      }
      const toastNote = document.querySelector('.design-header > .task-note');
      if (document.body.classList.contains('instruction-toast') && toastNote && !toastNote.hidden) {
        const noteColumn = u.el('aside', 'workspace-note-column', main);
        noteColumn.append(toastNote);
        main.classList.add('with-note');
      }
      const describe = n => {
        const ext = (n.name.split('.').pop() || '').toUpperCase();
        const hash = [...n.name].reduce((a,c) => ((a * 31 + c.charCodeAt(0)) >>> 0), 7);
        return { size: n.dir ? '—' : ((hash % 9 + 21) / 10).toFixed(1) + ' MB', type: n.dir ? 'Folder' : /PNG|JPG|JPEG|HEIC|WEBP/.test(ext) ? ext + ' image' : /DOC|RTF|TXT|MD/.test(ext) ? ext + ' document' : ext + ' file', date: 'Jun ' + (12 + hash % 11) + ', 2023', time: (9 + hash % 3) + ':' + (hash % 60).toString().padStart(2,'0') + ' AM' };
      };
      function decorate() {
        const m = ctx.model, live = fam.live(m, ctx.spec), rows = fam.rows(m, ctx.spec);
        const root = live.byId.get('root');
        const project = root && root.name ? root.name : 'Home';
        browser.querySelector('.address-path').textContent = project;
        search.querySelector('span').textContent = 'Search in ' + project;
        for (const row of tree.querySelectorAll('.at-row[data-id]')) {
          const n = live.byId.get(row.dataset.id);
          if (!n) continue;
          if (!row.querySelector('.row-size')) {
            u.el('span','row-size',row);
            u.el('span','row-type',row);
            u.el('span','row-date',row);
          }
          const d = describe(n);
          row.querySelector('.row-size').textContent = d.size;
          row.querySelector('.row-type').textContent = d.type;
          row.querySelector('.row-date').textContent = d.date + '  ' + d.time;
        }
        pv.querySelector('.at-crumbs').hidden = true;
        const pbody = pv.lastElementChild;
        if (pbody.dataset.designPreview === String(m.sel) && pbody.dataset.editName === (m.edit && m.edit.text || '') && pbody.querySelector('.preview-detail')) return;
        pbody.replaceChildren();
        const selected = m.sel != null && live.byId.get(m.sel);
        const photo = [...live.byId.values()].find(n => !n.dir && /\.(png|jpe?g|heic|webp)$/i.test(n.name));
        const n = selected || photo || rows.find(n => !n.dir) || rows[0];
        if (!n) return;
        pbody.dataset.designPreview = String(m.sel);
        pbody.dataset.editName = m.edit && m.edit.text || '';
        const d = describe(n), content = u.el('div','preview-detail',pbody);
        u.el('h3','',content,n.name);
        u.el('p','preview-kind',content,d.type + ' • ' + d.size);
        const img = u.el('img','preview-photo',content);
        img.src = 'sites/design-use-desktop-tools-files-05/assets/alpine-lake.png';
        img.alt = 'Blue alpine lake, mountains and evergreen forest';
        const metadata = u.el('dl','preview-metadata',content);
        for (const [key,value] of [['Date Modified',d.date + ' ' + d.time],['Dimensions','4032 × 3024'],['Color Profile','Display P3'],['Camera','Apple iPhone 14'],['Location','—']]) {
          u.el('dt','',metadata,key); u.el('dd','',metadata,value);
        }
      }
      const sync = api.sync;
      api.sync = function(m) { sync(m); decorate(); };
      if (api.onKey) { const onKey = api.onKey; api.onKey = function(e) { onKey(e); decorate(); }; }
      for (const event of ['click','dblclick','contextmenu','input','keydown']) main.addEventListener(event,decorate);
      decorate();
      return api;
    }
  } },
});
