import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDbConnectionDataSource} from '../datasources';
import {Images, ImagesRelations} from '../models';

export class ImagesRepository extends DefaultCrudRepository<
  Images,
  typeof Images.prototype.pro_id,
  ImagesRelations
> {
  constructor(
    @inject('datasources.MysqlDbConnection') dataSource: MysqlDbConnectionDataSource,
  ) {
    super(Images, dataSource);
  }
}
