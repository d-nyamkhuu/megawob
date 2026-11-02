// RISC OS style icons, toolbar extras, and the wrapped reply editor distinguish this design.
(function () {
  'use strict';
  const drawings = {
    mail: '<path fill="#fff" stroke="#171717" d="M2 8h36v26H2z"/><path fill="none" stroke="#4166dd" d="m3 9 17 14L37 9M3 33l12-12m22 12L25 21"/><path stroke="#aaa" d="M4 35h34"/>',
    folder: '<path fill="#fff0a0" stroke="#171717" d="M2 7h13l3 4h19v25H2z"/><path fill="#fffbe0" stroke="#171717" d="M5 5h11v6H5z"/><path fill="#fff0a0" stroke="#171717" d="M5 12h31v24H5z"/><path stroke="#fff" d="M7 14h27M7 14v20"/>',
    reply: '<path fill="#fff" stroke="#171717" d="M18 4h15v16H18z"/><path fill="none" stroke="#888" d="M21 7h9M21 10h9"/><path fill="#fff0a0" stroke="#171717" d="M2 7h13l3 4h19v25H2z"/><path fill="#fffbe0" stroke="#171717" d="M5 5h11v6H5z"/><path fill="#fff0a0" stroke="#171717" d="M5 12h31v24H5z"/><path stroke="#fff" d="M7 14h27M7 14v20"/>',
    forward: '<path fill="#fff" stroke="#171717" d="M2 8h36v26H2z"/><path fill="none" stroke="#4166dd" d="m3 9 17 14L37 9M3 33l12-12m22 12L25 21"/><path stroke="#aaa" d="M4 35h34"/><path fill="#a6d2ff" stroke="#075ab8" d="m12 2 12 7-7 4 12 8-5 5L10 16l-6 4 1-15 7 5z"/><path fill="#fff" stroke="#075ab8" d="m29 16 7 6-10 13-4-4-8 7-6-5 10-7-4-4z"/>',
    delete: '<path fill="#d0d0d5" stroke="#161616" d="M6 9h27v27H6z"/><path fill="#eee" stroke="#161616" d="M4 6h31v5H4zM14 2h10v4H14z"/><path fill="none" stroke="#32323e" d="M11 13v20m5-20v20m5-20v20m5-20v20"/><path stroke="#fff" d="M8 13v20M31 12v22"/>',
    file: '<path fill="#fff" stroke="#161616" d="M8 2h19l6 7v22H8z"/><path fill="none" stroke="#1d3e86" d="M12 6h11m-11 4h16m-16 4h16"/><path fill="#ddd" stroke="#161616" d="M3 19h34v12H3z"/><path stroke="#fff" d="M5 21h30"/><path fill="#fff" stroke="#161616" d="M7 28h26v10H7z"/><path stroke="#222" d="M11 32h18M11 35h18"/>',
  };
  const mailDrawings = { mail: 'mail', unread: 'mail', new: 'mail', send: 'mail', move: 'folder' };

  env.widget({
    task: 'use-email',
    site: 'design-use-email-reply-03',
    name: 'design',
    split: 'train',
    scenarios: ['reply'],
    template: 'use-email/mail',
    design: {
      newLabel: 'New',
      newIcon: 'mail',
      rowHeight: 40,
      toolbarBefore: [['Move', 'move'], ['Print', 'file']],
      replyTitle: 'Reply to: ',
      sendIcon: 'mail',
      parts: {
        icon: (base, S) => (k) => {
          const key = mailDrawings[k] || k;
          if (!drawings[key]) return base(k);
          return '<svg viewBox="0 0 40 40" aria-hidden="true" class="risc-icon">' + drawings[key] + '</svg>';
        },
        toolbarMade: (base, S) => () => {
          base();
          S.el('span', 'email-tag', S.els.toolbar, 'Email');
        },
        editorBody: (base, S) => (shown) => {
          const wrap = S.el('div', 'body-wrap', S.els.editor);
          const area = S.el('textarea', '', wrap);
          area.placeholder = shown.mode === 'forward' ? S.D.forwardPlaceholder : S.D.replyPlaceholder;
          area.spellcheck = false;
          S.els.fields.body = env.ui.textField(area, {
            value: shown.body || '',
            label: 'body',
            ...(S.D.keyboard && { keyboard: true }),
            onInput: (v) => S.field('body', v),
          });
          S.els.reg.set('field:body', area);
          const scroll = S.el('div', 'body-scroll', wrap);
          for (const [label, dy] of [['▲', -80], ['▼', 80]]) {
            const arrow = S.el('button', 'scroll-arrow', scroll, label);
            arrow.type = 'button';
            arrow.setAttribute('aria-label', dy < 0 ? 'Scroll reply up' : 'Scroll reply down');
            arrow.addEventListener('click', () => { area.scrollTop += dy; });
          }
          return area;
        },
      },
    },
  });
})();
