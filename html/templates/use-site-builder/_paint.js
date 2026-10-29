/* use-site-builder/_paint: Model-to-view synchronization and read-only target location.
 * Installed by studio.js; studio getters retain live per-template episode state.
 * Every design-overridable part stays on BASE and calls other parts through studio.P.
 */
(function () {
  'use strict';

  function installPaint(BASE, studio) {
    BASE.paint = (m) => {
      studio.state.saved.textContent=m.committed ? studio.spec.scenario==='email'?'Campaign sent':studio.spec.scenario==='social'?'Schedule activated':'Published version saved' : 'All changes saved';
      if(studio.state.subjectCheck) { studio.state.subjectCheck.querySelector('span').textContent=m.fields.subject?'Subject line added':'Subject line missing'; studio.state.subjectCheck.querySelector('path').setAttribute('d',m.fields.subject?studio.icons.check:studio.icons.alert); }
      if(studio.state.seoCheck) { studio.state.seoCheck.querySelector('span').textContent=m.fields.title?'Title added':'Title not added'; studio.state.seoCheck.querySelector('path').setAttribute('d',m.fields.title?studio.icons.check:studio.icons.alert); }
      studio.status.textContent = `Status: ${studio.helpers.status(m, studio.spec)}`;
      studio.metric.textContent = studio.spec.scenario === 'social' ? `Scheduled posts: ${Object.values(m.schedule).filter((v) => v >= 0).length}` :
        studio.spec.scenario === 'seo' ? `Metadata characters: ${Object.values(m.fields).join('').length}` : `Words: ${studio.helpers.wordCount(m, studio.spec)}`;
      for (const entry of studio.state.fields) studio.P.paintField(entry, m);
      studio.state.slots.forEach((entry, i) => studio.P.paintSlot(entry, i, m));
      if (studio.spec.scenario === 'seo') studio.P.paintSeo(m);
      if (studio.spec.scenario === 'social') studio.P.paintSocial(m);
      if (studio.spec.scenario === 'blockedit') studio.P.paintBlocks(m);
      studio.P.mirror();
    };

    BASE.paintField = (entry, m) => {
      const value = String(m.fields[entry.def.id] || '');
      if (entry.input.value !== value) entry.input.value = value;
      entry.out.textContent = `${value.length} / ${entry.def.limit}`;
      entry.out.classList.toggle('full', value.length >= entry.def.limit);
      entry.fill.style.width = `${Math.min(100,value.length/entry.def.limit*100)}%`;
    };

    BASE.paintSlot = (entry, i, m) => {
      const it = studio.spec.items.find((item) => item.id === m.slots[i]);
      entry.slot.className = `ab-slot ${it ? 'filled' : 'empty'}`;
      entry.slot.dataset.type = it ? it.type : '';
      entry.title.textContent = it ? it.label : studio.D.emptySection;
      entry.copy.textContent = it && !['Divider', 'Spacer'].includes(it.type) ? it.copy : '';
      entry.visual.textContent = it && it.type === 'Spacer' ? 'Spacer' : '';
      entry.remove.style.display = it ? '' : 'none';
    };

    BASE.paintSeo = (m) => {
      studio.state.previewTitle.textContent = m.fields.title || studio.D.previewTitle;
      studio.state.previewDesc.textContent = m.fields.description || studio.D.previewDescription;
      studio.state.previewSlug.textContent = `${studio.D.domain}/${m.fields.slug || 'page'}`;
    };

    BASE.paintSocial = (m) => {
      studio.state.emptyDrafts.style.display = Object.values(m.schedule).some((v) => v < 0) ? 'none' : '';
      // Cards keep their listeners while moving between the tray and calendar cells.
      for (const it of studio.spec.items) {
        const post = studio.state.posts[it.id], dest = m.schedule[it.id] >= 0 ? studio.state.cells[m.schedule[it.id]] : studio.state.drafts;
        if (post.parentElement !== dest) dest.appendChild(post);
        post.querySelector('.ab-postmeta span').textContent=m.committed?'Scheduled / Social feed':m.schedule[it.id]>=0?'Planned / Social feed':'Draft / Social feed';
      }
      studio.state.records = studio.state.records.filter((r) => !r.key.startsWith('{"post":'));
      for (const it of studio.spec.items) studio.state.records.push({ key: studio.keyOf({ post: it.id }), el: studio.state.posts[it.id], pane: m.schedule[it.id] < 0 ? 'drafts' : `calendar${m.schedule[it.id]}` });
    };

    BASE.paintBlocks = (m) => {
      for (const it of studio.spec.items) {
        const p = m.props[it.id], entry = studio.state.blocks[it.id];
        entry.block.classList.toggle('ab-selected', it.id === m.selected);
        entry.copy.textContent = p.title; entry.copy.style.textAlign = p.align.toLowerCase();
        entry.block.style.paddingTop = entry.block.style.paddingBottom = `${p.padding}px`;
        entry.meta.textContent = `${p.url} · ${p.padding}px padding`;
      }
      studio.state.spacingBox.textContent=`PADDING / ${m.props[m.selected].padding} px`;
      studio.state.inspectName.textContent = `Inspector / ${studio.spec.items.find((it) => it.id === m.selected).label}`;
      for (const entry of studio.state.props) {
        const value = String(m.props[m.selected][entry.def.id]);
        if (entry.input.value !== value) entry.input.value = value;
        entry.out.textContent = entry.def.id === 'padding' ? 'px / 0-64' : `${value.length} / ${entry.def.limit}`;
        entry.fill.style.width = entry.def.id==='padding'?`${Number(value)/64*100}%`:`${Math.min(100,value.length/entry.def.limit*100)}%`;
      }
      for (const a of Object.keys(studio.state.align)) studio.state.align[a].classList.toggle('on', m.props[m.selected].align === a);
    };

    BASE.item = (ctx, el, item) => {};

    BASE.rendered = (ctx) => {};

    BASE.locate = (t) => {
      if (t.pane) return studio.center(studio.st.panes[t.pane]);
      const el = studio.st.refs.get(studio.keyOf(t));
      if (!el || !el.isConnected) throw new Error(`use-site-builder: missing target ${JSON.stringify(t)}`);
      return studio.center(el);
    };
  }

  env.template('use-site-builder/_paint', () => ({ installPaint }));
})();
