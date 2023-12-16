import 'dotenv/config';
import app from './app';
import mongoose from 'mongoose';
import { createServer } from 'http'
import { Server } from 'socket.io';
import { SocketController } from './controllers';
const PORT = process.env.PORT ?? 3000;

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  }
});

io.on('connection', SocketController.connection)

const connection = async (): Promise<void> => {
  try {
    console.log('Connecting to MongoDB...');
    const conn = await mongoose.connect(process.env.MONGODB_URI as string);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

// Connect to the database before listening
connection().then(() => {
  httpServer.listen(PORT, () => {
    console.log('listening for requests');
  });
});