export * from './workers';

import { ServerCommunicationService } from './service';

const serverCommunicationSvc = new ServerCommunicationService();

export default serverCommunicationSvc;
