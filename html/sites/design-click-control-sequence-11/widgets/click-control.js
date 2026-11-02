// Design of this site on the click-control/controls template (templates/click-control/controls.js): glossy icon buttons
// (a check, a gear or a note) with the label beside the icon; no decoy buttons.
env.widget({
  task: 'click-control',
  site: 'design-click-control-sequence-11',
  name: 'design',
  split: 'train',
  scenarios: ['sequence'],
  traits: { menuOpen: ['hover', 'click'] },
  template: 'click-control/controls',
  design: {
    seqW: 220,
    seqH: 88,
    seqHFrac: .22,
    seqDecoys: 0,
    parts: {
      seqButton: () => (ctx, s, e, i) => {
        const { util } = ctx;
        const b = util.el('button', 'uc-btn', s);
        const icon = util.svg('svg', { viewBox: '0 0 34 34', class: 'sequence-icon' }, b);
        icon.innerHTML =
          '<defs><linearGradient id="sequence-green" x2="0" y2="1"><stop stop-color="#a9dba0"/><stop offset=".5" stop-color="#6ab76a"/><stop offset="1" stop-color="#3f8e49"/></linearGradient><linearGradient id="sequence-metal" x2="0" y2="1"><stop stop-color="#c7d6e7"/><stop offset=".5" stop-color="#a5b9d1"/><stop offset="1" stop-color="#7793b4"/></linearGradient></defs>';
        if (i === 2) {
          util.svg('path', { d: 'M5 2h20l4 4v26H5Z', fill: '#fffff7', stroke: '#9e9b82', 'stroke-width': 1.5 }, icon);
          util.svg('path', { d: 'M9 7h15M9 11h15M9 15h12M9 19h10M9 23h9', stroke: '#a8b0ba' }, icon);
          util.svg('path', { d: 'm18 28 3-8L29 9l4 3-9 12Z', fill: '#f2c454', stroke: '#9e854b' }, icon);
          util.svg('path', { d: 'm18 28 4-2-3-2Z', fill: '#50627a' }, icon);
        } else if (i % 2 === 0) {
          util.svg('circle', { cx: 17, cy: 17, r: 14, fill: 'url(#sequence-green)', stroke: '#5b9255' }, icon);
          util.svg('path', { d: 'm9 17 5 5 11-12', fill: 'none', stroke: '#effff3', 'stroke-width': 3 }, icon);
        } else {
          util.svg('path', {
            d: 'm14 2 6 0 1 4 4 2 4-1 3 5-3 3 0 4 3 3-3 5-4-1-4 2-1 4h-6l-1-4-4-2-4 1-3-5 3-3v-4l-3-3 3-5 4 1 4-2Z',
            fill: 'url(#sequence-metal)',
            stroke: '#6d84a4',
          }, icon);
          util.svg('circle', { cx: 17, cy: 17, r: 6, fill: '#e8f1f8', stroke: '#55708f' }, icon);
        }
        util.el('span', '', b, e.label);
        b.dataset.key = e.key;
        return b;
      },
    },
  },
});
