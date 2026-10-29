(function () {
  'use strict';
  const C = {
    'site': 'design-type-text-password-10',
    'brand': 'Riverton University',
    'title': 'Set Your Password',
    'instruction': 'top',
    'briefTitle': 'Instructions',
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util;
      const left = u.el('div', 'ds-left', document.body);
      const head = u.el('header', 'ds-head', left);
      u.el('a', 'ds-brand', head, C.brand);
      const nav = u.el('nav', 'ds-nav', head);
      ['Home', 'Help', 'Contact'].forEach((t, i) => {
        if (i) u.el('span', 'sep', nav, '|');
        u.el('a', '', nav, t);
      });
      u.el('hr', 'ds-rule', left);
      const content = u.el('div', 'ds-content', left);
      u.el('h1', 'ds-h1', content, C.title);
      const natural = C.instruction;
      const mode =
        ctx.display === 'hidden'
          ? 'hidden'
          : ctx.display === 'toast'
            ? 'toast'
            : ctx.display === 'panel'
              ? 'left'
              : natural;
      function briefing(parent, cls) {
        const b = u.el('aside', cls, parent);
        if (cls === 'ds-brief') u.el('h2', '', b, C.briefTitle || 'Task');
        const text = u.el('div', 'ds-instruction', b, ctx.instruction);
        if (cls !== 'ds-brief') {
          text.style.width = '100%';
          text.style.whiteSpace = 'nowrap';
          const size = parseFloat(getComputedStyle(text).fontSize);
          const fit = (size * text.clientWidth) / Math.max(text.scrollWidth, 1);
          text.style.whiteSpace = 'normal';
          if (fit >= (size * 36) / 46) {
            text.style.fontSize = 'calc(' + Math.min(46, ((46 * fit) / size) * 0.997) + ' * var(--u))';
          } else {
            b.classList.add('ds-multiline');
          }
        }
        return b;
      }
      if (mode === 'top') briefing(content, 'ds-header-note');
      if (mode === 'toast') {
        briefing(content, 'ds-toast');
      }
      u.el('p', 'ds-intro', content, 'Choose a strong password for your account. Enter it in both fields below.');
      const main = u.el('div', 'ds-main', content);
      if (mode === 'left' || mode === 'right') {
        const b = briefing(main, 'ds-brief');
        if (mode === 'right') b.style.order = '2';
      }
      const stage = u.el('main', 'ds-stage', main);
      const foot = u.el('footer', 'ds-footer', content);
      const endR = ctx.rng.fork('chrome/end');
      const bank =
        ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
          ? ctx.content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const legacy = !ctx.finish && endR.bool(0.5);
      const placement = ctx.finish ? null : legacy ? 'footer' : endR.pick(['footer', 'header', 'link']);
      const label = legacy ? 'Submit' : labelOf(endR.pick(bank));
      const collideR = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (!ctx.finish && collideR.bool(0.3)) {
        const options = [...new Set(bank.map(labelOf))].filter(
          (x) => x.trim().toLowerCase() !== label.trim().toLowerCase(),
        );
        if (options.length) collide = labelOf(collideR.pick(options));
      }
      const decoyBtn = (parent, text, isCollide) => {
        const b = u.el('button', 'ds-xtra', parent, text);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () =>
          env.log('decoy', isCollide ? { label: text, collide: true } : { label: text }),
        );
        return b;
      };
      const endBtn = (parent, cls, text) => {
        const b = u.el(cls === 'ds-endlink' ? 'a' : 'button', cls, parent, text);
        if (b.tagName === 'BUTTON') b.type = 'button';
        else b.href = '#';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      };
      let submit = null;
      if (!ctx.finish) {
        if (placement === 'footer') submit = endBtn(foot, 'ds-submit', label);
        if (placement === 'link') submit = endBtn(foot, 'ds-endlink', label);
        if (placement === 'header') {
          const tools = u.el('div', 'ds-head-tools', content);
          if (collide) decoyBtn(tools, collide, true);
          submit = endBtn(tools, 'ds-head-submit', label);
        }
        if (collide && placement !== 'header') decoyBtn(foot, collide, true);
      }
      const clear = u.el('button', 'ds-clear', foot, 'Clear');
      clear.type = 'button';
      clear.addEventListener('click', () => {
        for (const input of stage.querySelectorAll('input:not(:disabled),textarea:not(:disabled)')) {
          input.value = '';
          input.dispatchEvent(new Event('input', { bubbles: true }));
        }
      });
      u.el('hr', 'ds-rule ds-rule2', left);
      const bot = u.el('div', 'ds-bottom', left);
      u.el('a', '', bot, 'Privacy Policy');
      u.el('span', '', bot, '© 1995 Riverton University');
      const side = u.el('aside', 'ds-side', document.body);
      u.el('h2', 'ds-side-title', side, 'Account Setup');
      u.el('hr', '', side);
      u.el('h3', '', side, 'Steps');
      const ol = u.el('ol', 'ds-steps', side);
      ['Set your password', 'Confirm your details', 'Finish'].forEach((t, i) => {
        const li = u.el('li', i === 0 ? 'cur' : '', ol);
        u.el('span', 'n', li, i + 1 + '.');
        u.el('span', '', li, t);
      });
      u.el('hr', '', side);
      u.el('h3', '', side, 'Password Tips');
      const ul = u.el('ul', 'ds-tips', side);
      ['Use a mix of letters, numbers and symbols.', 'At least 8 characters.', 'Do not use a common word.'].forEach(
        (t) => u.el('li', '', ul, t),
      );
      u.el('hr', '', side);
      u.el('h3', '', side, 'Need Help?');
      u.el('a', 'ds-guide', side, 'View our password guide');
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      const el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = {
        cookie: 'We use cookies to remember your preferences.',
        toast: 'Changes synced.',
        chat: 'Hello. How can we help?',
        promo: 'Try our new workspace.',
        banner: 'Scheduled maintenance tonight.',
      };
      u.el('div', '', el, texts[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  });
})();
