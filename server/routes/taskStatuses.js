// @ts-check

import i18next from 'i18next';
import _ from 'lodash';
import TaskStatusRepository from '../repositories/TaskStatusRepository';

const resource = '/task-statuses';

export default (app) => {
  const taskStatusRepository = new TaskStatusRepository(app);
  app
    .get(
      resource,
      { name: 'taskStatuses', preHandler: app.auth([app.verifySignedIn]) },
      async (req, reply) => {
        const taskStatuses = await taskStatusRepository.getAll();
        reply.render('taskStatuses/index', { taskStatuses });
      }
    )
    .get(
      `${resource}/:id/edit`,
      { name: 'taskStatuses/edit', preHandler: app.auth([app.verifySignedIn]) },
      async (req, reply) => {
        const taskStatusId = _.toNumber(req.params.id);
        const taskStatus = await taskStatusRepository.getById(taskStatusId);

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
      {
        name: 'taskStatuses/create',
        preHandler: app.auth([app.verifySignedIn]),
      },
      async (req, reply) => {
        try {
          await taskStatusRepository.insert(req.body.taskStatus);
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
      {
        name: 'taskStatuses/update',
        preHandler: app.auth([app.verifySignedIn]),
      },
      async (req, reply) => {
        const taskStatusId = _.toNumber(req.params.id);
        const { taskStatus } = req.body;

        try {
          await taskStatusRepository.update(taskStatusId, taskStatus);
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
      {
        name: 'taskStatuses/delete',
        preHandler: app.auth([app.verifySignedIn]),
      },
      async (req, reply) => {
        try {
          const taskStatusId = _.toNumber(req.params.id);
          await taskStatusRepository.delete(taskStatusId);
          req.flash('info', i18next.t('flash.taskStatus.delete.success'));
        } catch (e) {
          reply.log.error(e);
          req.flash('error', i18next.t('flash.errors.common'));
        }

        reply.redirect(app.reverse('taskStatuses'));
      }
    );
};
