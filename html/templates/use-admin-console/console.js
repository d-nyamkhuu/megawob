/*
 * use-admin-console/console: enterprise administration console shared by all five workflows.
 * Scenarios: vm (deployment wizard), iam (directory access), resetuser (credential reset),
 * tickets (queue assignment), quota (nested settings and regional limits). They share the
 * frame, paged tables, controls, policy panels and dialogs; there are no scenario presets.
 * With design: {} each scenario reproduces design-use-admin-console-<scenario>-01 exactly:
 * design-use-admin-console-vm-01, design-use-admin-console-iam-01, design-use-admin-console-resetuser-01,
 * design-use-admin-console-tickets-01 and design-use-admin-console-quota-01.
 * CSS uses aa-* classes and the site's --panel/--line/--accent/--muted/--fg/--bg palette.
 * Tokens (defaults):
 *   inset = 20: total stage width/height reserved outside the shell (px).
 *   minWidth = 280: minimum shell width (px).
 *   minHeight = 220: minimum shell height (px).
 *   narrowAt = 880: shell width below which the sidebar shows icons only.
 *   tinyAt = 610: shell width below which search and extra commands are hidden.
 *   shortAt = 415: shell height below which vertical spacing is reduced.
 *   contextAt = 1140: shell width at which the resource context rail appears.
 *   compactAt = 660: pane width below which extra table columns are omitted.
 *   sidebarWidth = 166: full sidebar width (px), used in CSS and pane sizing.
 *   narrowSidebarWidth = 42: collapsed sidebar width (px), used in CSS and pane sizing.
 *   contextWidth = 216: context rail width (px), used in CSS and pane sizing.
 *   pageSize = 10: records per directory/ticket page, mirrored into the model.
 *   fontSize = 12: base console font size (px).
 *   fontFamily = 'system-ui,-apple-system,"Segoe UI",sans-serif': console font stack.
 *   radius = 5: shell and dialog corner radius (px).
 *   dialogWidth = 440: maximum dialog width (px).
 *   danger = '#b63e46': destructive button background and border.
 *   warning = '#bf8a36': warning banner border and background tint.
 *   warningIcon = '#bc8b40': warning banner icon color.
 *   positive = '#378b70': normal status dot color.
 *   statusWarning = '#b98334': warning status dot color.
 *   error = '#c05b55': error notice foreground.
 *   errorFill = '#ba4842': error notice background tint.
 *   overlay = '#080d1673': dialog backdrop color.
 *   brand = 'Northstar': topbar brand and breadcrumb label.
 *   searchPlaceholder = 'Search resources and services': global search placeholder/label.
 *   icons = PATHS: SVG path table (24 x 24); unknown glyphs use icons.document.
 *   titles = { vm: 'Virtual machines', iam: 'Users & access', resetuser: 'User security',
 *     tickets: 'Helpdesk tickets', quota: 'Limits & quotas' }: workspace headings.
 *   glyphs = { vm: 'compute', iam: 'users', resetuser: 'shield', tickets: 'ticket',
 *     quota: 'quota' }: workspace heading icons.
 * Parts: overrides are (base, S) => replacement; all internal calls use P.
 *   icon(parent, name, cls = '') -> svg: append an inline glyph.
 *   button(parent, label, target, action, cls = '', glyph) -> button: bind target/action.
 *   preview(parent, label, glyph, title = label, cls = '') -> button: open read-only dialog.
 *   picker(parent, id, value) -> button: registered picker trigger with chevron.
 *   status(parent, text, tone = '') -> span: status dot and text.
 *   banner(parent, title, text, warn = false) -> div: policy or warning notice.
 *   section(parent, title, glyph) -> body: bordered panel with icon heading.
 *   readonly(parent, pairs): label/value grid with policy lock glyphs.
 *   actions(parent = workspace) -> div: command strip.
 *   miniTable(parent, labels, rows) -> table: read-only inventory table.
 *   history(parent, entries): activity list using P.activity.
 *   pager(records, m): page count and registered page buttons below the table.
 *   table(parent, labels, cls) -> tbody: table frame and sticky column headings.
 *   user(parent, user, target) -> div: avatar, name link and email.
 *   sidebar(frame): grouped service navigation and service-health footer.
 *   topbar(): organization header, search, notifications and account avatar.
 *   vm(m): deployment fields/review, cost summary, related inventory and commands.
 *   directory(m): shared IAM/reset directory, audit history, pager and reset controls.
 *   tickets(m): open-ticket table, routing audit history, pager and confirm command.
 *   quota(m): folder navigation or quota statistics/input, plus save/up commands.
 *   related(parent, scenario): related-resource panel and inventory table.
 *   context(parent, m): resource context rail, related projects and activity.
 *   modal(m): choose preview, options, access editor or reset confirmation; track clipping.
 *   mirrorClipped(): mirror hidden target offsets into unscored model.clipped.
 *   draw(m): rebuild the shell contents, restore scroll and mirror target visibility.
 *   act(action, redraw = true): apply task mutation, guard confirmation, redraw.
 *   heading(m): breadcrumbs, workspace title, policy chip and subtitle.
 *   tabs(m): workflow tab strip and preview links.
 *   toolbar(m): saved view, filter, refresh, scope and export controls.
 *   workflow(m): ambiguous-account view or dispatch to the scenario widget.
 *   notice(m): render model notice, with error styling for invalid input.
 *   facts(m): footer showing task-owned resource and action facts.
 *   frame() -> div: create frame, call sidebar, assign the workspace.
 *   content() -> div: content row containing main pane and optional context rail.
 *   main(parent) -> div: registered scroll pane; mirror clipping on live scroll events.
 *   directoryRow(body, user, m): one selectable user/access/status table row.
 *   ticketRow(body, ticket, m): one ticket/priority/queue table row.
 *   folder(box, name, index, m): one quota-folder button with description and chevron.
 *   option(body, id, value, current): registered option button, details and selection tick.
 *   resetControls(m, active): reset action, notification checkbox and review command.
 *   dialog(m) -> { dialog, title, body }: modal frame, heading and close control.
 *   previewBody(body, m): read-only overview/search content for the current preview.
 *   contextSection(aside, title, glyph) -> section: context rail panel heading.
 *   activity(parent, text, detail) -> div: one timestamped activity row.
 *   style(): install tokenized structural CSS through ctx.css.
 *   fit(ctx) -> geo: stage-derived width/height and responsive layout flags.
 *   shell(ctx) -> div: sized root and narrow/tiny/short classes, using S.geo.
 *   begin(ctx): before geometry/layout (default: nothing).
 *   decorated(ctx, m): after pane/footer, before scroll/modal/clipping (default: nothing).
 *   rendered(ctx): after initial draw (default: nothing).
 *   locate(target) -> [x, y]: read registered target or dialog/pane geometry; no DOM writes.
 * S.ctx/spec/geo/shell/workspace/main/ui/targets expose live page state; S.put(target, node)
 * registers replacement controls; S.workspace is settable for frame overrides.
 * S.D/P expose resolved tokens/parts. geo contains width, height,
 * narrow, tiny, short, withContext, paneWidth and compact. The shell is the stable anchor.
 * The source widget makes no rng draws. Keep that order; extra decorative randomness must use
 * ctx.rng.fork(label). Unknown tokens/parts throw through env.templateDesign.
 */
(function () {
  'use strict';

  env.template('use-admin-console/console', (design, def) => {
    const { CSS, TOKENS } = env.templateLib('use-admin-console/_assets');
    let D, P;
    let ctx, s, util, f, el, geo, shell, workspace, main, ui, targets, drawing;
    let width, height, narrow, tiny, short, withContext, paneWidth, compact;
    const key = t => JSON.stringify(t), put = (t, node) => { targets[key(t)] = node; return node; };
    const BASE = {};
    const S = {
      get ctx() { return ctx; }, get spec() { return s; },
      get geo() { return geo; }, get shell() { return shell; },
      get workspace() { return workspace; }, set workspace(node) { workspace = node; },
      get main() { return main; },
      get ui() { return ui; }, get targets() { return targets; },
      get D() { return D; }, get P() { return P; }, put,
    };

    // Private state for the part installers; S above remains the design's public scope.
    const W = {
      get D() { return D; },
      get P() { return P; },
      get ctx() { return ctx; },
      get s() { return s; },
      get f() { return f; },
      get el() { return el; },
      get shell() { return shell; },
      get workspace() { return workspace; }, set workspace(value) { workspace = value; },
      get main() { return main; }, set main(value) { main = value; },
      get ui() { return ui; },
      get targets() { return targets; }, set targets(value) { targets = value; },
      get drawing() { return drawing; }, set drawing(value) { drawing = value; },
      get narrow() { return narrow; },
      get tiny() { return tiny; },
      get withContext() { return withContext; },
      get compact() { return compact; },
      get put() { return put; },
    };

    env.templateLib('use-admin-console/_controls').install(BASE, W);

    env.templateLib('use-admin-console/_workflows').install(BASE, W);

    env.templateLib('use-admin-console/_overlays').install(BASE, W);

    env.templateLib('use-admin-console/_workspace').install(BASE, W);

    env.templateLib('use-admin-console/_records').install(BASE, W);

    env.templateLib('use-admin-console/_preview').install(BASE, W);

    BASE.style = () => {
      ctx.css('app-admin-classic', CSS(D));
    };

    BASE.fit = (ctx) => {
      const width = Math.max(D.minWidth, ctx.size.width - D.inset), height = Math.max(D.minHeight, ctx.size.height - D.inset);
      const narrow = width < D.narrowAt, tiny = width < D.tinyAt, short = height < D.shortAt, withContext = width >= D.contextAt;
      const paneWidth = width - (narrow ? D.narrowSidebarWidth : D.sidebarWidth) - (withContext ? D.contextWidth : 0), compact = paneWidth < D.compactAt;
      return { width, height, narrow, tiny, short, withContext, paneWidth, compact };
    };

    BASE.shell = (ctx) => {
      const node = el('div', 'aa-shell', ctx.stage); node.style.width = `${width}px`; node.style.height = `${height}px`;
      if (narrow) node.classList.add('aa-narrow'); if (tiny) node.classList.add('aa-tiny'); if (short) node.classList.add('aa-short');
      return node;
    };

    BASE.begin = (ctx) => {};

    BASE.decorated = (ctx, m) => {};

    BASE.rendered = (ctx) => {};

    BASE.locate = (target) => {
      const node = target.pane ? (shell.querySelector('.aa-dialog') || main) : targets[key(target)];
      if (!node) throw new Error(`use-admin-console/classic missing target ${key(target)}`);
      const box = node.getBoundingClientRect();
      if (target.pane) return [box.left + Math.min(35, box.width / 2), box.top + box.height / 2];
      return [box.left + box.width / 2, box.top + box.height / 2];
    };

    ({ D, P } = env.templateDesign('use-admin-console/console', design, def, { tokens: TOKENS, base: BASE, state: S }));
    return {
      render(context) {
        ctx = context; s = ctx.spec; util = ctx.util; f = env.taskDef; el = util.el;
        P.style(); P.begin(ctx);
        geo = P.fit(ctx);
        ({ width, height, narrow, tiny, short, withContext, paneWidth, compact } = geo);
        shell = P.shell(ctx);
        const pageSize = D.pageSize;
        ctx.update({ ...ctx.model, pageSize, page: Math.min(ctx.model.page, Math.ceil(s.users.length / pageSize) - 1), clipped: {} });
        ui = { preview: null, scroll: 0, search: '', refreshed: false };
        targets = {}; workspace = null; main = null; drawing = false;
        P.draw(ctx.model);
        P.rendered(ctx);
        return { anchors: [shell], sync: (m) => P.draw(m) };
      },
      locate(target) { return P.locate(target); },
    };
  }, { uses: ['use-admin-console/_assets', 'use-admin-console/_controls', 'use-admin-console/_workflows', 'use-admin-console/_overlays', 'use-admin-console/_workspace', 'use-admin-console/_records', 'use-admin-console/_preview'] });
})();
