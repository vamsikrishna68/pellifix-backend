import {repository} from '@loopback/repository';
import {HttpErrors, patch, requestBody} from '@loopback/rest';
import {ProfilesRepository} from '../../repositories';
import {genPasswordHash, comparePassword} from '../../services/password-hash';
import {inject} from '@loopback/core';

export class PasswordChangeController {
  constructor(
    @repository(ProfilesRepository)
    public profilesRepository: ProfilesRepository,
    @inject('authUser')
    public authUser: any,
  ) {
    if (!this.authUser.pro_id) {
      throw new HttpErrors.Unauthorized('Unauthorized');
    }
  }
  @patch('/v1/profile/password/change')
  async changePassowrd(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            properties: {
              old_password: {type: 'string'},
              password: {type: 'string'},
            },
            required: ['old_password', 'password'],
          },
        },
      },
    })
    pro: {
      old_password: string;
      password: string;
    },
  ): Promise<void> {
    const profile = await this.profilesRepository.findOne({
      where: {id: this.authUser.pro_id},
    });

    if (!profile) {
      throw new HttpErrors[401](`Not valide profile`);
    }

    const isValid = await comparePassword(pro.old_password, profile.password);

    if (!isValid) {
      throw new HttpErrors.UnprocessableEntity('Your old password not match');
    }

    const password = genPasswordHash(pro.password);
    await this.profilesRepository.updateById(profile.id, {
      password,
    });
  }
}
