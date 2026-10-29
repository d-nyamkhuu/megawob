// The sequence controls use the site's smaller sizing, seven decoys, and instruction progress marker.
env.widget({
  task: 'click-control',
  site: 'design-click-control-sequence-02',
  name: 'design',
  split: 'train',
  scenarios: ['sequence'],
  template: 'click-control/controls',
  design: {
    seqW: 220,
    seqH: 88,
    seqHFrac: .22,
    seqDecoys: 7,
    seqLabels: ['Settings', 'Cancel', 'Reset', 'Options', 'Help', 'Preview'],
    parts: {
      seqSynced: () => (ctx, m) => {
        const note = document.querySelector('.instruction');
        if (note) note.dataset.sequenceProgress = String(m.clicks.length);
      },
    },
  },
});
