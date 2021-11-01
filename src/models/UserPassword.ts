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
  PrimaryKey,
} from 'sequelize-typescript';

import { DB_SCHEMA } from '../util/secrets';

import { User } from './User';

@Table({
  comment: 'Пароль и активационный код (для регистрации) пользователя',
  schema: DB_SCHEMA,
})
export class UserPassword extends Model<UserPassword> {
  @BeforeCreate
  @BeforeUpdate
  static setPassword(user: UserPassword): void {
    if (user.changed('password')) {
      user.salt = UserPassword.generateSalt();
      user.password = UserPassword.encryptText(user.password, user.salt);
    }
  }

  @BeforeCreate
  static setActivationCodeOnCreate(user: UserPassword): void {
    const HOURS_TO_TERMINATE_ACTIVATION_CODE = 24 * 5;
    user.setActivationCode(HOURS_TO_TERMINATE_ACTIVATION_CODE);
  }

  @BeforeUpdate
  static setActivationCodeOnUpdate(user: UserPassword): void {
    const HOURS_TO_TERMINATE_ACTIVATION_CODE = 24;
    user.setActivationCode(HOURS_TO_TERMINATE_ACTIVATION_CODE);
  }

  static generateSalt(): string {
    return crypto.randomBytes(16).toString('base64');
  }

  static encryptText(plainText: string, salt: string): string {
    const CRYPTO_ALGO = 'RSA-SHA256';
    return crypto
      .createHash(CRYPTO_ALGO)
      .update(plainText)
      .update(salt)
      .digest('hex');
  }

  public isPasswordCorrect(enteredPassword: string): boolean {
    return (
      UserPassword.encryptText(enteredPassword, this.salt) === this.password
    );
  }

  private setActivationCode(hoursToTerminateActivationCode: number) {
    if (this.changed('activationCode')) {
      if (_.isNil(this.activationCode)) {
        this.activationCodeStopDate = null;
        return;
      }
      const salt = UserPassword.generateSalt();
      this.activationCode = UserPassword.encryptText(this.activationCode, salt);
      this.activationCodeStopDate = moment()
        .add(hoursToTerminateActivationCode, 'hours')
        .toDate();
    }
  }

  @BelongsTo(() => User)
  user: User;

  @PrimaryKey
  @ForeignKey(() => User)
  @AllowNull(false)
  @Column
  userId: number;

  @AllowNull
  @Column
  password?: string;

  @AllowNull
  @Column
  salt?: string;

  @AllowNull
  @Column
  activationCode?: string;

  @AllowNull
  @Column(DataType.DATE)
  activationCodeStopDate?: Date;

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
