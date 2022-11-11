import {inject} from '@loopback/core';
import {FilterExcludingWhere, repository} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
  patch,
  requestBody,
  response,
  HttpErrors,
  post,
} from '@loopback/rest';
import {Preference} from '../../models';
import {PreferenceRepository} from '../../repositories';
import {AuthUser} from '../../utils';

export class PreferenceController {
  constructor(
    @repository(PreferenceRepository)
    public preferenceRepository: PreferenceRepository,
    @inject('authUser')
    public authUser: AuthUser,
  ) {
    if (!this.authUser.id) {
      throw new HttpErrors.Unauthorized('Unauthorized');
    }
  }

  @get('/v1/profile/preferences')
  @response(200, {
    description: 'Preference model instance',
  })
  async findById(): Promise<Preference> {
    const profile = await this.preferenceRepository.findById(this.authUser.id);
    return profile;
  }

  @post('/v1/profile/preferences')
  @response(200, {
    description: 'Create peference',
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Preference, {
            partial: true,
            exclude: ['pro_id'],
          }),
        },
      },
    })
    preference: Preference,
  ): Promise<void> {
    preference.pro_id = this.authUser.id;
    const pro = await this.preferenceRepository.create(preference);
  }

  @patch('/v1/profile/preferences')
  @response(204, {
    description: 'Preference PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Preference, {partial: true}),
        },
      },
    })
    preference: Preference,
  ): Promise<void> {
    await this.preferenceRepository.updateById(this.authUser.id, preference);
  }
}
