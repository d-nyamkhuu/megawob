// This design gives each tab a project summary, fixed facts, and its resource links.
env.widget({
  task: 'click-control',
  site: 'design-click-control-tab-10',
  name: 'design',
  split: 'train',
  scenarios: ['tab'],
  traits: { menuOpen: ['hover', 'click'] },
  template: 'click-control/controls',
  design: {
    parts: {
      tabButton: () => () => {},
      tabPanel: () => (ctx, p, t, i, links) => {
        const { util } = ctx;
        util.el('h2', 't10-h', p, 'Project Overview');
        util.el('p', 't10-intro', p, 'Our team is focused on delivering a streamlined platform that improves productivity and simplifies daily workflows. This document provides a quick summary of key goals, timelines, and helpful links.');
        util.el('hr', 't10-hr', p);
        util.el('h3', 't10-h3', p, 'Key Information');
        const kl = util.el('ul', 't10-ul', p);
        ['Project lead: Dana Ruiz', 'Start date: Apr 3, 2013', 'Target release: Sep 30, 2013', 'Status: On track']
          .forEach((s) => util.el('li', '', kl, s));
        util.el('h3', 't10-h3', p, 'Useful Links');
        const ul = util.el('ul', 't10-ul t10-links', p);
        t.words.forEach((word, j) => {
          const li = util.el('li', '', ul);
          if (word.link) {
            const a = util.el('span', 'uc-link', li, word.text);
            a.dataset.key = i + '.' + j;
            a.dataset.role = 'link';
            links.push(a);
          } else li.append(word.text);
        });
      },
    },
  },
});
