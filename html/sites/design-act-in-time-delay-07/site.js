(function () {
  'use strict';
  const C = { site: 'design-act-in-time-delay-07' };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const u = ctx.util,
        body = document.body;
      const top = u.el('header', 'xp-title', body);
      u.el('span', 'xp-appicon', top, '▣');
      u.el('strong', 'xp-appname', top, 'Photo Organizer');
      const win = u.el('div', 'xp-window', top);
      ['−', '□', '×'].forEach((x, i) => u.el('span', 'xp-windowbtn ' + (i === 2 ? 'close' : ''), win, x));
      const menu = u.el('nav', 'xp-menu', body);
      ['File', 'Edit', 'View', 'Tools', 'Help'].forEach((x) => u.el('span', '', menu, x));
      const tools = u.el('div', 'xp-toolbar', body);
      [
        ['▰', 'Add Photos'],
        ['×', 'Remove'],
        ['↶', 'Rotate Left'],
        ['↷', 'Rotate Right'],
        ['◆', 'Tag'],
        ['▣', 'Properties'],
      ].forEach((item, i) => {
        if (i === 2 || i === 4) {
          const sep = u.el('i', 'xp-separator', tools);
        }
        const b = u.el('button', 'xp-tool', tools);
        b.type = 'button';
        u.el('b', '', b, item[0]);
        u.el('span', '', b, item[1]);
      });
      const workspace = u.el('main', 'xp-stage', body);
      const stage = u.el('div', 'xp-skin-stage', workspace);
      const table = u.el('section', 'xp-ledger', workspace);
      const heads = u.el('div', 'xp-headrow', table);
      ['Name', 'Date Taken', 'Size', 'Type', 'Tag'].forEach((x) => u.el('span', '', heads, x));
      const rows = [
        ['Beach.jpg', '7/12/2008 10:24 AM', '2.4 MB', 'JPEG Image', 'Vacation'],
        ['Forest.jpg', '6/3/2008 4:17 PM', '1.8 MB', 'JPEG Image', 'Nature'],
        ['City.jpg', '5/21/2008 2:03 PM', '2.1 MB', 'JPEG Image', 'Trip'],
        ['Family.jpg', '4/6/2008 11:20 AM', '1.6 MB', 'JPEG Image', 'Family'],
        ['Mountains.jpg', '3/14/2008 9:15 AM', '2.8 MB', 'JPEG Image', 'Nature'],
        ['Dog.jpg', '2/2/2008 1:10 PM', '1.1 MB', 'JPEG Image', 'Pets'],
        ['Sunset.jpg', '1/27/2008 6:43 AM', '2.0 MB', 'JPEG Image', 'Nature'],
        ['Garden.jpg', '12/11/2007 3:36 PM', '1.5 MB', 'JPEG Image', 'Outdoors'],
      ];
      rows.forEach((r, i) => {
        const row = u.el('div', 'xp-row' + (i === 0 ? ' selected' : ''), table);
        u.el('span', 'xp-thumb', row, ['▧', '▨', '▧', '▦'][i % 4]);
        r.forEach((v, j) => u.el('span', '', row, v));
      });
      const preview = u.el('aside', 'xp-preview', workspace);
      const pbar = u.el('div', 'xp-previewbar', preview);
      u.el('b', '', pbar, 'Preview');
      const close = u.el('button', 'xp-previewclose', pbar, '×');
      close.type = 'button';
      const landscape = u.el('div', 'xp-landscape', preview);
      u.el('div', 'xp-island', landscape);
      u.el('div', 'xp-caption', preview, 'Beach.jpg');
      u.el('div', 'xp-caption', preview, '2.4 MB');
      u.el('div', 'xp-caption', preview, '7/12/2008 10:24 AM');
      const note = u.el('aside', 'xp-instruction', workspace);
      u.el('div', 'xp-clockface', note, '◷');
      const noteText = u.el('div', 'xp-notecontent', note);
      u.el('strong', 'xp-prompt', noteText, ctx.instruction);
      u.el('div', 'xp-subtext', noteText, 'The Start button will become enabled on the task clock.');
      const readout = u.el('div', 'xp-readout', noteText);
      u.el('span', '', readout, 'Task clock:');
      u.el('span', 'xp-time', readout, '00:15');
      u.el('span', 'xp-status', readout, 'Status: Waiting for start time…');
      const endbar = u.el('footer', 'xp-endbar', body);
      const taskbar = u.el('footer', 'xp-taskbar', body);
      const osStart = u.el('button', 'xp-os-start', taskbar);
      u.el('span', 'xp-windows-logo', osStart);
      u.el('span', '', osStart, 'start');
      const task = u.el('button', 'xp-taskitem', taskbar);
      u.el('span', 'xp-taskicon', task, '▣');
      u.el('span', '', task, 'Photo Organizer');
      const tray = u.el('div', 'xp-tray', taskbar);
      u.el('span', '', tray, '▣  ▪  ◖');
      u.el('time', '', tray, '10:24 AM');
      let submit = null;
      if (!ctx.finish) {
        // Retain the existing streams; the added fork gives the reference form half the episodes.
        const oldPlace = ctx.rng.fork('chrome/end-placement').pick(['footer', 'toolbar', 'link']);
        const labels =
          ctx.content && Array.isArray(ctx.content.END_LABELS)
            ? ctx.content.END_LABELS.map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name))
            : ['Done', 'Finish', 'Continue', 'Save', 'OK'];
        const er = ctx.rng.fork('chrome/end-label');
        const oldLabel = er.bool(0.5) ? 'Submit' : er.pick(labels);
        const endRng = ctx.rng.fork('chrome/end');
        const referenceEnd = endRng.bool(0.5);
        const place = referenceEnd ? 'footer' : oldPlace === 'footer' ? endRng.pick(['toolbar', 'link']) : oldPlace;
        const alternatives = labels.filter((x) => String(x).trim().toLowerCase() !== 'submit');
        const label = referenceEnd
          ? 'Submit'
          : oldLabel === 'Submit'
            ? endRng.pick(alternatives.length ? alternatives : ['Done'])
            : oldLabel;
        submit = u.el(
          place === 'link' ? 'a' : 'button',
          'xp-submit ' + (place === 'toolbar' ? 'xp-submit-toolbar' : '') + (place === 'link' ? ' xp-submit-link' : ''),
          place === 'toolbar' ? tools : endbar,
          label,
        );
        if (place === 'link') submit.href = '#';
        else submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.title = label;
        submit.setAttribute('aria-label', label);
        submit.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
      }
      const cr = ctx.rng.fork('chrome/collide');
      if (!ctx.finish && cr.bool(0.3)) {
        const labels =
          ctx.content && Array.isArray(ctx.content.END_LABELS)
            ? ctx.content.END_LABELS.map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name))
            : ['Done', 'Finish', 'Continue', 'Save', 'OK'];
        const label = (submit && submit.textContent) || 'Submit',
          pool = labels.filter((x) => String(x).trim().toLowerCase() !== String(label).trim().toLowerCase());
        if (pool.length) {
          const d = u.el('button', 'xp-tool xp-xtra', tools, cr.pick(pool));
          d.type = 'button';
          d.dataset.role = 'xtra';
          d.addEventListener('click', () => env.log('decoy', { label: d.textContent, collide: true }));
        }
      }
      note.dataset.display = ctx.display || 'header';
      note.hidden = ctx.display === 'hidden';
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      const el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = {
        cookie: 'We use cookies to remember your preferences.',
        toast: 'Changes synced.',
        chat: 'Hello. How can we help?',
        promo: 'Try our new workspace.',
        banner: 'Scheduled maintenance tonight.',
      };
      u.el('div', '', el, texts[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  });
})();
