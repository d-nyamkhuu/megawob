/*
 * avoid-dark-patterns/browser: a fictional site inside a browser window, shared by all twelve scenarios.
 * Scenarios and exact design: {} baselines (no scenario presets):
 *   bait: design-avoid-dark-patterns-bait-01
 *   confirmshame: design-avoid-dark-patterns-confirmshame-01
 *   disguised: design-avoid-dark-patterns-disguised-01
 *   forced: design-avoid-dark-patterns-forced-01
 *   hiddencost: design-avoid-dark-patterns-hiddencost-01
 *   nag: design-avoid-dark-patterns-nag-01
 *   precheck: design-avoid-dark-patterns-precheck-01
 *   privacy: design-avoid-dark-patterns-privacy-01
 *   roach: design-avoid-dark-patterns-roach-01
 *   sneak: design-avoid-dark-patterns-sneak-01
 *   trickq: design-avoid-dark-patterns-trickq-01
 *   urgency: design-avoid-dark-patterns-urgency-01
 * Assets live in _browser-assets.js; _browser-{frame,controls,form,choices,content,pages}.js install the parts.
 * All scenarios share spec.screens/ctls/modals and the same block renderer. Site/app kinds change the
 * header; screen dialogs cover an underlying page, and offer/nag modals cover the current screen.
 * Clicks retain fam.act/update/paint/flag order; the address bar remains the stable anchor.
 *
 * Tokens (whole objects/tables replace their defaults, rather than merging):
 *   font: 13.5px/1.38 system-ui, -apple-system, 'Segoe UI', sans-serif; window shorthand font.
 *   windowRadius: '10px'; windowShadow: '0 2px 4px rgba(0,0,0,.05), 0 14px 36px rgba(0,0,0,.13)'.
 *   dimColor: 'rgba(12, 16, 24, .5)'; dialog scrim color.
 *   colors: {}; CSS custom properties set on the window, e.g. { '--b': '#345', '--fg': '#123' }.
 *     Defaults inherit --panel/--fg/--bg/--line/--muted from the site; --b/--bs/--bfg/--ad/--warn/
 *     --bad/--good retain the reference's theme-sensitive colors. Inline values override those colors.
 *   geometry: { margin: 8, minWidth: 360, minHeight: 360, widthBreakpoint: 900, widthMin: 880,
 *     widthMax: 1080, widthScale: [0.86, 1], heightBreakpoint: 560, heightMin: 540, heightMax: 660,
 *     heightScale: [0.9, 1], sideBreakpoint: 900, sideNarrow: 240, sideRange: [255, 290] }; pixels
 *     and sampled scale ranges for window/sidebar sizing; keep conditional rng draws in order.
 *   alignments: ['left', 'center', 'center', 'right']; sampled horizontal window alignment.
 *   radii: [6, 8, 10, 999]; sampled button radius (px).
 *   adMarks: ['Ad', 'Sponsored', 'Advertisement', 'Ad ⓘ']; sampled ad disclosure.
 *   headLinks: HEAD_LINKS below; app-kind -> arrays of sampled navigation label lists.
 *   bylines: ['By staff reporters', 'By our correspondent', 'By the news desk']; sampled author text.
 *   extraTabs: ['Inbox (4)', 'Calendar', 'New Tab', 'Weather', 'Maps']; optional second tab title.
 *   icons: ICONS below; lock/clock/users/fire/gift/shield/crown/truck/mail/bell/star/heart/alert SVGs.
 *   thumbHues: [12, 38, 160, 200, 230, 268, 300, 340, 90, 180]; deterministic label-hashed gradients.
 *   summaryTitle: 'Order summary'; subtotalLabel: 'Subtotal'; totalLabel: 'Total'; summary captions.
 *   freeLabel: 'Free'; soldOutLabel: 'Sold out'; selectLabel: 'Select'; searchLabel: 'Search'.
 *   compactClasses: ['c1', 'c2', 'c3']; cumulative fitting steps, in order.
 *
 * Parts: design.parts[name] = (base, S) => replacement. All calls use P, including inner builders.
 * S.ctx/spec/app/geo/look/sideW/win/bar/page/hostEl/pathEl/tabTitle/ctlEls/D/P read live page state;
 * geo/look/sideW and DOM references/control map are settable for replacement layouts.
 * Parts without a return annotation return undefined; decorative hooks default to nothing.
 * geo = { M, fullW, fullH, winW, winH, ax }; m is the live model, b a spec block, sc a screen.
 * A replacement tabs/addressBar part must set S.tabTitle / S.hostEl / S.pathEl / S.bar for paint/anchors.
 *   hits(el, x, y) -> bool: test whether el contains the element at the viewport point.
 *   pointOf(el) -> point|null: find an unobscured interior point, then fall back to the center.
 *   style(ctx): install the structural stylesheet with font/window/scrim tokens.
 *   fit(ctx) -> geo: sample the stage-relative window geometry and alignment.
 *   frame(ctx) -> win: build and position the window, with brand hue and optional color overrides.
 *   appearance(ctx): sample sidebar width and visual choices, then set --r (retains all rng draws).
 *   tabs(ctx): build tab strip, traffic lights, title, and optional extra tab (rng).
 *   addressBar(ctx): build the stable address bar and host/path labels.
 *   page(ctx) -> page: create the flexible page surface.
 *   onCtl(id): apply a control, update the model, paint, then flag unsafe actions; ignore done models.
 *   header(parent, m) -> header: app logo, navigation, search, and current cart count.
 *   cartCount(m) -> number: active basket quantity, excluding fees.
 *   ctlBtn(id, parent, extra = '') -> button|null: build, bind, and register a spec control, using its style and label.
 *   bind(id, node) -> node: register its data-ctl, click handler, and oracle target.
 *   fill(m, t) -> text: fill model-dependent spec content.
 *   money(n, mo) -> text: format currency, Free, and monthly suffix.
 *   swatch(s) -> CSS gradient: deterministic thumbnail color from label hash (no rng).
 *   h(b, parent, m) -> null: heading with optional back control.
 *   h2(b, parent, m) -> null: subheading.
 *   p(b, parent, m) -> null: model-filled paragraph and tone.
 *   note(b, parent, m) -> null: optional note.
 *   error(b, parent, m) -> null: current inline form error.
 *   ok(b, parent, m) -> null: confirmation icon and text.
 *   kv(b, parent, m) -> null: label/value rows.
 *   line(b, parent, m) -> null: active basket line, quantity controls, price and Remove.
 *   also(b, parent, m) -> null: inactive recommendation with Add control.
 *   check(b, parent, m) -> check container: checkbox/switch row, lock state, subtext and price.
 *   options(b, parent, m) -> null: delivery/radio collection through P.option.
 *   cards(b, parent, m) -> null: listing collection through P.listingCard.
 *   cards2(b, parent, m) -> null: plan comparison through P.planCard.
 *   chips(b, parent, m) -> null: selected choice chips.
 *   stepper(b, parent, m) -> null: quantity label and decrement/value/increment controls.
 *   list(b, parent, m) -> null: item/headline collection through P.listItem.
 *   sum(b, parent, m) -> null: task-computed order rows, fees, subtotal and total.
 *   badge(b, parent, m) -> null: urgency/scarcity/social-proof icon and text.
 *   banner(b, parent, m) -> null: upsell banner with control.
 *   notice(b, parent, m) -> null: conditional substitution notice with optional control.
 *   hero(b, parent, m) -> null: retention headline and paragraph.
 *   plan(b, parent, m) -> null: current plan, perks and price.
 *   ad(b, parent, m) -> null: disclosed advertisement with control.
 *   file(b, parent, m) -> null: file extension, name and metadata.
 *   product(b, parent, m) -> null: deal thumbnail, name and current/previous prices.
 *   canvas(b, parent, m) -> null: named editor canvas.
 *   media(b, parent, m) -> null: item-derived media thumbnail.
 *   article(b, parent, m) -> null: article title, sampled byline and body.
 *   btns(b, parent, m) -> null: horizontal/stacked control group.
 *   option(id, box, m) -> undefined: build and bind one radio/delivery option with state, price and badge.
 *   listingCard(id, box, m) -> undefined: build and bind one listing card with thumbnail and Select button.
 *   planCard(item, box, m) -> undefined: build and bind one comparison plan card with optional control.
 *   listItem(id, box, m) -> undefined: build and bind one headline/item list row.
 *   block(b, parent, m) -> check container|null: dispatch a declarative block to its replaceable part.
 *   blocks(list, parent, m): render an ordered block list, grouping adjacent checks.
 *   screenBody(sc, parent, m) -> body: create body and compose main/optional side panels.
 *   pageFor(sid, parent, m): draw the screen header, optional app rail, and content.
 *   dialog(parent, list, m, cls) -> dialog: build consent/options scrim and its block list.
 *   modalEl(parent, md) -> dialog: build offer/nag modal art, title, text, and controls.
 *   fits() -> bool: check page, panels, and dialogs for overflow.
 *   paint(m): redraw current screen/modal, update browser labels, and apply fitting steps.
 *   main(sc, body, m) -> main: build the main block panel.
 *   side(sc, body, m) -> side: build the sidebar at the sampled width.
 *   decorated(ctx): after window/frame construction, before initial paint; default noop.
 *   rendered(ctx): after initial paint; default noop.
 *   anchors(ctx) -> elements: the address bar, stable across paints.
 *   sync(m): redraw after external model updates.
 *   locate(t) -> point: locate a registered control; throw when absent.
 * Preserve every rng draw in fit, appearance and tabs in order; additional random decoration uses
 * ctx.rng.fork(label). Unknown tokens and parts throw through env.templateDesign.
 */
(function () {
  'use strict';

  env.template('avoid-dark-patterns/browser', (design, def) => {
    const { TOKENS } = env.templateLib('avoid-dark-patterns/_browser-assets');
    let D;
    let P;
    let ctx;
    let spec;
    let rng;
    let util;
    let fam;
    let app;
    let el;
    let geo;
    let look;
    let sideW;
    let win;
    let bar;
    let page;
    let tabTitle;
    let hostEl;
    let pathEl;
    let ctlEls = {};
    const BASE = {};
    const S = {
      get ctx() { return ctx; },
      get rng() { return rng; },
      get fam() { return fam; },
      get el() { return el; },
      get spec() { return spec; },
      get app() { return app; },
      get D() { return D; },
      get P() { return P; },
      get geo() { return geo; },
      set geo(value) { geo = value; },
      get look() { return look; },
      set look(value) { look = value; },
      get sideW() { return sideW; },
      set sideW(value) { sideW = value; },
      get win() { return win; },
      set win(value) { win = value; },
      get bar() { return bar; },
      set bar(value) { bar = value; },
      get page() { return page; },
      set page(value) { page = value; },
      get tabTitle() { return tabTitle; },
      set tabTitle(value) { tabTitle = value; },
      get hostEl() { return hostEl; },
      set hostEl(value) { hostEl = value; },
      get pathEl() { return pathEl; },
      set pathEl(value) { pathEl = value; },
      get ctlEls() { return ctlEls; },
      set ctlEls(value) { ctlEls = value; },
    };

    env.templateLib('avoid-dark-patterns/_browser-frame').install(BASE, S);
    env.templateLib('avoid-dark-patterns/_browser-controls').install(BASE, S);
    env.templateLib('avoid-dark-patterns/_browser-form').install(BASE, S);
    env.templateLib('avoid-dark-patterns/_browser-choices').install(BASE, S);
    env.templateLib('avoid-dark-patterns/_browser-content').install(BASE, S);
    env.templateLib('avoid-dark-patterns/_browser-pages').install(BASE, S);

    ({ D, P } = env.templateDesign('avoid-dark-patterns/browser', design, def, { tokens: TOKENS, base: BASE, state: S }));

    return {
      render(nextCtx) {
        ctx = nextCtx;
        ({ spec, rng, util } = ctx);
        fam = env.taskDef.helpers;
        app = spec.app;
        el = util.el;
        ctlEls = {};
        P.style(ctx);
        geo = P.fit(ctx);
        win = P.frame(ctx);
        P.appearance(ctx);
        P.tabs(ctx);
        P.addressBar(ctx);
        page = P.page(ctx);
        P.decorated(ctx);
        P.paint(ctx.model);
        P.rendered(ctx);
        return { anchors: P.anchors(ctx), sync: (m) => P.sync(m) };
      },

      locate(t) {
        return P.locate(t);
      },
    };
  }, { uses: [
    'avoid-dark-patterns/_browser-assets', 'avoid-dark-patterns/_browser-frame', 'avoid-dark-patterns/_browser-controls',
    'avoid-dark-patterns/_browser-form', 'avoid-dark-patterns/_browser-choices', 'avoid-dark-patterns/_browser-content', 'avoid-dark-patterns/_browser-pages',
  ] });
})();
