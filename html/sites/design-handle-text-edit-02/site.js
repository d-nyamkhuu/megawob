(() => {
  'use strict';
  const paths = {
    share: '<path d="M6 12v18h20V12M16 23V2m-7 8 7-8 7 8"/>',
    tag: '<path d="m3 14 11-11h10v10L13 24 3 14Z"/><circle cx="19" cy="8" r="1.2"/>',
    search: '<circle cx="12" cy="12" r="8"/><path d="m18 18 7 7"/>',
    page: '<path d="M6 2h13l7 7v21H6V2Zm13 0v8h7M10 16h11m-11 5h11m-11 5h8"/>',
    people: '<circle cx="17" cy="9" r="5"/><path d="M8 28v-4c0-6 18-6 18 0v4H8Zm-3-2H2v-3c0-4 3-6 7-6m18 0c4 0 7 2 7 6v3h-4M7 5c-4 0-5 7 0 9m20-9c4 0 5 7 0 9"/>',
    comment: '<path d="M4 21c-7-13 17-23 25-10 6 10-5 18-16 15L5 31l3-8"/><path d="M11 15h1m6 0h1m6 0h1"/>',
    clock: '<circle cx="17" cy="17" r="14"/><path d="M17 7v11l8 5"/>',
    calendar: '<rect x="4" y="6" width="23" height="23" rx="2"/><path d="M4 12h23M10 3v6m11-6v6M9 17h2m5 0h2m5 0h1M9 22h2m5 0h2m5 0h1"/>',
    chevrons: '<path d="m11 12 6-6 6 6m-12 9 6 6 6-6"/>',
    check: '<path d="m5 16 7 7L27 7"/>'
  };
  const icon = (name) => '<svg viewBox="0 0 34 34" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + paths[name] + '</svg>';
  const labelText = (x) => typeof x === 'string' ? x : x.label || x.text || x.name;
  env.site({
    name: 'design-handle-text-edit-02', styles: ['site.css'],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'ref macdoc';
      const shell = u.el('main', 'shell', document.body);
      shell.dataset.instruction = ctx.display;
      const head = u.el('header', 'head', shell);
      const traffic = u.el('div', 'traffic-lights', head);
      traffic.setAttribute('aria-hidden', 'true');
      traffic.innerHTML = '<i></i><i></i><i></i>';
      u.el('div', 'window-title', head, 'Project Brief — Riverside Park');
      const toolbar = u.el('div', 'window-toolbar', head);
      for (const name of ['share', 'tag']) {
        const item = u.el('span', 'toolbar-icon', toolbar);
        item.innerHTML = icon(name);
      }
      const search = u.el('div', 'window-search', toolbar);
      search.innerHTML = icon('search') + '<span>Search</span>';
      const work = u.el('div', 'record-workspace', shell);
      const overview = u.el('section', 'record-summary', work);
      const photo = u.el('img', 'park-photo', overview);
      photo.src = 'sites/design-handle-text-edit-02/assets/riverside-park.jpg';
      photo.alt = 'Riverside Park overlooking the water and city skyline';
      const copy = u.el('div', 'record-summary-copy', overview);
      u.el('h1', 'record-heading', copy, 'Riverside Park');
      const noteParent = ctx.display === 'header' ? copy : null;
      let note = null;
      if (noteParent) note = u.el('div', 'task-note header-note', noteParent, ctx.instruction);
      u.el('p', 'record-subtitle', copy, 'Community Spaces Initiative');
      u.el('p', 'record-intro', copy, 'Improve and expand Riverside Park with new green spaces, accessibility upgrades and amenities for all ages.');
      const stats = u.el('div', 'record-statistics', copy);
      for (const [name, value, label] of [['page','12','Pages'],['people','5','Contributors'],['comment','28','Comments'],['clock','Apr 18, 2024','Last edited']]) {
        const stat = u.el('div', 'record-statistic', stats);
        const pictogram = u.el('span', 'statistic-icon', stat); pictogram.innerHTML = icon(name);
        const words = u.el('div', 'statistic-text', stat);
        u.el('strong', '', words, value); u.el('span', '', words, label);
      }
      const center = u.el('section', 'center', work);
      const stage = u.el('div', 'stage', center);
      const aside = u.el('aside', 'record-inspector', work);
      const meta = u.el('section', 'inspector-section metadata', aside);
      for (const [label, value, kind] of [['Status','In Progress','choice'],['Priority','High','choice'],['Due Date','May 31, 2024','date']]) {
        const row = u.el('div', 'metadata-row', meta);
        u.el('span', 'metadata-label', row, label);
        const control = u.el('div', 'metadata-control ' + kind, row);
        u.el('span', '', control, value);
        const arrow = u.el('span', 'metadata-glyph', control);
        arrow.innerHTML = icon(kind === 'date' ? 'calendar' : 'chevrons');
      }
      const metrics = u.el('section', 'inspector-section document-metrics', aside);
      for (const [label, value] of [['Word Count','314'],['Character Count','2,051'],['Reading Time','2 min']]) {
        const row = u.el('div', 'metric-row', metrics);
        u.el('span', '', row, label); u.el('span', 'metric-value', row, value);
      }
      if (ctx.display === 'panel' || ctx.display === 'toast') {
        note = u.el('div', 'task-note ' + ctx.display + '-note', aside);
        const info = u.el('span', 'note-symbol', note, 'i');
        info.setAttribute('aria-hidden', 'true');
        u.el('span', 'note-text', note, ctx.instruction);
      }
      const counters = u.el('section', 'inspector-section counters', aside);
      for (const [label, value] of [['Revision','3'],['Team Size','5']]) {
        const row = u.el('div', 'counter-row', counters);
        u.el('span', '', row, label);
        const control = u.el('div', 'counter-control', row);
        u.el('span', '', control, value);
        const arrows = u.el('span', 'counter-arrows', control); arrows.innerHTML = icon('chevrons');
      }
      let submit = null;
      if (!ctx.finish) {
        const endR = ctx.rng.fork('chrome/end');
        let endText = 'Done', placement = 'footer';
        if (!endR.bool(.5)) {
          placement = endR.pick(['icon', 'link', 'header']);
          const bank = (ctx.content && ctx.content.END_LABELS || ['Done','Finish','Continue','Save','OK','Confirm','Apply']).map(labelText);
          endText = endR.pick(bank);
        }
        const footer = u.el('footer', 'form-footer', aside);
        const parent = placement === 'header' ? toolbar : footer;
        submit = u.el(placement === 'link' ? 'a' : 'button', 'end-control ' + placement, parent, placement === 'icon' ? '' : endText);
        if (placement === 'link') submit.href = '#'; else submit.type = 'button';
        if (placement === 'icon') { submit.innerHTML = icon('check'); submit.title = endText; submit.setAttribute('aria-label', endText); }
        submit.addEventListener('click', e => { e.preventDefault(); ctx.submit(); });
        if (placement === 'header') toolbar.insertBefore(submit, search);
        const collideR = ctx.rng.fork('chrome/collide');
        if (collideR.bool(.3)) {
          const bank = (ctx.content && ctx.content.END_LABELS || ['Save','Confirm','Continue']).map(labelText).filter(x => x !== endText);
          const label = collideR.pick(bank);
          const decoy = u.el('button', 'xtra-control', footer, label); decoy.type = 'button';
          decoy.addEventListener('click', () => env.log('decoy', {label, collide:true}));
          const go = u.el('button', 'xtra-control filler-control', footer, 'Go'); go.type = 'button';
          go.addEventListener('click', () => env.log('decoy', {label:'Go'}));
        }
        if (!footer.children.length) footer.remove();
      }
      return {stage, submit};
    },
    overlay(ctx) {
      const u = ctx.util, el = u.el('section', 'perturb ' + ctx.kind, document.body);
      u.el('strong', '', el, {cookie:'Cookie preferences',toast:'Notification',chat:'Project support',promo:'Stay up to date',banner:'Community update'}[ctx.kind]);
      u.el('p', '', el, {cookie:'Choose your preferences for this workspace.',toast:'Your workspace is ready.',chat:'How can we help with your project?',promo:'Get the latest community project updates.',banner:'A new update is available for your workspace.'}[ctx.kind]);
      const dismiss = u.el('button', 'dismiss', el, ctx.kind === 'cookie' ? 'Accept' : 'Close');
      dismiss.type = 'button'; dismiss.addEventListener('click', ctx.dismiss);
      if (ctx.kind === 'banner') {
        const note = document.querySelector('.header-note');
        if (note) el.style.top = (note.getBoundingClientRect().bottom + 8) + 'px';
      }
      return {el, dismiss};
    }
  });
})();
