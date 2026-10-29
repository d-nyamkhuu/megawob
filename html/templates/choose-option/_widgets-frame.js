/* choose-option/_widgets-frame: widget template parts, installed in their original order.
 * All BASE keys remain design-overridable through the parent template.
 */
(function () {
  'use strict';
  function install(scopeRef) {
    scopeRef.BASE.begin = (ctx) => {
      scopeRef.P.marker(ctx);
      scopeRef.P.details(ctx);
    };

    scopeRef.BASE.layout = (ctx) => {
      const wrap = scopeRef.P.wrap(ctx);
      const card = scopeRef.P.card(ctx, wrap);
      scopeRef.P.heading(ctx, card);
      const field = scopeRef.P.field(ctx, card);
      return { wrap, card, field };
    };

    scopeRef.BASE.wrap = (ctx) => ctx.util.el('div', 'fp-wrap', ctx.stage);

    scopeRef.BASE.card = (ctx, wrap) => {
      const card = ctx.util.el('div', scopeRef.D.cardClass, wrap);
      card.dataset.role = 'form';
      if (scopeRef.D.cardWidth) card.style.width = Math.max(240, ctx.size.width - 60) + 'px';
      card.style.setProperty('--fp-r', scopeRef.D.radius);
      card.style.setProperty('--fp-rc', scopeRef.D.controlRadius);
      return card;
    };

    scopeRef.BASE.heading = (ctx, card) => {
      if (scopeRef.D.emailHeader) {
        const head = ctx.util.el('header', 'ds-email-heading', card);
        ctx.util.el('h1', '', head, scopeRef.D.emailTitle);
        ctx.util.el('p', '', head, scopeRef.D.emailNote);
        return;
      }
      if (scopeRef.D.motif) scopeRef.P.motifTitle(ctx, card);
      else if (scopeRef.D.titleTag) ctx.util.el(scopeRef.D.titleTag, scopeRef.D.titleClass, card, scopeRef.D.titleText ?? ctx.spec.title);
      if (scopeRef.D.note) ctx.util.el('div', 'fp-note', card, ctx.spec.note);
    };

    scopeRef.BASE.field = (ctx, card) => {
      const field = ctx.util.el('div', scopeRef.D.fieldClass, card);
      scopeRef.P.label(ctx, field);
      return field;
    };

    scopeRef.BASE.label = (ctx, field) => ctx.util.el('div', 'fp-label', field, ctx.spec.label);

    scopeRef.BASE.decorated = (ctx, card, field, wrap) => {
      scopeRef.P.motifFields(ctx, card);
      scopeRef.P.emailContent(ctx, card);
      if (scopeRef.D.optionCount) card.dataset.options = ctx.spec.options.length;
      scopeRef.P.travelExtra(ctx, card, field, wrap);
    };

    scopeRef.BASE.freeze = (ctx, card) => {
      if (scopeRef.D.compact && card.offsetHeight > ctx.size.height - 24) card.classList.add('compact');
      if (scopeRef.D.freeze) card.style.height = card.offsetHeight + 'px';
    };

    scopeRef.BASE.scale = (ctx, card) => {
      if (!scopeRef.D.scale) return;
      const height = scopeRef.D.scaleBeforeLayout ? card.offsetHeight : card.getBoundingClientRect().height;
      const ratio = Math.min(1, (ctx.size.height - scopeRef.D.scaleInset) / height);
      if (ratio < 1) {
        card.style.transformOrigin = 'top left';
        card.style.transform = `scale(${ratio})`;
      }
    };

    scopeRef.BASE.ready = (ctx) => {
      const reset = scopeRef.D.resetSelector && document.querySelector(scopeRef.D.resetSelector);
      if (reset)
        reset.onclick = () => {
          ctx.update({ ...ctx.model, value: null });
          scopeRef.st.show();
        };
    };

    scopeRef.BASE.rendered = () => {};

    scopeRef.BASE.locate = (t) => {
      const at = scopeRef.st.loc(t);
      if (!at) throw new Error(`choose-option/widgets cannot locate ${JSON.stringify(t)}`);
      return at;
    };

    if (scopeRef.V === 'listbox') {
      scopeRef.BASE.card = (ctx, wrap) => {
        const { util, rng, size } = ctx;
        const card = util.el('div', 'fp-card', wrap);
        card.dataset.role = 'form';
        card.style.setProperty('--fp-r', rng.int(8, 14) + 'px');
        card.style.setProperty('--fp-rc', rng.int(5, 9) + 'px');
        card.style.width = Math.min(size.width - 32, rng.int(400, 520)) + 'px';
        return card;
      };
      scopeRef.BASE.label = (ctx, field) =>
        ctx.util.el('div', 'fp-label' + (ctx.rng.bool(0.35) ? ' caps' : ''), field, ctx.spec.label);
    }

    scopeRef.BASE.place = (ctx, card) => {
      const { rng, size } = ctx;
      const w = card.offsetWidth,
        h = card.offsetHeight;
      const fx = rng.pick([0, 0.5, 0.5, 1, rng.float()]);
      const fy = rng.pick([0.5, 0.5, 0, 1, rng.float()]);
      card.style.left = Math.round(16 + fx * Math.max(0, size.width - w - 32)) + 'px';
      card.style.top = Math.round(12 + fy * Math.max(0, size.height - h - 24)) + 'px';
    };

  }
  env.template('choose-option/_widgets-frame', () => ({ install }));
})();
