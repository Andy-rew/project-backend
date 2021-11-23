import {
  Model,
  Column,
  Table,
  CreatedAt,
  UpdatedAt,
  AllowNull,
  ForeignKey,
  DataType,
  PrimaryKey, AutoIncrement
} from 'sequelize-typescript';

import { DB_SCHEMA } from '../util/secrets';
import { Accident } from './Accident';
import { People } from './People';


export enum Role {
  culprit = 'culprit', //виновник
  victim = 'victim', // потерпевший
  suspect = 'suspect', // подозреваемый
  witness = 'witness' // свидетель
}


@Table({
  comment: '',
  schema: DB_SCHEMA,
})
export class Relation extends Model<Relation> {

 @ForeignKey(() => People)
  @AllowNull(false)
  @Column
  personId!: number;

  @ForeignKey(() => Accident)
  @AllowNull(true)
  @Column
  accidentId?: number;

  @AllowNull(false)
  @Column(DataType.ENUM(...Object.values(Role)))
  role: Role


  @CreatedAt
  @Column
  createdAt!: Date;

  @UpdatedAt
  @Column
  updatedAt!: Date;

}
