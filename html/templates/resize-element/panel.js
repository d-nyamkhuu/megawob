/*
 * templates / resize / panel: shared live panel widget of resize/L1 (24 design-* sites).
 * Derived from design-resize-element-numeric-05; the unpreset TOKENS/BASE reproduce that medoid.
 * Scenarios: numeric and ghost in the lineage; relative, textarea, column and split remain live paths from
 * the medoid. The copied drawer registration was filtered out in every member and is omitted here.
 * With design {} and the original identity/traits, the numeric preset reproduces
 * design-resize-element-numeric-01; the ghost preset reproduces design-resize-element-ghost-01.
 * numeric-05 explicitly opts out of the numeric preset to reproduce the medoid.
 *
 * Audit of all 23 member diffs (counts out of 12 per scenario; identities/traits stay in the design file):
 * numeric: 10 retain sampled origins, 05 zeros both axes, 06 zeros only numeric, 11 adjusts y.
 *   6 render message rows (01/02/04/07/08/10), 4 property sheets (03/06/09/12), 05 is empty,
 *   11 has a note. Message data is a token; different sheet layouts replace body, with drawn/paintWell
 *   hooks for their live fields. Title changes: 07/09/10/11; handle decoration: 09/12.
 *   11 have a well (02/10 inside the panel); 6 use detailed current dimensions; 8 say 'Target size:';
 *   5 append the detailed tolerance text (01/03/04/06/08). 9 share the resize hint; 05/07 differ,
 *   04/12 replace the instruction subtext. Only 05 updates the checklist. 11 share compact message CSS;
 *   03 changes compact thresholds, 02/06/08/10 add narrow modes, 11 has its own readout/compaction.
 *   01/06 share bounds fit and aligned placement. Other fits/placements are site-specific small parts.
 *   02/07 use max-bounds rects; 02 scales each axis separately, 10 fits the visible stage and caps limits.
 *   01 anchors a bounds marker; 07/10 inset the oracle hit; 02/03/04/06/08/09/11/12 add decorations/fields.
 * ghost: 11 zero the ghost origin, compact the chat, and change outline z-order (all except 11).
 *   8 use width/480 frame scaling; 7 use the same capped workspace fit (01/02/04/06/08/09/12).
 *   5 share the chat/composer tree (01/04/05/07/10); 6 share the ellipsis icon (01/03/04/05/07/08).
 *   Body layouts for 02/03/06/08/09/11/12 replace body, with small draw hooks for fields and fitting.
 *   01/04/10 share the 4.5% top inset; 05/07/08/12 dock at zero; other placements are one-offs.
 *   05 reserves fixed readable frame with an affine projection; 04 uses cumulative util.drag deltas;
 *   02 adds selection marks/pointer and an SVG outline, 08 adds a handle pointer, 10 insets oracle hits,
 *   11 retains sampled placement/insets. 03 updates briefing/source fields. 05 adds an outline hint.
 *   Every repeated variation has a token or a small replaceable part; no site needs to copy renderPanel.
 *
 * Numeric preset: sampled origin, message rows, detailed feedback, resize hint, no checklist, bounds fit,
 * aligned placement; its anchors part supplies 01's bounds marker so the empty design is an exact real site.
 * Ghost preset: zero ghost origin, ellipsis/chat/composer, workspace fit, responsive chat frame/compaction,
 * dynamic ghost layering and 4.5% top inset; no numeric well, briefing, checklist or --rz-scale.
 * Other scenarios use the raw defaults. In a multi-scenario widget the kit applies no scenario preset.
 *
 * Tokens (raw defaults; presets above override these):
 *   origin ('zero')          'zero', 'sampled', 'ghost' (zero only for ghost); consumes both origin draws.
 *   body ('empty')           'empty', 'messages', 'chat'; other content replaces the body part.
 *   messages ([])            rows [author, text, time?]; numeric and chat trees share this data token.
 *   titleIcon ('dots')       three i elements, or 'chat' for an ellipsis span.
 *   titleClass ('')          class of the title's text span.
 *   titleControls (null)     optional rz-ctl text after the title.
 *   composer (false)         append the inert chat composer/send button after the body.
 *   messageTime ('clock')    clock timestamps, or 'archive' for the 1996 chat dates.
 *   bodyScroll (false)       add the decorative rz-scroll after the body is created.
 *   well (true)              create the numeric feedback well.
 *   wellInside (false)       append the well to the panel instead of prepending it to the stage.
 *   currentFormat ('plain')  plain or 'detailed' feedback dimensions.
 *   currentTag ('span')      element for current dimensions (02 uses strong).
 *   targetLabel ('Target:')  label preceding target dimensions.
 *   targetFormat ('plain')   plain or 'detailed' target dimensions.
 *   targetTolerance (false)  append the original two spaces and '(±6 px)' to target feedback.
 *   checklist (true)         update .size-check with the seeded title and target dimensions.
 *   hint ('target')          original target-size hint, 'resize' for numeric's usual hint, null to skip.
 *   fit ('panel')            medoid's panel/workspace fit; 'bounds' or 'workspace' for shared fits.
 *   zoomMax (1.2)            upper bound on the sampled scene's fixed scale.
 *   fitPadX (10)             available-width deduction in the workspace fit.
 *   fitPadY (28)             available-height deduction in the workspace fit.
 *   compact (true)           apply the numeric message compaction part before writing the size.
 *   compactChat (false)      toggle compact-chat using displayed height and chromeUnit.
 *   compactHeight (300)      compact-chat height threshold in frame units.
 *   chromeWidth (480)        stage width yielding a chromeUnit of 1.
 *   chromeMin (0)            lower bound on chromeUnit (maximum remains 1).
 *   ghostLayer (false)       keep a smaller ghost above the panel, a larger ghost behind it.
 *   transform (true)         scale the wrapper; false for direct per-axis drawing.
 *   scaleVar (true)          write --rz-scale on the wrapper.
 *   chatUnit (false)         write --chat-unit = chromeUnit / zoom on the wrapper.
 *   extraScaleVar (null)     optional extra wrapper CSS property containing String(zoom).
 *   rectFrame ('workspace')  use sampled workspace geometry, or 'max' for visible maximum bounds.
 *   placement ('fixed')      fixed token coordinates, 'aligned' sampled-origin compensation,
 *                           'ghost' for fixed placement only in ghost, or 'sampled' to retain placeIn.
 *   left (0)                 fixed wrapper x in pixels.
 *   top (18)                 fixed wrapper y in pixels before the fractional inset.
 *   topFraction (0)          add Math.round(stage height * topFraction) to the fixed y.
 *   wellPosition (true)      position feedback below the current rectangle after draw and placement.
 *
 * Parts: design.parts.<name> = (base, S) => replacement. All calls go through P, including nested calls.
 * S exposes live ctx/spec, D/P, frame, and POINTS/movesX/movesY/side. frame is replaced on each panel render:
 *   ax/ay, ruler, pad/margin, o, ref/refW/refH, lim, W/H; optional areaW/areaH; wrap/area/refEl, box/title/body,
 *   well/readout/ghost, handles, zoom/chromeUnit/current; optional dragX/dragY for independent delta scales.
 * A part can add its own fields. No DOM work happens in the factory. Preserve each original rng draw-shape/order;
 * additional randomness belongs on a fork. The shared paths retain the medoid's other live scenarios.
 *
 *   ensureStyle()              -> void; install the unchanged structural CSS once.
 *   placeIn(ctx, el, rng, pad=12) -> void; seeded placement clear of floating end controls (four draws).
 *   keyboard(ctx, el, apply)    -> void; original focus and task keyApply handling.
 *   lorem(ctx, rng, n)          -> strings[]; original content bank draws for textarea/split.
 *   origin(ctx, ruler)         -> {x,y}; two ordered rng.int draws, then token-based normalization.
 *   geometry(ctx)              -> void; default noop before DOM, can change frame dimensions/limits.
 *   displaySize(size)          -> {w,h}; identity projection, used by boxSize/rectOf/chat compaction.
 *   rectOf(size)               -> {x,y,w,h}; anchored rectangle in workspace units.
 *   pixelRect(size)            -> rect; rectOf by default, separate direct axis scaling can replace it.
 *   boxPosition(ctx)           -> void; pin the box with original right/left and bottom/top offsets.
 *   icon(ctx, dots)            -> void; build token-selected title dots/ellipsis.
 *   title(ctx)                 -> element; create title, icon, text and optional controls.
 *   messageTime(i, row)        -> string; shared chat timestamp rendering.
 *   body(ctx)                  -> element; create body, token-selected content and composer.
 *   composer(ctx)              -> void; optional inert send UI (logs only).
 *   well(ctx)                  -> element|null; create/attach feedback in the selected parent.
 *   briefing(ctx)              -> void; update subtext and first instruction step from spec.
 *   readout(ctx)               -> element; original size caption, placement and visibility.
 *   ghost(ctx)                 -> element|null; anchored target outline for ghost, then ghostContent.
 *   ghostContent(ctx, ghost)   -> void; default noop for SVG outlines/hints.
 *   rulers(ctx)                -> void; unchanged pixel rulers when no readout and not ghost.
 *   handle(ctx, el, name)      -> void; default noop after each seeded handle is made.
 *   handlesReady(ctx)          -> void; default noop for selection marks and cursor decoration.
 *   checklist(ctx)             -> void; optional target checklist update.
 *   sizeText(size, format)     -> string; plain/detailed dimensions without tolerance suffix.
 *   paintWell(ctx, size)       -> void; rewrite numeric feedback (also called before measuring fit).
 *   fit(ctx)                   -> number; fixed scene zoom; may prepare independent axis factors/styles.
 *   chromeUnit(ctx)            -> number; bounded stage-width scale for readable frame.
 *   scaled(ctx)                -> void; set transform and token-selected wrapper CSS properties.
 *   compact(ctx, size)         -> void; numeric compact modes and responsive message CSS variables.
 *   boxSize(ctx, size)         -> void; write displaySize to the panel.
 *   decorate(ctx, size)        -> void; default noop after boxSize, before shared ghost/handle drawing.
 *   paintReadout(ctx, size)    -> void; write the original width × height caption.
 *   positionWell(ctx, size)    -> void; optional feedback position below the panel.
 *   drawn(ctx, size)           -> void; default noop after shared drawing, for live fields/decorations.
 *   draw(ctx, size)            -> void; shared compaction, size, decoration, handles and feedback.
 *   handleOffset(name, size)   -> [dx,dy]; default [0,0] inset in displayed workspace units.
 *   locateHandle(name, size)   -> [x,y]; pixelRect + handleOffset + wrapper scale, in viewport pixels.
 *   dragSize(name, dx, dy, initial) -> {w,h}; inverse projection, clamp and round pointer deltas.
 *   bindHandle(ctx, name, el, rz) -> void; original incremental env.ui.track; rz.set redraws current size.
 *   bound(ctx)                 -> void; default noop after binding, before initial draw (briefing fields).
 *   place(ctx)                 -> void; optional token placement after all original placeIn draws.
 *   anchors(ctx)               -> elements[]; workspace/reference; numeric preset uses 01's bounds marker.
 *   renderPanel(ctx)           -> {anchors,sync,locate}; the shared panel render pipeline.
 *   renderTextarea(ctx), renderColumn(ctx), renderSplit(ctx) -> view; unchanged other live scenario paths.
 */
(function () {
  'use strict';

  const POINTS = { nw: [0, 0], n: [0.5, 0], ne: [1, 0], e: [1, 0.5], se: [1, 1], s: [0.5, 1], sw: [0, 1], w: [0, 0.5] };
  const KEYS = new Set(['ArrowRight', 'ArrowUp', 'ArrowLeft', 'ArrowDown', 'Home', 'End']);
  const movesX = (g) => /[ew]/.test(g);
  const movesY = (g) => /[ns]/.test(g);
  const side = (g, axis) => (axis === 'x' ? (g.includes('e') ? 1 : g.includes('w') ? 0 : null) : (g.includes('s') ? 1 : g.includes('n') ? 0 : null));

  const GRIPS = { se: 'bottom-right corner', sw: 'bottom-left corner', ne: 'top-right corner', nw: 'top-left corner', e: 'right edge', w: 'left edge', n: 'top edge', s: 'bottom edge' };

  const TOKENS = {
    origin: 'zero', body: 'empty', messages: [], titleIcon: 'dots', titleClass: '', titleControls: null,
    composer: false, messageTime: 'clock', bodyScroll: false,
    well: true, wellInside: false, currentFormat: 'plain', currentTag: 'span', targetLabel: 'Target:',
    targetFormat: 'plain', targetTolerance: false, checklist: true, hint: 'target',
    fit: 'panel', zoomMax: 1.2, fitPadX: 10, fitPadY: 28,
    compact: true, compactChat: false, compactHeight: 300, chromeWidth: 480, chromeMin: 0,
    ghostLayer: false, transform: true, scaleVar: true, chatUnit: false, extraScaleVar: null,
    rectFrame: 'workspace', placement: 'fixed', left: 0, top: 18, topFraction: 0, wellPosition: true,
  };
  const SCENARIOS = {
    numeric: {
      origin: 'sampled', body: 'messages',
      messages: [['Alex', 'Looks good so far.', '10:21 AM'], ['Jamie', 'Should we add the last section?', '10:22 AM'], ['Taylor', 'Yes, that works.', '10:23 AM']],
      currentFormat: 'detailed', targetLabel: 'Target size:', targetFormat: 'detailed', targetTolerance: true,
      checklist: false, hint: 'resize', fit: 'bounds', zoomMax: 1, placement: 'aligned',
      parts: {
        anchors: (base, S) => (ctx) => {
          const F = S.frame;
          const bounds = ctx.util.el('div', 'rz-bounds', F.area);
          const r = S.P.rectOf(F.lim.max);
          Object.assign(bounds.style, { position: 'absolute', pointerEvents: 'none', left: r.x + 'px', top: r.y + 'px', width: F.lim.max.w + 'px', height: F.lim.max.h + 'px' });
          return F.refEl ? [bounds, F.refEl] : [bounds];
        },
      },
    },
    ghost: {
      origin: 'ghost', body: 'chat', titleIcon: 'chat', composer: true,
      messages: [['Maya Kim', 'Can you review the latest numbers?'], ['Alex Chen', 'Sure, I’ll take a look now.'], ['Maya Kim', 'Great, thanks!']],
      well: false, checklist: false, hint: null, fit: 'workspace', zoomMax: 1,
      compact: false, compactChat: true, ghostLayer: true, scaleVar: false, chatUnit: true,
      placement: 'ghost', top: 0, topFraction: 0.045, wellPosition: false,
    },
  };

  env.template('resize-element/panel', (design, def) => {
    const { PANEL_CSS: CSS } = env.templateLib('resize-element/_styles');
    let D, P, view, frame, ctxRef;
    let hooked = false;
    const BASE = {};
    const S = {
      get frame() { return frame; },
      get ctx() { return ctxRef; },
      get spec() { return ctxRef.spec; },
      get D() { return D; },
      get P() { return P; },
      POINTS, movesX, movesY, side,
    };
    BASE.ensureStyle = function () {
      if (document.getElementById('rz-style')) return;
      const s = document.createElement('style');
      s.id = 'rz-style';
      s.textContent = CSS;
      document.head.append(s);
    };

    BASE.placeIn = function (ctx, el, rng, pad = 12) {
      const W = ctx.size.width;
      const H = ctx.size.height;
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      const freeX = Math.max(0, W - w - 2 * pad);
      const freeY = Math.max(0, H - h - 2 * pad);
      const c01 = (f) => Math.min(1, Math.max(0, f));
      const fx = c01(rng.pick([0, 0.5, 0.5, 1]) + rng.float(-0.15, 0.15));
      const fy = c01(rng.pick([0, 0.5, 0.5, 1]) + rng.float(-0.15, 0.15));
      const st = ctx.stage.getBoundingClientRect();
      const fixed = [...document.querySelectorAll('[data-role="submit"]')]
        .filter((b) => getComputedStyle(b).position === 'fixed').map((b) => b.getBoundingClientRect());
      const hits = (x, y) => fixed.some((r) => st.left + x < r.right + 6 && st.left + x + w > r.left - 6 && st.top + y < r.bottom + 6 && st.top + y + h > r.top - 6);
      let [x, y] = [pad + fx * freeX, pad + fy * freeY];
      for (const [ax, ay] of [[fx, fy], [fx, 0], [0, fy], [0, 0], [1, 0], [0, 1], [0.5, 0]]) {
        if (!hits(pad + ax * freeX, pad + ay * freeY)) {
          [x, y] = [pad + ax * freeX, pad + ay * freeY];
          break;
        }
      }
      el.style.left = Math.round(x) + 'px';
      el.style.top = Math.round(y) + 'px';
    };

    // Focusable control whose keys go through taskDef.helpers.keyApply; focus mirrored into model.focus.
    BASE.keyboard = function (ctx, el, apply) {
      if (!ctx.spec.keys) return;
      el.tabIndex = 0;
      el.addEventListener('pointerdown', () => el.focus({ preventScroll: true }));
      el.addEventListener('keydown', (e) => {
        if (!KEYS.has(e.key)) return;
        e.preventDefault();
        const m = env.taskDef.helpers.keyApply(ctx.spec, ctx.model, e.key, e.shiftKey);
        if (m !== ctx.model) apply(m);
      });
      el.addEventListener('focus', () => {
        el.classList.add('focused');
        if (!ctx.model.focus) ctx.update({ ...ctx.model, focus: true });
      });
      el.addEventListener('blur', () => {
        el.classList.remove('focused');
        if (ctx.model.focus) ctx.update({ ...ctx.model, focus: false });
      });
    };

    BASE.lorem = function (ctx, rng, n) {
      const C = ctx.content || {};
      const out = [];
      for (let i = 0; i < n; i++) {
        out.push(Array.isArray(C.SENTENCES) && C.SENTENCES.length ? (C.pick ? C.pick(rng, C.SENTENCES, { csplit: ctx.spec.csplit }) : rng.pick(C.SENTENCES))
          : 'Remember to update the release checklist before Friday.');
      }
      return out;
    };

    BASE.origin = (ctx, ruler) => {
      const o = { x: ctx.rng.int(ruler ? 34 : 18, 56), y: ctx.rng.int(ruler ? 26 : 18, 40) };
      return D.origin === 'zero' || (D.origin === 'ghost' && ctx.spec.scenario === 'ghost') ? { x: 0, y: 0 } : o;
    };
    BASE.geometry = () => {};
    BASE.displaySize = (s) => ({ w: s.w, h: s.h });
    BASE.rectOf = (s) => {
      const { ax, ay, W, H, o, lim } = frame;
      const d = P.displaySize(s);
      return D.rectFrame === 'max'
        ? { x: ax ? lim.max.w - d.w : 0, y: ay ? lim.max.h - d.h : 0, w: d.w, h: d.h }
        : { x: ax ? W - o.x - d.w : o.x, y: ay ? H - o.y - d.h : o.y, w: d.w, h: d.h };
    };
    BASE.pixelRect = (s) => P.rectOf(s);
    BASE.boxPosition = () => {
      const { box, ax, ay, o } = frame;
      Object.assign(box.style, ax ? { right: o.x - 1 + 'px' } : { left: o.x + 'px' }, ay ? { bottom: o.y - 1 + 'px' } : { top: o.y + 'px' });
    };
    BASE.icon = (ctx, dots) => {
      if (D.titleIcon === 'chat') ctx.util.el('span', 'chat-icon', dots, '•••');
      else for (let i = 0; i < 3; i++) ctx.util.el('i', '', dots);
    };
    BASE.title = (ctx) => {
      const title = ctx.util.el('div', 'rz-title', frame.box);
      P.icon(ctx, ctx.util.el('span', 'rz-dots', title));
      ctx.util.el('span', D.titleClass, title, ctx.spec.title);
      if (D.titleControls != null) ctx.util.el('span', 'rz-ctl', title, D.titleControls);
      return title;
    };
    BASE.messageTime = (i, row) => D.messageTime === 'archive' ? 'Apr 9, 1996  ' + (i ? '5:03' : '4:12') + ' PM' : '10:' + String(14 + i) + ' AM';
    BASE.body = (ctx) => {
      const { util } = ctx;
      const body = util.el('div', 'rz-body', frame.box);
      frame.body = body;
      if (D.bodyScroll) util.el('div', 'rz-scroll', frame.box);
      if (D.body === 'empty') util.el('p', 'rz-empty', body, 'No comments yet.');
      for (const [i, row] of D.messages.entries()) {
        const [name, text, time] = row;
        if (D.body === 'messages') {
          const message = util.el('div', 'rz-message', body);
          util.el('strong', '', message, name);
          util.el('em', '', message, time);
          util.el('p', '', message, text);
        } else if (D.body === 'chat') {
          const message = util.el('div', 'chat-message' + (i === 1 ? ' outgoing' : ''), body);
          util.el('span', 'avatar', message, i === 1 ? 'AC' : 'MK');
          const copy = util.el('div', 'message-copy', message);
          const author = util.el('div', 'message-author', copy);
          util.el('strong', '', author, name);
          util.el('span', 'message-time', author, P.messageTime(i, row));
          util.el('p', '', copy, text);
        }
      }
      P.composer(ctx);
      return body;
    };
    BASE.composer = (ctx) => {
      if (!D.composer) return;
      const composer = ctx.util.el('div', 'chat-composer', frame.box);
      ctx.util.el('span', 'message-placeholder', composer, 'Type a message...');
      const send = ctx.util.el('button', 'chat-send', composer, 'Send');
      send.type = 'button';
      send.onclick = () => env.log('chat-send');
    };
    BASE.well = (ctx) => {
      if (!D.well) return null;
      const well = ctx.util.el('div', 'rz-well', null);
      if (D.wellInside) frame.box.append(well);
      else ctx.stage.prepend(well);
      return well;
    };
    BASE.briefing = (ctx) => {
      if (D.hint == null) return;
      const grip = GRIPS[ctx.spec.grip];
      const helper = D.hint === 'resize' ? `Drag the ${grip} of the ${ctx.spec.title} panel to resize it.` : `Drag the panel’s ${grip} to the target size.`;
      const sub = document.querySelector('.instruction-sub');
      if (sub) sub.textContent = helper;
      const firstStep = document.querySelector('.n-body li');
      if (firstStep) firstStep.textContent = `Drag the ${grip} of the ${ctx.spec.title} panel.`;
    };
    BASE.readout = (ctx) => {
      const readout = ctx.util.el('div', 'rz-readout', frame.box);
      readout.dataset.role = 'readout';
      readout.style[ctx.spec.grip.includes('w') ? 'right' : 'left'] = '10px';
      readout.hidden = !ctx.spec.readout;
      return readout;
    };
    BASE.ghostContent = () => {};
    BASE.ghost = (ctx) => {
      if (ctx.spec.scenario !== 'ghost') return null;
      const ghost = ctx.util.el('div', 'rz-ghost', frame.area);
      ghost.dataset.role = 'target';
      const r = P.rectOf(ctx.spec.target);
      Object.assign(ghost.style, { left: r.x + 'px', top: r.y + 'px', width: r.w + 'px', height: r.h + 'px' });
      P.ghostContent(ctx, ghost);
      return ghost;
    };
    BASE.handle = () => {};
    BASE.handlesReady = () => {};
    BASE.checklist = (ctx) => {
      if (!D.checklist) return;
      const el = document.querySelector('.size-check');
      if (el) el.textContent = `“${ctx.spec.title}” panel size is ${ctx.spec.target ? `${ctx.spec.target.w} × ${ctx.spec.target.h} px` : ''}`;
    };
    BASE.sizeText = (s, format) => format === 'detailed' ? `${s.w} px (width) × ${s.h} px (height)` : `${s.w} × ${s.h} px`;
    BASE.paintWell = (ctx, s) => {
      if (!frame.well) return;
      const { util, spec } = ctx;
      const well = frame.well;
      well.textContent = '';
      const currentRow = util.el('div', '', well);
      util.el('span', 'well-label', currentRow, 'Current size:');
      util.el(D.currentTag, '', currentRow, P.sizeText(s, D.currentFormat));
      if (spec.target && spec.target.w) {
        const targetRow = util.el('div', '', well);
        util.el('span', 'well-label', targetRow, D.targetLabel);
        util.el('span', '', targetRow, P.sizeText(spec.target, D.targetFormat) + (D.targetTolerance ? '  (±6 px)' : ''));
      }
    };
    BASE.fit = (ctx) => {
      const { W, H, lim, well, refW, refH } = frame;
      const stage = ctx.size;
      if (D.fit === 'bounds') return Math.min(D.zoomMax, (stage.width - 18) / lim.max.w, (stage.height - well.offsetHeight - 42) / lim.max.h);
      if (D.fit === 'workspace') return Math.min(D.zoomMax, (stage.width - D.fitPadX) / (W + (refW ? refW + 12 : 0)), (stage.height - D.fitPadY) / (H + (refH ? refH + 12 : 0)));
      return Math.min(D.zoomMax, (stage.width - 18) / lim.max.w, (stage.height - well.offsetHeight - 42) / lim.max.h, (stage.width - 2) / W, (stage.height - 20) / H);
    };
    BASE.chromeUnit = (ctx) => Math.min(1, Math.max(D.chromeMin, ctx.size.width / D.chromeWidth));
    BASE.scaled = () => {
      const { wrap, zoom, chromeUnit } = frame;
      if (D.chatUnit) wrap.style.setProperty('--chat-unit', String(chromeUnit / zoom));
      if (D.extraScaleVar) wrap.style.setProperty(D.extraScaleVar, String(zoom));
      if (D.transform) {
        wrap.style.transform = 'scale(' + zoom + ')';
        wrap.style.transformOrigin = '0 0';
      }
      if (D.scaleVar) wrap.style.setProperty('--rz-scale', zoom);
    };
    BASE.compact = (ctx, s) => {
      const { box, zoom } = frame;
      box.classList.toggle('compact', s.h * zoom < 168);
      box.classList.toggle('compact-tall', s.h * zoom >= 126 && s.h * zoom < 168);
      box.style.setProperty('--message-size', Math.min(20, Math.max(12, (s.h * zoom - 55) / 10)) + 'px');
      box.style.setProperty('--compact-size', Math.min(12, Math.max(9, (s.h * zoom - 26) / 3.4)) + 'px');
      box.style.setProperty('--message-pad', Math.min(18, Math.max(5, (s.h * zoom - 190) / 4)) + 'px');
      box.style.setProperty('--message-gap', Math.min(16, Math.max(4, (s.h * zoom - 190) / 4)) + 'px');
    };
    BASE.boxSize = (ctx, s) => {
      const d = P.displaySize(s);
      Object.assign(frame.box.style, { width: d.w + 'px', height: d.h + 'px' });
    };
    BASE.decorate = () => {};
    BASE.drawn = () => {};
    BASE.paintReadout = (ctx, s) => { frame.readout.textContent = `${s.w} × ${s.h}`; };
    BASE.positionWell = (ctx, s) => {
      if (!D.wellPosition || !frame.well) return;
      const r = P.rectOf(s);
      frame.well.style.left = '0px';
      frame.well.style.top = frame.wrap.offsetTop + (r.y + r.h) * frame.zoom + 24 + 'px';
    };
    BASE.draw = (ctx, s) => {
      if (D.compact) P.compact(ctx, s);
      P.boxSize(ctx, s);
      P.decorate(ctx, s);
      if (D.compactChat) frame.box.classList.toggle('compact-chat', P.displaySize(s).h * frame.zoom < D.compactHeight * frame.chromeUnit);
      if (D.ghostLayer && frame.ghost) frame.ghost.style.zIndex = ctx.spec.target.w >= s.w && ctx.spec.target.h >= s.h ? '0' : '3';
      const r = P.pixelRect(s);
      for (const [name, h] of Object.entries(frame.handles)) {
        const [fx, fy] = POINTS[name];
        Object.assign(h.style, { left: r.x + fx * r.w + 'px', top: r.y + fy * r.h + 'px' });
      }
      P.paintReadout(ctx, s);
      P.paintWell(ctx, s);
      P.positionWell(ctx, s);
      P.drawn(ctx, s);
    };
    BASE.handleOffset = () => [0, 0];
    BASE.locateHandle = (name, value) => {
      const r = frame.area.getBoundingClientRect();
      const rect = P.pixelRect(value);
      const [fx, fy] = POINTS[name];
      const zoom = D.transform ? frame.zoom : 1;
      const [dx, dy] = P.handleOffset(name, value);
      return [r.left + (rect.x + fx * rect.w - dx) * zoom, r.top + (rect.y + fy * rect.h - dy) * zoom];
    };
    BASE.dragSize = (name, dx, dy, initial) => {
      const { lim, zoom } = frame;
      return {
        w: Math.round(Math.max(lim.min.w, Math.min(lim.max.w, initial.w + (/e/.test(name) ? 1 : /w/.test(name) ? -1 : 0) * dx / (frame.dragX ?? zoom)))),
        h: Math.round(Math.max(lim.min.h, Math.min(lim.max.h, initial.h + (/s/.test(name) ? 1 : /n/.test(name) ? -1 : 0) * dy / (frame.dragY ?? zoom)))),
      };
    };
    BASE.bindHandle = (ctx, name, handle, rz) => {
      let initial;
      env.ui.track(handle, {
        start() { initial = { ...frame.current }; handle.classList.add('active'); },
        move(p) {
          const next = P.dragSize(name, p.dx, p.dy, initial);
          rz.set(next);
          ctx.update({ ...ctx.model, ...next });
        },
        end() { handle.classList.remove('active'); },
      }, 'handle-' + name);
    };
    BASE.bound = () => {};
    BASE.place = (ctx) => {
      const { wrap, o, zoom } = frame;
      if (D.placement === 'aligned') {
        wrap.style.left = -o.x * zoom + 'px';
        wrap.style.top = -o.y * zoom + 18 + 'px';
      } else if (D.placement === 'fixed' || (D.placement === 'ghost' && ctx.spec.scenario === 'ghost')) {
        wrap.style.left = D.left + 'px';
        wrap.style.top = D.top + Math.round(ctx.size.height * D.topFraction) + 'px';
      }
    };
    BASE.anchors = () => frame.refEl ? [frame.area, frame.refEl] : [frame.area];

    BASE.renderPanel = (ctx) => {
      const { spec, rng, util } = ctx;
      const ax = side(spec.anchor, 'x') ?? 0;
      const ay = side(spec.anchor, 'y') ?? 0;
      const ruler = !spec.readout && spec.scenario !== 'ghost';
      const pad = 18;
      const margin = 12;
      const o = P.origin(ctx, ruler);
      const ref = spec.goal.kind === 'ref' ? spec.goal.ref : null;
      const refW = ref && ref.dim === 'h' ? rng.int(110, 150) : 0;
      const refH = ref && ref.dim === 'w' ? rng.int(38, 50) : 0;
      const lim = { min: { ...spec.min }, max: { ...spec.max } };
      frame = { ax, ay, ruler, pad, margin, o, ref, refW, refH, lim, W: o.x + lim.max.w + pad, H: o.y + lim.max.h + pad };
      P.geometry(ctx);
      const { W, H } = frame;
      const wrap = frame.wrap = util.el('div', 'rz-wrap' + (refH ? ' col' : ''), ctx.stage);
      const area = frame.area = util.el('div', 'rz-area', wrap);
      area.dataset.role = 'workspace';
      Object.assign(area.style, { width: (frame.areaW ?? W) + 'px', height: (frame.areaH ?? H) + 'px' });
      frame.refEl = null;
      if (ref) {
        const refEl = frame.refEl = util.el('div', 'rz-ref', null, ref.name);
        refEl.dataset.role = 'reference';
        if (ref.dim === 'w') Object.assign(refEl.style, { width: ref.size + 'px', height: refH + 'px', marginLeft: (ax ? W - o.x - ref.size : o.x) + 1 + 'px' });
        else Object.assign(refEl.style, { width: refW + 'px', height: ref.size + 'px', marginTop: (ay ? H - o.y - ref.size : o.y) + 1 + 'px', writingMode: 'vertical-rl' });
        if (rng.bool(0.5)) wrap.prepend(refEl);
        else wrap.append(refEl);
      }
      const box = frame.box = util.el('div', 'rz-box', area);
      box.dataset.role = 'panel';
      P.boxPosition(ctx);
      frame.title = P.title(ctx);
      frame.body = P.body(ctx);
      frame.well = P.well(ctx);
      P.briefing(ctx);
      frame.readout = P.readout(ctx);
      frame.ghost = P.ghost(ctx);
      P.rulers(ctx);
      const valid = Object.keys(POINTS).filter((h) => (!movesX(h) || side(h, 'x') !== ax) && (!movesY(h) || side(h, 'y') !== ay));
      const names = rng.bool(0.5) ? [spec.grip] : [...new Set([spec.grip, ...valid])];
      frame.handles = {};
      for (const name of names) {
        const cls = movesX(name) && movesY(name) ? 'c ' + (name === 'se' || name === 'nw' ? 'nwse' : 'nesw') : movesX(name) ? 'x' : 'y';
        const h = util.el('div', 'rz-handle ' + cls, area);
        h.dataset.role = 'handle-' + name;
        frame.handles[name] = h;
        P.handle(ctx, h, name);
      }
      P.handlesReady(ctx);
      P.checklist(ctx);
      P.paintWell(ctx, ctx.model);
      frame.zoom = P.fit(ctx);
      frame.chromeUnit = P.chromeUnit(ctx);
      P.scaled(ctx);
      frame.current = { w: ctx.model.w, h: ctx.model.h };
      const rz = {
        set(value) { frame.current = { ...value }; P.draw(ctx, frame.current); },
        locateHandle(name, value = frame.current) { return P.locateHandle(name, value); },
      };
      for (const [name, handle] of Object.entries(frame.handles)) P.bindHandle(ctx, name, handle, rz);
      P.bound(ctx);
      rz.set(frame.current);
      const resetModel = structuredClone(ctx.model);
      env.widgetDef.clear = () => { ctx.update(structuredClone(resetModel)); rz.set(resetModel); };
      const clampS = (m) => ({ w: Math.max(lim.min.w, Math.min(lim.max.w, m.w)), h: Math.max(lim.min.h, Math.min(lim.max.h, m.h)) });
      P.keyboard(ctx, frame.handles[spec.grip], (m) => {
        const s = clampS(m);
        rz.set(s);
        ctx.update({ ...ctx.model, ...s });
      });
      P.placeIn(ctx, wrap, rng);
      P.place(ctx);
      P.positionWell(ctx, frame.current);
      return {
        anchors: P.anchors(ctx), sync: (m) => rz.set({ w: m.w, h: m.h }),
        locate(t) {
          if (t.handle === undefined) throw new Error(`resize-element/panel cannot locate ${JSON.stringify(t)}`);
          return rz.locateHandle(frame.handles[t.handle] ? t.handle : spec.grip, t.size);
        },
      };
    };
    BASE.rulers = (ctx) => {
      const { ruler, area, ax, ay, o, lim, W, H } = frame;
      const { util } = ctx;
      const fam = env.taskDef;
      if (ruler) {
        // Px rulers measured from the fixed edges, along the top/bottom and left/right margins.
        const top = util.el('div', 'rz-ruler', area);
        Object.assign(top.style, { left: 0, right: 0, height: '16px' }, ay ? { bottom: o.y - 22 + 'px' } : { top: o.y - 20 + 'px' });
        for (let d = 0; d <= lim.max.w; d += fam.helpers.rulerStep) {
          const x = ax ? W - o.x - d : o.x + d;
          const i = util.el('i', '', top);
          Object.assign(i.style, { left: x + 'px', width: '1px', height: d % 100 ? '4px' : '7px' }, ay ? { top: 0 } : { bottom: 0 });
          if (d % 100 === 0) {
            const b = util.el('b', '', top, String(d));
            Object.assign(b.style, { left: x + 3 + 'px' }, ay ? { top: '4px' } : { bottom: '5px' });
          }
        }
        const left = util.el('div', 'rz-ruler', area);
        Object.assign(left.style, { top: 0, bottom: 0, width: o.x - 4 + 'px' }, ax ? { right: 0 } : { left: 0 });
        for (let d = 0; d <= lim.max.h; d += fam.helpers.rulerStep) {
          const y = ay ? H - o.y - d : o.y + d;
          const i = util.el('i', '', left);
          Object.assign(i.style, { top: y + 'px', height: '1px', width: d % 100 ? '4px' : '7px' }, ax ? { left: 0 } : { right: 0 });
          if (d % 100 === 0) {
            const b = util.el('b', '', left, String(d));
            Object.assign(b.style, { top: y + 1 + 'px' }, ax ? { left: '2px' } : { right: '2px' });
          }
        }
      }

    };
    // ------------------------------------------------------------------ native textarea

    BASE.renderTextarea = function (ctx) {
      const { spec, rng, util } = ctx;
      const card = util.el('div', 'rzt-card', ctx.stage);
      card.dataset.role = 'form';
      const cw = 18 * 2 + spec.max.w + 8;
      const chh = 42 + spec.max.h + 18;
      Object.assign(card.style, { width: cw + 'px', height: chh + 'px' });
      util.el('div', 'rzt-label', card, spec.title);
      const hint = util.el('div', 'rzt-hint', card);
      hint.dataset.role = 'readout';
      if (spec.outline) {
        const g = util.el('div', 'rzt-ghost', card);
        g.dataset.role = 'target';
        Object.assign(g.style, { width: spec.target.w + 'px', height: spec.target.h + 'px' });
      }
      const ta = util.el('textarea', 'rzt-ta', card);
      ta.dataset.role = 'textarea';
      ta.spellcheck = false;
      ta.value = P.lorem(ctx, rng, rng.int(2, 5)).join(' ');
      ta.style.resize = spec.axes === 'both' ? 'both' : spec.axes === 'w' ? 'horizontal' : 'vertical';
      Object.assign(ta.style, {
        minWidth: spec.min.w + 'px', minHeight: spec.min.h + 'px', maxWidth: spec.max.w + 'px', maxHeight: spec.max.h + 'px',
      });
      const paint = (m) => {
        Object.assign(ta.style, { width: m.w + 'px', height: m.h + 'px' });
        hint.textContent = spec.readout ? `${m.w} × ${m.h} px` : '';
      };
      paint(ctx.model);
      // The browser resizes the element itself: read its rendered size after pointer moves and releases.
      const read = () => {
        const w = Math.round(ta.offsetWidth);
        const h = Math.round(ta.offsetHeight);
        if (w !== ctx.model.w || h !== ctx.model.h) {
          hint.textContent = spec.readout ? `${w} × ${h} px` : '';
          ctx.update({ ...ctx.model, w, h });
        }
      };
      if (!hooked) {
        hooked = true;
        for (const type of ['pointermove', 'pointerup', 'mouseup']) document.addEventListener(type, () => { if (view && view.read) view.read(); });
      }
      if (window.ResizeObserver) new ResizeObserver(() => { if (view && view.ta === ta) read(); }).observe(ta);
      P.placeIn(ctx, card, rng);
      return {
        ta,
        read,
        anchors: [card],
        sync: (m) => paint(m),
        locate(t) {
          const r = ta.getBoundingClientRect();
          const p = [r.right - 4, r.bottom - 4];
          if (!t.size) return p;
          return [p[0] + (t.size.w - ta.offsetWidth), p[1] + (t.size.h - ta.offsetHeight)];
        },
      };
    };

    // ------------------------------------------------------------------ table columns

    BASE.renderColumn = function (ctx) {
      const { spec, rng, util } = ctx;
      const box = util.el('div', 'rzc-box', ctx.stage);
      box.dataset.role = 'table';
      const rowH = 33;
      const BW = spec.budget + 30;
      const BH = 34 + (spec.readout ? 0 : 20) + 36 + spec.rows.length * rowH + (spec.readout ? 34 : 14);
      Object.assign(box.style, { width: BW + 'px', height: BH + 'px' });
      util.el('div', 'rzc-title', box, rng.pick(['Customers', 'Contacts', 'Orders', 'Team members', 'Accounts', 'Leads', 'Vendors', 'Invoices']));
      if (!spec.readout) {
        const ruler = util.el('div', 'rzc-ruler rz-ruler', box);
        ruler.style.position = 'relative';
        for (let d = 0; d <= spec.budget; d += 50) {
          const i = util.el('i', '', ruler);
          Object.assign(i.style, { left: d + 'px', bottom: 0, width: '1px', height: d % 100 ? '4px' : '7px' });
          if (d % 100 === 0) Object.assign(util.el('b', '', ruler, String(d)).style, { left: d + 3 + 'px', bottom: '3px' });
        }
      }
      const table = util.el('table', 'rzc-table', box);
      const colgroup = util.el('colgroup', '', table);
      const cols = spec.columns.map(() => util.el('col', '', colgroup));
      const head = util.el('tr', '', util.el('thead', '', table));
      const grips = [];
      const ths = spec.columns.map((c, i) => {
        const th = util.el('th', '', head);
        util.el('span', '', th, c.name);
        const g = util.el('div', 'rzc-grip', th);
        g.dataset.role = 'col-grip';
        grips.push(g);
        return th;
      });
      const tb = util.el('tbody', '', table);
      for (const row of spec.rows) {
        const tr = util.el('tr', '', tb);
        for (const cell of row) util.el('td', '', tr, cell);
      }
      const bar = spec.readout ? util.el('div', 'rzc-bar', box) : null;
      if (bar) bar.dataset.role = 'readout';
      const paint = (m) => {
        m.cols.forEach((w, i) => { cols[i].style.width = w + 'px'; });
        table.style.width = m.cols.reduce((a, b) => a + b, 0) + 'px';
        if (bar) bar.textContent = 'Column widths: ' + spec.columns.map((c, i) => `${c.name} ${m.cols[i]} px`).join(' · ');
      };
      paint(ctx.model);
      grips.forEach((g, i) => {
        let w0;
        util.drag(g, {
          start() { w0 = ctx.model.cols[i]; g.classList.add('active'); },
          move(e, dx) {
            const others = ctx.model.cols.reduce((a, w, k) => a + (k === i ? 0 : w), 0);
            const w = Math.round(Math.max(spec.min, Math.min(spec.budget - others, w0 + dx)));
            if (w === ctx.model.cols[i]) return;
            const next = ctx.model.cols.slice();
            next[i] = w;
            ctx.update({ ...ctx.model, cols: next });
            paint(ctx.model);
          },
          end() { g.classList.remove('active'); },
        }, 'col-grip');
      });
      // The border point of column i (header row, vertical middle).
      const edge = (i) => {
        const r = ths[i].getBoundingClientRect();
        return [r.right, r.top + r.height / 2];
      };
      P.placeIn(ctx, box, rng);
      return {
        anchors: [box],
        sync: (m) => paint(m),
        locate(t) {
          const p = edge(t.col);
          if (t.width === undefined) return p;
          return [p[0] + (t.width - ctx.model.cols[t.col]), p[1]];
        },
      };
    };

    // ------------------------------------------------------------------ split panes

    BASE.renderSplit = function (ctx) {
      const { spec, rng, util } = ctx;
      const v = spec.orient === 'v';
      const box = util.el('div', 'rzs-box', ctx.stage);
      box.dataset.role = 'split';
      Object.assign(box.style, v ? { width: spec.total + 'px', height: spec.cross + 'px' } : { width: spec.cross + 'px', height: spec.total + 'px' });
      const C = ctx.content || {};
      const items = (k) => {
        const out = [];
        for (let i = 0; i < 14; i++) {
          if (k === 0 && C.fileName) out.push(C.fileName(rng));
          else if (Array.isArray(C.EMAIL_SUBJECTS) && C.EMAIL_SUBJECTS.length) out.push(rng.pick(C.EMAIL_SUBJECTS));
          else out.push(P.lorem(ctx, rng, 1)[0]);
        }
        return out;
      };
      const panes = spec.panes.map((name, k) => {
        const p = util.el('div', 'rzs-pane', box);
        p.dataset.role = 'pane';
        const head = util.el('div', 'rzs-head', p);
        util.el('span', '', head, name);
        const em = util.el('em', '', head);
        for (const it of items(k)) util.el('div', 'rzs-item', p, it);
        return { p, em };
      });
      const div = util.el('div', 'rzs-div ' + (v ? 'v' : 'h'), box);
      div.dataset.role = 'divider';
      div.setAttribute('role', 'separator');
      const span = spec.total - spec.div;
      const paint = (m) => {
        const a = m.pos;
        const b = span - m.pos;
        if (v) {
          Object.assign(panes[0].p.style, { left: 0, top: 0, bottom: 0, width: a + 'px' });
          Object.assign(div.style, { left: a + 'px', top: 0, bottom: 0, width: spec.div + 'px' });
          Object.assign(panes[1].p.style, { left: a + spec.div + 'px', top: 0, bottom: 0, width: b + 'px' });
        } else {
          Object.assign(panes[0].p.style, { top: 0, left: 0, right: 0, height: a + 'px' });
          Object.assign(div.style, { top: a + 'px', left: 0, right: 0, height: spec.div + 'px' });
          Object.assign(panes[1].p.style, { top: a + spec.div + 'px', left: 0, right: 0, height: b + 'px' });
        }
        panes[0].em.textContent = spec.readout ? `${a} px` : '';
        panes[1].em.textContent = spec.readout ? `${b} px` : '';
      };
      paint(ctx.model);
      const clampP = (p) => Math.max(spec.min, Math.min(span - spec.min, Math.round(p)));
      let p0;
      util.drag(div, {
        start() { p0 = ctx.model.pos; div.classList.add('active'); },
        move(e, dx, dy) {
          const pos = clampP(p0 + (v ? dx : dy));
          if (pos === ctx.model.pos) return;
          ctx.update({ ...ctx.model, pos });
          paint(ctx.model);
        },
        end() { div.classList.remove('active'); },
      }, 'divider');
      P.keyboard(ctx, div, (m) => {
        ctx.update({ ...ctx.model, pos: clampP(m.pos) });
        paint(ctx.model);
      });
      const cross = rng.float(0.3, 0.7);
      P.placeIn(ctx, box, rng);
      return {
        anchors: [box],
        sync: (m) => paint(m),
        locate(t) {
          const r = div.getBoundingClientRect();
          const p = v ? [r.left + r.width / 2, r.top + cross * r.height] : [r.left + cross * r.width, r.top + r.height / 2];
          if (t.pos === undefined) return p;
          const d = t.pos - ctx.model.pos;
          return v ? [p[0] + d, p[1]] : [p[0], p[1] + d];
        },
      };
    };

    ({ D, P } = env.templateDesign('resize-element/panel', design, def, { tokens: TOKENS, scenarios: SCENARIOS, base: BASE, state: S }));
    return {
      traits: { grips: ['se'] },
      render(ctx) {
        ctxRef = ctx;
        P.ensureStyle();
        const v = ctx.spec.scenario;
        view = v === 'textarea' ? P.renderTextarea(ctx) : v === 'column' ? P.renderColumn(ctx) : v === 'split' ? P.renderSplit(ctx) : P.renderPanel(ctx);
        return { anchors: view.anchors, sync: view.sync };
      },
      locate(t) { return view.locate(t); },
    };
  }, { uses: ['resize-element/_styles'] });
})();
