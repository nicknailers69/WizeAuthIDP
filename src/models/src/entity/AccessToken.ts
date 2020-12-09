import { TokenExpiredError } from "jsonwebtoken";
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm";



import { Client } from "./Client";
import { User } from "./User";
import { Auth } from "./Auth";

@Entity()
export class AccessToken {

    @PrimaryGeneratedColumn()
    Identity: number;

  @Column({ nullable: false })
  token: string;

  @Column({ nullable: false })
  type: string;

  @Column()
  idToken: string;

  @Column()
  expiresIn: number;

  @Column({ nullable: false })
  scope: string;

  @OneToOne(type => Client) @JoinColumn()
  client: Client;

  @OneToOne(type => User) @JoinColumn()
  user: User;

  @OneToOne(type => Auth) @JoinColumn()
  auth: Auth;
  
}
