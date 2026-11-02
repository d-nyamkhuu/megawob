// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    overlay: (base, S) => function overlay(ctx) {
      const { K } = S;
      const { rng, util, kind } = ctx;
      const { text } = ctx.content.bannerText(rng, kind === 'banner' ? 'notice' : kind);
      const word = ctx.lang && ctx.lang !== 'en' && ctx.word ? ctx.word : null;
      const el = util.el('div', `ref-ov ref-ov-${kind}`, document.body);
      el.dataset.role = 'overlay';
      if (kind === 'banner') el.style.top = `${document.querySelector('.ref-task').getBoundingClientRect().bottom}px`;
      const box = kind === 'promo' ? util.el('div', 'ref-ov-box', el) : el;
      util.el('div', 'ref-ov-text', box, word ? word(rng.fork('lang').pick(K.overlay[kind] || K.overlay.toast)) : text);
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
    'frame.placement': (base, S) => function (_c) {
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

      // Single-purpose OS/2 calendar window.
      const winbar = util.el('div', 'cms-windowbar', document.body);
      util.el('span', 'cms-mark', winbar, 'IBM\nOS/2');
      util.el('span', 'cms-window-title', winbar, 'Social Publisher - Publishing Calendar');
      const wincontrols = util.el('div', 'cms-window-controls', winbar);
      for (const [cls, glyph] of [['min', '−'], ['max', '□'], ['close', '×']]) util.el('span', `cms-win-${cls}`, wincontrols, glyph);
      Object.assign(_c, { collide, cr, decoys, label, nav, placement, sidebar, wantFooter, winbar, wincontrols });
    },
    'frame.header': (base, S) => function (_c) {
      const { display, util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      document.body.classList.toggle('cms-header-mode', display === 'header');
      S.frameBrand(_c, header);
      Object.assign(_c, { header });
    },
    'frame.panel': (base, S) => function (_c) {
      const { body, ctx, display, lr, rng, util, word } = _c;
      const { K } = S;
      const helpPanel = () => {
        const panel = util.el('aside', 'ref-panel', body);
        const tabs = util.el('div', 'ref-help-tabs', panel);
        util.el('div', 'ref-help-tab selected', tabs, 'Help');
        util.el('div', 'ref-help-tab', tabs, 'Legend');
        util.el('div', 'ref-panel-title', panel, 'Using the publishing calendar');
        const help = util.el('ol', 'ref-help-steps', panel);
        for (const line of ['Select a post from the draft list on the left.',
          'Drag it to a date and time slot in the calendar.', 'Repeat for each post.',
          'When you are ready, click Activate schedule to publish automatically at the scheduled times.']) {
          util.el('li', '', help, line);
        }
        util.el('div', 'ref-help-subhead', panel, 'Tips');
        const tips = util.el('ul', 'ref-help-tips', panel);
        for (const line of ['Each cell represents one hour.',
          'You can move a scheduled post to a different time by dragging it to a new slot.',
          'Use the post details below to edit content, metadata or channels before scheduling.']) {
          util.el('li', '', tips, line);
        }
        return panel;
      };
      if (display === 'panel') {
        const heading = rng.pick(['Your task', 'Instructions', 'To do', 'Goal']);
        const panel = helpPanel();
        const task = util.el('section', 'ref-panel-task', panel);
        util.el('div', 'ref-panel-task-title', task, word ? word(lr.pick(K.panel)) : heading);
        util.el('div', 'ref-panel-text', task, ctx.instruction);
        if (rng.bool(0.5)) body.classList.add('ref-panel-right');
      }
      else helpPanel();
      Object.assign(_c, { helpPanel });
    },
  };

  env.site({
    name: 'design-use-site-builder-social-03',
    template: 'site/base',
    design: { parts },
  });
})();
