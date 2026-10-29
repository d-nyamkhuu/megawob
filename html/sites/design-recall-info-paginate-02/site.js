// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      const notes = util.el('aside', 'ref-results-notes', body);
      util.el('h2', '', notes, 'About These Results');
      util.el('p', '', notes, 'The list shows job openings from several companies. Each page has 5 jobs. There are 4 pages in total.');
      util.el('p', '', notes, 'Use the Previous and Next buttons to view more jobs. You can review the details on each page and keep track of the best option across all pages.');
      util.el('h2', 'ref-legend-title', notes, 'Legend');
      const legend = util.el('dl', 'ref-legend', notes);
      for (const [term, description] of [
        ['Job Title:', 'Name of the job opening.'], ['Company:', 'Hiring company.'],
        ['Salary (USD):', 'Annual salary in US dollars.'], ['Rating:', 'Company rating (higher is better).'],
        ['Category:', 'Type of work.'], ['Apply:', 'Opens the job details.'],
      ]) {
        util.el('dt', '', legend, term);
        util.el('dd', '', legend, description);
      }
      Object.assign(_c, { legend, notes, stage });
    },
  };

  env.site({
    name: 'design-recall-info-paginate-02',
    template: 'site/base',
    design: { parts },
  });
})();
