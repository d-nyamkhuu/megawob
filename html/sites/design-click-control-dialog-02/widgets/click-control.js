// The dialog design uses this site's existing project-file page and a file-selection dialog.
(function () {
  'use strict';

  let closedView = null;

  function fileName(spec) {
    return (spec.text.match(/["“]([^"”]+\.[a-zA-Z0-9]+)["”]/) || [])[1] || 'Budget.xlsx';
  }

  env.widget({
    task: 'click-control',
    site: 'design-click-control-dialog-02',
    name: 'design',
    split: 'train',
    scenarios: ['dialog'],
    traits: { menuOpen: ['hover', 'click'] },
    template: 'click-control/controls',
    design: {
      parts: {
        dialogBefore: (base, S) => (ctx) => {
          base(ctx);
          const { spec, util } = ctx;
          const steps = document.querySelector('.task-steps');
          if (steps) {
            steps.replaceChildren(); // the frame's list starts empty; a re-render (pageFaults) fills it again
            util.el('li', '', steps, spec.opener && !ctx.model.open
              ? `Open the "${spec.opener}" dialog.`
              : `The "${spec.title}" dialog is already open.`);
            util.el('li', '', steps, spec.target === 'x'
              ? 'Click the × button in the dialog.'
              : `Click the button labeled "${spec.target}" in it.`);
            const end = document.querySelector('[data-role="submit"]');
            const where = end && { original: 'below', toolbar: 'in the toolbar', footer: 'below', link: 'below' }[end.dataset.placement];
            util.el('li', '', steps, !end
              ? 'Finish when you are done.'
              : end.dataset.placement === 'original'
                ? 'Then click the Submit button below when you’re done.'
                : `Then click ${end.textContent} ${where} when you’re done.`);
          }
          const name = fileName(spec);
          const selectedName = document.querySelector('.project-files .selected .file-name > span:last-child');
          if (selectedName) selectedName.textContent = name;
          const extension = name.split('.').pop().toLowerCase();
          const selectedRow = document.querySelector('.project-files .selected');
          if (selectedRow) {
            selectedRow.lastElementChild.textContent = ({
              doc: 'Word document', docx: 'Word document', xlsx: 'Excel spreadsheet', csv: 'CSV document',
              pdf: 'PDF document', pptx: 'PowerPoint presentation', key: 'Keynote presentation',
              txt: 'Text document', png: 'PNG image', jpg: 'JPEG image', zip: 'ZIP archive',
            })[extension] || 'Document';
            const icon = selectedRow.querySelector('.file-icon');
            icon.style.color = S.FILE_COLORS[extension] || '#9d5370';
          }
        },
        dialogPage: (base, S) => (ctx, content) => {
          const P = S.P;
          P.dialogBefore(ctx, content);
          const opener = P.dialogOpener(ctx, content);
          P.dialogAfter(ctx, content, opener);
          return opener;
        },
        dialogOpener: (base, S) => (ctx, parent) => {
          const { spec, util } = ctx;
          closedView = null;
          if (!spec.opener) return null;
          closedView = util.el('div', 'uc-dialog dialog-launcher', parent);
          util.el('div', 'uc-dlg-t', closedView, spec.title);
          const body = util.el('div', 'uc-dlg-b', closedView);
          util.el('div', 'dialog-message', body, 'Selected project file:');
          util.el('div', 'dialog-field', body, fileName(spec));
          const foot = util.el('div', 'uc-dlg-f', closedView);
          const opener = util.el('button', 'uc-btn dialog-opener', foot, spec.opener);
          opener.type = 'button';
          return opener;
        },
        dialogStart: () => () => {},
        dialogBody: (base, S) => (ctx, dbox) => {
          const body = ctx.util.el('div', 'uc-dlg-b', dbox);
          ctx.util.el('div', 'dialog-message', body, ctx.spec.text);
          const field = ctx.util.el('div', 'dialog-field', body, fileName(ctx.spec));
          field.setAttribute('aria-label', 'Selected project file');
        },
        footButton: () => (ctx, foot, label, i) => {
          const button = ctx.util.el('button', 'uc-btn' + (i === ctx.spec.buttons.length - 1 ? ' primary' : ''), foot, label);
          button.type = 'button';
          return button;
        },
        dialogSynced: () => (ctx, model) => {
          if (closedView) closedView.hidden = model.open || model.clicks.length > 0;
        },
      },
    },
  });
})();
