import * as fse from 'fs-extra';
import * as path from 'path';

interface ThunderAuth {
  type: string;
  bearer: string;
}

interface ThunderRequest {
  _id: string;
  auth?: ThunderAuth;
}

export interface ThunderClientCollection {
  client: string;
  collectionName: string;
  dateExported: string;
  version: string;
  folders: unknown[];
  requests: ThunderRequest[];
}

describe('Thunder Client collection', () => {
  it('should not source control bearer token data', async () => {
    const collectionPath: string = path.join(__dirname, '..', '..', '..', '.thunderclient', 'Portfolio-Instruments-API.json');
    const collectionData: ThunderClientCollection = JSON.parse(await fse.readFile(collectionPath, 'utf8'));

    const hasPopulatedBearerToken: boolean = collectionData.requests.some((request) => {
      return request.auth && request.auth.type === 'bearer' && request.auth.bearer;
    });

    expect(hasPopulatedBearerToken).toBe(false);
  });
});
