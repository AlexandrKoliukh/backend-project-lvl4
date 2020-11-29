// @ts-check

import i18next from 'i18next';
import _ from 'lodash';
import TaskService from '../services/TaskService';
import UserService from '../services/UserService';
import TaskStatusService from '../services/TaskStatusService';
import LabelService from '../services/LabelService';
import { parseFilters } from '../lib/parseFilters';

const resource = '/tasks';

export default (app) => {
  const tasksService = new TaskService(app);
  const usersService = new UserService(app);
  const taskStatusesService = new TaskStatusService(app);
  const labelsService = new LabelService(app);
  app
    .get(
      resource,
      { name: 'tasks', preHandler: app.auth([app.verifySignedIn]) },
      async (req, reply) => {
        const filters = parseFilters(req.query);

        const tasks = await tasksService.getAll(filters);
        const users = await usersService.getAll();
        const taskStatuses = await taskStatusesService.getAll();
        const labels = await labelsService.getAll();

        reply.render('tasks/index', {
          tasks,
          users,
          taskStatuses,
          labels,
          filters,
        });
      }
    )
    .get(
      `${resource}/:id`,
      { name: 'tasks/info', preHandler: app.auth([app.verifySignedIn]) },
      async (req, reply) => {
        const taskId = _.toNumber(req.params.id);
        const task = await tasksService.getById(taskId);

        reply.render('tasks/info', { task });
      }
    )
    .get(
      `${resource}/:id/edit`,
      { name: 'tasks/edit', preHandler: app.auth([app.verifySignedIn]) },
      async (req, reply) => {
        const taskId = _.toNumber(req.params.id);
        const task = await tasksService.getById(taskId);
        const users = await usersService.getAll();
        const taskStatuses = await taskStatusesService.getAll();
        const labels = await labelsService.getAll();

        reply.render('tasks/edit', { task, users, taskStatuses, labels });
      }
    )
    .get(
      `${resource}/new`,
      { name: 'tasks/new', preHandler: app.auth([app.verifySignedIn]) },
      async (req, reply) => {
        const task = new app.objection.models.task();
        const users = await app.objection.models.user.query();
        const taskStatuses = await app.objection.models.taskStatus.query();
        const labels = await app.objection.models.label.query();

        reply.render('tasks/new', { task, users, taskStatuses, labels });
      }
    )
    .post(
      resource,
      { preHandler: app.auth([app.verifySignedIn]) },
      async (req, reply) => {
        const task = await app.objection.models.task.fromJson(req.body.task);
        try {
          await tasksService.insert(task);
          req.flash('info', i18next.t('flash.task.new.success'));
          reply.redirect(app.reverse('tasks'));
        } catch (err) {
          req.log.error(err);
          req.flash('error', i18next.t('flash.errors.common'));
          reply.redirect(app.reverse('tasks/new', { task, errors: err.data }));
        }
      }
    )
    .patch(
      `${resource}/:id`,
      { preHandler: app.auth([app.verifySignedIn]) },
      async (req, reply) => {
        const taskId = _.toNumber(req.params.id);

        try {
          const task = app.objection.models.task.fromJson(req.body.task);

          await tasksService.update(taskId, task);
          req.flash('info', i18next.t('flash.task.edit.success'));
        } catch ({ data }) {
          req.flash('error', i18next.t('flash.errors.common'));
          reply.redirect(app.reverse('tasks/info', { errors: data }));
        }

        reply.redirect(app.reverse('tasks'));
      }
    )
    .delete(
      `${resource}/:id`,
      { preHandler: app.auth([app.verifySignedIn]) },
      async (req, reply) => {
        const taskId = _.toNumber(req.params.id);
        const task = await tasksService.getById(taskId);

        if (task.creatorId !== req.session.get('userId')) {
          req.flash('error', i18next.t('flash.errors.403'));
        } else {
          await tasksService.delete(taskId);
          req.flash('info', i18next.t('flash.task.delete.success'));
        }

        reply.redirect(app.reverse('tasks'));
      }
    );
};
