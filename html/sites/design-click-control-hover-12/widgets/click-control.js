// This design rewrites the hover instructions and refits the side notes before sizing the board.
env.widget({
  task: 'click-control',
  site: 'design-click-control-hover-12',
  name: 'design',
  split: 'train',
  scenarios: ['hover'],
  traits: { menuOpen: ['hover', 'click'] },
  template: 'click-control/controls',
  design: {
    parts: {
      hoverSize: (base, S) => (r, content) => {
        const { spec } = S;
        const notes = document.querySelectorAll('.pxlist li');
        if (notes.length) {
          notes[0].textContent = `The ${spec.color} square will move to different positions within the area.`;
          notes[4].textContent = `Keep hovering until you reach ${(spec.need / 1000).toFixed(1)} seconds.`;
        }
        const margin = document.querySelector('.pxside');
        if (margin && margin.fitNotes) margin.fitNotes();
        return base(content.getBoundingClientRect(), content);
      },
    },
  },
});
