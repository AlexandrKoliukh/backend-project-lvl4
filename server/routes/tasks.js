// @ts-check

import i18next from 'i18next';
import _ from 'lodash';
import TaskRepository from '../repositories/TaskRepository';
import UserRepository from '../repositories/UserRepository';
import TaskStatusRepository from '../repositories/TaskStatusRepository';
import LabelRepository from '../repositories/LabelRepository';
import { parseFilters } from '../lib/parseFilters';

const resource = '/tasks';

export default (app) => {
  const tasksRepository = new TaskRepository(app);
  const usersRepository = new UserRepository(app);
  const taskStatusesRepository = new TaskStatusRepository(app);
  const labelsRepository = new LabelRepository(app);
  app
    .get(
      resource,
      { name: 'tasks', preHandler: app.auth([app.verifySignedIn]) },
      async (req, reply) => {
        const filters = parseFilters(req.query);

        const tasks = await tasksRepository.getAll(filters);
        const users = await usersRepository.getAll();
        const taskStatuses = await taskStatusesRepository.getAll();
        const labels = await labelsRepository.getAll();

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
      { name: 'tasks/show', preHandler: app.auth([app.verifySignedIn]) },
      async (req, reply) => {
        const taskId = _.toNumber(req.params.id);
        const task = await tasksRepository.getById(taskId);

        reply.render('tasks/show', { task });
      }
    )
    .get(
      `${resource}/:id/edit`,
      { name: 'tasks/edit', preHandler: app.auth([app.verifySignedIn]) },
      async (req, reply) => {
        const taskId = _.toNumber(req.params.id);
        const task = await tasksRepository.getById(taskId);
        const users = await usersRepository.getAll();
        const taskStatuses = await taskStatusesRepository.getAll();
        const labels = await labelsRepository.getAll();

        reply.render('tasks/edit', { task, users, taskStatuses, labels });
      }
    )
    .get(
      `${resource}/new`,
      { name: 'tasks/new', preHandler: app.auth([app.verifySignedIn]) },
      async (req, reply) => {
        const task = new app.objection.models.task();
        const users = await usersRepository.getAll();
        const taskStatuses = await taskStatusesRepository.getAll();
        const labels = await labelsRepository.getAll();

        reply.render('tasks/new', { task, users, taskStatuses, labels });
      }
    )
    .post(
      resource,
      { name: 'tasks/create', preHandler: app.auth([app.verifySignedIn]) },
      async (req, reply) => {
        const task = await app.objection.models.task.fromJson(req.body.task);
        try {
          await tasksRepository.insert(task);
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
      { name: 'tasks/update', preHandler: app.auth([app.verifySignedIn]) },
      async (req, reply) => {
        const taskId = _.toNumber(req.params.id);

        try {
          const task = app.objection.models.task.fromJson(req.body.task);

          await tasksRepository.update(taskId, task);
          req.flash('info', i18next.t('flash.task.edit.success'));
        } catch ({ data }) {
          req.flash('error', i18next.t('flash.errors.common'));
          reply.redirect(app.reverse('tasks/show', { errors: data }));
        }

        reply.redirect(app.reverse('tasks'));
      }
    )
    .delete(
      `${resource}/:id`,
      { name: 'tasks/delete', preHandler: app.auth([app.verifySignedIn]) },
      async (req, reply) => {
        const taskId = _.toNumber(req.params.id);
        const task = await tasksRepository.getById(taskId);

        if (task.creatorId !== req.session.get('userId')) {
          req.flash('error', i18next.t('flash.errors.403'));
        } else {
          await tasksRepository.delete(taskId);
          req.flash('info', i18next.t('flash.task.delete.success'));
        }

        reply.redirect(app.reverse('tasks'));
      }
    );
};
