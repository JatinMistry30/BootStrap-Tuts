import express from 'express';
import cors from 'cors';
import routes from './routes/routes.js'
const app = express();

app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true,              
}));

app.use(express.json());

app.use('/api', routes)

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
