export interface StaticValue {
  id: number;
  name: string;
  value: number;
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
