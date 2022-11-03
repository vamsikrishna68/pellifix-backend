import {inject} from '@loopback/core';
import {HttpErrors, post, requestBody} from '@loopback/rest';
import {AuthUser} from '../utils';
const Razorpay = require('razorpay');
interface RayzorFields {
  amount: number;
  currency: string;
  receipt: string;
  payment_capture: boolean;
  notes: object;
}

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET_ID,
});

export class RazorpayController {
  constructor(
    @inject('authUser')
    public authUser: AuthUser,
  ) {
    if (!this.authUser.id) {
      throw new HttpErrors.Unauthorized('Unauthorized');
    }
  }
  /**
   * Create a razorpay place
   * @param data
   */
  @post('/v1/razor/payment', {
    responses: {
      '200': {},
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              amount: {type: 'number'},
              receipt: {type: 'string'},
              notes: {type: 'object'},
            },
            required: ['amount', 'receipt'],
          },
        },
      },
    })
    data: RayzorFields,
  ): Promise<object> {
    const options = {
      amount: data.amount * 100,
      currency: 'INR',
      receipt: data.receipt,
      payment_capture: true,
      notes: data.notes,
    };

    const response = await razorpay.orders.create(options);
    return {
      id: response.id,
      currency: response.currency,
      amount: response.amount,
    };
  }
}
