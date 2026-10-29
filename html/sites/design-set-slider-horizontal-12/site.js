/* Carbon photo editor with a stale layout warning, independent of the live task model. */
(function () {
  'use strict';
  env.site({
    name: 'design-set-slider-horizontal-12',
    styles: ['site.css'],
    scripts: [],
    initialOverlay: { kind: 'banner' },
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'carbon-editor instruction-' + ctx.display;
      const er = ctx.rng.fork('chrome/end');
      const labels = ctx.content && ctx.content.END_LABELS;
      const endLabels =
        Array.isArray(labels) && labels.length
          ? labels
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
      const original = er.bool(0.5);
      const alternates = endLabels.filter((x) => String(x).trim().toLowerCase() !== 'submit');
      const label = original ? 'Submit' : String(er.pick(alternates.length ? alternates : endLabels));
      const placement = original ? 'footer' : er.pick(['header', 'link']);
      const cr = ctx.rng.fork('chrome/collide');
      const collide = cr.bool(0.3)
        ? String(cr.pick(endLabels.filter((x) => String(x).trim().toLowerCase() !== label.trim().toLowerCase())))
        : null;
      const menu = u.el('header', 'menu-bar', document.body);
      const logo = u.el('span', 'app-logo', menu);
      u.el('b', 'red', logo, 'P');
      logo.append('h');
      u.el('b', 'gold', logo, 'o');
      logo.append('to');
      u.el('b', 'green', logo, 'Ed');
      logo.append('it');
      for (const label of ['File', 'Edit', 'View', 'Image', 'Adjust', 'Window', 'Help'])
        u.el('span', 'menu-item', menu, label);
      if (ctx.display === 'header') u.el('section', 'instruction-bar', document.body, ctx.instruction);
      else if (ctx.display === 'panel')
        u.el('section', 'instruction-bar instruction-panel-note', document.body, ctx.instruction);
      else if (ctx.display === 'toast') {
        const toast = u.el('section', 'instruction-bar instruction-toast-note', document.body, ctx.instruction);
        const close = u.el('button', 'instruction-close', toast, '×');
        close.setAttribute('aria-label', 'Close instructions');
        close.onclick = () => {
          toast.style.visibility = 'hidden';
        };
      } else document.body.classList.add('instruction-hidden');
      const stage = u.el('main', 'editor-stage', document.body);
      stage.dataset.role = 'stage';
      const foot = u.el('footer', 'editor-footer', document.body);
      const layout = u.el('button', 'layout-icon', foot);
      layout.setAttribute('aria-label', 'Window layout');
      const svg = u.svg('svg', { viewBox: '0 0 30 30', 'aria-hidden': 'true' }, layout);
      for (const [x, y, w, h] of [
        [3, 3, 11, 11],
        [3, 17, 7, 10],
        [13, 17, 11, 10],
      ])
        u.svg('rect', { x, y, width: w, height: h, fill: '#92b4cc' }, svg);
      u.svg('path', { d: 'M20 3H26V9M23 6H19', stroke: '#92b4cc', 'stroke-width': 2, fill: 'none' }, svg);
      u.el('span', 'file-name', foot, 'Mountains.jpg');
      u.el('span', 'file-dimensions', foot, '1024 × 576');
      const actions = u.el('div', 'footer-actions', foot);
      const reset = u.el('button', 'reset', actions, 'Reset');
      reset.dataset.action = 'reset';
      const endControl = (parent, kind, text) => {
        const b = u.el(kind === 'link' ? 'a' : 'button', kind === 'link' ? 'end-link' : 'submit', parent, text);
        if (kind === 'link') b.href = '#';
        else b.type = 'button';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.onclick = (e) => {
          e.preventDefault();
          ctx.submit();
        };
        return b;
      };
      let submit = null;
      const decoy = (parent) => {
        if (!collide) return;
        const b = u.el('button', 'end-xtra', parent, collide);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.onclick = () => env.log('decoy', { label: collide, collide: true });
      };
      if (!ctx.finish && placement === 'header') {
        const tools = u.el('div', 'toolbar-actions', menu);
        decoy(tools);
        submit = endControl(tools, 'button', label);
      }
      if (!ctx.finish && placement !== 'header') {
        decoy(actions);
        submit = endControl(actions, placement, placement === 'link' ? label + ' ›' : label);
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      if (ctx.initial && ctx.kind === 'banner') {
        const warning = u.el('section', 'stale-warning', document.body);
        warning.setAttribute('role', 'dialog');
        warning.setAttribute('aria-label', 'Unsaved layout changes');
        const triangle = u.svg('svg', { viewBox: '0 0 64 62', class: 'warning-icon', 'aria-hidden': 'true' }, warning);
        u.svg(
          'path',
          {
            d: 'M27 6Q32 -2 37 6L61 50Q64 57 56 58H8Q0 58 4 50Z',
            fill: '#eed555',
            stroke: '#f9e68c',
            'stroke-width': 1.5,
          },
          triangle,
        );
        u.svg('path', { d: 'M30 19H35L34 39H31ZM30 45H35V50H30Z', fill: '#1c1d1a' }, triangle);
        const content = u.el('div', 'warning-content', warning);
        u.el('h2', '', content, 'Unsaved layout changes');
        u.el(
          'p',
          '',
          content,
          'You have unsaved layout changes. If you continue without saving, your layout changes will be discarded.',
        );
        const buttons = u.el('div', 'warning-actions', content);
        const cancel = u.el('button', '', buttons, 'Cancel');
        const proceed = u.el('button', 'continue', buttons, 'Continue without saving');
        const dismiss = () => ctx.dismiss('close');
        proceed.onclick = dismiss;
        cancel.onclick = dismiss;
        const x = u.el('button', 'warning-x', warning, '×');
        x.setAttribute('aria-label', 'Close warning');
        x.onclick = dismiss;
        return { el: warning, dismiss: proceed };
      }
      const el = u.el('aside', 'episode-notice', document.body);
      const titles = {
        cookie: 'Privacy preferences',
        toast: 'Image ready',
        chat: 'Need help?',
        promo: 'Explore more tools',
        banner: 'Workspace notice',
      };
      u.el('h2', '', el, titles[ctx.kind]);
      u.el('p', '', el, 'Continue editing the current photo. Your adjustments are kept in this session.');
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Reject optional' : 'Dismiss');
      dismiss.onclick = () => ctx.dismiss('dismiss');
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 5 : 0 };
    },
  });
})();
