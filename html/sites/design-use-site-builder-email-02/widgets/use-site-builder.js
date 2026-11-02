// Publishing studio design; defaults reproduce this scenario's scaffold.
env.widget({
  task: 'use-site-builder',
  site: 'design-use-site-builder-email-02',
  name: 'design',
  split: 'train',
  scenarios: ['email'],
  template: 'use-site-builder/studio',
  design: {
    inset: 0,
    fontFamily: '"Courier New",monospace',
    radius: '0',
    emptySection: 'Drag a block here',
    colors: { bg:'#b8b8b8', panel:'#d6d6d6', fg:'#080b0d', muted:'#959595', line:'#959595', accent:'#0041c5' },
    parts: {
      header: (base, S) => () => {
        S.ctx.util.el('div', 'wb-editor-title', S.els.app, 'Edit Campaign');
      },
      toolbar: (base, S) => () => {
        const fields = S.P.pane('inspector', S.els.app, 'wb-metadata');
        for (const def of S.spec.fields) S.P.field(fields, def, false, 'inspector');
      },
      fieldView: (base, S) => (parent, def, prop) => {
        const view=base(parent,def,prop);
        if (view.input.tagName==='TEXTAREA') {
          const input=S.ctx.util.el('input','ab-input');
          input.type='text'; input.maxLength=def.limit; input.spellcheck=false;
          input.setAttribute('aria-label',def.label);
          view.input.replaceWith(input);
          view.input=input;
        }
        return view;
      },
      navigation: () => () => {},
      footer: (base, S) => () => {
        const result = base();
        S.els.app.querySelector('.ab-foot').hidden = true;
        return result;
      },
      library: (base, S) => () => {
        const { util:u } = S.ctx;
        const side = u.el('aside', 'ab-side wb-library', S.els.work);
        u.el('div', 'wb-section-title', side, 'Content Blocks');
        const body=u.el('div','wb-library-body',side);
        const library = S.P.pane('library', body, 'ab-library');
        for (const it of S.spec.items) {
          const card = S.P.paletteItem(library, it);
          S.P.drag(card, () => it.id, 'block');
          S.P.item(S.ctx, card, it);
        }
        const rail=u.el('div','wb-scrollbar',body);
        const up=u.el('button','wb-scroll-up',rail,'▲');
        up.type='button'; up.setAttribute('aria-label','Scroll blocks up');
        const track=u.el('div','wb-scroll-track',rail);
        const thumb=u.el('div','wb-scroll-thumb',track);
        const down=u.el('button','wb-scroll-down',rail,'▼');
        down.type='button'; down.setAttribute('aria-label','Scroll blocks down');
        const refresh=() => {
          const height=track.clientHeight;
          const thumbHeight=Math.max(24,height*Math.min(1,library.clientHeight/Math.max(1,library.scrollHeight)));
          thumb.style.height=`${thumbHeight}px`;
          thumb.style.top=`${Math.max(0,height-thumbHeight)*library.scrollTop/Math.max(1,library.scrollHeight-library.clientHeight)}px`;
        };
        const scroll=(amount) => { library.scrollTop+=amount; refresh(); S.P.mirror(); };
        up.addEventListener('click',()=>scroll(-80));
        down.addEventListener('click',()=>scroll(80));
        track.addEventListener('pointerdown',(event)=>{
          if(event.target===track) scroll((event.clientY-track.getBoundingClientRect().top)/Math.max(1,track.clientHeight)*library.scrollHeight-library.scrollTop);
        });
        let startY=0, startScroll=0;
        env.ui.track(thumb,{
          start(point) { startY=point.y;startScroll=library.scrollTop; },
          move(point) {
            const travel=track.clientHeight-thumb.clientHeight;
            library.scrollTop=startScroll+(point.y-startY)*(library.scrollHeight-library.clientHeight)/Math.max(1,travel);
            refresh(); S.P.mirror();
          },
          end() { refresh(); },
        },'workbench-library-scroll');
        library.addEventListener('scroll',refresh);
        S.st.refreshLibraryBar=refresh;
      },
      paletteItem: (base, S) => (library, it) => {
        const u = S.ctx.util;
        const block = S.P.ref({palette:it.id}, u.el('div','ab-palette',library), 'library');
        block.setAttribute('aria-label', `Drag ${it.label}`);
        const symbol = u.el('span','wb-block-art',block);
        const svg = u.svg('svg',{viewBox:'0 0 80 54','aria-hidden':'true'},symbol);
        const path = (d,fill='#080b0d',stroke='none',width=2) => u.svg('path',{d,fill,stroke,'stroke-width':width,'stroke-linejoin':'miter'},svg);
        if (it.type === 'Heading') {
          const t = u.svg('text',{x:7,y:44,fill:'#080b0d','font-family':'Arial,sans-serif','font-weight':700,'font-size':45},svg); t.textContent='Aa';
        } else if (it.type === 'Image') {
          path('M6 6H74V49H6Z','#6297d0','#080b0d');
          path('M8 8H72V46H8Z','#78afea');
          path('M8 44 24 24 36 35 49 20 72 43V47H8Z','#172838','#080b0d');
          path('m11 43 13-15 12 12 13-16 19 19','none','#d3dfeb',2);
          path('m15 15 4-4 4 4-4 5Z','#ffcf42');path('m34 15 4-4 4 4-4 5Z','#f6f6f6');
        } else if (it.type === 'Quote') {
          path('M18 12 10 23V44H28V26H20L26 12ZM47 12 39 23V44H57V26H49L55 12Z');
        } else if (it.type === 'Button') {
          path('M6 15H74V44H6Z','#080b0d');path('M9 18H71V41H9Z','#6397d2','#f6f6f6');
          path('M24 28H56V32H24Z','#f6f6f6');path('M27 29H50','none','#142b49',2);
        } else if (it.type === 'Divider') {
          path('M7 25H72V29H7Z');
        } else if (it.type === 'Spacer') {
          path('M7 17H72V21H7ZM7 26H72V30H7ZM7 35H62V38H7Z');
        } else {
          path('M7 10H72V14H7ZM7 20H42V24H7ZM47 20H72V24H47ZM7 30H37V34H7ZM42 30H72V34H42ZM7 40H50V44H7Z');
        }
        const text = u.el('span','wb-block-text',block);
        u.el('span','wb-block-label',text,it.label);
        const descriptions={Heading:'Large title',Image:'Feature image',Quote:'Testimonial',Text:'Paragraph text',Button:'Call to action',Divider:'Horizontal rule',Spacer:'Add space',Columns:'Column layout'};
        u.el('small','wb-block-description',text,descriptions[it.type] || 'Content block');
        return block;
      },
      document: (base, S) => () => {
        const u = S.ctx.util;
        const main = u.el('div','ab-main',S.els.work);
        u.el('div','wb-section-title',main,'Email Content');
        const canvas = S.P.pane('canvas',main,'ab-canvas');
        const page = u.el('div','ab-page email',canvas);
        page.style.gridTemplateRows=`repeat(${S.spec.goalSlots.length},minmax(0,1fr))`;
        for (let i=0;i<S.spec.goalSlots.length;i++) S.P.slot(page,i);
      },
      slotView: (base, S) => (page, i) => {
        const entry=base(page,i);
        entry.slot.querySelector('.ab-position').textContent=String(i+1);
        return entry;
      },
      campaignInspector: (base, S) => () => {
        const u = S.ctx.util;
        const right=u.el('aside','wb-right',S.els.work);
        const properties=u.el('section','wb-properties',right);
        const note=document.querySelector('.ref-panel');
        u.el('div','wb-section-title',properties,note ? 'Task Note' : 'Block Properties');
        if (note) properties.appendChild(note);
        else u.el('div','wb-properties-empty',properties,'Select a block\nto edit its properties.');
        const delivery=u.el('section','wb-delivery',right);
        u.el('div','wb-section-title',delivery,'Campaign Status');
        S.st.deliveryStatus=u.el('div','wb-delivery-status',delivery,'Draft');
        S.P.publish(delivery);
      },
      publishView: (base, S) => (parent) => {
        const button=base(parent);
        button.classList.add('wb-send');
        S.ctx.util.el('span','wb-send-envelope',button);
        return button;
      },
      paint: (base, S) => (model) => {
        base(model);
        S.st.deliveryStatus.textContent=model.committed ? 'Sent' : 'Draft';
      },
      rendered: (base, S) => (ctx) => {
        base(ctx);
        S.st.refreshLibraryBar();
      },
    },
  },
});
