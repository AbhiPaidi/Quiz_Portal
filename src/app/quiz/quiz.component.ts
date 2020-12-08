import { Component, OnInit } from '@angular/core';

import { QuizService } from '../services/quiz.service';
import { HelperService } from '../services/helper.service';
import { Option, Question, Quiz, QuizConfig } from '../models/index';
import { CreateQuizService } from '../services/create-quiz.service';
import { LoginServiceService } from '../services/login-service.service';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css'],
  providers: [QuizService]
})
export class QuizComponent implements OnInit {
  quizes: any[];
  quiz: Quiz = new Quiz(null);
  mode = 'quiz';
  quizName: string;
  config: QuizConfig = {
    'allowBack': true,
    'allowReview': true,
    'autoMove': false,  // if true, it will move to next question automatically when answered.
    'duration': 300,  // indicates the time (in secs) in which quiz needs to be completed. 0 means unlimited.
    'pageSize': 1,
    'requiredAll': true,  // indicates if you must answer all the questions before submitting.
    'richText': false,
    'shuffleQuestions': true,
    'shuffleOptions': true,
    'showClock': false,
    'showPager': true,
    'theme': 'none'
  };



  pager = {
    index: 0,
    size: 1,
    count: 1
  };
  timer: any = null;
  startTime: Date;
  endTime: Date;
  ellapsedTime = '00:00';
  duration = '';
  mQname;
  createdby;
  username;
  firstname;
  lastname;
  quizDuration;

  constructor(private quizService: QuizService,  private cquizservice : CreateQuizService,  private ls  :LoginServiceService) { }

  ngOnInit() {
    this.quizes = this.quizService.getAll();
    // this.quizName = this.quizes[0].id;

    this.quizDuration = (parseInt(sessionStorage.getItem('quizDuration')) * 60);
    this.config.duration = this.quizDuration;
    this.mQname = sessionStorage.getItem("quizname");
    this.createdby = sessionStorage.getItem("createdby");
    this.username = sessionStorage.getItem("username");
    this.firstname = sessionStorage.getItem('firstname');
    this.lastname = sessionStorage.getItem('lastname');
    this.loadQuiz(this.mQname);
  }

  loadQuiz(quizName: string) {
    this.quizService.get(quizName).subscribe(res => {
      this.quiz = new Quiz(res);
      this.pager.count = this.quiz.questions.length;
      this.startTime = new Date();
      this.ellapsedTime = '00:00';
      this.timer = setInterval(() => { this.tick(); }, 1000);
      this.duration = this.parseTime(this.config.duration);
    });
    this.mode = 'quiz';
  }

  onlyonce = 1;

  tick() {
    const now = new Date();
    const diff = (now.getTime() - this.startTime.getTime()) / 1000;
    if (diff >= this.config.duration) {
      this.onlyoncesubmit()
    }
    this.ellapsedTime = this.parseTime(diff);
  }

  onlyoncesubmit(){
    if(this.onlyonce == 1){
      this.onlyonce = 0;
      this.onSubmit();
    }
  }

  parseTime(totalSeconds: number) {
    let mins: string | number = Math.floor(totalSeconds / 60);
    let secs: string | number = Math.round(totalSeconds % 60);
    mins = (mins < 10 ? '0' : '') + mins;
    secs = (secs < 10 ? '0' : '') + secs;
    return `${mins}:${secs}`;
  }

  get filteredQuestions() {
    return (this.quiz.questions) ?
      this.quiz.questions.slice(this.pager.index, this.pager.index + this.pager.size) : [];
  }

  onSelect(question: Question, option: Option) {
    if (question.questionTypeId === 1) {
      question.options.forEach((x) => { if (x.id !== option.id) x.selected = false; });
    }

    if (this.config.autoMove) {
      this.goTo(this.pager.index + 1);
    }
  }

  goTo(index: number) {
    if (index >= 0 && index < this.pager.count) {
      this.pager.index = index;
      this.mode = 'quiz';
    }
  }

  isAnswered(question: Question) {
    return question.options.find(x => x.selected) ? 'Answered' : 'Not Answered';
  };

  isCorrect(question: Question) {
    return question.options.every(x => x.selected === x.isAnswer) ? 'correct' : 'wrong';
  };

  b = parseInt("0");
  onSubmit() {
    let answers = [];
    this.quiz.questions.forEach(x => answers.push({ 'quizId': this.quiz.id, 'questionId': x.id, 'answered': x.answered }));

    // Post your data to the server here. answers contains the questionId and the users' answer.
    this.mode = 'result';
    for (var val of this.quiz.questions) {
      if(this.isCorrect(val)=='correct'){
        this.b = this.b+1;
      }
    }
    this.ls.setquizStatus(false);
    this.updateMarks();
  }

  updatemarksresponse;
  updateMarks(){
    sessionStorage.clear();
    console.log(this.username, this.b, this.createdby, this.mQname);
    this.cquizservice.updateMarks(String(this.firstname+" "+this.lastname), this.b, this.createdby,this.mQname).subscribe(Response=>{
    this.updatemarksresponse = Response;
    this.b =parseInt("0");
    })
  }
}
