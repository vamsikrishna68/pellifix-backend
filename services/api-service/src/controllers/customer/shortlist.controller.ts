import {inject} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
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
      where: {profile_id: this.authUser.id, liked_id: shortlist.liked_id},
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
  async count(@param.where(Shortlist) where: Where<Shortlist>): Promise<Count> {
    return this.shortlistRepository.count(where);
  }

  @get('/v1/users/shortlist')
  @response(200, {
    description: 'Array of Shortlist model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Shortlist, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Shortlist) filter?: Filter<Shortlist>,
  ): Promise<Shortlist[]> {
    return this.shortlistRepository.find(filter);
  }
}
