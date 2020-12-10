import { Entity, PrimaryGeneratedColumn, Column, Binary, OneToOne, JoinColumn } from "typeorm";
import { Contains, IsEmail, IsFQDN, IsDate, Min, Max } from "class-validator";
import { Profile } from "./Profile";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique:true, nullable:false})
    name: string;

    @Column( {default:""})
    given_name: string;

    @Column( {default:""})
    middle_name: string;

    @Column( {default:""})
    family_name: string;

    @Column({ default: "" })
    nickname: string;

    @Column({ unique: true, nullable: false })
    @IsEmail()   
    email: string;

    @Column({nullable:false})
    password: string;

    // will be base64 buffer
    @Column( {default:""})
    picture: string;

    @Column({ default: '' })
    birthdate: string;

    @Column( {default:"male"})
    @Contains("male" || "female" || "other")
    gender: string;

    @Column( {default:""})
    phone_number: string;

    @OneToOne(() => Profile)
    @JoinColumn()
    profile:Profile;

}
