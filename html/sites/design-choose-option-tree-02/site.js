(function () {
  'use strict';
  const C = { site: 'design-choose-option-tree-02', brand: 'Personal Organizer', menu: 'File|Edit|View|Tools|Help' };
  const labelOf = (x) => (typeof x === 'string' ? x : x && (x.label || x.text || x.name)) || String(x);
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util,
        content = ctx.content || {},
        rng = ctx.rng;
      const win = u.el('div', 'ds-window', document.body);
      const top = u.el('header', 'ds-top', win);
      u.el('span', 'ds-appicon', top, '◧');
      u.el('span', 'ds-brand', top, C.brand);
      u.el('span', 'ds-window-controls', top, '_  □  ×');
      const nav = u.el('nav', 'ds-menu', win);
      C.menu.split('|').forEach((t) => u.el('span', '', nav, t));
      const toolbar = u.el('div', 'ds-toolbar', win);
      [
        ['▤', 'New'],
        ['📂', 'Open'],
        ['▧', 'Print'],
        ['✂', 'Cut'],
        ['▣', 'Copy'],
        ['▤', 'Paste'],
        ['👥', 'Contacts'],
      ].forEach((x, i) => {
        if (i === 3 || i === 6) u.el('i', 'ds-tool-sep', toolbar);
        const b = u.el('button', 'ds-tool', toolbar, x[0]);
        b.type = 'button';
        b.title = x[1];
      });
      const body = u.el('div', 'ds-body', win),
        rail = u.el('aside', 'ds-rail', body);
      [
        ['👥', 'Contacts'],
        ['▦', 'Calendars'],
        ['☑', 'Tasks'],
        ['🧺', 'Recipes'],
      ].forEach((x) => {
        const item = u.el('div', 'ds-navitem', rail);
        u.el('b', '', item, x[0]);
        u.el('span', '', item, x[1]);
      });
      const contentRoot = u.el('div', 'ds-content', body);
      let mode = ctx.display || 'hidden';
      const width = window.innerWidth,
        height = window.innerHeight;
      if ((mode === 'panel' && width < 1260) || (mode === 'toast' && height < 700)) mode = 'header';
      function briefing(parent, cls) {
        const b = u.el('aside', cls, parent);
        if (cls === 'ds-brief') u.el('h2', '', b, 'Task');
        u.el('div', 'ds-instruction', b, ctx.instruction);
        return b;
      }
      if (mode === 'header') briefing(contentRoot, 'ds-header-note');
      if (mode === 'panel') briefing(contentRoot, 'ds-brief');
      const main = u.el('div', 'ds-main', contentRoot),
        stage = u.el('main', 'ds-stage', main);
      const summary = u.el('aside', 'ds-summary', main);
      u.el('h2', '', summary, 'Selection summary');
      const sum = u.el('div', 'ds-summary-box', summary);
      [
        'Contacts',
        'Calendars',
        'Tasks',
        'Notes',
        'Favorites',
        'Vegetarian',
        'Vegan',
        'Gluten-free',
        'Dairy-free',
        'Nut-free',
        'Low sodium',
      ].forEach((x) => {
        const row = u.el('div', 'ds-sumrow', sum);
        u.el('span', '', row, x + ':');
        u.el('b', '', row, '0');
      });
      if (mode === 'toast') {
        const note = briefing(contentRoot, 'ds-toast');
        contentRoot.insertBefore(note, main);
      }
      const endRng = rng.fork('chrome/end'),
        collideRng = rng.fork('chrome/collide');
      const labels = (
        Array.isArray(content.END_LABELS) && content.END_LABELS.length
          ? content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply']
      ).map(labelOf);
      const decoyLabels = (
        Array.isArray(content.DECOY_LABELS) && content.DECOY_LABELS.length
          ? content.DECOY_LABELS
          : ['Help', 'Feedback', 'Preview', 'Save draft']
      ).map(labelOf);
      let placement = null,
        label = null;
      if (!ctx.finish) {
        if (endRng.bool(0.5)) {
          placement = 'footer';
          label = 'Continue';
        } else {
          placement = endRng.pick(['footer', 'link', 'header']);
          const alt = labels.filter((x) => x.toLowerCase() !== 'continue');
          label = alt.length ? endRng.pick(alt) : 'Done';
        }
      }
      let collide = null;
      if (!ctx.finish && collideRng.bool(0.3)) {
        const pool = [...new Set(labels.filter((x) => x.toLowerCase() !== label.toLowerCase()))];
        if (pool.length) collide = { text: collideRng.pick(pool), where: collideRng.pick(['header', 'footer']) };
      }
      const decoyBtn = (p, text, is) => {
        const b = u.el('button', 'ds-xtra', p, text);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', is ? { label: text, collide: true } : { label: text }));
        return b;
      };
      const endBtn = (p, cls, text) => {
        const b = u.el(cls === 'ds-endlink' ? 'a' : 'button', cls, p, text);
        if (b.tagName === 'BUTTON') b.type = 'button';
        else b.href = '#';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      };
      const foot = u.el('footer', 'ds-footer', contentRoot);
      let submit = null;
      if (!ctx.finish) {
        if (placement === 'header') {
          const tools = u.el('div', 'ds-header-tools', top);
          if (collide && collide.where === 'header') decoyBtn(tools, collide.text, true);
          submit = endBtn(tools, 'ds-submit ds-submit-head', label);
        } else {
          if (collide && collide.where === 'header') decoyBtn(u.el('div', 'ds-header-tools', top), collide.text, true);
          if (collide && collide.where === 'footer') decoyBtn(foot, collide.text, true);
          submit = placement === 'link' ? endBtn(foot, 'ds-endlink', label + ' ›') : endBtn(foot, 'ds-submit', label);
        }
      }
      const fr = rng.fork('chrome/filler');
      if (!ctx.finish && fr.bool(0.22)) decoyBtn(foot, fr.pick(decoyLabels), false);
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = {
        cookie: 'This application stores your preferences.',
        toast: 'Changes saved.',
        chat: 'How can we help?',
        promo: 'Discover more organizer tools.',
        banner: 'System notice.',
      };
      u.el('div', '', el, texts[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  });
})();
