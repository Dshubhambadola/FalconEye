import express from 'express';
import eventRoutes from './modules/event/interfaces/event.controller';
import ruleRoutes from './modules/rule/interfaces/rule.controller';
import alertRoutes from './modules/alert/interfaces/alert.controller';

const app = express();

app.use(express.json());

app.get('/health', (_req, res) => {
  res.status(200).send('Fraud Detection API is running');
});

app.use('/api/events', eventRoutes);
app.use('/api/rules', ruleRoutes);
app.use('/api/alerts', alertRoutes);

export default app;