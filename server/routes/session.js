// @ts-check

import i18next from 'i18next';

export default (app) => {
  app
    .get('/session/new', { name: 'newSession' }, (req, reply) => {
      const signInForm = new app.objection.models.user();
      reply.render('session/new', { signInForm });
    })
    .post('/session', { name: 'session' }, async (req, reply) => {
      const signInForm = await app.objection.models.user.fromJson(
        req.body.user
      );
      const user = await app.objection.models.user
        .query()
        .findOne({ email: signInForm.email });

      if (!user || user.passwordDigest !== signInForm.passwordDigest) {
        req.flash('error', i18next.t('flash.session.create.error'));
        reply.render('session/new', { signInForm });
        return reply;
      }

      req.session.set('userId', user.id);
      req.session.set('email', signInForm.email);
      req.flash('info', i18next.t('flash.session.create.success'));
      reply.redirect(app.reverse('root'));
      return reply;
    })
    .delete('/session', (req, reply) => {
      req.session.set('userId', null);
      req.flash('info', i18next.t('flash.session.delete.success'));
      reply.redirect(app.reverse('root'));
    });
};
