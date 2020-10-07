// @ts-check

import i18next from 'i18next';
import _ from 'lodash';

export default (app) => {
  app
    .get('/users', { name: 'users' }, async (req, reply) => {
      const users = await app.objection.models.user.query();
      reply.render('users/index', { users });
      return reply;
    })
    .get('/users/new', { name: 'newUser' }, (req, reply) => {
      const user = {};
      reply.render('users/new', { user });
    })
    .post('/users', async (req, reply) => {
      try {
        const user = await app.objection.models.user.fromJson(req.body.object);
        await app.objection.models.user.query().insert(user);
        req.flash('info', i18next.t('flash.users.create.success'));
        reply.redirect(app.reverse('root'));
        return reply;
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.users.create.error'));
        reply.render('users/new', { user: req.body.object, errors: data });
        return reply;
      }
    })
    .get('/users/:id', { name: 'editUser' }, async (req, reply) => {
      const paramsUserId = _.toNumber(req.params.id);
      const sessionUserId = _.toNumber(reply.request.session.get('userId'));

      if (paramsUserId !== sessionUserId) {
        console.log(paramsUserId, sessionUserId);
      }

      const user = await app.objection.models.user
        .query()
        .where('id', '=', sessionUserId);

      console.log(user);

      const keys = _.keys(user).filter(
        (key) => !['passwordDigest'].includes(key)
      );

      return reply.render('users/edit', { user, keys });
    });
};
