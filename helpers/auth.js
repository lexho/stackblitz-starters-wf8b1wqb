import passport from 'passport';
import expressSession from 'express-session';
import LocalStrategy from 'passport-local';
import { login, logout } from '../config.js';

export default function (app) {
  passport.serializeUser((user, done) => done(null, user.username));
  passport.deserializeUser((id, done) => {
    const user = {
      username: 'testuser',
      firstname: 'Test',
      lastname: 'User',
    };
    done(null, user);
  });

  passport.use(
    new LocalStrategy((username, password, done) => {
      if (username === 'testuser' && password === 'test') {
        done(null, {
          username: 'testuser',
          firstname: 'Test',
          lastname: 'User',
        });
      } else {
        done(null, false);
      }
    }),
  );

  app.use(
    expressSession({
      secret: 'top secret',
      resave: false,
      saveUninitialized: false,
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());

  app.post(
    '/login',
    passport.authenticate('local', { failureRedirect: '/login.html' }),
    (request, response) => {
      login(); 
      response.redirect('/');
    },
  );

  app.get('/logout', (request, response) => {
    logout();
    request.logout(()=>{});
    response.redirect('/');
  })
}
