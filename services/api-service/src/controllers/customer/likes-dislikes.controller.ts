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
import {LikesDislikes} from '../../models';
import {LikesDislikesRepository} from '../../repositories';
import {AuthUser} from '../../utils';

export class LikesDislikesController {
  constructor(
    @repository(LikesDislikesRepository)
    public likesDislikesRepository: LikesDislikesRepository,
    @inject('authUser')
    public authUser: AuthUser,
  ) {
    this.authUser.id = 2;
    if (!this.authUser.id) {
      throw new HttpErrors.Unauthorized('Unauthorized');
    }
  }

  @patch('/v1/users/likes-dislikes')
  @response(200, {
    description: 'LikesDislikes model instance',
    content: {'application/json': {schema: getModelSchemaRef(LikesDislikes)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(LikesDislikes, {
            title: 'NewLikesDislikes',
            exclude: ['profile_id'],
          }),
        },
      },
    })
    likesDislikes: LikesDislikes,
  ): Promise<void> {
    likesDislikes.profile_id = this.authUser.id;

    const alreadyLiked = await this.likesDislikesRepository.findOne({
      where: {profile_id: this.authUser.id, liked_id: likesDislikes.liked_id},
    });

    if (alreadyLiked) {
      await this.likesDislikesRepository.updateById(likesDislikes.profile_id, {
        is_liked: likesDislikes.is_liked,
      });
    } else {
      await this.likesDislikesRepository.create(likesDislikes);
    }
  }

  @get('/v1/users/likes-dislikes/count')
  @response(200, {
    description: 'LikesDislikes model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(LikesDislikes) where: Where<LikesDislikes>,
  ): Promise<Count> {
    return this.likesDislikesRepository.count(where);
  }

  @get('/v1/users/likes-dislikes')
  @response(200, {
    description: 'Array of LikesDislikes model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(LikesDislikes, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(LikesDislikes) filter?: Filter<LikesDislikes>,
  ): Promise<LikesDislikes[]> {
    return this.likesDislikesRepository.find(filter);
  }
}
