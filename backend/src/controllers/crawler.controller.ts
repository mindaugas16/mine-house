import { NextFunction, Request, Response } from 'express';
import { PythonShell } from 'python-shell';

export default {
  run: (req: Request, res: Response, next: NextFunction) => {
    let options = {
      mode: 'text',
      pythonPath: '/Users/mindaugas/Desktop/real-estate-parser/crawler/venv/bin/python',
      pythonOptions: ['-u'],
    };

    PythonShell.run('/Users/mindaugas/Desktop/real-estate-parser/crawler/App.py', options as any, (err: any, results: any) => {
      if (err) {
        res.status(400).json(err);
        throw err;
      }
      res.status(204).send();
    });
  },
};
