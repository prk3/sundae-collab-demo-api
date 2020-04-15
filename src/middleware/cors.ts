import { Request, Response, NextFunction } from 'express';

/**
 * Accept request coming from origins passed as a parameter.
 */
export default function cors(origin: string) {
  return function corsInternal(req: Request, res: Response, next: NextFunction) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  };
}
