// @ts-check

import i18next from 'i18next';
import _ from 'lodash';
import LabelService from '../services/LabelService';

const resource = '/labels';

export default (app) => {
  const labelService = new LabelService(app);
  app
    .get(
      resource,
      { name: 'labels', preHandler: app.auth([app.verifySignedIn]) },
      async (req, reply) => {
        const labels = await labelService.getAll();
        reply.render('labels/index', { labels });
      }
    )
    .get(
      `${resource}/:id`,
      { name: 'labels/edit', preHandler: app.auth([app.verifySignedIn]) },
      async (req, reply) => {
        const labelId = _.toNumber(req.params.id);
        const label = await labelService.getById(labelId);

        reply.render('labels/edit', { label });
      }
    )
    .get(
      `${resource}/new`,
      { name: 'labels/new', preHandler: app.auth([app.verifySignedIn]) },
      async (req, reply) => {
        const label = new app.objection.models.label();

        reply.render('labels/new', { label });
      }
    )
    .post(
      resource,
      { preHandler: app.auth([app.verifySignedIn]) },
      async (req, reply) => {
        const label = await app.objection.models.label.fromJson(req.body.label);
        try {
          await labelService.insert(req.body.label);
          req.flash('info', i18next.t('flash.label.new.success'));
          reply.redirect(app.reverse('labels'));
        } catch (e) {
          reply.log.error(e);
          req.flash('error', i18next.t('flash.errors.common'));
          reply.render('labels/new', { label, errors: e.data });
        }
      }
    )
    .patch(
      `${resource}/:id`,
      { preHandler: app.auth([app.verifySignedIn]) },
      async (req, reply) => {
        const labelId = _.toNumber(req.params.id);
        const { label } = req.body;

        try {
          await labelService.update(labelId, label);
          req.flash('info', i18next.t('flash.label.edit.success'));
        } catch (e) {
          reply.log.error(e);
          req.flash('error', i18next.t('flash.errors.common'));
          reply.render('labels/edit', { label, errors: e.data });
        }

        reply.redirect(app.reverse('labels'));
      }
    )
    .delete(
      `${resource}/:id`,
      { preHandler: app.auth([app.verifySignedIn]) },
      async (req, reply) => {
        const labelId = _.toNumber(req.params.id);
        try {
          await labelService.delete(labelId);
          req.flash('info', i18next.t('flash.label.delete.success'));
        } catch (e) {
          reply.log.error(e);
          req.flash('error', i18next.t('flash.errors.common'));
        }

        reply.redirect(app.reverse('labels'));
      }
    );
};
