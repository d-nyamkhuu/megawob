// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) =>
      function (_c) {
        const { display, lr, nav, util, word } = _c;
        const { K } = S;
        const header = util.el('header', 'ref-task', document.body);
        header.dataset.app = 'community-connect';
        if (display !== 'header' || nav) {
          const title = 'Community Connect';
          const brand = util.el('div', 'ref-brand', header, word ? word(lr.pick(K.brand)) : title);
          brand.dataset.role = 'brand';
        }
        Object.assign(_c, { header });
      },
    'frame.body': (base, S) =>
      function (_c) {
        const { util } = _c;
        const body = util.el('div', 'ref-body', document.body);
        const rail = util.el('nav', 'sf-rail', body);
        for (const [icon, label] of [
          ['⌂', 'Dashboard'],
          ['✉', 'Campaigns'],
          ['▤', 'Content'],
          ['▧', 'Media'],
          ['•', 'Social'],
          ['▣', 'Contacts'],
          ['▥', 'Reports'],
          ['⚙', 'Settings'],
        ]) {
          const item = util.el('div', `sf-rail-item${label === 'Campaigns' ? ' selected' : ''}`, rail);
          util.el('span', 'sf-rail-icon', item, icon);
          util.el('span', '', item, label);
        }
        S.frameSidebar(_c, body);
        Object.assign(_c, { body, rail });
      },
    'frame.stage': (base, S) =>
      function (_c) {
        const { body, util } = _c;
        const stage = util.el('main', 'ref-stage', body);
        S.frameAlign(_c, stage);
        const help = util.el('aside', 'sf-help', body);
        util.el('h2', '', help, 'Block Help');
        util.el('p', '', help, 'Drag a block from the palette into a numbered position in the email layout.');
        for (const [icon, title, text] of [
          ['A', 'Text', 'Add a paragraph of text.'],
          ['H1', 'Heading', 'Add a heading (H1, H2, or H3).'],
          ['☰', 'Divider', 'Insert a horizontal divider.'],
          ['❝', 'Quote', 'Add a pulled quote.'],
          ['▧', 'Image', 'Insert an image from your media library.'],
          ['▥', 'Columns', 'Create a two or three column section.'],
          ['▱', 'Button', 'Add a call-to-action button.'],
          ['☷', 'List', 'Add a bulleted or numbered list.'],
          ['</>', 'HTML', 'Insert custom HTML.'],
        ]) {
          const row = util.el('div', 'sf-help-row', help);
          util.el('b', '', row, icon);
          const copy = util.el('div', '', row);
          util.el('strong', '', copy, title);
          util.el('small', '', copy, text);
        }
        const status = util.el('div', 'sf-status', help);
        util.el('strong', '', status, 'Campaign Status');
        util.el('span', '', status, '●  Not sent');

        Object.assign(_c, { help, stage, status });
      },
  };

  env.site({
    name: 'design-use-site-builder-email-04',
    template: 'site/base',
    design: { parts },
  });
})();
