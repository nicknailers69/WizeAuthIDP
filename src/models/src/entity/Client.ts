import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";
@Entity()
export class Client {

    @PrimaryGeneratedColumn()
    ID:string;

    @Column()
    OutfacingID:string;

    @Column()
    Name:string;

    @Column()
    Secret:string;

    @Column()
    redirect_uris:string;

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
