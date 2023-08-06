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
