// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  function drawIcon(util, parent, name) {
    const svg = util.svg('svg', { viewBox: '0 0 32 32', 'aria-hidden': 'true', 'shape-rendering': 'crispEdges' }, parent);
    const shape = (tag, attrs) => util.svg(tag, Object.assign({ stroke: '#092c69', 'stroke-width': 1.5, 'stroke-linejoin': 'miter' }, attrs), svg);
    const line = d => shape('path', { d, fill: 'none', stroke: '#559ac0', 'stroke-width': 1.2 });
    if (name === 'Open') {
      shape('path', { d: 'M3 9h10l3-4h9v5h4v17H3z', fill: '#fff6bd' });
      shape('path', { d: 'M6 11h24l-5 16H2z', fill: '#ffdd39' });
      line('M8 7h5M8 15h18');
    } else if (name === 'Print') {
      shape('path', { d: 'M8 2h16v12H8z', fill: '#fff' });
      shape('path', { d: 'M3 13h26v13H3z', fill: '#b9ccd8' });
      shape('path', { d: 'M6 11h20v6H6z', fill: '#eef3f4' });
      shape('path', { d: 'M8 21h16v9H8z', fill: '#fff' });
      line('M11 25h10M11 28h10');
    } else if (name === 'Students') {
      shape('path', { d: 'M6 31V21l7-5h7l6 5v10z', fill: '#1679cb' });
      shape('path', { d: 'M10 7l3-5h9l3 5-1 8-5 5-7-4z', fill: '#ffca79' });
      shape('path', { d: 'M10 10V5l4-4h8l4 6-5-1-3-2-5 5z', fill: '#f3ba24' });
      shape('path', { d: 'M15 19l3 4 3-4M18 23v8', fill: '#fff' });
    } else if (name === 'book') {
      shape('path', { d: 'M2 7l4-2h7l3 2 3-2h7l4 2v20h-11l-3 2-3-2H2z', fill: '#e5be78' });
      shape('path', { d: 'M4 5h8l4 3 4-3h8v19h-8l-4 3-4-3H4z', fill: '#fffef1' });
      shape('path', { d: 'M16 8v19', fill: 'none' });
      line('M7 10h5M7 14h5M7 18h5M20 10h5M20 14h5M20 18h5');
    } else if (name === 'Modules') {
      for (let i = 2; i >= 0; i--) {
        const y = i * 7;
        shape('path', { d: `M3 ${4+y}l10-3 15 7v6l-11 4L3 ${11+y}z`, fill: i === 1 ? '#62b5e1' : '#fafcfb' });
        shape('path', { d: `M4 ${8+y}l13 6 10-4`, fill: 'none', stroke: '#1247a0', 'stroke-width': 3 });
      }
    } else if (name === 'Gradebook' || name === 'Rubrics') {
      shape('rect', { x: 2, y: 2, width: 28, height: 28, fill: '#fff' });
      shape('path', { d: 'M3 3h26v6H3z', fill: '#49a9d2' });
      shape('path', { d: 'M11 9v20M20 9v20M3 16h26M3 23h26', fill: 'none' });
      if (name === 'Rubrics') shape('rect', { x: 21, y: 17, width: 7, height: 5, fill: '#f3c431', stroke: '#f3c431' });
    } else if (name === 'Quizzes') {
      shape('rect', { x: 4, y: 2, width: 24, height: 28, fill: '#fff' });
      util.svg('text', { x: 16, y: 25, 'text-anchor': 'middle', fill: '#0659cd', 'font-family': 'Arial', 'font-size': 27, 'font-weight': 'bold' }, svg).textContent = '?';
    } else {
      shape('path', { d: 'M4 2h20l5 5v23H4z', fill: '#fff' });
      shape('path', { d: 'M24 2v6h5', fill: '#b3d7eb' });
      line('M8 8h12M8 12h16M8 16h16M8 20h16M8 24h16');
      if (name === 'Assignments') shape('path', { d: 'M25 8l4 2-5 18-4 2v-5z', fill: '#e76c2c' });
    }
    return svg;
  }

  const parts = {
    endLabel: (base) => function (rng, content) {
      const label = base(rng, content);
      return rng.fork('pixel/end-label').bool(0.5) ? 'Save' : label;
    },
    'frame.layout': (base) => function (_c) {
      base(_c);
      if (_c.H <= 760 && _c.display === 'toast') _c.display = 'header';
      document.body.classList.toggle('ref-has-note', _c.display === 'toast');
    },
    overlay: (base, S) => function overlay(ctx) {
      const { K } = S;
      const { rng, util, kind } = ctx;
      const { text } = ctx.content.bannerText(rng, kind === 'banner' ? 'notice' : kind);
      const word = ctx.lang && ctx.lang !== 'en' && ctx.word ? ctx.word : null;
      const el = util.el('div', `ref-ov ref-ov-${kind}`, document.body);
      el.dataset.role = 'overlay';
      const box = kind === 'promo' ? util.el('div', 'ref-ov-box', el) : el;
      if (kind === 'promo') util.el('strong', 'pixel-dialog-title', box, 'Course Updates');
      if (kind === 'banner') {
        const header = document.querySelector('.ref-task');
        if (header) el.style.top = `${header.getBoundingClientRect().bottom}px`;
      }
      if (kind === 'chat') util.el('strong', 'course-chat-title', box, 'Need help?');
      util.el('div', 'ref-ov-text', box, word ? word(rng.fork('lang').pick(K.overlay[kind] || K.overlay.toast)) : text);
      const row = util.el('div', 'ref-ov-row', box);
      const btn = (label, how, primary) => {
        if (word && K.button[label]) label = word(K.button[label]);
        const b = util.el('button', primary ? 'ref-ov-btn ref-ov-primary' : 'ref-ov-btn', row, label);
        b.type = 'button';
        b.addEventListener('click', () => (how ? ctx.dismiss(how) : env.log('overlay-click', { label })));
        return b;
      };
      let dismiss;
      if (kind === 'cookie') {
        if (rng.bool(0.5)) btn('Settings', null, false);
        btn(rng.pick(['Reject all', 'Necessary only']), 'reject', false);
        dismiss = btn(rng.pick(['Accept all', 'Accept', 'Got it']), 'accept', true);
      } else if (kind === 'promo') {
        dismiss = btn(rng.pick(['No thanks', 'Maybe later', 'Close']), 'close', false);
        btn(rng.pick(['Upgrade now', 'Start trial', 'Learn more']), null, true);
      } else if (kind === 'banner') {
        dismiss = btn('Dismiss', 'close', false);
      } else {
        dismiss = btn('×', 'close', false);
        dismiss.setAttribute('aria-label', word ? word('close') : 'Close');
      }
      if (kind === 'chat') util.el('div', 'course-chat-input', box, 'Type a message...');
      return { el, dismiss, ttlSteps: kind === 'toast' ? rng.int(3, 5) : 0 };
    },
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const title = util.el('div', 'pixel-titlebar', header);
      drawIcon(util, util.el('span', 'pixel-app-icon', title), 'book');
      util.el('strong', 'pixel-title', title, 'Course Manager - Intro to Computer Science');
      const windows = util.el('span', 'pixel-window-controls', title);
      for (const text of ['_', '□', '×']) util.el('span', '', windows, text);
      const menu = util.el('nav', 'pixel-menubar', header);
      for (const item of ['File', 'Edit', 'View', 'Course', 'Gradebook', 'Assessments', 'Tools', 'Help']) util.el('span', '', menu, item);
      const toolbar = util.el('div', 'pixel-toolbar', header);
      const navtools = util.el('div', 'pixel-navtools', toolbar);
      for (const label of ['New', 'Open', 'Print', 'Students', 'Assignments', 'Gradebook', 'Quizzes', 'Modules', 'Rubrics']) {
        const b = util.el('button', `pixel-tool${label === 'Gradebook' ? ' selected' : ''}`, navtools);
        b.type = 'button'; b.setAttribute('aria-label', label); b.title = label;
        drawIcon(util, util.el('span', 'pixel-tool-icon', b), label);
        util.el('span', 'pixel-tool-label', b, label);
      }
      S.frameBrand(_c, header);
      Object.assign(_c, { header, title, toolbar, courseHead: title, courseTabs: menu });
    },
    'frame.instruction': (base, S) => function (_c) {
      const { ctx, display, header, toolbar, util } = _c;
      if (display === 'header') {
        const note = util.el('div', 'ref-instruction', header);
        drawIcon(util, util.el('span', 'pixel-header-note-icon', note), 'New');
        util.el('span', '', note, ctx.instruction);
        header.insertBefore(note, toolbar);
      }
      else util.el('div', 'ref-spacer', header);
    },
    'frame.tools': (base) => function (_c) {
      base(_c);
      _c.toolbar.appendChild(_c.headerTools);
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      util.el('div', 'pixel-workspace', body);
      S.frameSidebar(_c, body);
      Object.assign(_c, { body });
    },
    'frame.footer': (base, S) => function (_c) {
      base(_c);
      const legend = _c.util.el('div', 'pixel-legend', document.body);
      _c.util.el('strong', '', legend, 'Cell Legend:');
      _c.util.el('span', 'legend-box editable', legend);
      _c.util.el('span', '', legend, '= enter recorded mark');
      _c.util.el('span', 'legend-box locked', legend);
      _c.util.el('span', '', legend, '= finalized grade (locked)');
      _c.util.el('i', '', legend);
      _c.util.el('span', '', legend, 'Numbers in parentheses are total points for each assignment.');
      if (_c.placement !== 'footer' && _c.placement !== 'link') {
        const extras = document.querySelectorAll('.ref-foot .ref-xtra');
        if (extras.length) {
          const tools = _c.util.el('div', 'pixel-legend-tools', legend);
          for (const extra of extras) tools.appendChild(extra);
        }
      }
    },
  };

  env.site({
    name: 'design-use-course-admin-grades-05',
    template: 'site/base',
    design: { parts },
  });
})();
