import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {get, getModelSchemaRef, param, response} from '@loopback/rest';
import {Profiles} from '../../models';
import {ProfilesRepository} from '../../repositories';

export class ProfilesController {
  constructor(
    @repository(ProfilesRepository)
    public profilesRepository: ProfilesRepository,
  ) {}

  @get('/v1/profiles/count')
  @response(200, {
    description: 'Profiles model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Profiles) where?: Where<Profiles>): Promise<Count> {
    return this.profilesRepository.count(where);
  }

  @get('/v1/profiles')
  @response(200, {
    description: 'Array of Profiles model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Profiles, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Profiles) filter?: Filter<Profiles>,
  ): Promise<Profiles[]> {
    return this.profilesRepository.find({
      ...filter,
      fields: {
        id: true,
        profile_id: true,
        profile_creater: true,
        name: true,
        marital_status: true,
        body_type: true,
        dob: true,
        age: true,
        physical_status: true,
        height: true,
        weight: true,
        religion: true,
        caste: true,
        sub_caste: true,
        zodiac: true,
        star: true,
        country: true,
        city: true,
        state: true,
        education: true,
        occupation: true,
        image: true,
        about_me: true,
        is_membership: true,
        gender: true,
        profession: true,
      },
    });
  }

  @get('/v1/profiles/{id}')
  @response(200, {
    description: 'Profiles model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Profiles, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Profiles, {exclude: 'where'})
    filter?: FilterExcludingWhere<Profiles>,
  ): Promise<Profiles> {
    return this.profilesRepository.findById(id, filter);
  }

  @get('/v1/profiles/address/{id}')
  @response(200, {
    description: 'Profiles model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Profiles, {includeRelations: true}),
      },
    },
  })
  async getSubProfile(@param.path.number('id') id: number): Promise<Profiles> {
    return this.profilesRepository.findById(id, {
      fields: {address: true, mobileno: true, email_id: true},
    });
  }
}
