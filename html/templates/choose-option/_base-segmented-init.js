/* choose-option/_base-segmented-init: initialize reference units in their original order.
 * Every original unit keeps its design.parts hook and live scope entry.
 */
(function () {
  'use strict';
  function initialize(scopeRef, set, __has, __parts) {
    set('CSS2', __has('CSS2') ? __parts['CSS2'](undefined, scopeRef) : (scopeRef.env.templateLib('choose-option/_styles').CSS2));

    set('set2', __has('set2') ? __parts['set2'](undefined, scopeRef) : { set2: (patch) => scopeRef.st2.ctx.update({ ...scopeRef.st2.ctx.model, ...patch }) }.set2);

  }
  env.template('choose-option/_base-segmented-init', () => ({ initialize }));
})();
