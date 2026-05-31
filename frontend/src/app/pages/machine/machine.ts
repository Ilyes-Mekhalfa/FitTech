import { Component } from '@angular/core';
import { MachineService } from '../../core/services/machine.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
@Component({
  selector: 'app-machine',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './machine.html',
  styleUrl: './machine.css',
})
export class Machine {
  machines: any;
  originalList: any;
  currentFilter: string = 'all'
  selectedMachine: any;
  newMachine: boolean= false;
  addMachineData : FormGroup
  constructor(
    private machineService: MachineService,
    private fb: FormBuilder
  ) {
    this.addMachineData = this.fb.group({
      name:['', Validators.required],
      type: ['', Validators.required],
      description: ['', Validators.required]
    })
  }

  ngOnInit() {
    this.machineService.getMachines().subscribe({
      next: (res) => {
        console.log(res);
        this.machines = res;
        this.originalList = res;
      },
    });
  }

  selectMachine(machine: any) {
    if (!this.selectedMachine) {
      this.selectedMachine = machine;
    } else {
      this.selectedMachine = null;
    }
  }

  addMachine() {
    this.newMachine = true;
  }

  cancelAddMachine() {
    this.newMachine = false;
    this.addMachineData.reset();
  }

  submitMachine() {
    if(!this.addMachineData.valid){
      throw new Error('form invalid')
    }
    this.machineService.addMachine(this.addMachineData.value).subscribe({
      next: (res)=>{
        console.log(res);
        this.newMachine = false;
      },
      error: (err)=>{
        console.log('error adding machine', err);
      }
    })
  }
  deleteMachine(machine: any) {
    this.machineService.deleteMachine(machine.id).subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (err) => {
        console.log('error deleting machine', err);
      },
    });
  }

  filterMachine(type: string) {
    this.currentFilter = type;
    if (type == 'all') {
      this.machines = [...this.originalList];
    } else if (type === 'free'){
      this.machines = this.originalList.filter((e:any)=> e.type === 'free_weight')
    } else {
      this.machines = this.originalList.filter((e:any)=> e.type === 'machine')
    }
  }
  searchMachine(event: any){
    const value = (event.target as HTMLInputElement).value;
    this.machines = this.originalList.filter((e:any)=> e.name.toLowerCase().includes(value.toLowerCase()) && (this.currentFilter == 'all' || e.type == this.currentFilter))
    
  }
  closePreview() {
    this.selectedMachine = null;
  }
}
