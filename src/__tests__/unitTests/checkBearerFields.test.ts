import * as fse from 'fs-extra';
import * as path from 'path';
import type { ThunderClientCollection } from '../../../.thunderclient/ThunderClientCollection';

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
