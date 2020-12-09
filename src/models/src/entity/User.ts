import { Entity, PrimaryGeneratedColumn, Column, Binary } from "typeorm";
import { Contains, IsEmail, IsFQDN, IsDate, Min, Max } from "class-validator";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique:true, nullable:false})
    name: string;

    @Column()
    given_name: string;

    @Column()
    middle_name: string;

    @Column()
    family_name: string;

    @Column()
    profile: string;

    @Column({ unique: true, nullable: false })
    @IsEmail()   
    email: string;

    @Column()
    password: string;

    // will be base64 buffer
    @Column()
    picture: string;

    @Column()
    @IsDate()
    birthdate: Date;

    @Column()
    @Contains("male" || "female" || "other")
    gender: string;

    @Column()
    phone_number: string;


}
