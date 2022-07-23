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
} from '@loopback/rest';
import {Preference} from '../../models';
import {PreferenceRepository} from '../../repositories';

export class PreferenceController {
  constructor(
    @repository(PreferenceRepository)
    public preferenceRepository: PreferenceRepository,
    @inject('authUser')
    public authUser: any,
  ) {
    if (!this.authUser.pro_id) {
      throw new HttpErrors.Unauthorized('Unauthorized');
    }
  }

  @get('/v1/profile/preferences')
  @response(200, {
    description: 'Preference model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Preference, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.filter(Preference, {exclude: 'where'})
    filter?: FilterExcludingWhere<Preference>,
  ): Promise<Preference> {
    return this.preferenceRepository.findById(this.authUser.pro_id, filter);
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
    await this.preferenceRepository.updateById(
      this.authUser.pro_id,
      preference,
    );
  }
}
