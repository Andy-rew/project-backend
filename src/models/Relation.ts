import crypto from 'crypto';
import moment from 'moment';
import _ from 'lodash';
import {
  Model,
  Column,
  Table,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  AllowNull,
  ForeignKey,
  BelongsTo,
  BeforeCreate,
  BeforeUpdate,
  DataType,
  PrimaryKey, AutoIncrement
} from 'sequelize-typescript';

import { DB_SCHEMA } from '../util/secrets';
import { Accident } from './Accident';
import { Person } from './Person';


@Table({
  comment: '',
  schema: DB_SCHEMA,
})
export class Relation extends Model<Relation> {

  // @BelongsTo(() => Person)
  // person: Person;
  //
  // @BelongsTo(() => Accident)
  // accident: Accident;

  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @CreatedAt
  @Column
  createdAt!: Date;

  @UpdatedAt
  @Column
  updatedAt!: Date;


 @ForeignKey(() => Person)
  @AllowNull(false)
  @Column
  personId!: number;

  @ForeignKey(() => Accident)
  @AllowNull(true)
  @Column
  accidentId?: number;

}
