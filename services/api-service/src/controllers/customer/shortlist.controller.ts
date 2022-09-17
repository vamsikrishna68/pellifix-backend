import {inject} from '@loopback/core';
import {Count, CountSchema, Filter, repository} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
  patch,
  requestBody,
  response,
  HttpErrors,
} from '@loopback/rest';
import {Shortlist} from '../../models';
import {ShortlistRepository} from '../../repositories';
import {AuthUser} from '../../utils';
import {CountAndData} from '../../types';
import {replaceStaticValue} from '../profile-utils';

export class ShortlistController {
  constructor(
    @repository(ShortlistRepository)
    public shortlistRepository: ShortlistRepository,
    @inject('authUser')
    public authUser: AuthUser,
  ) {
    if (!this.authUser.id) {
      throw new HttpErrors.Unauthorized('Unauthorized');
    }
  }

  @patch('/v1/users/shortlist')
  @response(200, {
    description: 'Shortlist model instance',
    content: {'application/json': {schema: getModelSchemaRef(Shortlist)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Shortlist, {
            title: 'NewShortlist',
            exclude: ['profile_id'],
          }),
        },
      },
    })
    shortlist: Shortlist,
  ): Promise<void> {
    shortlist.profile_id = this.authUser.id;

    const alreadyLiked = await this.shortlistRepository.findOne({
      where: {profile_id: this.authUser.id, short_id: shortlist.short_id},
    });

    if (alreadyLiked) {
      await this.shortlistRepository.updateById(shortlist.profile_id, {
        is_liked: shortlist.is_liked,
      });
    } else {
      await this.shortlistRepository.create(shortlist);
    }
  }

  @get('/v1/users/shortlist/count')
  @response(200, {
    description: 'Shortlist model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(): Promise<Count> {
    return this.shortlistRepository.count({
      profile_id: this.authUser.id,
      is_liked: true,
    });
  }

  @get('/v1/users/shortlist')
  async find(
    @param.filter(Shortlist) filter?: Filter<Shortlist>,
  ): Promise<CountAndData> {
    const short = await this.shortlistRepository.find({
      where: {profile_id: this.authUser.id, is_liked: true},
    });

    if (!short.length) {
      return {
        count: 0,
        data: [],
      };
    } else {
      const ids = short.map(x => x.short_id);
      const profiles = await this.shortlistRepository.getShortlist(ids);
      const data = profiles.map(profile => {
        const staticdata = replaceStaticValue(profile);
        return {
          ...profile,
          ...staticdata,
        };
      });

      return {
        count: short.length,
        data,
      };
    }
  }
}
