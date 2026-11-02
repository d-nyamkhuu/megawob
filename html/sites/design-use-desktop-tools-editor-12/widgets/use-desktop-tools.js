// Design of this site on the use-desktop-tools/workspace template: a drafting-table note editor with a blueprint backdrop.
(function () {
  'use strict';
  env.widget({
    task: 'use-desktop-tools',
    site: 'design-use-desktop-tools-editor-12',
    name: 'design',
    split: 'train',
    scenarios: ['editor'],
    template: 'use-desktop-tools/workspace',
    design: {
      toolIcons: {},
      wordsLabel: (n) => `${n} words`,
      toolHtml: {},
      sizeCur: null,
      frame: 'plain',
      frameTitle: 'My Notes',
      siteCssLast: true,
      css: "\n.as-app{left:0!important;right:0!important;top:0!important;bottom:0!important;width:auto!important;border:0;border-radius:0;box-shadow:none}.as-top{display:none}.as-body{min-height:0}.as-btn{border-radius:3px;font-size:14px}.as-pane{border-radius:0}.se-main{padding:17px 22px!important;gap:0}.se-col{width:100%;max-width:none}.se-side{display:none}.se-box{border-radius:3px;box-shadow:none;height:39px;padding:0 12px}.se-go{border-radius:3px;height:39px;padding:0 22px}.se-card{border-bottom:1px solid var(--line);padding:8px 8px 4px}.se-card .se-title{font-family:inherit;font-size:19px}.se-pager{justify-content:center}.se-pg{border-radius:2px;width:32px;min-width:32px;height:32px}.se-fav{width:22px;height:22px;border-radius:1px}.se-url{font-size:12px}.se-desc{font-size:14px}.tk-main{padding:18px 22px}.tk-title{font-size:24px}.tk-date{border-radius:0;background:transparent}.tk-row{gap:12px;border-bottom:1px solid var(--line);padding:0 12px}.tk-name{font-size:15px}.tk-price{font-size:18px;width:68px}.tk-buy{width:65px}.tk-when{width:125px}.tk-trigger{border-radius:0;min-width:175px}.fd-wrap.left{flex-direction:row}.fd-cart{width:28%!important;border-left:3px solid var(--fg);border-radius:0;background:var(--panel)}.fd-menu{padding:12px 18px}.fd-card{border-radius:0}.fd-add{border-radius:2px}.fd-order{border-radius:2px}.fd-rname{font-size:22px}.fd-rmeta{font-size:12px}.fd-dialog,.as-dialog{border-radius:4px}.fl-form{border-radius:0}.at-win{left:0!important;top:0!important;width:100%!important;height:100%!important;border-radius:0;box-shadow:none}.at-title{height:30px;border-radius:0;background:var(--header,var(--panel));font-size:14px}.at-rail{display:none}.at-body{flex:1;min-height:0}.at-main{min-width:0}.at-pane-h{border-radius:0}.at-explorer{width:46%!important;max-width:none}.at-preview{padding:10px}.at-tree{font-family:inherit}.at-row svg{color:var(--fg)}.at-ed{padding:0!important}.at-pagearea{background:var(--panel);padding:0!important}.at-sheet{border:0;box-shadow:none;background:var(--panel);margin:0!important;width:100%!important;max-width:none!important;padding:26px 32px!important}.at-sheet h2{font-family:inherit}.at-tb{border-radius:0;padding:10px;background:var(--header,var(--panel))}.at-tool{border-radius:3px;font-family:inherit}.at-status{background:var(--panel)}.at-term{border-radius:0;border:0}.at-tscroll{padding:20px;font:15px/1.5 monospace}.at-term-tabs{background:var(--header,var(--panel))}.as-page{inset:0!important;display:flex;justify-content:stretch!important}.as-rail,.as-side{display:none}.as-col{flex:1!important;width:100%!important;border:0}.as-head{height:43px;background:var(--header,var(--panel));font-size:14px}.as-post{padding:13px 18px;gap:14px;border-bottom:1px solid var(--line)}.as-text{font-size:16px;line-height:1.4}.as-av{width:48px;height:48px;border-radius:4px;font-size:17px}.as-acts{max-width:440px;justify-content:flex-start;gap:22px}.as-act{border-radius:3px;height:30px;font-size:14px;padding:0 8px}.as-act svg{width:20px;height:20px}.as-photos{height:100px!important;border-radius:4px}.as-menu{border-radius:3px;min-width:210px}.as-mi{height:35px;font-size:14px}.as-confirm{border-radius:4px}.as-confirm button{border-radius:3px}.as-track{border-radius:0;width:15px;background:var(--line)}.as-thumb{border-radius:0}.as-name{font-size:16px}.as-handle,.as-time{font-size:13px}.as-quote{border-radius:3px}.as-link{border-radius:3px}.as-link.tall .as-link-img{height:65px}.as-post:has(.as-photos){min-height:200px}\n.site-shell{border:9px solid #704428;border-radius:12px;grid-template-rows:70px minmax(0,1fr) 90px}.design-header{background:#f5e8cc;border-bottom:2px solid #62472d}.design-brand{font-size:30px;font-weight:400}.design-nav{color:#382211}.task-note{background:#f6ead3;font-family:Georgia;font-weight:400;font-size:25px;padding:20px 32px}.at-title{display:none}.at-win{border:1px solid #c9bfa9;border-radius:5px}.at-sheet{padding:30px!important;background:#fffdfa}.at-tb{background:#eae5d9;border:1px solid #b5ae9c;padding:12px}.at-tool{background:#f7f4ec;border:1px solid #d5cfbf;height:38px}.at-sheet h2{font-family:Georgia;font-size:26px}.at-doc{font-family:Georgia}.design-footer{background:#6b3f26;border-top:3px ridge #a1724e}.footer-label{font-size:20px;color:#eed9b9}.end-control{background:linear-gradient(#428a40,#176126);height:54px;font:24px Georgia;border:3px ridge #43622d;border-radius:9px}",
      caret: (S) => S.svg('<path d="M3.5 5.5h9L8 11z" fill="currentColor" stroke="none"/>', 16),
      docTitle: 'A Note About Birds',
      barColor: '#ed151b',
      parts: {
        fontTool: (base, S) => (E) => {
          if (!E.wide) return;
          const sampledFont = E.rng.pick(['Sans Serif', 'Serif', 'Georgia', 'Inter']);
          E.tool('', `<span>Arial</span>${S.CARET}`, `Font (${sampledFont})`, 'deco wide');
        },
        toolbarBuilt: (base, S) => (E) => {
          const draftingList = E.util.el('span', 'draft-list', E.tb);
          draftingList.innerHTML = S.svg('<path d="M3 4h10M3 7h10M3 10h10M3 13h10"/>', 16);
          draftingList.setAttribute('aria-hidden', 'true');
        },
        edAreaBuilt: () => (E) => {
          const { util, area } = E;
          const art = util.el('div', 'blueprint-art', area);
          art.setAttribute('aria-hidden', 'true');
          art.innerHTML = `<svg viewBox="0 0 1672 674" preserveAspectRatio="none" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs><pattern id="cad-grid" width="60" height="60" patternUnits="userSpaceOnUse"><svg width="60" height="60" viewBox="1290 375 60 60"><image href="sites/design-use-desktop-tools-editor-12/assets/drawing-details.webp" width="1672" height="941"/></svg></pattern></defs>
      <rect width="1672" height="674" fill="url(#cad-grid)"/>
      <!-- Only the static drafting illustrations are clipped from the supplied
           artwork. The instruction, document, tools and actions remain live DOM. -->
      <svg x="36" y="45" width="610" height="400" viewBox="36 275 610 400" preserveAspectRatio="none"><image href="sites/design-use-desktop-tools-editor-12/assets/drawing-details.webp" width="1672" height="941"/></svg>
      <svg x="435" y="481" width="355" height="160" viewBox="435 711 355 160" preserveAspectRatio="none"><image href="sites/design-use-desktop-tools-editor-12/assets/drawing-details.webp" width="1672" height="941"/></svg>
      <svg x="956" y="371" width="332" height="282" viewBox="956 601 332 282" preserveAspectRatio="none"><image href="sites/design-use-desktop-tools-editor-12/assets/drawing-details.webp" width="1672" height="941"/></svg>
      <svg x="28" y="544" width="271" height="130" viewBox="28 774 271 130" preserveAspectRatio="none"><image href="sites/design-use-desktop-tools-editor-12/assets/drawing-details.webp" width="1672" height="941"/></svg>
    </svg>`;
        },
        edDocBuilt: () => (E) => {
          for (let i = 0; i < 6; i++) E.util.el('i', `selection-handle handle-${i}`, E.docEl);
        },
        edReadout: () => (E, m, start, end, cs) => {
          const currentSize = (cs && cs.s) || 'normal';
          E.tools.size.querySelector('.cur').textContent = { small: '18', normal: '24', large: '32', huge: '42' }[currentSize];
          E.tools.size.title = `Text size: ${E.fam.SIZE_LABEL[currentSize]}`;
        },
      },
    },
  });
})();
