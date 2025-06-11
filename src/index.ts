import { Router } from 'express';
import express from 'express';
import cors from 'cors';
import mainRouter from './routes/index';
import bodyParser from 'body-parser';

const app = express();
const PORT = 3000;
const router = Router();

const corsOption = { 
  // origin: [], 
  credentials: true,
  allowedHeaders: ["Authorization", "Content-Type"] 
}

app.use(express.json());
app.use(cors(corsOption));
app.use('/api', mainRouter);
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.send('Welcome to your backend API!');
});


app.listen(PORT, (error) =>{
    if (error) {
    console.error("Error occurred, server can't start:", error);
    } else {
      console.log(`Server is Successfully Running, and App is listening on port ${PORT}`);
    }
  }
);


export default router; 
