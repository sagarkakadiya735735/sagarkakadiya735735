export class Attribute {
  id: string;
  name: string;
  org: string;
  orgID: string;
  plant: string;
  plantID: string;
  user: string;
  userID: string;
  general: AttributeGeneral = new AttributeGeneral();
  attributes: { tags : Tag[] };
  procedures: { sop : SOP[] };
  ppe:  { equipment : Equipment[] };
  loto: { tasks : Task[] }
}

export class AttributeGeneral {
  assetInstallDate:	Date;
  categories:	string[];
  description:	string;
  functionalGroup:	string;
  manual:	string;
  manufacturer:	string;
  modes:	string[];
  status:	string = "ACTIVE";
  validity: Validaty = new Validaty();
}

export class Tag {
  categories:	string;
  description: string;
  id:	string;
  inputType:	string;
  modes: string[];
  range: Range = new Range();
  tag: string;
  uom: string;
  validity: Validaty = new Validaty();
}

export class Equipment {
  mandatory:	string;
  protectiveEquipment:	string;
  sequenceNumber:	number;
}

export class Task {
  checkTask: string;
  sequenceNumber: number;
  type:	string;
}

export class SOP {
  id:	string;
  category:	string;
  details:	string;
  effort:	string;
  equipmentSection:	string[];
  manual:	string;
  notes:	string;
  photo:	string;
  procedure:	string;
  tools:	string[];
  video:	string;
}

export class Range {
  high: number;
  lo: number;
  highhigh: number;
  lolo: number;
}

export class Validaty {
  from: Date;
  to: Date;
}

export class AttributeParmas {
  name: string;
  page: number;
  size: number;
  orgID: string;
  plantID: string;
}
