import { Component } from '@angular/core';
import { MachineService } from '../../core/services/machine.service'
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-machine',
  imports: [CommonModule],
  templateUrl: './machine.html',
  styleUrl: './machine.css',
})
export class Machine {

  machines: any;
  selectedMachine: any;
  constructor(private machineService: MachineService, private router: Router){}

  ngOnInit(){
    this.machineService.getMachines().subscribe({
      next: (res)=>{
        console.log(res)
        this.machines = res;
      }
    })
  }

  selectMachine(machine: any){
    if(!this.selectedMachine){
      this.selectedMachine = machine;
    }else{
      this.selectedMachine = null
    }
  }

  addMachine(){
    // this.router.navigate(['/machine/add'])
  }

  closePreview(){
    this.selectedMachine = null;
  }
}
