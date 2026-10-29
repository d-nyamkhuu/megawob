(function () {
  'use strict';
  const SITE = 'design-choose-option-toggles-02';
  const labelOf = (x) => (typeof x === 'string' ? x : x && (x.label || x.text || x.name)) || String(x);
  env.site({
    name: SITE,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util,
        rng = ctx.rng,
        content = ctx.content || {};
      const win = u.el('div', 'ns-window', document.body);
      const title = u.el('header', 'ns-titlebar', win);
      const left = u.el('div', 'ns-title-icons', title);
      u.el('span', 'ns-icon ns-icon-grid', left, '▦');
      u.el('span', 'ns-icon', left, '≡');
      u.el('strong', '', title, 'System Preferences');
      const info = u.el('button', 'ns-info', title, 'H');
      info.type = 'button';
      const region = u.el('div', 'ns-region', win);
      let mode = ctx.display || 'header';
      if (mode === 'panel' && window.innerWidth < 1150) mode = 'header';
      if (mode === 'toast' && window.innerHeight < 680) mode = 'header';
      const head = u.el('div', 'ns-main-head', region);
      u.el('h1', '', head, 'Privacy & Data');
      if (mode === 'header') u.el('div', 'ns-task-note', head, ctx.instruction);
      const columns = u.el('div', 'ns-columns', region);
      const stage = u.el('main', 'ds-stage', columns);
      const inspector = u.el('aside', 'ns-inspector', columns);
      const about = u.el('div', 'ns-about', inspector);
      u.el('div', 'ns-doc-icon', about, '▤');
      u.el('h2', '', about, 'About These Settings');
      u.el('p', '', about, 'These options control what information is collected and shared from this computer.');
      u.el('h3', '', about, 'Usage Analytics');
      u.el(
        'p',
        '',
        about,
        'When enabled, this computer sends anonymous information about how you use applications and system features. The data helps us understand which features are most useful and identify opportunities for improvement. No personal documents or the content of your files are sent.',
      );
      const related = u.el('section', 'ns-related', inspector);
      u.el('h3', '', related, 'Related Settings');
      ['Crash Reports', 'Diagnostics', 'Privacy Overview', 'Data and Your Computer'].forEach((x) => {
        const row = u.el('div', 'ns-related-row', related);
        u.el('span', 'ns-mini-doc', row, '▤');
        u.el('span', '', row, x);
      });
      if (mode === 'panel') {
        const note = u.el('div', 'ns-panel-note', inspector);
        u.el('b', '', note, 'Instructions');
        u.el('p', '', note, ctx.instruction);
      }
      if (mode === 'toast') {
        const note = u.el('div', 'ns-toast-note', win, ctx.instruction);
      }
      const dock = u.el('nav', 'ns-dock', win);
      const items = [
        ['▣', 'General'],
        ['▣', 'Displays'],
        ['◖', 'Sound'],
        ['◎', 'Network'],
        ['♙', 'Privacy & Data'],
        ['▤', 'Software Update'],
      ];
      items.forEach((x, i) => {
        const t = u.el('div', 'ns-dock-item' + (i === 4 ? ' active' : ''), dock);
        u.el('span', 'ns-dock-icon', t, x[0]);
        u.el('span', '', t, x[1]);
      });
      const er = rng.fork('chrome/end'),
        cr = rng.fork('chrome/collide');
      const labels = (
        content.END_LABELS || ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply']
      ).map(labelOf);
      let placement = 'footer',
        label = 'Apply';
      if (!ctx.finish && er.bool(0.48)) {
        placement = er.pick(['footer', 'header', 'link', 'icon']);
        label = er.pick(labels);
      }
      const different = labels.filter((x) => x.toLowerCase() !== label.toLowerCase());
      const collide = !ctx.finish && cr.bool(0.3) && different.length ? cr.pick(different) : null;
      let submit = null;
      const button = (parent, txt, cls, action) => {
        const b = u.el('button', cls, parent, txt);
        b.type = 'button';
        if (action) {
          b.dataset.role = 'submit';
          b.setAttribute('aria-label', label);
          b.addEventListener('click', () => ctx.submit());
        } else {
          b.dataset.role = 'xtra';
          b.addEventListener('click', () => env.log('decoy', { label: txt, collide: true }));
        }
        return b;
      };
      if (!ctx.finish) {
        if (placement === 'header') {
          const tools = u.el('div', 'ns-head-tools', title);
          submit = button(tools, label, 'ns-apply', true);
        } else if (placement === 'icon') {
          const tools = u.el('div', 'ns-head-tools', title);
          submit = button(tools, '✓', 'ns-apply ns-icon-end', true);
          submit.title = label;
        } else {
          const actions = u.el('div', 'ns-actions', region);
          if (collide) button(actions, collide, 'ns-secondary', false);
          submit =
            placement === 'link'
              ? u.el('a', 'ns-end-link', actions, label + ' ›')
              : button(actions, label, 'ns-apply', true);
          if (placement === 'link') {
            submit.href = '#';
            submit.dataset.role = 'submit';
            submit.addEventListener('click', (e) => {
              e.preventDefault();
              ctx.submit();
            });
          }
        }
      } else u.el('div', 'ns-actions ns-actions-empty', region);
      if (ctx.finish) submit = null;
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        el = u.el('section', 'ns-overlay ns-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = {
        cookie: 'This computer uses cookies to remember your preferences.',
        toast: 'Settings have been updated.',
        chat: 'Help Desk — How may we help?',
        promo: 'Discover the latest system tools.',
        banner: 'System maintenance is scheduled tonight.',
      };
      u.el('div', '', el, texts[ctx.kind] || 'System notice');
      const close = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept' : '×');
      close.type = 'button';
      close.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss: close, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  });
})();
