/* use-site-builder/_workspace: Studio shell, target registration, field binding and pointer drags.
 * Installed by studio.js; studio getters retain live per-template episode state.
 * Every design-overridable part stays on BASE and calls other parts through studio.P.
 */
(function () {
  'use strict';

  function installFrame(BASE, studio) {
    BASE.begin = (ctx) => {};

    BASE.style = (ctx) => {
      ctx.css('app-builder-classic', studio.CSS
        .replaceAll('system-ui,sans-serif', studio.D.fontFamily)
        .replace('.ab-app { border-radius:6px; font-size:11px;', `.ab-app { border-radius:${studio.D.radius}; font-size:${studio.D.fontSize};`)
        .replaceAll('max-width:780px', `max-width:${studio.D.documentWidth}px`)
        .replaceAll('max-width:620px', `max-width:${studio.D.emailWidth}px`)
        .replace(/var\(--(panel|line|accent|muted|fg|bg)\)/g, (value, name) => studio.D.colors[name] ?? value));
    };

    BASE.context = (ctx) => {
      const cr = ctx.rng.fork('studio/context');
      const C = ctx.content;
      const company = studio.spec.project.split(' / ')[0];
      const colleague = C.personName(cr, { csplit: studio.spec.csplit }).full;
      const otherProjects = C.sample(cr, C.HEADLINES, 5, { csplit: studio.spec.csplit });
      return { cr, company, colleague, otherProjects };
    };

    BASE.icon = (parent, name) => {
      const svg = studio.util.svg('svg', { viewBox:'0 0 24 24', fill:'none', stroke:'currentColor', 'stroke-width':1.7, 'stroke-linecap':'round', 'stroke-linejoin':'round', 'aria-hidden':'true' }, parent);
      studio.util.svg('path', { d:studio.icons[name] || studio.icons.grid }, svg); return svg;
    };

    BASE.iconButton = (parent, name, label, action) => {
      const b = studio.util.el('button', 'ab-iconbtn', parent); b.type = 'button'; b.title = label; b.setAttribute('aria-label', label);
      studio.P.icon(b, name); if (action) b.addEventListener('click', action); return b;
    };

    BASE.kv = (parent, label, value) => {
      const row = studio.util.el('div', 'ab-kv', parent); studio.util.el('span','',row,label); return studio.util.el('strong','',row,value);
    };

    BASE.checkline = (parent, text) => {
      const row = studio.util.el('div', 'ab-checkline', parent); studio.P.icon(row,'check'); studio.util.el('span','',row,text); return row;
    };

    BASE.showPanel = (title, rows) => {
      if (studio.popover) { const same = studio.popover.dataset.title === title; studio.popover.remove(); studio.popover = null; if (same) return; }
      studio.popover = studio.util.el('div', 'ab-popover', studio.app); studio.popover.dataset.title = title;
      studio.util.el('h3','',studio.popover,title);
      for (const row of rows) { const b = studio.util.el('button','',studio.popover,row[0]); b.type = 'button'; studio.util.el('small','',b,row[1]); b.addEventListener('click',()=>{ studio.popover.remove(); studio.popover=null; }); }
    };

    BASE.frame = (ctx) => {
      const el = studio.util.el('section', `ab-app${studio.size.width < studio.D.compactWidth ? ' ab-compact' : ''}`, ctx.stage);
      Object.assign(el.style, { left: `${studio.D.inset}px`, top: `${studio.D.inset}px`, width: `${Math.max(1, studio.size.width - studio.D.inset * 2)}px`, height: `${Math.max(1, studio.size.height - studio.D.inset * 2)}px` });
      return el;
    };

    BASE.ref = (t, el, pane) => {
      studio.state.refs.set(studio.keyOf(t), el);
      if (pane) studio.state.records.push({ key: studio.keyOf(t), el, pane });
      return el;
    };

    BASE.pane = (id, parent, cls) => {
      const el = studio.util.el('div', `ab-pane ${cls || ''}`, parent);
      studio.state.panes[id] = el;
      // The primitive owns wheel behavior; a scroll event also covers keyboard scroll.
      env.ui.scrollPane(el, { onScroll: () => studio.P.mirror(), label: `builder-${id}` });
      el.addEventListener('scroll', () => studio.P.mirror());
      return el;
    };

    BASE.mirror = () => {
      const hidden = {};
      const paneIds = new Map(Object.entries(studio.state.panes).map(([id, el]) => [el, id]));
      for (const r of studio.state.records) {
        if (!r.el.isConnected) continue;
        const er = r.el.getBoundingClientRect();
        if (!er.width || !er.height) continue;
        const cy = er.top + er.height / 2;
        // Reveal the outer pane first when a card lives inside a scrolling calendar cell.
        for (let parent = r.el.parentElement; parent && parent !== studio.app; parent = parent.parentElement) {
          const paneId = paneIds.get(parent);
          if (!paneId || parent.scrollHeight <= parent.clientHeight + 1) continue;
          const pr = parent.getBoundingClientRect();
          if (cy < pr.top + 5 || cy > pr.bottom - 5) hidden[r.key] = { pane: paneId, dy: cy - (pr.top + pr.bottom) / 2 };
        }
      }
      const view = { hidden };
      if (JSON.stringify(studio.ctx.model.view) !== JSON.stringify(view)) studio.ctx.patch({ view });
    };

    BASE.apply = (n) => {
      studio.ctx.update(n); studio.P.paint(studio.ctx.model);
    };

    BASE.edit = (fn) => {
      const n = env.util.clone(studio.ctx.model); n.committed = false; fn(n); studio.P.apply(n);
    };
  }

  function installShell(BASE, studio) {
    BASE.header = () => {
      const head = studio.util.el('header', 'ab-head', studio.app);
      studio.P.icon(studio.util.el('div', 'ab-logo', head), 'layers');
      const project = studio.util.el('div', 'ab-project', head); studio.util.el('span','',project,studio.spec.project); studio.util.el('small','',project,studio.D.workspaceLabel);
      studio.P.iconButton(head,'down','Switch project',()=>studio.P.showPanel('Recent projects',studio.otherProjects.map((p,i)=>[p,i ? 'Draft / Marketing team' : 'Recently edited / Design team'])));
      studio.util.el('span', 'ab-tag ab-version', head, `Revision ${studio.spec.revision}`);
      const collaborators = studio.util.el('div','ab-collaborators',head);
      for (const name of [studio.spec.owner,studio.colleague]) { const a=studio.util.el('div','ab-avatar',collaborators,name.split(' ').map((v)=>v[0]).slice(0,2).join('')); a.title=name; }
      studio.P.iconButton(head,'bell','Notifications, 3 unread',()=>studio.P.showPanel('Activity / 3 unread',[[`${studio.colleague} left a comment`,'Please review the mobile layout. / 12 min ago'],['Brand assets updated','Two new images in the shared library. / 1 hour ago'],['Weekly performance report','Your latest report is ready to view. / 2 hours ago']]));
      const previewButton = studio.P.iconButton(head,'eye','Preview',()=>{ studio.app.classList.toggle('ab-previewmode'); previewButton.setAttribute('aria-pressed',String(studio.app.classList.contains('ab-previewmode'))); });
      studio.P.publish(head);
    };

    BASE.publishView = (parent) => {
      const button = studio.P.ref({ publish: true }, studio.util.el('button', 'ab-btn ab-primary', parent, studio.spec.actionLabel));
      button.type = 'button';
      return button;
    };

    BASE.publish = (parent) => {
      const button = studio.P.publishView(parent);
      button.addEventListener('click', () => {
        if (studio.spec.judge && studio.spec.judge.mode === 'confirm') studio.ctx.flag('irreversible');
        studio.P.apply({ ...studio.ctx.model, committed: true });
      });
    };

    BASE.toolbar = () => {
      const tools = studio.util.el('div', 'ab-tools', studio.app);
      const titles = studio.D.titles;
      studio.util.el('b', '', tools, titles[studio.spec.scenario]);
      studio.util.el('span', 'ab-grow', tools, studio.spec.scenario === 'social' ? 'UTC · Week view' : studio.spec.scenario === 'seo' ? 'Settings / SEO' : 'Content  /  Design');
      studio.P.iconButton(tools,'undo','Version history',()=>studio.P.showPanel('Version history',[[`Revision ${studio.spec.revision}`,'Current draft / All changes saved'],[`Revision ${studio.spec.revision-1}`,'Previous published version / Yesterday']]));
      studio.util.el('span','ab-divider',tools);
      studio.P.iconButton(tools,'desktop','Desktop preview',()=>studio.app.classList.remove('ab-previewmode'));
      studio.P.iconButton(tools,'phone','Mobile preview information',()=>studio.P.showPanel('Responsive layout',[['Mobile layout','Sections stack vertically on narrow screens.'],['Tablet layout','Uses the same content and delivery settings.']]));
      studio.util.el('span', 'ab-zoomlabel', tools, studio.spec.scenario === 'email' ? `${studio.spec.audience.toLocaleString('en-US')} subscribers` : '100%');
    };

    BASE.workspace = () => {
      return studio.util.el('div', 'ab-work', studio.app);
    };

    BASE.navigation = () => {
      const nav = studio.util.el('nav', `ab-nav${studio.size.width > studio.D.navExpandWidth ? ' expanded' : ''}`, studio.work); nav.setAttribute('aria-label','Workspace');
      studio.util.el('div','ab-navcap',nav,'Workspace');
      const currentNav = {page:'Website',email:'Campaigns',seo:'Website',social:'Publishing',blockedit:'Website'}[studio.spec.scenario];
      const navigation = studio.D.navigation;
      navigation.forEach(([glyph,label,count])=>{
        const b=studio.util.el('button',`ab-navitem${label===currentNav?' active':''}`,nav); b.type='button'; b.title=label; studio.P.icon(b,glyph); studio.util.el('span','',b,label); if(count)studio.util.el('em','',b,count);
        b.addEventListener('click',()=>studio.P.showPanel(label,label==='Website'? [['Home','Published / Primary page'],['About us','Published'],['Journal','6 articles'],['Contact','Draft']]:studio.otherProjects.slice(0,4).map((p,i)=>[p,i%2?'Published':'Draft / Marketing team'])));
      });
      studio.util.el('div','ab-navcap',nav,'Team projects');
      for(const label of ['Autumn launch','Brand refresh']) { const b=studio.util.el('button','ab-navitem',nav); b.type='button';b.title=label;studio.P.icon(b,'folder');studio.util.el('span','',b,label);b.addEventListener('click',()=>studio.P.showPanel(label,[['Project overview','3 collaborators / Updated yesterday'],['Shared assets','Marketing workspace']])); }
      const bottom=studio.util.el('div','ab-navbottom',nav);
      studio.P.iconButton(bottom,'settings','Workspace settings',()=>studio.P.showPanel('Workspace settings',[['Marketing workspace','Team plan / 5 members'],['Brand settings','Colors, fonts and shared assets']]));
      studio.P.iconButton(bottom,'help','Help center',()=>studio.P.showPanel('Help center',[['Design and publish','Guides for managing your draft.'],['Keyboard shortcuts','Standard text editing is supported.']]));
    };

    BASE.footer = () => {
      const foot = studio.util.el('footer', 'ab-foot', studio.app);
      const status = studio.util.el('span', 'ab-status', foot);
      const metric = studio.util.el('span', '', foot);
      studio.util.el('span', 'ab-grow ab-owner', foot, `Owner: ${studio.spec.owner}`);
      studio.P.icon(foot, 'check');
      studio.state.saved = studio.util.el('span', '', foot, 'All changes saved');
      return { status, metric };
    };
  }

  function installInputs(BASE, studio) {
    BASE.field = (parent, def, prop, paneId) => {
      const { wrap, input, out } = studio.P.fieldView(parent, def, prop);
      const t = prop ? { prop: def.id } : { field: def.id };
      studio.P.ref(t, input, paneId);
      const fill = studio.P.fieldMeter(wrap);
      const entry = { input, out, def, fill };
      (prop ? studio.state.props : studio.state.fields).push(entry);
      input.addEventListener('input', () => studio.P.edit((m) => {
        const value = input.value.slice(0, def.limit);
        if (prop) m.props[m.selected][def.id] = def.id === 'padding' ? Math.max(0, Math.min(64, Number(value) || 0)) : value;
        else m.fields[def.id] = value;
      }));
      return input;
    };

    BASE.fieldView = (parent, def, prop) => {
      const wrap = studio.util.el('label', 'ab-field', parent);
      studio.util.el('span', 'ab-fieldlabel', wrap, def.label);
      const input = studio.util.el(def.id === 'description' || def.id === 'preheader' || def.id === 'title' && prop ? 'textarea' : 'input', 'ab-input', wrap);
      if (input.tagName === 'INPUT') input.type = 'text';
      input.setAttribute('aria-label', def.label);
      input.maxLength = def.limit;
      input.spellcheck = false;
      const out = studio.util.el('output', 'ab-counter', wrap);
      return { wrap, input, out };
    };

    BASE.fieldMeter = (wrap) => {
      const meter = studio.util.el('div','ab-checkmeter',wrap); const fill=studio.util.el('i','',meter);
      return fill;
    };

    BASE.drag = (el, itemOf, kind) => {
      let id = null;
      env.ui.track(el, {
        start(p, e) {
          if (e.target.closest('button')) return false;
          id = itemOf();
          if (!id) return false;
          studio.state.ghost = studio.P.ghost(id);
          studio.state.ghost.style.left = `${p.x + 10}px`; studio.state.ghost.style.top = `${p.y + 8}px`;
        },
        move(p) {
          if (studio.state.ghost) { studio.state.ghost.style.left = `${p.x + 10}px`; studio.state.ghost.style.top = `${p.y + 8}px`; }
          studio.drops.forEach((d) => d.el.classList.toggle('ab-over', studio.inside(d.el.getBoundingClientRect(), p)));
        },
        end(p) {
          if (studio.state.ghost) studio.state.ghost.remove(); studio.state.ghost = null;
          studio.drops.forEach((d) => d.el.classList.remove('ab-over'));
          const target = studio.drops.find((d) => studio.inside(d.el.getBoundingClientRect(), p));
          if (!target || !id) return;
          studio.P.edit((m) => {
            if (kind === 'post') m.schedule[id] = target.index;
            else {
              const old = m.slots.indexOf(id), displaced = m.slots[target.index];
              m.slots[target.index] = id;
              if (old >= 0 && old !== target.index) m.slots[old] = displaced;
            }
          });
        },
      }, `builder-${kind}`);
    };

    BASE.ghost = (id) => {
      return studio.util.el('div', 'ab-ghost', studio.app, studio.spec.items.find((it) => it.id === id).label);
    };
  }

  env.template('use-site-builder/_workspace', () => ({ installFrame, installShell, installInputs }));
})();
