import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import organizationRoutes from './routes/organizationRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/organizations', organizationRoutes);

app.get('/', (req, res) => {
  res.send('UpNext is running');
});

export default app;
