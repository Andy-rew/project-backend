import {
  Model,
  Column,
  Table,
  AllowNull,
  ForeignKey,
  PrimaryKey,
} from 'sequelize-typescript';

import { DB_SCHEMA } from '../util/secrets';
import { User } from './User';

@Table({
  comment: 'промужуточная таблица зависимостей',
  timestamps: false,
  schema: DB_SCHEMA,
})
export class Dependences extends Model<Dependences> {

  @PrimaryKey
  @Column
  registryNumber: number;

 @Column
 @ForeignKey(() => User)
 guilty: number[]

  @Column
  @ForeignKey(() => User)
  victim: number[]

 @Column
  @ForeignKey(() => User)
  suspect: number[]

@Column
  @ForeignKey(() => User)
  witness: number[]


}
