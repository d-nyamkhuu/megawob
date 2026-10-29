// Design on templates/fill-form/base.js: the base site's fill-form widget for this scenario (it was scaffolded from
// it), with the units this site changed as parts.
env.widget({
  task: 'fill-form',
  site: 'design-fill-form-idcard-04',
  name: 'design',
  split: 'train',
  scenarios: ['idcard'],
  template: 'fill-form/base',
  design: {
    parts: {
      'buildFrame': (base, S) => function buildFrame(ctx, formBuilder) {
        const { PAPERS, ensureStyle, ensureStyle2, env, imageLook, renderDoc, renderImage, stageBox } = S;
        ensureStyle();
        ensureStyle2();
        const { util, rng, spec } = ctx;
        const L = spec.layout;
        S.st = { ctx, spec, el: {}, tabs: null, extra: {} };
        if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();

        const box = stageBox(ctx);
        const availW = Math.min(box.width - 32, 1360);
        const tabsH = L.tabs ? 48 : 0;
        const availH = box.height - 24 - tabsH;
        const root = util.el('div', 'ff-root' + (L.docSide === 'right' ? ' doc-right' : '') + (L.tabs ? ' tabs' : '') + (L.long ? ' long' : ''), box.host);
        root.style.width = availW + 'px';
        root.style.margin = '12px 16px';
        root.style.setProperty('--ff-paper', rng.pick(PAPERS));
        const ink = `hsl(${rng.int(0, 359)}, ${rng.int(35, 60)}%, ${rng.int(24, 36)}%)`;
        root.style.setProperty('--ff-ink', ink);
        S.st.root = root;

        let docPane;
        let formPane;
        let tabbar = null;
        if (L.tabs) {
          tabbar = util.el('div', 'ff-tabs' + (rng.bool(0.35) ? ' pills' : ''), root);
          tabbar.setAttribute('role', 'tablist');
          const tDoc = util.el('button', 'ff-tab', tabbar, L.tabLabels[0]);
          const tForm = util.el('button', 'ff-tab', tabbar, L.tabLabels[1]);
          for (const t of [tDoc, tForm]) { t.type = 'button'; t.dataset.role = 'tab'; t.setAttribute('role', 'tab'); }
          if (rng.bool(0.3)) tabbar.append(tForm, tDoc); // the form tab first in some episodes
          const panels = util.el('div', 'ff-panels', root);
          docPane = util.el('div', 'ff-docpane ff-panel', panels);
          formPane = util.el('div', 'ff-formpane ff-panel', panels);
          docPane.style.width = formPane.style.width = '100%';
          S.st.tabs = env.ui.tabs([tDoc, tForm], [docPane, formPane], {
            keys: ['doc', 'form'],
            value: ctx.model.tab || 'form',
            show: (p, vis) => p.classList.toggle('off', !vis),
            onChange: (k) => S.st.ctx.update({ ...S.st.ctx.model, tab: k, seen: S.st.ctx.model.seen || k === 'doc', open: null }),
          });
        } else {
          docPane = util.el('div', 'ff-docpane', root);
          formPane = util.el('div', 'ff-formpane', root);
        }
        docPane.dataset.role = 'document';
        const sourceHead = util.el('div', 'ff-ref-source-head', docPane);
        sourceHead.style.cssText = 'height:72px;min-height:72px;flex:none;position:relative;display:flex;align-items:center;padding:0 18px;box-sizing:border-box;';
        const sourceTitle = util.el('div', 'ff-ref-source-title', sourceHead, 'SOURCE DOCUMENT');
        sourceTitle.style.cssText = "color:#101944;font-family:'Arial Narrow','Roboto Condensed',Impact,sans-serif;font-size:42px;line-height:1;font-weight:800;letter-spacing:-.5px;white-space:nowrap;";
        const sourceTools = util.el('div', 'ff-ref-source-tools', sourceHead);
        sourceTools.style.cssText = 'height:46px;position:absolute;right:0;top:13px;display:flex;align-items:center;color:#172440;font:15px Arial,sans-serif;';
        const sourceGroup = util.el('div', 'ff-ref-source-zoom', sourceTools);
        sourceGroup.style.cssText = 'height:46px;display:flex;align-items:center;background:#f8f9fb;border-radius:9px;overflow:hidden;';
        for (const [text, width] of [['−',42], ['100%',54], ['+',42]]) {
          const item = util.el('span', '', sourceGroup, text);
          item.style.cssText = `width:${width}px;height:46px;display:grid;place-items:center;color:#172440;font:16px Arial,sans-serif;`;
        }
        const sourceRefresh = util.el('span', '', sourceTools, '↻');
        sourceRefresh.style.cssText = 'width:58px;height:40px;margin-left:20px;border-left:1px solid #aeb9c8;display:grid;place-items:center;color:#25354e;font:32px/1 Arial,sans-serif;';
        const sourceBody = util.el('div', 'ff-ref-source-body', docPane);
        sourceBody.style.cssText = 'flex:1 1 auto;min-width:0;min-height:0;width:100%;display:flex;align-items:center;justify-content:center;overflow:auto;';
        for (const [key, value] of Object.entries({display:'flex',flexDirection:'column',justifyContent:'flex-start',alignItems:'stretch',overflow:'hidden',padding:'0'})) docPane.style.setProperty(key.replace(/[A-Z]/g, m => '-' + m.toLowerCase()), value, 'important');
        const d = spec.doc;
        const receipt = d.kind === 'invoice' && d.style === 'receipt';
        const frac = receipt ? rng.float(0.34, 0.4) : rng.float(0.42, 0.5);
        const docW = L.tabs ? Math.min(availW, receipt ? 420 : rng.int(560, 760)) : Math.round(availW * frac);
        if (!L.tabs) docPane.style.width = docW + 'px';
        const docRng = rng.fork('doc');
        if (L.image) {
          const look = imageLook(rng, d, receipt, ink);
          renderImage(util, sourceBody, d, rng.fork('img'), receipt ? Math.min(docW, 380) : docW, L.long ? 2000 : availH - 72, look);
        } else renderDoc(util, sourceBody, d, docRng);
        if (L.tabs) {
          const inner = util.el('div', 'ff-forminner', formPane);
          inner.style.width = `${Math.min(availW, rng.int(520, 680))}px`;
          formBuilder(inner, rng.fork('form'));
        } else formBuilder(formPane, rng.fork('form'));

        // Base font: as large as fits (each panel within the stage height, no horizontal overflow). Long
        // forms keep a readable size and let the page scroll instead.
        let fs = L.long ? rng.pick([14.5, 15, 15.5]) : Math.max(12, Math.min(17.5, availH / 40));
        const show = (el, on) => { if (L.tabs) el.classList.toggle('off', !on); };
        const fitsPane = (el) => el.offsetHeight <= availH && el.scrollWidth <= el.clientWidth + 1;
        const fits = () => {
          if (L.long) return docPane.scrollWidth <= docPane.clientWidth + 1 && formPane.scrollWidth <= formPane.clientWidth + 1;
          return fitsPane(docPane) && fitsPane(formPane);
        };
        for (;;) {
          root.style.fontSize = fs + 'px';
          if (fits() || fs <= 9) break;
          fs -= 0.5;
        }
        if (L.tabs) show(docPane, (ctx.model.tab || 'form') === 'doc'), show(formPane, (ctx.model.tab || 'form') === 'form');
        return { anchors: L.tabs ? [root, tabbar] : [root, docPane, formPane] };
      },
      'renderScan': (base, S) => function renderScan(ctx) {
        const { SCAN_CSS, addField, ensureStyle, env, icon, iconButton, mirrorFocus, scanBitmap, sectionOf, workspace } = S;
        ensureStyle();
        ctx.css('ff-scan-style', SCAN_CSS);
        const { util, spec } = ctx;
        S.st = { ctx, spec, el:{}, tabs:null, extra:{} };
        const shell=workspace(ctx,true), root=shell.root;
        const main = util.el('div', 'ff-scan-main', shell.center);
        const viewer = util.el('section', 'ff-scan-view', main);
        viewer.dataset.role = 'document';
        const filebar=util.el('div','ff-scan-filebar',viewer);
        icon(util,filebar,'file');
        util.el('span','ff-scan-filename',filebar,spec.layout.pdf ? spec.layout.pdf.file : 'source_scan.tif');
        util.el('span','ff-chip',filebar,'Original');
        const toolbar = util.el('div', 'ff-scan-toolbar', viewer);
        const pageLabel=util.el('span','ff-scan-filename',toolbar,'Page 1 / 1');
        iconButton(util,toolbar,'hand','Hand tool').setAttribute('aria-pressed','true');
        const minus = iconButton(util,toolbar,'minus','Zoom out');
        const zoomText = util.el('span','ff-scan-zoom',toolbar);
        const plus = iconButton(util,toolbar,'plus','Zoom in');
        const fit = iconButton(util,toolbar,'fit','Fit page width');
        const more = iconButton(util,toolbar,'more','Document actions');
        more.addEventListener('click',()=>shell.show('Original attachment',[
          'Original scan retained in the document archive.','1 page / scanned copy','Version history: original upload; no replacements.']));
        filebar.style.display='none'; pageLabel.style.display='none'; toolbar.children[1].style.display='none'; more.style.display='none';
        const sourceTitle=util.el('span','ff-ref-source-title',toolbar,'SOURCE DOCUMENT');
        sourceTitle.style.cssText="margin-right:auto;color:#101944;font-family:'Arial Narrow','Roboto Condensed',Impact,sans-serif;font-size:42px;line-height:1;font-weight:800;letter-spacing:-.5px;white-space:nowrap;";
        toolbar.insertBefore(sourceTitle,toolbar.firstChild);
        const zoomGroup=util.el('div','ff-ref-zoom-group',toolbar);
        zoomGroup.style.cssText='height:46px;display:flex;align-items:center;background:#f8f9fb;border-radius:9px;overflow:hidden;';
        zoomGroup.append(minus,zoomText,plus);
        for(const button of [minus,plus]) button.style.cssText='height:46px;min-height:46px;width:42px;padding:0;border:0;border-radius:0;background:#f8f9fb;color:#172440;';
        zoomText.style.cssText='width:54px;height:46px;display:grid;place-items:center;color:#172440;font:15px Arial,sans-serif;';
        fit.style.cssText='position:relative;width:58px;height:40px;min-height:40px;margin-left:22px;padding:0;border:0;border-left:1px solid #aeb9c8;border-radius:0;background:transparent;color:transparent;';
        fit.querySelector('svg').style.display='none';
        const refreshIcon=util.el('span','',fit,'↻');
        refreshIcon.style.cssText='position:absolute;inset:0;display:grid;place-items:center;color:#25354e;font:34px/1 Arial,sans-serif;';
        toolbar.style.cssText='height:72px;min-height:72px;flex:none;display:flex;align-items:center;gap:0;padding:0 18px;background:transparent;border:0;';
        const well = util.el('div', 'ff-scan-well', viewer);
        const pages=util.el('div','ff-page-strip',well);
        icon(util,pages,'grid');
        const pane = util.el('div', 'ff-scan-scroll', well);
        const sheet = util.el('div','ff-scan-sheet',pane);
        const rail = util.el('div','ff-scan-rail',well); const thumb = util.el('div','ff-scan-thumb',rail);
        const bitmap = scanBitmap(ctx, sheet);
        const thumbnail=util.el('canvas','',pages);thumbnail.width=48;thumbnail.height=68;
        thumbnail.setAttribute('aria-hidden','true');
        thumbnail.getContext('2d').drawImage(bitmap.cv,0,0,48,68);
        thumbnail.addEventListener('click',()=>{pane.scrollTop=0;pane.scrollLeft=0;mirror();});
        util.el('small','',pages,'1');
        util.el('div','ff-scan-source-foot',viewer,'Original attachment / Color / Read-only');
        const entry = util.el('section','ff-scan-entry',main);
        const entryHead = util.el('div','ff-scan-entry-head',entry);
        util.el('h2','',entryHead,spec.formTitle);
        util.el('p','',entryHead,'Record fields / Manual verification');
        const fieldsPane = util.el('div','ff-scan-fields',entry);
        fieldsPane.dataset.role = 'form';
        const grid = util.el('div','ff-grid',fieldsPane);
        const groups=new Map();
        for(const f of spec.fields) { const name=sectionOf(f); if(!groups.has(name)) groups.set(name,[]); groups.get(name).push(f); }
        for(const [name,fields] of groups) {
          const label=util.el('div','ff-section',grid);icon(util,label,'file');util.el('span','',label,name);
          for(const f of fields) addField(util,grid,f,ctx.model.fields[f.id]);
        }
        const entryFoot = util.el('div','ff-scan-entry-foot',entry);
        const count = util.el('span','',entryFoot);
        util.el('span','',entryFoot,'Draft / Not exported');
        shell.right.textContent='Draft changes saved';
        let zoom = Math.max(.72, (pane.clientWidth-28)/bitmap.W);
        const thumbY = () => {
          const max = Math.max(0, pane.scrollHeight-pane.clientHeight);
          const h = Math.max(24, rail.clientHeight * pane.clientHeight / Math.max(1,pane.scrollHeight));
          thumb.style.height = `${h}px`;
          thumb.style.top = `${max ? pane.scrollTop/max*(rail.clientHeight-h) : 0}px`;
          return { max, h };
        };
        const mirror = () => {
          if (!root.isConnected) return;
          const { max } = thumbY();
          const old = ctx.model.pdf || {};
          const pos = Object.fromEntries(Object.entries(bitmap.pos).map(([id,y]) => [id, Math.min(pane.scrollHeight, y*zoom+14)]));
          const pdf = { top:Math.round(pane.scrollTop), view:pane.clientHeight, max, pos,
            seen:Math.max(old.seen || 0, Math.round(pane.scrollTop)+pane.clientHeight) };
          if (JSON.stringify(old) !== JSON.stringify(pdf)) ctx.patch({ pdf });
        };
        const mirrorForm = () => {
          if (!root.isConnected) return;
          const top = Math.round(fieldsPane.scrollTop);
          const pr = fieldsPane.getBoundingClientRect();
          const pos = {};
          for (const f of spec.fields) {
            const fr = S.st.el[f.id].wrap.getBoundingClientRect();
            pos[f.id] = [Math.round(fr.top-pr.top+top), Math.round(fr.bottom-pr.top+top)];
          }
          const next = { top, view:fieldsPane.clientHeight, max:fieldsPane.scrollHeight-fieldsPane.clientHeight, pos };
          if (JSON.stringify(ctx.model.scanForm) !== JSON.stringify(next)) ctx.patch({ scanForm:next });
        };
        const resize = () => {
          bitmap.cv.style.width = `${bitmap.W*zoom}px`; bitmap.cv.style.height = `${bitmap.H*zoom}px`;
          zoomText.textContent = `${Math.round(zoom*100)}%`;
          // A zoom changes document coordinates; restart the seen coverage in the new coordinate space.
          ctx.patch({ pdf:{ ...(ctx.model.pdf || {}), seen:0 } }); mirror();
        };
        plus.addEventListener('click',() => { zoom=Math.min(2,zoom+.2); resize(); });
        minus.addEventListener('click',() => { zoom=Math.max(.5,zoom-.2); resize(); });
        fit.addEventListener('click',() => { zoom=(pane.clientWidth-28)/bitmap.W; resize(); });
        env.ui.scrollPane(pane,{ thumb, track:rail, travel:() => rail.clientHeight-thumbY().h, onScroll:mirror });
        env.ui.scrollPane(fieldsPane,{ onScroll:mirrorForm });
        pane.addEventListener('scroll',mirror); fieldsPane.addEventListener('scroll',mirrorForm);
        let pan;
        bitmap.cv.addEventListener('pointerdown',(e) => {
          if(e.button !== 0) return;
          pan={x:e.clientX,y:e.clientY,left:pane.scrollLeft,top:pane.scrollTop};
          bitmap.cv.setPointerCapture(e.pointerId); bitmap.cv.style.cursor='grabbing'; e.preventDefault();
        });
        bitmap.cv.addEventListener('pointermove',(e) => {
          if(!pan) return;
          pane.scrollLeft=pan.left+pan.x-e.clientX; pane.scrollTop=pan.top+pan.y-e.clientY; mirror();
        });
        const release=() => { pan=null; bitmap.cv.style.cursor='grab'; };
        bitmap.cv.addEventListener('pointerup',release); bitmap.cv.addEventListener('pointercancel',release);
        const sync = (model) => {
          let filled=0;
          for(const f of spec.fields) {
            const el=S.st.el[f.id], v=model.fields[f.id];
            if(v !== '' && v !== false && v != null) filled++;
            if(el.input) { if(el.input.value !== String(v || '')) el.input.value=String(v || ''); el.input.parentElement.classList.toggle('filled',!!v); }
            else if(f.kind === 'dropdown') {
              el.w.set({ value:v || null, open:model.open === f.id });
              const label=el.btn.querySelector('.ff-ddval'); label.textContent=v || 'Select…'; label.classList.toggle('empty',!v);
              for(const [label,o] of Object.entries(el.opts)) o.classList.toggle('sel',label === v);
            }
            else if(el.w) el.w.set(f.kind === 'checkbox' ? (v ? [f.id] : []) : v || null);
          }
          count.textContent=`${filled} / ${spec.fields.length} fields entered`;
        };
        S.st.scanCount = () => { count.textContent=`${spec.fields.filter((f) => !!ctx.model.fields[f.id]).length} / ${spec.fields.length} fields entered`; };
        if (spec.keys !== undefined) mirrorFocus(root);
        resize(); mirrorForm(); sync(ctx.model);
        S.st.extra = {
          scanForm:() => util.center(fieldsPane), pdfPane:() => util.center(pane), pdfThumb:() => util.center(thumb),
          pdfTo:(t) => { const q=rail.getBoundingClientRect(), {max,h}=thumbY(); return [q.left+q.width/2,q.top+h/2+(max ? Math.max(0,Math.min(max,t.pdfTo))/max*(q.height-h) : 0)]; },
        };
        return { anchors:[root,viewer,entry], sync };
      },
    },
  },
});
