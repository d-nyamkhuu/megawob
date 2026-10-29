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
          root.style.setProperty(`--${k}`, v);
        root.style.setProperty('--accent', accent);
        root.dataset.theme = name;
        Object.assign(_c, { accent, content, name, rng, root, tr, util });
      },
    'frame.header': (base, S) =>
      function (_c) {
        const { content, display, local, lr, nav, rng, util, word } = _c;
        const { K } = S;
        const header = util.el('header', 'ref-task', document.body);
        header.dataset.app = 'community-connect';
        if (display !== 'header' || nav) {
          const title = 'Community Connect';
          const brand = util.el('div', 'ref-brand', header, word ? word(lr.pick(K.brand)) : title);
          brand.dataset.role = 'brand';
        }
        if (true) {
          const n = util.el('nav', 'ref-nav', header);
          const navItems = local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav);
          for (const item of ['Dashboard', 'Pages', 'Media', 'Campaigns', 'Social', 'Contacts', 'Reports'].slice(
            0,
            Math.max(7, navItems.length),
          )) {
            const a = util.el('a', 'ref-navlink', n, item);
            if (item === 'Campaigns') a.classList.add('active');
            a.dataset.role = 'nav';
            a.addEventListener('click', (e) => {
              e.preventDefault();
              env.log('decoy', { what: 'nav', label: item });
            });
          }
        }
        Object.assign(_c, { header });
      },
    'frame.body': (base, S) =>
      function (_c) {
        const { util } = _c;
        const body = util.el('div', 'ref-body', document.body);
        const summary = util.el('section', 'cc-summary', body);
        const cover = util.el('div', 'cc-cover', summary, '');
        cover.setAttribute('aria-hidden', 'true');
        const details = util.el('div', 'cc-summary-details', summary);
        util.el('div', 'cc-campaign-title', details, 'Summer Field Notes');
        util.el('div', 'cc-campaign-type', details, 'Email Campaign');
        util.el('div', 'cc-meta', details, 'Status:　 Unsent');
        util.el('div', 'cc-meta', details, 'Audience:　 Subscribers');
        util.el('div', 'cc-meta', details, 'Created:　 Apr 12, 2025');
        util.el('div', 'cc-meta', details, 'Last edited:　 Apr 12, 2025');
        const stats = util.el('div', 'cc-stats', summary);
        for (const [name, value, sub] of [
          ['Recipients', '2,480', ''],
          ['Opens', '0', '0%'],
          ['Clicks', '0', '0%'],
          ['Unsubscribes', '0', '0%'],
        ]) {
          const cell = util.el('div', 'cc-stat', stats);
          util.el('div', 'cc-stat-label', cell, name);
          util.el('strong', '', cell, value);
          util.el('span', '', cell, sub);
        }
        const send = util.el('button', 'cc-send', summary);
        send.innerHTML =
          '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.4 11.3 21.2 2.6c.7-.3 1.4.4 1.1 1.1l-8.7 18.8c-.3.7-1.3.6-1.5-.1l-2.2-7.5 6.2-6.2-8.2 4.6-5.4-1.1c-.8-.2-.9-1.5-.1-1.9Z"/></svg><span>Send test</span>';
        send.type = 'button';
        send.addEventListener('click', () => env.log('decoy', { what: 'summary-action', label: 'Send test' }));
        const records = util.el('aside', 'cc-records', body);
        util.el('div', 'cc-records-title', records, 'Campaigns');
        const newCampaign = util.el('button', 'cc-new', records, '▤  New Campaign');
        newCampaign.type = 'button';
        const listHead = util.el('div', 'cc-list-head', records);
        util.el('span', '', listHead, 'Name');
        util.el('span', '', listHead, 'Last Modified');
        const list = util.el('div', 'cc-list', records);
        const campaignNames = [
          'Spring Newsletter',
          'Park Improvements',
          'Community Survey',
          'Road Work Update',
          'Volunteer Fair',
          'Recycling Program',
          'Winter Recap',
          'Library Events',
          'Safety Reminders',
          'Budget Overview',
          'New Residents',
          'Holiday Thank You',
          'Fall Newsletter',
          'Community Garden',
          'Board Meeting Notes',
          'Green Spaces Plan',
          'Summer Events',
          'Transit Updates',
        ];
        const dates = [
          'Apr 20, 1997',
          'Apr 12, 1997',
          'Apr 3, 1997',
          'Mar 28, 1997',
          'Mar 18, 1997',
          'Mar 10, 1997',
          'Feb 25, 1997',
          'Feb 14, 1997',
          'Feb 2, 1997',
          'Jan 20, 1997',
          'Jan 10, 1997',
          'Dec 18, 1996',
          'Dec 1, 1996',
          'Nov 14, 1996',
          'Oct 30, 1996',
          'Oct 12, 1996',
          'Sep 26, 1996',
          'Sep 12, 1996',
        ];
        campaignNames.forEach((item, i) => {
          const row = util.el('div', `cc-record${i === 0 ? ' selected' : ''}`, list);
          util.el('span', 'cc-envelope', row, '✉');
          util.el('span', 'cc-record-name', row, item);
          util.el('span', 'cc-record-date', row, dates[i]);
        });
        S.frameSidebar(_c, body);
        Object.assign(_c, {
          body,
          campaignNames,
          cover,
          dates,
          details,
          list,
          listHead,
          newCampaign,
          records,
          send,
          stats,
          summary,
        });
      },
    'frame.stage': (base, S) =>
      function (_c) {
        const { body, util } = _c;
        const stage = util.el('main', 'ref-stage', body);
        S.frameAlign(_c, stage);
        Object.assign(_c, { stage });
      },
    'frame.nav': (base, S) => function (_c) {},
  };

  env.site({
    name: 'design-use-site-builder-email-03',
    template: 'site/base',
    design: { parts },
  });
})();
