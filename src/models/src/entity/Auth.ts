import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm";



import { Client } from "./Client";
import { User } from "./User";

@Entity()
export class Auth {

    @PrimaryGeneratedColumn()
    Identity: number;

   
    @OneToOne(type => User) @JoinColumn()
    User: User;


  @OneToOne(type => Client) @JoinColumn()
  Client: Client;
    
  @Column()
  scope: string;
  
  @Column({ nullable: false })
  sub: string;

  @Column({ nullable: false })
  code: string;

  @Column({ nullable: false })
  redirectUri: string;

  @Column({ nullable: false })
  responseType: string;

  @Column({ nullable: false })
  status: string;

  @Column({ nullable: false })
  accessTokens: string;

  @Column({ nullable: false })
  refreshTokens: string;

}
