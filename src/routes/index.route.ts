import { Request, Response, Router } from 'express';
import logService from '../services/log-service';
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
      this.applicationRoutes.forEach((resourse: string) => {
        // logService.log(`Setting route... ${resourse}`);
        if (resourse !== '/') {
          meta.push(
            {
              rel: resourse.replace(/\//g, ''),
              href: fullUrl + resourse
            }
          );
        }
      });
      response.json({links: meta});
    });
  }
}

export default IndexRoute;