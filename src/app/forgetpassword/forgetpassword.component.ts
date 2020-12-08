import { Component, OnInit , TemplateRef} from '@angular/core';
import { Router } from '@angular/router';
import { LoginServiceService } from '../services/login-service.service';

@Component({
  selector: 'app-forgetpassword',


  templateUrl: './forgetpassword.component.html',
  styleUrls: ['./forgetpassword.component.css']


})
export class ForgetpasswordComponent implements OnInit {


  constructor(private ls: LoginServiceService, private route: Router) { }

  ngOnInit(): void {

  }


  firstname;
  lastname;
  username;
  password;
  role:any;
  token:any = "";
  userFound ="";
  match:any;
  verify=false;
  code:any;
  updateisdone=false;
  invalidCredentials= false;




  genpass(){
    this.ls.NewPass(this.username).subscribe(
      response=>{
        this.match=response['message'];
        if(this.match == "verificationCodeSent")
        {
          this.verify=true;
          this.match='True'
        }
        else
        {
          this.match='False';
        }
      }
    )
  }

  updatePassword(){
    this.ls.updatePassword(this.username,this.password,this.code).subscribe(
      response=>{
        this.match = response['message'];
        if(this.match=='passwordUpdated'){
          this.match ='True';
        }
        else{
          this.match='False';
        }
        this.verify=false;
        this.updateisdone=true;
      }
    )
  }



}
