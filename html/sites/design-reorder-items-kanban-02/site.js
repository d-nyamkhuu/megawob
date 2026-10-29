(function () {
  'use strict';
  let iconIndex = 0;
  // Sculpted, static workstation icons. No sampling is used for decorative artwork.
  env.irixIcon = function (kind) {
    const id = 'irix-metal-' + iconIndex++,
      g = 'url(#' + id + ')',
      p = 'url(#' + id + 'p)';
    const shapes = {
      folder: `<path d="M7 14Q7 11 10 11h15l7 8h24v38H7Z" fill="${p}"/><path d="M8 14h16l7 8h23M9 16v38" stroke="#d2d9f2" stroke-width="1.4" fill="none"/><path d="M55 22v34H9" stroke="#4b5078" fill="none"/>`,
      desktop: `<path d="M8 11h18l6-3h18v41H8Z" fill="${g}"/><path d="M13 17l34-7 7 4-34 8v33l-7-3Z" fill="#b9c0db"/><path d="M19 21l35-7v40L19 62Z" fill="${p}"/><path d="M19 23l32-7M21 25v33" stroke="#c6cff4" fill="none"/><path d="M18 21l-4-3v36l5 8" fill="#575b82"/>`,
      files: `<path d="M13 8l38 15v36L13 45Z" fill="#777eaa"/><path d="M11 12l35 14v36L11 48Z" fill="${p}"/><path d="M46 26l5-3v36l-5 3Z" fill="#434963"/><path d="M16 13V6l4-3 11 5v10l-4-2V9l-7-3v9Z" fill="${g}"/><path d="M13 16l31 12M13 17v29" stroke="#c0c9ed" fill="none"/><path d="M48 27v29" stroke="#a2aac8"/>`,
      cube: `<path d="M3 28L31 2l29 30v15L33 64 15 44Z" fill="#5d468b" stroke="#463456"/><path d="M3 28L31 2l29 30-27 7Z" fill="#9b83c9" stroke="#786397"/><path d="M3 28l30 11 0 25-18-20Z" fill="${p}" stroke="#6c548f"/><path d="M33 39l27-7v15L33 64Z" fill="#473963" stroke="#352c4f"/><path d="M3 28L31 2 21 24Z" fill="#cfb6f0" stroke="#b49cdb"/><path d="M21 24l39 8-27 7Z" fill="#67518d" stroke="#776198"/><path d="M22 24l11 15-12-1Z" fill="#8c6db6" stroke="none"/><path d="M6 31l25 11v18" stroke="#c0a3e5" stroke-width="1.3" fill="none"/><path d="M25 27l3 1m7 1l3 1m8 0l3 1" stroke="#a08ac4" stroke-width=".7"/>`,
      cabinet: `<path d="M12 16L25 4h35v45L47 62H12Z" fill="${g}"/><path d="M12 16h35v46H12Z" fill="${p}"/><path d="M47 16L60 4v45L47 62Z" fill="#414866"/><path d="M14 18h31v12H14ZM14 33h31v12H14ZM14 48h31v12H14Z" fill="#959dcc" stroke="#484c71"/><path d="M14 18h30M14 33h30M14 48h30" stroke="#c8d2f5"/><path d="M25 23h9v3h-9ZM25 38h9v3h-9ZM25 53h9v3h-9Z" fill="#d4d6ec"/>`,
      wrench: `<path d="M42 7c-10-2-21 7-17 19L7 48c-6 8 2 15 9 10l24-20c13 3 24-7 20-19L46 31l-9-8Z" fill="${g}"/><path d="M11 51l20-23M30 19l13-10" fill="none" stroke="#e4e3eb" stroke-width="2"/>`,
      tuning: `<path d="M11 55l13-17 10 8-16 14Z" fill="#606777"/><path d="M8 58l5-8 6 5-6 8Z" fill="${g}"/><path d="M27 42l-8-7q-5-7 1-13L48 2q4-2 6 2l1 4L33 25q-3 3 1 6l20-13q5-3 8 2l1 5q0 4-5 8L39 46q-6 4-12-4Z" fill="${g}"/><path d="M23 25L49 6M24 27q-3 4 3 8l9 5 21-15" stroke="#e7e8f0" stroke-width="2" fill="none"/><path d="M29 35l8 4 20-14" stroke="#51596a" stroke-width="3" fill="none"/><path d="M14 53l8-10" stroke="#c7ccda" fill="none"/>`,
      help: `<path d="M19 18C19 0 49 0 49 19c0 12-15 13-15 26H24c0-18 15-16 15-25 0-8-10-8-10-1Z" fill="${p}"/><circle cx="29" cy="57" r="6" fill="${p}"/>`,
      monitor: `<path d="M10 9h43v35H10Z" fill="${g}"/><path d="M15 14h33v25H15Z" fill="#4b5364"/><path d="M26 45h12v8H26ZM6 55h51v5H6Z" fill="${g}"/>`,
      speaker: `<path d="M7 25h11l15-13v41L18 40H7Z" fill="${p}"/><path d="M39 21q15 12 0 24M44 15q23 18 0 36" stroke="#cbc4df" stroke-width="3" fill="none"/>`,
      keys: `<path d="M7 8h49v51H7Z" fill="#65677f"/>${[0, 1, 2, 3].map((r) => [0, 1, 2].map((c) => `<path d="M${11 + c * 14} ${12 + r * 11}h9v7h-9Z" fill="${p}"/>`).join('')).join('')}`,
      hammer: `<path d="M14 58L7 52l29-31 8 7Z" fill="${g}"/><path d="M30 13l8-8 11 3 10 11-7 7-10-9-6 8-8-7Z" fill="${g}"/>`,
      apple: `<path d="M32 18c-7-10-25-6-25 9 0 16 10 32 19 27 6-4 8 3 14 0 12-6 19-32 8-37-6-4-12-3-16 1Z" fill="${p}"/><path d="M31 17l4-13M35 13q13-14 20-6-7 9-20 6" fill="${g}"/><path d="M14 26q-3 9 2 17" stroke="#ddd7eb" stroke-width="2" fill="none"/>`,
      dog: `<path d="M10 27Q5 27 5 18q-5 10 5 16l1 5v17h5l3-15h19l4 15h5V35l10-9-7-6-3-12-6 13-7 6Z" fill="${p}"/><path d="M12 29q11 4 24-1l7-6M14 39l-1 14M41 38l3 14" stroke="#bcb5d8" fill="none"/><path d="M22 40l-3 16h4l7-16M42 40l5 15h4l-5-21" fill="#474157"/><circle cx="49" cy="23" r="1" fill="#ddd8ef"/>`,
      cat: `<path d="M32 17l2-11 7 6 8-4 1 13q-1 7-8 10l2 22 8 5H33l-4-4Q15 62 9 52q-3-9 6-13-8 10 0 13 6 2 11-4l1-16q-2-8 5-15Z" fill="${p}"/><path d="M34 18q6 6 13 0M31 35l5 18M13 53q7 6 17-3" stroke="#bbb1d4" fill="none"/><path d="M40 32l-2 22h8" fill="none" stroke="#3a344b" stroke-width="2"/>`,
      banana: `<path d="M47 8l7-2 2 4-7 5q-2 27-23 38-14 8-23-1l-1-7q31 0 45-37Z" fill="${p}"/><path d="M5 45q23 6 42-26M5 50q25 7 44-28" stroke="#c4b9e0" fill="none"/><path d="M9 56q27 3 41-31M47 8l5 4" stroke="#514562" fill="none"/>`,
      orange: `<circle cx="32" cy="34" r="23" fill="${p}"/><path d="M29 13l3-8 3 1-2 9M25 15q7-4 13 0" fill="none" stroke="#332d45" stroke-width="2"/><path d="M17 29q0-9 9-12" fill="none" stroke="#d8cfea" stroke-width="2"/><path d="M22 20l1 1m17 23 1 1m-23-5 1 1m22-17 1 1" stroke="#a298bf"/>`,
      screwdriver: `<path d="M7 57l-2-3 19-22 7 6-18 21q-3 3-6-2Z" fill="${g}"/><path d="M25 32l24-24 2 3-23 24Z" fill="${g}"/><path d="M47 10l7-7 3 3-7 7Z" fill="#c0c4ce"/><path d="M10 53l14-15" stroke="#e1e2e8" stroke-width="2"/>`,
      shirt: `<path d="M21 10l11 7 12-7 16 17-11 10-5-6v28H20V31l-6 6L4 27Z" fill="${p}"/><path d="M21 10q10 20 23 0M23 30v25" fill="none" stroke="#d6ccea"/>`,
      bottle: `<path d="M25 5h15v8H25ZM21 15h23v7l7 7v31H14V29l7-7Z" fill="${p}"/><path d="M19 34h27v17H19Z" fill="${g}"/>`,
      jar: `<path d="M13 17h39v34q0 10-20 10T13 51Z" fill="${p}"/><ellipse cx="32.5" cy="17" rx="19.5" ry="7" fill="${g}"/><path d="M15 17v6q18 8 35 0v-6" fill="${p}"/><path d="M16 20q15 7 32 0M17 30v17" stroke="#d7ceee" fill="none"/><path d="M21 35h24v14H21Z" fill="#b0a6d3"/><path d="M28 40h12M26 44h11" stroke="#70678f"/>`,
      bulb: `<path d="M24 45C24 37 10 34 10 21a22 20 0 0 1 44 0c0 13-14 16-14 24Z" fill="${p}"/><path d="M24 43h16v12l-5 6h-6l-5-6Z" fill="${g}"/><path d="M25 46h14M25 50h14M26 54h12M31 43l-5-21 6 4 6-4-5 21" fill="none" stroke="#515365"/><path d="M18 23q-2-12 11-14" stroke="#d7d4f0" stroke-width="3" fill="none"/>`,
      shade: `<path d="M10 15l44-6 7 38-45 9L3 45Z" fill="${p}"/><path d="M10 15l6 41 6-43 7 40 6-42 7 39 6-41 6 38" stroke="#525071" stroke-width="2" fill="none"/><path d="M11 16l5 35M24 15l5 33M37 12l5 33M50 11l5 30" stroke="#d1cbe7" fill="none"/>`,
      shoe: `<path d="M8 32l9-18 13 3 5 14 15 7q11 2 11 11 0 9-25 9H8q-7-9 0-26Z" fill="${p}"/><path d="M7 48q27 9 53-1v7q-24 9-52 2Z" fill="${g}"/><path d="M18 20l10 4M19 27l12 3M21 34l13 3M8 42q3-12 8-18" stroke="#d5cce9" stroke-width="2" fill="none"/><path d="M35 34l-6 12" stroke="#5c536f"/>`,
      sleeping: `<path d="M22 7q16-11 25 5l9 32q4 14-13 19-15 5-19-9L12 23Q9 12 22 7Z" fill="${p}"/><ellipse cx="29" cy="16" rx="14" ry="10" transform="rotate(-20 29 16)" fill="${g}"/><path d="M18 28l27-9M22 37l27-9M25 46l27-8M29 55l25-8" stroke="#706582" fill="none"/><path d="M19 27l10 27q4 9 13 6" stroke="#c4b9df" fill="none"/>`,
      bag: `<path d="M22 17v-5q0-11 10-11t10 11v5h-5v-5q0-6-5-6t-5 6v5Z" fill="${g}"/><path d="M14 13q18-8 36 0l7 37q3 12-25 12T7 50Z" fill="${p}"/><path d="M14 25q16 7 36 0M14 43q16 6 37 0M18 15l-5 34" stroke="#d7cceb" fill="none"/><path d="M18 35h27v21H18Z" fill="#79708d"/><path d="M19 38h25M22 32v7" stroke="#d1cadf"/>`,
      mat: `<path d="M10 15l35-9 11 42-34 11Z" fill="${p}"/><path d="M14 19l32-9M17 29l31-9M20 39l31-9" stroke="#b4a6ce" fill="none"/><ellipse cx="17" cy="50" rx="11" ry="10" fill="${p}"/><path d="M21 44q-13-2-10 8 5 8 10 0-1-7-7-3" stroke="#d1c4e7" fill="none"/>`,
      tent: `<path d="M5 54L30 9l29 45Z" fill="${p}"/><path d="M30 9v45H5Z" fill="#b2aecf"/><path d="M30 31l12 23H18Z" fill="#393852"/>`,
      book: `<path d="M13 6h35l9 8v45H13Z" fill="${p}"/><path d="M13 6h7v53h-7Z" fill="${g}"/><path d="M25 18h24M25 24h24M25 30h16" stroke="#d2cce7"/>`,
      emblem: `<path d="M32 3L47 18l-6 13 12 9-21 21-21-21 12-9-6-13Z" fill="${p}"/><path d="M32 3v58M17 18l30 0M11 40h42" fill="none" stroke="#c5b9df"/>`,
    };
    const blue = ['folder', 'desktop', 'files', 'cabinet'].includes(kind);
    return `<svg viewBox="0 0 64 64" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="${id}" x2=".8" y2="1"><stop stop-color="#e1e2ea"/><stop offset=".45" stop-color="#9a9dae"/><stop offset="1" stop-color="#4c5065"/></linearGradient><linearGradient id="${id}p" x2=".8" y2="1"><stop stop-color="${kind === 'folder' ? '#a0abd7' : blue ? '#b1bae4' : '#c2b8e7'}"/><stop offset=".48" stop-color="${kind === 'folder' ? '#828cc8' : blue ? '#7d89c2' : '#8880b6'}"/><stop offset="1" stop-color="${kind === 'folder' ? '#7680b9' : blue ? '#4b547f' : '#45405f'}"/></linearGradient></defs><g stroke="#26263b" stroke-width="1.3" stroke-linejoin="round">${shapes[kind] || shapes.folder}</g></svg>`;
  };
  env.irixCategoryIcon = function (text) {
    const t = String(text).toLowerCase();
    return /fruit|apple|banana|orange|grape|cherry|pear|peach|plum|food|grocery/.test(t)
      ? 'apple'
      : /animal|pet|dog|cat|koala|gecko|lion|tiger|rabbit|horse|bear|zebra|fox|wolf/.test(t)
        ? 'dog'
        : /beauty|shampoo|skin|mask|cream/.test(t)
          ? 'bottle'
          : /cloth|shoe|shirt|fashion|sneaker/.test(t)
            ? 'shirt'
            : /sport|outdoor|camp|bag|yoga|climb/.test(t)
              ? 'tent'
              : /book|office|stationery/.test(t)
                ? 'book'
                : /hammer/.test(t)
                  ? 'hammer'
                  : 'wrench';
  };
  env.irixItemIcon = function (text) {
    const t = String(text).toLowerCase();
    return /banana/.test(t)
      ? 'banana'
      : /orange/.test(t)
        ? 'orange'
        : /\bcat\b/.test(t)
          ? 'cat'
          : /screwdriver/.test(t)
            ? 'screwdriver'
            : /shoe|sneaker/.test(t)
              ? 'shoe'
              : /sleeping/.test(t)
                ? 'sleeping'
                : /bag|backpack/.test(t)
                  ? 'bag'
                  : /yoga|foam roller/.test(t)
                    ? 'mat'
                    : /bulb|lamp/.test(t)
                      ? 'bulb'
                      : /sunshade/.test(t)
                        ? 'shade'
                        : /face mask|cream|balm/.test(t)
                          ? 'jar'
                          : env.irixCategoryIcon(t);
  };
  env.site({
    name: 'design-reorder-items-kanban-02',
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util,
        body = document.body;
      body.className = 'design irix' + (ctx.display === 'toast' ? ' has-instruction-toast' : '');
      const desk = u.el('div', 'desk', body);
      u.el('div', 'irix-logo', desk, 'IRIX');
      const shelf = u.el('div', 'shelf', desk);
      for (const [n, c] of [
        ['Toolchest', 'cube'],
        ['Desktop', 'desktop'],
        ['Files', 'files'],
        ['Applications', 'cabinet'],
        ['Utilities', 'tuning'],
        ['Help', 'help'],
      ]) {
        const b = u.el('button', 'shelf-btn', shelf);
        b.type = 'button';
        const ic = u.el('span', 'shelf-ic', b);
        ic.innerHTML = env.irixIcon(c);
        u.el('span', '', b, n);
        b.onclick = () => env.log('shelf', { n });
      }
      const sg = u.el('div', 'sgi', desk);
      sg.innerHTML =
        '<svg viewBox="0 0 70 70" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="2.8" stroke-linejoin="round"><path d="M35 3l23 13-23 14-23-14ZM35 3v16l-11-6M35 30v-11l12-7M5 24l23 14v27L5 51ZM5 24l12 22v12M28 38l-11 8M65 24L42 38v27l23-14ZM65 24L53 46v12M42 38l11 8M35 34v33"/></g></svg><span>SILICON<br>GRAPHICS</span>';
      const win = u.el('div', 'win main-win', desk);
      const tb = u.el('div', 'titlebar', win);
      u.el('span', 'sysbtn', tb).innerHTML = env.irixIcon('emblem');
      u.el('span', 'ttl', tb, 'Card Sort');
      const wc = u.el('span', 'wctl', tb);
      for (const l of ['_', '×']) {
        const b = u.el('button', '', wc, l);
        b.type = 'button';
        b.onclick = () => env.log('window-control', { label: l });
      }
      const mb = u.el('nav', 'menubar', win);
      for (const m of ['File', 'Edit', 'Tasks', 'Help']) {
        const label = u.el('span', '', mb);
        label.innerHTML = '<u>' + m[0] + '</u>' + m.slice(1);
      }
      const inner = u.el('div', 'win-body', win);
      const note = u.el('section', 'task-note', inner);
      const instruction = u.el('div', 'instruction', note, ctx.instruction);
      if (ctx.display === 'hidden') note.hidden = true;
      else if (ctx.display === 'toast') {
        note.classList.add('instruction-toast');
        desk.append(note);
        const x = u.el('button', 'note-close', note, '×');
        x.type = 'button';
        x.setAttribute('aria-label', 'Close');
        x.onclick = () => {
          note.style.visibility = 'hidden';
          env.log('note-close');
        };
      } else if (ctx.display === 'panel' && desk.clientWidth >= 1150 && desk.clientHeight >= 700) {
        note.classList.add('instruction-panel');
        desk.append(note);
        const caption = u.el('div', 'note-caption', note, 'Task Instructions');
        note.insertBefore(caption, instruction);
      } else if (ctx.display === 'panel') note.classList.add('instruction-panel-fallback');
      const stage = u.el('main', 'stage', inner);
      stage.dataset.role = 'stage';
      const footer = u.el('footer', 'footer', inner);
      const clear = u.el('button', 'clear', footer, 'Clear All');
      clear.type = 'button';
      clear.onclick = () => env.widgetDef.clear?.();
      const endR = ctx.rng.fork('chrome/end'),
        collideR = ctx.rng.fork('chrome/collide');
      const labels = ctx.content.END_LABELS || [
        'Submit',
        'Done',
        'Finish',
        'Continue',
        'Save',
        'OK',
        'Confirm',
        'Apply',
        'Complete',
        "I'm done",
      ];
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x));
      const alternateLabel = labelOf(labels[endR.int(0, labels.length - 1)]);
      const placement = ctx.rng.fork('chrome/end/placement').pick(['footer', 'title', 'footer', 'link']);
      const originalEnd = placement === 'footer';
      const label = originalEnd ? 'Submit' : alternateLabel;
      let submit = null;
      const endButton = (parent, kind, text) => {
        const b = u.el(
          kind === 'link' ? 'a' : 'button',
          kind === 'title' ? 'submit title-submit' : kind === 'link' ? 'submit end-link' : 'submit',
          parent,
          text,
        );
        b.type = 'button';
        if (kind === 'link') b.href = '#';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.onclick = (e) => {
          e.preventDefault();
          ctx.submit();
        };
        return b;
      };
      if (!ctx.finish) {
        if (placement === 'footer') submit = endButton(footer, 'footer', label);
        else if (placement === 'title') {
          const tools = u.el('div', 'title-tools', tb);
          tb.insertBefore(tools, wc);
          submit = endButton(tools, 'title', label);
        } else submit = endButton(footer, 'link', label);
      }
      const collide = !ctx.finish && collideR.bool(0.3);
      if (collide) {
        const pool = labels.map(labelOf).filter((x) => x.toLowerCase() !== label.toLowerCase());
        if (pool.length) {
          const d = u.el('button', 'irix-xtra', footer, pool[collideR.int(0, pool.length - 1)]);
          footer.insertBefore(d, clear);
          d.type = 'button';
          d.dataset.role = 'xtra';
          d.onclick = () => env.log('decoy', { label: d.textContent, collide: true });
        }
      }
      if (!ctx.finish && endR.bool(0.35)) {
        const fillers = ctx.content.DECOY_LABELS || ['Help', 'Save draft', 'Cancel'];
        const d = u.el('button', 'irix-xtra', mb, fillers[endR.int(0, fillers.length - 1)]);
        d.type = 'button';
        d.dataset.role = 'xtra';
        d.onclick = () => env.log('decoy', { label: d.textContent });
      }
      const fb = u.el('div', 'win fb-win', desk);
      const tb2 = u.el('div', 'titlebar', fb);
      u.el('span', 'sysbtn', tb2).innerHTML = env.irixIcon('emblem');
      u.el('span', 'ttl', tb2, 'File Browser');
      const wc2 = u.el('span', 'wctl', tb2);
      for (const l of ['_', '×']) {
        const b = u.el('button', '', wc2, l);
        b.type = 'button';
        b.onclick = () => env.log('window-control', { label: l });
      }
      const mb2 = u.el('nav', 'menubar', fb);
      for (const m of ['File', 'View', 'Go', 'Help']) {
        const label = u.el('span', '', mb2);
        label.innerHTML = '<u>' + m[0] + '</u>' + m.slice(1);
      }
      const path = u.el('div', 'fb-path', fb, '/home/users/student');
      u.el('span', 'path-icon', path).innerHTML = env.irixIcon('folder');
      const fbb = u.el('div', 'fb-body', fb);
      const tree = u.el('div', 'fb-tree', fbb);
      for (const [n, d] of [
        ['irix', 0],
        ['bin', 1],
        ['etc', 1],
        ['home', 1],
        ['users', 2],
        ['student', 3],
        ['shared', 2],
        ['lib', 1],
        ['usr', 1],
        ['var', 1],
      ]) {
        const r = u.el('div', 'fb-row' + (n === 'student' ? ' sel' : ''), tree);
        r.style.setProperty('--depth', d);
        r.dataset.node = n;
        const arrow = u.el('b', 'tree-arrow', r);
        if (['irix', 'home', 'users', 'shared', 'lib', 'usr', 'var'].includes(n)) {
          const down = ['irix', 'home', 'users'].includes(n);
          arrow.innerHTML =
            '<svg viewBox="0 0 14 14" aria-hidden="true"><path d="' +
            (down ? 'M1 3h12L7 12Z' : 'M3 1l10 6-10 6Z') +
            '" fill="#9a9ec4" stroke="#34394e" stroke-width="1.1"/><path d="' +
            (down ? 'M2 4h10' : 'M4 2v10') +
            '" fill="none" stroke="#e3e7f4"/></svg>';
        }
        u.el('i', '', r).innerHTML = env.irixIcon('folder');
        u.el('span', '', r, n);
      }
      const files = u.el('div', 'fb-files', fbb);
      for (const n of ['projects', 'images', 'docs', 'misc']) {
        const r = u.el('div', 'fb-file', files);
        u.el('i', '', r).innerHTML = env.irixIcon('folder');
        u.el('span', '', r, n);
      }
      const clock = u.el('div', 'clock', desk);
      u.el('div', 'clock-date', clock, 'Tue Apr 22 1997   10:24 AM');
      const tray = u.el('div', 'clock-tray', clock);
      for (const k of ['monitor', 'speaker', 'keys']) u.el('span', '', tray).innerHTML = env.irixIcon(k);
      // Longer sampled instructions must remain inside their unobscured native note.
      if (ctx.display !== 'hidden') {
        const ns = getComputedStyle(note),
          floating = note.classList.contains('instruction-toast') || note.classList.contains('instruction-panel');
        const room =
          (floating ? desk.clientHeight * 0.875 - note.getBoundingClientRect().top : note.clientHeight) -
          parseFloat(ns.paddingTop) -
          parseFloat(ns.paddingBottom) -
          (note.querySelector('.note-caption')?.offsetHeight || 0);
        let textSize = parseFloat(getComputedStyle(instruction).fontSize);
        while (instruction.scrollHeight > room && textSize > 11) {
          textSize -= 0.5;
          instruction.style.fontSize = textSize + 'px';
        }
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        kind = ctx.kind;
      const el = u.el('section', 'obstruction obstruction-' + kind, document.body);
      el.dataset.role = 'overlay';
      const box = u.el('div', 'obstruction-box', el);
      const title = {
        cookie: 'Your privacy',
        toast: 'Changes saved',
        chat: 'Support',
        promo: 'Workspace update',
        banner: 'Service notice',
      }[kind];
      const text = {
        cookie: 'This application stores optional cookies.',
        toast: 'Your changes have been saved.',
        chat: 'Need a hand with this workspace?',
        promo: 'Explore the latest workspace features.',
        banner: 'You are viewing a shared workspace.',
      }[kind];
      u.el('h3', '', box, title);
      u.el('p', '', box, text);
      const dismiss = u.el('button', 'dismiss', box, kind === 'cookie' ? 'Reject optional' : 'Close');
      dismiss.type = 'button';
      dismiss.onclick = () => ctx.dismiss('close');
      if (kind === 'cookie') {
        const a = u.el('button', 'dismiss', box, 'Accept optional');
        a.onclick = () => ctx.dismiss('accept');
      }
      return { el, dismiss, ttlSteps: kind === 'toast' ? 5 : 0 };
    },
  });
})();
