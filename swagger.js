
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'UpNext API',
      version: '1.0.0',
      description: 'API untuk Event',
    },
    servers: [
      {
        url: 'http://localhost:5000',
      },
    ],
  },
  apis: [path.join(__dirname, './controllers/*.js')],
};

const swaggerSpec = swaggerJSDoc(options);

export { swaggerSpec, swaggerUi };
