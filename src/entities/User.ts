import { IsEmail, Length } from "class-validator";
import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import crypt from "bcryptjs";
import crypto from "crypto";
import { config } from "dotenv";
import {
  PASSWORD_PIN_EXPIRATION_IN_MINUTES,
  EMAIL_PIN_EXPIRATION_IN_MINUTES,
} from "../constatns";
import EmailSender from "../helpers/EmailSender";

config();

/**
 * TODO:
 *
 * User entity should generate random token and pin and asign it to password_reset_[token | pin]
 * when the user try to reset his password
 *
 */
@Entity("users")
export class User extends BaseEntity {
  @BeforeInsert()
  async on_register() {
    this.password = await crypt.hash(this.password, 12);
    const pin = crypto.randomBytes(4).toString("hex");
    this.emailValidationPin = await crypt.hash(pin, 12);
    this.emailValidationPin_expires_at = await new Date(
      new Date().getTime() + EMAIL_PIN_EXPIRATION_IN_MINUTES * 60000
    );
    new EmailSender(this, "", pin).sendValidationEmail();
  }

  @PrimaryGeneratedColumn("uuid")
  uuid: string;

  // required fields
  @Length(2, 20)
  @Column("varchar")
  first_name: string;

  @Column("varchar")
  @Length(2, 20)
  last_name: string;

  @Column()
  @Length(5, 20)
  user_name: string;

  // Email fields
  @Column({
    type: "varchar",
    unique: true,
  })
  @IsEmail()
  email: string;

  @Column({
    type: "timestamptz",
    nullable: true,
  })
  emailValidateAt: Date | null;

  @Column({
    type: "varchar",
    select: false,
  })
  password: string;

  @Column({
    type: "varchar",
    nullable: true,
    select: false,
  })
  emailValidationPin: string | null;

  @Column({
    type: "timestamptz",
    nullable: true,
    select: false,
  })
  emailValidationPin_expires_at: Date | null;

  @Column({
    type: "varchar",
    nullable: true,
  })
  phoneNumber: string;

  @Column("date")
  dob: Date;

  @Column({
    type: "text",
    nullable: true,
  })
  bio: string;

  @Column({
    type: "boolean",
    default: true,
  })
  is_active: boolean;

  @Column({
    type: "timestamptz",
    nullable: true,
  })
  id_verified_at: Date | null;

  @Column({
    type: "varchar",
    default: "https://www.gravatar.com/avatar/?s=200&r=pg&d=mp",
  })
  profilePictureUrl: string;

  @Column({
    type: "timestamptz",
    nullable: true,
    select: false,
  })
  passwordChangedAt: Date | null;

  @Column({
    type: "varchar",
    nullable: true,
    select: false,
  })
  passwordResetToken: string | null;

  @Column({
    type: "varchar",
    nullable: true,
    select: false,
  })
  passwordResetPin: string | null;

  @Column({
    type: "timestamptz",
    nullable: true,
    select: false,
  })
  passwordResetPinExpiresAt: Date | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn({ select: false })
  updatedAt: Date;

  // Helpers
  public async createAndSendPasswordResetPin() {
    try {
      const pin = crypto.randomBytes(4).toString("hex");
      this.passwordResetPin = await crypt.hash(pin, 12);
      this.passwordResetPinExpiresAt = await new Date(
        new Date().getTime() + PASSWORD_PIN_EXPIRATION_IN_MINUTES * 60000
      );
      this.save();
      new EmailSender(this, "", pin).sendPasswordReset();
    } catch (e) {
      this.passwordResetPin = null;
      this.passwordResetPinExpiresAt = null;
    }
  }
}
