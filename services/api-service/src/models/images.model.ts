import {Entity, model, property} from '@loopback/repository';

@model({name: 'images'})
export class Images extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: false,
    required: true,
  })
  pro_id: number;

  @property({
    type: 'number',
    required: true,
  })
  unique_id: number;

  @property({
    type: 'string',
    required: true,
  })
  orginal_name: string;

  @property({
    type: 'string',
    required: true,
  })
  hash: string;

  @property({
    type: 'string',
    required: true,
  })
  url: string;

  @property({
    type: 'string',
    required: true,
  })
  size: string;

  @property({
    type: 'boolean',
  })
  primary_pic: boolean;

  constructor(data?: Partial<Images>) {
    super(data);
  }
}

export interface ImagesRelations {
  // describe navigational properties here
}

export type ImagesWithRelations = Images & ImagesRelations;
