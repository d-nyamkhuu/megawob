/* fill-form/_frame: reference builders. scope is the live unit scope; reference.js retains all design hooks. */
(function () {
  'use strict';
function locateTarget(scope, t, widget) {
        const center = scope.st.ctx.util.center;
        const e = (id) => {
          const x = scope.st.el[id];
          if (!x) throw new Error(`fill-form/${widget}: no field ${id}`);
          return x;
        };
        if (t.tab !== undefined) return scope.st.tabs.locate(t.tab);
        if (t.field !== undefined) {
          const r = e(t.field).input.getBoundingClientRect();
          return [r.left + Math.min(r.width * 0.35, 110), r.top + r.height / 2];
        }
        if (t.clear !== undefined) return center(e(t.clear).clear);
        if (t.open !== undefined) return e(t.open).w.locateTrigger();
        if (t.option !== undefined) return e(t.option[0]).w.locateOption(t.option[1]);
        if (t.radio !== undefined) return e(t.radio[0]).w.locate(t.radio[1]);
        if (t.checkbox !== undefined) return e(t.checkbox).w.locate(t.checkbox);
        if (scope.st.extra && scope.st.extra[Object.keys(t)[0]]) return scope.st.extra[Object.keys(t)[0]](t);
        throw new Error(`fill-form/${widget} cannot locate ${JSON.stringify(t)}`);
      }

function stageBox(scope, ctx) {
        let { width, height } = ctx.size;
        let host = ctx.stage;
        if (width < 240 && ctx.stage.parentElement) {
          const p = ctx.stage.parentElement;
          width = p.clientWidth;
          for (const c of p.children) {
            if (c === ctx.stage) continue;
            const cs = getComputedStyle(c);
            width -= c.getBoundingClientRect().width + parseFloat(cs.marginLeft) + parseFloat(cs.marginRight);
          }
          width -= 8; // room for a page scrollbar
          host = ctx.util.el('div', '', ctx.stage);
          host.style.cssText = `width:${Math.floor(width)}px;display:flex;align-items:flex-start;justify-content:center;`;
        }
        if (height < 240) height = Math.max(240, window.innerHeight - ctx.stage.getBoundingClientRect().top);
        return { width, height, host };
      }

function buildFrame(scope, ctx, formBuilder) {
        scope.ensureStyle();
        scope.ensureStyle2();
        const { util, rng, spec } = ctx;
        const L = spec.layout;
        scope.st = { ctx, spec, el: {}, tabs: null, extra: {} };
        if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();

        const box = scope.stageBox(ctx);
        const availW = Math.min(box.width - 32, 1360);
        const tabsH = L.tabs ? 48 : 0;
        const availH = box.height - 24 - tabsH;
        const root = util.el('div', 'ff-root' + (L.docSide === 'right' ? ' doc-right' : '') + (L.tabs ? ' tabs' : '') + (L.long ? ' long' : ''), box.host);
        root.style.width = availW + 'px';
        root.style.margin = '12px 16px';
        root.style.setProperty('--ff-paper', rng.pick(scope.PAPERS));
        const ink = `hsl(${rng.int(0, 359)}, ${rng.int(35, 60)}%, ${rng.int(24, 36)}%)`;
        root.style.setProperty('--ff-ink', ink);
        scope.st.root = root;

        let docPane;
        let formPane;
        let tabbar = null;
        if (L.tabs) {
          tabbar = util.el('div', 'ff-tabs' + (rng.bool(0.35) ? ' pills' : ''), root);
          tabbar.setAttribute('role', 'tablist');
          const tDoc = util.el('button', 'ff-tab', tabbar, L.tabLabels[0]);
          const tForm = util.el('button', 'ff-tab', tabbar, L.tabLabels[1]);
          for (const t of [tDoc, tForm]) { t.type = 'button'; t.dataset.role = 'tab'; t.setAttribute('role', 'tab'); }
          if (rng.bool(0.3)) tabbar.append(tForm, tDoc); // the form tab first in some episodes
          const panels = util.el('div', 'ff-panels', root);
          docPane = util.el('div', 'ff-docpane ff-panel', panels);
          formPane = util.el('div', 'ff-formpane ff-panel', panels);
          docPane.style.width = formPane.style.width = '100%';
          scope.st.tabs = scope.env.ui.tabs([tDoc, tForm], [docPane, formPane], {
            keys: ['doc', 'form'],
            value: ctx.model.tab || 'form',
            show: (p, vis) => p.classList.toggle('off', !vis),
            onChange: (k) => scope.st.ctx.update({ ...scope.st.ctx.model, tab: k, seen: scope.st.ctx.model.seen || k === 'doc', open: null }),
          });
        } else {
          docPane = util.el('div', 'ff-docpane', root);
          formPane = util.el('div', 'ff-formpane', root);
        }
        docPane.dataset.role = 'document';
        const d = spec.doc;
        const receipt = d.kind === 'invoice' && d.style === 'receipt';
        const frac = receipt ? rng.float(0.34, 0.4) : rng.float(0.42, 0.5);
        const docW = L.tabs ? Math.min(availW, receipt ? 420 : rng.int(560, 760)) : Math.round(availW * frac);
        if (!L.tabs) docPane.style.width = docW + 'px';
        const docRng = rng.fork('doc');
        if (L.image) {
          const look = scope.imageLook(rng, d, receipt, ink);
          scope.renderImage(util, docPane, d, rng.fork('img'), receipt ? Math.min(docW, 380) : docW, L.long ? 2000 : availH, look);
        } else scope.renderDoc(util, docPane, d, docRng);
        if (L.tabs) {
          const inner = util.el('div', 'ff-forminner', formPane);
          inner.style.width = `${Math.min(availW, rng.int(520, 680))}px`;
          formBuilder(inner, rng.fork('form'));
        } else formBuilder(formPane, rng.fork('form'));

        // Base font: as large as fits (each panel within the stage height, no horizontal overflow). Long
        // forms keep a readable size and let the page scroll instead.
        let fs = L.long ? rng.pick([14.5, 15, 15.5]) : Math.max(12, Math.min(17.5, availH / 40));
        const show = (el, on) => { if (L.tabs) el.classList.toggle('off', !on); };
        const fitsPane = (el) => el.offsetHeight <= availH && el.scrollWidth <= el.clientWidth + 1;
        const fits = () => {
          if (L.long) return docPane.scrollWidth <= docPane.clientWidth + 1 && formPane.scrollWidth <= formPane.clientWidth + 1;
          return fitsPane(docPane) && fitsPane(formPane);
        };
        for (;;) {
          root.style.fontSize = fs + 'px';
          if (fits() || fs <= 9) break;
          fs -= 0.5;
        }
        if (L.tabs) show(docPane, (ctx.model.tab || 'form') === 'doc'), show(formPane, (ctx.model.tab || 'form') === 'form');
        return { anchors: L.tabs ? [root, tabbar] : [root, docPane, formPane] };
      }


  env.template('fill-form/_frame', () => ({ locateTarget, stageBox, buildFrame }));
})();
