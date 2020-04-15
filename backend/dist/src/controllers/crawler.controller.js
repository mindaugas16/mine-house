"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const python_shell_1 = require("python-shell");
exports.default = {
    run: (req, res, next) => {
        let options = {
            mode: 'text',
            pythonPath: '/Users/mindaugas/Desktop/real-estate-parser/crawler/venv/bin/python',
            pythonOptions: ['-u'],
        };
        python_shell_1.PythonShell.run('/Users/mindaugas/Desktop/real-estate-parser/crawler/App.py', options, (err, results) => {
            if (err) {
                res.status(400).json(err);
                throw err;
            }
            res.status(204).send();
        });
    },
};
