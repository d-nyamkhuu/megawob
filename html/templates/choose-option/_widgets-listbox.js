/* choose-option/_widgets-listbox: widget template parts, installed in their original order.
 * All BASE keys remain design-overridable through the parent template.
 */
(function () {
  'use strict';
  function installListboxParts(scopeRef) {
    scopeRef.BASE.geometry = (ctx, controls, sampledRowH) => ({ rowH: sampledRowH, H: ctx.spec.rows * sampledRowH, border: 2 });

    scopeRef.BASE.list = (ctx, controls) => {
      const list = ctx.util.el('div', 'fp-list', controls.lb);
      list.dataset.role = 'listbox';
      list.style.height = controls.H + 'px';
      return list;
    };

    scopeRef.BASE.row = (ctx, controls, option, index) => {
      const row = ctx.util.el('div', 'fp-row' + (ctx.spec.multi ? '' : ' single'), controls.list);
      row.dataset.role = 'option';
      Object.assign(row.style, { height: controls.rowH + 'px', boxSizing: 'border-box' });
      if (ctx.spec.multi || scopeRef.D.rowBox) ctx.util.el('span', 'fp-box', row).innerHTML = ctx.spec.multi ? scopeRef.BOXTICK : '';
      scopeRef.P.rowDecoration(ctx, controls, row, option, index);
      ctx.util.el('span', '', row, option);
      return row;
    };

    scopeRef.BASE.rowDecoration = () => {};

    scopeRef.BASE.rowsDone = () => {};

    scopeRef.BASE.rail = (ctx, controls) => {
      const parent = scopeRef.D.railClass ? ctx.util.el('div', scopeRef.D.railClass, controls.lb) : controls.lb;
      const arrow = (text, label) => {
        const button = ctx.util.el('button', scopeRef.D.arrowClass, parent, text);
        button.type = 'button';
        button.setAttribute('aria-label', label);
        return button;
      };
      const up = scopeRef.D.arrows ? arrow(scopeRef.D.arrowUp, 'Scroll up') : null;
      const track = ctx.util.el('div', 'fp-track', parent);
      track.dataset.role = 'scrollbar';
      const thumb = ctx.util.el('div', 'fp-thumb', track);
      thumb.dataset.role = 'thumb';
      const down = scopeRef.D.arrows ? arrow(scopeRef.D.arrowDown, 'Scroll down') : null;
      return { track, thumb, up, down };
    };

    scopeRef.BASE.status = (ctx, controls) => ctx.util.el('div', 'fp-status', controls.field);

    scopeRef.BASE.prepare = (ctx, controls) => {
      if (!scopeRef.D.integralRows) return;
      const rowH = Math.max(1, Math.floor((controls.lb.clientHeight - 12) / ctx.spec.rows));
      controls.list.style.setProperty('--fp-row-height', rowH + 'px');
      controls.list.style.setProperty('--fp-list-height', ctx.spec.rows * rowH + 'px');
    };

    scopeRef.BASE.scrollOptions = (ctx, controls) => ({
      pad: scopeRef.D.scrollPad ?? Math.max(20, ctx.size.width * 0.061),
      minThumb: scopeRef.D.minThumb,
      onDrag: (on) => controls.thumb.classList.toggle('dragging', on),
    });

    scopeRef.BASE.mirror = (ctx, controls, index) => {
      const scroll = Math.round(index * 1000) / 1000;
      if (scroll !== scopeRef.st.ctx.model.scroll) scopeRef.set({ scroll });
    };

    scopeRef.BASE.toPhysical = (ctx, controls, index) => index;

    scopeRef.BASE.wheelScale = () => 1;

    scopeRef.BASE.wheel = (ctx, controls) => {
      controls.list.addEventListener(
        'wheel',
        (event) => {
          event.preventDefault();
          const k = event.deltaMode === 1 ? 32 : event.deltaMode === 2 ? controls.list.clientHeight : 1;
          controls.list.scrollTop += event.deltaY * k * scopeRef.P.wheelScale(ctx, controls);
          controls.lbx.refresh();
          controls.mirror(controls.lbx.scrollIndex());
        },
        { passive: false },
      );
    };

    scopeRef.BASE.arrowsReady = (ctx, controls) => {
      for (const [button, direction] of [
        [controls.up, -1],
        [controls.down, 1],
      ]) {
        if (!button) continue;
        if (scopeRef.D.stopArrows) button.addEventListener('pointerdown', (e) => e.stopPropagation());
        button.addEventListener('click', (e) => {
          if (scopeRef.D.stopArrows) e.stopPropagation();
          controls.list.scrollTop +=
            direction * (scopeRef.D.arrowStep === 'geometry' ? controls.rowH : controls.rows[ctx.spec.options[0]].offsetHeight);
          controls.lbx.refresh();
          controls.mirror(controls.lbx.scrollIndex());
        });
      }
    };

    scopeRef.BASE.controllerReady = () => {};

    scopeRef.BASE.values = (ctx, controls, model) =>
      controls.lbx.set(scopeRef.D.syncScroll ? { values: model.values, scroll: model.scroll || 0 } : { values: model.values });

    scopeRef.BASE.shown = () => {};

    scopeRef.BASE.measured = (ctx, controls) => {
      const px = controls.rows[ctx.spec.options[1]].offsetTop - controls.rows[ctx.spec.options[0]].offsetTop;
      if (px > 0 && px !== scopeRef.st.ctx.model.px) scopeRef.set({ px });
    };
  }

  function install(scopeRef) {
    installListboxParts(scopeRef);
    const buildListbox = (field, ctx) => {
      const { util, spec, rng } = ctx;
      const controls = { field, initialScroll: ctx.model.scroll || 0 };
      const sampledRowH = scopeRef.D.sampleRows ? rng.int(30, 34) : null;
      const lb = util.el('div', 'fp-lb', field);
      controls.lb = lb;
      Object.assign(controls, scopeRef.P.geometry(ctx, controls, sampledRowH));
      lb.style.height = controls.H + controls.border + 'px';
      controls.list = scopeRef.P.list(ctx, controls);
      const rows = {};
      controls.rows = rows;
      spec.options.forEach((option, index) => {
        rows[option] = scopeRef.P.row(ctx, controls, option, index);
      });
      rows[spec.options[spec.options.length - 1]].style.borderBottom = '0';
      scopeRef.P.rowsDone(ctx, controls);
      Object.assign(controls, scopeRef.P.rail(ctx, controls));
      controls.status = scopeRef.P.status(ctx, controls);
      scopeRef.P.prepare(ctx, controls);
      controls.mirror = (index) => scopeRef.P.mirror(ctx, controls, index);
      const lbx = env.ui.listbox(controls.list, {
        label: 'listbox',
        ...(scopeRef.D.keyboard ? { keyboard: true } : {}),
        multi: spec.multi,
        values: ctx.model.values,
        options: spec.options.map((option) => [option, rows[option]]),
        onChange(values) {
          scopeRef.set({ values });
          show();
        },
        onScroll: controls.mirror,
        scrollbar: { track: controls.track, thumb: controls.thumb, ...scopeRef.P.scrollOptions(ctx, controls) },
      });
      controls.lbx = lbx;
      controls.show = show;
      scopeRef.P.controllerReady(ctx, controls);
      scopeRef.P.wheel(ctx, controls);
      scopeRef.P.arrowsReady(ctx, controls);
      function show() {
        const m = scopeRef.st.ctx.model;
        scopeRef.P.values(ctx, controls, m);
        for (const option of spec.options) rows[option].classList.toggle('sel', m.values.includes(option));
        controls.status.replaceChildren();
        if (!m.values.length) controls.status.textContent = scopeRef.D.emptyText;
        else {
          controls.status.append(spec.multi ? `Selected (${m.values.length}): ` : 'Selected: ');
          util.el('b', '', controls.status, m.values.join(', '));
        }
        scopeRef.P.shown(ctx, controls, m);
      }
      lbx.set({ scroll: scopeRef.P.toPhysical(ctx, controls, ctx.model.scroll || 0) });
      scopeRef.st.layout = () => scopeRef.P.measured(ctx, controls);
      scopeRef.st.show = show;
      scopeRef.st.loc = (t) => {
        if (t.option !== undefined) return lbx.locateOption(t.option);
        if (t.thumb !== undefined) return lbx.locateThumb();
        if (t.scroll !== undefined) return lbx.locateThumbFor(scopeRef.P.toPhysical(ctx, controls, t.scroll));
        if (t.list !== undefined) return scopeRef.center(controls.list);
        return null;
      };
      Object.assign(scopeRef.els, { controls });
      scopeRef.P.ready(ctx, controls);
    };
    scopeRef.buildListbox = buildListbox;
  }
  env.template('choose-option/_widgets-listbox', () => ({ install }));
})();
