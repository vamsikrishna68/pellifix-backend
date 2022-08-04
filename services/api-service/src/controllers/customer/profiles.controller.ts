import {inject} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  get,
  getModelSchemaRef,
  HttpErrors,
  param,
  patch,
  requestBody,
  response,
} from '@loopback/rest';
import {Profiles} from '../../models';
import {ProfilesRepository} from '../../repositories';
import {AuthUser} from '../../utils';

export class ProfilesController {
  constructor(
    @repository(ProfilesRepository)
    public profilesRepository: ProfilesRepository,
    @inject('authUser')
    public authUser: AuthUser,
  ) {
    if (!this.authUser.id) {
      throw new HttpErrors.Unauthorized('Unauthorized');
    }
  }

  @get('/v1/profiles/list')
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

  @get('/v1/profiles')
  @response(200, {
    description: 'Profiles model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Profiles, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.filter(Profiles, {exclude: 'where'})
    filter?: FilterExcludingWhere<Profiles>,
  ): Promise<Profiles> {
    return this.profilesRepository.findById(this.authUser.id, filter);
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

  @patch('/v1/profiles')
  async changePassowrd(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Profiles, {
            includeRelations: false,
            partial: true,
            exclude: [
              'id',
              'password',
              'created_at',
              'created_by',
              'updated_at',
              'updated_by',
            ],
          }),
        },
      },
    })
    profile: Profiles,
  ): Promise<void> {
    await this.profilesRepository.updateById(this.authUser.id, profile);
  }
}
