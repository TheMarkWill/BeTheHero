import { celebrate, Joi, Segments } from 'celebrate';
import { Application, Router } from 'express';
import path from 'path';
import swaggerUi from 'swagger-ui-express';

import IncidentController from './controllers/IncidentController';
import OngController from './controllers/OngController';
import ProfileController from './controllers/ProfileController';
import SessionController from './controllers/SessionController';
import swaggerFile from './docs/swagger.json';

export default (app: Application) => {
  const routes = Router();

  app.use(routes);

  routes.use(
    '/docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerFile, {
      customSiteTitle: 'BeTheHero Documentations',
      swaggerUrl: '/docs.json'
    })
  );

  routes.get('/docs.json', (req, res) => {
    return res.sendFile(path.resolve('src', 'docs', 'swagger.json'));
  });

  routes.post(
    '/session',
    celebrate({
      [Segments.BODY]: Joi.object().keys({
        id: Joi.string().required()
      })
    }),
    SessionController.create
  );

  routes.get(
    '/profile',
    celebrate({
      [Segments.HEADERS]: Joi.object({
        'x-api-key': Joi.string().required()
      }).unknown()
    }),
    ProfileController.index
  );

  routes.get('/ongs', OngController.index);
  routes.post(
    '/ongs',
    celebrate({
      [Segments.BODY]: Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().required().email(),
        whatsapp: Joi.string().required().min(10).max(11),
        city: Joi.string().required(),
        uf: Joi.string().required().length(2)
      })
    }),
    OngController.create
  );

  routes.get('/incidents', IncidentController.index);

  routes.post(
    '/incidents',
    celebrate({
      [Segments.HEADERS]: Joi.object({
        'x-api-key': Joi.string().required()
      }).unknown(),
      [Segments.BODY]: Joi.object().keys({
        title: Joi.string().required(),
        description: Joi.string().required(),
        value: Joi.number().required()
      })
    }),
    IncidentController.create
  );
  routes.delete(
    '/incidents/:id',
    celebrate({
      [Segments.HEADERS]: Joi.object({
        'x-api-key': Joi.string().required()
      }).unknown(),
      [Segments.PARAMS]: Joi.object().keys({
        id: Joi.number().required()
      })
    }),
    IncidentController.delete
  );
};
