import {inject} from '@loopback/core';
import {Count, CountSchema, Filter, repository} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
  requestBody,
  response,
  HttpErrors,
  post,
} from '@loopback/rest';
import {ProfileViews} from '../../models';
import {ProfileViewsRepository} from '../../repositories';
import {AuthUser} from '../../utils';
import {CountAndData} from '../../types';
import {replaceStaticValue} from '../profile-utils';

export class ProfileViewsController {
  constructor(
    @repository(ProfileViewsRepository)
    public profileViewsRepository: ProfileViewsRepository,
    @inject('authUser')
    public authUser: AuthUser,
  ) {
    if (!this.authUser.id) {
      throw new HttpErrors.Unauthorized('Unauthorized');
    }
  }

  @post('/v1/users/profile-views')
  @response(200, {
    description: 'ProfileViews model instance',
    content: {'application/json': {schema: getModelSchemaRef(ProfileViews)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProfileViews, {
            title: 'NewProfileViews',
            exclude: ['viewer_id'],
          }),
        },
      },
    })
    profileViews: ProfileViews,
  ): Promise<void> {
    profileViews.viewer_id = this.authUser.id;

    const already = await this.profileViewsRepository.findOne({
      where: {profile_id: profileViews.profile_id, viewer_id: this.authUser.id},
    });

    if (already) {
      await this.profileViewsRepository.updateById(profileViews.profile_id, {
        viewer_id: this.authUser.id,
      });
    } else {
      await this.profileViewsRepository.create(profileViews);
    }
  }

  @get('/v1/users/profile-views/count')
  @response(200, {
    description: 'ProfileViews model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(): Promise<Count> {
    return this.profileViewsRepository.count({profile_id: this.authUser.id});
  }

  @get('/v1/users/profile-views')
  async find(): Promise<CountAndData> {
    const viewer = await this.profileViewsRepository.find({
      where: {profile_id: this.authUser.id},
    });

    if (!viewer.length) {
      return {
        count: 0,
        data: [],
      };
    } else {
      const ids = viewer.map(x => x.viewer_id);
      const profiles = await this.profileViewsRepository.getProfileViews(ids);
      const data = profiles.map(profile => {
        const staticdata = replaceStaticValue(profile);
        return {
          ...profile,
          ...staticdata,
        };
      });

      return {
        count: viewer.length,
        data,
      };
    }
  }
}
