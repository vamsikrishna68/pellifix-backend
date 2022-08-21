import {
  MaritalStatusList,
  BodyTypeList,
  PhysicalStatusList,
  ReligionHeadList,
  CasteList,
  NakshtramList,
  Raasilist,
  EatingHabitsList,
  DrinkingHabitsList,
  SmokingHabitsList,
} from './static-data';
import {Profiles} from './models';
import {HttpErrors} from '@loopback/rest';
import {Caste, Raasi, ReligionHead, StaticValue} from './types';

export class ProfileValidate {
  constructor() {}

  profileValidation(pro: Profiles) {
    const data: any = {
      marital_status: this.validationErrorThrow(
        'marital_status',
        pro.marital_status,
        MaritalStatusList,
      ),
      body_type: this.validationErrorThrow(
        'body_type',
        pro.body_type,
        BodyTypeList,
      ),
      physical_status: this.validationErrorThrow(
        'physical_status',
        pro.physical_status,
        PhysicalStatusList,
      ),
      religion: this.validationErrorThrow(
        'religion',
        pro.religion,
        ReligionHeadList,
      ),
      caste: this.validationErrorThrow('caste', pro.caste, CasteList),
      zodiac: this.validationErrorThrow('zodiac', pro.zodiac, Raasilist),
      star: this.validationErrorThrow('star', pro.star, NakshtramList),
      eating_habit: this.validationErrorThrow(
        'eating_habit',
        pro.eating_habit,
        EatingHabitsList,
      ),
      drinking_habit: this.validationErrorThrow(
        'drinking_habit',
        pro.drinking_habit,
        DrinkingHabitsList,
      ),
      smoking_habit: this.validationErrorThrow(
        'smoking_habit',
        pro.smoking_habit,
        SmokingHabitsList,
      ),
    };

    const newObj: any = {};
    Object.keys(data).forEach(key => {
      if (data[key]) {
        newObj[key] = data[key];
      }
    });

    return newObj;
  }

  private validationErrorThrow(
    key: String,
    name: string,
    staticList: Array<StaticValue | ReligionHead | Caste | Raasi>,
  ): string {
    const staticData = staticList.find(x => x.name === name);
    if (!staticData) {
      const keys = staticList.map(x => x.name);
      throw new HttpErrors.UnprocessableEntity(
        `${key} only allowed ${keys.join()}`,
      );
    }
    return String(staticData?.value);
  }
}
