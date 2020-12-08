import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class QuizService {

  constructor(private http: HttpClient) { }

  get(url: string) {
    if (url == "JavaScript")
      return this.http.get("data/javascript.json");
    else if (url == "IOT")
      return this.http.get("data/aspnet.json");
    else if (url == "SE")
      return this.http.get("data/designPatterns.json");
    else if (url == "cSharp")
      return this.http.get("data/csharp.json");


  }

  getAll() {
    return [
      { id: 'data/javascript.json', name: 'JavaScript' },
      { id: 'data/aspnet.json', name: 'Asp.Net' },
      { id: 'data/csharp.json', name: 'C Sharp' },
      { id: 'data/designPatterns.json', name: 'Design Patterns' }
    ];
  }

}
