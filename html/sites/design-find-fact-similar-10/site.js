(function () {
  'use strict';
  const C = {
    'site': 'design-find-fact-similar-10',
    'brand': 'Vocabulary Exercise',
    'title': 'Word Options',
    'instruction': 'left',
    'rail': 'Word Lab|Tasks|Progress|Settings',
    'menu': 'File|Edit|Format|Tools|Window|Help',
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
      const top = u.el('header', 'ds-top', document.body);
      u.el('span', 'ds-brand', top, C.brand);
      u.el('span', '', top, '−    □    ×');
      if (C.menu) {
        const nav = u.el('nav', 'ds-menu', document.body);
        C.menu.split('|').forEach((t) => u.el('span', '', nav, t));
      }
      const body = u.el('div', 'ds-body', document.body);
      if (C.rail) {
        const rail = u.el('aside', 'ds-rail', body);
        const icons = [
          '',
          '<rect x="2" y="2" width="9" height="9" rx="1"/><rect x="14" y="2" width="9" height="9" rx="1"/><rect x="2" y="14" width="9" height="9" rx="1"/><rect x="14" y="14" width="9" height="9" rx="1"/>',
          '<path d="M2 16h6v9H2zm8-6h6v15h-6zm8-7h6v22h-6z"/>',
          '<path d="m11 0 4 0 1 4 3 1 3-2 3 3-2 3 1 3 4 1v4l-4 1-1 3 2 3-3 3-3-2-3 1-1 4h-4l-1-4-3-1-3 2-3-3 2-3-1-3-4-1v-4l4-1 1-3-2-3 3-3 3 2 3-1z"/><circle cx="13" cy="15" r="5" fill="#191a18"/>',
        ];
        C.rail.split('|').forEach((t, i) => {
          const row = u.el('div', '', rail);
          if (i) {
            const icon = u.el('span', 'ds-nav-icon', row);
            icon.setAttribute('aria-hidden', 'true');
            icon.innerHTML = '<svg viewBox="0 0 28 30" fill="currentColor">' + icons[i] + '</svg>';
          }
          u.el('span', '', row, t);
        });
      }
      const content = u.el('div', 'ds-content' + (ctx.finish ? ' ds-finish' : ''), body);
      u.el('div', 'ds-tag1', content, 'Focus\nLearn\nGrow');
      u.el('div', 'ds-tag2', content, 'Small\nSteps\nBrighter\nThinking');
      const clr = u.el('button', 'ds-clear', content, 'Clear All');
      clr.type = 'button';
      clr.addEventListener('click', () => {
        document.querySelectorAll('.rl-cb input:checked').forEach((i) => i.click());
      });
      u.el('div', 'ds-divider', content);
      let display = ctx.display || 'header';
      if ((display === 'panel' && window.innerWidth < 1260) || (display === 'toast' && window.innerHeight < 700))
        display = 'header';
      function briefing(parent, cls) {
        const b = u.el('aside', cls, parent);
        if (cls === 'ds-brief') u.el('h2', '', b, C.briefTitle || 'Task');
        u.el('div', 'ds-instruction', b, ctx.instruction);
        return b;
      }
      const main = u.el('div', 'ds-main', content);
      if (display === 'header') briefing(main, 'ds-brief');
      const stage = u.el('main', 'ds-stage', main);
      if (display === 'panel') briefing(content, 'ds-panel-note');
      if (display === 'toast') {
        const note = briefing(content, 'ds-toast');
        content.insertBefore(note, main);
      }
      const foot = u.el('footer', 'ds-footer', content);
      u.el('span', '', foot, 'Ready');
      let submit = null;
      const endR = ctx.rng.fork('chrome/end');
      const labels = ctx.content.END_LABELS;
      const textOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const label =
        endR.bool(0.5) || !labels || !labels.length ? 'Submit' : textOf(labels[endR.int(0, labels.length - 1)]);
      const places = ['footer', 'footer', 'header', 'footer', 'link'];
      const place = ctx.finish ? null : places[endR.int(0, places.length - 1)];
      const end = (parent, cls, text, link) => {
        const b = u.el(link ? 'a' : 'button', cls, parent, text);
        if (link) b.href = '#';
        else b.type = 'button';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', String(label));
        b.title = String(label);
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      };
      if (!ctx.finish) {
        if (place === 'footer') submit = end(foot, 'ds-submit', label, false);
        else if (place === 'link') submit = end(foot, 'ds-endlink', String(label) + ' ›', true);
        else submit = end(content, 'ds-header-end', label, false);
      }
      const cr = ctx.rng.fork('chrome/collide');
      let collision = null;
      if (cr.bool(0.3) && labels && labels.length > 1) {
        const options = labels.filter((x) => String(x).trim().toLowerCase() !== String(label).trim().toLowerCase());
        if (options.length) collision = options[cr.int(0, options.length - 1)];
      }
      if (collision) {
        const b = u.el('button', 'ds-xtra ds-pq', content, collision);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', { label: collision, collide: true }));
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
