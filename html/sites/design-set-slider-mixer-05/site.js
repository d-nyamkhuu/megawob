// Terrain Audio Studio window frame.
(function () {
  'use strict';
  env.site({
    name: 'design-set-slider-mixer-05',
    styles: ['site.css'],
    scripts: [],
    template: 'site/base',
    design: {
      parts: {
        frame: () => (ctx) => {
          const { util, content } = ctx;
          const make = (tag, cls, parent, text) => util.el(tag, cls, parent, text || '');
          document.body.className = 'terrain-window';
          const title = make('header', 'terrain-titlebar', document.body);
          make('span', 'terrain-mark', title, '✦');
          make('strong', 'terrain-appname', title, 'Terrain Audio Studio');
          const windowTools = make('div', 'terrain-windowtools', title);
          for (const [glyph, label] of [['−', 'Minimize'], ['□', 'Maximize'], ['×', 'Close']]) {
            const b = make('button', 'terrain-winbtn', windowTools, glyph);
            b.type = 'button'; b.title = label; b.setAttribute('aria-label', label);
          }
          const menu = make('nav', 'terrain-menubar', document.body, 'File   Edit   Track   Mix   View   Help');
          menu.setAttribute('aria-label', 'Application menu');
          const tabs = make('nav', 'terrain-tabs', document.body);
          for (const [i, label] of ['Mixer', 'Instruments', 'Effects', 'Sequences', 'Mastering'].entries()) {
            const tab = make('div', `terrain-tab${i === 0 ? ' active' : ''}`, tabs, label);
            if (i === 0) tab.setAttribute('aria-current', 'page');
          }
          const band = make('section', 'terrain-overview', document.body);
          const record = make('div', 'terrain-record', band);
          const cover = make('div', 'terrain-cover', record);
          cover.setAttribute('role', 'img'); cover.setAttribute('aria-label', 'Riverside landscape album cover');
          const info = make('div', 'terrain-session', record);
          make('h1', 'terrain-session-title', info, 'Riverside Session');
          make('div', 'terrain-session-meta', info, '5 tracks   |   44.1 kHz   |   24 bit   |   120 BPM');
          make('div', 'terrain-session-time', info, '00:00  /  03:24');
          const player = make('div', 'terrain-player', info);
          for (const [glyph, label] of [['▶','Play'], ['■','Stop'], ['◀◀','Previous'], ['▶▶','Next']]) {
            const b = make('button', 'terrain-transport', player, glyph);
            b.type = 'button'; b.title = label; b.setAttribute('aria-label', label);
          }
          const scrub = make('div', 'terrain-scrub', player);
          const scrubline = make('div', 'terrain-scrubline', scrub);
          make('span', 'terrain-scrubknob', scrubline);
          make('span', 'terrain-duration', player, '03:24');
          const summary = make('section', 'terrain-summary', band);
          make('h2', '', summary, 'Track Overview');
          for (const [label, value] of [['Total Tracks','5'], ['Active Tracks','5'], ['Effects','3'], ['Length','03:24']]) {
            const row = make('div', 'terrain-stat', summary);
            make('span', '', row, label); make('span', '', row, value);
          }
          const meter = make('section', 'terrain-meter', band);
          make('h2', '', meter, 'Level Meter');
          for (const side of ['L','R']) {
            const line = make('div', 'terrain-meterrow', meter);
            make('b', '', line, side);
            make('div', 'terrain-meterbar', line);
          }
          make('div', 'terrain-scale', meter, '-60      -36      -24      -12       -6        0');
          let instructionPanel = null;
          const main = make('main', 'terrain-workarea', document.body);
          if (ctx.display === 'panel') {
            instructionPanel = make('aside', 'terrain-instruction terrain-side-note', main);
            make('strong', '', instructionPanel, 'Mixer Task');
            make('p', '', instructionPanel, ctx.instruction);
          }
          const stage = make('div', 'terrain-stage', main);
          let instruction = null;
          if (ctx.display === 'header') {
            instruction = make('div', 'terrain-instruction terrain-header-note', document.body);
            instruction.textContent = ctx.instruction;
            band.before(instruction);
          } else if (ctx.display === 'toast') {
            instruction = make('div', 'terrain-instruction terrain-toast-note', document.body);
            instruction.textContent = ctx.instruction;
          }
          const endRng = ctx.rng.fork('terrain/end');
          let label = content.endLabel(endRng);
          let submit = null;
          if (!ctx.finish) {
            const placement = endRng.pick(['header','header','footer','icon']);
            if (placement === 'header') label = 'Apply';
            const parent = placement === 'footer' ? make('footer', 'terrain-footer', document.body) : title;
            const buttonText = placement === 'icon' ? '✓' : label;
            submit = make('button', placement === 'footer' ? 'terrain-apply terrain-footer-end' : 'terrain-apply', parent, buttonText);
            submit.type = 'button'; submit.dataset.role = 'submit'; submit.title = label;
            submit.setAttribute('aria-label', label);
            submit.addEventListener('click', () => ctx.submit());
            const coll = ctx.rng.fork('terrain/collide');
            if (coll.bool(0.3)) {
              const text = content.collideLabel(coll, label);
              const decoy = make('button', 'terrain-send', title, text);
              decoy.type = 'button'; decoy.addEventListener('click', () => env.log('decoy', {label:text, collide:true}));
            }
          }
          return { stage, submit };
        },
      },
    },
  });
})();
