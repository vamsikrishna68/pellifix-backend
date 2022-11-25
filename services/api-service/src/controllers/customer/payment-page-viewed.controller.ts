import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
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
import {PaymentPageViewed} from '../../models';
import {PaymentPageViewedRepository} from '../../repositories';
import {AuthUser} from '../../utils';

export class PaymentPageViewedController {
  constructor(
    @repository(PaymentPageViewedRepository)
    public paymentPageViewedRepository: PaymentPageViewedRepository,
    @inject('authUser')
    public authUser: AuthUser,
  ) {
    if (!this.authUser.id) {
      throw new HttpErrors.Unauthorized('Unauthorized');
    }
  }

  @post('/v1/profile/payment/page-viewed')
  @response(200, {
    description: 'Create payment page viewed profile',
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PaymentPageViewed, {
            partial: true,
            exclude: ['pro_id', 'id'],
          }),
        },
      },
    })
    profile: PaymentPageViewed,
  ): Promise<void> {
    const pro = await this.paymentPageViewedRepository.findOne({
      where: {pro_id: this.authUser.id},
    });
    if (pro) {
      await this.paymentPageViewedRepository.updateById(pro.id, {
        view_count: pro.view_count + 1,
        viewed: true,
      });
    } else {
      await this.paymentPageViewedRepository.create({
        pro_id: this.authUser.id,
        view_count: 1,
        viewed: true,
      });
    }
  }
}
