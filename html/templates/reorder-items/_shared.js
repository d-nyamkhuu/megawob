/* reorder-items/_shared: identical card badge, drop and focus behavior shared by sibling templates. */
(function () {
  'use strict';
  const LOCK_SVG = '<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path fill="currentColor" d="M5 7V5a3 3 0 0 1 6 0v2h.5A1.5 1.5 0 0 1 13 8.5v5A1.5 1.5 0 0 1 11.5 15h-7A1.5 1.5 0 0 1 3 13.5v-5A1.5 1.5 0 0 1 4.5 7H5zm1.5 0h3V5a1.5 1.5 0 0 0-3 0v2z"/></svg>';

  function tagEl(util, parent, lab) {
    const t = util.el('span', 'ro-tag', parent, lab.tag);
    t.style.setProperty('--tagc', lab.color || '#868e96');
    return t;
  }

  function onOrder(env, ctx, getSortable) {
    return (order) => {
      const pinned = env.taskDef.helpers.pin ? env.taskDef.helpers.pin(order, ctx.spec) : order;
      if (pinned.join() !== order.join()) getSortable().set(pinned);
      ctx.update({ ...ctx.model, order: pinned });
    };
  }

  function mirrorFocus(ctx, root, idOf) {
    // Pointer presses are preventDefault-ed by the drag primitive, which also cancels focus-on-click.
    root.addEventListener('pointerdown', (e) => {
      const el = e.target.closest && e.target.closest('[tabindex]');
      if (el && root.contains(el)) el.focus();
    });
    root.addEventListener('focusin', (e) => {
      const id = idOf(e.target);
      if (id && ctx.model.focus !== id) ctx.update({ ...ctx.model, focus: id });
    });
    root.addEventListener('focusout', (e) => {
      if (!(e.relatedTarget && root.contains(e.relatedTarget)) && ctx.model.focus) ctx.update({ ...ctx.model, focus: null });
    });
  }

  env.template('reorder-items/_shared', () => ({ LOCK_SVG, tagEl, onOrder, mirrorFocus }));
})();
