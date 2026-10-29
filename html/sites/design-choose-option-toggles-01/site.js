(function () {
  'use strict';
  const C = { site: 'design-choose-option-toggles-01' };
  const labelOf = (x) => (typeof x === 'string' ? x : x && (x.label || x.text || x.name)) || String(x);
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util,
        rng = ctx.rng,
        content = ctx.content || {},
        W = window.innerWidth,
        H = window.innerHeight;
      const title = u.el('header', 'win-title', document.body);
      const app = u.el('span', 'app-mark', title, '◉');
      u.el('span', 'win-caption', title, 'Chatter — Settings');
      const controls = u.el('div', 'window-controls', title);
      ['−', '□', '×'].forEach((x, i) => {
        const b = u.el('span', 'window-control', controls, x);
        b.setAttribute('aria-label', ['Minimize', 'Maximize', 'Close'][i]);
      });
      const menu = u.el('nav', 'menu-bar', document.body);
      ['File', 'Edit', 'View', 'Conversation', 'Tools', 'Help'].forEach((x) => u.el('span', 'menu-item', menu, x));
      const toolbar = u.el('div', 'command-bar', document.body);
      const commands = [
        ['▢', 'New Chat'],
        ['♧', 'New Group'],
        ['♧', 'Mark Read'],
        ['♜', 'Delete'],
        ['⌕', 'Search'],
      ];
      commands.forEach(([ic, t], i) => {
        if (i === 2 || i === 4) {
          const sep = u.el('i', 'command-sep', toolbar);
          sep.setAttribute('aria-hidden', 'true');
        }
        const b = u.el('button', 'command', toolbar);
        b.type = 'button';
        u.el('span', 'command-icon', b, ic);
        u.el('span', '', b, t);
      });
      let mode = ctx.display || 'header';
      if (mode === 'panel' && W < 1260) mode = 'header';
      if (mode === 'toast' && H < 700) mode = 'header';
      const appbody = u.el('div', 'app-body', document.body),
        rail = u.el('aside', 'related-rail', appbody);
      const icons = ['⌕', '▣', 'photo', '♟', 'TK', '♟', 'photo', 'F', 'JP', 'photo', 'CB'];
      icons.forEach((x, i) => {
        const item = u.el('div', `rail-item ${i === 1 ? 'selected' : ''}`, rail);
        if (x === 'photo') item.classList.add('avatar-photo', `avatar-${i}`);
        else u.el('span', 'avatar-text', item, x);
      });
      const contentRoot = u.el('div', 'settings-content', appbody);
      const titleRow = u.el('div', 'settings-heading', contentRoot);
      u.el('span', 'gear', titleRow, '⚙');
      u.el('h1', '', titleRow, 'Settings');
      function note(parent, cls) {
        const n = u.el('aside', cls, parent);
        if (cls === 'instruction-panel') u.el('b', '', n, 'Instructions');
        u.el('div', 'instruction-copy', n, ctx.instruction);
        return n;
      }
      if (mode === 'header') note(contentRoot, 'instruction-header');
      if (mode === 'panel') note(contentRoot, 'instruction-panel');
      const stage = u.el('main', 'ds-stage', contentRoot);
      if (mode === 'toast') {
        note(contentRoot, 'instruction-toast');
        contentRoot.insertBefore(contentRoot.lastChild, stage);
      }
      const er = rng.fork('chrome/end'),
        cr = rng.fork('chrome/collide');
      const labels = (
        Array.isArray(content.END_LABELS) && content.END_LABELS.length
          ? content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply']
      ).map(labelOf);
      let placement = null,
        label = null;
      if (!ctx.finish) {
        if (er.bool(0.5)) {
          placement = 'header';
          label = 'OK';
        } else {
          placement = er.pick(['header', 'footer', 'link']);
          const pool = labels.filter((x) => x.toLowerCase() !== 'ok');
          label = pool.length ? er.pick(pool) : 'Done';
        }
      }
      let collide = null;
      if (!ctx.finish && cr.bool(0.3)) {
        const pool = [...new Set(labels.filter((x) => x.toLowerCase() !== label.toLowerCase()))];
        if (pool.length) collide = { text: cr.pick(pool), where: cr.pick(['header', 'footer']) };
      }
      const decoy = (parent, text) => {
        const b = u.el('button', 'win-xtra', parent, text);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
      };
      const end = (parent, cls, text) => {
        const b = u.el('button', cls, parent, text);
        b.type = 'button';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.addEventListener('click', () => ctx.submit());
        return b;
      };
      let submit = null;
      const footer = u.el('footer', 'settings-footer', contentRoot);
      if (!ctx.finish) {
        if (placement === 'header') {
          if (collide && collide.where === 'header') decoy(toolbar, collide.text);
          submit = end(toolbar, 'ok-button', label);
        } else {
          if (collide && collide.where === 'header') decoy(toolbar, collide.text);
          if (collide && collide.where === 'footer') decoy(footer, collide.text);
          submit = placement === 'link' ? end(footer, 'finish-link', label + ' ›') : end(footer, 'ok-button', label);
        }
      }
      if (ctx.finish) footer.remove();
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        el = u.el('section', `system-overlay system-overlay-${ctx.kind}`, document.body);
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
