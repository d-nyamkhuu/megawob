// Design of this site on the use-desktop-tools/workspace template: an OS-style menu bar with the editor's tools spread over
// it, a framed page with a classic scroll bar and an Ln / Col status line.
(function () {
  'use strict';
  const lab = (t) => `<small>${t}</small>`;
  const pg = '<path fill="white" d="M3 1h7l3 3.5V15H3z"/><path d="M10 1v3.5h3"/>';
  const DECO = [['New', pg], ['Open', '<path fill="#ddd" d="M1 6V3h5l1.5 2H13v3H3z"/><path fill="#ddd" d="M1 13l3-6h11l-3 6z"/>'], ['Save', '<path fill="#111" d="M1 1h12l2 2v12H1z"/><path fill="#eee" d="M3 1h9v6H3z M3 10h10v5H3z"/><path d="M9 2v4M5 11h6M5 13h6"/>'], ['Print', '<path fill="#eee" d="M3 2h9l-1 6H2z M2 7h11l2 2v4H2l-1-2z M3 10h10v5H3z"/><path d="M4 4h6M4 6h6M4 11h8M4 13h8M13 8v3M14 9v3"/>']];
  const DECO2 = [['Cut', '<path d="M5 1L10 11M11 1L6 11M5 1Q3 5 7 8M11 1Q13 5 9 8"/><ellipse cx="5" cy="12.5" rx="1.6" ry="2.2"/><ellipse cx="11" cy="12.5" rx="1.6" ry="2.2"/>'], ['Copy', '<path fill="white" d="M1 1h6l3 3v9H1z M6 4h6l3 3v9H6z"/><path d="M7 1v3h3M12 4v3h3M3 5h2M3 7h2M3 9h2M8 9h5M8 11h5M8 13h5"/>'], ['Paste', '<path fill="#ddd" d="M2 2h10v12H2z"/><path fill="white" d="M6 6h7l2 2v7H6z"/><path fill="#ddd" d="M5 1h4v3H5z"/><path d="M8 9h5M8 11h5M8 13h5"/>']];
  env.widget({
    task: 'use-desktop-tools',
    site: 'design-use-desktop-tools-editor-09',
    name: 'design',
    split: 'train',
    scenarios: ['editor'],
    template: 'use-desktop-tools/workspace',
    design: {
      toolIcons: {},
      wordsLabel: (n) => `${n} words`,
      toolbar: ['@deco', 'bold', 'italic', 'underline', '|', 'color', '@extra', 'size', '|', 'align-left', 'align-center',
        'align-right', 'align-justify', '|', 'bullet', 'number', '|', 'undo', 'redo'],
      toolClass: {},
      toolHtml: {
        bold: () => '<b class="ic">B</b>' + lab('Bold'),
        italic: () => '<i class="ic">I</i>' + lab('Italic'),
        underline: () => '<u class="ic">U</u>' + lab('<u>U</u>nderline'),
        color: () => '<span class="A">A<i></i></span>' + lab('Text Color'),
        size: () => `<span class="ic cur">Aa</span>${lab('Size')}`,
        'align-left': (b) => b + lab('Left'),
        'align-center': (b) => b + lab('Center'),
        'align-right': (b) => b + lab('Right'),
        'align-justify': (b) => b + lab('Justify'),
        bullet: (b) => b + lab('Bullets'),
        number: (b) => b + lab('Numbers'),
        undo: (b) => b + lab('Undo'),
        redo: (b) => b + lab('Redo'),
      },
      sizeCur: 'label',
      savedText: ['Default Text', 'Edited Text'],
      parts: {
        toolItem: (base, S) => (E, key) => {
          if (key === '@deco') {
            // The window's file / edit buttons; the font draw of the base widget stays.
            if (E.wide) E.rng.pick(['Sans Serif', 'Serif', 'Georgia', 'Inter']);
            for (const [t, ic] of DECO) {
              E.tool('', S.svg(ic, 16) + lab(t === 'Print' ? `<u>${t[0]}</u>${t.slice(1)}` : t), t, 'deco');
              if (t === 'Save') E.sep();
            }
            E.sep();
            for (const [t, ic] of DECO2) E.tool('', S.svg(ic, 16) + lab(t), t, 'deco');
            E.sep();
          } else if (key === '@extra') {
            // The remaining tools go into a compact strip of the menu bar.
            E.toolParent = E.util.el('div', 'os-extra', document.querySelector('.os-menu'));
          } else base(E, key);
        },
        edArea: () => (E) => {
          E.x = {};
          E.pageFrame = E.util.el('div', 'os-pageframe', E.ed);
          return E.util.el('div', 'at-pagearea', E.pageFrame);
        },
        edAreaBuilt: () => (E) => {
          const { util, area, pageFrame } = E;
          const scrollbar = util.el('div', 'os-scrollbar', pageFrame);
          const scrollUp = util.el('button', 'os-scroll-up', scrollbar);
          scrollUp.type = 'button'; scrollUp.title = 'Scroll up';
          const scrollTrack = util.el('div', 'os-scroll-track', scrollbar);
          const scrollThumb = util.el('div', 'os-scroll-thumb', scrollTrack);
          const scrollDown = util.el('button', 'os-scroll-down', scrollbar);
          scrollDown.type = 'button'; scrollDown.title = 'Scroll down';
          function paintScroll() {
            const h = scrollTrack.clientHeight;
            const th = Math.max(24, Math.min(h, h * area.clientHeight / Math.max(1, area.scrollHeight)));
            scrollThumb.style.height = `${th}px`;
            scrollThumb.style.top = `${(h - th) * area.scrollTop / Math.max(1, area.scrollHeight - area.clientHeight)}px`;
          }
          area.addEventListener('scroll', paintScroll);
          scrollUp.addEventListener('click', () => { area.scrollTop -= 40; paintScroll(); });
          scrollDown.addEventListener('click', () => { area.scrollTop += 40; paintScroll(); });
          scrollbar.addEventListener('wheel', e => { area.scrollTop += e.deltaY; paintScroll(); e.preventDefault(); }, { passive: false });
          scrollTrack.addEventListener('pointerdown', e => {
            e.preventDefault();
            const r = scrollTrack.getBoundingClientRect();
            const th = scrollThumb.getBoundingClientRect();
            const offset = e.target === scrollThumb ? e.clientY - th.top : th.height / 2;
            const move = ev => {
              area.scrollTop = Math.max(0, Math.min(1, (ev.clientY - r.top - offset) / Math.max(1, r.height - th.height))) * (area.scrollHeight - area.clientHeight);
              paintScroll();
            };
            const end = () => { scrollTrack.removeEventListener('pointermove', move); scrollTrack.removeEventListener('pointerup', end); scrollTrack.removeEventListener('pointercancel', end); };
            scrollTrack.setPointerCapture(e.pointerId);
            scrollTrack.addEventListener('pointermove', move);
            scrollTrack.addEventListener('pointerup', end);
            scrollTrack.addEventListener('pointercancel', end);
            if (e.target !== scrollThumb) move(e);
          });

          E.x.paintScroll = paintScroll;
        },
        edStatus: () => (E) => {
          E.status = E.util.el('div', 'at-status', E.ed);
          E.util.el('span', '', E.status, 'Ln 1, Col 1');
          E.util.el('span', '', E.status, 'INS');
          E.saved = E.util.el('span', '', E.status, 'Default Text');
        },
        edPainted: () => (E) => E.x.paintScroll(),
      },
    },
  });
})();
