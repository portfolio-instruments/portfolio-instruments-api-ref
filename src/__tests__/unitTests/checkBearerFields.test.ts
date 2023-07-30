import * as fse from 'fs-extra';
import * as path from 'path';

interface AuthObject {
  type: string;
  bearer: string;
}

interface RequestObject {
  _id: string;
  auth?: AuthObject;
}

export interface ExportData {
  client: string;
  collectionName: string;
  dateExported: string;
  version: string;
  folders: unknown[];
  requests: RequestObject[];
}

describe('Thunderclient collection', () => {
  /** 201 */
  it('should not source control bearer token data', async () => {
    const collectionPath: string = path.join(__dirname, '..', '..', '..', '.thunderclient', 'Portfolio-Instruments-API.json');

    const collectionData: ExportData = JSON.parse(await fse.readFile(collectionPath, 'utf8'));

    const hasPopulatedBearerToken: boolean = collectionData.requests.some((request) => {
      return request.auth && request.auth.type === 'bearer' && request.auth.bearer;
    });

    expect(hasPopulatedBearerToken).toBe(false);
  });
});
