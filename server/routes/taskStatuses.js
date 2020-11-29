// @ts-check

import i18next from 'i18next';
import _ from 'lodash';
import TaskStatusService from '../services/TaskStatusService';

const resource = '/task-statuses';

export default (app) => {
  const taskStatusService = new TaskStatusService(app);
  app
    .get(
      resource,
      { name: 'taskStatuses', preHandler: app.auth([app.verifySignedIn]) },
      async (req, reply) => {
        const taskStatuses = await taskStatusService.getAll();
        reply.render('taskStatuses/index', { taskStatuses });
      }
    )
    .get(
      `${resource}/:id/edit`,
      { name: 'taskStatuses/edit', preHandler: app.auth([app.verifySignedIn]) },
      async (req, reply) => {
        const taskStatusId = _.toNumber(req.params.id);
        const taskStatus = await taskStatusService.getById(taskStatusId);

        reply.render('taskStatuses/edit', { taskStatus });
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
        try {
          await taskStatusService.insert(req.body.taskStatus);
          req.flash('info', i18next.t('flash.taskStatus.new.success'));
          reply.redirect(app.reverse('taskStatuses'));
        } catch (e) {
          const taskStatus = await app.objection.models.taskStatus.fromJson(
            req.body.taskStatus
          );
          reply.log.error(e);
          req.flash('error', i18next.t('flash.errors.common'));
          reply.render('taskStatuses/new', { taskStatus, errors: e.data });
        }
      }
    )
    .patch(
      `${resource}/:id`,
      { preHandler: app.auth([app.verifySignedIn]) },
      async (req, reply) => {
        const taskStatusId = _.toNumber(req.params.id);
        const { taskStatus } = req.body;

        try {
          await taskStatusService.update(taskStatusId, taskStatus);
          req.flash('info', i18next.t('flash.taskStatus.edit.success'));
          reply.redirect(app.reverse('taskStatuses'));
        } catch (e) {
          reply.log.error(e);
          req.flash('error', i18next.t('flash.errors.common'));
          reply.render('taskStatuses/edit', { taskStatus, errors: e.data });
        }

        reply.redirect(app.reverse('taskStatuses'));
      }
    )
    .delete(
      `${resource}/:id`,
      { preHandler: app.auth([app.verifySignedIn]) },
      async (req, reply) => {
        try {
          const taskStatusId = _.toNumber(req.params.id);
          await taskStatusService.delete(taskStatusId);
          req.flash('info', i18next.t('flash.taskStatus.delete.success'));
        } catch (e) {
          reply.log.error(e);
          req.flash('error', i18next.t('flash.errors.common'));
        }

        reply.redirect(app.reverse('taskStatuses'));
      }
    );
};
