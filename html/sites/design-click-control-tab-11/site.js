// Neumorphic frame design on the shared site template.
(function () {
  'use strict';
  const cfg = {
    obstacle: 'Quick Survey',
    copy: 'We’d love your feedback!|How satisfied are you with this app today?|Very satisfied|Satisfied|Neutral|Dissatisfied|Very dissatisfied|What could we improve?',
    dismiss: 'Close survey',
  };

  // The survey is the design's own obstruction; other overlay kinds use the template.
  function surveyOverlay(ctx) {
    const u = ctx.util;
    const el = u.el('div', 'survey-overlay', document.body);
    el.dataset.role = 'overlay';
    const pc = u.el('div', 'pause-card', el, 'Task paused');
    u.el('small', '', pc, 'Clears when survey is closed');
    const obstacle = u.el('section', 'design-obstacle', el);
    u.el('h2', '', obstacle, cfg.obstacle);
    cfg.copy.split('|').forEach(t => u.el('p', '', obstacle, t));
    obstacle.querySelectorAll('p').forEach((p, i) => {
      if (i >= 2 && i <= 6) {
        const input = document.createElement('input'); input.type = 'radio'; input.name = 'quick-survey'; input.checked = i === 4; p.prepend(input);
      }
      if (i === 7) { const area = u.el('textarea', 'survey-answer', p); area.placeholder = 'Type your answer here...'; }
    });
    const survey = u.el('button', 'survey-submit', obstacle, 'Submit Survey');
    const dismissSurvey = () => ctx.dismiss();
    survey.addEventListener('click', dismissSurvey);
    const x = u.el('button', 'survey-x', obstacle, '×');
    x.type = 'button'; x.setAttribute('aria-label', 'Close survey'); x.addEventListener('click', dismissSurvey);
    const close = u.el('button', 'dismiss-design', obstacle, cfg.dismiss);
    close.type = 'button'; close.addEventListener('click', dismissSurvey);
    return { el, dismiss: close };
  }

  env.site({
    name: 'design-click-control-tab-11',
    template: 'site/base',
    styles: ['site.css', 'tweaks.css'],
    initialOverlay: { kind: 'promo' },
    design: {
      LANGS: ['en'],
      parts: {
        'frame.theme': () => (_c) => {
          const { ctx } = _c;
          document.body.className = 'ref neumo board';
          Object.assign(_c, { rng: ctx.rng, util: ctx.util, content: ctx.content });
        },
        'frame.layout': () => (_c) => {
          const W = window.innerWidth, H = window.innerHeight;
          Object.assign(_c, { W, H, roomy: W >= 1260, tall: H >= 700, display: _c.ctx.display || 'header' });
        },
        'frame.placement': (base) => (_c) => {
          base(_c);
          // This design always reserves its Help / end-control dock.
          _c.wantFooter = true;
        },
        'frame.header': () => (_c) => {
          const { ctx, util } = _c;
          const shell = util.el('main', 'shell', document.body);
          shell.dataset.display = ctx.display;
          const header = util.el('header', 'head', shell);
          const title = util.el('div', 'title', header, 'Menu');
          const icon = util.el('span', 'menu-icon', title);
          icon.innerHTML = '<svg viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 5h16M9 14h16M9 23h16M3 5h.1M3 14h.1M3 23h.1"/></svg>';
          title.prepend(icon);
          Object.assign(_c, { shell, header });
        },
        'frame.nav': () => () => {},
        'frame.instruction': (base) => (_c) => {
          base(_c);
          const note = _c.header.querySelector('.ref-instruction');
          if (note) {
            note.classList.add('instruction');
            note.dataset.display = _c.display;
          }
        },
        'frame.body': () => (_c) => {
          const work = _c.util.el('div', 'ref-body work', _c.shell);
          const body = _c.util.el('section', 'center', work);
          Object.assign(_c, { body });
        },
        'frame.panel': (base) => (_c) => {
          base(_c);
          const panel = _c.body.querySelector('.ref-panel');
          if (panel) {
            panel.classList.add('instruction', 'instruction-panel');
            panel.dataset.display = _c.display;
            panel.querySelector('.ref-panel-title').remove();
          }
        },
        'frame.stage': () => (_c) => {
          _c.stage = _c.util.el('div', 'stage', _c.body);
        },
        'frame.toast': (base) => (_c) => {
          base(_c);
          const note = document.querySelector('.ref-note');
          if (note) note.classList.add('instruction', 'instruction-toast');
        },
        'frame.footer': (base) => (_c) => {
          base(_c);
          const footer = document.querySelector('.ref-foot');
          footer.classList.add('footer');
          _c.shell.append(footer);
          const help = footer.querySelector('.ref-foot-text');
          help.className = 'help-btn';
          help.textContent = 'Help';
          // Keep the perimeter tools below the work area, clear of the instruction.
          for (const decoy of _c.headerTools.querySelectorAll('.ref-xtra')) {
            footer.querySelector('.ref-tools').append(decoy);
          }
          Object.assign(_c, { footer });
        },
        'frame.end': (base) => (_c) => {
          const { placement, submit, footer } = _c;
          const dock = document.querySelector('.ref-float-dock');
          if (dock) footer.append(dock);
          for (const decoy of document.querySelectorAll('.ref-xtra')) decoy.classList.add('end-xtra');
          if (submit) {
            if (placement === 'link') submit.classList.add('end-link');
            else submit.classList.add('submit');
            if (placement === 'header' || placement === 'icon') submit.classList.add('end-header');
            if (placement === 'icon') submit.classList.add('end-icon');
          }
          return base(_c);
        },
        overlay: (base) => (ctx) => ctx.initial || ctx.kind === 'promo' ? surveyOverlay(ctx) : base(ctx),
      },
    },
  });
})();
