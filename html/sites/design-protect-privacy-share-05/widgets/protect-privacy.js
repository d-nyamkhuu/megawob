// Design on the protect-privacy/classic template.
(function () {
const paths={
  doc:'<path d="M4 1h11l5 5v17H4Z" fill="#2879ff" stroke="none"/><path d="M15 1v5h5" fill="#a7cbff" stroke="none"/><path d="M7 10h10M7 14h10M7 18h7" stroke="white" stroke-width="1.7"/>',
  star:'<path d="m12 3 2.8 5.8 6.4.9-4.6 4.5 1.1 6.3L12 17.5l-5.7 3 1.1-6.3-4.6-4.5 6.4-.9Z"/>',
  comment:'<path d="M3 3h18v15h-6l-5 4v-4H3ZM7 7h10M7 11h10M7 15h6"/>',
  share:'<circle cx="9" cy="7" r="3"/><path d="M3 20v-3a6 6 0 0 1 12 0v3ZM19 4v8M15 8h8"/>',
  more:'<g fill="currentColor" stroke="none"><circle cx="12" cy="5" r="1.7"/><circle cx="12" cy="12" r="1.7"/><circle cx="12" cy="19" r="1.7"/></g>',
  horizontal:'<g fill="currentColor" stroke="none"><circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/></g>',
  undo:'<path d="m9 6-5 5 5 4M4 11h9a5 5 0 0 1 0 10" transform="translate(1 -2)"/>',
  redo:'<path d="m15 6 5 5-5 4M20 11h-9a5 5 0 0 0 0 10" transform="translate(-1 -2)"/>',
  down:'<path d="m7 10 5 5 5-5Z" fill="currentColor" stroke="none"/>',
  minus:'<path d="M6 12h12"/>', plus:'<path d="M6 12h12M12 6v12"/>'
};
function icon(el,name){el.innerHTML='<svg viewBox="'+(name==='doc'?'3 0 18 24':'0 0 24 24')+'" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'+paths[name]+'</svg>';}
env.widget({
  task: 'protect-privacy',
  site: 'design-protect-privacy-share-05',
  name: 'design',
  split: 'train',
  scenarios: ['share'],
  template: 'protect-privacy/classic',
  design: {
    parts: {
      dialog: (base,S) => (m) => {
        base(m);
        const input=S.win.querySelector('input');
        if(input){let node=input.parentElement;while(node&&node!==S.win){if(node.textContent.includes('General access')){node.classList.add('drive-sharing-dialog');break;}node=node.parentElement;}}
      },
      documentHeader: (_base, S) => (doc) => {
        const P = S.P;
        const h = P.element('div', 'sp-doc-h mac-doc-head', doc);
        icon(P.element('span', 'mac-file-icon', h),'doc');
        const block = P.element('div', 'mac-doc-titleblock', h);
        P.element('div', 't', block, S.spec.doc);
        P.element('div', 'mac-doc-meta', block, 'Shared · Last edited Apr 18, 2024');
        const actions=P.element('div','drive-doc-actions',h);
        for(const [name,label] of [['star','Add to starred'],['comment','Comments']]){const a=P.element('button','drive-doc-icon',actions);a.type='button';a.title=label;icon(a,name);}
        const b = P.key(P.element('button', 'sp-btn mac-share', actions), 'share-open');
        icon(P.element('span','drive-share-icon',b),'share');P.element('span','',b,'Share');
        b.type = 'button';
        const more=P.element('button','drive-doc-icon drive-doc-more',actions);more.type='button';more.title='More actions';icon(more,'more');
        const tools = P.element('div', 'mac-editor-tools', h);
        const button=(parent,name,label)=>{const el=P.element('button','drive-format-icon',parent);el.type='button';el.title=label;icon(el,name);return el;};
        button(tools,'undo','Undo');button(tools,'redo','Redo');
        const option=(text,cls)=>{const group=P.element('button','drive-format-option '+cls,tools);group.type='button';P.element('span','',group,text);icon(P.element('span','drive-format-arrow',group),'down');};
        option('100%','drive-zoom');option('Normal text','drive-text-style');option('Roboto','drive-font-family');
        const size=P.element('div','drive-font-size',tools);button(size,'minus','Decrease font size');P.element('span','',size,'11');button(size,'plus','Increase font size');
        button(tools,'horizontal','More formatting');
        const current=document.querySelector('.drive-file-current .drive-file-name');if(current)current.textContent=S.spec.doc;
        const detailTitle=document.querySelector('.drive-detail-docname');if(detailTitle)detailTitle.textContent=S.spec.doc;
      },
      documentPaper: (_base, S) => (doc) => {
        const P = S.P;
        const viewport = P.element('div', 'mac-document-viewport', doc);
        const page = P.element('div', 'sp-paper mac-document-page', viewport);
        P.element('h3', 'mac-page-title', page, S.spec.doc);
        P.element('p', 'mac-intro', page, 'Fischer Manufacturing');
        P.element('div', 'mac-rule', page);
        P.element('p', 'mac-description', page, 'This document records changes to the production environment, including process updates, configuration changes, and relevant approvals.');
        const table = P.element('table', 'mac-change-table', page);
        const columns=P.element('colgroup','',table);
        for(const width of ['18.5%','28.1%','25.3%','28.1%']){const col=P.element('col','',columns);col.style.width=width;}
        const head = P.element('tr', '', table);
        for (const label of ['Date','Change','Updated by','Notes']) P.element('th','',head,label);
        const rows = [
          ['Apr 2, 2024','Line 3 configuration update','Daniel Cho','Adjusted parameters for new material.'],
          ['Apr 8, 2024','Safety check process revision','Maha Rahim','Updated safety checklist and training notes.'],
          ['Apr 12, 2024','Packaging label change','Priya Desai','New label version 2.1 rolled out.'],
          ['Apr 18, 2024','Quality control procedure','Daniel Cho','Clarified inspection steps.'],
        ];
        for (const cells of rows) {
          const tr = P.element('tr','',table);
          for (const value of cells) P.element('td','',tr,value);
        }
      },
    },
  },
});
})();
