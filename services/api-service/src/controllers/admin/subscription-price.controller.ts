import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
  HttpErrors,
} from '@loopback/rest';
import {SubscriptionPrice} from '../../models';
import {SubscriptionPriceRepository} from '../../repositories';
import {AuthUser} from '../../utils';
import {inject} from '@loopback/core';

export class SubscriptionPriceController {
  constructor(
    @repository(SubscriptionPriceRepository)
    public subscriptionPriceRepository: SubscriptionPriceRepository,
    @inject('authUser')
    public authUser: AuthUser,
  ) {
    if (!this.authUser.id) {
      throw new HttpErrors.Unauthorized('Unauthorized');
    }
  }

  @post('/cp/v1/subscription-prices')
  @response(200, {
    description: 'SubscriptionPrice model instance',
    content: {
      'application/json': {schema: getModelSchemaRef(SubscriptionPrice)},
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(SubscriptionPrice, {
            title: 'NewSubscriptionPrice',
            exclude: ['id'],
          }),
        },
      },
    })
    subscriptionPrice: Omit<SubscriptionPrice, 'id'>,
  ): Promise<SubscriptionPrice> {
    return this.subscriptionPriceRepository.create(subscriptionPrice);
  }

  @get('/cp/v1/subscription-prices')
  @response(200, {
    description: 'Array of SubscriptionPrice model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(SubscriptionPrice, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(SubscriptionPrice) filter?: Filter<SubscriptionPrice>,
  ): Promise<SubscriptionPrice[]> {
    return this.subscriptionPriceRepository.find(filter);
  }

  @get('/cp/v1/subscription-prices/{id}')
  @response(200, {
    description: 'SubscriptionPrice model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(SubscriptionPrice, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(SubscriptionPrice, {exclude: 'where'})
    filter?: FilterExcludingWhere<SubscriptionPrice>,
  ): Promise<SubscriptionPrice> {
    return this.subscriptionPriceRepository.findById(id, filter);
  }

  @patch('/cp/v1/subscription-prices/{id}')
  @response(204, {
    description: 'SubscriptionPrice PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(SubscriptionPrice, {partial: true}),
        },
      },
    })
    subscriptionPrice: SubscriptionPrice,
  ): Promise<void> {
    await this.subscriptionPriceRepository.updateById(id, subscriptionPrice);
  }

  @del('/cp/v1/subscription-prices/{id}')
  @response(204, {
    description: 'SubscriptionPrice DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.subscriptionPriceRepository.deleteById(id);
  }
}
