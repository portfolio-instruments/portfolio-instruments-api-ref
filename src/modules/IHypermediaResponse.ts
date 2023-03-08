// HATEOAS inspired response interface
export interface IHypermediaResponse<T extends object> {
  data: Partial<T>;
  _links: Record<string, ResponseHyperlinks>;
}

export interface ResponseHyperlinks {
  href: string;
  type: string[];
  title: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  access?: 'Public' | 'Restricted';
  status?: 'Success' | 'Failed' | 'Pending';
}
