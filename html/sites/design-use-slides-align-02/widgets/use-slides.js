// Design on the use-slides/office template; defaults reproduce the reference scaffold.
env.widget({
  task: 'use-slides',
  site: 'design-use-slides-align-02',
  name: 'design',
  split: 'train',
  scenarios: ['align'],
  template: 'use-slides/office',
  design: {
    brand: 'Salesforce',
    workspace: 'Documents',
    editorLabel: 'Q3 Business Review editor',
    documentTitle: 'Q3 Business Review',
    slideEyebrow: '',
    slideFooter: '',
    uiFont: 'Arial, sans-serif',
    frameInset: 0,
    railWidth: 190,
    compactRailWidth: 150,
    thumbnailHeight: 110,
    thumbnailPitch: 128,
    canvasInsetX: 18,
    canvasInsetY: 18,
    maxScale: 2.2,
    parts: {
      menu(base, S) {
        return () => {
          base();
          const menu = S.root.querySelector('.as-menu');
          const items = [...menu.children];
          const [file, home, view, insert, design, review, help] = items;
          file.textContent = 'File'; home.textContent = 'Home'; insert.textContent = 'Insert';
          design.textContent = 'Design'; review.textContent = 'Review'; view.textContent = 'View';
          help.hidden = true;
          home.classList.add('as-home-tab');
          const make = (label) => S.ctx.util.el('span', 'as-extra-tab', menu, label);
          const transitions = make('Transitions'), animations = make('Animations'), show = make('Slide Show');
          menu.replaceChildren(file, home, insert, design, transitions, animations, show, review, view, help);
        };
      },
    },
  },
});
