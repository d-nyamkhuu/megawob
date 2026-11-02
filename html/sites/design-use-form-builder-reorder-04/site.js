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
      const message = util.el('div', 'ref-ov-text', box, word ? word(rng.fork('lang').pick(K.overlay[kind] || K.overlay.toast)) : text);
      if (kind === 'promo') {
        const heading = util.el('div', 'ink-promo-head', box);
        box.insertBefore(heading, message);
        const envelope = util.svg('svg', {viewBox:'0 0 120 120', class:'ink-envelope', 'aria-hidden':'true'}, heading);
        util.svg('path', {d:'M14 42h92v64H14z M14 43l46 36 46-36 M60 8v15 M28 15l10 13 M92 15L82 28', fill:'none', stroke:'currentColor', 'stroke-width':3, 'stroke-linejoin':'round'}, envelope);
        const copy = util.el('div', '', heading);
        util.el('h2', '', copy, 'Stay in the loop');
        copy.append(message);
        const email = util.el('input', 'ink-overlay-input', box);
        email.type = 'text'; email.placeholder = 'Your email address';
        email.setAttribute('aria-label', 'Your email address');
        const close = util.el('button', 'ink-overlay-close', box, '×');
        close.type = 'button'; close.setAttribute('aria-label', word ? word('close') : 'Close');
        close.addEventListener('click', () => ctx.dismiss('close'));
      } else if (kind === 'chat') {
        const heading = util.el('h2', 'ink-chat-heading', box, 'How can we help?');
        const bubble = util.svg('svg', {viewBox:'0 0 24 24', class:'ink-chat-icon', 'aria-hidden':'true'}, heading);
        util.svg('path', {d:'M21 11c0 5-4 8-9 8-2 0-3-.2-4-1l-6 2 2-5c-1-1-1-2-1-4 0-5 4-8 9-8s9 3 9 8z', fill:'none', stroke:'currentColor', 'stroke-width':1.7}, bubble);
        heading.insertBefore(bubble, heading.firstChild);
        box.insertBefore(heading, message);
        const compose = util.el('div', 'ink-chat-compose', box);
        const input = util.el('input', 'ink-overlay-input', compose);
        input.type = 'text'; input.placeholder = 'Type a message…'; input.setAttribute('aria-label', 'Type a message');
        const send = util.el('button', 'ink-chat-send', compose, '→');
        send.type = 'button'; send.title = 'Send message';
        send.addEventListener('click', () => env.log('overlay-click', {label:'Send message'}));
      } else if (kind === 'cookie') {
        const icon = util.el('span', 'ink-cookie-icon', box, '◌');
        box.insertBefore(icon, message);
      }
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
      if (kind === 'banner') {
        document.querySelector('.ref-body')?.before(el);
        const titlebar = document.querySelector('.flash-titlebar');
        const taskbar = document.querySelector('.ref-task');
        el.style.top = `${Math.max(titlebar?.getBoundingClientRect().bottom || 0, taskbar?.getBoundingClientRect().bottom || 0)}px`;
      }
      if (kind === 'chat' || kind === 'cookie') {
        const end = document.querySelector('[data-role="submit"]');
        const bounds = end?.getBoundingClientRect();
        if (bounds && bounds.top > window.innerHeight * .65) {
          el.style.bottom = (window.innerHeight - bounds.top + 18) + 'px';
        }
      }
      return { el, dismiss, ttlSteps: kind === 'toast' ? rng.int(3, 5) : 0 };
    },
    'frame.header': (base, S) => function (_c) {
      const { display, util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      header.classList.toggle('ref-no-instruction', display !== 'header');
      const titlebar = util.el('div', 'flash-titlebar', document.body);
      const titleIcon = util.svg('svg', {viewBox:'0 0 24 24', class:'ink-title-icon', 'aria-hidden':'true'}, titlebar);
      util.svg('path', {d:'M2 3h20v18H2z M2 4l10 9L22 4', fill:'none', stroke:'currentColor', 'stroke-width':1.8}, titleIcon);
      util.el('span', 'ink-window-title', titlebar, 'Velvet Hammer Records · Participant intake');
      const win = util.el('div', 'flash-window-buttons', titlebar);
      for (const glyph of ['—', '□', '×']) util.el('span', '', win, glyph);
      document.body.insertBefore(titlebar, header);
      S.frameBrand(_c, header);
      Object.assign(_c, { header, titleIcon, titlebar, win });
    },
    'frame.panel': (base, S) => function (_c) {
      const { body, ctx, display, lr, rng, util, word } = _c;
      const { K } = S;
      const help = util.el('aside', 'forms-help', body);
      util.el('div', 'forms-help-title', help, 'Form builder help');
      const helpBlock = (title, text) => {
        const section = util.el('section', 'forms-help-block', help);
        util.el('h3', '', section, title);
        util.el('p', '', section, text);
      };
      helpBlock('Reorder sections and questions', 'Drag the handle (☰) to change the order of sections or questions. You can also select an item and use the arrow buttons.');
      helpBlock('Question types', 'Choose the type that best fits the information you want to collect, such as short answer, number, single choice or multiple choice.');
      helpBlock('Validation', 'Set rules to make sure responses are in the right format, like a valid email address or a number within a range.');
      helpBlock('Response policy', 'Control whether participants can answer more than once and set other response rules.');
      helpBlock('Routing', 'Show or hide questions based on previous answers using simple rules.');
      if (display === 'panel') {
        const panel = util.el('aside', 'ref-panel', help);
        help.insertBefore(panel, help.firstChild);
        const heading = rng.pick(['Your task', 'Instructions', 'To do', 'Goal']);
        util.el('div', 'ref-panel-title', panel, word ? word(lr.pick(K.panel)) : heading);
        util.el('div', 'ref-panel-text', panel, ctx.instruction);
        if (rng.bool(0.5)) body.classList.add('ref-panel-right');
      }
      Object.assign(_c, { help, helpBlock });
    },
  };

  env.site({
    name: 'design-use-form-builder-reorder-04',
    template: 'site/base',
    design: { parts },
  });
})();
