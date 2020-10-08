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
      try {
        const user = await app.objection.models.user.fromJson(req.body.user);
        await app.objection.models.user.query().insert(user);
        req.flash('info', i18next.t('flash.user.create.success'));
        reply.redirect(app.reverse('root'));
        return reply;
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.user.create.error'));
        reply.render('users/new', { user: req.body.object, errors: data });
        return reply;
      }
    })
    .get('/users/:id', { name: 'userProfile' }, async (req, reply) => {
      const paramsUserId = _.toNumber(req.params.id);
      const sessionUserId = _.toNumber(reply.request.session.get('userId'));

      if (paramsUserId !== sessionUserId) {
        req.flash('error', i18next.t('flash.errors.403'));
        return reply.redirect(app.reverse('root'));
      }

      const user = await app.objection.models.user
        .query()
        .findById(sessionUserId);
      const keys = ['firstName', 'lastName', 'email'];

      return reply.render('users/edit', { user, keys });
    })
    .patch('/users/:id', async (req, reply) => {
      const paramsUserId = _.toNumber(req.params.id);
      const sessionUserId = _.toNumber(reply.request.session.get('userId'));

      if (paramsUserId !== sessionUserId) {
        req.flash('error', i18next.t('flash.errors.403'));
        return reply.redirect(app.reverse('root'));
      }
      console.log(req.body.user);

      try {
        const newUserData = req.body.user;
        console.log(newUserData);

        const oldUser = await app.objection.models.user
          .query()
          .findById(sessionUserId);
        const patchObject = _.keys(newUserData).reduce((acc, i) => {
          if (newUserData[i] === oldUser[i]) return acc;
          return { ...acc, [i]: newUserData[i] };
        }, {});
        console.log(patchObject);

        const updatedUser = await app.objection.models.user
          .query()
          .findById(sessionUserId)
          .patch(patchObject)
          .returning('*');

        console.log(updatedUser);

        req.session.set('email', updatedUser.email);
        req.flash('info', i18next.t('flash.user.update.success'));
      } catch (e) {
        console.log(e);
        req.flash('error', i18next.t('flash.user.update.error'));
      }
      return reply.redirect(app.reverse('root'));
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
