import fs from 'fs';
import fetch from 'node-fetch';
import * as util from 'util';
import * as stream from 'stream';
import path from 'path';

const pipeline = util.promisify(stream.pipeline);

export async function download(uri: string, filePath: string) {
  try {
    const response = await fetch(uri);
    await pipeline(response.body, fs.createWriteStream(path.join(__dirname, `../../public/assets/${filePath}`)));
  } catch (err) {
    console.error(err);
  }
}
