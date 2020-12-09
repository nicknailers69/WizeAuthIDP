import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm";



import { Client } from "./Client";
import { User } from "./User";

@Entity()
export class Consent {

    @PrimaryGeneratedColumn()
    Identity: number;

   
    @OneToOne(type => User) @JoinColumn()
    User: User;


  @OneToOne(type => Client) @JoinColumn()
  Client: Client;
    
    @Column({array:true, type:"string"})
    scopes: string[]
}
