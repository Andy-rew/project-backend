
import {
  AllowNull,
  Column,
  CreatedAt,
  DataType,
  DefaultScope,
  DeletedAt,
  IsEmail,
  Model, PrimaryKey,
  Table,
  Unique,
  UpdatedAt,
  HasMany, BelongsToMany, BelongsTo
} from 'sequelize-typescript';

import { DB_SCHEMA } from '../util/secrets';
import { Relation } from './Relation';
import { Accident } from './Accident';


@Table({ comment: 'Лица', schema: DB_SCHEMA })
export class People extends Model<People> {

  @HasMany(() => Relation)
  relationsLink: Relation[];

  @BelongsToMany(() => Accident, () => Relation)
  acccidentPerson: Accident[];

  // @PrimaryKey
  // @Column
  // personId!: number;

  @Column
  name!: string;

  @Column
  surname!: string;

  @Column
  midname?: string;

  @Column
  address?: string;

  @Column
  convictNum?: number;

  @CreatedAt
  @Column
  createdAt!: Date;

  @UpdatedAt
  @Column
  updatedAt!: Date;

  @DeletedAt
  @Column
  deletedAt?: Date;
}
