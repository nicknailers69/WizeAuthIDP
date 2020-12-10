import { Entity, PrimaryGeneratedColumn, Column, Binary, ManyToOne } from "typeorm";
import { Contains, IsEmail, IsFQDN, IsDate, Min, Max } from "class-validator";
import { Profile } from "./Profile";


@Entity()
export class ProfileMeta {
    @PrimaryGeneratedColumn()
    id: number;

  @Column({ nullable: false })
  meta_name: string;

  @Column({nullable:false})
  meta_value: string;

  @Column()
  meta_iso_lang: string;

  @Column()
  meta_permissions: string;
  
  @ManyToOne(() => Profile, profile => profile.metadatas)
  profile: Profile;
  
}
