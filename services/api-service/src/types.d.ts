export interface StaticValue {
  id: number;
  name: string;
  value: number;
}
export interface CountAndData {
  count: number;
  data: Object;
}

export interface ReligionHead {
  id: number;
  name: string;
  castealias: string;
  value: number;
}

export interface Caste {
  id: number;
  religion_id: number;
  name: string;
  value: number;
}

export interface Religion {
  id: number;
  name: string;
  castealias: string;
  value: number;
  castes: Caste[];
}

export interface Raasi {
  id: number;
  native: string;
  english: string;
  name: string;
  value: number;
}
export interface FileFields {
  fieldname: string;
  originalname: string;
  newfilename: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}

export interface CustomeFilter {
  limit: number;
  skip: number;
}
