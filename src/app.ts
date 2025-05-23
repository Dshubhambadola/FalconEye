import express from 'express';
import eventRoutes from './modules/event/interfaces/event.controller';

const app = express();

app.use(express.json());

app.get('/health', (_req, res) => {
  res.status(200).send('Fraud Detection API is running');
});

app.use('/api/events', eventRoutes);

export default app;