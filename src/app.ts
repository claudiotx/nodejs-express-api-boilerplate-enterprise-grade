import * as dotenv from 'dotenv';

import Server from './classes/server';
import IndexRoute from './routes/index.route';
import LivenessProbeRoute from './routes/liveness-probe.route';
import ApiRoute from './routes/api.route';

if (!process.env.NODE_ENV) {
  dotenv.config({ path: './env/.env.development' });
} else if (process.env.NODE_ENV === 'staging') {
  dotenv.config({ path: './env/.env.staging' });
} else if (process.env.NODE_ENV === 'production') {
  dotenv.config({ path: './env/.env.production' });
} else {
  dotenv.config({ path: './env/.env.development' });
}

// App Initialization
const app = new Server(process.env.PORT || 8080);

// Routes
const apiRoute = new ApiRoute(app);
const livenessProbeRoute = new LivenessProbeRoute(app);
const index = new IndexRoute(app.getRoutes());
app.addRoute('/', index.router);
app.addErrorHandler();


// EntryPoint
app.start();


