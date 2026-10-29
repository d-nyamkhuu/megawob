/* click-control/_base-mount: mount units of the base template.
 * scopeRef is the live reference scope; reference.js retains their design.parts keys and overrides.
 */
(function () {
  'use strict';

  function mount(scopeRef, ctx, page, content, builder) {
    let rec = null;
    let v = null;
    const syncAll = (m) => {
      if (v) v.sync(m);
      if (rec) rec.sync(m);
    };
    const up = (patch) => {
      ctx.update({ ...ctx.model, ...patch });
      syncAll(ctx.model);
    };
    v = builder(ctx, content, up, page);
    if (v.recover) rec = scopeRef.recovery(ctx, page, v.area || content, up, v.recover);
    syncAll(ctx.model);
    return {
      sync: syncAll,
      locate(t) {
    if (t.undo) return (rec && rec.locate()) || (v.locate(t)) || null;
        if (t.blank) {
          const r = scopeRef.blankEl.getBoundingClientRect();
          return [r.left + Math.min(r.width - 4, 6 + r.width * 0.3), r.top + r.height / 2];
        }
        return v.locate(t);
      },
    };
  }

  function initialize(scopeRef, set, __has, __parts) {
    set('BUILDERS', __has('BUILDERS') ? __parts['BUILDERS'](undefined, scopeRef) : ({ button: scopeRef.buildButton, sequence: scopeRef.buildSequence, link: scopeRef.buildLink, tab: scopeRef.buildTab, menu: scopeRef.buildMenu,
        collapsible: scopeRef.buildCollapsible, dialog: scopeRef.buildDialog, pie: scopeRef.buildPie, widget: scopeRef.buildWidget, focus: scopeRef.buildFocus, hover: scopeRef.buildHover,
        'tooltip-inspect': scopeRef.buildTooltip, rows: scopeRef.buildRows, context: scopeRef.buildContext, open: scopeRef.buildOpen,
        'hover-menu': scopeRef.buildHoverMenu, flyout: scopeRef.buildFlyout, 'row-reveal': scopeRef.buildRowReveal }));
    scopeRef.env.widget({
      task: 'click-control',
      site: 'base',
      name: 'controls',
      split: 'train',
      scenarios: ['button', 'sequence', 'link', 'tab', 'menu', 'collapsible', 'dialog', 'pie', 'widget', 'focus', 'hover',
        'tooltip-inspect', 'rows', 'context', 'open', 'hover-menu', 'flyout', 'row-reveal'],
      traits: { menuOpen: ['hover', 'click'] },

      render(ctx) {
        scopeRef.ensureStyle('uc-style', scopeRef.CSS);
        scopeRef.ERA = null;
        const { page, content, h1 } = scopeRef.frame(ctx);
        scopeRef.blankEl = h1;
        scopeRef.view = scopeRef.mount(ctx, page, content, scopeRef.BUILDERS[ctx.spec.scenario]);
        return { anchors: [page], sync: (m) => scopeRef.view.sync(m) };
      },

      locate(t) {
        return scopeRef.must(scopeRef.view && scopeRef.view.locate(t), t);
      },
    });
  }

  env.template('click-control/_base-mount', () => ({ functions: { mount }, initialize }));
})();
