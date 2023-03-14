// HATEOAS inspired response interface
export interface IHypermediaResponse<T> {
  data?: Partial<T>;
  message?: string;
  _links: Record<string, ResponseHyperlinks>;
}

export interface ResponseHyperlinks {
  href: string;
  type: string[];
  description: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  access?: 'Public' | 'Restricted';
  status?: 'Success' | 'Failed' | 'Pending';
  authToken?: string;
}
