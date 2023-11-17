import 'dotenv/config';
import './serverCommunicationSvc/workers';
import { startCronJob } from './crons';

startCronJob();
