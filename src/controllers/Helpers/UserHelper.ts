import { User } from "../../models/src/entity/User";
import { Argon2Hash } from "../../shared/libs/EncryptionUtils";

export class UserHelper {

  protected _user: User;
  protected _repo: any;

  constructor(conn:any, user: User = new User()) {

    this._user = user;
    this._repo = conn.getRepository(User);
      
  }

  async createNewUser(userData: any) {
    

    return new Promise((resolve, reject) => {
      this.setPassword(userData.password).then((hashStr: string) => {
        const u = this._user;
        u.email = userData.email;
        u.password = hashStr;
        u.name = userData.fullname;
        u.given_name = userData.givenName;
        u.middle_name = userData.middleName;
        u.family_name = userData.lastName;
        u.birthdate = userData.birthdate;
        u.gender = userData.gender;
        u.phone_number = userData.phone_number;
  
        this._repo.save(u).then((newuser: User) => {
          if (newuser) {
            resolve(newuser);
          }
        }).catch(err => reject(err));
        
         
      }).catch(err => reject(err))
    })
  }

  async updatePassword(oldPass: string, newPass: string) {
    
  }

  async setPassword(passString: string): Promise<string> {
    
    try {
      let hash = Argon2Hash(passString);
      if (hash) {
        return hash;
      }
    } catch (e) {
      return e;
      }

  }

  async updateUser(userid: number, key:string, value:string) {
    
    try {

      let u = await this._repo.findOne(userid);
      if (u) {
        
        u[key] = value;

        return this._repo.save(u);

      }

    } catch (e) {
      return e;
    }

  }

  async deleteUser(userid: number) {
    
    try {

      let u = await this._repo.findOne(userid);
      if (u) {
        
        
        return this._repo.remove(u!);

      }

    } catch (e) {
      return e;
    }

  }




}