(function () {
  'use strict';
  const END = ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
  env.site({
    name: 'design-draw-shape-erase-02',
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util,
        body = document.body,
        small = window.innerWidth < 1120 || window.innerHeight < 690;
      body.className = 'directory-98' + (ctx.display === 'toast' ? ' has-toast' : '');
      const vars = { bg: '#bfc3c6', panel: '#fff', fg: '#111', muted: '#52606b', line: '#8d9aa3', accent: '#0645ad' };
      for (const [k, v] of Object.entries(vars)) document.documentElement.style.setProperty('--' + k, v);
      document.documentElement.style.setProperty('--font', 'Arial, Helvetica, sans-serif');
      const shell = u.el('div', 'portal-window', body),
        head = u.el('header', 'portal-head', shell);
      const mark = u.el('div', 'site-mark', head);
      mark.innerHTML =
        '<svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="17" fill="#f5ca28" stroke="#e8a500" stroke-width="2"/><g fill="#0750b4"><circle cx="12" cy="11" r="3"/><circle cx="21" cy="8" r="3"/><circle cx="29" cy="12" r="3"/><circle cx="11" cy="21" r="3"/><circle cx="21" cy="19" r="3"/><circle cx="29" cy="23" r="3"/><circle cx="15" cy="29" r="3"/></g></svg>';
      u.el('strong', 'portal-title', head, 'Web Sketchpad');
      const links = u.el('div', 'head-links', head);
      for (const label of ['My Drawings', 'Help']) {
        const a = u.el('a', '', links, label);
        a.href = '#';
        a.onclick = (e) => e.preventDefault();
      }
      let note = null;
      if (ctx.display === 'header') {
        note = u.el('div', 'header-note', shell, ctx.instruction);
      }
      const content = u.el('div', 'portal-content', shell),
        left = u.el('main', 'workspace', content);
      left.dataset.role = 'stage';
      const toolchrome = u.el('div', 'tool-chrome', left);
      const tools = u.el('div', 'tool-icons', toolchrome);
      const markTool = (label, icon) => {
        const b = u.el('div', 'chrome-tool', tools);
        b.setAttribute('aria-hidden', 'true');
        b.innerHTML = '<span class="tool-icon">' + icon + '</span><span>' + label + '</span>';
      };
      markTool('Pen', '✎');
      markTool('Eraser', '◩');
      markTool('Line', '／');
      markTool('Rectangle', '□');
      markTool('Circle', '○');
      markTool('Fill', '▰');
      const undo = u.el('div', 'chrome-undo', toolchrome);
      undo.innerHTML = '<span class="fake-icon">↶</span><span>Undo</span>';
      const colors = u.el('div', 'chrome-colors', toolchrome);
      u.el('span', 'color-label', colors, 'Color:');
      for (const c of ['#050505', '#e20c12', '#084bd0', '#07843a', '#f4d300']) {
        const sw = u.el('i', 'color-swatch', colors);
        sw.style.background = c;
      }
      const contentStage = u.el('div', 'canvas-stage', left);
      contentStage.dataset.role = 'stage';
      // The widget mounts its interactive board in the authoritative stage element.
      const records = u.el('aside', 'records-panel', content);
      const rh = u.el('h2', 'records-title', records, 'My Drawings');
      const table = u.el('div', 'records-table', records),
        thead = u.el('div', 'records-head', table);
      u.el('span', '', thead, '');
      u.el('b', '', thead, 'Name');
      u.el('b', '', thead, 'Date Modified');
      u.el('b', '', thead, 'Size');
      const entries = [
        ['Beach House', 'Apr 14, 1998', '10:24 AM', '12 KB', 'house'],
        ['Mountain View', 'Apr 12, 1998', '5:17 PM', '18 KB', 'mountain'],
        ['Sailboat', 'Apr 10, 1998', '1:03 PM', '14 KB', 'boat'],
        ['Flower', 'Apr 8, 1998', '9:46 AM', '11 KB', 'flower'],
        ['Cat', 'Apr 5, 1998', '3:29 PM', '9 KB', 'cat'],
        ['Tree', 'Apr 2, 1998', '11:11 AM', '16 KB', 'tree'],
        ['Fish', 'Mar 30, 1998', '4:02 PM', '10 KB', 'fish'],
        ['Star', 'Mar 27, 1998', '2:18 PM', '8 KB', 'star'],
        ['Heart', 'Mar 24, 1998', '9:55 AM', '7 KB', 'heart'],
        ['Dog', 'Mar 20, 1998', '1:41 PM', '11 KB', 'dog'],
        ['House', 'Mar 18, 1998', '8:35 AM', '13 KB', 'house'],
      ];
      const previews = {
        house:
          '<circle cx="18" cy="10" r="5" fill="none" stroke="#f2c900" stroke-width="1.5"/><path d="M18 2v3M11 4l3 3M25 4l-3 3M9 12l5-1M26 12l-5-1M10 26h19M13 26V16l6-6 7 6v10M16 20h4v6" fill="none" stroke="#07883c" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M7 31q6-3 12 0t12 0" fill="none" stroke="#0754d6" stroke-width="1.6"/>',
        mountain:
          '<path d="M3 27l9-15 6 9 6-14 10 20" fill="none" stroke="#53636b" stroke-width="1.5"/><path d="M5 29l7-12 4 6 3-5M3 29h12" fill="none" stroke="#07883c" stroke-width="2"/><path d="M22 29V19l4-4 4 6v8M20 29h12" fill="none" stroke="#07883c" stroke-width="1.7"/>',
        boat: '<path d="M19 4v20M18 6L9 20h9M20 9l9 11H20M5 27q4-3 8 0t8 0 8 0 5 0M5 31q4-3 8 0t8 0 8 0 5 0" fill="none" stroke="#0754d6" stroke-width="1.7" stroke-linejoin="round"/>',
        flower:
          '<path d="M18 27v-9m0 7q-5-5-8-2 2 5 8 3m0-4q5-6 9-2-2 5-9 4" fill="none" stroke="#07883c" stroke-width="1.5"/><g fill="none" stroke="#e32626" stroke-width="1.5"><circle cx="18" cy="11" r="3"/><circle cx="13" cy="14" r="3"/><circle cx="23" cy="14" r="3"/><circle cx="15" cy="19" r="3"/><circle cx="21" cy="19" r="3"/></g><circle cx="18" cy="15" r="2.3" fill="#f4d300"/>',
        cat: '<path d="M7 13l2-8 7 5q3-1 6 0l7-5 1 9q3 8-3 12-8 5-17 0-6-4-3-13zM13 16h1m9 0h1m-9 5q3 3 6 0m-13-1-5-2m5 5-5 1m22-4 5-2m-5 5 5 1" fill="none" stroke="#171717" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>',
        tree: '<path d="M17 25v7m-6 0h12" stroke="#79532a" stroke-width="2"/><g fill="#07883c" stroke="#087233" stroke-width="1"><circle cx="18" cy="13" r="8"/><circle cx="12" cy="16" r="6"/><circle cx="23" cy="17" r="6"/></g><path d="M6 32q10-2 24 0" fill="none" stroke="#16883d" stroke-width="1.5"/>',
        fish: '<path d="M5 17q7-11 20 0-13 11-20 0l-4 6v-12zM12 15h1m7-3 2-3m-2 14 2 3" fill="none" stroke="#0754d6" stroke-width="1.7" stroke-linejoin="round"/>',
        star: '<path d="m18 3 4 11h11l-9 7 3 11-9-7-9 7 3-11-9-7h11z" fill="none" stroke="#d58b00" stroke-width="1.7"/>',
        heart:
          '<path d="M18 31 5 18Q1 9 9 7q6-1 9 5 4-7 10-5 8 3 4 11z" fill="none" stroke="#db1717" stroke-width="1.8"/>',
        dog: '<path d="M10 10Q5 4 3 10q0 8 7 9m16-9q5-6 7 0 0 8-7 9M9 13q0-6 9-6t9 6v9q-1 8-9 8t-9-8z" fill="none" stroke="#70411e" stroke-width="1.7"/><circle cx="14" cy="17" r="1"/><circle cx="22" cy="17" r="1"/><path d="M16 22q2-2 4 0l-2 2z" fill="none" stroke="#70411e" stroke-width="1.4"/>',
      };
      const list = u.el('div', 'records-list', table);
      for (const [name, date, time, size, ico] of entries) {
        const row = u.el('div', 'record-row', list);
        const thumb = u.el('span', 'record-thumb', row);
        thumb.innerHTML = '<svg viewBox="0 0 36 36" aria-hidden="true">' + previews[ico] + '</svg>';
        u.el('span', 'record-name', row, name);
        const dt = u.el('span', 'record-date', row);
        u.el('span', '', dt, date);
        u.el('span', '', dt, time);
        u.el('span', 'record-size', row, size);
      }
      if (ctx.display === 'panel') {
        const card = u.el('div', 'panel-note', records);
        u.el('b', '', card, 'Task');
        u.el('span', '', card, ctx.instruction);
      }
      if (ctx.display === 'toast') {
        const toast = u.el('div', 'instruction-toast', shell);
        u.el('span', '', toast, ctx.instruction);
        const x = u.el('button', 'toast-close', toast, '×');
        x.type = 'button';
        x.onclick = () => toast.remove();
      }
      const footer = u.el('footer', 'portal-footer', shell);
      u.el('span', 'footer-status', footer, 'Ready');
      let submit = null;
      if (!ctx.finish) {
        const er = ctx.rng.fork('chrome/end'),
          labels = ctx.content && Array.isArray(ctx.content.END_LABELS) ? ctx.content.END_LABELS : END,
          labelText = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
        let place = 'head';
        let label = 'Submit';
        if (!er.bool(0.5)) {
          place = er.pick(['toolbar', 'footer', 'link']);
          label = labelText(er.pick(labels));
        }
        const mk = (parent, tag, cls, text) => {
          const b = u.el(tag, cls, parent, text);
          if (tag === 'button') b.type = 'button';
          else b.href = '#';
          b.dataset.role = 'submit';
          b.title = label;
          b.setAttribute('aria-label', label);
          b.onclick = (e) => {
            e.preventDefault();
            ctx.submit();
          };
          return b;
        };
        const cr = ctx.rng.fork('chrome/collide');
        let collide = null;
        if (cr.bool(0.3)) {
          const p = labels.map(labelText).filter((x) => x.toLowerCase() !== label.toLowerCase());
          if (p.length) collide = cr.pick(p);
        }
        if (place === 'head') {
          submit = mk(links, 'button', 'submit-control', label);
        } else if (place === 'toolbar') {
          submit = mk(links, 'button', 'submit-control toolbar-submit', label);
        } else if (place === 'link') {
          submit = mk(footer, 'a', 'submit-link', label + ' ›');
        } else submit = mk(footer, 'button', 'submit-control', label);
        if (collide) {
          const d = u.el('button', 'xtra-control', footer, collide);
          d.type = 'button';
          d.dataset.role = 'xtra';
          d.onclick = () => env.log('decoy', { label: collide, collide: true });
        }
      }
      return { stage: contentStage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        kind = ctx.kind,
        el = u.el('section', 'portal-overlay overlay-' + kind, document.body);
      el.dataset.role = 'overlay';
      const box = u.el('div', 'overlay-box', el);
      const title =
        {
          cookie: 'Privacy options',
          toast: 'Saved',
          chat: 'Help desk',
          promo: 'Sketchpad news',
          banner: 'Site announcement',
        }[kind] || 'Notice';
      const msg =
        {
          cookie: 'This site uses a small number of cookies to remember your preferences.',
          toast: 'Your drawing has been saved.',
          chat: 'Need help using Web Sketchpad?',
          promo: 'Get the latest drawing tips by email.',
          banner: 'Welcome to Web Sketchpad. New drawing tools are available.',
        }[kind] || 'Please review this message.';
      u.el('h3', '', box, title);
      u.el('p', '', box, msg);
      const close = u.el('button', 'overlay-dismiss', box, kind === 'cookie' ? 'Accept' : 'Close');
      close.type = 'button';
      close.onclick = () => ctx.dismiss('close');
      return { el, dismiss: close, ttlSteps: kind === 'toast' ? 5 : 0 };
    },
  });
})();
