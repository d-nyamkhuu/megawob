// Design of this site on click-control/controls: the template defaults reproduce its calibration page and dialog.
env.widget({
  task: 'click-control',
  site: 'design-click-control-dialog-09',
  name: 'design',
  split: 'train',
  scenarios: ['dialog'],
  traits: { menuOpen: ['hover', 'click'] },
  template: 'click-control/controls',
  design: {
    dlgIcon: '<svg viewBox="0 0 60 76" aria-hidden="true"><g stroke="#111" stroke-width="2.2" stroke-linejoin="round"><path fill="#ddd" d="m8 18 5 51q17 9 34 0l5-51z"/><ellipse fill="#eee" cx="30" cy="17" rx="26" ry="9"/><ellipse fill="#aaa" cx="30" cy="17" rx="20" ry="5"/><path fill="#eee" d="M23 17v-7q0-7 8-7t8 7v5h-5v-5q0-3-4-3t-3 3v7z"/><path fill="none" d="m14 28 4 39m3-37 2 39m7-38v39m8-40-2 39m10-41-5 39"/><path fill="none" stroke="#fff" d="m17 30 4 35m6-33v35m15-36-4 36"/></g></svg>',
    parts: {
      dialogStart: () => (ctx, settings) => {
        const start = ctx.util.el('button', 'uc-btn', settings, 'Start Calibration');
        start.type = 'button';
        start.hidden = true;
      },
    },
  },
});
