import {
  Model,
  Column,
  Table,
  AllowNull,
  PrimaryKey, AutoIncrement, CreatedAt, UpdatedAt, DeletedAt, HasMany, DataType, BelongsToMany
} from 'sequelize-typescript';

import { DB_SCHEMA } from '../util/secrets';
import { Relation } from './Relation';
import { People } from './People';

@Table({
  comment: 'События',
  schema: DB_SCHEMA,
})
export class Accident extends Model<Accident> {

  @HasMany(() => Relation)
  relationsLink: Relation[];

  @BelongsToMany(() => People, () => Relation, 'accidentId')
  personAccident: People[];

  @PrimaryKey
  @AutoIncrement
  @Column
  accidentId!: number;

  @AllowNull(false)
  @Column
  info?: string

  @AllowNull(true)
  @Column
  solution!: string

  @CreatedAt
  @Column
  createdAt!: Date;

  @UpdatedAt
  @Column
  updatedAt!: Date;

  @DeletedAt
  @Column
  deletedAt?: Date;

  @AllowNull(false)
  @Column
  registerDate?: Date;

}
