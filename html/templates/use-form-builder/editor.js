/*
 * use-form-builder/editor: Fieldnote draft editor shared by addq, branching, reorder, settings and validation.
 * With design: {}, each scenario reproduces its scaffolded pilot exactly:
 *   addq: design-use-form-builder-addq-01; branching: design-use-form-builder-branching-01;
 *   reorder-items: design-use-form-builder-reorder-01; settings: design-use-form-builder-settings-01;
 *   validation: design-use-form-builder-validation-01. No scenario presets: every scenario uses the same editor.
 *
 * Tokens (defaults):
 *   accent ('var(--accent)'), background ('var(--bg)'), panel ('var(--panel)'), text ('var(--fg)'),
 *   muted ('var(--muted)'), line ('var(--line)'): CSS theme colors, inherited from site frame by default.
 *   fontFamily (null): optional frame font; null inherits. fontSize ('13px'): base app font size.
 *   radius ('10px'): frame corner radius. inset (10), noteGap (8): stage inset and note clearance, px.
 *   compactWidth (900), smallNavWidth (830): ctx.size.width responsive breakpoints, px.
 *   sidebarWidth (158), smallSidebarWidth (43): expanded and collapsed navigation widths, px.
 *   columns ('minmax(160px, 1fr) minmax(245px, .9fr)'): canvas/inspector CSS grid columns.
 *   policyWidth (780): body-width breakpoint for publishing sidebar, px; policyPanelWidth (218): its width.
 *   menuWidth (260): minimum picker width, px. rowMin (34), rowMax (43): sortable row bounds, px.
 *   previewOptions (2): maximum options shown in each question card before the remainder count.
 *   brand ('Fieldnote'), workspace ('Team workspace'): draft breadcrumb and sidebar workspace labels.
 *   icons (ICONS below): complete table of SVG path arrays in a 24x24 viewBox; replaced whole.
 *   typeIcons (short text/text, paragraph/paragraph, multiple choice/radio, checkboxes/checkbox, number/number):
 *     complete question-type/icon table, with 'form' fallback; exact task labels in TOKENS below.
 *   neighboringForms (Event registration, Customer onboarding, Quarterly pulse, Speaker proposals,
 *     Volunteer interest, Partner request): adjacent form titles, in order.
 *   tabs (questions/Questions, logic/Logic, arrange/Arrange, settings/Settings): editor tab id/label pairs.
 *   typeDetails (TOKENS below): complete short-text/paragraph/choice/checkbox/number picker descriptions.
 *
 * Parts are (base, S) => replacement; all part calls use P. Every part takes st as its first argument
 * (the episode object); the arguments documented below follow st. A part returns undefined unless noted.
 * S.st/ctx/spec/root/els read the current episode; S.D/P read resolved tokens/parts. S.els is the episode
 * object, exposing top, workspace, nav, editor, tabs, tabButtons, sections, body, foot, targets, panes, sorts,
 * syncers, menus, peers and neighboringForms. Keep model/target/sync behavior when replacing visual parts.
 *   styles(): install structural CSS, using theme and geometry tokens.
 *   frame(): -> root: fixed frame, responsive classes and note clearance.
 *   register(t,node,pane): -> node: register a model target and optional scroll pane.
 *   el(tag,cls,parent,text): -> element: DOM element helper.
 *   button(label,parent,t,act,cls=''): -> button: text, target registration and model action.
 *   icon(name,parent,size=16): -> svg: inline icon from the icons token.
 *   typeIcon(type): -> name: map a question type to its icon.
 *   iconButton(label,parent,name,fn,cls=''): -> button: accessible icon action.
 *   content(): sample two collaborators on workspace-content fork, retain adjacent form names.
 *   topbar(): build draft heading, collaborators, preview and share actions.
 *   layout(): build workspace, sidebar, editor, tabs, section strip, body and footer.
 *   sidebar(): build workspace navigation and plan meter.
 *   navButton(label,name,fn,cls='',count=''): -> button: one accessible workspace navigation row.
 *   tabs(): build registered editor tabs and responses/theme tools.
 *   status(): refresh the unscored facts footer.
 *   mirror(): mirror clipped target geometry into model.view; ignore stale episodes.
 *   commit(act,rebuild=true): apply an authoring action, then repaint or sync fields and facts.
 *   pane(name,cls,parent=body): -> element: registered inner pane with scroll/wheel mirroring.
 *   field(label,name,value,parent,paneName,multiline=false): -> input: registered text field with input action and sync.
 *   select(label,name,value,parent,paneName): -> button: registered DOM menu trigger.
 *   toggle(label,hint,name,on,parent,paneName): -> button: labeled accessible response-policy switch.
 *   journey(parent): build respondent journey list.
 *   canvas(parent): build form heading, question cards and add control or journey.
 *   inspector(p): build routing or question properties and validation.
 *   orderList(name,parent,ids,labelOf): build registered sortable rows and preserve reorder actions.
 *   menu(): build DOM picker from task options, anchored inside the frame.
 *   drawer(kind): build widget-local forms, history, activity, share, responses or theme dialog.
 *   paint(): rebuild body, retain scroll, refresh syncers/geometry, menus and preview.
 *   canvasHeader(parent,sec): build draft introduction and current section heading.
 *   questionCard(parent,sec,id,q): -> card: selectable question with registered action and live preview.
 *   questionPreview(preview,now): refresh sample answer lines/options from current question.
 *   addControl(parent): build registered Add question action and section-end note.
 *   journeyRow(box,id,i): build one numbered respondent journey row.
 *   routing(p,q): build answer routing inspector for the selected question.
 *   routingRule(p,q,answer,i): build one answer condition and registered section menu trigger.
 *   properties(p,q): build question heading, title, type and options fields.
 *   validation(p,q): build validation controls, sync summary, required switch and notice.
 *   orderRow(name,box,id,labelOf,rowHeight): -> row: sortable item, drag grip, subtitle and registered targets.
 *   sectionButton(id): build one registered section tab and question count.
 *   settings(): build response-policy settings and optional publishing panel.
 *   identitySettings(p): build respondent identity group and email/sign-in switches.
 *   scheduleSettings(p): build closing schedule group, switch and date field.
 *   confirmationSettings(p): build after-submission confirmation group.
 *   policy(): build publishing overview sidebar.
 *   arrange(): build section and question reorder panels.
 *   questionPanels(): build scrolling canvas and property inspector.
 *   respondentPreview(): build preview dialog with all sections/questions and close action.
 *   previewCard(p,q): build one respondent preview question.
 *   menuOption(pop,name,value,detailed,v,label): build one registered picker row with icon, detail and selection mark.
 *   locate(t): -> [x,y]: read-only target center or sortable item/slot coordinates.
 *   begin(): render-start decoration hook; default no-op.
 *   rendered(): after initial paint; default no-op.
 *   painted(): after every body repaint and preview; default no-op.
 *   questionDecorated(card,q): after each question card and syncer are built; default no-op.
 *   orderDecorated(row,name,id): after each drag row is registered; default no-op.
 *
 * Implementation: _assets holds constants; _frame, _controls, _panels, _paint, _questions,
 * _settings and _preview install the parts below without changing their design API.
 * No DOM work occurs in the factory. All state, including the stale-episode guard, belongs to this page.
 * content consumes exactly the reference workspace-content fork draws, in order, even if visuals omit peers.
 * Extra decoration randomness must use a separately labeled ctx.rng.fork(...).
 */
(function () {
  'use strict';
  env.template('use-form-builder/editor', (design, def) => {
    const { TOKENS } = env.templateLib('use-form-builder/_assets');
    let D, P, live;
    const BASE = {};
    const S = {
      get st() { return live; },
      get ctx() { return live?.ctx; },
      get spec() { return live?.ctx.spec; },
      get root() { return live?.root; },
      get els() { return live; },
      get D() { return D; },
      get P() { return P; },
    };

    env.templateLib('use-form-builder/_frame').install(BASE, S);
    env.templateLib('use-form-builder/_controls').install(BASE, S);
    env.templateLib('use-form-builder/_panels').install(BASE, S);
    env.templateLib('use-form-builder/_paint').install(BASE, S);
    env.templateLib('use-form-builder/_questions').install(BASE, S);
    env.templateLib('use-form-builder/_settings').install(BASE, S);
    env.templateLib('use-form-builder/_preview').install(BASE, S);

    ({ D, P } = env.templateDesign('use-form-builder/editor', design, def, { tokens: TOKENS, base: BASE, state: S }));
    return {
      render(ctx) {
        const st={ctx,targets:new Map(),panes:{},sorts:{},syncers:[],menus:null,painting:false};
        live=st;
        P.styles(st);
        st.root=P.frame(st);
        P.begin(st);
        P.content(st);
        P.topbar(st);
        P.layout(st);
        P.paint(st);
        P.rendered(st);
        return {anchors:[st.root],sync:()=>P.paint(st)};
      },
      locate(t) { return P.locate(live,t); },
    };
  }, { uses: ['use-form-builder/_assets', 'use-form-builder/_frame', 'use-form-builder/_controls', 'use-form-builder/_panels', 'use-form-builder/_paint', 'use-form-builder/_questions', 'use-form-builder/_settings', 'use-form-builder/_preview'] });
})();
