// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.stage': (base, S) =>
      function (_c) {
        const { body, util } = _c;
        const stage = util.el('main', 'ref-stage', body);
        S.frameAlign(_c, stage);
        const inspector = util.el('aside', 'slides-inspector', body);
        inspector.innerHTML =
          '<h2>Slide <span>⌃</span></h2><section><h3>Layout</h3><button class="inspector-select"><i>▣</i> Title and Content <b>⌄</b></button></section><section><h3>Background</h3><button class="inspector-select"><i class="swatch"></i> Solid fill <b>⌄</b></button><div class="inspector-color"><i></i><span>#FFFFFF</span></div></section><section><h3>Appearance</h3><p><i class="checked">✓</i> Title</p><p><i class="checked">✓</i> Body</p><p><i></i> Slide number</p></section><section><h3>Format</h3><label>Slide size</label><button class="inspector-select">Widescreen (16:9)<b>⌄</b></button><label>Theme</label><button class="inspector-select">Modern<b>⌄</b></button><div class="swatches"><i></i><i></i><i></i><i></i></div></section>';
        Object.assign(_c, { inspector, stage });
      },
  };

  env.site({
    name: 'design-use-slides-comments-03',
    template: 'site/base',
    design: { parts },
  });
})();
