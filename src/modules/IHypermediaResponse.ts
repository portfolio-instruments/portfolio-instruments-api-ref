// HATEOAS inspired response interface
export interface IHypermediaResponse<T> {
  data?: Partial<T> | Partial<T>[];
  message?: string;
  _links: Record<string, IResponseHyperlink>;
}

export interface IResponseHyperlink {
  href: string;
  description: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  fields?: IResponseHyperlinkField[];
  type: string[];
  status?: 'Success' | 'Failed' | 'Pending';
  access?: 'Public' | 'Restricted';
  authToken?: string;
}

export interface IResponseHyperlinkField {
  field: string;
  type: string;
  required?: boolean;
}
