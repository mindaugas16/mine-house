import request from 'request';
import fs from 'fs';

export function download(uri: string, filePath: string, callback: any) {
  request.head(uri, (err, res, body) => {
    const writeStream = fs.createWriteStream(`${__dirname}/../assets/${filePath}`);
    request(uri).pipe(writeStream).on('close', callback);
  });
}
