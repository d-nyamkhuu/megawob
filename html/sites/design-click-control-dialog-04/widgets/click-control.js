// Design of this site on click-control/controls: adds the Project Notes page and styles the dialog as an archive prompt.
(function () {
  'use strict';
  const DIALOG_ICON = '<svg viewBox="0 0 60 58" aria-hidden="true"><g fill="#fff" stroke="#000" stroke-width="2.5" stroke-linejoin="miter"><path d="M3 19L20 4h36v36L42 55H3z"/><path d="M3 19h39v36M42 19L56 4M3 27h39l14-15"/><path d="M16 31h13"/></g></svg>';

  env.widget({
    task: 'click-control',
    site: 'design-click-control-dialog-04',
    name: 'design',
    split: 'train',
    scenarios: ['dialog'],
    traits: { menuOpen: ['hover', 'click'] },
    template: 'click-control/controls',
    design: {
      dlgIcon: DIALOG_ICON,
      dlgName: ['Archive as:', 'Project Notes Archive'],
      dlgReport: 'Include comments',
      parts: {
        dialogPage: (base) => (ctx, content) => {
          const opener = base(ctx, content);
          const { util } = ctx;
          const doc = util.el('div', 'mac-doc', content);
          util.el('h2', '', doc, 'Project Notes');
          util.el('p', 'mac-date', doc, 'March 14, 1988');
          util.el('p', 'mac-goals', doc, 'Goals for this release:');
          ['Finalize feature set', 'Review with team', 'Prepare documentation', 'Archive current draft'].forEach((text) =>
            util.el('p', 'mac-li', doc, text),
          );
          return opener;
        },
        dialogBody: (base) => (ctx, dbox) => {
          base(ctx, dbox);
          const body = dbox.querySelector('.uc-dlg-b');
          const question = body.querySelector('.dlg-q');
          const sub = ctx.util.el(
            'div',
            'dlg-sub',
            null,
            'The current document will be added to an archive file for later reference.',
          );
          question.after(sub);
        },
        dialogWidth: () => (r) => Math.min(Math.round(r.width * 0.485), r.width - 10),
        dialogPlaced: (base) => (ctx, content, dbox, r, opener, bh) => {
          const ribbonButton = document.querySelector('.mac-tool.opener');
          if (opener && ribbonButton) {
            opener = ribbonButton;
            ribbonButton.lastChild.textContent = ctx.spec.opener;
            ribbonButton.classList.toggle('long-opener', ctx.spec.opener.length > 12);
          }
          dbox.style.left = Math.round(r.width * 0.326) + 'px';
          dbox.style.top = Math.round(Math.max(0, Math.min(r.height * 0.115, r.height - bh - 10))) + 'px';
          return opener;
        },
      },
    },
  });
})();
