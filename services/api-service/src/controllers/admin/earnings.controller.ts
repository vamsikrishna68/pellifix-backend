import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {get, HttpErrors, param} from '@loopback/rest';
import {EarningsRepository} from '../../repositories';
import {AuthUser} from '../../utils';

export class EarningsController {
  constructor(
    @repository(EarningsRepository)
    public earningsRepository: EarningsRepository,
    @inject('authUser')
    public authUser: AuthUser,
  ) {
    if (!this.authUser.id) {
      throw new HttpErrors.Unauthorized('Unauthorized');
    }
  }

  @get('/cp/v1/employees/earnings')
  async find(
    @param.query.string('type', {
      required: true,
      example: 'DAY, MONTH, YEAR',
    })
    type: string,
  ): Promise<Object[]> {
    const types = ['DAY', 'MONTH', 'YEAR'];
    if (!types.includes(type)) {
      throw new HttpErrors.UnprocessableEntity(
        `Only this types allowed ${types.join('/ ')}`,
      );
    }
    // var now = new Date();
    // var daysOfYear = [];
    // for (var d = new Date(2021, 0, 1); d <= now; d.setDate(d.getDate() + 1)) {
    //   console.log(`${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`);
    //   daysOfYear.push({
    //     admin_id: 1,
    //     date: `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`,
    //     amount: d.getDate() * (d.getMonth() + 1),
    //   });
    // }

    const data = await this.earningsRepository.getEarnings(
      this.authUser.id,
      type,
    );
    return data;
  }
}
