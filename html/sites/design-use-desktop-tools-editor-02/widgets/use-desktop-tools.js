// Notebook styling adds a tabbed document frame and its original editor readouts.
(function () {
  'use strict';

  env.widget({
    task: 'use-desktop-tools',
    site: 'design-use-desktop-tools-editor-02',
    name: 'design',
    split: 'train',
    scenarios: ['editor'],
    template: 'use-desktop-tools/workspace',
    design: {
      css: '.at-win{left:0!important;right:0!important;top:0!important;bottom:0!important;width:auto!important;height:100%!important;border:0;border-radius:0;box-shadow:none}.at-main{min-width:0}.at-ed{padding:0!important}.at-pagearea{background:var(--panel);padding:0!important}.at-sheet{border:0;box-shadow:none;background:var(--panel);margin:0!important;width:100%!important;max-width:none!important;padding:26px 32px!important}.at-tb{border-radius:0;padding:10px;background:var(--header,var(--panel))}.at-tool{border-radius:3px;font-family:inherit}.at-status{background:var(--panel)}',
      siteCssLast: true,
      docTitle: 'A Clever Bird',
      wordsLabel: (n) => `${n} words`,
      sizeCur: 'label',
      barColor: 'var(--accent)',
      savedText: ['Plain Text', 'Plain Text'],
      toolIcons: {
        bullet: '<g fill="currentColor" stroke="none"><circle cx="3" cy="4" r=".8"/><circle cx="3" cy="8" r=".8"/><circle cx="3" cy="12" r=".8"/></g><path d="M6 4h8M6 8h8M6 12h8"/>',
      },
      toolHtml: {
        number: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M6 4h8M6 8h8M6 12h8"/><g fill="currentColor" stroke="none" font-family="monospace" font-size="4"><text x="1" y="5.5">1</text><text x="1" y="9.5">2</text><text x="1" y="13.5">3</text></g></svg>',
      },
      parts: {
        frame: () => (ctx) => {
          const { util } = ctx;
          const win = util.el('section', 'at-win', ctx.stage);
          const title = util.el('div', 'at-title', win);
          util.el('b', '', title, 'Notebook');
          const body = util.el('div', 'at-body', win);
          const main = util.el('div', 'at-main', body);
          const gear = util.el('button', '', title);
          gear.hidden = true;
          return { win, title, main, gear, appMenu: null };
        },
        edHead: () => (E) => {
          const { util, ed } = E;
          const tab = util.el('div', 'note-tab', ed);
          const label = util.el('span', '', tab, 'Untitled Note');
          util.el('i', 'note-close', label, '×');
          util.el('button', '', tab, '+').addEventListener('click', () => env.log('decoy', { what: 'new note' }));
        },
        edStatus: () => (E) => {
          const { util, spec } = E;
          E.status = util.el('div', 'at-status', E.ed);
          E.cursorStatus = util.el('span', '', E.status, 'Ln 1, Col 1');
          util.el('span', '', E.status, `${spec.doc.split(/\s+/).length} words`);
          E.saved = util.el('span', '', E.status, 'Plain Text');
        },
        edReadout: () => (E, m, start, end, style) => {
          if (!E.fitDone) {
            E.fitDone = true;
            if (E.sheet.getBoundingClientRect().height > E.area.clientHeight) {
              let fitted = parseFloat(getComputedStyle(E.docEl).fontSize);
              while (fitted > 13 && E.sheet.getBoundingClientRect().height > E.area.clientHeight) {
                fitted--;
                E.docEl.style.setProperty('font-size', `${fitted}px`, 'important');
              }
            }
          }
          E.tools.size.querySelector('.cur').textContent = E.fam.SIZE_LABEL[(style && style.s) || 'normal'];
          const cursorPara = Math.max(0, E.spec.bounds.findIndex(([, end]) => m.sel.end <= end));
          E.cursorStatus.textContent = `Ln ${cursorPara + 1}, Col ${m.sel.end - E.spec.bounds[cursorPara][0] + 1}`;
        },
      },
    },
  });
})();
