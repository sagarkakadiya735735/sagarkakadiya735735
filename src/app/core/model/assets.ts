import { Attribute } from "./attribute";

export class Assets extends Attribute {
  _areaID: string;
  _flocID: string;
  assetName: string;
  areaName: string;
  flocName: string;
  templateID: string;
}

export class AssetHierarchy {
  floc:	Floc[] = [];
  id:	string;
  org:	string;
  orgID:	string;
  plant:	string;
  plantID:	string;
  user:	string;
  userID:	string;
}

export class Floc {
  _flocID:	string;
  area:	Area[];
  name:	string;
  sequenceNumber:	string;
  status:	string;
  timestamp:	string;
}

export class Area {
  _areaID:	string;
  name:	string;
  sequenceNumber:	string;
  status:	string;
  timestamp:	string;
  area: any;
}

// export class AttributeParmas {
//   page: number;
//   size: number;
// }
