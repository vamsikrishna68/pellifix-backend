import {inject} from '@loopback/core';
import {Filter, repository} from '@loopback/repository';
import {
  get,
  getModelSchemaRef,
  HttpErrors,
  param,
  response,
} from '@loopback/rest';
import {Profiles} from '../../models';
import {PreferenceRepository, ProfilesRepository} from '../../repositories';
import {AuthUser} from '../../utils';

export class DailyRecomController {
  constructor(
    @repository(ProfilesRepository)
    public profilesRepository: ProfilesRepository,
    @repository(PreferenceRepository)
    public preferenceRepository: PreferenceRepository,
    @inject('authUser')
    public authUser: AuthUser,
  ) {
    if (!this.authUser.id) {
      throw new HttpErrors.Unauthorized('Unauthorized');
    }
  }

  @get('/v1/profiles/daily-recom')
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
  async find(): Promise<Object[]> {
    const profile = await this.profilesRepository.findById(this.authUser.id, {
      fields: {password: false},
    });

    const preference = await this.preferenceRepository.findById(
      this.authUser.id,
    );

    const gender = profile.gender === 'MALE' ? 'FEMALE' : 'MALE';

    const data = await this.preferenceRepository.getDailyRecomentation(
      gender,
      preference,
    );
    return [];
  }
}