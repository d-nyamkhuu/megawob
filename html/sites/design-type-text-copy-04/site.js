(function () {
  'use strict';
  const site = 'design-type-text-copy-04';
  env.site({
    name: site, styles: ['site.css'], scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util;
      const top = u.el('header', 'ds-top', document.body);
      u.el('span', 'ds-brand', top, 'Delivery Information');
      const content = u.el('div', 'ds-content', document.body);
      const mode = ctx.display === 'hidden' ? 'hidden' : ctx.display === 'toast' ? 'toast' : ctx.display === 'panel' ? 'panel' : 'header';
      function briefing(parent, cls) {
        const b = u.el('aside', cls, parent);
        u.el('div', 'ds-instruction', b, ctx.instruction);
        return b;
      }
      if (mode === 'header') briefing(top, 'ds-header-note');
      if (mode === 'toast') briefing(content, 'ds-toast');
      const main = u.el('div', 'ds-main', content);
      const stage = u.el('main', 'ds-stage', main);
      const help = u.el('aside', 'ds-help', main);
      u.el('h2', 'ds-help-title', help, 'Helpful Information');
      const helpBody = u.el('div', 'ds-help-body', help);
      const entries = [
        ['Phone for delivery updates', 'Enter the best phone number for delivery updates, such as a home, work or mobile number.'],
        ['Mobile number (optional)', 'You can provide a mobile number if you prefer to receive text messages about your delivery.'],
        ['Email address (optional)', 'We may send delivery notifications to this email address.']
      ];
      entries.forEach(([heading, text]) => {
        const item = u.el('section', 'ds-help-item', helpBody);
        u.el('h3', '', item, heading);
        u.el('p', '', item, text);
      });
      const tips = u.el('section', 'ds-tips', helpBody);
      u.el('h3', '', tips, 'Format tips');
      const list = u.el('ul', '', tips);
      ['Phone numbers can include digits, spaces, dashes or parentheses.', 'Example: (555) 123-4567', 'International numbers are allowed.']
        .forEach((text) => u.el('li', '', list, text));
      if (mode === 'panel') {
        const note = briefing(help, 'ds-panel-note');
        help.insertBefore(note, helpBody);
      }
      const foot = u.el('footer', 'ds-footer', content);
      u.el('span', '', foot, 'Ready');
      let submit = null;
      let placement = null;
      let label = 'Confirm';
      let collide = null;
      if (!ctx.finish) {
        const er = ctx.rng.fork('chrome/end');
        const canonical = er.bool(0.5);
        if (!canonical) {
          placement = er.pick(['header', 'link']);
          const labels = ctx.content && ctx.content.END_LABELS;
          const pool = Array.isArray(labels) && labels.length ? labels : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
          label = String(er.pick(pool));
        }
        const cr = ctx.rng.fork('chrome/collide');
        if (cr.bool(0.3)) {
          const labels = ctx.content && ctx.content.END_LABELS;
          const pool = (Array.isArray(labels) && labels.length ? labels : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'])
            .map((x) => typeof x === 'string' ? x : (x.label || x.text || x.name || String(x)));
          const options = [...new Set(pool)].filter((x) => String(x).trim().toLowerCase() !== label.trim().toLowerCase());
          if (options.length) collide = cr.pick(options);
        }
        const addDecoy = (parent, text, cls) => {
          const b = u.el('button', `ds-xtra ${cls}`, parent, text);
          b.type = 'button'; b.dataset.role = 'xtra';
          b.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
          return b;
        };
        const endButton = (parent, cls) => {
          const b = u.el('button', cls, parent, label);
          b.type = 'button'; b.dataset.role = 'submit'; b.setAttribute('aria-label', label); b.title = label;
          b.addEventListener('click', () => ctx.submit());
          return b;
        };
        if (canonical) submit = endButton(foot, 'ds-submit');
        else if (placement === 'header') {
          if (collide) addDecoy(top, collide, 'ds-pq-header');
          submit = endButton(top, 'ds-submit ds-submit-header');
        } else {
          if (collide) addDecoy(foot, collide, 'ds-pq-link');
          submit = endButton(foot, 'ds-submit ds-submit-link');
        }
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      const el = u.el('section', `ds-overlay ds-overlay-${ctx.kind}`, document.body);
      el.dataset.role = 'overlay';
      const texts = { cookie: 'We use cookies to remember your preferences.', toast: 'Changes synced.', chat: 'Hello. How can we help?', promo: 'Try our new workspace.', banner: 'Scheduled maintenance tonight.' };
      u.el('div', '', el, texts[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    }
  });
})();
