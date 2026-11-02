// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) =>
      function (_c) {
        const { util } = _c;
        document.body.classList.remove('pb-has-note');
        const header = util.el('header', 'ref-task', document.body);
        header.dataset.instruction = _c.display;
        const help = util.el('aside', 'pb-help', header);
        util.el('h2', '', help, 'Page Builder Help');
        util.el('p', 'pb-intro', help, 'Build your page by adding blocks from the palette to the draft area.');
        const steps = [
          ['Choose a block', 'Select a block from the palette above the draft.'],
          ['Add to a position', 'Drag a block to an empty position in the draft.'],
          ['Arrange content', 'Each row has a left and right position. You can swap blocks or replace them at any time.'],
          ['Publish changes', "When you're ready, publish your changes to make them live."],
        ];
        const list = util.el('div', 'pb-steps', help);
        steps.forEach(([title, copy], i) => {
          const row = util.el('div', 'pb-step', list);
          util.el('span', 'pb-step-no', row, String(i + 1));
          const text = util.el('div', 'pb-step-copy', row);
          util.el('strong', '', text, title);
          util.el('p', '', text, copy);
        });
        const legend = util.el('section', 'pb-legend', help);
        util.el('h3', '', legend, 'Block types');
        for (const [glyph, title, copy, kind] of [
          ['T', 'Text', 'Paragraphs, lists, and rich text.', 'text'],
          ['H', 'Heading', 'Page and section headings.', 'heading'],
          ['❝', 'Quote', 'Highlighted quotations.', 'quote'],
          ['―', 'Divider', 'Visual separators.', 'divider'],
        ]) {
          const row = util.el('div', 'pb-legend-row', legend);
          util.el('span', 'pb-legend-icon ' + kind, row, glyph);
          const copyEl = util.el('div', '', row);
          util.el('strong', '', copyEl, title);
          util.el('p', '', copyEl, copy);
        }
        const titlebar = util.el('div', 'pb-titlebar', header);
        const heading = util.el('div', 'pb-heading', titlebar);
        util.el('h1', '', heading, 'Campaign Page');
        util.el('span', 'pb-draft', heading, '●  Draft');
        util.el('p', '', heading, 'Last updated Apr 26, 2022, 10:14 AM');
        S.frameBrand(_c, header);
        document.body.dataset.instruction = _c.display;
        Object.assign(_c, { header, titlebar });
      },
    'frame.stage': (base, S) =>
      function (_c) {
        const { body, util } = _c;
        const stage = util.el('main', 'ref-stage', body);
        S.frameAlign(_c, stage);

        Object.assign(_c, { stage });
      },
    'frame.panel': (base, S) => function (_c) {
      base(_c);
      const panel = _c.body.querySelector('.ref-panel');
      if (panel) {
        document.querySelector('.pb-help').appendChild(panel);
        document.body.classList.add('pb-has-note');
      }
    },
    'frame.toast': (base, S) => function (_c) {
      base(_c);
      const note = document.querySelector('.ref-note');
      if (note) {
        document.querySelector('.pb-help').appendChild(note);
        document.body.classList.add('pb-has-note');
      }
    },
    overlay: (base, S) => function (ctx) {
      const result = base(ctx);
      if (ctx.kind === 'banner') {
        const header = document.querySelector('.ref-task');
        result.el.style.top = header.getBoundingClientRect().bottom + 'px';
      }
      return result;
    },
  };

  env.site({
    name: 'design-use-site-builder-page-05',
    template: 'site/base',
    design: { parts },
  });
})();
