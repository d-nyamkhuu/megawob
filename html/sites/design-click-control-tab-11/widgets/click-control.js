// This design gives the tabs custom line icons, overview panels, and a quick tips sidebar.
env.widget({
  task: 'click-control',
  site: 'design-click-control-tab-11',
  name: 'design',
  split: 'train',
  scenarios: ['tab'],
  traits: { menuOpen: ['hover', 'click'] },
  template: 'click-control/controls',
  design: {
    parts: {
      tabButton: () => (ctx, tb, t, i) => {
        const { util } = ctx;
        const icon = util.el('span', 'tab-icon', tb);
        icon.innerHTML =
          '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
          [
            '<path d="M3 14 16 3l13 11M6 12v16h8v-9h5v9h7V12"/>',
            '<path d="M8 3h12l7 7v19H8zM20 3v8h7M12 16h10M12 21h10"/>',
            '<path d="M7 23h19l-3-5v-7a7 7 0 0 0-14 0v7zM14 28h5M16 2v2"/>',
            '<circle cx="16" cy="9" r="4"/><path d="M9 27v-5a7 7 0 0 1 14 0v5zM5 14a4 4 0 1 1 3-7M27 14a4 4 0 1 0-3-7M3 26v-6l4-3M29 26v-6l-4-3"/>',
          ][i % 4] +
          '</svg>';
        tb.prepend(icon);
      },
      tabPanel: () => (ctx, p, t, i, links) => {
        const { util } = ctx;
        util.el('h2', 'welcome-title', p, 'Welcome');
        util.el('p', 'welcome-subtitle', p, 'Here are some useful links to get started.');
        const list = util.el('div', 'welcome-links', p);
        t.words.forEach((w, j) => {
          if (!w.link) return;
          const row = util.el('div', 'welcome-row', list);
          const badge = util.el('span', 'welcome-icon', row);
          const rowIndex = list.children.length - 1;
          badge.innerHTML =
            '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
            [
              '<path d="M7 3h12l7 7v19H7zM19 3v8h7M11 16h10M11 21h10"/>',
              '<path d="M16 7C11 2 4 4 2 6v23c4-3 10-3 14 0 4-3 10-3 14 0V6c-4-3-10-3-14 1v22"/>',
              '<path d="m13 10 5-5a6 6 0 0 1 9 9l-5 5M19 22l-5 5a6 6 0 0 1-9-9l5-5M11 21l10-10"/>',
              '<circle cx="12" cy="9" r="4"/><path d="M3 28v-5a9 9 0 0 1 18 0v5zM23 6a4 4 0 0 1 0 8M24 18c5 0 6 4 6 9"/>',
            ][rowIndex % 4] +
            '</svg>';
          const text = util.el('div', 'welcome-copy', row);
          const a = util.el('span', 'uc-link', text, w.text);
          a.dataset.key = `${i}.${j}`;
          a.dataset.role = 'link';
          links.push(a);
          util.el(
            'div',
            'link-description',
            text,
            [
              'Learn the basics of our platform.',
              'Find answers to common questions.',
              'See what’s new this month.',
              'Join the conversation.',
            ][rowIndex % 4],
          );
        });
      },
      rendered: (base) => (ctx, page, content) => {
        base(ctx, page, content);
        const tips = ctx.util.el('aside', 'quick-tips', content);
        const th = ctx.util.el('h3', '', tips, 'Quick Tips');
        const bulb = ctx.util.el('span', 'tip-icon', th);
        bulb.innerHTML = '<svg viewBox="0 0 36 40" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M12 29c0-5-6-6-6-13a11 11 0 0 1 22 0c0 7-6 8-6 13zM13 33h8M15 37h4M17 1v-3M2 5l-3-3M32 5l3-3M0 16h-4M34 16h4"/></svg>';
        th.prepend(bulb);
        [
          'Use the tabs above to explore different pages.',
          'Look for helpful resources and links.',
          'Each tab has its own collection of links.',
        ].forEach((text) => ctx.util.el('p', '', tips, text));
      },
    },
  },
});
