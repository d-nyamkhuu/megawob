/* click-control/_base-eras: eras units of the base template.
 * scopeRef is the live reference scope; reference.js retains their design.parts keys and overrides.
 */
(function () {
  'use strict';

  /*
   * reference / click-control / eras: the controls page frame with the button styles of four design eras, one
   * per episode (sampled from the widget rng), each with its own hit area and feel. Scenarios: button (every
   * kind) and sequence.
   *   win98       bevelled native <input type=button> (23 px tall, 75 px or more wide, pressed bevel, dotted focus ring) on a grey
   *               Windows 98 style page (navy title bar); toolbar / card / footer / surface hosts are grey too
   *   ripple      Material buttons: solid (raised), outlined or flat text buttons (no visible box: the hit
   *               area is the 36 px tall padding box), upper-case labels; a press starts a ripple whose
   *               radius and fade follow the kit clock (ctx.clock(), advanced in sync after ticks), so it is
   *               deterministic and also visible one step after the click
   *   toolbar12   12 px icon + label toolbar buttons, 22 px tall, faint border: the small-target case
   *   fab         round floating-action buttons: on the surface (sequence, test, pair) 60 px circles with the
   *               label inside; for the labelled kinds ('labels', 'lookalike') the buttons are the open
   *               speed dial of a main FAB at the bottom right of a phone-like screen, each a round icon
   *               plus a label chip (the whole row is the button), the other elements in the screen's flow
   * opts.route is ignored: click-control is pointer only. traits: none (specs are the controls widget's).
   */

  const CSS3 = `
      .ue-b { box-sizing: border-box; position: relative; }
      .uc-surface .ue-b { position: absolute; }
      .ue-pg-win98 { --panel: #c0c0c0; --bg: #c0c0c0; --fg: #000; --muted: #303030; --line: #808080; --accent: #000080; border-radius: 0; box-shadow: none;
        border: 2px solid; border-color: #fff #404040 #404040 #fff; background: #c0c0c0; font-family: "MS Sans Serif", "Microsoft Sans Serif", Tahoma, "DejaVu Sans", Verdana, sans-serif; }
      .ue-pg-win98 .uc-nav { height: 28px; padding: 0 6px; gap: 12px; border: 0; background: linear-gradient(90deg, #000080, #1084d0); color: #fff; }
      .ue-pg-win98 .uc-brand { font-size: 13px; gap: 6px; }
      .ue-pg-win98 .uc-logo { width: 14px; height: 14px; border-radius: 0; background: #ffd400; }
      .ue-pg-win98 .uc-navlinks, .ue-pg-win98 .uc-navlinks span.on { color: #fff; font-size: 12px; }
      .ue-pg-win98 .uc-search, .ue-pg-win98 .uc-avatar { display: none; }
      .ue-pg-win98 .uc-side { background: #c0c0c0; border-right: 2px groove #fff; }
      .ue-pg-win98 .uc-side div { border-radius: 0; font-size: 12px; color: #000; }
      .ue-pg-win98 .uc-side div.on { background: #000080; color: #fff; }
      .ue-win98 { background: #c0c0c0; color: #000; border: 2px solid; border-color: #808080 #fff #fff #808080; border-radius: 0; box-shadow: none; font-size: 12px; }
      .ue-win98.uc-surface { background-image: none; }
      .ue-win98 .uc-text, .ue-win98 .uc-doc, .ue-win98 .uc-inrow { color: #000; font-size: 12px; }
      .ue-win98 .uc-input { height: 21px; padding: 0 3px; border: 2px solid; border-color: #808080 #fff #fff #808080; border-radius: 0; background: #fff; color: #000; font-size: 12px; }
      .ue-win98 .ue-b { min-width: 75px; height: 23px; padding: 0 8px; border: 0; border-radius: 0; background: #c0c0c0; color: #000; font: inherit;
        font-size: 12px; cursor: default; box-shadow: inset -1px -1px #000, inset 1px 1px #fff, inset -2px -2px #808080, inset 2px 2px #dfdfdf; }
      .ue-win98 .ue-b:active, .ue-win98 .ue-b[data-clicked] { padding: 2px 7px 0 9px;
        box-shadow: inset -1px -1px #fff, inset 1px 1px #000, inset -2px -2px #dfdfdf, inset 2px 2px #808080; }
      .ue-b.snug { min-width: 0 !important; padding: 0 2px !important; font-size: 11px !important; letter-spacing: .02em !important; }
      .ue-win98 .ue-b:focus-visible { outline: 1px dotted #000; outline-offset: -5px; }
      .ue-win98 .ue-b.dis { color: #808080; text-shadow: 1px 1px #fff; cursor: not-allowed; }
      .ue-win98.uc-bar .sep { background: #808080; box-shadow: 1px 0 #fff; }

      .ue-md .ue-b { overflow: hidden; display: inline-flex; align-items: center; justify-content: center; height: 36px; min-width: 64px;
        padding: 0 16px; border: 0; border-radius: 4px; background: transparent; color: var(--accent); cursor: pointer; white-space: nowrap;
        font: 500 14px/1 Roboto, "Liberation Sans", Arial, sans-serif; text-transform: uppercase; letter-spacing: .09em; }
      .ue-md .ue-b.solid { background: var(--accent); color: #fff; box-shadow: 0 2px 4px rgba(0,0,0,.28); }
      .ue-md .ue-b.line { border: 1px solid color-mix(in srgb, var(--fg) 24%, transparent); }
      .ue-md .ue-b:hover { background: color-mix(in srgb, var(--accent) 9%, transparent); }
      .ue-md .ue-b.solid:hover { background: var(--accent); filter: brightness(1.12); }
      .ue-md .ue-b[data-clicked] { background: color-mix(in srgb, var(--accent) 18%, transparent); }
      .ue-md .ue-b.solid[data-clicked] { background: var(--accent); filter: brightness(.82); }
      .ue-md .ue-b.dis { opacity: .4; box-shadow: none; cursor: not-allowed; }
      .ue-md .ue-t { pointer-events: none; position: relative; }
      .ue-rpl { position: absolute; border-radius: 50%; background: currentColor; opacity: 0; transform: scale(0); pointer-events: none; }

      .ue-tb12 { font-size: 12px; }
      .ue-tb12.uc-bar { gap: 2px; padding: 3px 4px; border-radius: 3px; }
      .ue-tb12 .ue-b { display: inline-flex; align-items: center; gap: 4px; height: 22px; min-width: 0; padding: 0 6px; border: 1px solid color-mix(in srgb, var(--fg) 14%, transparent);
        border-radius: 2px; background: transparent; color: var(--fg); cursor: pointer; white-space: nowrap; font: 12px/1 "Segoe UI", "DejaVu Sans", Tahoma, sans-serif; }
      .ue-tb12 .ue-b svg { width: 12px; height: 12px; flex: none; }
      .ue-tb12 .ue-b:hover { border-color: color-mix(in srgb, var(--fg) 35%, var(--line)); background: color-mix(in srgb, var(--fg) 7%, transparent); }
      .ue-tb12 .ue-b[data-clicked] { border-color: var(--accent); background: color-mix(in srgb, var(--accent) 20%, transparent); }
      .ue-tb12 .ue-b.dis { opacity: .4; cursor: not-allowed; }
      .ue-tb12 .uc-text, .ue-tb12 .uc-doc, .ue-tb12 .uc-inrow { font-size: 12px; }

      .ue-fab .ue-b.fabc { display: flex; align-items: center; justify-content: center; padding: 0; border: 0; border-radius: 50%; background: var(--accent); color: #fff;
        font-weight: 700; font-size: 12px; line-height: 1.1; font-family: inherit; text-align: center; cursor: pointer; box-shadow: 0 3px 8px rgba(0,0,0,.3); }
      .ue-fab .ue-b.fabc[data-clicked] { filter: brightness(.78); box-shadow: 0 1px 3px rgba(0,0,0,.3); }
      .ue-screen { position: relative; box-sizing: border-box; overflow: hidden; border: 1px solid var(--line); border-radius: 22px; background: var(--panel);
        box-shadow: 0 8px 24px rgba(0,0,0,.1); }
      .ue-sflow { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; padding: 18px 232px 18px 20px; }
      .ue-sflow .uc-text { flex-basis: 100%; color: var(--muted); font-size: 14px; line-height: 1.45; }
      .ue-sflow .uc-inrow { flex-basis: 100%; display: flex; align-items: center; gap: 8px; font-size: 14px; }
      .ue-sflow .uc-doc { margin: 0; flex-basis: 100%; }
      .ue-dial { position: absolute; right: 14px; bottom: 14px; display: flex; flex-direction: column-reverse; align-items: flex-end; gap: var(--ue-gap, 10px); }
      .ue-main { flex: none; width: 56px; height: 56px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 30px; line-height: 1;
        color: #fff; background: var(--accent); box-shadow: 0 4px 10px rgba(0,0,0,.32); transform: rotate(45deg); pointer-events: none; }
      .ue-dial .ue-di { display: flex; align-items: center; gap: 10px; height: var(--ue-dot, 40px); padding: 0; border: 0; background: transparent; color: var(--fg); cursor: pointer; }
      .ue-di .chip { padding: 0 10px; height: 26px; display: flex; align-items: center; border-radius: 6px; font-weight: 500; font-size: 13px; line-height: 1; font-family: inherit; white-space: nowrap;
        background: color-mix(in srgb, var(--fg) 82%, var(--panel)); color: var(--panel); box-shadow: 0 1px 3px rgba(0,0,0,.3); }
      .ue-di .dot { flex: none; width: var(--ue-dot, 40px); height: var(--ue-dot, 40px); border-radius: 50%; display: flex; align-items: center; justify-content: center;
        background: var(--panel); color: var(--accent); box-shadow: 0 2px 6px rgba(0,0,0,.3); }
      .ue-di .dot svg { width: 18px; height: 18px; }
      .ue-di[data-clicked] .dot { background: var(--accent); color: #fff; }
      .ue-di.dis { opacity: .4; cursor: not-allowed; }
      `;

  function eraFit(scopeRef, b, W, H, pad) {
    let [w, h] = scopeRef.ERA.size;
    const mw = Math.floor(0.31 * (W - 2 * pad));
    const mh = Math.floor(0.31 * (H - 2 * pad));
    if (w > mw || h > mh) {
      b.classList.add('snug');
      w = Math.min(w, mw);
      h = Math.min(h, mh);
    }
    if (scopeRef.ERA.mode === 'fab') w = h = Math.min(w, h);
    return [w, h];
  }

  function iconFor(scopeRef, label) {
    const names = Object.keys(scopeRef.ICON_PATHS);
    let h = 0;
    for (const c of label) h = (h * 31 + c.charCodeAt(0)) >>> 0;
    return names[h % names.length];
  }

  function ripple(scopeRef, ctx, b, ev) {
    if (b.classList.contains('dis')) return;
    const r = b.getBoundingClientRect();
    const rad = Math.hypot(Math.max(ev.clientX - r.left, r.right - ev.clientX), Math.max(ev.clientY - r.top, r.bottom - ev.clientY));
    const el = ctx.util.el('span', 'ue-rpl', b);
    el.style.cssText = `left:${(ev.clientX - r.left - rad).toFixed(1)}px;top:${(ev.clientY - r.top - rad).toFixed(1)}px;width:${(2 * rad).toFixed(1)}px;height:${(2 * rad).toFixed(1)}px`;
    scopeRef.ERA.ripples.push({ el, t0: ctx.clock() });
  }

  function tickRipples(scopeRef, ctx) {
    const now = ctx.clock();
    scopeRef.ERA.ripples = scopeRef.ERA.ripples.filter((r) => {
      const p = (now - r.t0) / scopeRef.RIPPLE_MS;
      if (p >= 1) {
        r.el.remove();
        return false;
      }
      r.el.style.transform = `scale(${p.toFixed(3)})`;
      r.el.style.opacity = (0.3 * (1 - p)).toFixed(3);
      return true;
    });
  }

  function eraButton(scopeRef, ctx, parent, label, key, o = {}) {
    const { util } = ctx;
    const mode = scopeRef.ERA.mode;
    let b;
    if (mode === 'win98') {
      b = util.el('input', 'ue-b', parent);
      b.type = 'button';
      b.value = label;
    } else {
      b = util.el('button', 'ue-b', parent);
      b.type = 'button';
      if (mode === 'ripple') {
        b.classList.add(o.primary || o.fab || o.look === 'primary' ? 'solid' : o.look === 'ghost' || o.look === 'link' ? 'flat' : 'line');
        util.el('span', 'ue-t', b, label);
        b.addEventListener('pointerdown', (ev) => scopeRef.ripple(ctx, b, ev));
      } else if (mode === 'toolbar12') {
        b.innerHTML = scopeRef.icon(o.icon || scopeRef.iconFor(label));
        util.el('span', '', b, label);
      } else {
        b.classList.add('fabc');
        util.el('span', '', b, label);
      }
    }
    b.dataset.key = key;
    if (o.disabled) {
      b.classList.add('dis');
      b.setAttribute('aria-disabled', 'true');
    }
    return b;
  }

  function buildFabScreen(scopeRef, ctx, content, up) {
    const { spec, util, rng } = ctx;
    const b = scopeRef.box(ctx, content);
    const defs = spec.elements.filter((e) => e.type === 'button');
    const cr = content.getBoundingClientRect();
    const sw = Math.max(420, Math.min(560, Math.floor(cr.width) - 4));
    const availH = Math.max(250, Math.floor(cr.height) - 6);
    // Dial rows: 40 px round buttons 10 px apart, tighter when many buttons share a short screen.
    const pitch = Math.max(30, Math.min(50, Math.floor((availH - 24 - 66) / Math.max(1, defs.length))));
    const dot = Math.min(40, pitch - 4);
    const sh = Math.min(availH, Math.max(250, 24 + 66 + defs.length * pitch));
    const scr = util.el('div', 'ue-screen ue-fab', b);
    scr.style.width = sw + 'px';
    scr.style.height = sh + 'px';
    const flow = util.el('div', 'ue-sflow', scr);
    if (spec.kind === 'labels') {
      for (const e of spec.elements) {
        if (e.type === 'text') util.el('div', 'uc-text', flow, e.text);
        else if (e.type === 'input') {
          const row = util.el('div', 'uc-inrow', flow);
          if (e.label) util.el('span', '', row, e.label + ':');
          const inp = util.el('input', 'uc-input', row);
          inp.type = 'text';
          inp.style.width = Math.min(e.width, 150) + 'px';
        }
      }
    } else {
      util.el('div', 'uc-doc', flow).innerHTML = `<b>${rng.pick(['Quarterly plan', 'Draft: Spring newsletter', 'Invoice #4821', 'Onboarding checklist', 'Trip to Lisbon'])}</b><br>`
        + 'Last edited a few minutes ago. Open the menu in the corner to continue.';
    }
    const dial = util.el('div', 'ue-dial', scr);
    dial.style.setProperty('--ue-dot', dot + 'px');
    dial.style.setProperty('--ue-gap', Math.max(0, pitch - dot) + 'px');
    const main = util.el('span', 'ue-main', dial, '+');
    main.setAttribute('aria-hidden', 'true');
    const els = defs.map((e) => {
      const d = util.el('button', 'ue-di' + (e.disabled ? ' dis' : ''), dial);
      d.type = 'button';
      d.dataset.key = e.key;
      util.el('span', 'chip', d, e.label);
      util.el('span', 'dot', d).innerHTML = scopeRef.icon(e.icon || scopeRef.iconFor(e.label));
      if (e.disabled) d.setAttribute('aria-disabled', 'true');
      return d;
    });
    const dis = new Set(defs.filter((e) => e.disabled).map((e) => e.key));
    const btns = scopeRef.env.ui.buttons(els, { label: 'button', history: ctx.model.clicks, disabled: (k) => dis.has(k),
      onChange: (h) => up({ clicks: h }) });
    return {
      sync: (m) => btns.set(m.clicks),
      locate: (t) => (t.button !== undefined ? btns.locate(t.button) : null),
      recover: 'toast',
    };
  }

  function initialize(scopeRef, set, __has, __parts) {
    set('CSS3', __has('CSS3') ? __parts['CSS3'](undefined, scopeRef) : (CSS3));
    set('ERA_MODES', __has('ERA_MODES') ? __parts['ERA_MODES'](undefined, scopeRef) : ({ win98: { size: [100, 24] }, ripple: { size: [140, 36] }, toolbar12: { size: [104, 22] }, fab: { size: [64, 64] } }));
    set('RIPPLE_MS', __has('RIPPLE_MS') ? __parts['RIPPLE_MS'](undefined, scopeRef) : (1400));
    set('eraHost', __has('eraHost') ? __parts['eraHost'](undefined, scopeRef) : { eraHost: () => (scopeRef.ERA ? ' ue-' + { win98: 'win98', ripple: 'md', toolbar12: 'tb12', fab: 'fab' }[scopeRef.ERA.mode] : '') }.eraHost);
    scopeRef.env.widget({
      task: 'click-control',
      site: 'base',
      name: 'eras',
      split: 'train',
      scenarios: ['button', 'sequence'],

      render(ctx) {
        scopeRef.ensureStyle('uc-style', scopeRef.CSS);
        scopeRef.ensureStyle('ue-style', scopeRef.CSS3);
        const mode = ctx.rng.fork('era').pick(Object.keys(scopeRef.ERA_MODES));
        scopeRef.ERA = { mode, size: scopeRef.ERA_MODES[mode].size, ripples: [] };
        const { page, content, h1 } = scopeRef.frame(ctx);
        page.classList.add('ue-pg-' + mode);
        scopeRef.blankEl = h1;
        scopeRef.view = scopeRef.mount(ctx, page, content, scopeRef.BUILDERS[ctx.spec.scenario]);
        return { anchors: [page], sync: (m) => { scopeRef.view.sync(m); scopeRef.tickRipples(ctx); } };
      },

      locate(t) {
        return scopeRef.must(scopeRef.view && scopeRef.view.locate(t), t);
      },
    });
  }

  env.template('click-control/_base-eras', () => ({ functions: { eraFit, iconFor, ripple, tickRipples, eraButton, buildFabScreen }, initialize }));
})();
