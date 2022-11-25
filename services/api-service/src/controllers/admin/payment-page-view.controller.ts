import {inject} from '@loopback/core';
import {Filter, repository} from '@loopback/repository';
import {param, get, patch, HttpErrors} from '@loopback/rest';
import {Profiles} from '../../models';
import {PaymentPageViewedRepository} from '../../repositories';

import {AuthUser} from '../../utils';

export class PaymentViewController {
  constructor(
    @repository(PaymentPageViewedRepository)
    public paymentPageViewedRepository: PaymentPageViewedRepository,
    @inject('authUser')
    public authUser: AuthUser,
  ) {
    this.authUser.id = 2;
    if (!this.authUser.id) {
      throw new HttpErrors.Unauthorized('Unauthorized');
    }
  }

  @get('/cp/v1/payment/page/viewed')
  async find(
    @param.filter(Profiles) filter?: Filter<Profiles>,
  ): Promise<Object[]> {
    const profileList = await this.paymentPageViewedRepository.profileList();
    let data = [];
    if (profileList.length) {
      data = profileList.map((x: any) => ({
        ...x,
        notified: x.notified ? true : false,
        viewed: x.viewed ? true : false,
      }));
    }
    return data;
  }

  @patch('/cp/v1/payment/page/viewed/{id}')
  async changePassowrd(@param.path.number('id') id: number): Promise<void> {
    await this.paymentPageViewedRepository.updateById(id, {
      notified: true,
    });
  }
}
