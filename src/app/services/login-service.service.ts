import { Injectable, TemplateRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoginServiceService {

  constructor(private http: HttpClient) { }

  TeacherSignupcheck(userN:any,pass:any,FN:any,LN:any,role:any,Id:any){
    return this.http.post('http://127.0.0.1:8000/signUp',{"username" : userN,"password" : pass,"firstName":FN,"lastName":LN,"role": role , "id": Id,"section":"All"})
  }

  StudentSignupcheck(userN:any,pass:any,FN:any,LN:any,role:any,Id:any,Section:any){
    console.log(userN,pass,FN,LN,role,Id,Section );
    return this.http.post('http://127.0.0.1:8000/signUp',{"username" : userN,"password" : pass,"firstName":FN,"lastName":LN,"role": role,"id": Id, "section":Section})
  }

  Logincheck(userN:any,pass:any){
    return this.http.get('http://127.0.0.1:8000/login',{params:{username : userN,password : pass}})
  }

  checkUser(userN:any){
    return this.http.get('http://127.0.0.1:8000/checkUser',{params:{username:userN}})
  }

  NewPass(userN:any){
    return this.http.get('http://127.0.0.1:8000/genpassword',{params:{username:userN}})
  }

  updatePassword(userN:any,pass:any,code:any){
    return this.http.put('http://127.0.0.1:8000/updatePassword',{"username":userN,"password":pass,"code":code})
  }


  studentloginstatus =false;
  setstudentLoginStatus(status : boolean){
    this.studentloginstatus = status;
  }

  getstudentLoginStatus(){
    return(this.studentloginstatus)
  }


  teacherloginstatus =false;
  setteacherLoginStatus(status : boolean){
    this.teacherloginstatus = status;
  }

  getteacherLoginStatus(){
    return(this.teacherloginstatus)
  }

  allowquizstatus = false;
  setquizStatus(status : boolean){
    this.allowquizstatus = status;
  }

  getquizStatus(){
    return(this.allowquizstatus)
  }

}
