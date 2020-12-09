import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm";
import {  IsBoolean } from "class-validator";


import { User } from "./User";

@Entity()
export class Client {

    @PrimaryGeneratedColumn()
    Identity: number;

    @Column({unique:true, nullable:false})
    Key: string;

    @Column({unique:true, nullable:false})
    Secret: string;
    
    @Column({ unique: true, nullable: false })
    Name: string;

    @Column()
    Image: string;

    @OneToOne(type => User) @JoinColumn()
    User: User;


    @Column({array:true, type:"string"})
    redirect_uris:string[];

    
    @Column()
    @IsBoolean()
    credentialsFlow: boolean;

}
