/* type-text/scenarios/password.js: password scenario sampling. */
(function () {
  'use strict';

  const { password, plainField } = env.taskOf('type-text').lib;

  env.scenario('type-text', {
    name: 'password',
    sample(g, spec) {
      const pw = password(g.rng, g.ood, g.level);
      spec.given = pw;
      spec.title = g.rng.pick([
        'Create a password', 'Change password', 'Set your password', 'Account security', 'Reset password',
        'Password setup', 'Enter and confirm', 'Choose and repeat', 'Protect account', 'Password details'
      ]);
      spec.fields = [
        plainField('password', g.rng.pick(['Password', 'New password', 'Choose a password', 'Password to use']),
          g.rng.pick([
            'At least 8 characters', 'Password', '', 'Type here', 'As shown', 'Use the text'
          ]), pw, 'password'),
        plainField('confirm', g.rng.pick(['Confirm password', 'Repeat password', 'Re-enter password']),
          g.rng.pick(['Type it again', 'Confirm', '', 'Repeat', 'Same text', 'Match']), pw, 'password'),
      ];
      spec.route = g.rng.bool(0.3) ? 'tab' : 'click';
    },
  });
})();
