/* use-site-builder/_panels: Page/email composer, SEO, social calendar and block editor parts.
 * Installed by studio.js; studio getters retain live per-template episode state.
 * Every design-overridable part stays on BASE and calls other parts through studio.P.
 */
(function () {
  'use strict';

  function installComposer(BASE, studio) {
    BASE.library = () => {
      const side = studio.util.el('aside', 'ab-side', studio.work);
      side.style.width = studio.D.libraryWidths[studio.size.width < studio.D.narrowWidth ? 0 : 1] + 'px';
      studio.util.el('div', 'ab-caption', side, studio.D.libraryLabel);
      const tabs=studio.util.el('div','ab-tabs',side); studio.util.el('span','active',tabs,'Blocks');studio.util.el('span','',tabs,'Saved');
      const search=studio.util.el('div','ab-search',side);studio.P.icon(search,'search');studio.util.el('span','',search,studio.D.searchLabel);
      const library = studio.P.pane('library', side, 'ab-library');
      for (const it of studio.spec.items) {
        const block = studio.P.paletteItem(library, it);
        studio.P.drag(block, () => it.id, 'block');
        studio.P.item(studio.ctx, block, it);
      }
      const savedBlocks=studio.util.el('div','ab-tree',library);
      studio.util.el('div','ab-caption',savedBlocks,'Saved sections');
      for(const name of ['Brand header','Product feature','Newsletter footer','Social links']) { const r=studio.util.el('div','ab-tree-row',savedBlocks);studio.P.icon(r,'layers');studio.util.el('span','',r,name); }
      studio.util.el('div','ab-caption',savedBlocks,'Pages');
      for(const [name,badge] of [['Home','Live'],['Our story','Live'],['Journal','6'],['Contact','Draft']]) { const r=studio.util.el('div','ab-tree-row',savedBlocks);studio.P.icon(r,'pages');studio.util.el('span','',r,name);studio.util.el('span','ab-tag',r,badge); }
    };

    BASE.document = () => {
      const main = studio.util.el('div', 'ab-main', studio.work);
      studio.util.el('div','ab-breadcrumb',main,studio.spec.scenario==='email'?'Campaigns / Monthly dispatch / Design':'Pages / Studio page / Body');
      const canvas = studio.P.pane('canvas', main, 'ab-canvas');
      const document = studio.util.el('div','ab-document',canvas);
      const dochead=studio.util.el('div','ab-dochead',document); studio.util.el('strong','',dochead,studio.company); studio.util.el('span','',dochead,studio.spec.scenario==='email'?'View in browser':'About     Journal     Contact');
      const page = studio.util.el('div', `ab-page${studio.spec.scenario==='email'?' email':''}`, document);
      const cols = studio.spec.scenario === 'page' ? studio.D.pageColumns : 1;
      page.style.gridTemplateColumns = `repeat(${cols},minmax(0,1fr))`;
      page.style.gridTemplateRows = studio.spec.scenario === 'email' ? `repeat(${studio.spec.goalSlots.length},auto)` : `repeat(${Math.ceil(studio.spec.goalSlots.length / cols)},minmax(66px,1fr))`;
      for (let i = 0; i < studio.spec.goalSlots.length; i++) studio.P.slot(page, i);
      const docfoot=studio.util.el('div','ab-docfoot',document);
      studio.util.el('div','',docfoot,studio.company);
      studio.util.el('div','',docfoot,studio.spec.scenario==='email'?'You are receiving this email because you subscribed.':'Stories, updates and useful ideas from our team.');
      studio.util.el('div','',docfoot,studio.spec.scenario==='email'?'Manage preferences | Unsubscribe':'Privacy | Terms | Contact');
    };

    BASE.pageInspector = () => {
      const details=studio.P.pane('details',studio.work,'ab-inspector');
      studio.util.el('div','ab-caption',details,'Page settings');studio.P.kv(details,'Page','Studio page');studio.P.kv(details,'Template','Two-column layout');
      studio.util.el('div','ab-setting',details);studio.util.el('div','ab-caption',details,'Typography');studio.P.kv(details,'Heading','System / Semibold');studio.P.kv(details,'Body','System / Regular');studio.P.kv(details,'Base size','16 px');
      studio.util.el('div','ab-caption',details,'Publishing');studio.P.kv(details,'Domain',studio.D.domain);studio.P.kv(details,'Visibility','Public');
      studio.util.el('div','ab-notice',details,'You are editing a draft. The live page updates when changes are published.');
    };

    BASE.campaignInspector = () => {
      const inspector = studio.P.pane('inspector', studio.work, 'ab-inspector');
      inspector.style.width = studio.D.campaignWidths[studio.size.width < studio.D.narrowWidth ? 0 : 1] + 'px';
      studio.util.el('div', 'ab-caption', inspector, 'Campaign settings');
      studio.spec.fields.forEach((def) => studio.P.field(inspector, def, false, 'inspector'));
      studio.util.el('div','ab-setting',inspector); studio.P.kv(inspector,'From',studio.spec.owner);studio.P.kv(inspector,'Reply to','hello@studio.example');studio.P.kv(inspector,'Audience','Newsletter subscribers');studio.P.kv(inspector,'Recipients',studio.spec.audience.toLocaleString('en-US'));
      studio.util.el('div','ab-caption',inspector,'Delivery checklist');
      studio.state.subjectCheck=studio.P.checkline(inspector,'Subject line missing');studio.P.checkline(inspector,'Unsubscribe link included');studio.P.checkline(inspector,'Responsive template');
      studio.util.el('div','ab-setting',inspector);studio.util.el('div','ab-caption',inspector,'Tracking');studio.P.kv(inspector,'Open tracking','On');studio.P.kv(inspector,'Link tracking','On');studio.P.kv(inspector,'Campaign tag','Monthly dispatch');
      studio.util.el('div','ab-notice warn',inspector,'Send a test to your team before sending this campaign to subscribers.');
    };

    BASE.composer = () => {
      studio.P.library();
      studio.P.document();
      if (studio.spec.scenario === 'page' && studio.size.width >= studio.D.pageInspectorWidth) studio.P.pageInspector();
      if (studio.spec.scenario === 'email') studio.P.campaignInspector();
    };

    BASE.paletteItem = (library, it) => {
      const block = studio.P.ref({ palette: it.id }, studio.util.el('div', 'ab-palette', library), 'library');
      block.setAttribute('aria-label', `Drag ${it.label}`);
      studio.P.icon(studio.util.el('span','ab-symbol',block), studio.D.symbols[it.type]); studio.util.el('span','',block,it.label);
      return block;
    };

    BASE.slotView = (page, i) => {
      const slot = studio.P.ref({ slot: i }, studio.util.el('div', 'ab-slot', page), 'canvas');
      const pos = studio.spec.scenario === 'page' ? `Row ${Math.floor(i / studio.D.pageColumns) + 1} · ${i % studio.D.pageColumns ? 'Right' : 'Left'}` : `Section ${i + 1}`;
      studio.util.el('span', 'ab-position', slot, pos);
      const title = studio.util.el('div', 'ab-blocktitle', slot);
      const visual = studio.util.el('div', 'ab-visual', slot);
      const copy = studio.util.el('div', 'ab-copy', slot);
      const remove = studio.util.el('button', 'ab-remove', slot); studio.P.icon(remove,'close');
      remove.type = 'button'; remove.setAttribute('aria-label', `Remove ${pos}`);
      return { slot, title, copy, visual, remove };
    };

    BASE.slot = (page, i) => {
      const { slot, title, copy, visual, remove } = studio.P.slotView(page, i);
      remove.addEventListener('pointerdown', (e) => e.stopPropagation());
      remove.addEventListener('click', () => studio.P.edit((m) => { m.slots[i] = null; }));
      studio.state.slots.push({ slot, title, copy, visual, remove });
      studio.drops.push({ el: slot, index: i });
      studio.P.drag(slot, () => studio.ctx.model.slots[i], 'block');
      studio.P.item(studio.ctx, slot, studio.spec.items.find((it) => it.id === studio.ctx.model.slots[i]));
    };
  }

  function installSeo(BASE, studio) {
    BASE.settingsMenu = () => {
      const settingsNav=studio.util.el('aside','ab-side',studio.work);settingsNav.style.width=studio.D.settingsWidths[studio.size.width < studio.D.compactWidth ? 0 : 1] + 'px';
      studio.util.el('div','ab-caption',settingsNav,'Page settings');
      const menu=studio.P.pane('settingsMenu',settingsNav,'ab-library');
      for(const [glyph,label] of [['pages','General'],['search','SEO settings'],['image','Social sharing'],['globe','Localization'],['link','Redirects'],['settings','Custom code']]) {const r=studio.util.el('div','ab-tree-row',menu);studio.P.icon(r,glyph);studio.util.el('span','',r,label);if(label==='SEO settings')r.style.color='var(--accent)';}
      studio.util.el('div','ab-tree',menu);studio.util.el('div','ab-caption',menu,'Other pages');for(const name of ['Home','Our story','Journal','Contact','Privacy policy']){const r=studio.util.el('div','ab-tree-row',menu);studio.P.icon(r,'pages');studio.util.el('span','',r,name);}
    };

    BASE.seoForm = () => {
      const form = studio.P.pane('form', studio.work, 'ab-form');
      form.style.flex = '1.1';
      studio.util.el('h2','',form,'Search engine listing');studio.util.el('div','ab-hint',form,'Control how this page appears in search results.');
      studio.spec.fields.forEach((def) => studio.P.field(form, def, false, 'form'));
      studio.util.el('div','ab-hint',form,'Search engines may display a different title or description.');
      studio.util.el('div','ab-setting',form);studio.util.el('div','ab-caption',form,'Indexing and canonical URL');studio.P.kv(form,'Search indexing','Allowed');studio.P.kv(form,'Follow page links','Enabled');studio.P.kv(form,'Canonical URL','Automatic');studio.P.kv(form,'Include in sitemap','Yes');
      studio.util.el('div','ab-notice',form,'SEO changes are saved to this draft. Publish to update the public listing.');
      studio.util.el('div','ab-setting',form);studio.util.el('div','ab-caption',form,'Structured data');studio.P.kv(form,'Schema type','WebPage');studio.P.kv(form,'Language','English');
    };

    BASE.seoPreview = () => {
      const main = studio.P.pane('seoPreview',studio.work,'ab-main'); main.style.flex = '1';
      studio.util.el('div', 'ab-caption', main, 'Search result preview');
      const preview = studio.util.el('div', 'ab-preview', main);
      studio.util.el('div', 'ab-preview-url', preview, `${studio.D.domain} /`);
      studio.state.previewTitle = studio.util.el('div', 'ab-preview-title', preview);
      studio.state.previewDesc = studio.util.el('div', 'ab-preview-desc', preview);
      studio.state.previewSlug = studio.util.el('div', 'ab-hint', preview);
      const health=studio.util.el('div','ab-preview',main);studio.util.el('div','ab-caption',health,'Listing checks');
      studio.state.seoCheck=studio.P.checkline(health,'Title not added');studio.P.checkline(health,'Page is indexable');studio.P.checkline(health,'Canonical URL configured');
      studio.util.el('div','ab-notice warn',health,'Preview only. Search appearance can vary by device and query.');
    };

    BASE.seo = () => {
      studio.P.settingsMenu();
      studio.P.seoForm();
      studio.P.seoPreview();
    };
  }

  function installSocial(BASE, studio) {
    BASE.channels = () => {
      const side = studio.util.el('aside', 'ab-side', studio.work);
      side.style.width = studio.D.socialWidths[studio.size.width < studio.D.narrowWidth ? 0 : 1] + 'px';
      studio.util.el('div','ab-caption',side,'Channels');
      const channels=studio.util.el('div','ab-library',side);channels.style.flex='none';
      for(const [name,network] of [[studio.company,'Social feed'],['Studio journal','Community']]) { const r=studio.util.el('div','ab-channel',channels);studio.util.el('span','ab-avatar',r,name.slice(0,2).toUpperCase());const text=studio.util.el('div','',r,name);studio.util.el('small','',text,network); }
      studio.util.el('div', 'ab-caption', side, 'Unscheduled posts');
      const drafts = studio.P.pane('drafts', side, 'ab-library'); studio.P.ref({ drafts: true }, drafts);
      studio.drops.push({ el: drafts, index: -1 });
      studio.state.drafts = drafts;
      studio.state.emptyDrafts = studio.util.el('div', 'ab-empty', drafts, studio.D.emptyDrafts);
    };

    BASE.calendar = () => {
      const main = studio.util.el('div', 'ab-main', studio.work);
      const socialbar=studio.util.el('div','ab-socialbar',main);studio.P.iconButton(socialbar,'chevron','Previous period',()=>studio.P.showPanel('Calendar periods',[['Previous week','Published archive / 11 posts']]));
      studio.util.el('strong','ab-grow',socialbar,'18 - 22 October');
      const filter=studio.util.el('button','ab-btn',socialbar,'All channels');filter.type='button';filter.addEventListener('click',()=>studio.P.showPanel('Channels',[[studio.company,'Connected / Social feed'],['Studio journal','Connected / Community']]));
      studio.util.el('span','ab-tag',socialbar,'Week');
      const calendarwrap=studio.P.pane('calendar',main,'ab-calendarwrap');
      const calendar = studio.util.el('div', 'ab-calendar', calendarwrap);
      studio.util.el('div', 'ab-day', calendar, 'UTC');
      studio.spec.days.forEach((d) => studio.util.el('div', 'ab-day', calendar, d));
      studio.state.cells = [];
      for (let row = 0; row < 3; row++) {
        studio.util.el('div', 'ab-hour', calendar, studio.spec.times[row]);
        for (let day = 0; day < 5; day++) {
          studio.P.calendarCell(calendar, row, day);
        }
      }
    };

    BASE.postView = (drafts, it) => {
      const post = studio.P.ref({ post: it.id }, studio.util.el('div', 'ab-post', drafts));
      const posthead=studio.util.el('div','ab-posthead',post);studio.P.icon(posthead,'globe');studio.util.el('b','',posthead,it.label);studio.P.icon(posthead,'grip');
      studio.util.el('p','',post,it.copy);studio.util.el('small','',post,studio.spec.owner);
      const meta=studio.util.el('div','ab-postmeta',post);studio.P.icon(meta,'clock');studio.util.el('span','',meta,'Draft / Social feed');
      return post;
    };

    BASE.post = (it) => {
      const post = studio.P.postView(studio.state.drafts, it);
      studio.state.posts[it.id] = post;
      studio.P.drag(post, () => it.id, 'post');
      studio.P.item(studio.ctx, post, it);
    };

    BASE.social = () => {
      studio.P.channels();
      studio.P.calendar();
      for (const it of studio.spec.items) studio.P.post(it);
    };

    BASE.history = (cell, i, row) => {
      const history=studio.util.el('div','ab-history',cell);studio.util.el('strong','',history,'Published / Studio journal');studio.util.el('div','ab-historytext',history,studio.otherProjects[i%studio.otherProjects.length]);studio.util.el('span','',history,`${studio.spec.times[row]} / ${studio.cr.int(21,180)} views`);
    };

    BASE.calendarCell = (calendar, row, day) => {
      const i = row * 5 + day, cell = studio.P.ref({ cell: i }, studio.P.pane(`calendar${i}`, calendar, 'ab-cell'), 'calendar');
      cell.setAttribute('aria-label', studio.helpers.cellLabel(studio.spec, i));
      studio.state.cells.push(cell); studio.drops.push({ el: cell, index: i });
      if (studio.D.historyCells.includes(i)) studio.P.history(cell, i, row);
    };
  }

  function installBlocks(BASE, studio) {
    BASE.layers = () => {
      const layers=studio.util.el('aside','ab-side',studio.work);layers.style.width=studio.D.layersWidths[studio.size.width < studio.D.compactWidth ? 0 : 1] + 'px';
      studio.util.el('div','ab-caption',layers,'Navigator');const tree=studio.P.pane('layers',layers,'ab-library');
      const root=studio.util.el('div','ab-tree-row',tree);studio.P.icon(root,'pages');studio.util.el('span','',root,'Body');
      for(const it of studio.spec.items) {const row=studio.util.el('button','ab-navitem',tree);row.type='button';studio.P.icon(row,'layers');studio.util.el('span','',row,it.label);row.addEventListener('click',()=>studio.P.apply({...studio.ctx.model,selected:it.id}));}
      for(const name of ['Footer','Legal links','Cookie notice']) {const row=studio.util.el('div','ab-tree-row indent',tree);studio.P.icon(row,'layers');studio.util.el('span','',row,name);}
      studio.util.el('div','ab-tree',tree);studio.util.el('div','ab-caption',tree,'Collections');for(const name of ['Articles','Team members','Testimonials']){const row=studio.util.el('div','ab-tree-row',tree);studio.P.icon(row,'folder');studio.util.el('span','',row,name);}
    };

    BASE.blockList = () => {
      const main = studio.util.el('div', 'ab-main', studio.work);
      const bar=studio.util.el('div','ab-layerbar',main);studio.P.icon(bar,'layers');studio.util.el('span','',bar,'Body / Content / Block');
      const list = studio.P.pane('blocks', main, 'ab-blocklist');
      studio.util.el('div', 'ab-caption', list, 'Studio page / Desktop');
      for (const it of studio.spec.items) studio.P.editBlock(list, it);
    };

    BASE.blockInspector = () => {
      const inspector = studio.P.pane('inspector', studio.work, 'ab-inspector');
      const tabs=studio.util.el('div','ab-tabs',inspector);studio.util.el('span','active',tabs,'Properties');studio.util.el('span','',tabs,'Style');
      studio.state.inspectName = studio.util.el('div', 'ab-caption', inspector);
      studio.P.field(inspector, { id: 'title', label: 'Text', limit: 90 }, true, 'inspector');
      studio.P.field(inspector, { id: 'url', label: 'Link URL', limit: 100 }, true, 'inspector');
      const label = studio.util.el('div', 'ab-field', inspector);
      studio.util.el('div', 'ab-fieldlabel', label, 'Alignment');
      const group = studio.util.el('div', 'ab-segment', label);
      for (const a of ['Left', 'Center', 'Right']) {
        const b = studio.P.alignmentButton(group, a);
        studio.state.align[a] = b;
        b.addEventListener('click', () => studio.P.edit((m) => { m.props[m.selected].align = a; }));
      }
      const padding = studio.P.field(inspector, { id: 'padding', label: 'Padding', limit: 2 }, true, 'inspector');
      padding.inputMode = 'numeric';
      const spacing=studio.util.el('div','ab-spacingbox',inspector,'MARGIN / 0');studio.state.spacingBox=studio.util.el('div','',spacing,'PADDING / 16 px');
      studio.util.el('div','ab-setting',inspector);studio.util.el('div','ab-caption',inspector,'Typography');studio.P.kv(inspector,'Font','System');studio.P.kv(inspector,'Weight','Regular / 400');studio.P.kv(inspector,'Line height','1.5');
      studio.util.el('div','ab-setting',inspector);studio.util.el('div','ab-caption',inspector,'Visibility');studio.P.kv(inspector,'Desktop','Visible');studio.P.kv(inspector,'Tablet / Mobile','Inherited');
    };

    BASE.blockedit = () => {
      studio.P.layers();
      studio.P.blockList();
      studio.P.blockInspector();
    };

    BASE.editBlockView = (list, it) => {
      const block = studio.P.ref({ block: it.id }, studio.util.el('button', 'ab-editblock', list), 'blocks'); block.type = 'button';
      studio.util.el('strong', '', block, it.label);
      const copy = studio.util.el('p', '', block), meta = studio.util.el('small', '', block);
      return { block, copy, meta };
    };

    BASE.editBlock = (list, it) => {
      const { block, copy, meta } = studio.P.editBlockView(list, it);
      studio.state.blocks[it.id] = { block, copy, meta };
      block.addEventListener('click', () => { studio.P.apply({ ...studio.ctx.model, selected: it.id }); });
      studio.P.item(studio.ctx, block, it);
    };

    BASE.alignmentButton = (group, a) => {
      const b = studio.P.ref({ align: a }, studio.util.el('button', '', group, a), 'inspector'); b.type = 'button';
      return b;
    };
  }

  env.template('use-site-builder/_panels', () => ({ installComposer, installSeo, installSocial, installBlocks }));
})();
