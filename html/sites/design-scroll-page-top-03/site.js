// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.theme': (base, S) =>
      function (_c) {
        const { ctx } = _c;
        const { ACCENTS, LOW_ACCENTS, LOW_THEME, THEMES } = S;
        const { rng, util, content } = ctx;
        let name = rng.pick(Object.keys(THEMES));
        const root = document.documentElement;
        let accent = rng.pick(ACCENTS);
        const tr = rng.fork('chrome/theme');
        if (tr.bool(0.08)) {
          name = 'low';
          accent = tr.pick(LOW_ACCENTS);
        }
        for (const [k, v] of Object.entries(name === 'low' ? LOW_THEME : THEMES[name]))
          root.style.setProperty(
            `--${k}`,
            { bg: '#fff', panel: '#fff', fg: '#111', muted: '#333', line: '#111' }[k] || v,
          );
        root.style.setProperty('--accent', accent);
        root.dataset.theme = name;
        Object.assign(_c, { accent, content, name, rng, root, tr, util });
      },
    'frame.placement': (base, S) =>
      function (_c) {
        base(_c);
        const { util } = _c;
        const menu = util.el('div', 'mac-menu', document.body);
        util.el('span', 'mac-apple', menu, '●');
        for (const item of ['File', 'Edit', 'View', 'Go', 'Bookmarks', 'Options', 'Window', 'Help'])
          util.el('span', 'mac-menu-item', menu, item);
        util.el('span', 'mac-clock', menu, '10:24 AM');
        util.el('span', 'mac-menu-help', menu, '?');
        util.el('span', 'mac-menu-monitor', menu, '▣');
        Object.assign(_c, { menu });
      },
    'frame.header': (base, S) =>
      function (_c) {
        const { display, util } = _c;
        const header = util.el('header', 'ref-task', document.body);
        if (display === 'header') header.classList.add('mac-note-header');
        S.frameBrand(_c, header);
        Object.assign(_c, { header });
      },
    'frame.tools': (base, S) =>
      function (_c) {
        base(_c);
        const { util } = _c;
        const appTools = util.el('div', 'mac-app-tools', document.body);
        for (const [icon, label] of [
          ['◉', 'Web'],
          ['✉', 'Mail'],
          ['▦', 'Calendar'],
          ['▣', 'Contacts'],
          ['▧', 'Photos'],
          ['⚙', 'System'],
        ]) {
          const tool = util.el('div', 'mac-app-tool', appTools);
          util.el('span', 'mac-app-icon', tool, icon);
          util.el('span', '', tool, label);
        }
        Object.assign(_c, { appTools });
      },
    'frame.body': (base, S) =>
      function (_c) {
        const { util } = _c;
        const body = util.el('div', 'ref-body', document.body);
        const topicIndex = util.el('aside', 'mac-topic-index', body);
        topicIndex.classList.add('page-inspector');
        const tabs = util.el('div', 'inspector-tabs', topicIndex);
        for (const item of ['Page Info', 'History', 'Links', 'Media']) util.el('span', 'inspector-tab', tabs, item);
        const info = util.el('div', 'inspector-content', topicIndex);
        util.el('strong', 'inspector-title', info, 'Golden Gate Bridge');
        util.el('div', 'inspector-subtitle', info, 'Wikipedia article');
        util.el('div', 'inspector-photo', info);
        for (const [k, v] of [
          ['URL', 'http://en.wikipedia.org/wiki/Golden_Gate_Bridge'],
          ['Page type', 'Article'],
          ['Content language', 'English'],
          ['Last modified', '14 April 2010, 19:24 (UTC)'],
          ['Size', '96 KB (wikitext)'],
          ['Total views', '12,345,678 (approx.)'],
        ]) {
          const row = util.el('div', 'inspector-row', info);
          util.el('span', 'inspector-key', row, k);
          util.el('span', 'inspector-value', row, v);
        }
        util.el(
          'div',
          'inspector-description',
          info,
          'The Golden Gate Bridge is a suspension bridge spanning the Golden Gate strait, the one-mile-wide channel between San Francisco Bay and the Pacific Ocean. It is one of the most internationally recognized symbols of San Francisco, California, and the United States.',
        );
        const cats = util.el('div', 'inspector-categories', info);
        util.el('strong', '', cats, 'Categories');
        util.el(
          'span',
          '',
          cats,
          'Suspension bridges in the United States · Bridges in San Francisco · Transportation in San Francisco · National Historic Landmarks in California',
        );
        S.frameSidebar(_c, body);
        Object.assign(_c, { body, cats, info, tabs, topicIndex });
      },
  };

  env.site({
    name: 'design-scroll-page-top-03',
    template: 'site/base',
    design: { parts },
  });
})();
