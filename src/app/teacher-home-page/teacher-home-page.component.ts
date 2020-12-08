import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CreateQuizService } from '../services/create-quiz.service';
import { FileUploadService } from '../services/file-upload.service';
import { LoginServiceService } from '../services/login-service.service';

@Component({
  selector: 'app-teacher-home-page',
  templateUrl: './teacher-home-page.component.html',
  styleUrls: ['./teacher-home-page.component.css']
})
export class TeacherHomePageComponent implements OnInit {

  constructor(private fileUploadService: FileUploadService , private quizservice : CreateQuizService, private route: Router , private ls  :LoginServiceService) { }

  ngOnInit(): void {
    this.username = sessionStorage.getItem('username');
    this.firstname = sessionStorage.getItem('firstname');
    this.lastname = sessionStorage.getItem('lastname');
    this.getquiz();
  }


  refresh(){
    this.getquiz()
  }

  shortLink: string = "";
  loading: boolean = false; // Flag variable
  file: File = null;
  quizName;
  quizDuration;
  quizSection;
  firstname;
  lastname;

  username;
  onChange(event)
  {
    this.file = event.target.files[0];
  }

  // OnClick of button Upload
  onUpload() {
      this.loading = !this.loading;
      console.log(this.file);
      this.fileUploadService.upload(this.file).subscribe(
          (event: any) => {
              if (typeof (event) === 'object') {

                  // Short link via api response
                  this.shortLink = event.link;

                  this.loading = false; // Flag variable
              }
          }
      );
  }


  signOut(){
    sessionStorage.clear();
    console.log(sessionStorage)
    this.ls.setteacherLoginStatus(false);
    this.route.navigate(['']);
  }


  cquizmessage;
  allQuiz;
  createQuiz(){
    this.quizservice.createQuiz(this.username, this.quizName, this.quizDuration, this.quizSection, this.shortLink).subscribe(Response=>{
      this.cquizmessage = Response;
      this.getquiz();
      console.log(this.cquizmessage);
    })
    this.getquiz();
  }

  getquiz(){
    this.quizservice.getQuizes(this.username).subscribe(Response=>{
      this.allQuiz = Response;
    })
  }


  dQuizResponse:any;
  deleteQuiz(quizName:any){
    this.quizservice.deleteQuiz(this.username, quizName).subscribe(Response=>{
      this.dQuizResponse = Response['message'];
      this.getquiz();
    })
    this.getquiz();
  }

  resultskeys:any;
  allresults:any;
  resultsQuizname:any= "Quiz Name";
  getresults(quizName:any, createdby:any){
    this.resultsQuizname = quizName;
    this.quizservice.viewResults(quizName,createdby).subscribe(Response=>{
      this.allresults = Response;
      console.log(this.allresults);
      this.resultskeys= Object.keys(this.allresults)
      console.log(this.resultskeys);
      let X = JSON.stringify(this.allresults)
      console.log(X);

    })
  }



}
