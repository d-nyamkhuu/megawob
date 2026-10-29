(function () {
  'use strict';
  const C = { site: 'design-solve-puzzle-arithmetic-10' };
  env.site({
    name: C.site,
    styles: ['site.css'],
    frame(ctx) {
      document.body.className = 'riscos workstation instruction-' + ctx.display;
      const u = ctx.util,
        app = u.el('main', 'app', document.body),
        top = u.el('header', 'osbar', app);
      u.el('span', 'acorn', top, '');
      u.el('strong', 'osname', top, 'RISC OS');
      const menu = u.el('nav', 'osmenu', top);
      ['File', 'Edit', 'Options', 'Help'].forEach((x) => u.el('span', '', menu, x));
      u.el('span', 'clock', top, 'Mon 16 Oct 1989　10:24');
      u.el('button', 'close-gadget', top, '×');
      const overview = u.el('section', 'overview', app),
        overviewTitle = u.el('header', 'pane-title', overview);
      u.el('strong', '', overviewTitle, 'Number Practice');
      const overviewBody = u.el('div', 'overview-body', overview);
      u.el('div', 'document-icon', overviewBody, '');
      u.el(
        'p',
        'overview-copy',
        overviewBody,
        'Simple arithmetic practice.\nWork through the question below\nand enter your answer.',
      );
      const status = u.el('div', 'session-box', overviewBody);
      u.el('strong', 'session-title', status, 'Practice Session');
      u.el('div', 'session-copy', status, 'Questions:　1 of 10\nCorrect:　　0\nIncorrect:　0');
      const question = u.el('section', 'question-pane', app),
        questionTitle = u.el('header', 'pane-title', question);
      u.el('strong', '', questionTitle, 'Question');
      const brief = u.el('div', 'brief', question, ctx.display === 'hidden' ? '' : ctx.instruction);
      const stage = u.el('div', 'stage', question);
      const footer = u.el('footer', 'iconbar', app);
      [
        ['Apps', 'folder'],
        ['Docs', 'document'],
        ['Discs', 'discs'],
        ['Paint', 'paint'],
        ['Calc', 'calc'],
        ['Edit', 'edit'],
      ].forEach(([label, kind]) => {
        const item = u.el('div', 'icon-item ' + kind, footer);
        u.el('i', 'desktop-icon', item, '');
        u.el('span', '', item, label);
      });
      const endRng = ctx.rng.fork('chrome/end'),
        labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name),
        endLabels = ctx.content.END_LABELS.map(labelOf),
        original = endRng.bool(0.5),
        placement = original ? 'form' : endRng.pick(['toolbar', 'iconbar']),
        endLabel = original ? 'Submit' : endRng.pick(endLabels);
      let submit = null;
      if (!ctx.finish) {
        const parent = placement === 'toolbar' ? questionTitle : placement === 'iconbar' ? footer : question;
        submit = u.el('button', 'submit end-' + placement, parent, endLabel);
        submit.type = 'button';
        submit.dataset.placement = placement;
        submit.title = endLabel;
        submit.setAttribute('aria-label', endLabel);
        submit.addEventListener('click', () => ctx.submit());
      }
      const collideRng = ctx.rng.fork('chrome/collide');
      if (collideRng.bool(0.3)) {
        const options = endLabels.filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
        if (options.length) {
          const label = collideRng.pick(options),
            decoy = u.el('button', 'chrome-xtra', overviewTitle, label);
          decoy.type = 'button';
          decoy.addEventListener('click', () => env.log('decoy', { label, collide: true }));
        }
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        el = u.el('div', 'overlay ' + ctx.kind, document.body);
      const messages = {
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
