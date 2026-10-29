(function () {
  'use strict';
  const C = {
    site: 'design-solve-puzzle-tictactoe-02', task: 'solve-puzzle', scenario: 'tictactoe',
    style: 'yosemite', title: 'Tic-Tac-Toe', layout: 'margin', note: 'How to play',
    aside: '1. You are X.\n2. Click an empty square to place your X.\n3. The computer will make its move (O).\n4. Keep playing until the game is over.'
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    frame(ctx) {
      let display = ctx.display || 'header';
      if ((display === 'panel' || display === 'toast') && window.innerWidth < 1120) display = 'header';
      document.body.className = `${C.style} ${C.layout} instruction-${display === 'toast' ? 'toast-mode' : display}`;
      const u = ctx.util;
      const app = u.el('main', 'app', document.body);
      const top = u.el('header', 'top', app);
      const icon = u.svg('svg', { width: 26, height: 26, viewBox: '0 0 26 26', class: 'title-icon' }, top);
      u.svg('rect', { x: 3, y: 2, width: 20, height: 22, rx: 3, fill: 'none', stroke: 'currentColor', 'stroke-width': 1.5 }, icon);
      u.svg('path', { d: 'M7 7h12M7 11h12M7 15h12M7 19h9', fill: 'none', stroke: 'currentColor', 'stroke-width': 1.5 }, icon);
      u.el('span', '', top, C.title);
      const wc = u.el('div', 'native-window-controls', top);
      for (const d of ['min', 'max', 'close']) {
        const s = u.svg('svg', { width: 20, height: 20, viewBox: '0 0 20 20' }, wc);
        const path = d === 'min' ? 'M3 12h14' : d === 'max' ? 'M4 4h12v12H4z' : 'M4 4l12 12M16 4L4 16';
        u.svg('path', { d: path, fill: 'none', stroke: 'currentColor', 'stroke-width': 1.5 }, s);
      }
      const center = u.el('div', 'center', app);
      const brief = u.el('div', 'brief', center);
      if (display === 'header') brief.textContent = ctx.instruction;
      const stage = u.el('section', 'stage', center);
      const aside = u.el('aside', 'aside', document.body);
      if (display === 'panel') {
        u.el('b', '', aside, C.note);
        u.el('p', 'aside-copy', aside, ctx.instruction);
      } else {
        u.el('b', '', aside, C.note);
        u.el('p', 'aside-copy', aside, C.aside);
      }
      if (display === 'toast') {
        const toast = u.el('div', 'instruction-toast', document.body);
        toast.setAttribute('role', 'note');
        u.el('b', '', toast, C.note);
        u.el('span', '', toast, ctx.instruction);
      }
      const footer = u.el('footer', 'bottom', app);
      const summary = u.el('div', 'dock-summary', footer);
      [['Current turn', 'X (you)'], ['Computer', 'O'], ['Moves', '']].forEach(([label, value], i) => {
        const item = u.el('div', `dock-item dock-item-${i}`, summary);
        if (label) u.el('span', 'dock-label', item, label);
        u.el('strong', 'dock-value', item, value);
      });
      const labels = ctx.content && Array.isArray(ctx.content.END_LABELS)
        ? ctx.content.END_LABELS : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
      const labelText = x => typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x);
      const endRng = ctx.rng.fork('chrome/end');
      const placement = endRng.pick(['dock', 'dock', 'header', 'link']);
      let label = endRng.bool(.5) ? 'Submit' : labelText(endRng.pick(labels));
      // Keep the reference's dock + Submit pair in half of episodes.
      // Preserve the existing stream's draws; refine alternate labels on a new fork.
      if (placement === 'dock') label = 'Submit';
      else if (label === 'Submit') {
        const alternatives = labels.map(labelText).filter(text => text !== 'Submit');
        if (alternatives.length) label = ctx.rng.fork('chrome/end/label').pick(alternatives);
      }
      let submit = null;
      if (!ctx.finish) {
        if (placement === 'header') {
          submit = u.el('button', 'submit top-end', top, label);
          submit.type = 'button';
          submit.addEventListener('click', ctx.submit);
        } else if (placement === 'link') {
          submit = u.el('a', 'end-link', footer, `${label} ›`);
          submit.href = '#';
          submit.addEventListener('click', e => { e.preventDefault(); ctx.submit(); });
        } else {
          submit = u.el('button', 'submit', footer, label);
          submit.type = 'button';
          submit.addEventListener('click', ctx.submit);
        }
        submit.dataset.role = 'submit';
        submit.title = label;
        submit.setAttribute('aria-label', label);
      }
      const collideRng = ctx.rng.fork('chrome/collide');
      if (!ctx.finish && collideRng.bool(.3)) {
        const own = label.trim().toLowerCase();
        const options = [...new Set(labels.map(labelText))].filter(x => x.trim().toLowerCase() !== own);
        if (options.length) {
          const text = labelText(collideRng.pick(options));
          const parent = placement === 'header' ? footer : top;
          const decoy = u.el('button', 'dock-xtra collide', parent, text);
          decoy.type = 'button';
          decoy.dataset.role = 'xtra';
          decoy.title = text;
          decoy.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
        }
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      const el = u.el('div', `overlay ${ctx.kind}`, document.body);
      const messages = {
        cookie: 'This application stores preferences on your device.', toast: 'Your workspace has been synced.',
        chat: 'Need help with this exercise?', promo: 'Try the new practice collection.',
        banner: 'An updated practice collection is available.'
      };
      u.el('span', '', el, messages[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept' : 'Dismiss');
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    }
  });
})();
