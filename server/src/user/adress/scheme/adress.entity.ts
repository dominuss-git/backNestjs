import { User } from "src/user/scheme/user.entity";
import { Column, Entity, OneToOne, PrimaryGeneratedColumn, TableForeignKey } from "typeorm";


@Entity()
export class Adress {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  street: string;

  @Column()
  home: number;

  @Column()
  flat: number;

  @OneToOne(type => User, user => user.id)
  user: string;

}