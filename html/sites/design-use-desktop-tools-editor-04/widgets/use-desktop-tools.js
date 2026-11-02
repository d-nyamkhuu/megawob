// Design of this site on the use-desktop-tools/workspace template: the reference look; it keeps the font name and the Line / Column readout.
(function () {
  'use strict';
  env.widget({
    task: 'use-desktop-tools',
    site: 'design-use-desktop-tools-editor-04',
    name: 'design',
    split: 'train',
    scenarios: ['editor'],
    template: 'use-desktop-tools/workspace',
    design: {
      toolIcons: {},
      wordsLabel: (n) => `${n} words`,
      toolHtml: {},
      sizeCur: null,
      footerReadout: true, fontName: 'Helvetica',
    },
  });
})();
