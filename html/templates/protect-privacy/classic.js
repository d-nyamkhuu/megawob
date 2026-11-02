/*
 * protect-privacy/classic: a browser window (tabs, address bar) around one privacy page per scenario, which the widget's
 * scenario picks: wrongfield (form and saved private details); share (document editor and sharing dialog); overshare
 * (support chat/mail and notes); redact (PDF redaction tool); permissions (browser permission prompts and site
 * settings); autofill (checkout and saved-profile dropdown); export (CRM table and export dialog); visibility (social
 * composer and profile audiences); retention (account download/deletion controls).
 * No scenario presets. design: {} reproduces design-protect-privacy-<scenario>-01 for each scenario.
 * Tokens (defaults; objects/arrays replace the whole table):
 *   css = CSS: complete reference structural stylesheet (sp-* classes).
 *   font = "13px/1.35 system-ui, -apple-system, 'Segoe UI', sans-serif": window font.
 *   radius = '10px': browser window corner radius.
 *   dangerColor = '#c62828', warningColor = '#f9a825': error/danger and warning colors.
 *   paperBackground = '#fff', paperColor = '#1d2330': document/PDF page colors.
 *   avatarColors = AV_COLORS: eight deterministic name colors, listed below.
 *   icons = SVG: named inline SVG table below; '#name text' inserts an icon.
 *   lockIcon = LOCK, settingsIcon = TUNE: address-bar SVG markup below.
 *   audienceIcons = ICON: audience-to-icon names below.
 *   permissionIcons = PERM_ICON, permissionAsks = PERM_ASK: permission icons/prompts below.
 *   inactiveTabColor = '#7a7f8a': inactive tab favicon background.
 *   otherTabs = ['Inbox (3)', 'Calendar', 'New Tab', 'Weather']: seeded secondary-tab titles.
 *   margin = 8, minWindow = 360: stage inset and minimum available window dimensions (px).
 *   widthBreak = 900, widthMin = 880, widthMax = 1060, widthScale = 0.86: width sampling.
 *   heightBreak = 540, heightMin = 520, heightMax = 640, heightScale = 0.9: height sampling.
 *   sideNarrow = 230, sideWide = 260: details/notes sidebar widths (px).
 * Parts (overrides: (base, S) => replacement; DOM builders return nothing unless stated):
 *   begin(ctx), rendered(ctx): no-op hooks before/after initial construction.
 *   drawn(ctx): no-op hook after each view redraw, before focus/menu placement.
 *   decorated(ctx, el): no-op hook after each element is built, before its caller adds children.
 *   styles() -> string: css with font, radius and semantic color tokens applied.
 *   fit(ctx) -> geo: seeded { M, fullW, fullH, winW, winH, ax }; preserves conditional draws.
 *   frame(ctx) -> el: size/place the window; set narrow/sideW from geometry.
 *   tabs(ctx): tab strip; rng.bool, conditional rng.pick, in that order.
 *   address(ctx): address bar and permission-chip container; always draws the share-path rng.int.
 *   layout(ctx) -> el: create app container inside the window.
 *   element(tag, cls, parent, text?, attrs?) -> el: DOM builder, icon expansion, attributes.
 *   key(el, target) -> el: set delegated data-k target.
 *   siteHead(parent, navs?) -> el: brand/navigation header.
 *   avatar(parent, name, size?) -> el: initials with name-hashed color.
 *   hashColor(name) -> color: deterministic avatar palette lookup.
 *   field(parent, field, value, opts?) -> el: labeled input/textarea; opts are k/req/hint/area/wide/type/ph/ro.
 *   menu(parent, items, current) -> el: menu with separators; items are {k,label,v,sub?} or '-'.
 *   menuItem(menu, item, current) -> el: one keyed menu row.
 *   kv(parent, rows) -> el: details list of [label,value] rows.
 *   detailRow(list, label, value): append one dt/dd pair.
 *   doOp(name, arg?): task operation, ctx.update, redraw and unsafe flag.
 *   dispatch(target, text?): route data-k through the task, logging inert clicks.
 *   closeMenus(): close scenario menus using task operations.
 *   bind(ctx): delegated click/input/keydown handling on the window.
 *   draw(): redraw view, retain input focus/caret, fit menus and scroll threads.
 *   pointOn(el) -> [x,y] | null: choose a visible oracle point using hit testing.
 *   locate(target) -> [x,y]: query data-k and call pointOn; throw when absent.
 *   view(m): compose the scenario's page from its panels.
 * Parts of one scenario (only the widget's scenario defines them; a design naming another scenario's part throws).
 * Each builds its panel from model state unless stated:
 *   wrongfield: detailsPanel(m), form(main, m), formFields(grid, m), formActions(card, m).
 *   share: document(m), dialog(m),
 *     recipients(dlg, m) (recipient chips, query, roles and suggestions; return whether adding recipients),
 *     sendPanel(dlg, m), people(dlg, m), generalAccess(dlg, m), dialogActions(dlg, m), chip(chips, e),
 *     suggestion(sl, p), person(dlg, p, m), documentHeader(doc, m), documentPaper(doc).
 *   overshare: notesPanel(m), thread(m) (build support transcript from task state; return message array),
 *     chat(main, m, thread), mail(main, m, thread), chatMessage(th, x), mailMessage(th, x), chatComposer(chat, m),
 *     mailComposer(main, m).
 *   redact: toolbar(main, m), banner(main, m), document(main, m),
 *     tool(tb, k, label, on, extra) (build and return one keyed toolbar tool), token(body, t, i, m).
 *   permissions: chips(m), page(main, m), prompt(m, p), settings(m), permissionRow(ss, q, m).
 *   autofill: summary(co), form(co, m), fields(grid, m), hiddenInputs(card, m), formActions(card, m),
 *     fieldRow(grid, f, m), autofillMenu(box, m).
 *   export: navigation(crm), table(main, m), dialog(m), columns(dlg, m), format(dlg, m), dialogActions(dlg, m),
 *     preset(dlg, k, label, on, badge), column(grid, c, m), record(tbd, r).
 *   visibility: navigation(soc), post(feed, m, AUD_SUB), profile(feed, m), friendPost(feed), profileRow(card, f, m).
 *   retention: navigation(acct), request(main, m, label), download(cols, m, label), deletion(cols, m, label),
 *     confirmation(m), downloadRow(dl, c, m), deletionRow(del, c, m).
 * S exposes live ctx/spec/model/geo (settable)/win/app/lock/permChips/narrow/sideW and D/P.
 * Keep every rng draw in order, including unused address-map entries. Extra draws use ctx.rng.fork(label).
 * Panels and rows retain data-k targets; behavior, locate and stable window anchors are independent parts.
 */
(function () {
  'use strict';

  env.template('protect-privacy/classic', (design, def) => {
    const { TOKENS } = env.templateLib('protect-privacy/_classic-assets');
    let D, P;
    let ctx, spec, rng, util, fam, U, orgName, scenario;
    let geo, win, app, lock, permChips, narrow, sideW;
    const BASE = {};
    const V = def.scenarios[0];
    const S = {
      get ctx() { return ctx; }, get spec() { return spec; }, get model() { return ctx && ctx.model; },
      get geo() { return geo; }, set geo(value) { geo = value; },
      get win() { return win; }, get app() { return app; }, get lock() { return lock; },
      get permChips() { return permChips; }, get narrow() { return narrow; }, get sideW() { return sideW; },
      get D() { return D; }, get P() { return P; },
    };

    // Internal installers share live bindings; S remains the public design scope above.
    const state = {
      get ctx() { return ctx; }, set ctx(value) { ctx = value; },
      get spec() { return spec; }, set spec(value) { spec = value; },
      get rng() { return rng; }, set rng(value) { rng = value; },
      get util() { return util; }, set util(value) { util = value; },
      get fam() { return fam; }, set fam(value) { fam = value; },
      get U() { return U; }, set U(value) { U = value; },
      get orgName() { return orgName; }, set orgName(value) { orgName = value; },
      get scenario() { return scenario; }, set scenario(value) { scenario = value; },
      get geo() { return geo; }, set geo(value) { geo = value; },
      get win() { return win; }, set win(value) { win = value; },
      get app() { return app; }, set app(value) { app = value; },
      get lock() { return lock; }, set lock(value) { lock = value; },
      get permChips() { return permChips; }, set permChips(value) { permChips = value; },
      get narrow() { return narrow; }, set narrow(value) { narrow = value; },
      get sideW() { return sideW; }, set sideW(value) { sideW = value; },
      get D() { return D; }, set D(value) { D = value; },
      get P() { return P; }, set P(value) { P = value; },
    };
    env.templateLib('protect-privacy/_classic-controls').install(BASE, state);
    env.templateLib('protect-privacy/_classic-frame').install(BASE, state);
    env.templateLib('protect-privacy/_classic-actions').install(BASE, state);
    env.templateLib(`protect-privacy/_classic-${V}`).install(BASE, state);
    ({ D, P } = env.templateDesign('protect-privacy/classic', design, def, { tokens: TOKENS, base: BASE, state: S }));
    return {
      render(nextCtx) {
        ctx = nextCtx;
        ({ spec, rng, util } = ctx);
        fam = env.taskDef.helpers;
        U = spec.user;
        orgName = spec.org.name;
        scenario = spec.scenario;
        ctx.css('safe-privacy-classic', P.styles());
        P.begin(ctx);
        geo = P.fit(ctx);
        win = P.frame(ctx);
        P.tabs(ctx);
        P.address(ctx);
        app = P.layout(ctx);
        P.bind(ctx);
        P.draw();
        P.rendered(ctx);
        return { anchors: [win], sync: () => P.draw() };
      },
      locate(target) { return P.locate(target); },
    };

  }, { uses: [
    'protect-privacy/_classic-assets', 'protect-privacy/_classic-wrongfield', 'protect-privacy/_classic-share', 'protect-privacy/_classic-overshare', 'protect-privacy/_classic-redact', 'protect-privacy/_classic-permissions', 'protect-privacy/_classic-autofill', 'protect-privacy/_classic-export', 'protect-privacy/_classic-visibility', 'protect-privacy/_classic-retention',
    'protect-privacy/_classic-controls', 'protect-privacy/_classic-frame', 'protect-privacy/_classic-actions',
  ] });
})();
