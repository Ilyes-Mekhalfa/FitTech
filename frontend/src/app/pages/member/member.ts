import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MemberService } from '../../core/services/member.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-member',
  imports: [CommonModule],
  templateUrl: './member.html',
  styleUrl: './member.css',
})
export class Member implements OnInit {
  members: any[] = []
  planFilter: string = ''
  statusFilter: string = ''
  constructor(private router: Router, private memberService: MemberService) {}

  addMember() {
    return 1;
  }

  ngOnInit() {
    this.memberService.getAllMembers().subscribe({
      next: (res: any) => {
        console.log(res);
        
        this.members = res
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  setPlanFilter(e: string){
    this.planFilter = e
    console.log(this.planFilter);
    
  }

  setStatusFilter(e:string){
    this.statusFilter = e
    console.log(this.statusFilter);
    
    // this.members = this.members.filter((member:any)=> {
    //   return this.members.fitapi_user.status == this.statusFilter
    // })
  }

  applyFilter(){}
}
