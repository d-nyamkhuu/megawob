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
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const menu = util.el('nav', 'ns-menu', document.body);
      util.el('span', 'ns-apple', menu, '');
      for (const item of ['File', 'Edit', 'View', 'Insert', 'Format', 'Survey', 'Window', 'Help']) util.el('span', '', menu, item);
      const brand = util.el('div', 'ref-h-brand', header);
      util.el('i', 'ref-h-logo', brand);
      util.el('span', '', brand, 'Glasswing Optics');
      util.el('span', 'ref-h-sep', header);
      util.el('span', 'ref-h-sub', header, 'Form builder');
      const icons = util.el('div', 'ref-h-icons', header);
      util.el('span', '', icons, '?');
      const user=util.svg('svg',{viewBox:'0 0 24 24',width:25,height:25,'aria-hidden':'true'},icons);
      util.svg('path',{d:'M8 7a4 4 0 1 0 8 0 4 4 0 0 0-8 0M4 22v-3c0-7 16-7 16 0v3',fill:'none',stroke:'currentColor','stroke-width':1.8},user);
      // Static help column, as in the reference: tips on the right of the sub-window.
      const help = util.el('aside', 'ref-help', document.body);
      util.el('div', 'ref-help-title', help, 'Help & tips');
      for (const [title, text] of [
        ['Build your form', 'Add and edit questions, organize them into sections, and control how they behave.'],
        ['Question types', 'Use multiple choice, text, number, date and more.'],
        ['Routing', 'Send respondents to different sections based on their answers.'],
        ['Validation', 'Set rules to require an answer or limit the format.'],
        ['Display logic', 'Show or hide questions based on previous answers.'],
      ]) {
        const item = util.el('div', 'ref-help-item', help);
        util.el('div', 'ref-help-head', item, title);
        util.el('div', 'ref-help-text', item, text);
      }
      // Dimmed main view around the sub-window (static, non-interactive) and the frame's title.
      const bg = util.el('div', 'ref-bg', document.body);
      const side = util.el('div', 'ref-bg-side', bg);
      util.el('div', 'ref-bg-head', side, 'Survey outline');
      for (const item of ['1. Your team', '2. Your experience', '3. Follow-up']) util.el('div', 'ref-bg-item', side, item);
      util.el('div','ref-bg-add',side,'＋ Add section');
      util.el('div', 'ref-bg-title', bg, 'Visit preferences');
      util.el('div', 'ref-bg-tools', bg, '◉  Preview    │    ⚙  Settings');
      const cards=util.el('div','ref-bg-cards',bg);
      for(let i=0;i<4;i++)util.el('div','ref-bg-card',cards,i?'•••':'');
      util.el('div', 'ref-frame-title', document.body, 'Glasswing Optics · Visit preferences');
      util.el('span', 'ns-window-icon', header, '▣');
      util.el('div', 'ns-window-title', header, 'Survey');
      const windowTools = util.el('div', 'ns-window-tools', header);
      for (const symbol of ['−', '□', '×']) util.el('span', '', windowTools, symbol);
      S.frameBrand(_c, header);
      Object.assign(_c, { header, menu, windowTools });
    },
    'frame.body': (base, S) => function (_c) {
      base(_c);
      const rail=_c.util.el('aside','ref-side-stack',_c.body);
      rail.append(document.querySelector('.ref-help'));
      _c.helpRail=rail;
    },
    'frame.panel': (base, S) => function (_c) {
      base(_c);
      const panel=_c.body.querySelector('.ref-panel');
      if(panel){_c.helpRail.prepend(panel);_c.helpRail.classList.add('has-task');}
    },
    'frame.floating': (base, S) => function (_c) {
      const { endBtn, header, label, placement, root, util } = _c;
      let { submit } = _c;
      if (placement === 'floating') {
        // Reserve the control's space so it cannot intercept task clicks or drags.
        // On scrollable pages the dock follows the content, just like a form footer.
        const dock = util.el('div', 'ref-float-dock', document.body);
        submit = endBtn(dock, 'ref-submit ref-float', label);
      }
      root.style.setProperty('--ns-header-bottom', `${header.getBoundingClientRect().bottom}px`);
      Object.assign(_c, { submit });
    },
  };

  env.site({
    name: 'design-use-form-builder-branching-05',
    template: 'site/base',
    design: { parts },
  });
})();
