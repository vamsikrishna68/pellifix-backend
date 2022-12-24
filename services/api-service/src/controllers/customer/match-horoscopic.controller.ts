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
import {ProfilesRepository} from '../../repositories';
import {startMatch} from '../../data/star-match';
import {GENDER} from '../utils';
import {AuthUser} from '../../utils';
import {replaceStaticValue} from '../profile-utils';

export class HoroscopicMatchController {
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

  @get('/v1/matches/horoscopic')
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

    const profile = await this.profilesRepository.findById(this.authUser.id, {
      fields: {password: false},
    });
    const gender = profile.gender === GENDER.MALE ? GENDER.FEMALE : GENDER.MALE;
    const matchStartIds = startMatch[Number(profile.star)];
    const count = await this.profilesRepository.getHoroscopicCount(
      gender,
      matchStartIds,
      this.authUser.id,
    );
    const profiles = await this.profilesRepository.getHoroscopic(
      gender,
      matchStartIds,
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

    return {count, data};
  }
}
