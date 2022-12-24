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
import {replaceStaticValue} from '../profile-utils';
import {GENDER} from '../utils';

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

  @get('/v1/matches/daily')
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
  ): Promise<Object> {
    let limit = filter?.limit ? filter.limit : 10;
    let skip = filter?.skip ? filter.skip : 0;
    const pro = await this.profilesRepository.findById(this.authUser.id, {
      fields: {password: false},
    });
    const preference = await this.preferenceRepository.findById(
      this.authUser.id,
    );
    const gender = pro.gender === GENDER.MALE ? GENDER.FEMALE : GENDER.MALE;
    const count = await this.preferenceRepository.getDailyRecomentationCount(
      gender,
      preference,
      this.authUser.id,
    );
    const profiles = await this.preferenceRepository.getDailyRecomentation(
      gender,
      preference,
      this.authUser.id,
      {limit, skip},
    );

    const data = profiles.map((profile: any) => {
      profile.is_liked = profile.is_liked ? true : false;
      const staticdata = replaceStaticValue(profile);
      return {
        ...profile,
        ...staticdata,
      };
    });
    return {
      count,
      data,
    };
  }
}
