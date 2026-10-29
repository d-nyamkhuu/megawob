(function () {
  'use strict';
  const C = {
    'site': 'design-type-text-single-07',
    'brand': 'NorthBridge Supply',
    'instruction': 'left',
    'menu': 'Home|Orders|Inventory|Reports|Account|Support',
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
      const top = u.el('header', 'ds-top', document.body);
      const logo = u.el('span', 'ds-logo', top);
      logo.innerHTML =
        '<svg width="62" height="62" viewBox="0 0 62 62" fill="none" stroke="#5088c1" stroke-width="1.8"><circle cx="31" cy="31" r="29"/><ellipse cx="31" cy="31" rx="20" ry="29"/><ellipse cx="31" cy="31" rx="10" ry="29"/><ellipse cx="31" cy="31" rx="29" ry="10"/><path d="M6 16Q31 26 56 16M6 46Q31 36 56 46M2 31h58M31 2v58"/></svg>';
      const bt = u.el('span', 'ds-brandbox', top);
      u.el('span', 'ds-brand', bt, C.brand);
      u.el('span', 'ds-sub', bt, 'EXTRANET');
      const wel = u.el('span', 'ds-welcome', top);
      wel.innerHTML = 'Welcome, Jamie Carter <i>|</i> March 12, 1999 <i>|</i> <u>Help</u> <i>|</i> <u>Log Out</u>';
      const nav = u.el('nav', 'ds-menu', document.body);
      C.menu.split('|').forEach((t) => u.el('span', '', nav, t));
      const body = u.el('div', 'ds-body', document.body);
      const content = u.el('div', 'ds-content', body);
      const mode = ctx.display || 'header';
      document.body.dataset.display = mode;
      const er = ctx.rng.fork('chrome/end');
      const oldChoice = er.bool(0.5);
      const placement = oldChoice ? 'footer' : er.pick(['nav', 'link']);
      const labels = ctx.content && ctx.content.END_LABELS;
      const labelPool =
        Array.isArray(labels) && labels.length
          ? labels
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
      const labelText = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const endLabel = oldChoice ? 'Submit' : labelText(er.pick(labelPool));
      document.body.dataset.endplacement = placement;
      const cr = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (cr.bool(0.3)) {
        const options = [
          ...new Set(labelPool.map(labelText).filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase())),
        ];
        if (options.length) collide = labelText(cr.pick(options));
      }
      const decoy = (parent, text, isEnd) => {
        const b = u.el('button', 'ds-xtra', parent, text);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', isEnd ? { label: text, collide: true } : { label: text }));
        return b;
      };
      const submitControl = (parent, asLink) => {
        const b = u.el(asLink ? 'a' : 'button', asLink ? 'ds-endlink' : 'ds-submit', parent, endLabel);
        if (asLink) b.href = '#';
        else b.type = 'button';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', endLabel);
        b.title = endLabel;
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      };
      const navTools = u.el('div', 'ds-nav-tools', nav);
      if (collide && placement === 'nav' && !ctx.finish) decoy(navTools, collide, true);
      function briefing(parent, cls) {
        const b = u.el('aside', cls === 'ds-toast' ? 'ds-toast ds-brief' : cls, parent);
        if (cls === 'ds-brief' || cls === 'ds-toast') {
          u.el('h2', '', b, 'Task');
          u.el('div', 'ds-instruction', b, ctx.instruction);
          if (cls === 'ds-toast') return b;
          u.el('h2', 'ds-h2b', b, 'Actions');
          const ol = u.el('ol', 'ds-steps', b);
          ol.insertAdjacentHTML(
            'beforeend',
            '<li>Click in the text box.</li><li>Type the code exactly as shown.</li>' +
              (ctx.finish ? '' : '<li>Click <b>Submit</b>.</li>'),
          );
          u.el('h2', 'ds-h2c', b, 'Notes');
          const ul = u.el('ul', 'ds-note-list', b);
          ul.insertAdjacentHTML(
            'beforeend',
            '<li>The code is case sensitive.</li><li>Enter only the characters shown.</li><li>Use the <b>Clear</b> button to remove your entry if needed.</li>',
          );
        } else {
          u.el('div', 'ds-instruction', b, ctx.instruction);
        }
        return b;
      }
      if (mode === 'header') briefing(content, 'ds-header-note');
      const main = u.el('div', 'ds-main', content);
      if (mode === 'panel') briefing(main, 'ds-brief');
      const stage = u.el('main', 'ds-stage', main);
      if (mode === 'toast') {
        const note = briefing(content, 'ds-toast');
        content.insertBefore(note, main);
      }
      const foot = u.el('footer', 'ds-footer', content);
      let submit = null;
      if (!ctx.finish) {
        if (placement === 'nav') submit = submitControl(navTools, false);
        else if (placement === 'link') submit = submitControl(foot, true);
        else submit = submitControl(foot, false);
        if (collide && placement !== 'nav') decoy(foot, collide, true);
      }
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
