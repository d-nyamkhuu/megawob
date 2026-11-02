/* use-spreadsheet/selftest.js: the task's self-test (kit/selftest.js harness; loaded only by the checker and node tests). */
(function () {
  'use strict';
  env.selfTest('use-spreadsheet', (T) => {
    const { addr, evaluate, translate } = T.helpers;
    const cells = [['Label', 2], [3, 4], ['=SUM(B1:B2)', '=AVERAGE(A2:B2)'], ['=MAX(B1:B2)+MIN(B1:B2)*2', '=COUNT(A1:B2)'], ['=A5', '=1/0']];
    for (const [p, v] of [[[2, 0], 6], [[2, 1], 3.5], [[3, 0], 8], [[3, 1], 3], [[4, 0], '#CYCLE!'], [[4, 1], '#DIV/0!']]) T.check(evaluate(cells, p) === v, `evaluate ${addr(p)} expected ${v}`);
    T.check(translate('=$C2+D$3', 2, 1) === '=$C4+E$3', 'relative formula fill');
  });
})();
