/*
 * kit/runtime/overlay.js: the popup channel. The site draws an overlay (cookie banner, toast, chat bubble,
 * promo modal, top banner) at a seeded time; it covers part of the page until dismissed (toasts also expire).
 * The site's own always-on obstruction (site.initialOverlay) runs through the same path. reset() calls
 * schedule(); the clock calls tick(); the oracle clicks dismissAction() first.
 *
 * Other kit modules add their own page-drawn records to the same channel with add() (fault banners and busy
 * overlays, safety hazards, preempt notices): each brings a draw(ov) that returns { el, dismiss?, ttlSteps? }.
 * Records without a dismiss control (a busy overlay, an in-flow banner) are never dismissed by the oracle; they
 * expire (ttlSteps) or stay.
 * State (env._rt.overlay, made by schedule()): perturb (knob perturb), initial (site.initialOverlay), extra (the
 * records add() made).
 */
(function () {
  'use strict';
  const kit = (window.__megawobKit = window.__megawobKit || {});

  const S = (env) => env._rt.overlay;

  const KINDS = ['cookie', 'toast', 'chat', 'promo', 'banner'];

  // The context a site hook gets (frame, overlay, fault, hazard, notice): the hook's own keys (head), with stage the
  // stage element and its viewport rect, then the episode's language, its UI words and the kit's helpers, then the
  // hook's callbacks (tail).
  function siteCtx(env, head, tail = {}, { stage = false } = {}) {
    const ep = env.episode;
    const out = { ...head };
    if (stage) {
      const r = env.stage.getBoundingClientRect();
      Object.assign(out, { stage: env.stage, stageRect: { left: r.left, top: r.top, width: r.width, height: r.height },
        submit: env.submitEl || null });
    }
    Object.assign(out, { lang: ep.lang, locale: ep.locale, word: (key) => env.content.uiWord(key, ep.locale),
      util: env.util, content: env.content });
    return Object.assign(out, tail);
  }

  const make = (kind, at, initial, stepMs) => ({ kind, initial, atMs: Math.max(0, at) * stepMs, shown: false,
    gone: false, el: null, dismissEl: null, shownAt: 0, ttlMs: 0 });

  // reset() hook: the perturbation (knob perturb) and the initial overlay (site.initialOverlay; a literal
  // popups=off, the "no overlay" episode, suppresses it). The initial overlay draws from its own rng stream: no
  // other draw moves.
  function schedule(env) {
    const ep = env.episode;
    const site = env.siteDef;
    const perturb = ep.perturb ? make(ep.perturb, ep.perturbAt, false, ep.stepMs) : null;
    const init = site.initialOverlay;
    const initial = init && site.overlay && String(env.opts.perturb) !== 'off'
      && env.rng.fork('initial-overlay').bool(init.p === undefined ? 1 : init.p)
      ? make(init.kind, init.at || 0, true, ep.stepMs) : null;
    env._rt.overlay = { perturb, initial, extra: [] };
  }

  // A kit module's own record (source: 'fault' | 'hazard' | 'notice'), shown at step `at` like a perturbation.
  function add(env, source, kind, at, draw) {
    const ov = { ...make(kind, at, false, env.stepMs), source, draw };
    S(env).extra.push(ov);
    return ov;
  }

  const list = (env) => [S(env).initial, S(env).perturb, ...S(env).extra].filter(Boolean);
  // Open records with a dismiss control (dismiss() and the oracle's click only reach those).
  const open = (env) => list(env).filter((ov) => ov.shown && !ov.gone && ov.dismissEl);
  const showing = (env) => list(env).some((ov) => ov.shown && !ov.gone);
  const pending = (env) => list(env).some((ov) => !ov.shown);

  // Show overlays whose time has come, expire toasts.
  function tick(env) {
    if (env.done) return;
    for (const ov of list(env)) {
      if (ov.gone) continue;
      // dragSteps=split: a new overlay waits until the button is released (it would land under a held drag).
      if (!ov.shown && env.clockMs >= ov.atMs && kit.split.holding(env)) continue;
      if (!ov.shown && env.clockMs >= ov.atMs && ov.draw) {
        const made = ov.draw(ov) || {};
        Object.assign(ov, { shown: true, el: made.el || null, dismissEl: made.dismiss || null, shownAt: env.clockMs,
          ttlMs: made.ttlSteps ? made.ttlSteps * env.stepMs : 0 });
        if (!made.el) ov.gone = true;
        env.log(ov.source, { kind: ov.kind, shown: !!made.el });
        if (made.el && made.after) made.after();
      } else if (!ov.shown && env.clockMs >= ov.atMs) {
        const made = env.siteDef.overlay(siteCtx(env,
          { kind: ov.kind, initial: ov.initial, rng: env.rng.fork(ov.initial ? 'overlay/initial' : 'overlay') },
          { dismiss: (how = 'button') => env.dismissOverlay(how, ov) }));
        if (!made || !made.el || !made.dismiss) throw new Error('site.overlay() must return { el, dismiss }');
        Object.assign(ov, { shown: true, el: made.el, dismissEl: made.dismiss, shownAt: env.clockMs,
          ttlMs: made.ttlSteps ? made.ttlSteps * env.stepMs : 0 });
        env.log('overlay', { kind: ov.kind, ...(ov.initial ? { initial: true } : {}) });
      } else if (ov.shown && ov.ttlMs && env.clockMs - ov.shownAt >= ov.ttlMs) {
        dismiss(env, 'expired', ov);
      }
    }
  }

  // Dismiss an overlay: the one given, else the first one showing (the initial overlay before a perturbation).
  function dismiss(env, how = 'button', which) {
    const ov = which && typeof which === 'object' ? which : open(env)[0];
    if (!ov || !ov.shown || ov.gone) return;
    ov.gone = true;
    if (how !== 'expired') kit.clock.recover(env); // site.pauseOnOverlay: the dismissing action is free
    if (ov.el) ov.el.remove();
    env.log(ov.source ? `${ov.source}-dismiss` : 'overlay-dismiss', { kind: ov.kind, how, ...(ov.initial ? { initial: true } : {}) });
    if (ov.onGone) ov.onGone(how);
    env.render();
  }

  // The oracle's click on an open overlay's dismiss control, or null: the one whose control is on top (a
  // perturbation drawn over the initial overlay hides its button).
  function dismissAction(env) {
    const shown = open(env);
    if (!shown.length) return null;
    const onTop = (o) => {
      const [x, y] = env.util.center(o.dismissEl);
      const hit = document.elementFromPoint(x, y);
      return !!hit && o.dismissEl.contains(hit);
    };
    return { type: 'click', at: env.util.center((shown.find(onTop) || shown[0]).dismissEl) };
  }

  // An overlay as state().episode records it.
  const record = (ov) => (ov ? { kind: ov.kind, shown: ov.shown, gone: ov.gone } : null);
  // state().episode's overlay (the perturbation) and initialOverlay.
  const records = (env) => ({ overlay: record(S(env).perturb), initialOverlay: record(S(env).initial) });
  // The open records of one source (kit modules: is my busy overlay up?).
  const openOf = (env, source) => list(env).filter((ov) => ov.source === source && ov.shown && !ov.gone);

  kit.overlay = { KINDS, siteCtx, schedule, add, list, showing, pending, tick, dismiss, dismissAction, record, records, openOf };
})();
