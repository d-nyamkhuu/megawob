(function () {
  'use strict';
  const svg = (kind) => {
    const defs = '<defs><linearGradient id="paper" x2="0" y2="1"><stop stop-color="#fff"/><stop offset="1" stop-color="#d7e2ea"/></linearGradient><linearGradient id="folder" x2="0" y2="1"><stop stop-color="#d8ecfd"/><stop offset="1" stop-color="#80b3dc"/></linearGradient><linearGradient id="gold" x2="0" y2="1"><stop stop-color="#ffe7ad"/><stop offset="1" stop-color="#c99b52"/></linearGradient></defs>';
    const shapes = {
      compose: '<path d="M6 5h19v25H6z" fill="url(#paper)" stroke="#70808b"/><path d="m12 23 2-7L27 3l3 3-13 14z" fill="#ecd485" stroke="#596876"/><path d="m14 16 3 4M25 5l3 3" stroke="#344a64"/>',
      envelope: '<rect x="3" y="9" width="26" height="19" rx="1" fill="url(#paper)" stroke="#6b7b8c"/><path d="m3 10 13 10 13-10M3 27l10-10m16 10-10-10" fill="none" stroke="#6b7b8c"/><path d="m23 22 7 6-2-10" fill="#4586c0"/>',
      book: '<path d="M5 3h21l2 28H5z" fill="url(#gold)" stroke="#665741"/><path d="M5 3H2v28h5" fill="#5b554a"/><rect x="10" y="10" width="11" height="14" rx="2" fill="#f2e3be" stroke="#aa8958"/><circle cx="16" cy="14" r="3" fill="#fff"/><path d="M11 22q0-8 5-5 5-3 5 5" fill="#fff"/>',
      delete: '<circle cx="16" cy="16" r="14" fill="#df8178" stroke="#7a7773" stroke-width="1.5"/><circle cx="16" cy="16" r="9.5" fill="#f5f5f0" stroke="#925a54"/><path d="m8 7 17 18" stroke="#bc5b54" stroke-width="5"/>',
      folder: '<path d="M3 8V4h11l3 3h13l-1 22H2z" fill="url(#folder)" stroke="#557998" stroke-width="1.5"/><path d="M3 9h27L28 29H2z" fill="url(#folder)" stroke="#557998" stroke-width="1.3"/><path d="M6 11h20" stroke="#effaff"/>',
      inbox: '<path d="M7 3h18l6 25H1z" fill="url(#folder)" stroke="#536979" stroke-width="1.5"/><path d="M4 19h8l3 5h4l3-5h7v11H3z" fill="url(#paper)" stroke="#536979"/><path d="m5 28 11-7 12 7" fill="none" stroke="#8799a4"/>',
      page: '<path d="M7 2h14l7 7v22H7z" fill="url(#paper)" stroke="#7b858c"/><path d="M21 2v8h7M10 15h14m-14 4h14m-14 4h14m-14 4h14" fill="none" stroke="#c2c9ce"/>',
      sent: '<path d="m2 14 29-12-9 29-7-12z" fill="url(#paper)" stroke="#6b7984" stroke-width="1.2"/><path d="m15 19 16-17L11 16l-1 9 5-6" fill="none" stroke="#8799a7"/>',
      junk: '<rect x="3" y="9" width="27" height="20" rx="3" fill="url(#gold)" stroke="#8e754f"/><path d="M11 9V5h12v4M10 19l2 6m4-10-1 11m6-11 2 10" fill="none" stroke="#9d804e"/>',
      trash: '<path d="m7 9 2 22h16l2-22" fill="url(#paper)" stroke="#63717b" stroke-width="1.5"/><ellipse cx="17" cy="8" rx="12" ry="3" fill="#bcc6cc" stroke="#5d6970"/><path d="M13 5V2h8v3m-9 7 1 16m4-16v16m5-16-1 16" fill="none" stroke="#6d7b84"/>'
    };
    return '<svg viewBox="0 0 34 34" aria-hidden="true">' + defs + (shapes[kind] || shapes.folder) + '</svg>';
  };
  const buildFrame = (base) => (ctx) => {
    const result = base(ctx); // Retain every shared frame draw and all control handlers.
    const el = ctx.util.el;
    const root = el('div', 'aqua-app', document.body);
    const menu = el('div', 'mail-menu', root);
    const apple = el('span', 'mail-apple', menu);
    apple.innerHTML = '<svg viewBox="0 0 24 29" aria-hidden="true"><defs><linearGradient id="appleBlue" x2="0" y2="1"><stop stop-color="#72c4ff"/><stop offset="1" stop-color="#0061c5"/></linearGradient></defs><path d="M13 7C10 3 2 6 2 14c0 7 5 13 8 12l3-1 3 1c3 1 7-6 7-9-5-2-5-7-1-9-3-4-6-3-9-1zM13 5c-1-4 3-5 6-5 0 4-3 6-6 5z" fill="url(#appleBlue)" stroke="#195587"/></svg>';
    for (const item of ['Mail', 'File', 'Edit', 'View', 'Mailbox', 'Message', 'Format', 'Window', 'Help']) el('span', item === 'Mail' ? 'mail-menu-app' : '', menu, item);
    const title = el('div', 'mail-titlebar', root);
    for (const c of ['red', 'yellow', 'green']) el('span', 'mail-light ' + c, title);
    el('span', 'mail-collapse', title);
    const toolbar = el('div', 'mail-toolbar', root);
    const appTools = el('div', 'mail-app-tools', toolbar);
    for (const [label, icon] of [['New Message', 'compose'], ['Send', 'envelope'], ['Address Book', 'book'], ['Delete', 'delete']]) {
      const b = el('button', 'mail-tool mail-tool-' + icon, appTools);
      b.type = 'button';
      const art = el('span', 'mail-tool-icon', b); art.innerHTML = svg(icon);
      el('span', '', b, label);
      b.addEventListener('click', () => env.log('decoy', {label}));
    }
    const headerNote = document.querySelector('.ref-instruction');
    if (headerNote) toolbar.appendChild(headerNote);
    const actions = el('div', 'mail-end-tools', toolbar);
    for (const b of [...document.querySelectorAll('.ref-xtra')]) actions.appendChild(b);
    const body = el('div', 'mail-workspace', root);
    const folders = el('aside', 'mail-folders', body);
    el('div', 'mail-folders-title', folders, 'Mailboxes');
    const folderRow = (label, icon, cls) => {
      const row = el('div', 'mail-folder-row ' + (cls || ''), folders);
      const art = el('span', 'mail-folder-icon', row); art.innerHTML = svg(icon);
      el('span', '', row, label);
    };
    folderRow('Inbox (3)', 'inbox', 'selected'); folderRow('Drafts', 'page');
    folderRow('Sent', 'sent'); folderRow('Junk', 'junk'); folderRow('Trash', 'trash');
    el('div', 'mail-folder-divider', folders);
    folderRow('Personal Folders', 'folder', 'mail-personal');
    for (const name of ['Family', 'Travel', 'Work']) folderRow(name, 'folder', 'mail-child-folder');
    const nav = [...document.querySelectorAll('.ref-side, .ref-nav')];
    if (nav.length) {
      const extra = el('details', 'mail-other-folders', folders);
      el('summary', '', extra, 'Other Mailboxes');
      for (const n of nav) extra.appendChild(n);
    }
    const main = el('section', 'mail-main', body);
    const sheet = el('section', 'mail-sheet', main);
    const metadata = el('div', 'mail-metadata', sheet);
    for (const text of ['To:', 'Cc:', 'Subject:']) {
      const row = el('label', 'mail-address-row', metadata);
      el('span', '', row, text);
      const input = el('input', text === 'To:' ? 'mail-to' : '', row);
      input.type = 'text'; input.setAttribute('aria-label', text.slice(0, -1));
    }
    el('div', 'mail-rule', sheet);
    sheet.appendChild(result.stage);
    const status = el('div', 'mail-message-footer', sheet);
    const count = el('span', 'mail-character-count', status, '0 characters');
    const formatButton = (parent, value, cls) => {
      const b = el('button', 'mail-pop ' + (cls || ''), parent);
      b.type = 'button'; el('span', '', b, value); el('span', 'mail-pop-arrows', b, '▴\n▾');
      b.addEventListener('click', () => env.log('decoy', {label:value})); return b;
    };
    formatButton(status, 'Plain Text', 'mail-bottom-format');
    const updateCount = (e) => { if (e.target.tagName === 'TEXTAREA') count.textContent = e.target.value.length + ' characters'; };
    result.stage.addEventListener('input', updateCount);
    result.stage.addEventListener('focusin', updateCount);
    const inspector = el('aside', 'mail-inspector', body);
    const tabs = el('div', 'mail-inspector-tabs', inspector);
    el('button', 'active', tabs, 'Message'); el('button', '', tabs, 'Contacts');
    el('h3', '', inspector, 'Message Properties');
    for (const [label, value] of [['Priority:', 'Normal'], ['Format:', 'Plain Text']]) {
      const row = el('div', 'mail-property', inspector); el('span', '', row, label); formatButton(row, value);
    }
    el('div', 'mail-rule', inspector);
    for (const text of ['Request Read Receipt', 'Request Delivery receipt']) {
      const row = el('label', 'mail-check-row', inspector);
      const check = el('input', '', row); check.type = 'checkbox'; el('span', '', row, text);
    }
    el('div', 'mail-rule', inspector);
    const signature = el('div', 'mail-property', inspector); el('span', '', signature, 'Signature:'); formatButton(signature, 'None');
    const panel = document.querySelector('.ref-panel');
    if (panel) { body.classList.add('mail-with-panel'); body.appendChild(panel); }
    const note = document.querySelector('.ref-note');
    if (note) { const row = el('div', 'mail-toast-row', root); row.appendChild(note); }
    if (result.submit) {
      const r = ctx.rng.fork('aqua/end-placement');
      const place = r.pick(['header', 'header', 'header', 'footer', 'link', 'icon']);
      const label = result.submit.getAttribute('aria-label') || result.submit.title || result.submit.textContent;
      result.submit.textContent = place === 'icon' ? '✓' : label;
      result.submit.classList.toggle('mail-end-icon', place === 'icon');
      result.submit.classList.toggle('mail-end-link', place === 'link');
      if (place === 'footer' || place === 'link') {
        const foot = el('div', 'mail-bottom-tools', main); foot.appendChild(result.submit);
      } else actions.appendChild(result.submit);
    }
    for (const old of [...document.querySelectorAll('body > .ref-task, body > .ref-body, body > .ref-foot, body > .ref-float-dock')]) old.remove();
    return result;
  };
  env.site({
    name: 'design-type-text-textarea-05',
    styles: ['site.css'],
    scripts: [],
    template: 'site/base',
    design: {
      parts: {
        frame: (base) => buildFrame(base),
        endLabel: (base) => (rng, content) => { const label = base(rng, content); return rng.fork('aqua/end-label').bool(.55) ? 'OK' : label; },
      },
    },
  });
})();
