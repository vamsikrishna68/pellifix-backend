import {Entity, model, property} from '@loopback/repository';

@model({name: 'profile'})
export class Profiles extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  pro_id?: number;

  @property({
    type: 'string',
    required: true,
  })
  profile_creater: string;

  @property({
    type: 'string',
    required: true,
  })
  name?: string;

  @property({
    type: 'string',
  })
  marital_status: string;

  @property({
    type: 'string',
  })
  body_type: string;

  @property({
    type: 'number',
  })
  age: number;

  @property({
    type: 'string',
  })
  physical_status: string;

  @property({
    type: 'number',
  })
  height: number;

  @property({
    type: 'number',
  })
  weight: number;

  @property({
    type: 'string',
  })
  religion: string;

  @property({
    type: 'string',
  })
  caste: string;

  @property({
    type: 'string',
  })
  sub_caste: string;

  @property({
    type: 'string',
  })
  zodiac: string;

  @property({
    type: 'string',
  })
  star: string;

  @property({
    type: 'string',
  })
  eating_habit: string;

  @property({
    type: 'string',
  })
  drinking_habit: string;

  @property({
    type: 'string',
  })
  smoking_habit: string;

  @property({
    type: 'string',
  })
  country: string;

  @property({
    type: 'string',
  })
  city: string;

  @property({
    type: 'string',
  })
  state: string;

  @property({
    type: 'string',
  })
  education: string;

  @property({
    type: 'string',
  })
  occupation: string;

  @property({
    type: 'string',
  })
  employeed_in: string;

  @property({
    type: 'string',
  })
  salary: string;

  @property({
    type: 'string',
  })
  mobileno: string;

  @property({
    type: 'string',
  })
  image: string;

  @property({
    type: 'string',
  })
  about_me: string;

  @property({
    type: 'string',
  })
  require_details: string;

  @property({
    type: 'boolean',
  })
  is_membership: boolean;

  @property({
    type: 'boolean',
  })
  paid_status: boolean;

  @property({
    type: 'date',
  })
  start_date: string;

  @property({
    type: 'date',
  })
  end_date: string;

  @property({
    type: 'string',
  })
  email_id: string;

  @property({
    type: 'string',
  })
  password: string;

  @property({
    type: 'string',
  })
  gender: string;

  @property({
    type: 'string',
  })
  profession: string;

  @property({
    type: 'string',
  })
  address: string;

  @property({
    type: 'string',
  })
  pincode: string;

  @property({
    type: 'string',
  })
  phoneno: string;

  @property({
    type: 'date',
  })
  paid_date: string;

  @property({
    type: 'string',
  })
  login_status: string;

  @property({
    type: 'number',
  })
  created_by: number;

  @property({
    type: 'number',
  })
  updated_by: number;

  @property({
    type: 'date',
  })
  created_at?: string;

  @property({
    type: 'date',
  })
  updated_at?: string;

  constructor(data?: Partial<Profiles>) {
    super(data);
  }
}

export interface ProfilesRelations {
  // describe navigational properties here
}

export type ProfilesWithRelations = Profiles & ProfilesRelations;
