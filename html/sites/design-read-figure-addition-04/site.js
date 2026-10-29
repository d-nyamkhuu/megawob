(function () {
  'use strict';
  const C = { site: 'design-read-figure-addition-04', task: 'read-figure', scenario: 'addition' };
  env.site({
    name: C.site,
    styles: ['site.css'],
    frame(ctx) {
      document.body.className = 'cdrom instruction-' + ctx.display;
      const u = ctx.util,
        app = u.el('main', 'app', document.body),
        top = u.el('header', 'top', app),
        mark = u.el('div', 'mark', top);
      u.el('i', '', mark);
      u.el('i', '', mark);
      u.el('i', '', mark);
      u.el('h1', '', top, 'Math Practice Workshop');
      u.el('div', 'tagline', top, 'Build Skills for a Brighter Tomorrow');
      const center = u.el('main', 'center', app),
        left = u.el('section', 'left-pane', center),
        tabs = u.el('nav', 'tabs', left);
      ['Add', 'Subtract', 'Multiply', 'Divide'].forEach((x, i) => u.el('div', 'tab' + (!i ? ' active' : ''), tabs, x));
      const brief = u.el('div', 'brief', left, ctx.display === 'header' ? ctx.instruction : ''),
        stage = u.el('section', 'stage', left);
      const aside = u.el('aside', 'aside', center),
        rtabs = u.el('nav', 'tabs', aside);
      ['Instructions', 'Examples', 'Help'].forEach((x, i) => u.el('div', 'tab' + (!i ? ' active' : ''), rtabs, x));
      if (ctx.display === 'panel') u.el('div', 'episode-note', aside, ctx.instruction);
      u.el('h2', 'aside-title', aside, 'Building Blocks');
      u.el('div', 'rule', aside);
      const list = u.el('ol', 'steps', aside);
      ['Count the blocks in each group.', 'Type the total number of blocks into the textbox.'].forEach(
        (x) => u.el('li', '', list, x),
      );
      const footer = u.el('footer', 'bottom', app),
        disc = u.el('div', 'disc', footer);
      u.el('span', 'motto', footer, 'Learning Today  A Brighter Tomorrow');
      u.el('span', 'companion', footer, 'CD-ROM Companion');

      const er = ctx.rng.fork('chrome/end');
      const base = er.bool(0.5),
        placement = base ? 'scene' : er.pick(['header', 'link']);
      const endLabels = ctx.content && ctx.content.END_LABELS;
      const labels =
        Array.isArray(endLabels) && endLabels.length
          ? endLabels
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
      const pickLabel = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const label = base ? 'Submit' : pickLabel(er.pick(labels));
      let submit = null;
      if (!ctx.finish) {
        submit = u.el('button', 'submit end-' + placement, footer, label);
        submit.type = 'button';
        submit.setAttribute('aria-label', label);
        submit.title = label;
        submit.addEventListener('click', ctx.submit);
      }
      const cr = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (!ctx.finish && cr.bool(0.3)) {
        const pool = labels.map(pickLabel).filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
        if (pool.length) collide = cr.pick(pool);
      }
      const decoy = (parent, text, isEnd) => {
        const b = u.el('button', 'chrome-xtra' + (isEnd ? ' collide' : ''), parent, text);
        b.type = 'button';
        b.addEventListener('click', () => env.log('decoy', isEnd ? { label: text, collide: true } : { label: text }));
        return b;
      };
      if (collide) decoy(tabs, collide, true);
      if (ctx.display === 'toast') {
        const note = u.el('div', 'episode-toast', app, ctx.instruction);
        note.setAttribute('role', 'note');
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        el = u.el('div', 'overlay ' + ctx.kind, document.body),
        messages = {
          cookie: 'This application stores preferences on your device.',
          toast: 'Your workspace has been synced.',
          chat: 'Need help with this exercise?',
          promo: 'Try the new practice collection.',
          banner: 'An updated practice collection is available.',
        };
      u.el('span', '', el, messages[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept' : 'Dismiss');
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  });
})();
