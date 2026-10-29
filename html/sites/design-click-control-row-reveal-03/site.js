(function () {
  'use strict';
  env.site({
    name: 'design-click-control-row-reveal-03',
    styles: ['site.css'],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'ref drive';
      const shell = u.el('main', 'shell', document.body);
      const rail = u.el('nav', 'drive-rail', shell);
      u.el('div', 'brand', rail, '▲');
      u.el('div', 'brand-name', rail, 'Acme Drive');
      const nav = u.el('div', 'drive-nav', rail);
      [
        ['▱', 'My Files'],
        ['♟', 'Shared with me'],
        ['◷', 'Recent'],
        ['☆', 'Starred'],
        ['▤', 'Trash'],
        ['', 'Projects'],
        ['♟', 'Team Spaces'],
      ].forEach(([ic, label], i) => {
        if (i === 5) u.el('div', 'nav-rule', nav);
        const item = u.el('div', 'nav-item' + (i === 0 ? ' active' : ''), nav);
        u.el('span', 'nav-icon', item, ic);
        u.el('span', '', item, label);
      });
      const app = u.el('section', 'app', shell);
      const head = u.el('header', 'head', app);
      const title = u.el('h1', 'title', head, 'Documents');
      if (ctx.display === 'header') {
        const note = u.el('div', 'instruction header-note', head, ctx.instruction);
        note.dataset.display = ctx.display;
      }
      const toolbar = u.el('div', 'toolbar', head);
      const search = u.el('div', 'search', toolbar, '⌕');
      u.el('span', '', search, 'Search in Documents');
      u.el('button', 'view-button', toolbar, '☰');
      const actions = u.el('div', 'head-actions', toolbar);
      let submit = null;
      const endRng = ctx.rng.fork('chrome/end');
      const endBank =
        ctx.content && Array.isArray(ctx.content.END_LABELS)
          ? ctx.content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
      const endText = (x) => (typeof x === 'string' ? x : x && (x.label || x.text || x.name)) || String(x);
      const label = endRng.bool(0.5) ? 'Apply' : endText(endRng.pick(endBank.filter((x) => endText(x) !== 'Apply')));
      const placement = endRng.pick(['header', 'header', 'footer', 'link']);
      const collideRng = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (collideRng.bool(0.3)) {
        const choices = [
          ...new Set(endBank.map(endText).filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase())),
        ];
        if (choices.length) collide = collideRng.pick(choices);
      }
      const decoy = (parent, text) => {
        const b = u.el('button', 'xtra-task', parent, text);
        b.type = 'button';
        b.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
        return b;
      };
      const makeEnd = (parent) => {
        const b = u.el('button', 'submit', parent, label);
        b.type = 'button';
        b.addEventListener('click', ctx.submit);
        return b;
      };
      u.el('button', 'new-button', actions, 'New⌄');
      if (!ctx.finish) {
        if (placement === 'header') submit = makeEnd(actions);
        else if (placement === 'footer') submit = makeEnd(app);
        else {
          const link = u.el('button', 'end-link', app, label);
          link.addEventListener('click', ctx.submit);
          submit = link;
        }
      }
      if (collide) decoy(actions, collide);
      const work = u.el('div', 'work', app);
      const center = u.el('section', 'center', work);
      if (ctx.display === 'toast') {
        const note = u.el('div', 'instruction instruction-toast', center, ctx.instruction);
        note.dataset.display = ctx.display;
      }
      const stage = u.el('div', 'stage', center);
      const aside = u.el('aside', 'inspector', work);
      if (ctx.display === 'panel') {
        const note = u.el('div', 'instruction panel-note', aside, ctx.instruction);
        note.dataset.display = ctx.display;
      }
      const fileTitle = u.el('div', 'file-heading', aside, 'draft v5 (final).odt');
      u.el('span', 'star', fileTitle, '☆');
      const preview = u.el('div', 'file-preview', aside);
      u.el('div', 'doc-icon', preview, '▤');
      const details = u.el('div', 'file-details', aside);
      [
        ['Type', 'OpenDocument Text'],
        ['Size', '318 KB'],
        ['Modified', 'May 6, 2021, 10:14 AM'],
        ['Owner', 'Taylor Kim'],
        ['Location', '▱  Documents'],
      ].forEach(([k, v]) => {
        const row = u.el('div', 'detail-row', details);
        u.el('span', '', row, k);
        u.el('span', '', row, v);
      });
      u.el('div', 'detail-rule', aside);
      u.el('div', 'description-label', aside, 'Description');
      u.el('p', 'description', aside, 'Final draft with edits and updated figures.');
      return { stage, submit };
    },
    overlay(ctx) {
      const el = ctx.util.el('section', 'perturb ' + ctx.kind, document.body);
      ctx.util.el(
        'strong',
        '',
        el,
        {
          cookie: 'Cookie preferences',
          toast: 'Notification',
          chat: 'Support',
          promo: 'A special offer',
          banner: 'Service notice',
        }[ctx.kind],
      );
      ctx.util.el(
        'p',
        '',
        el,
        {
          cookie: 'Choose your preferences to continue.',
          toast: 'Your workspace is ready.',
          chat: 'How can we help?',
          promo: 'Explore the latest tools.',
          banner: 'A new update is available.',
        }[ctx.kind],
      );
      const dismiss = ctx.util.el('button', 'dismiss', el, ctx.kind === 'cookie' ? 'Accept' : 'Close');
      dismiss.type = 'button';
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  });
})();
