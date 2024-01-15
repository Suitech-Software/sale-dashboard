import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { AnyZodObject } from 'zod';

const validate = (handler: NextApiHandler, schema: AnyZodObject) => {
  return (req: NextApiRequest, res: NextApiResponse) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
      });

      return handler(req, res);
    } catch (err: any) {
      return res.status(400).send(err.errors);
    }
  };
};

export default validate;
