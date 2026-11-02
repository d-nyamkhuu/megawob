// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    overlay: (base, S) =>
      function overlay(ctx) {
        const { K } = S;
        const { rng, util, kind } = ctx;
        const { text } = ctx.content.bannerText(rng, kind === 'banner' ? 'notice' : kind);
        const word = ctx.lang && ctx.lang !== 'en' && ctx.word ? ctx.word : null;
        const el = util.el('div', `ref-ov ref-ov-${kind}`, document.body);
        el.dataset.role = 'overlay';
        if (kind === 'banner') el.style.top = `${document.querySelector('.ref-task').getBoundingClientRect().bottom}px`;
        if (kind === 'cookie') {
          const end = document.querySelector('[data-role="submit"]');
          if (end) {
            const r = end.getBoundingClientRect();
            if (r.top > window.innerHeight - 120) el.style.bottom = `${window.innerHeight - r.top + 8}px`;
          }
        }
        const box = kind === 'promo' ? util.el('div', 'ref-ov-box', el) : el;
        util.el(
          'div',
          'ref-ov-text',
          box,
          word ? word(rng.fork('lang').pick(K.overlay[kind] || K.overlay.toast)) : text,
        );
        const row = util.el('div', 'ref-ov-row', box);
        const btn = (label, how, primary) => {
          if (word && K.button[label]) label = word(K.button[label]);
          const b = util.el('button', primary ? 'ref-ov-btn ref-ov-primary' : 'ref-ov-btn', row, label);
          b.type = 'button';
          b.addEventListener('click', () => (how ? ctx.dismiss(how) : env.log('overlay-click', { label })));
          return b;
        };
        let dismiss;
        if (kind === 'cookie') {
          if (rng.bool(0.5)) btn('Settings', null, false);
          btn(rng.pick(['Reject all', 'Necessary only']), 'reject', false);
          dismiss = btn(rng.pick(['Accept all', 'Accept', 'Got it']), 'accept', true);
        } else if (kind === 'promo') {
          dismiss = btn(rng.pick(['No thanks', 'Maybe later', 'Close']), 'close', false);
          btn(rng.pick(['Upgrade now', 'Start trial', 'Learn more']), null, true);
        } else if (kind === 'banner') {
          dismiss = btn('Dismiss', 'close', false);
        } else {
          dismiss = btn('×', 'close', false);
          dismiss.setAttribute('aria-label', word ? word('close') : 'Close');
        }
        return { el, dismiss, ttlSteps: kind === 'toast' ? rng.int(3, 5) : 0 };
      },
    'frame.layout': (base, S) =>
      function (_c) {
        const { ctx } = _c;
        const W = window.innerWidth;
        const H = window.innerHeight;
        const roomy = W >= 1260;
        const tall = H >= 700;
        let display = ctx.display || 'header';
        if (display === 'panel' && !roomy) display = 'header';
        if (display === 'toast' && !tall) display = 'header';
        // reset() reuses the body: a previous toast must not shrink later episodes.
        document.body.classList.toggle('ref-has-note', display === 'toast');
        document.body.dataset.instruction = display;
        Object.assign(_c, { H, W, display, roomy, tall });
      },
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
        } else {
          util.el('div', 'ref-brand', header, 'Community Connect').dataset.role = 'brand';
        }
        Object.assign(_c, { header });
      },
    'frame.body': (base, S) =>
      function (_c) {
        const { util } = _c;
        const body = util.el('div', 'ref-body', document.body);
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
        Object.assign(_c, { body, campaignNames, dates, list, listHead, newCampaign, records });
      },
    'frame.stage': (base, S) =>
      function (_c) {
        const { body, util } = _c;
        const stage = util.el('main', 'ref-stage', body);
        S.frameAlign(_c, stage);

        // A decorative email preview belongs to the site frame; it does not
        // participate in the task model or change any task controls.
        const preview = util.el('section', 'cc-email-preview', body);
        const previewTabs = util.el('div', 'cc-preview-tabs', preview);
        util.el('span', 'cc-preview-tab active', previewTabs, 'Preview');
        util.el('span', 'cc-preview-tab', previewTabs, 'Text Version');
        const letter = util.el('div', 'cc-preview-letter', preview);
        const masthead = util.el('div', 'cc-preview-masthead', letter);
        util.el('strong', '', masthead, 'Riverton');
        util.el('span', '', masthead, 'Community Association');
        util.el('div', 'cc-preview-lines', letter);
        util.el('div', 'cc-preview-picture', letter);
        util.el('div', 'cc-preview-lines lower', letter);
        util.el('div', 'cc-preview-small', letter);
        Object.assign(_c, { letter, masthead, preview, previewTabs, stage });
      },
  };

  env.site({
    name: 'design-use-site-builder-email-01',
    template: 'site/base',
    design: { parts },
  });
})();
