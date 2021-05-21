export class Worker {
  id: string;
  org: string;
  orgID: string;
  plant: string;
  plantID: string;
  status: string;
  timestamp: string;
  user: string;
  userID: string;
  worker: Details;

}

export class Details {
  _workerID: string;
  address: Address;
  countryCode: string;
  email: string;
  name: string;
  permitToWork: PermitToWork;
  phone: string;
  sequenceNumber: string;
  status: string;
}

export class PermitToWork {
  functionalGroupOfAssets: string[];
}

export class Address {
  city: string;
  country: string;
  street: string;
  zip: string;
}

export class workersList {
  name: string;
  page: number;
  size: number;
  orgID: string;
  plantID: string;
}
