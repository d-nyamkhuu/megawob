// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const icons = {
    file: '<path d="M5 2h10l5 5v21H5z" fill="#f8fcff"/><path d="M15 2v6h5M8 12h9M8 16h9M8 20h9M8 24h9"/>',
    folder: '<path d="M2 7h8l3-4h8v5h3l-4 17H2z" fill="#ffe5a0" stroke="#8c691d"/><path d="M3 10h21l-4 15H2z" fill="#fff3c1" stroke="#b48a32"/>',
    new: '<path d="M5 2h10l5 5v21H5z" fill="#f5fbff"/><path d="M15 2v6h5"/>',
    cut: '<circle cx="7" cy="23" r="4" fill="#d5ecff"/><circle cx="19" cy="23" r="4" fill="#d5ecff"/><path d="M9 20L21 3M17 20L5 3" stroke-width="2"/>',
    copy: '<path d="M3 2h12l5 5v18H3z" fill="#edf7ff"/><path d="M9 7h12l5 5v18H9z" fill="#f9fcff"/><path d="M21 7v6h5"/>',
    paste: '<path d="M5 6h19v23H5z" fill="#ffe49a" stroke="#917331"/><path d="M10 3h9v6h-9z" fill="#e7edf1"/><path d="M11 13h10v13H11z" fill="#fff"/>',
    run: '<path d="M7 3l18 12L7 27z" fill="#68c651" stroke="#378d38"/>',
    stop: '<path d="M6 6h18v18H6z" fill="#bdbdbd" stroke="#aaa"/>',
    step: '<path d="M8 4h6l8 11-8 11H8z" fill="#7bb8e5"/><path d="M27 2v26" stroke="#333"/>',
    grid: '<path d="M3 3h24v24H3z" fill="#fff"/><path d="M14 3v24M3 15h24"/><path d="M7 7h3v3H7zM18 19h3v3h-3z" fill="#d74f4f" stroke="none"/>',
    panel: '<path d="M2 5h26v22H2z" fill="#f7fbff"/><path d="M2 10h26M6 14h6M15 14h9M6 19h18M6 23h18"/>',
  };
  function icon(parent, type, util) {
    const node = util.el('span', 'legacy-icon legacy-icon-' + type, parent);
    node.innerHTML = '<svg viewBox="0 0 30 32" aria-hidden="true" fill="none" stroke="#416888" stroke-width="1.3" stroke-linejoin="round">' + (icons[type] || icons.file) + '</svg>';
    return node;
  }

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { rng, util } = _c;
      const { TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      {
        const title = rng.pick(TITLES);
        const brand = util.el('div', 'ref-brand', header, 'Acme Workspace');
        brand.dataset.role = 'brand';
      }
      const menu = util.el('div', 'legacy-menu', header);
      for (const item of ['File', 'Edit', 'View', 'Project', 'Build', 'Tools', 'Help']) util.el('span', '', menu, item);
      const toolbar = util.el('div', 'legacy-toolbar', header);
      for (const [type, label] of [['new','New'],['folder','Open'],['cut','Cut'],['copy','Copy'],['paste','Paste'],['run','Run'],['stop','Stop'],['step','Step'],['grid','Layout'],['panel','Panels'],['panel','Output']]) {
        const b = util.el('span', 'legacy-tool', toolbar); b.title = label; icon(b, type, util);
      }
      util.el('div', 'legacy-window-controls', header, '—　 □　 ×');
      Object.assign(_c, { header });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const workspace = util.el('div', 'legacy-workspace', body);
      const files = util.el('aside', 'legacy-files', workspace);
      util.el('h2', '', files, 'Project Files');
      const fileRow = (parent, name, cls, folder) => {
        const row = util.el('div', 'legacy-file-row ' + cls, parent);
        if (folder) util.el('span', 'legacy-arrow', row, '▾');
        icon(row, folder ? 'folder' : 'file', util);
        util.el('span', '', row, name);
      };
      fileRow(files, 'guestbook', 'tree-root', true);
      fileRow(files, 'src', 'tree-indent', true);
      for (const f of ['app.js','utils.js','storage.js']) fileRow(files, f, 'tree-file' + (f === 'app.js' ? ' selected' : ''), false);
      fileRow(files, 'public', 'tree-indent tree-group', true);
      for (const f of ['index.html','styles.css']) fileRow(files, f, 'tree-file', false);
      fileRow(files, 'tests', 'tree-indent tree-group', true);
      fileRow(files, 'app.test.js', 'tree-file', false);
      const main = util.el('div', 'legacy-main', workspace);
      const band = util.el('div', 'legacy-band', main);
      const summary = util.el('section', 'legacy-summary', band);
      util.el('h1', '', summary, 'guestbook');
      util.el('p', '', summary, 'A simple guestbook for leaving messages.');
      const note = document.querySelector('.ref-instruction');
      if (note) { summary.appendChild(note); summary.classList.add('has-task'); }
      const meta = util.el('div', 'legacy-meta', summary);
      for (const [key, val] of [['Path:', 'guestbook/src/app.js'], ['Size:', '1.6 KB'], ['Modified:', 'Apr 12, 2008  14:28'], ['Type:', 'JavaScript File']]) {
        util.el('span', '', meta, key); util.el('span', '', meta, val);
      }
      const stage = util.el('main', 'ref-stage', main);
      S.frameAlign(_c, stage);
      const stats = util.el('aside', 'legacy-related', band);
      util.el('h2', '', stats, 'Related Files');
      for (const f of ['app.js','utils.js','storage.js','index.html','styles.css','app.test.js']) fileRow(stats, f, f === 'app.js' ? 'selected' : '', false);
      Object.assign(_c, { stage, stats });
    },
    'frame.end': (base, S) => function (_c) {
      const { ctx, util, submit } = _c;
      let foot = document.querySelector('.ref-foot');
      if (!foot) foot = util.el('footer', 'ref-foot', document.body);
      const oldText = foot.querySelector('.ref-foot-text');
      if (oldText) oldText.textContent = 'Acme Workspace';
      let tools = foot.querySelector('.ref-tools');
      if (!tools) tools = util.el('div', 'ref-tools', foot);
      if (submit) {
        const r = ctx.rng.fork('acme/end');
        let label = submit.getAttribute('aria-label');
        if (r.bool(.55) && !Array.from(document.querySelectorAll('.ref-xtra')).some(x => x.textContent === 'Apply')) label = 'Apply';
        const placement = r.pick(['footer', 'footer', 'footer', 'header', 'icon']);
        submit.className = 'ref-submit' + (placement === 'icon' ? ' ref-icon' : '');
        submit.textContent = placement === 'icon' ? '✓' : label;
        submit.title = label; submit.setAttribute('aria-label', label);
        (placement === 'footer' ? tools : _c.headerTools).appendChild(submit);
      }
      const dock = document.querySelector('.ref-float-dock');
      if (dock) dock.remove();
      if (ctx.finish && !foot.querySelector('.ref-xtra')) foot.remove();
      const note = document.querySelector('.ref-note');
      if (note) {
        const row = util.el('div', 'legacy-toast-row');
        document.body.insertBefore(row, foot.isConnected ? foot : null); row.appendChild(note);
      }
      return base(_c);
    },
  };

  env.site({
    name: 'design-use-text-editor-autocomplete-05',
    template: 'site/base',
    design: { parts },
  });
})();
