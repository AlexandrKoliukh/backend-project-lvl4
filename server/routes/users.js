// @ts-check

import i18next from 'i18next';
import _ from 'lodash';
import UserService from '../services/UserService';

export default (app) => {
  const userService = new UserService(app);
  app
    .get('/users', { name: 'users' }, async (req, reply) => {
      const users = await userService.getAll();

      reply.render('users/index', { users });
    })
    .get(
      '/users/:id',
      { name: 'userProfile', preHandler: app.auth([app.verifySession]) },
      async (req, reply) => {
        const userId = _.toNumber(req.params.id);

        const user = await userService.getById(userId);
        const keys = ['firstName', 'lastName', 'email'];

        reply.render('users/edit', { user, keys });
      }
    )
    .get('/users/new', { name: 'newUser' }, (req, reply) => {
      const user = new app.objection.models.user();
      reply.render('users/new', { user });
    })
    .post('/users', async (req, reply) => {
      const user = await app.objection.models.user.fromJson(req.body.user);
      try {
        await userService.insert(req.body.user);
        req.flash('info', i18next.t('flash.user.create.success'));
        reply.redirect(app.reverse('root'));
      } catch (e) {
        reply.log.error(e);
        req.flash('error', i18next.t('flash.user.create.error'));
        reply.render('users/new', { user, errors: e.data });
      }
    })
    .patch('/users/:id', async (req, reply) => {
      const userId = _.toNumber(req.params.id);

      try {
        const { password, user: newUserData } = req.body;
        const oldUser = await userService.getById(userId);
        const patchObject = _.keys(newUserData).reduce((acc, i) => {
          if (newUserData[i] === oldUser[i]) return acc;
          return { ...acc, [i]: newUserData[i] };
        }, {});

        if (password) {
          patchObject.password = password;
        }
        const updatedUser = await userService.update(userId, patchObject);
        req.session.set('email', updatedUser.email);
        req.flash('info', i18next.t('flash.user.update.success'));
      } catch (e) {
        reply.log.error(e);
        req.flash('error', i18next.t('flash.user.update.error'));
      }

      reply.redirect(app.reverse('userProfile', { id: userId }));
    })
    .delete('/users/:id', async (req, reply) => {
      try {
        const paramsUserId = _.toNumber(req.params.id);
        await userService.delete(paramsUserId);
        req.session.delete();
        req.flash('info', i18next.t('flash.user.delete.success'));
      } catch (e) {
        reply.log.error(e);
        req.flash('error', i18next.t('flash.user.delete.error'));
      }

      reply.redirect(app.reverse('root'));
    });
};
