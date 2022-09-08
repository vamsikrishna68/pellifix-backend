import {Entity, model, property} from '@loopback/repository';

@model({name: 'images'})
export class Images extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id: number;

  @property({
    type: 'number',
  })
  pro_id: number;

  @property({
    type: 'string',
  })
  orginal_name: string;

  @property({
    type: 'string',
  })
  new_name: string;

  @property({
    type: 'string',
  })
  url: string;

  @property({
    type: 'string',
  })
  size: string;

  constructor(data?: Partial<Images>) {
    super(data);
  }
}

export interface ImagesRelations {
  // describe navigational properties here
}

export type ImagesWithRelations = Images & ImagesRelations;
