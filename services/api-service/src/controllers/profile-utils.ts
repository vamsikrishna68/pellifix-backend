import * as STATIC_DATA from '../data/data.json';
import {Profiles} from '../models';

export const replaceStaticValue = (profile: Profiles): Partial<Profiles> => {
  return {
    gender: findValue(profile.gender, STATIC_DATA.GENDER),
    profile_creater: findValue(
      profile.profile_creater,
      STATIC_DATA.REGI_PROFILE_CREATE,
    ),
    marital_status: findValue(
      profile.marital_status,
      STATIC_DATA.MARITAL_STATUS,
    ),
    body_type: findValue(profile.body_type, STATIC_DATA.BODY_TYPES),
    physical_status: findValue(
      profile.physical_status,
      STATIC_DATA.PHYSICAL_STATUS,
    ),
    religion: findValue(profile.religion, STATIC_DATA.RELIGION),
    caste: findValue(profile.caste, STATIC_DATA.CASTE),
    zodiac: findValue(profile.zodiac, STATIC_DATA.ZODIAC_LIST),
    star: findValue(profile.star, STATIC_DATA.STAR_LIST),
    smoking_habit: findValue(profile.smoking_habit, STATIC_DATA.SMOKING),
    drinking_habit: findValue(profile.drinking_habit, STATIC_DATA.DRINKING),
    eating_habit: findValue(profile.eating_habit, STATIC_DATA.FOOD),
    country: findValue(profile.country, STATIC_DATA.COUNTRYS),
    education: findValue(profile.education, STATIC_DATA.EDUCATION),
    occupation: findValue(
      profile.occupation,
      STATIC_DATA.OCCUPATION_PROFESSION,
    ),

    salary: findValue(profile.salary, STATIC_DATA.SALARY),
    profession: findValue(profile.profession, STATIC_DATA.PROFESSION),
    family_status: findValue(profile.family_status, STATIC_DATA.FAMILY_STATUS),
    family_type: findValue(profile.family_type, STATIC_DATA.FAMILY_TYPE),
  };
};

const findValue = (
  staticId: string,
  staticObject: {id: number; name: string}[],
): string => {
  return Number(staticId)
    ? staticObject.find(x => x.id === Number(staticId))?.name || ''
    : staticId;
};
