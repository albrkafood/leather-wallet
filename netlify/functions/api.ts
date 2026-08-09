import express from 'express';
import serverless from 'serverless-http';
import { apiRouter } from '../../src/server/apiRouter';

const app = express();
app.use(express.json());

// Mount API router under both /api and root path (so netlify function rewrites work seamlessly)
app.use('/.netlify/functions/api', apiRouter);
app.use('/api', apiRouter);
app.use('/', apiRouter);

export const handler = serverless(app);
