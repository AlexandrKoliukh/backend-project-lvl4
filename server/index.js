// @ts-check

import path from 'path';
import fastify from 'fastify';
import fastifyStatic from 'fastify-static';
import fastifyErrorPage from 'fastify-error-page';
import pointOfView from 'point-of-view';
import fastifyFormbody from 'fastify-formbody';
import fastifySecureSession from 'fastify-secure-session';
import fastifyFlash from 'fastify-flash';
import fastifyReverseRoutes from 'fastify-reverse-routes';
import fastifyMethodOverride from 'fastify-method-override';
import fastifyObjectionjs from 'fastify-objectionjs';
import fastifyAuth from 'fastify-auth';
import Pug from 'pug';
import i18next from 'i18next';
import Rollbar from 'rollbar';
import _ from 'lodash';
import ru from './locales/ru.js';
import webpackConfig from '../webpack.config.babel.js';

import addRoutes from './routes/index.js';
import getHelpers from './helpers/index.js';
import knexConfig from '../knexfile.js';
import models from './models/index.js';

const mode = process.env.NODE_ENV || 'development';
const isProduction = mode === 'production';
const isDevelopment = mode === 'development';

const setupViews = (app) => {
  const { devServer } = webpackConfig;
  const devHost = `http://${devServer.host}:${devServer.port}`;
  const domain = isDevelopment ? devHost : '';
  const helpers = getHelpers(app);
  app.register(pointOfView, {
    engine: {
      pug: Pug,
    },
    includeViewExtension: true,
    defaultContext: {
      ...helpers,
      assetPath: (filename) => `${domain}/assets/${filename}`,
    },
    templates: path.join(__dirname, '..', 'server', 'views'),
  });

  app.decorateReply('render', function render(viewPath, locals) {
    this.view(viewPath, { ...locals, reply: this });
  });
};

const setupStaticAssets = (app) => {
  const pathPublic = isProduction
    ? path.join(__dirname, '..', 'public')
    : path.join(__dirname, '..', 'dist', 'public');
  app.register(fastifyStatic, {
    root: pathPublic,
    prefix: '/assets/',
  });
};

const setupLocalization = () => {
  i18next.init({
    lng: 'ru',
    fallbackLng: 'en',
    debug: false,
    resources: {
      ru,
    },
  });
};

const setupRollbar = (app) => {
  const rollbar = new Rollbar({
    accessToken: process.env.ROLLBAR_TOKEN,
    captureUncaught: true,
    captureUnhandledRejections: true,
  });

  app.setErrorHandler((error, request, reply) => {
    rollbar.error(`Error: ${error}`, request, reply);
  });
};

const setupAuth = (app) => {
  app
    .decorate('verifySignedIn', (req, reply, done) => {
      if (reply.request.signedIn) {
        return done();
      }
      req.flash('error', i18next.t('flash.errors.401'));
      reply.redirect(app.reverse('root'));
      return done();
    })
    .decorate('verifySession', (req, reply, done) => {
      const paramsUserId = _.toNumber(req.params.id);
      const sessionUserId = _.toNumber(reply.request.session.get('userId'));

      if (paramsUserId === sessionUserId) {
        return done();
      }
      req.flash('error', i18next.t('flash.errors.403'));
      reply.redirect(app.reverse('root'));
      return done();
    })
    .register(fastifyAuth);
};

const addHooks = (app) => {
  app.decorateRequest('currentUser', null);
  app.decorateRequest('signedIn', false);

  app.addHook('preHandler', async (req) => {
    const userId = req.session.get('userId');
    if (userId) {
      req.currentUser = await app.objection.models.user
        .query()
        .findById(userId);
      req.signedIn = true;
    }
  });
};

const registerPlugins = (app) => {
  app.register(fastifyErrorPage);
  app.register(fastifyReverseRoutes);
  app.register(fastifyFormbody);
  app.register(fastifySecureSession, {
    secret:
      process.env.SECRET || 'a secret with minimum length of 32 characters',
    cookie: {
      path: '/',
    },
  });
  app.register(fastifyFlash);
  app.register(fastifyMethodOverride);
  app.register(fastifyObjectionjs, {
    knexConfig: knexConfig[mode],
    models: _.values(models),
  });
};

export default () => {
  const app = fastify({
    logger: {
      prettyPrint: isDevelopment,
    },
  });

  registerPlugins(app);

  setupAuth(app);
  setupLocalization(app);
  setupViews(app);
  setupStaticAssets(app);
  setupRollbar(app);

  addHooks(app);

  app.after(() => addRoutes(app));

  return app;
};
