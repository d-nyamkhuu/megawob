(function () {
  'use strict';
  const C = {
    'site': 'design-find-fact-find-word-05',
    'brand': 'Document Reader',
    'tabs': 'Home|Insert|Page Layout|References|Mailings|Review|View',
    'briefTitle': 'Task',
  };
  const ICON = (t) =>
    '<svg viewBox="0 0 40 40" aria-hidden="true"><defs><linearGradient id="blue" x2="1" y2=".5"><stop stop-color="#d6e9fc"/><stop offset=".5" stop-color="#548ac5"/><stop offset="1" stop-color="#24568e"/></linearGradient><linearGradient id="silver" x2="0" y2="1"><stop stop-color="#f7fcff"/><stop offset=".5" stop-color="#829ebc"/><stop offset="1" stop-color="#dee7f2"/></linearGradient></defs><g stroke="#5278a3" stroke-width="1.2" stroke-linejoin="round">' +
    t +
    '</g></svg>';
  const PAGE =
    '<path d="M10 3h17l7 7v27H10z" fill="#fff"/><path d="M27 3v8h7M14 16h16M14 20h16M14 24h16M14 28h16M14 32h12" fill="none"/><path d="M14 6h8v6h-8z" fill="#c2daf2"/>';
  const BIG = {
    Paste:
      '<rect x="4" y="7" width="25" height="30" rx="2" fill="#ffd76d" stroke="#d5a441"/><rect x="11" y="3" width="12" height="8" rx="2" fill="url(#silver)"/><path d="M15 3h4v3h-4" fill="#fff"/><g transform="translate(9 10) scale(.72)">' +
      PAGE +
      '</g>',
    Find: '<path d="M26 26l11 11" fill="none" stroke="#315e90" stroke-width="6"/><circle cx="16" cy="16" r="13" fill="url(#silver)"/><circle cx="16" cy="16" r="10" fill="#e4f4ff"/><path d="M9 18a8 8 0 0 1 10-10" fill="none" stroke="#fff" stroke-width="2"/>',
    Replace:
      '<path d="M7 5h25v6H13v5H7z" fill="url(#silver)"/><path d="M13 1L5 8l8 7z" fill="url(#silver)"/><path d="M8 24h20v-5h6v13H8z" fill="url(#blue)"/><path d="M28 18l8 8-8 7" fill="url(#blue)"/><rect x="4" y="15" width="13" height="6" fill="#a2c3e6"/><rect x="18" y="14" width="13" height="6" fill="#fff"/>',
    'Select All':
      '<path d="M6 13h11v23H3V21zM24 13h10l4 8v15H23z" fill="url(#blue)"/><rect x="7" y="5" width="7" height="13" rx="2" fill="url(#blue)"/><rect x="26" y="5" width="7" height="13" rx="2" fill="url(#blue)"/><path d="M16 17h8v9h-8z" fill="#537cb0"/><path d="M7 20v12M27 20v12" stroke="#d4e9ff" stroke-width="2"/>',
  };
  function paragraphIcon(i, row) {
    let s = '';
    const line = (x, y, w) => '<path d="M' + x + ' ' + y + 'h' + w + '" stroke="#1d304b" stroke-width="1.8"/>';
    if (!row && i < 3) {
      for (let n = 0; n < 3; n++) {
        const y = 6 + n * 8;
        s +=
          i === 0
            ? '<circle cx="5" cy="' + y + '" r="2" fill="#5a94cb"/>'
            : i === 1
              ? '<text x="2" y="' + (y + 2) + '" fill="#568ac1" font-size="7">' + (n + 1) + '</text>'
              : '<rect x="2" y="' + (y - 2) + '" width="4" height="4" fill="#5a94cb"/>';
        s += line(12, y, 16);
      }
    } else if (i < 3) {
      for (let n = 0; n < 4; n++) {
        const w = n % 2 ? 18 : 25;
        const x = i === 0 ? 3 : i === 1 ? (31 - w) / 2 : 29 - w;
        s += line(x, 5 + n * 6, w);
      }
    } else {
      for (let n = 0; n < 4; n++) s += line(n === 0 || n === 3 ? 3 : 13, 5 + n * 6, n === 0 || n === 3 ? 25 : 15);
      s += '<path d="M' + (i === 3 ? '3 11l6 4-6 4' : '9 11l-6 4 6 4') + '" fill="#6299ce"/>';
    }
    return '<svg viewBox="0 0 32 30" aria-hidden="true">' + s + '</svg>';
  }
  // The Office ribbon is decorative chrome specific to this design.
  function ribbon(u, content) {
      const rib = u.el('div', 'ds-ribbon', content);
      const tabs = u.el('div', 'ds-rtabs', rib);
      C.tabs.split('|').forEach((t, i) => u.el('span', i === 0 ? 'on' : '', tabs, t));
      const strip = u.el('div', 'ds-strip', rib);
      function group(name, fill) {
        const g = u.el('div', 'ds-group', strip);
        const b = u.el('div', 'ds-gb', g);
        fill(b);
        u.el('div', 'ds-gn', g, name);
      }
      function big(b, n) {
        const x = u.el('div', 'ds-big' + (n === 'Paste' ? ' ds-paste' : ''), b);
        x.innerHTML = ICON(BIG[n]) + '<span>' + n + '</span>';
      }
      function small(b, t, dis) {
        const sm = u.el('div', 'ds-sm' + (dis ? ' dis' : ''), b);
        const cut = t.endsWith('Cut');
        sm.innerHTML =
          ICON(
            cut
              ? '<g fill="none" stroke="#9ba8b5" stroke-width="2.5"><circle cx="11" cy="29" r="5"/><circle cx="26" cy="29" r="5"/><path d="M14 25L28 4M23 25L10 4M18 17l3 3"/></g>'
              : '<g transform="translate(-3 -1) scale(.85)" opacity=".55">' +
                  PAGE +
                  '</g><g transform="translate(5 6) scale(.8)" opacity=".65">' +
                  PAGE +
                  '</g>',
          ) +
          '<span>' +
          (cut ? 'Cut' : 'Copy') +
          '</span>';
      }
      group('Clipboard', (b) => {
        big(b, 'Paste');
        const c = u.el('div', 'ds-col', b);
        small(c, '✂ Cut', 1);
        small(c, '⎘ Copy', 1);
      });
      group('Font', (b) => {
        const c = u.el('div', 'ds-col', b);
        const r = u.el('div', 'ds-row', c);
        u.el('span', 'ds-combo w1', r, 'Segoe UI ▾');
        u.el('span', 'ds-combo w2', r, '11 ▾');
        const r2 = u.el('div', 'ds-row fmt', c);
        u.el('b', '', r2, 'B');
        u.el('i', '', r2, 'I');
        u.el('u', '', r2, 'U');
        u.el('span', 'ds-fa', r2, 'A');
        u.el('span', 'ds-fh', r2).innerHTML = ICON(
          '<path d="M7 27l15-21 10 7-15 21z" fill="#303a45"/><path d="M13 23l9-13 5 3-9 13z" fill="#e4e9ef"/><path d="M7 27l-3 10 13-3" fill="#6c7884"/><path d="M4 34l7 4" stroke="#263a4b" stroke-width="3"/>',
        );
      });
      group('Paragraph', (b) => {
        const c = u.el('div', 'ds-col', b);
        for (let row = 0; row < 2; row++) {
          const r = u.el('div', 'ds-row ic', c);
          for (let i = 0; i < 5; i++)
            u.el('span', row === 1 && i === 0 ? 'on' : '', r).innerHTML = paragraphIcon(i, row);
        }
      });
      group('Editing', (b) => {
        ['Find', 'Replace', 'Select All'].forEach((n) => big(b, n));
      });
  }

  function briefNotes(u, brief) {
    u.el('hr', '', brief);
    u.el('p', 'ds-note', brief,
      'Read the document in the workspace on the right. The status bar shows its word and character counts.');
    u.el('p', 'ds-note', brief, 'The ribbon groups document tools by category.');
  }

  // Keep template-created controls and their behavior; apply this frame's existing CSS classes.
  function dressTools(parent) {
    for (const button of parent.querySelectorAll('[data-role="xtra"]')) button.className = 'ds-xtra';
    for (const button of parent.querySelectorAll('[data-role="submit"]')) {
      button.className = button.tagName === 'A' ? 'ds-submit-link'
        : parent.classList.contains('ds-doctabs') ? 'ds-submit ds-submit-header' : 'ds-submit';
    }
  }

  const office = { bg: '#dbe8f7', panel: '#fff', fg: '#0c1421',
    accent: '#1d4f91', muted: '#6b7a90', line: '#a9bfdc' };

  env.site({
    name: C.site,
    langs: ['en'],
    template: 'site/base',
    design: {
      THEMES: { office }, LOW_THEME: office, ACCENTS: ['#1d4f91'], LOW_ACCENTS: ['#1d4f91'],
      parts: {
        'frame.layout': (base) => (_c) => {
          base(_c);
          // This design has a task pane even at the smallest viewport.
          _c.display = _c.ctx.display || 'header';
          document.body.classList.remove('ref-has-note');
        },
        'frame.header': () => (_c) => {
          const { util: u } = _c;
          const win = u.el('div', 'ds-win', document.body);
          const top = u.el('header', 'ds-top', win);
          u.el('span', 'ds-ico', top).innerHTML = ICON(PAGE);
          u.el('span', 'ds-brand', top, C.brand);
          const wc = u.el('span', 'ds-wc', top);
          u.el('i', '', wc, '–');
          u.el('i', '', wc, '□');
          u.el('i', 'x', wc, '×');
          const shell = u.el('div', 'ds-body', win);
          const content = u.el('div', 'ds-content', shell);
          ribbon(u, content);
          const header = u.el('div', 'ds-doctabs', content);
          const dt = u.el('span', 'ds-doctab', header);
          u.el('span', 'ds-fileicon', dt).innerHTML = ICON(PAGE);
          u.el('span', '', dt, 'Notes.txt');
          u.el('i', '', dt, '×');
          Object.assign(_c, { shell, content, header });
        },
        'frame.nav': () => () => {},
        'frame.instruction': (base) => (_c) => {
          if (_c.display !== 'header') return;
          const { util: u, shell, content } = _c;
          const brief = u.el('aside', 'ds-brief', shell);
          content.before(brief);
          u.el('h2', '', brief, C.briefTitle);
          base({ ..._c, header: brief });
          brief.querySelector('.ref-instruction').className = 'ds-instruction';
          briefNotes(u, brief);
        },
        'frame.tools': (base) => (_c) => {
          base(_c);
          _c.headerTools.className = 'ds-tools';
          dressTools(_c.header);
        },
        'frame.body': () => (_c) => { _c.body = _c.content; },
        'frame.panel': (base) => (_c) => {
          const { shell, content, util: u } = _c;
          base({ ..._c, body: shell });
          const brief = shell.querySelector('.ref-panel');
          shell.classList.remove('ref-panel-right');
          if (!brief) return;
          brief.className = 'ds-brief ds-panelbrief';
          const title = u.el('h2', '', null, C.briefTitle);
          brief.querySelector('.ref-panel-title').replaceWith(title);
          brief.querySelector('.ref-panel-text').className = 'ds-instruction';
          content.before(brief);
          briefNotes(u, brief);
        },
        'frame.stage': () => (_c) => {
          _c.stage = _c.util.el('main', 'ds-stage', _c.content);
        },
        'frame.toast': (base) => (_c) => {
          base(_c);
          const brief = document.querySelector('.ref-note');
          if (!brief) return;
          brief.className = 'ds-brief ds-toastbrief ds-toast';
          brief.querySelector('.ref-note-text').className = 'ds-instruction';
          _c.content.before(brief);
        },
        'frame.footer': (base) => (_c) => {
          const { util: u, content, header } = _c;
          const foot = u.el('footer', 'ds-footer', content);
          const status = u.el('div', 'ds-status', content);
          u.el('span', '', status, 'Words: 59');
          u.el('span', '', status, 'Characters: 326');
          base(_c);
          const templateFoot = document.querySelector('.ref-foot');
          if (templateFoot) {
            for (const control of templateFoot.querySelectorAll('[data-role]')) {
              if (control.dataset.role === 'submit') (control.tagName === 'A' ? status : foot).append(control);
              else header.querySelector('.ds-tools').append(control);
            }
            templateFoot.remove();
          }
          const zoom = u.el('span', 'ds-zoom', status);
          u.el('span', 'ds-pageview', zoom).innerHTML = ICON(PAGE);
          u.el('span', '', zoom, '100%');
          u.el('span', 'ds-zoomminus', zoom, '−');
          u.el('span', 'ds-zoomtrack', zoom);
          u.el('span', 'ds-zoomplus', zoom, '+');
          u.el('span', 'ds-fit', zoom, '↔');
          Object.assign(_c, { foot, status });
          dressTools(header);
          dressTools(foot);
          dressTools(status);
        },
        'frame.floating': (base) => (_c) => {
          base(_c);
          const dock = document.querySelector('.ref-float-dock');
          if (dock) {
            _c.foot.append(_c.submit);
            dock.remove();
            dressTools(_c.foot);
          }
          _c.content.classList.toggle('ds-formwide', !_c.submit || !_c.foot.contains(_c.submit));
        },
      },
    },
  });
})();
