import cors from 'cors';
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

import { signupRouter } from './routes/signup.js';

const viteDevPort = process.env.VITE_DEV_PORT || 5173;

export const viteProxy = createProxyMiddleware({
  target: `http://localhost:${viteDevPort}`,
  changeOrigin: true,
  ws: true,
});

export const app = express();

app.set('port', process.env.PORT || 3000);

app.use('/api', cors());
app.use(express.json());

app.get('/api/hello', (_req, res) => {
  res.json({ message: 'Hello from Something Better Australia' });
});

app.get('/api/liveness', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/signup', signupRouter);

app.use(viteProxy);
