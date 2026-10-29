// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
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
        document.body.classList.toggle('ref-has-header-note', display === 'header');
        document.body.classList.toggle('ref-has-panel-note', display === 'panel');
        Object.assign(_c, { H, W, display, roomy, tall });
      },
    'frame.placement': (base, S) =>
      function (_c) {
        const { W, content, ctx, local, lr, rng, roomy, tall, util, word } = _c;
        const { K, endLabel } = S;
        // End control placement (none in finish mode).
        let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
        const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
        if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
        const sidebar = roomy && rng.bool(0.35);
        const nav = W >= 1180 && rng.bool(0.5);
        const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
        let label = endLabel(rng, content);
        if (word) label = word(lr.pick(K.end));
        // A decoy that reads like an end control (another end word, never this episode's label).
        const { collide, cr } = S.frameCollide(_c, label);
        const titlebar = util.el('div', 'gtk-titlebar', document.body);
        util.el('span', 'gtk-appicon', titlebar, '▣');
        util.el('strong', '', titlebar, 'Career Opportunities');
        const win = util.el('div', 'gtk-window-controls', titlebar);
        for (const [c, t] of [
          ['min', '−'],
          ['max', '□'],
          ['close', '×'],
        ])
          util.el('span', `gtk-win-${c}`, win, t);
        const menubar = util.el('nav', 'gtk-menubar', document.body);
        for (const t of ['File', 'Edit', 'View', 'Job', 'Window', 'Help']) util.el('span', '', menubar, t);
        const toolbar = util.el('nav', 'gtk-toolbar', document.body);
        for (const [icon, text] of [
          ['▯', 'New'],
          ['▱', 'Open'],
          ['▤', 'Print'],
          ['⌕', 'Find'],
          ['☷', 'Sort'],
          ['▽', 'Filter'],
        ]) {
          const item = util.el('div', 'gtk-tool', toolbar);
          util.el('span', 'gtk-tool-icon', item, icon);
          util.el('span', '', item, text);
        }
        Object.assign(_c, {
          collide,
          cr,
          decoys,
          label,
          menubar,
          nav,
          placement,
          sidebar,
          titlebar,
          toolbar,
          wantFooter,
          win,
        });
      },
    'frame.body': (base, S) =>
      function (_c) {
        const { util } = _c;
        const body = util.el('div', 'ref-body', document.body);
        const openings = util.el('aside', 'gtk-openings', body);
        const oh = util.el('div', 'gtk-pane-head', openings, 'Job Openings');
        const cols = util.el('div', 'gtk-openings-cols', openings);
        util.el('span', '', cols, 'Title');
        util.el('span', '', cols, 'Location');
        const rows = util.el('div', 'gtk-opening-rows', openings);
        for (const [job, place] of [
          ['Database Administrator', 'Remote'],
          ['Systems Analyst', 'New York, NY'],
          ['Network Engineer', 'San Jose, CA'],
          ['Technical Writer', 'Boston, MA'],
          ['Product Manager', 'Seattle, WA'],
          ['QA Engineer', 'Austin, TX'],
          ['UX Designer', 'New York, NY'],
          ['DevOps Engineer', 'Remote'],
          ['Security Analyst', 'Chicago, IL'],
          ['Data Scientist', 'San Francisco, CA'],
        ]) {
          const row = util.el('div', 'gtk-opening-row', rows);
          util.el('span', '', row, '▤');
          util.el('span', '', row, job);
          util.el('span', '', row, place);
        }
        const summary = util.el('section', 'gtk-summary', body);
        util.el('div', 'gtk-pane-head', summary, 'Summary');
        for (const [a, b] of [
          ['Total Openings', '10'],
          ['Remote', '2'],
          ['On-site', '6'],
          ['Hybrid', '2'],
        ]) {
          const row = util.el('div', 'gtk-summary-row', summary);
          util.el('span', '', row, a);
          util.el('span', '', row, b);
        }
        S.frameSidebar(_c, openings);
        Object.assign(_c, { body, cols, oh, openings, rows, summary });
      },
    'frame.stage': (base, S) =>
      function (_c) {
        const { body, util } = _c;
        const dialog = util.el('section', 'gtk-dialog', body);
        util.el('div', 'gtk-dialog-title', dialog, 'Apply for Position');
        const stage = util.el('main', 'ref-stage', dialog);
        S.frameAlign(_c, stage);
        const inspector = util.el('aside', 'gtk-inspector', body);
        util.el('div', 'gtk-inspector-head', inspector, 'Position Details');
        const info = util.el('div', 'gtk-inspector-content', inspector);
        util.el('strong', '', info, 'Teaching Assistant');
        util.el('div', '', info, 'Riverside Primary School');
        util.el('div', '', info, 'Manchester, UK');
        util.el('div', '', info, 'Ref: TPS-2027-014');
        util.el('div', '', info, 'Posted: 12 Apr 2009');
        util.el('hr', '', info);
        util.el(
          'p',
          '',
          info,
          'We are seeking a dedicated Teaching Assistant to support our teaching staff and contribute to a positive learning environment for all pupils.',
        );
        util.el('hr', '', info);
        for (const [a, b] of [
          ['Employment type', 'Full-time'],
          ['Work arrangement', 'Remote (option available)'],
          ['Experience level', 'Mid-level'],
          ['Closing date', '30 Apr 2009'],
        ]) {
          util.el('b', '', info, a);
          util.el('div', '', info, b);
        }
        Object.assign(_c, { info, inspector, stage });
      },
  };

  env.site({
    name: 'design-complete-wizard-application-04',
    template: 'site/base',
    design: { parts },
  });
})();
