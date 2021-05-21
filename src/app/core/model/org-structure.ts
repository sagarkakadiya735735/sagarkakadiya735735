import { orgStructureHeaderLayer } from 'src/app/core/enums/roles.enum';
import { expand } from "rxjs/operators";

export class OrgStructure {
  id: string;
  org: string;
  orgID: string;
  plant: string;
  plantID: string;
  status: string;
  validFrom: string;
  validTo: string;
  department: Department[] = [];
}

export class Department {
  _departmentID: string;
  name: string;
  position: Position[] = [];
  sequenceNumber: string;
  status: string;
  timestamp: string;
}

export class Position {
  _positionID: string;
  assignedWorker: string;
  name: string;
  sequenceNumber: string;
  shift: string;
  status: string;
  timestamp: string;
  title: string;
}

export class orgStructureParams {
  page: number;
  size: number;
  orgID: string;
  plantID: string;
}
