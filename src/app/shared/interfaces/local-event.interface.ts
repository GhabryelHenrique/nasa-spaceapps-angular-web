export interface LocalEventGeometry {
  type: string;
  coordinates: number[];
  __typename: string;
}

export interface LocalEventMeta {
  type: string;
  htmlUrl: string;
  __typename: string;
}

export interface LocalEventProperties {
  id: string;
  title: string;
  meta: LocalEventMeta;
  country: string;
  displayName: string;
  cachedRegistrations: number;
  eventType: 'In-Person' | 'Virtual' | 'Virtual & In-Person';
  registrationEnabled: boolean;
  isHostEvent: boolean;
  __typename: string;
}

export interface LocalEventNode {
  type: string;
  geometry: LocalEventGeometry;
  properties: LocalEventProperties;
  __typename: string;
}

export interface LocalEvent {
  cursor: string;
  node: LocalEventNode;
  __typename: string;
}

export interface CityParticipation {
  city: string;
  country: string;
  registrations: number;
  eventType: string;
  url: string;
}