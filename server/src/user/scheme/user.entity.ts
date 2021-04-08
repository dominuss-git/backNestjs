import { Address } from '../../address/scheme/address.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column()
  surname: string;

  @Column()
  skils: string;

  @OneToOne(() => Address)
  @JoinColumn()
  addressId: Address;

  @Column({ type: 'date', default: new Date(Date.now()) })
  date: Date;
}
