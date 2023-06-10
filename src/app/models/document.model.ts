export interface DocumentData {
  category: string;
  createdAt: string;
  docid: string;
  linkToDoc: string;
  name: string;
  systemId: string;
  swipedLeft?:boolean;
  extension: string;
  sharedWithBroker?: number;
}