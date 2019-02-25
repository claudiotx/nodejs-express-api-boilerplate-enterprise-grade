import { Request, Response, Router } from 'express';
import logService from '../services/log';
class IndexRoute {
  public router: Router;

  constructor(public applicationRoutes: string[]) {
    this.router = Router();
    this.init();
  }

  public init() {
    this.router.route('').get((request: Request, response: Response) => {
      const meta: any = [];
      const fullUrl = request.protocol + '://' + request.get('host');
      this.applicationRoutes.forEach((resource: string) => {
        logService.log(`debug`, `Setting route... ${resource}`);
        if (resource !== '/') {
          meta.push(
            {
              rel: resource.replace(/\//g, ''),
              href: fullUrl + resource
            }
          );
        }
      });
      response.json({links: meta});
    });
  }
}

export default IndexRoute;