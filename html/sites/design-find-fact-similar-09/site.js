(function () {
  'use strict';
  const C = {
    site: 'design-find-fact-similar-09', brand: 'Vocabulary Exercise', title: 'Word Options',
    instruction: 'left', rail: '', menu: 'File|Edit|Format|Tools|Window|Help', briefTitle: 'Instructions'
  };
  const fallbackEnds = ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
  env.site({
    name: C.site, styles: ['site.css'], scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util;
      const top = u.el('header', 'ds-top', document.body);
      const bw = u.el('span', 'ds-brand', top);
      u.el('b', 'ds-logo', bw, 'WordMatch');
      u.el('i', 'ds-tag', bw, 'Find. Compare. Learn.');
      const nav = u.el('nav', 'ds-menu', top);
      ['Task', 'Resources', 'Settings', 'Help'].forEach((t, i) => u.el('span', i ? '' : 'on', nav, t));
      const usr = u.el('span', 'ds-user', top);
      u.el('span', 'ds-avatar', usr);
      u.el('span', '', usr, 'Guest');
      u.el('span', 'ds-chevron', usr);

      const body = u.el('div', 'ds-body', document.body);
      if (C.rail) {
        const rail = u.el('aside', 'ds-rail', body);
        C.rail.split('|').forEach(t => u.el('div', '', rail, t));
      }
      const content = u.el('div', 'ds-content', body);
      const width = document.documentElement.clientWidth;
      let mode = ctx.display || 'header';
      if (mode === 'panel' && width < 1260) mode = 'header';
      if (mode === 'toast' && document.documentElement.clientHeight < 640) mode = 'header';
      function briefing(parent, cls) {
        const b = u.el('aside', cls, parent);
        if (cls === 'ds-header-note') {
          u.el('span', 'ds-num', b, '01');
          const t = u.el('div', 'ds-ttl', b);
          u.el('div', 'ds-kick', t, 'SIMILAR WORDS');
          u.el('div', 'ds-instruction', t, ctx.instruction);
          return b;
        }
        u.el('div', 'ds-instruction', b, ctx.instruction);
        return b;
      }
      if (mode === 'header') briefing(content, 'ds-header-note');
      const main = u.el('div', 'ds-main', content);
      if (mode === 'panel') {
        const panel = briefing(main, 'ds-panel');
        u.el('div', 'ds-panel-title', panel, 'TASK NOTES');
      }
      const stage = u.el('main', 'ds-stage', main);
      if (mode === 'toast') {
        const note = briefing(content, 'ds-toast');
        content.insertBefore(note, main);
      }
      const foot = u.el('footer', 'ds-footer', content);
      u.el('span', 'ds-count', foot, 'Ready');
      const clear = u.el('button', 'ds-clear', foot, 'Clear All');
      clear.type = 'button';
      clear.addEventListener('click', () => stage.querySelectorAll('input:checked').forEach(i => i.click()));

      let submit = null;
      let label = 'Submit';
      let placement = 'footer';
      if (!ctx.finish) {
        const er = ctx.rng.fork('chrome/end');
        const endBank = ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
          ? ctx.content.END_LABELS : fallbackEnds;
        const endLabels = endBank.map(x => typeof x === 'string' ? x : (x.label || x.text || x.name || String(x)));
        label = er.bool(0.5) ? 'Submit' : er.pick(endLabels.filter(x => x.toLowerCase() !== 'submit'));
        placement = er.pick(['footer', 'footer', 'header', 'link']);
        if (label === 'Submit') placement = 'footer';
        const endButton = (parent, cls, text, tag) => {
          const b = u.el(tag || 'button', cls, parent, text);
          if (b.tagName === 'BUTTON') b.type = 'button';
          else b.href = '#';
          b.dataset.role = 'submit';
          b.setAttribute('aria-label', label);
          b.title = label;
          b.addEventListener('click', e => { e.preventDefault(); ctx.submit(); });
          return b;
        };
        const collisionRng = ctx.rng.fork('chrome/collide');
        let collision = null;
        if (collisionRng.bool(0.3)) {
          const options = [...new Set(endLabels)].filter(x => x.trim().toLowerCase() !== label.trim().toLowerCase());
          if (options.length) collision = collisionRng.pick(options);
        }
        const decoy = (parent, text) => {
          const b = u.el('button', 'ds-xtra', parent, text);
          b.type = 'button';
          b.dataset.role = 'xtra';
          b.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
        };
        if (placement === 'header' || (collision && collisionRng.pick(['header', 'footer']) === 'header')) {
          const tools = u.el('div', 'ds-top-tools', top);
          top.insertBefore(tools, usr);
          if (collision) decoy(tools, collision);
          if (placement === 'header') submit = endButton(tools, 'ds-submit ds-top-submit', label);
        } else if (collision) {
          decoy(foot, collision);
        }
        if (placement === 'footer') submit = endButton(foot, 'ds-submit', label);
        if (placement === 'link') submit = endButton(foot, 'ds-endlink', label + ' ›', 'a');
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      const el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = {
        cookie: 'We use cookies to remember your preferences.', toast: 'Changes synced.',
        chat: 'Hello. How can we help?', promo: 'Try our new workspace.', banner: 'Scheduled maintenance tonight.'
      };
      u.el('div', '', el, texts[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    }
  });
})();
