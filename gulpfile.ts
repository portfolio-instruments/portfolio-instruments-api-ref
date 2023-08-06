import * as path from 'path';
import * as fse from 'fs-extra';
import type { ThunderClientCollection } from './.thunderclient/ThunderClientCollection';

// Replace all `bearer` values with an empty string
async function sanitizeThunderclientCollection(): Promise<void> {
  const collectionPath: string = path.join(__dirname, '.thunderclient', 'Portfolio-Instruments-API.json');

  try {
    const collectionData: ThunderClientCollection = JSON.parse(await fse.readFile(collectionPath, 'utf8'));
    collectionData.requests.forEach((request) => {
      if (request.auth && request.auth.type === 'bearer') {
        request.auth.bearer = '';
      }
    });

    await fse.writeFile(collectionPath, JSON.stringify(collectionData, null, 4));
  } catch (e) {
    console.error('Failed to sanitize Thunder Client collection data: ', e);
  }
}

exports.sanitizeTC = sanitizeThunderclientCollection;
