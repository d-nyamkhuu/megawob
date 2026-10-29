// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const paths = {
    chat: '<path d="M4 4h16v12H9l-5 4z"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="1"/><path d="M7 2v6m10-6v6M3 10h18"/>',
    people: '<circle cx="9" cy="7" r="3"/><path d="M3 21v-3c0-5 12-5 12 0v3zm14-17c5 0 5 7 0 7m1 4c4 0 5 3 4 6"/>',
    file: '<path d="M5 2h9l5 5v15H5zM14 2v6h5M8 12h8m-8 4h8"/>',
    settings: '<path d="m9 3 1-2h4l1 3 3 1 3-1 2 4-2 2v4l2 2-2 4-3-1-3 1-1 3h-4l-1-3-3-1-3 1-2-4 2-2v-4L1 8l2-4 3 1z"/><circle cx="12" cy="12" r="4"/>',
    rooms: '<path d="M3 3h7v7H3zm11 0h7v7h-7zM3 14h7v7H3zm11 0h7v7h-7z"/>',
    clock: '<circle cx="12" cy="12" r="10"/><path d="M12 5v8l5 3"/>',
    video: '<rect x="2" y="5" width="14" height="14" rx="2"/><path d="m17 9 5-3v12l-5-3z"/>'
  };
  const icon = (util, parent, name) => {
    const span = util.el('span', 'hub-icon', parent);
    span.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round">' + paths[name] + '</svg>';
    return span;
  };
  const parts = {
    endLabel: (base) => (rng, content) => {
      const sampled = base(rng, content);
      return rng.fork('teamhub/preferred-label').bool(0.5) ? 'Done' : sampled;
    },
    'frame.end': (base) => function (c) {
      const result = base(c);
      const { util, ctx, header, body, stage, submit } = c;
      document.body.className = 'hub-page';
      document.documentElement.style.setProperty('--u', ((ctx.size && (ctx.size.w || ctx.size.width)) || c.W) / 1536 + 'px');
      const root = util.el('div', 'hub-root', document.body);
      const top = util.el('header', 'hub-top', root);
      const brand = util.el('div', 'hub-brand', top);
      util.el('span', 'hub-logo', brand);
      util.el('strong', '', brand, 'TeamHub');
      const nav = util.el('nav', 'hub-nav', top);
      for (const [name, label] of [['chat','Chat'],['calendar','Meetings'],['people','People'],['file','Files'],['settings','Settings']]) {
        const tab = util.el('div', 'hub-tab' + (label === 'Meetings' ? ' is-active' : ''), nav);
        icon(util, tab, name); util.el('span', '', tab, label);
      }
      const account = util.el('div', 'hub-account', top);
      util.el('span', 'hub-account-avatar', account, 'JS');
      util.el('span', '', account, 'Jamie Singh'); util.el('span', '', account, '⌄');
      const content = util.el('div', 'hub-content', root);
      const side = util.el('aside', 'hub-sidebar', content);
      util.el('h2', '', side, 'Weekly Sync');
      const live = util.el('div', 'hub-live', side);
      icon(util, live, 'video'); util.el('span', '', live, 'In progress'); util.el('b', '', live, '00:14:27');
      const menu = util.el('div', 'hub-meeting-nav', side);
      for (const [name, label] of [['chat','Discussion'],['people','Participants'],['rooms','Breakout Rooms'],['settings','Meeting Settings']]) {
        const row = util.el('div', 'hub-meeting-item' + (label === 'Breakout Rooms' ? ' is-active' : ''), menu);
        icon(util, row, name); util.el('span', '', row, label);
      }
      const summary = util.el('section', 'hub-summary', side);
      util.el('h3', '', summary, 'MEETING SUMMARY');
      for (const [name, value, label] of [['people','6','Participants'],['rooms','3','Breakout Rooms'],['clock','00:14:27','Elapsed Time']]) {
        const row = util.el('div', 'hub-summary-row', summary); icon(util, row, name);
        const text = util.el('div', '', row); util.el('strong', '', text, value); util.el('span', '', text, label);
      }
      const main = util.el('main', 'hub-main', content);
      const title = util.el('div', 'hub-heading', main);
      util.el('h1', '', title, 'Breakout Rooms');
      const tools = util.el('div', 'hub-tools', title);
      const settings = util.el('button', 'hub-settings', tools); icon(util, settings, 'settings'); util.el('span', '', settings, 'Room Settings');
      settings.addEventListener('click', () => env.log('decoy', {label:'Room Settings'}));
      const work = util.el('div', 'hub-work', main); work.appendChild(stage);
      const panel = body.querySelector('.ref-panel');
      if (panel) work.appendChild(panel);
      const note = document.querySelector('.ref-note');
      if (note) { side.appendChild(note); side.classList.add('has-note'); }
      const instruction = header.querySelector('.ref-instruction');
      if (instruction) { nav.replaceWith(header); header.classList.add('hub-header-note'); }
      for (const button of document.querySelectorAll('.ref-xtra')) tools.appendChild(button);
      if (submit) {
        const form = ctx.rng.fork('teamhub/end-form').pick(['footer','footer','footer','header','link','icon']);
        if (form === 'header' || form === 'icon') tools.appendChild(submit);
        else { const foot = util.el('footer', 'hub-footer', root); foot.appendChild(submit); }
        submit.className = 'hub-end' + (form === 'link' ? ' is-link' : '') + (form === 'icon' ? ' is-icon' : '');
        if (form === 'icon') submit.textContent = '✓';
      }
      body.remove();
      for (const el of document.querySelectorAll('body > .ref-task, body > .ref-foot, body > .ref-float-dock')) el.remove();
      return result;
    },
    overlay: (base) => function(ctx) {
      const result = base(ctx);
      if (ctx.kind === 'banner') {
        const heading = document.querySelector('.hub-heading');
        result.el.style.top = heading.getBoundingClientRect().bottom + 'px';
      }
      return result;
    }
  };

  env.site({
    name: 'design-use-chat-breakout-05',
    template: 'site/base',
    design: { parts },
  });
})();
