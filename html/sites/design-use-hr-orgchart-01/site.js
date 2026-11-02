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
      const frame = kind === 'promo' ? util.el('div', 'ref-ov-box', el) : el;
      if (kind === 'promo') util.el('div', 'cad-promoimage', frame);
      const box = kind === 'promo' ? util.el('div', 'cad-promobody', frame) : frame;
      if (kind === 'promo') util.el('h2', 'cad-promotitle', box, 'Get the latest HR insights');
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
      if (kind === 'promo') {
        const input = util.el('input', 'cad-promoemail', box);
        input.type = 'text'; input.placeholder = 'Enter your email address'; input.setAttribute('aria-label', 'Email address');
        box.insertBefore(input, row);
        const x = util.el('button', 'cad-promo-x', frame, '×');
        x.type = 'button'; x.setAttribute('aria-label', 'Close'); x.addEventListener('click', () => ctx.dismiss('close'));
      }
      if (kind === 'chat') {
        const heading = util.el('div', 'cad-chatheading', el, '◉  NexaHR Support');
        el.prepend(heading); heading.append(dismiss);
        row.remove();
        const message = el.querySelector('.ref-ov-text');
        const avatar = util.el('span', 'cad-chatportrait', message); message.prepend(avatar);
        const inputrow = util.el('div', 'cad-chatinputrow', el);
        const input = util.el('input', '', inputrow); input.type = 'text'; input.placeholder = 'Type a message...';
        input.setAttribute('aria-label', 'Message NexaHR Support');
        const send = util.el('button', '', inputrow, '➤'); send.type = 'button'; send.setAttribute('aria-label', 'Send support message');
        send.addEventListener('click', () => env.log('decoy', { label: 'Send support message' }));
      }
      if (kind === 'banner') document.body.insertBefore(el, document.querySelector('.ref-body'));
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
      const windowbar = util.el('div', 'cad-windowbar', document.body);
      const appIcon = util.svg('svg', { viewBox: '0 0 24 24', class: 'cad-appicon', 'aria-hidden': 'true' }, windowbar);
      appIcon.innerHTML = '<circle cx="9" cy="7" r="3"/><circle cx="17" cy="8" r="2.5"/><path d="M2 21v-4a7 7 0 0 1 14 0v4ZM17 13a6 6 0 0 1 6 6v2h-5v-4a9 9 0 0 0-1-4Z"/>';
      util.el('span', 'cad-windowcontrols', windowbar, '—     □     ×');
      const menu = util.el('div', 'cad-menubar', document.body);
      menu.append(appIcon.cloneNode(true));
      util.el('strong', 'cad-wordmark', menu, 'NexaHR');
      for (const text of ['People', 'Organization', 'Recruiting', 'Onboarding', 'Time Off', 'Reports']) {
        const item = util.el('button', 'cad-menuitem', menu, text);
        item.type = 'button';
        item.addEventListener('click', () => env.log('decoy', { what: 'menu', label: text }));
      }
      const globalSearch = util.el('div', 'cad-globalsearch', menu, '⌕   Search people, jobs, or reports...');
      globalSearch.setAttribute('aria-hidden', 'true');
      const utilities = util.el('span', 'cad-menuutilities', menu);
      for (const [label, paths] of [
        ['Notifications', '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M9 20a3 3 0 0 0 6 0Z"/>'],
        ['Settings', '<path d="m9 2-.5 3-2 1L4 5 2 9l2 2v2l-2 2 2 4 2.5-1 2 1L9 22h6l.5-3 2-1 2.5 1 2-4-2-2v-2l2-2-2-4-2.5 1-2-1L15 2Z"/><circle cx="12" cy="12" r="3" fill="#0a2639"/>']]) {
        const svg = util.svg('svg', { viewBox: '0 0 24 24', class: 'cad-appicon', 'aria-label': label }, utilities);
        svg.innerHTML = paths;
      }
      util.el('span', '', utilities, '?');
      Object.assign(_c, { appIcon, collide, cr, decoys, globalSearch, label, menu, nav, placement, sidebar, utilities, wantFooter, windowbar });
    },
    'frame.tools': (base, S) => function (_c) {
      const { collide, decoyBtn, decoys, display, endBtn, header, label, placement, util, wantFooter, windowbar } = _c;
      let submit = null;
      const headerTools = util.el('div', 'ref-tools', header);
      for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
      if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
      if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
      if (placement === 'icon') {
        submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
      }
      if (display !== 'header') windowbar.insertBefore(headerTools, windowbar.lastChild);
      Object.assign(_c, { headerTools, submit });
    },
  };

  env.site({
    name: 'design-use-hr-orgchart-01',
    template: 'site/base',
    design: { parts },
  });
})();
