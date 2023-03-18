// HATEOAS inspired response interface
export interface IHypermediaResponse<T> {
  data?: Partial<T> | Partial<T>[];
  message?: string;
  _links: Record<string, IResponseHyperlink>;
}

export interface IResponseHyperlink {
  href: string;
  type: string[];
  description: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  access?: 'Public' | 'Restricted';
  status?: 'Success' | 'Failed' | 'Pending';
  authToken?: string;
  fields?: IResponseHyperlinkField[];
}

export interface IResponseHyperlinkField {
  field: string;
  type: string;
  required?: boolean;
}
