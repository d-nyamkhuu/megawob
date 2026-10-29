// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.layout': (base, S) => function (_c) {
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
      const titlebar = util.el('div', 'gtk-titlebar', document.body);
      util.el('span', 'gtk-appicon', titlebar, '∿');
      util.el('strong', '', titlebar, 'Riverside Careers');
      const win = util.el('div', 'gtk-window-controls', titlebar);
      for (const [c, t] of [['min','−'], ['max','□'], ['close','×']]) util.el('span', `gtk-win-${c}`, win, t);
      const menubar = util.el('nav', 'gtk-menubar', document.body);
      for (const [icon, t, active] of [['▱','Jobs',false], ['▤','My applications',true], ['♧','Saved jobs',false], ['♙','Profile',false]]) {
        const tab = util.el('div', `gtk-tab${active ? ' active' : ''}`, menubar);
        util.el('span', 'gtk-tab-icon', tab, icon);
        util.el('span', '', tab, t);
      }
      Object.assign(_c, { collide, cr, decoys, label, menubar, nav, placement, sidebar, titlebar, wantFooter, win });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      const guidance = util.el('aside', 'app-guidance', body);
      util.el('div', 'guidance-title', guidance, '♧  Guidance');
      util.el('p', 'guidance-intro', guidance, 'Complete all sections to submit your application. Your progress is saved as you go.');
      const sections = [
        ['♟','Personal details','Tell us who you are and how to contact you.'],
        ['▦','Experience','Share your current role, job title and years of experience.'],
        ['▦','Availability','Let us know when you could start and your preferred work arrangement.'],
        ['⬡','Consent','Confirm your information and communication preferences.'],
        ['▤','Review','Check your details before submitting your application.'],
      ];
      const sectionList = util.el('div', 'guidance-list', guidance);
      for (const [icon, title, copy] of sections) {
        const item = util.el('div', 'guidance-item', sectionList);
        util.el('span', 'guidance-icon', item, icon);
        const text = util.el('div', 'guidance-copy', item);
        util.el('strong', '', text, title);
        util.el('span', '', text, copy);
      }
      // The instruction card shares the guidance rail, outside the task stage.
      const panel = body.querySelector('.ref-panel');
      if (panel) guidance.insertBefore(panel, sectionList);
      Object.assign(_c, { guidance, sectionList, sections, stage });
    },
  };

  env.site({
    name: 'design-complete-wizard-application-03',
    template: 'site/base',
    design: { parts },
  });
})();
