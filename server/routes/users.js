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
      const user = new app.objection.models.user();
      reply.render('users/new', { user });
    })
    .post('/users', async (req, reply) => {
      const user = await app.objection.models.user.fromJson(req.body.user);
      try {
        await app.objection.models.user.query().insert(user);
        req.flash('info', i18next.t('flash.user.create.success'));
        reply.redirect(app.reverse('root'));
        return reply;
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.user.create.error'));
        reply.render('users/new', { user, errors: data });
        return reply;
      }
    })
    .get(
      '/users/:id',
      { name: 'userProfile', preHandler: app.auth([app.verifySession]) },
      async (req, reply) => {
        const userId = _.toNumber(req.params.id);

        const user = await app.objection.models.user.query().findById(userId);
        const keys = ['firstName', 'lastName', 'email'];

        return reply.render('users/edit', { user, keys });
      }
    )
    .patch('/users/:id', async (req, reply) => {
      const userId = _.toNumber(req.params.id);

      try {
        const { password, user: newUserData } = req.body;
        const oldUser = await app.objection.models.user
          .query()
          .findById(userId);
        const patchObject = _.keys(newUserData).reduce((acc, i) => {
          if (newUserData[i] === oldUser[i]) return acc;
          return { ...acc, [i]: newUserData[i] };
        }, {});

        if (password) {
          patchObject.password = password;
        }

        const updatedUser = await oldUser.$query().patchAndFetch(patchObject);
        req.session.set('email', updatedUser.email);
        req.flash('info', i18next.t('flash.user.update.success'));
      } catch (e) {
        req.flash('error', i18next.t('flash.user.update.error'));
      }

      reply.redirect(app.reverse('userProfile', { id: userId }));
    })
    .delete('/users/:id', async (req, reply) => {
      try {
        const paramsUserId = _.toNumber(req.params.id);
        await app.objection.models.user.query().deleteById(paramsUserId);
        req.session.delete();
        req.flash('info', i18next.t('flash.user.delete.success'));
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.user.delete.error'));
      }
      return reply.redirect(app.reverse('root'));
    });
};
