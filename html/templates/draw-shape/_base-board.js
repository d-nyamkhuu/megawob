/* draw-shape/_base-board: the reference board scope, with all original unit hooks.
 * Registered by draw-shape/base in the original scope order. */
(function () {
  'use strict';
  env.template('draw-shape/_base-board', () => ({
    register(env, scriptOf, __parts, __has, setScope) {
      'use strict';
      const __scope = {
        get env() { return env; },
        get scriptOf() { return scriptOf; },
        get CB_CSS() { return CB_CSS; },
        get svgIcon() { return svgIcon; },
        get CB_ICONS() { return CB_ICONS; },
        get CB_TOOL_LABELS() { return CB_TOOL_LABELS; },
        get CB_APPS() { return CB_APPS; },
        get CB_BOARDS() { return CB_BOARDS; },
        get CB_FRAMES() { return CB_FRAMES; },
        get CB_NOTE_TEXT() { return CB_NOTE_TEXT; },
        get CB_NOTES() { return CB_NOTES; },
        get CB_AV() { return CB_AV; },
        get r4() { return r4; },
        get cbView() { return cbView; }, set cbView(v) { cbView = v; },
        get cbKey() { return cbKey; }, set cbKey(v) { cbKey = v; },
        get renderCanvasboard() { return renderCanvasboard; },
      };
      for (const k of Object.keys(__parts)) if (k.startsWith('+2.')) {
        let v; let built = false;
        Object.defineProperty(__scope, k.slice(3), {
          get: () => (built ? v : (built = true, v = __parts[k](undefined, __scope))),
          set: (x) => { built = true; v = x; },
        });
      }
      setScope(__scope);
      if (__has('renderCanvasboard')) renderCanvasboard = __parts['renderCanvasboard'](renderCanvasboard, __scope);

      const CB_CSS = __has('CB_CSS') ? __parts['CB_CSS'](undefined, __scope) : (`
      .cb-app { position: absolute; overflow: hidden; border: 1px solid var(--line); border-radius: 12px; background: var(--bg);
        box-shadow: 0 1px 2px rgba(0,0,0,.06), 0 8px 24px rgba(0,0,0,.08); color: var(--fg);
        font: 13px system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; }
      .cb-canvas { position: absolute; left: 0; top: 0; display: block; touch-action: none; user-select: none; -webkit-user-select: none; }
      .cb-float { position: absolute; display: flex; align-items: center; gap: 3px; padding: 4px; background: var(--panel);
        border: 1px solid var(--line); border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,.12); }
      .cb-head { left: 10px; top: 10px; padding: 4px 12px 4px 5px; gap: 8px; white-space: nowrap; }
      .cb-head .logo { width: 24px; height: 24px; border-radius: 7px; background: var(--accent); color: #fff; display: grid;
        place-items: center; font: 800 12px system-ui, sans-serif; }
      .cb-head .name { font-weight: 650; }
      .cb-head .crumb { color: var(--muted); }
      .cb-share { right: 10px; top: 10px; padding: 4px 4px 4px 8px; }
      .cb-share .av { width: 24px; height: 24px; border-radius: 50%; color: #fff; font: 700 10px/20px system-ui, sans-serif;
        text-align: center; margin-left: -7px; border: 2px solid var(--panel); box-sizing: border-box; }
      .cb-share .av:first-child { margin-left: 0; }
      .cb-share button { height: 28px; padding: 0 12px; margin-left: 8px; border-radius: 7px; border: 0; background: var(--accent);
        color: #fff; font: 600 12px system-ui, sans-serif; cursor: pointer; }
      .cb-tools { left: 10px; top: 50%; transform: translateY(-50%); flex-direction: column; }
      .cb-tools .sep { width: 24px; height: 1px; background: var(--line); margin: 3px 0; }
      .cb-btn { position: relative; width: 36px; height: 36px; display: grid; place-items: center; border: 0; border-radius: 8px;
        background: transparent; color: var(--fg); cursor: pointer; padding: 0; }
      .cb-btn svg { width: 19px; height: 19px; }
      .cb-btn:hover { background: color-mix(in srgb, var(--fg) 8%, transparent); }
      .cb-btn[aria-pressed="true"] { background: color-mix(in srgb, var(--accent) 18%, var(--panel)); color: var(--accent); }
      .cb-btn:disabled { opacity: .38; cursor: default; }
      .cb-btn kbd { position: absolute; right: 2px; bottom: 0; font: 600 8px ui-monospace, Menlo, Consolas, monospace; color: var(--muted); }
      .cb-zoom { right: 10px; bottom: 10px; }
      .cb-zoom .pct { min-width: 46px; text-align: center; font-variant-numeric: tabular-nums; color: var(--muted); font-weight: 600; }
      .cb-zoom .cb-btn { width: 30px; height: 30px; font: 600 17px system-ui, sans-serif; }
      .cb-zoom .cb-btn svg { width: 16px; height: 16px; }
      .cb-hint { left: 10px; bottom: 10px; padding: 7px 11px; font-size: 12px; color: var(--muted); white-space: nowrap;
        overflow: hidden; text-overflow: ellipsis; }
      `);
      const svgIcon = __has('svgIcon') ? __parts['svgIcon'](undefined, __scope) : { svgIcon: (d) => `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${d}</svg>` }.svgIcon;
      const CB_ICONS = __has('CB_ICONS') ? __parts['CB_ICONS'](undefined, __scope) : ({
        select: svgIcon('<path d="M5 3l11 6.5-4.8 1.3L9 15.5z"/>'),
        hand: svgIcon('<path d="M7 10.5V5a1.4 1.4 0 012.8 0v4.5M9.8 9V3.8a1.4 1.4 0 012.8 0V9.5M12.6 9.5V5.3a1.4 1.4 0 012.8 0v6.2c0 3.6-2.4 6-5.6 6-2.5 0-3.9-1.3-5.2-3.4L3 11.2a1.3 1.3 0 012.1-1.5L7 12"/>'),
        pen: svgIcon('<path d="M4 16l.8-3.2L13.5 4.1l2.4 2.4-8.7 8.7z"/><path d="M11.8 5.8l2.4 2.4"/>'),
        line: svgIcon('<path d="M4 16L16 4"/>'),
        rect: svgIcon('<rect x="3.5" y="5" width="13" height="10" rx="1"/>'),
        ellipse: svgIcon('<ellipse cx="10" cy="10" rx="7" ry="5"/>'),
        eraser: svgIcon('<path d="M8.5 16H16M3.8 12.2l7-7a1.5 1.5 0 012.1 0l2.9 2.9a1.5 1.5 0 010 2.1L10 16H7.6z"/>'),
        undo: svgIcon('<path d="M7 7h6a4 4 0 010 8H8"/><path d="M9.5 4.2L6.6 7l2.9 2.9"/>'),
        clear: svgIcon('<path d="M4 6h12M8 6V4h4v2M6 6l.9 10h6.2L14 6"/>'),
        sticky: svgIcon('<path d="M4 4h12v8l-4 4H4z"/><path d="M12 16v-4h4"/>'),
        text: svgIcon('<path d="M5 5h10M10 5v11"/>'),
        fit: svgIcon('<path d="M4 8V4h4M12 4h4v4M16 12v4h-4M8 16H4v-4"/>'),
      });
      const CB_TOOL_LABELS = __has('CB_TOOL_LABELS') ? __parts['CB_TOOL_LABELS'](undefined, __scope) : ({ select: 'Select', hand: 'Hand', pen: 'Pen', line: 'Line', rect: 'Rectangle', ellipse: 'Ellipse', eraser: 'Eraser',
        sticky: 'Sticky note', text: 'Text' });
      const CB_APPS = __has('CB_APPS') ? __parts['CB_APPS'](undefined, __scope) : (['Driftboard', 'Skyslate', 'Notewell', 'Fieldboard', 'Cloudtack', 'Pinwheel']);
      const CB_BOARDS = __has('CB_BOARDS') ? __parts['CB_BOARDS'](undefined, __scope) : (['Sprint planning', 'Team retro', 'Onboarding flow', 'Workshop', 'Brainstorm', 'Roadmap draft', 'Design review']);
      const CB_FRAMES = __has('CB_FRAMES') ? __parts['CB_FRAMES'](undefined, __scope) : (['Frame 1', 'Exercise', 'Sketch area', 'Scratchpad', 'Workspace']);
      const CB_NOTE_TEXT = __has('CB_NOTE_TEXT') ? __parts['CB_NOTE_TEXT'](undefined, __scope) : (['Ideas', 'Q3 goals', 'Ask design', 'User quotes', 'Parking lot', 'Follow up', 'Draft flow', 'To do',
        'Open questions', 'Next sprint', 'Notes from call', 'Risks', 'Quick wins', 'Later', 'Blocked?', 'Dot vote']);
      const CB_NOTES = __has('CB_NOTES') ? __parts['CB_NOTES'](undefined, __scope) : (['#ffe68a', '#ffc9de', '#bfe6ff', '#c8f1c0', '#ffd8a8', '#e0d4ff']);
      const CB_AV = __has('CB_AV') ? __parts['CB_AV'](undefined, __scope) : (['#e8590c', '#2b8a3e', '#1c63d6', '#ae3ec9', '#0c8599', '#c2255c']);

      let cbView = __has('cbView') ? __parts['cbView'](undefined, __scope) : (null);
      let cbKey = __has('cbKey') ? __parts['cbKey'](undefined, __scope) : (null);
      if (__has('stmt2.0')) __parts['stmt2.0'](undefined, __scope);
      else document.addEventListener('keydown', (e) => { if (cbKey) cbKey(e); });

      const r4 = __has('r4') ? __parts['r4'](undefined, __scope) : { r4: (v) => Math.round(v * 1e4) / 1e4 }.r4;

      function renderCanvasboard(ctx) {
        return env.templateLib('draw-shape/_canvasboard').render(__scope, ctx);
      }

      env.widget({
        task: 'draw-shape',
        site: 'base',
        name: 'canvasboard',
        split: 'train',
        scenarios: ['line', 'circle', 'trace', 'tool', 'connect', 'erase', 'multi'],
        render: renderCanvasboard,
        locate(t) {
          const p = cbView && cbView.locate(t);
          if (!p) throw new Error(`draw-shape/canvasboard cannot locate ${JSON.stringify(t)}`);
          return p;
        },
      });
    
    },
  }), { uses: ["draw-shape/_canvasboard"] });
})();
