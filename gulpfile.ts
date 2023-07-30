import * as path from 'path';
import * as fse from 'fs-extra';
import { ExportData } from './src/__tests__/unitTests/checkBearerFields.test';

// Replace all `bearer` values with an empty string
async function sanitizeThunderclientCollection(): Promise<void> {
  const collectionPath: string = path.join(__dirname, '.thunderclient', 'Portfolio-Instruments-API.json');

  try {
    const collectionData: ExportData = JSON.parse(await fse.readFile(collectionPath, 'utf8'));
    collectionData.requests.forEach((request) => {
      if (request.auth && request.auth.type === 'bearer') {
        request.auth.bearer = '';
      }
    });

    await fse.writeFile(collectionPath, JSON.stringify(collectionData, null, 4));
  } catch (e) {
    console.error('Failed to sanitize Thunderclient collection data: ', e);
  }
}

exports.sanitizeTC = sanitizeThunderclientCollection;
