import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDbConnectionDataSource} from '../datasources';
import {Preference, PreferenceRelations, Profiles} from '../models';
import {profileColumns} from '../data/sql-query';
import {CustomeFilter} from '../types';

export class PreferenceRepository extends DefaultCrudRepository<
  Preference,
  typeof Preference.prototype.pro_id,
  PreferenceRelations
> {
  constructor(
    @inject('datasources.MysqlDbConnection')
    dataSource: MysqlDbConnectionDataSource,
  ) {
    super(Preference, dataSource);
  }

  async getDailyRecomentation(
    gender: string,
    preference: Preference,
    profile_id: number,
    filter: CustomeFilter,
  ): Promise<Profiles[]> {
    let query = `SELECT ${profileColumns} FROM profile p LEFT JOIN shortlist sh  ON p.id = sh.short_id AND sh.profile_id = ${profile_id}  WHERE p.gender = '${gender}' `;
    if (preference) {
      if (preference.age) {
        const age: any = preference.age;
        query += ` AND age BETWEEN ${age.from} and ${age.to}`;
      }
      if (preference.height) {
        const height: any = preference.height;
        query += ` AND height BETWEEN ${height.from} and ${height.to}`;
      }
      if (preference.religion) {
        query += ` AND religion in (${preference.religion})`;
      }
      if (preference.caste) {
        query += ` AND caste in (${preference.caste})`;
      }
    }
    if (filter && filter.limit && filter.skip) {
      query += ` LIMIT ${filter.skip},${filter.limit}`;
    }
    return this.dataSource.execute(query);
  }

  async getDailyRecomentationCount(
    gender: string,
    preference: Preference,
    profile_id: number,
  ): Promise<Profiles[]> {
    let query = `SELECT count(*) count FROM profile p LEFT JOIN shortlist sh  ON p.id = sh.short_id AND sh.profile_id = ${profile_id}  WHERE p.gender = '${gender}' `;
    if (preference) {
      if (preference.age) {
        const age: any = preference.age;
        query += ` AND age BETWEEN ${age.from} and ${age.to}`;
      }
      if (preference.height) {
        const height: any = preference.height;
        query += ` AND height BETWEEN ${height.from} and ${height.to}`;
      }
      if (preference.religion) {
        query += ` AND religion in (${preference.religion})`;
      }
      if (preference.caste) {
        query += ` AND caste in (${preference.caste})`;
      }
    }
    const result: any = await this.dataSource.execute(query);
    return result[0] && result[0].count ? result[0].count : 0;
  }

  async getPereferenceMatch(
    gender: string,
    preference: Preference,
    profile_id: number,
    filter: CustomeFilter,
  ): Promise<Profiles[]> {
    let query = `SELECT ${profileColumns} FROM profile p LEFT JOIN shortlist sh  ON p.id = sh.short_id AND sh.profile_id = ${profile_id}  WHERE p.gender = '${gender}' `;
    if (preference) {
      if (preference.age) {
        const age: any = preference.age;
        query += ` AND age BETWEEN ${age.from} and ${age.to}`;
      }
      if (preference.height) {
        const height: any = preference.height;
        query += ` AND height BETWEEN ${height.from} and ${height.to}`;
      }
      if (preference.religion) {
        query += ` AND religion in (${preference.religion})`;
      }
      if (preference.caste) {
        query += ` AND caste in (${preference.caste})`;
      }
      // if (preference.smoking_habits) {
      //   query += ` AND smoking_habit in (${preference.smoking_habits})`;
      // }
      // if (preference.drinking_habits) {
      //   query += ` AND drinking_habit in (${preference.drinking_habits})`;
      // }
      // if (preference.eating_habits) {
      //   query += ` AND eating_habit in (${preference.eating_habits})`;
      // }
    }
    if (filter && filter.limit && filter.skip) {
      query += ` LIMIT ${filter.skip},${filter.limit}`;
    }
    return this.dataSource.execute(query);
  }

  async getPereferenceMatchCount(
    gender: string,
    preference: Preference,
    profile_id: number,
  ): Promise<number> {
    let query = `SELECT count(*) count FROM profile p LEFT JOIN shortlist sh  ON p.id = sh.short_id AND sh.profile_id = ${profile_id}  WHERE p.gender = '${gender}' `;
    if (preference) {
      if (preference.age) {
        const age: any = preference.age;
        query += ` AND age BETWEEN ${age.from} and ${age.to}`;
      }
      if (preference.height) {
        const height: any = preference.height;
        query += ` AND height BETWEEN ${height.from} and ${height.to}`;
      }
      if (preference.religion) {
        query += ` AND religion in (${preference.religion})`;
      }
      if (preference.caste) {
        query += ` AND caste in (${preference.caste})`;
      }
      // if (preference.smoking_habits) {
      //   query += ` AND smoking_habit in (${preference.smoking_habits})`;
      // }
      // if (preference.drinking_habits) {
      //   query += ` AND drinking_habit in (${preference.drinking_habits})`;
      // }
      // if (preference.eating_habits) {
      //   query += ` AND eating_habit in (${preference.eating_habits})`;
      // }
    }

    const result: any = await this.dataSource.execute(query);
    return result[0] && result[0].count ? result[0].count : 0;
  }
}
