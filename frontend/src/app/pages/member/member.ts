import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-member',
  imports: [],
  templateUrl: './member.html',
  styleUrl: './member.css',
})
export class Member {

  constructor(router : Router){}

  addMember(){
    return 1
  }
}
