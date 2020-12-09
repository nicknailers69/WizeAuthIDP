import {Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn} from "typeorm";
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


    @Column({array:true, type:"string"})
    redirect_uris:string[];

    @Column()
    grant_types:string;

    @Column()
    response_types:string;

    @Column()
    scope:string;

    @Column()
    audience:string;

    @Column()
    owner:string;

    @Column()
    policy_url:string;

    @Column()
    allowed_cors_origins:string;

    @Column()
    terms_of_service_uri:string;

    @Column()
    client_uri:string;


    @Column()
    logo_uri:string;

    @Column()
    contacts:string;

    @Column()
    metadata:string;

}
