(function () {
  'use strict';
  const C = {
    'site': 'design-find-fact-similar-11',
    'brand': 'Amiga Workbench  1.3',
    'title': 'Word Options',
    'instruction': 'left',
    'rail': '',
    'menu': '',
    'briefTitle': 'Instructions',
  };
  function svg(body) {
    return '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">' + body + '</svg>';
  }
  function toolArt(name) {
    const paper =
      '<path d="M9 5H48L56 13V59H9Z" fill="#ddd" stroke="#111" stroke-width="3"/><path d="M12 8H46V15H53V56H12Z" fill="#fafafa"/><path d="M46 6V16H55" fill="#003896" stroke="#111" stroke-width="2"/>';
    const drawings = {
      Disk: '<path d="M5 4H57L61 9V60H4V7Z" fill="#0038a1" stroke="#080b12" stroke-width="3"/><path d="M9 7V57M57 10V57" stroke="#0875d9" stroke-width="3"/><path d="M20 5H49V25H19Z" fill="#c4c8cc" stroke="#111" stroke-width="2"/><path d="M37 8H45V22H37Z" fill="#14232c"/><path d="M14 33H52V59H14Z" fill="#ccc" stroke="#111" stroke-width="3"/><path d="M18 37H47V40H18ZM18 43H43V46H18ZM18 50H36V53H18Z" fill="#e5e5e5"/>',
      Drawer:
        '<path d="M5 6L10 2H57L62 7V59H5Z" fill="#8398b6" stroke="#101824" stroke-width="3"/><path d="M9 7H56V56H9Z" fill="#c5c7ca" stroke="#f7f7f7" stroke-width="3"/><path d="M12 11H53V30H12ZM12 34H53V53H12Z" fill="#b1b8c4" stroke="#17396b" stroke-width="2"/><path d="M24 17H43V23H24ZM24 39H43V45H24Z" fill="#fff" stroke="#003884" stroke-width="2"/>',
      Edit: paper + '<path d="M18 24H45M18 32H48M18 40H45M18 48H40" stroke="#111" stroke-width="3"/>',
      Paint:
        '<path d="M18 45L53 3L57 2L58 11L28 49Z" fill="#003d9f" stroke="#10121a" stroke-width="2"/><path d="M26 38L53 7" stroke="#96c1ee" stroke-width="3"/><path d="M18 43L25 48L18 56L9 52Z" fill="#ccc" stroke="#111" stroke-width="2"/><path d="M9 50L18 55L11 61L1 63L4 55Z" fill="#ed7800" stroke="#111" stroke-width="2"/><path d="M7 54L4 60L10 58" stroke="#ffce1b" stroke-width="2"/>',
      Find: '<path d="M39 38L60 58L57 62L35 42" fill="#aaa" stroke="#111" stroke-width="3"/><path d="M20 2H31L40 7L45 18V31L36 42L22 45L10 38L4 28V16L10 7Z" fill="#ddd" stroke="#111" stroke-width="3"/><path d="M20 7H30L38 13L40 24L35 34L24 38L14 33L9 23L12 13Z" fill="#65b7ee" stroke="#162c48" stroke-width="2"/><path d="M13 17L18 10H25V15L20 21H13Z" fill="#e5f9ff"/><path d="M13 29L20 35H31" fill="none" stroke="#2f75b7" stroke-width="3"/>',
      Shell:
        '<path d="M2 4H62V61H2Z" fill="#999" stroke="#111" stroke-width="3"/><path d="M5 7H59V57H5Z" fill="#b4becb" stroke="#eee" stroke-width="2"/><path d="M10 12H54V50H10Z" fill="#001441" stroke="#183b63" stroke-width="3"/><path d="M14 18L20 22L14 27M23 29H32" fill="none" stroke="#dce200" stroke-width="2"/>',
      Trash:
        '<path d="M13 16L17 61H49L53 16Z" fill="#a9b0b8" stroke="#111" stroke-width="3"/><path d="M19 22V55M26 23V57M39 23V57M46 22V54" stroke="#354150" stroke-width="3"/><path d="M23 22V55M42 22V55" stroke="#eee" stroke-width="2"/><path d="M8 11L15 6H50L58 11V17L49 20H17L8 16Z" fill="#b9c0c8" stroke="#111" stroke-width="3"/><path d="M22 6V2H43V7" fill="#999" stroke="#111" stroke-width="3"/><path d="M12 12L20 15H48L54 12" fill="none" stroke="#eee" stroke-width="2"/>',
    };
    return svg(drawings[name] || '');
  }
  function globeArt() {
    return svg(
      '<defs><radialGradient id="ocean" cx="27%" cy="20%"><stop stop-color="#478cef"/><stop offset=".52" stop-color="#003bbb"/><stop offset="1" stop-color="#001579"/></radialGradient><clipPath id="earth"><circle cx="32" cy="32" r="30"/></clipPath></defs><circle cx="32" cy="32" r="31" fill="#080b12"/><g clip-path="url(#earth)"><path d="M0 0H64V64H0Z" fill="url(#ocean)"/><path d="M25 7H32V5H38V8H42V6H46V10H42V13H43V17H38V20H35V24H33V28H30V30H33V32H35V35H32V34H29V31H26V29H23V25H20V20H22V16H24V13H21V10H25ZM17 9H21V13H17V16H13V14H10V11H17ZM34 36H39V38H43V40H48V44H45V48H41V51H39V55H36V59H33V56H34V51H32V47H31V43H29V39H32ZM39 3H43V6H40ZM54 12H58V18H61V23H58V27H56V33H59V38H55V35H52V30H53V24H50V21H53V17H51Z" fill="#58a500"/><path d="M15 8H21V10H18V13H15V16H11V19H9V22H6V18H9V13H12V10H15ZM7 24H10V28H7Z" fill="#85baff"/><path d="M24 9H29V12H26V16H23V19H21V16H22V12H24ZM32 8H36V11H32ZM34 18H38V21H34ZM32 38H37V41H32Z" fill="#7bb800"/><path d="M29 11H32V14H29ZM27 19H30V22H27ZM30 26H33V28H30ZM27 31H30V33H27ZM36 33H38V35H36Z" fill="#0044ae"/></g>',
    );
  }
  env.site({
    name: C.site,
    initialOverlay: { kind: 'promo' },
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util;
      const top = u.el('header', 'ds-top', document.body);
      const logo = u.el('i', 'wb-logo', top);
      logo.innerHTML = svg(
        '<path d="M23 6H40V10H47V18H53V41H47V49H39V55H22V50H14V43H9V20H15V12H23Z" fill="#fff" stroke="#111" stroke-width="4"/><path d="M23 8H32V18H23ZM15 20H24V31H14ZM32 17H44V28H33ZM23 30H35V42H24ZM13 39H23V47H19ZM36 40H46V48H36ZM27 48H37V54H27ZM42 28H52V39H43Z" fill="#df2011"/><path d="M28 9H31V15H28ZM16 22H19V28H16ZM26 32H29V38H26Z" fill="#ff9880"/>',
      );
      u.el('span', 'ds-brand', top, C.brand);
      u.el('span', '', top, 'Mon Apr 22 1991   10:24');
      if (C.menu) {
        const nav = u.el('nav', 'ds-menu', document.body);
        C.menu.split('|').forEach((t) => u.el('span', '', nav, t));
      }
      const body = u.el('div', 'ds-body', document.body);
      if (C.rail) {
        const rail = u.el('aside', 'ds-rail', body);
        C.rail.split('|').forEach((t) => u.el('div', '', rail, t));
      }
      const content = u.el('div', 'ds-content', body);
      const tb = u.el('div', 'ds-title', content);
      u.el('i', '', tb, '-');
      u.el('span', '', tb, 'Word Match');
      u.el('b', '', tb, '');
      u.el('em', '', tb, '');
      const dock = u.el('div', 'ds-dock', document.body);
      ['Disk', 'Drawer', 'Edit', 'Paint', 'Find', 'Shell', 'Trash'].forEach((t) => {
        const d = u.el('div', 'ds-icon' + (t === 'Trash' ? ' trash' : ''), dock);
        const icon = u.el('i', '', d);
        icon.innerHTML = toolArt(t);
        u.el('span', '', d, t);
      });
      const mode = ctx.display || 'header';
      function briefing(parent, cls) {
        const b = u.el('aside', cls, parent);
        if (cls === 'ds-brief') u.el('h2', '', b, C.briefTitle || 'Task');
        u.el('div', 'ds-instruction', b, ctx.instruction);
        return b;
      }
      if (mode === 'header') briefing(content, 'ds-header-note');
      const main = u.el('div', 'ds-main', content);
      if (mode === 'panel') briefing(main, 'ds-brief');
      if (mode === 'toast') {
        const note = briefing(content, 'ds-toast');
        content.insertBefore(note, main);
      }
      const stage = u.el('main', 'ds-stage', main);
      const foot = u.el('footer', 'ds-footer', content);
      u.el('span', '', foot, 'Ready');
      const labels = (
        (ctx.content && ctx.content.END_LABELS) || [
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
        ]
      ).map((x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x)));
      const er = ctx.rng.fork('chrome/end');
      let placement = 'footer',
        label = 'Submit';
      if (!er.bool(0.5)) {
        placement = er.pick(['title', 'dock']);
        label = er.pick(labels);
      }
      const endBtn = (parent, cls, text) => {
        const b = u.el('button', cls, parent, text);
        b.type = 'button';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', text);
        b.title = text;
        b.addEventListener('click', () => ctx.submit());
        return b;
      };
      const decoyBtn = (parent, text) => {
        const b = u.el('button', 'ds-xtra', parent, text);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
        return b;
      };
      let submit = null;
      if (!ctx.finish) {
        if (placement === 'footer') submit = endBtn(foot, 'ds-submit', label);
        else if (placement === 'title') submit = endBtn(tb, 'ds-submit', label);
        else submit = endBtn(dock, 'ds-submit', label);
      }
      const cr = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (cr.bool(0.3)) {
        const same = (x) => String(x).trim().toLowerCase() === String(label).trim().toLowerCase();
        const pool = [
          ...new Set(labels.map((x) => (typeof x === 'string' ? x : x.label || x.text || String(x)))),
        ].filter((x) => !same(x));
        if (pool.length) collide = cr.pick(pool);
      }
      if (collide) {
        const parent = placement === 'title' ? dock : tb;
        decoyBtn(parent, collide);
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      const el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const nt = u.el('div', 'nl-title', el);
      u.el('i', '', nt);
      u.el('span', '', nt, 'Workbench Newsletter');
      u.el('b', '', nt);
      const nb = u.el('div', 'nl-body', el);
      const globe = u.el('div', 'nl-globe', nb);
      globe.innerHTML = globeArt();
      const tx = u.el('div', 'nl-text', nb);
      u.el('h4', '', tx, 'Amiga World News');
      u.el('p', '', tx, 'Tips, software updates and more, delivered to your inbox!');
      u.el('p', '', tx, 'Stay in touch with the Amiga community.');
      const dismiss = u.el('button', '', tx, 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  });
})();
