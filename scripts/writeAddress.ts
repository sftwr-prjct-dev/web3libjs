import * as fs from 'fs';

const writeAddress = (filename: number, json: string) => {
  fs.writeFileSync(`assets/${filename}.json`, json, {
    flag: 'w',
    encoding: 'utf8',
  });
};

export default writeAddress;
