// Design of this site on click-control/controls: keeps its project-notes and display-calibration page, dialog message, and plain footer labels.
(function () {
  'use strict';

  const DIALOG_ICON = '<svg viewBox="0 0 68 86" fill="none" stroke="#77808a" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"><path d="M13 5h28l21 21v49a6 6 0 0 1-6 6H13a6 6 0 0 1-6-6V11a6 6 0 0 1 6-6Z"/><path d="M41 5v21h21M23 40h27M23 52h27M23 64h23"/></svg>';

  env.widget({
    task: 'click-control',
    site: 'design-click-control-dialog-03',
    name: 'design',
    split: 'train',
    scenarios: ['dialog'],
    traits: { menuOpen: ['hover', 'click'] },
    template: 'click-control/controls',
    design: {
      dlgIcon: DIALOG_ICON,
      parts: {
        dialogPage: () => (ctx, content) => {
          const { util } = ctx;
          const statusNote = document.querySelector('.dialog-status-note');
          if (statusNote) statusNote.textContent = ctx.model.open
            ? 'The dialog box is already open.'
            : 'Open the dialog using the document action.';
          const docEl = util.el('div', 'gdoc', content);
          util.el('h1', '', docEl, 'Project Notes');
          [
            'Date: April 23, 2025|Author: Alex Chen',
            'Goals|- Finalize project scope|- Confirm timeline|- Align on next steps',
            'Next Steps|1. Review feedback from team|2. Update the draft document|3. Schedule a follow-up meeting',
            "These notes capture the key points from today's discussion.",
          ].forEach((blk, bi) => {
            const p = util.el('p', bi === 1 || bi === 2 ? 'sec' : '', docEl);
            blk.split('|').forEach((ln, li) => util.el('span', (bi === 1 || bi === 2) && li === 0 ? 'hd' : '', p, ln));
          });
          const grid = util.el('div', 'calibration-grid', content);
          const info = util.el('section', 'display-info', grid);
          util.el('h3', '', info, 'Display Information');
          [
            'Display:       DELL 2001FP',
            'Resolution:    1600 × 900',
            'Refresh Rate:  60 Hz',
            'Current Profile: Generic RGB',
            'Status:        Ready',
          ].forEach((t) => util.el('div', '', info, t));
          const settings = util.el('section', 'calibration-settings', grid);
          util.el('h3', '', settings, 'Calibration Settings');
          ['Target White Point:|D65 (6504K)', 'Luminance:|120 cd/m²', 'Gamma:|2.2', 'Profile Name:|my_display'].forEach((t) => {
            const [label, value] = t.split('|');
            const row = util.el('div', 'setting-row', settings);
            util.el('label', '', row, label);
            util.el('span', 'setting-value', row, value);
          });
          util.el('p', '', settings, '☐ Enable ambient light compensation');
          util.el('p', '', settings, '☑ Preview calibration results');
          let opener = null;
          if (ctx.spec.opener) {
            opener = util.el('button', 'uc-btn', settings, ctx.spec.opener);
            opener.type = 'button';
          }
          const screen = util.el('div', 'calibration-screen', grid);
          util.el('div', 'color-bars', screen);
          util.el('div', 'greyscale', screen);
          return opener;
        },
        dialogBody: (base, S) => (ctx, dbox) => {
          const { spec, util } = ctx;
          const body = util.el('div', 'uc-dlg-b', dbox);
          const glyph = util.el('span', 'dlg-doc-icon', body);
          glyph.innerHTML = S.D.dlgIcon;
          glyph.setAttribute('aria-hidden', 'true');
          util.el('div', 'dlg-q', body, spec.text);
          util.el('div', 'dlg-secondary', body,
            /unsaved|save changes/i.test(spec.title)
              ? 'Your changes will be lost if you don’t save them.'
              : 'Choose how you’d like to continue.');
          const steps = document.querySelectorAll('.inspector > p');
          if (steps[1]) {
            steps[1].textContent = ctx.model.open
              ? '1.  The "' + spec.title + '" dialog is already open.'
              : '1.  Open the requested dialog.';
          }
        },
        footButton: () => (ctx, foot, label, i) => {
          const b = ctx.util.el('button', 'uc-btn' + (i === ctx.spec.buttons.length - 1 ? ' primary' : ''), foot, label);
          b.type = 'button';
          return b;
        },
      },
    },
  });
})();
