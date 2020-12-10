import { Entity, PrimaryGeneratedColumn, Column, Binary, OneToMany } from "typeorm";
import { Contains, IsEmail, IsFQDN, IsDate, Min, Max } from "class-validator";
import { ProfileMeta } from "./ProfileMeta";


@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, unique: true })
  public_id: string;

  @Column()
  slug: string;

  @Column({ default: "" })
  avatar: string;

  @Column({ default: "" })
  bgImage: string;

  @Column({ default: "" })
friends: string;
  
  @OneToMany(() => ProfileMeta, metadata => metadata.id)
  metadatas: ProfileMeta[];
}
