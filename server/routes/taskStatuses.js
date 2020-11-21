// @ts-check

import i18next from 'i18next';
import _ from 'lodash';

const resource = '/task-statuses';

export default (app) => {
  app
    .get(
      resource,
      { name: 'taskStatuses', preHandler: app.auth([app.verifySignedIn]) },
      async (req, reply) => {
        const taskStatuses = await app.objection.models.taskStatus.query();
        reply.render('taskStatuses/index', { taskStatuses });
        return reply;
      }
    )
    .get(
      `${resource}/:id`,
      { name: 'taskStatuses/edit', preHandler: app.auth([app.verifySignedIn]) },
      async (req, reply) => {
        const taskStatusId = _.toNumber(req.params.id);
        const taskStatus = await app.objection.models.taskStatus
          .query()
          .findById(taskStatusId);

        return reply.render('taskStatuses/edit', { taskStatus });
      }
    )
    .get(
      `${resource}/new`,
      { name: 'taskStatuses/new', preHandler: app.auth([app.verifySignedIn]) },
      async (req, reply) => {
        const taskStatus = new app.objection.models.taskStatus();
        reply.render('taskStatuses/new', { taskStatus });
      }
    )
    .post(
      resource,
      { preHandler: app.auth([app.verifySignedIn]) },
      async (req, reply) => {
        const taskStatus = await app.objection.models.taskStatus.fromJson(
          req.body.taskStatus
        );
        try {
          await app.objection.models.taskStatus.query().insert(taskStatus);
          req.flash('info', i18next.t('flash.taskStatus.new.success'));
          reply.redirect(app.reverse('taskStatuses'));
          return reply;
        } catch ({ data }) {
          req.flash('error', i18next.t('flash.errors.common'));
          reply.render('taskStatuses', { taskStatus, errors: data });
          return reply;
        }
      }
    )
    .patch(
      `${resource}/:id`,
      { preHandler: app.auth([app.verifySignedIn]) },
      async (req, reply) => {
        const taskStatusId = _.toNumber(req.params.id);

        try {
          const { taskStatus } = req.body;
          const oldTaskStatus = await app.objection.models.taskStatus
            .query()
            .findById(taskStatusId);
          await oldTaskStatus.$query().patchAndFetch(taskStatus);
          req.flash('info', i18next.t('flash.taskStatus.edit.success'));
        } catch (e) {
          req.flash('error', i18next.t('flash.errors.common'));
        }

        return reply.redirect(app.reverse('taskStatuses'));
      }
    )
    .delete(
      `${resource}/:id`,
      { preHandler: app.auth([app.verifySignedIn]) },
      async (req, reply) => {
        const taskStatusId = _.toNumber(req.params.id);
        await app.objection.models.taskStatus.query().deleteById(taskStatusId);
        req.flash('info', i18next.t('flash.taskStatus.delete.success'));

        return reply.redirect(app.reverse('taskStatuses'));
      }
    );
};
