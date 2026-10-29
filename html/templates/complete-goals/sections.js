/*
 * complete-goals/sections: scrollable embedded widgets in cards, ruled sections or bare blocks; one column
 * or a two-column grid. Scenarios: appearance, booking, event, filters, planner, profile. No scenario presets.
 * With design: {} each scenario reproduces design-complete-goals-<scenario>-01 (all six pilots).
 * Embedded widgets retain their own controls, models, rng forks and locate helpers. Their lazy traits and
 * uses are supplied here; a widget may override them along with the other widget keys as usual.
 *
 * Tokens (defaults):
 *   fontFamily (null): optional font on the page frame; null inherits the site's font.
 *   wrapPadding ('14px 0 28px'), headingGap ('12px'): frame padding and heading spacing.
 *   titleSize ('22px'), subtitleSize ('13.5px'), labelSize ('13px'), numberFontSize ('11.5px'): fonts.
 *   muted ('var(--muted)'), line ('var(--line)'), accent ('var(--accent)'), numberColor ('#fff'): colors.
 *   cardBackground ('color-mix(in srgb, var(--panel) 55%, var(--bg))'): filled card background.
 *   cardRadius ('12px'), cardPadding ('10px 12px 12px'): card shape and padding.
 *   ruleWidth ('2px'), rulePadding ('8px'): ruled section border and top padding.
 *   labelGap ('8px'), numberSize ('20px'): label spacing and numbered badge dimensions.
 *   styles (['cards', 'cards', 'ruled', 'bare']): sampled section styles, including their weights.
 *   subtitles (['All fields are saved when you finish.', '{n} sections', 'Changes apply immediately.', '']):
 *     sampled heading subtitles; {n} becomes the number of sections.
 *   gapRange ([14, 26]), columnRange ([700, 900]): sampled section gap and column width in px.
 *   gridMinWidth (1240): stage width at which the grid probability draw is made.
 *   heightRange ([420, 600]), heightInset (40): bounds and stage inset for the initial embedded box height.
 *   cardInset (26): width reserved for a card's padding and borders; ruled/bare reserve zero.
 *   minBoxHeight (140), contentMargin (40), growMargin (24): compact box minimum, compact margin and grow margin.
 * Parts (overrides are (base, S) => replacement; all calls go through P):
 *   styles() -> CSS: structural rules using the style tokens and the site's theme variables.
 *   begin(ctx): install CSS and capture listeners once per page, before drawing.
 *   touch(event): select the embedded task last touched, for ambiguous helper names.
 *   fit(ctx) -> { W, H0 }: measure stage room, including fixed end controls.
 *   look(ctx, W) -> look: sample style, grid, gap, colW, offset, head, sub and numbered, in reference order.
 *   attempts(ctx, look, W) -> [{ grid, colW }]: sampled layout then two wider single-column fallbacks.
 *   frame(ctx, look, at, W) -> el: size and position the flex/grid host.
 *   heading(ctx, host, look, at): optional title and subtitle.
 *   card(ctx, host, part, i, look) -> el: section shell; layout adds routing data attributes.
 *   label(ctx, card, part, i, look) -> el|null: optional section label, calling P.number.
 *   number(ctx, label, i): optional numbered badge (caller checks look.numbered).
 *   box(ctx, card, part, i) -> el: centered embedded widget host; layout adds its part role.
 *   boxWidth(ctx, look, at) -> px: column width less cardInset for cards.
 *   room(ctx, card, box, w) -> px: w, or less when the site's CSS lays the card out narrower than the box.
 *   subContext(ctx, entry, h) -> ctx: live sub-model, guarded updates, fork and aggregate reanchoring.
 *   draw(ctx, entry, h): clear/size its box and render the embedded widget using P.subContext.
 *   contentBox(box) -> bounds|null: union of visible descendants, ignoring full-size wrappers.
 *   inside(bounds) -> bool: whether that union fits within one px of the box.
 *   fitBox(ctx, entry, H0) -> bool: grow, compact, retry; record horizontal overflow.
 *   section(ctx, entry): after each embedded section is fitted (nothing).
 *   layout(ctx, look, at, W, H0) -> bool: build sections and fit embedded widgets; false on overflow.
 *   anchors() -> elements: every section card and its embedded anchors.
 *   note(ctx): mirror instruction-toast visibility and bind its close control.
 *   sync(ctx, model): synchronize embedded views or redraw and reanchor them.
 *   rendered(ctx): after the final layout and note binding (nothing).
 *   locate(target, envRef) -> [x, y]: note close control or embedded widget target.
 * S.st/ctx/spec/look/geo read live page state; S.geo is settable; S.D/P expose resolved tokens and parts.
 * An entry contains i, part, fam, widget, card, box, w, h, view, anchors, overflow and draw(h).
 * Preserve every rng draw of replaced parts, including short-circuited draws and repeated embedded renders.
 * Extra decoration randomness must use ctx.rng.fork(label).
 */
(function () {
  'use strict';

  const USES = [['type-text', 'fields'], ['choose-option', 'widgets'], ['set-date', 'calendar'], ['set-slider', 'classic'], ['pick-color', 'picker']];
  const TOKENS = {
    fontFamily: null,
    wrapPadding: '14px 0 28px',
    headingGap: '12px',
    titleSize: '22px',
    subtitleSize: '13.5px',
    labelSize: '13px',
    numberFontSize: '11.5px',
    muted: 'var(--muted)',
    line: 'var(--line)',
    accent: 'var(--accent)',
    numberColor: '#fff',
    cardBackground: 'color-mix(in srgb, var(--panel) 55%, var(--bg))',
    cardRadius: '12px',
    cardPadding: '10px 12px 12px',
    ruleWidth: '2px',
    rulePadding: '8px',
    labelGap: '8px',
    numberSize: '20px',
    styles: ['cards', 'cards', 'ruled', 'bare'],
    subtitles: ['All fields are saved when you finish.', '{n} sections', 'Changes apply immediately.', ''],
    gapRange: [14, 26],
    columnRange: [700, 900],
    gridMinWidth: 1240,
    heightRange: [420, 600],
    heightInset: 40,
    cardInset: 26,
    minBoxHeight: 140,
    contentMargin: 40,
    growMargin: 24,
  };

  env.template('complete-goals/sections', (design, def) => {
    let D, P;
    let st = null;
    let ctxRef, look, geo;
    let listening = false;
    const BASE = {};
    const S = {
      get st() { return st; },
      get ctx() { return ctxRef; },
      get spec() { return ctxRef && ctxRef.spec; },
      get look() { return look; },
      get geo() { return geo; },
      set geo(g) { geo = g; },
      get D() { return D; },
      get P() { return P; },
    };

    BASE.styles = () => `
  .cp-wrap { display: flex; flex-direction: column; gap: var(--cp-gap); padding: ${D.wrapPadding}; flex: none; }
  .cp-wrap.grid { display: grid; grid-template-columns: repeat(2, var(--cp-colw)); align-items: start; }
  .cp-head { display: flex; align-items: baseline; gap: ${D.headingGap}; margin: 0 0 2px; }
  .cp-head h1 { margin: 0; font-size: ${D.titleSize}; font-weight: 750; letter-spacing: -.01em; }
  .cp-head span { color: ${D.muted}; font-size: ${D.subtitleSize}; }
  .cp-card { min-width: 0; }
  .cp-card.cards { border: 1px solid ${D.line}; border-radius: ${D.cardRadius}; background: ${D.cardBackground}; padding: ${D.cardPadding}; }
  .cp-card.ruled { border-top: ${D.ruleWidth} solid ${D.line}; padding-top: ${D.rulePadding}; }
  .cp-label { display: flex; align-items: center; gap: ${D.labelGap}; font-size: ${D.labelSize}; font-weight: 700; color: ${D.muted};
    text-transform: uppercase; letter-spacing: .06em; margin: 0 2px 6px; }
  .cp-label .n { display: inline-flex; width: ${D.numberSize}; height: ${D.numberSize}; border-radius: 50%; align-items: center; justify-content: center;
    background: ${D.accent}; color: ${D.numberColor}; font-size: ${D.numberFontSize}; letter-spacing: 0; }
  .cp-box { position: relative; display: flex; align-items: center; justify-content: center; }
  /* Site workaround: long unbreakable values (emails) in the instruction panel overflow it and the page. */
  .ref-panel-text, .ref-note-text, .ref-instruction { overflow-wrap: anywhere; }
  `;

    BASE.begin = () => {
      if (!document.getElementById('cp-style')) {
        const s = document.createElement('style');
        s.id = 'cp-style';
        s.textContent = P.styles();
        document.head.append(s);
      }
      if (listening) return;
      for (const type of ['pointerdown', 'pointerup', 'click', 'input', 'change', 'keydown', 'focusin', 'wheel']) {
        window.addEventListener(type, (e) => P.touch(e), { capture: true, passive: true });
      }
      listening = true;
    };
    BASE.touch = (e) => {
      const el = e.target && e.target.closest ? e.target.closest('[data-cfam]') : null;
      const fam = env.taskDef;
      if (el && fam && fam.name === 'complete-goals' && fam.helpers.setActivePart) fam.helpers.setActivePart(el.dataset.cfam);
    };
    BASE.fit = (ctx) => {
      const { stage } = ctx;
      // A scrollable stage shrinks to its content; measure the room its row leaves for it.
      let W = ctx.size.width;
      const sr = stage.getBoundingClientRect();
      if (W < 240 && stage.parentElement) {
        const p = stage.parentElement;
        W = p.clientWidth;
        for (const c of p.children) if (c !== stage) W -= c.getBoundingClientRect().width + 32;
      }
      // Keep clear of an end control pinned to the bottom-right corner.
      for (const el of document.querySelectorAll('[data-role=submit]')) {
        if (getComputedStyle(el).position !== 'fixed') continue;
        W = Math.min(W, el.getBoundingClientRect().left - sr.left - 8);
      }
      W = Math.floor(W);
      const H0 = Math.max(D.heightRange[0], Math.min(D.heightRange[1], Math.floor(ctx.size.height) - D.heightInset));
      return { W, H0 };
    };
    BASE.look = (ctx, W) => {
      const { rng, spec } = ctx;
      const n = spec.parts.length;
      return {
        style: rng.pick(D.styles),
        grid: n >= 2 && W >= D.gridMinWidth && rng.bool(0.5),
        gap: rng.int(...D.gapRange),
        colW: rng.int(...D.columnRange),
        offset: rng.float(0, 1),
        head: rng.bool(0.6),
        sub: rng.pick(D.subtitles.map((text) => text.replace('{n}', String(n)))),
        numbered: rng.bool(0.5),
      };
    };
    BASE.attempts = (ctx, look, W) => [
      { grid: look.grid, colW: look.grid ? Math.min(680, Math.floor((W - 48 - look.gap) / 2)) : Math.min(W - 40, look.colW) },
      { grid: false, colW: Math.min(W - 40, Math.max(look.colW, 860)) },
      { grid: false, colW: W - 32 },
    ];
    BASE.frame = (ctx, look, at, W) => {
      const { grid, colW } = at;
      const wrapW = grid ? 2 * colW + look.gap : colW;
      const host = ctx.util.el('div', 'cp-wrap' + (grid ? ' grid' : ''), ctx.stage);
      host.style.setProperty('--cp-gap', `${look.gap}px`);
      host.style.setProperty('--cp-colw', `${colW}px`);
      host.style.width = `${wrapW}px`;
      host.style.marginLeft = `${Math.round(16 + Math.max(0, W - wrapW - 40) * look.offset)}px`;
      host.style.marginRight = '16px';
      if (D.fontFamily) host.style.fontFamily = D.fontFamily;
      return host;
    };
    BASE.heading = (ctx, host, look, at) => {
      if (!look.head) return;
      const head = ctx.util.el('div', 'cp-head', host);
      if (at.grid) head.style.gridColumn = '1 / -1';
      ctx.util.el('h1', '', head, ctx.spec.title);
      ctx.util.el('span', '', head, look.sub);
    };
    BASE.card = (ctx, host, part, i, look) => ctx.util.el('section', `cp-card ${look.style}`, host);
    BASE.label = (ctx, card, part, i, look) => {
      if (look.style === 'bare' && !look.numbered) return null;
      const lab = ctx.util.el('div', 'cp-label', card);
      if (look.numbered) P.number(ctx, lab, i);
      ctx.util.el('span', '', lab, part.label);
      return lab;
    };
    BASE.number = (ctx, lab, i) => { ctx.util.el('span', 'n', lab, String(i + 1)); };
    BASE.box = (ctx, card) => ctx.util.el('div', 'cp-box', card);
    BASE.boxWidth = (ctx, look, at) => at.colW - (look.style === 'cards' ? D.cardInset : 0);
    // A site's CSS may place the cards in its own grid or side column, narrower than the template's column: the
    // embedded box must not overflow its card (it would spill over the next card or out of the stage).
    BASE.room = (ctx, card, box, w) => {
      const cr = card.getBoundingClientRect();
      if (cr.width < 1) return w;
      const cs = getComputedStyle(card);
      const right = cr.right - (parseFloat(cs.borderRightWidth) || 0) - (parseFloat(cs.paddingRight) || 0);
      const room = Math.floor(right - box.getBoundingClientRect().left);
      return room > 0 && room < w ? room : w;
    };

    BASE.subContext = (ctx, entry, h) => ({
      spec: entry.part.spec,
      // Removed inputs may blur during reset, when ctx.model already belongs to the next episode.
      get model() {
        const m = ctx.model && ctx.model.parts && ctx.model.parts[entry.i];
        if (m !== undefined) entry.lastSub = m;
        return entry.lastSub;
      },
      rng: ctx.rng.fork(`part${entry.i}`),
      stage: entry.box,
      size: { width: entry.w, height: h },
      opts: { ...ctx.opts, scenario: entry.part.scenario },
      update: (m) => {
        const cur = ctx.model;
        if (!cur.parts || entry.i >= cur.parts.length || cur.parts[entry.i] === m) return;
        ctx.update({ ...cur, parts: cur.parts.map((x, j) => (j === entry.i ? m : x)) });
      },
      log: ctx.log,
      flag: ctx.flag,
      reanchor: (els) => {
        if (els && els.length) entry.anchors = els;
        ctx.reanchor(P.anchors());
      },
      clock: ctx.clock,
      episode: ctx.episode,
      util: ctx.util,
      content: ctx.content,
    });
    BASE.draw = (ctx, entry, h) => {
      entry.box.replaceChildren();
      entry.box.style.width = `${entry.w}px`;
      entry.box.style.height = `${h}px`;
      entry.h = h;
      env.taskDef.helpers.setActivePart(entry.part.task);
      entry.view = entry.widget.render(P.subContext(ctx, entry, h)) || {};
      entry.anchors = entry.view.anchors && entry.view.anchors.length ? entry.view.anchors : [];
    };
    // Union of drawn content (box-relative), ignoring wrappers that merely fill the box.
    BASE.contentBox = (box) => {
      const b = box.getBoundingClientRect();
      let top = Infinity;
      let bottom = -Infinity;
      let left = Infinity;
      let right = -Infinity;
      for (const el of box.querySelectorAll('*')) {
        const r = el.getBoundingClientRect();
        if (r.width < 1 || r.height < 1) continue;
        if (Math.abs(r.width - b.width) < 2 && Math.abs(r.height - b.height) < 2) continue;
        top = Math.min(top, r.top);
        bottom = Math.max(bottom, r.bottom);
        left = Math.min(left, r.left);
        right = Math.max(right, r.right);
      }
      if (top === Infinity) return null;
      return { top: top - b.top, bottom: bottom - b.top, left: left - b.left, right: right - b.left, w: b.width, h: b.height };
    };
    BASE.inside = (cb) => cb && cb.top >= -1 && cb.left >= -1 && cb.bottom <= cb.h + 1 && cb.right <= cb.w + 1;
    BASE.fitBox = (ctx, entry, H0) => {
      entry.draw(H0);
      let cb = P.contentBox(entry.box);
      // Grow tall out-of-range content so it cannot overlap the next section.
      for (let k = 0; k < 3 && cb && cb.bottom > cb.h + 1 && cb.bottom < 2400; k++) {
        entry.draw(Math.ceil(cb.bottom) + D.growMargin);
        cb = P.contentBox(entry.box);
      }
      if (cb) {
        const want = Math.max(D.minBoxHeight, Math.ceil(cb.bottom - cb.top) + D.contentMargin);
        if (want < H0 - 24 && cb.bottom <= cb.h + 1) {
          entry.draw(want);
          if (!P.inside(P.contentBox(entry.box))) entry.draw(H0);
        }
        const cb2 = P.contentBox(entry.box);
        if (cb2 && (cb2.left < -1 || cb2.right > cb2.w + 1)) entry.overflow = true;
      }
      return !entry.overflow;
    };
    BASE.section = () => {};
    BASE.layout = (ctx, look, at, W, H0) => {
      const host = P.frame(ctx, look, at, W);
      P.heading(ctx, host, look, at);
      st = { ctx, parts: [], host };
      let ok = true;
      ctx.spec.parts.forEach((part, i) => {
        const subFam = env.taskOf(part.task);
        const widget = env.widgetOf(part.task, part.widget);
        if (!subFam || !widget) throw new Error(`composition: missing ${part.task} or its skin ${part.widget}`);
        const card = P.card(ctx, host, part, i, look);
        card.dataset.cfam = part.task;
        card.dataset.cpart = String(i);
        P.label(ctx, card, part, i, look);
        const box = P.box(ctx, card, part, i);
        box.dataset.role = 'part';
        box.style.width = `${P.boxWidth(ctx, look, at)}px`;
        const w = P.room(ctx, card, box, P.boxWidth(ctx, look, at));
        const entry = { i, part, fam: subFam, widget, card, box, w, h: H0, view: null, anchors: [], overflow: false, lastSub: null };
        st.parts.push(entry);
        entry.draw = (h) => P.draw(ctx, entry, h);
        if (!P.fitBox(ctx, entry, H0)) ok = false;
        P.section(ctx, entry);
      });
      // Cards sized by their content or by the cards drawn after them can end up narrower than their box: redraw
      // those boxes at the room their card has.
      for (let pass = 0; pass < 2; pass++) {
        const tight = st.parts.filter((entry) => P.room(ctx, entry.card, entry.box, entry.w) < entry.w);
        if (!tight.length) break;
        for (const entry of tight) {
          entry.w = P.room(ctx, entry.card, entry.box, entry.w);
          entry.overflow = false;
          P.fitBox(ctx, entry, H0);
        }
        ok = st.parts.every((entry) => !entry.overflow);
      }
      return ok;
    };
    BASE.anchors = () => st.parts.flatMap((entry) => [entry.card, ...(entry.anchors || [])]);
    BASE.note = (ctx) => {
      // The plan closes the site's instruction toast before interacting with the embedded widgets.
      const note = document.querySelector('.ref-note');
      const noteOpen = !!(note && getComputedStyle(note).visibility !== 'hidden' && note.getBoundingClientRect().height > 0);
      if (!!ctx.model.note !== noteOpen) ctx.update({ ...ctx.model, note: noteOpen });
      st.noteX = note ? note.querySelector('.ref-note-x') : null;
      if (st.noteX && !st.noteX.dataset.cpBound) {
        st.noteX.dataset.cpBound = '1';
        st.noteX.addEventListener('click', () => { if (ctx.model.note) ctx.update({ ...ctx.model, note: false }); });
      }
    };
    BASE.sync = (ctx, model) => {
      const fam = env.taskDef;
      for (const entry of st.parts) {
        fam.helpers.setActivePart(entry.part.task);
        if (entry.view && typeof entry.view.sync === 'function') entry.view.sync(model.parts[entry.i]);
        else {
          entry.draw(entry.h);
          ctx.reanchor(P.anchors());
        }
      }
      fam.helpers.setActivePart(null);
    };
    BASE.rendered = () => {};
    BASE.locate = (t, envRef) => {
      if (!st) throw new Error('composition/booking not rendered');
      if (t.note) {
        if (!st.noteX) throw new Error('composition/booking: no instruction note');
        return env.util.center(st.noteX);
      }
      const entry = st.parts[t.part];
      if (!entry) throw new Error(`complete-goals/booking: no part ${JSON.stringify(t)}`);
      env.taskDef.helpers.setActivePart(entry.part.task);
      return entry.widget.locate(t.t, envRef);
    };

    ({ D, P } = env.templateDesign('complete-goals/sections', design, def, { tokens: TOKENS, base: BASE, state: S }));
    return {
      scrollable: true,
      uses: USES,
      // Read lazily: the embedded widget files load after the composition template is instantiated.
      traits: {
        get parts() {
          const out = {};
          for (const [f, name] of USES) {
            const s = env.widgetOf(f, name);
            if (s) out[f] = { widget: name, scenarios: s.scenarios || null, traits: s.traits || {} };
          }
          return out;
        },
      },
      render(ctx) {
        ctxRef = ctx;
        P.begin(ctx);
        geo = P.fit(ctx);
        const { W, H0 } = geo;
        look = P.look(ctx, W);
        let ok = false;
        for (const at of P.attempts(ctx, look, W)) {
          ctx.stage.replaceChildren();
          ok = P.layout(ctx, look, at, W, H0);
          if (ok) break;
        }
        if (!ok) ctx.log('composition-overflow', { parts: st.parts.filter((entry) => entry.overflow).map((entry) => entry.part.task) });
        env.taskDef.helpers.setActivePart(null);
        P.note(ctx);
        P.rendered(ctx);
        return { anchors: P.anchors(), sync: (model) => P.sync(ctx, model) };
      },
      locate(t, envRef) { return P.locate(t, envRef); },
    };
  });
})();
