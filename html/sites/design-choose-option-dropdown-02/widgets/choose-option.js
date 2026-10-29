// Adds the returns request framing, a square form, and its extra fields and guidelines.
(function () {
  'use strict';

  env.widget({
    task: 'choose-option',
    site: 'design-choose-option-dropdown-02',
    name: 'design',
    split: 'train',
    scenarios: ['dropdown'],
    template: 'choose-option/widgets',
    design: {
      details: false,
      radius: '0px',
      controlRadius: '0px',
      motifTitle: 'Order Number:',
      motifValue: 'MG7824519',
      motifFields: [['Reason for return:', ''], ['Quantity:', '1']],
      parts: {
        begin: (base, S) => (ctx) => {
          base(ctx);
          const { util } = ctx;
          const work = util.el('div', 'rt-work', ctx.stage);
          util.el('h3', 'rt-h', work, 'Start a Returns Request');
          util.el('p', 'rt-p', work, 'Complete the form below to tell us which item you are returning.');
          util.el('hr', 'rt-hr', work);
          S.els.rrow = util.el('div', 'rt-row', work);
        },
        wrap: (base, S) => (ctx) => ctx.util.el('div', 'fp-wrap', S.els.rrow),
        motifFields: (base, S) => (ctx, card) => {
          base(ctx, card);
          const { util } = ctx;
          const decoys = card.querySelector('.ds-motif-xtras');
          const label = util.el('label', 'ds-motif-field rt-cm', decoys, 'Comments (optional):');
          const box = util.el('div', 'rt-comment-box', label);
          const area = util.el('textarea', '', box);
          const scroll = util.el('div', 'rt-scroll', box);
          [-1, 1].forEach((dir) => {
            const button = util.el('button', dir < 0 ? 'rt-up' : 'rt-down', scroll, dir < 0 ? '▲' : '▼');
            button.type = 'button';
            button.setAttribute('aria-label', dir < 0 ? 'Scroll comments up' : 'Scroll comments down');
            button.addEventListener('click', () => {
              area.scrollTop += dir * 24;
            });
          });

          const guide = util.el('aside', 'rt-guide', S.els.rrow);
          util.el('h4', '', guide, 'Return Guidelines');
          const list = util.el('ul', '', guide);
          [
            'Items must be in original condition.',
            'Returns are accepted within 30 days of delivery.',
            'Certain items may have additional restrictions.',
          ].forEach((text) => util.el('li', '', list, text));
          const finalItem = util.el('li', '', list, 'For full details, see our ');
          util.el('a', '', finalItem, 'Return Policy.');
        },
      },
    },
  });
})();
