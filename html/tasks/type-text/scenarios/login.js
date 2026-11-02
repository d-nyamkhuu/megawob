/* type-text/scenarios/login.js: login scenario sampling. */
(function () {
  'use strict';

  const { email, username, password, plainField } = env.taskOf('type-text').lib;

  env.scenario('type-text', {
    name: 'login',
    sample(g, spec) {
      const byEmail = g.rng.bool(0.3);
      const user = byEmail ? email(g, g.person) : username(g, g.person);
      const pw = password(g.rng, g.ood, g.level);
      spec.given = user;
      spec.password = pw;
      spec.title = g.rng.pick([
        'Sign in', 'Member login', 'Log in to your account', 'Welcome back', 'Account access', 'Your account',
        'Identify yourself', 'Member area', 'Hello again'
      ]);
      spec.fields = [
        plainField('username', byEmail ? g.rng.pick([
          'Email', 'Email address', 'Email ID', 'Your email'
        ]) : g.rng.pick(['Username', 'User name', 'User ID']),
          byEmail ? g.rng.pick([
            'you@example.com', '', 'Email'
          ]) : g.rng.pick(['Enter your username', 'username', '']), user),
        plainField('password', 'Password', g.rng.pick([
          'Enter your password', 'Password', '', 'Account password', 'PW'
        ]), pw, 'password'),
      ];
      spec.save = true;
      spec.saveLabel = g.rng.pick(['Sign in', 'Log in', 'Sign in', 'Continue', 'Login', 'Access']);
      spec.route = g.rng.bool(0.3) ? 'tab' : 'click';
      spec.enter = g.rng.bool(0.5);
    },
  });
})();
