// Design on templates/site/form-pick-autocomplete-01.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-choose-option-tags-03',
    styles: ['site.css'],
    scripts: [],
    template: 'site/choose-option-autocomplete-01',
    design: {
      C: {
        site: 'design-choose-option-tags-03',
        brand: 'Community Hub',
        title: 'Email Preferences',
        instruction: 'top',
        rail: 'Settings|Profile|Email Preferences|Privacy|Account Settings|Connected Apps',
        menu: '⌂　Home|▤　News|✉　Messages|⚙　Settings|◫　Help',
        briefTitle: 'About Newsletter Topics',
      },
      parts: {
        'frame.7': (base, S) =>
          function (_c) {
            const { top, u } = _c;
            u.el('span', 'ds-window-controls', top, '−　□　×');
          },
        'frame.10': (base, S) =>
          function (_c) {
            const { C } = S;
            const { body, u } = _c;
            if (C.rail) {
              const rail = u.el('aside', 'ds-rail', body);
              u.el('h2', 'ds-rail-title', rail, '⚙　Settings');
              C.rail.split('|').forEach((t, i) => {
                const row = u.el('div', 'ds-rail-row' + (i === 2 ? ' active' : ''), rail, t);
                if (i === 2) row.textContent = '✉　' + t;
              });
              const help = u.el('section', 'ds-help', rail);
              u.el('h3', '', help, 'ℹ　About Newsletter Topics');
              u.el(
                'p',
                '',
                help,
                'Choose the topics you want to receive in our newsletter. You can select multiple topics. Click a topic to add it, and click the × on a topic to remove it.',
              );
              u.el('h4', '', help, '💡　Tips:');
              const ul = u.el('ul', '', help);
              [
                'You can select more than one topic.',
                'Click the × on a topic to remove it.',
                'Start typing to quickly find a topic in the list.',
              ].forEach((t) => u.el('li', '', ul, t));
            }
          },
        'frame.14': (base, S) =>
          function (_c) {
            const { C } = S;
            const { contentRoot, ctx, u } = _c;
            if (_c.mode === 'top') contentRoot.classList.add('has-header-note');
            function briefing(parent, cls) {
              const b = u.el('aside', cls, parent);
              if (cls === 'ds-brief') u.el('h2', '', b, C.briefTitle || 'Task');
              u.el('div', 'ds-instruction', b, ctx.instruction);
              return b;
            }
            Object.assign(_c, { briefing });
          },
        'frame.18': () => () => {},
        'frame.20': (base, S) =>
          function (_c) {
            const { C } = S;
            const { marker, u } = _c;
            u.el('strong', '', marker, '✉');
            u.el('h1', '', marker, C.title);
          },
        'frame.21': () => () => {},
        'frame.23': (base, S) =>
          function (_c) {
            const { main, u } = _c;
            const context = u.el('section', 'ds-context', main);
            const news = u.el('div', 'ds-context-row ds-newsletter', context);
            u.el('b', '', news, 'Newsletter');
            const newsVal = u.el('span', 'ds-context-value', news);
            u.el('span', 'ds-check', newsVal, '✓');
            u.el('span', '', newsVal, 'Send me the Community Hub newsletter');
            const email = u.el('div', 'ds-context-row ds-email', context);
            u.el('b', '', email, 'Email Address');
            u.el('span', 'ds-email-value', email, 'jordan.lee@example.com');
            const frequency = u.el('div', 'ds-context-row ds-frequency', context);
            u.el('b', '', frequency, 'Email Frequency');
            const options = u.el('div', 'ds-frequency-options', frequency);
            ['Weekly', 'Monthly', 'Only major updates'].forEach((t, i) => {
              const item = u.el('span', '', options);
              u.el('i', i === 0 ? 'selected' : '', item, '');
              u.el('span', '', item, t);
            });
            Object.assign(_c, { context, email, frequency, news, newsVal, options });
          },
        'frame.35': () => () => {},
        'frame.36': () => () => {},
      },
    },
  });
})();
