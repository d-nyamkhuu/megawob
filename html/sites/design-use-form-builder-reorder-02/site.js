// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) =>
      function (_c) {
        const { util } = _c;
        const header = util.el('header', 'ref-task', document.body);
        const appTabs = util.el('nav', 'studio-tabs', header);
        for (const item of ['Survey', 'Themes', 'Settings', 'Distribute', 'Results']) {
          const tab = util.el('span', item === 'Survey' ? 'studio-tab selected' : 'studio-tab', appTabs, item);
        }
        const titlebar = util.el('div', 'flash-titlebar', document.body);
        titlebar.textContent = '▣  Survey Studio - Twin Rivers Hospital · Service feedback (Draft)';
        const win = util.el('div', 'flash-window-buttons', titlebar);
        for (const glyph of ['—', '□', '×']) util.el('span', '', win, glyph);
        document.body.insertBefore(titlebar, header);
        const menubar = util.el('nav', 'flash-menubar', document.body);
        for (const item of ['▤', 'Home', 'Insert', 'Design', 'Rules', 'Publish', 'View'])
          util.el('span', '', menubar, item);
        document.body.insertBefore(menubar, header);
        const toolbar = util.el('div', 'flash-toolbar', document.body);
        toolbar.innerHTML =
          '<div class="rib-group"><div class="rib-items"><span><b>📄</b>New<br>Survey</span><span><b>📂</b>Open</span><span><b>◷</b>Recent⌄</span></div><small>File</small></div><div class="rib-group"><div class="rib-items"><span><b>▤</b>Add<br>Section</span><span><b>⊕</b>Add<br>Question</span><span><b class="red">×</b>Delete</span></div><small>Add</small></div><div class="rib-group"><div class="rib-items"><span><b class="blue">⬆</b>Move Up</span><span><b class="blue">⬇</b>Move Down</span></div><small>Organize</small></div><div class="rib-group"><div class="rib-items"><span><b>▣</b>Duplicate</span><span><b>▧</b>Copy</span><span class="disabled"><b>▤</b>Paste</span></div><small>Clipboard</small></div><div class="rib-group wide"><div class="rib-items"><span>Question Type<br><strong>Email Address　⌄</strong></span><span>Validation<br><strong>Required　⌄</strong></span></div><small>Question Settings</small></div><div class="rib-group"><div class="rib-items"><span><b>⌘</b>Branching</span><span><b>▤</b>Response<br>Policy</span></div><small>Logic</small></div><div class="rib-group"><div class="rib-items"><span><b>⌕</b>Preview</span></div><small>Preview</small></div>';
        document.body.insertBefore(toolbar, header);
        S.frameBrand(_c, header);
        Object.assign(_c, { appTabs, header, menubar, titlebar, toolbar, win });
      },
  };

  env.site({
    name: 'design-use-form-builder-reorder-02',
    template: 'site/base',
    design: { parts },
  });
})();
