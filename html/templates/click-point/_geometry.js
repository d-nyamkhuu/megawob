/* click-point/_geometry: SVG arc construction shared by the board and base templates.
 * arcPath(at, f1, c, r, a0, a1) uses the caller's overridable projection/formatting helpers. */
(function () {
  'use strict';
  function arcPath(at, f1, c, r, a0, a1) {
    const p0 = at(c, a0, r);
    const p1 = at(c, a1, r);
    const large = a1 - a0 > Math.PI ? 1 : 0;
    return `M ${f1(p0[0])} ${f1(p0[1])} A ${f1(r)} ${f1(r)} 0 ${large} 1 ${f1(p1[0])} ${f1(p1[1])}`;
  }
  env.template('click-point/_geometry', () => ({ arcPath }));
})();
