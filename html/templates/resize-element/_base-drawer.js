/* resize-element/_base-drawer: the reference drawer scope and its replaceable units.
 * Called once by resize-element/base, in the original registration order; event targets, attachment order and capture flags are preserved.
 */
(function () {
  'use strict';
  env.template('resize-element/_base-drawer', () => ({
    register({ env, scriptOf, __parts, __has, setScope }) {
      const __scope = {
        get env() { return env; },
        get scriptOf() { return scriptOf; },
        get CSS() { return CSS; },
        get KEYS() { return KEYS; },
        get ensureStyle() { return ensureStyle; },
        get pane() { return pane; }, set pane(v) { pane = v; },
        get grip() { return grip; }, set grip(v) { grip = v; },
        get rz() { return rz; }, set rz(v) { rz = v; },
      };
      for (const k of Object.keys(__parts)) if (k.startsWith('+1.')) {
        let v; let built = false;
        Object.defineProperty(__scope, k.slice(3), {
          get: () => (built ? v : (built = true, v = __parts[k](undefined, __scope))),
          set: (x) => { built = true; v = x; },
        });
      }
      setScope(__scope);

      const CSS = __has('CSS@1') ? __parts['CSS@1'](undefined, __scope) : (env.templateLib('resize-element/_styles').DRAWER_CSS);
      const KEYS = __has('KEYS@1') ? __parts['KEYS@1'](undefined, __scope) : (new Set(['ArrowRight', 'ArrowUp', 'ArrowLeft', 'ArrowDown']));

      let pane = __has('pane') ? __parts['pane'](undefined, __scope) : undefined;
      let grip = __has('grip') ? __parts['grip'](undefined, __scope) : undefined;
      let rz = __has('rz') ? __parts['rz'](undefined, __scope) : undefined;

      const ensureStyle = __has('ensureStyle@1') ? __parts['ensureStyle@1'](undefined, __scope) : { ensureStyle: () => env.util.css('dw-style', CSS) }.ensureStyle;

      env.widget({
        task: 'resize-element',
        site: 'base',
        name: 'drawer',
        split: 'train',
        scenarios: ['numeric', 'ghost'],
        traits: { grips: ['sw'] },

        render(ctx) {
          ensureStyle();
          const { spec, rng, util, content, size: stage } = ctx;
          const pad = 56; // the line-number gutter stays clear on the left
          const margin = 12;
          const origin = { x: rng.int(14, 40), y: rng.int(30, 44) }; // offset from the pane's top-right corner
          const lim = {
            min: { ...spec.min },
            max: {
              w: Math.min(spec.max.w, Math.floor(stage.width - 2 * margin - origin.x - pad)),
              h: Math.min(spec.max.h, Math.floor(stage.height - 2 * margin - origin.y - 14)),
            },
          };
          const W = origin.x + lim.max.w + pad;
          const H = origin.y + lim.max.h + 14;
          pane = util.el('div', 'dw-pane', ctx.stage);
          pane.dataset.role = 'workspace';
          const free = (n) => Math.max(margin, Math.floor(n / 2) + rng.int(-Math.min(160, Math.max(0, Math.floor(n / 2) - margin)), Math.min(160, Math.max(0, Math.floor(n / 2) - margin))));
          Object.assign(pane.style, {
            width: W + 2 + 'px',
            height: H + 2 + 'px',
            left: free(stage.width - W - 2) + 'px',
            top: free(stage.height - H - 2) + 'px',
          });

          // Decorative code behind the box.
          const code = util.el('div', 'dw-code', pane);
          const words = content.WORDS;
          for (let i = 1; i * 19.5 < H; i++) {
            const line = util.el('div', '', code);
            util.el('b', '', line, String(i));
            const kind = rng.int(0, 3);
            if (kind === 0) util.el('u', '', line, 'const ');
            line.append(rng.pick(words) + (kind === 1 ? '(' : ' = '));
            util.el('i', '', line, `'${rng.pick(words)}'`);
            if (kind === 1) line.append(');');
          }

          const label = util.el('div', 'dw-label', pane, `${spec.title}.txt`);
          Object.assign(label.style, { right: origin.x + 2 + 'px', top: origin.y - 20 + 'px' });

          const box = util.el('div', 'dw-box', pane);
          box.dataset.role = 'panel';
          Object.assign(box.style, { right: origin.x + 'px', top: origin.y + 'px' });
          for (let i = 0, n = rng.int(8, 22); i < n; i++) {
            const k = rng.int(2, 7);
            util.el('p', '', box, Array.from({ length: k }, () => rng.pick(words)).join(' '));
          }
          const readout = util.el('div', 'dw-readout', box);
          readout.dataset.role = 'readout';
          readout.hidden = !spec.readout;
          grip = util.el('div', 'dw-grip', box);
          grip.dataset.role = 'handle-sw';

          if (spec.scenario === 'ghost') {
            const ghost = util.el('div', 'dw-ghost', pane);
            ghost.dataset.role = 'target';
            Object.assign(ghost.style, {
              right: origin.x + 'px', top: origin.y + 'px', width: spec.target.w + 'px', height: spec.target.h + 'px',
            });
          }

          rz = env.ui.resizable(box, {
            handles: { sw: grip },
            size: { w: ctx.model.w, h: ctx.model.h },
            anchor: 'ne',
            min: lim.min,
            max: lim.max,
            // CSS right/top pin the corner, so only the size is written.
            place(el, r) {
              el.style.width = r.w + 'px';
              el.style.height = r.h + 'px';
              readout.textContent = `${r.w}×${r.h}`;
            },
            onStart: () => grip.classList.add('active'),
            onInput: (s) => ctx.update({ ...ctx.model, ...s }),
            onChange: (s) => {
              grip.classList.remove('active');
              ctx.update({ ...ctx.model, ...s });
            },
          });
          if (spec.keys) {
            grip.tabIndex = 0;
            grip.addEventListener('pointerdown', () => grip.focus({ preventScroll: true }));
            grip.addEventListener('keydown', (e) => {
              if (!KEYS.has(e.key)) return;
              e.preventDefault();
              const m = env.taskDef.helpers.keyApply(spec, ctx.model, e.key, e.shiftKey);
              const s = { w: Math.max(lim.min.w, Math.min(lim.max.w, m.w)), h: Math.max(lim.min.h, Math.min(lim.max.h, m.h)) };
              rz.set(s);
              ctx.update({ ...ctx.model, ...s });
            });
            grip.addEventListener('focus', () => { grip.classList.add('focused'); if (!ctx.model.focus) ctx.update({ ...ctx.model, focus: true }); });
            grip.addEventListener('blur', () => { grip.classList.remove('focused'); if (ctx.model.focus) ctx.update({ ...ctx.model, focus: false }); });
          }
          return { anchors: [pane], sync: (m) => rz.set({ w: m.w, h: m.h }) };
        },

        // The task samples the 'sw' grip for this widget (traits.grips); every handle name maps to it.
        locate(t) {
          if (t.handle === undefined) throw new Error(`resize-element/drawer cannot locate ${JSON.stringify(t)}`);
          return rz.locateHandle('sw', t.size);
        },
      });
    },
  }), { uses: ['resize-element/_styles'] });
})();
