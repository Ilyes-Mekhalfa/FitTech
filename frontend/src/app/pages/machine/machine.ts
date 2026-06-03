import { Component, OnInit, OnDestroy } from '@angular/core';
import { MachineService } from '../../core/services/machine.service';
import { WebsocketService } from '../../core/services/websocket.service'; // 1. Import your WebSocket Service
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs'; // 2. Import Subscription

@Component({
  selector: 'app-machine',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './machine.html',
  styleUrl: './machine.css',
})
export class Machine implements OnInit, OnDestroy {
  machines: any[] = [];
  originalList: any[] = [];
  currentFilter: string = 'all';
  selectedMachine: any;
  newMachine: boolean = false;
  addMachineData: FormGroup;

  // Track socket subscriptions so we can tear them down safely
  private socketSubscriptions: Subscription = new Subscription();

  constructor(
    private machineService: MachineService,
    private fb: FormBuilder,
    private websocketService: WebsocketService // 3. Inject the WebSocket service
  ) {
    this.addMachineData = this.fb.group({
      name: ['', Validators.required],
      type: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  ngOnInit() {
    // Load initial machines list via HTTP
    this.loadInitialMachines();

    // 4. Listen for real-time additions
    const addSub = this.websocketService.onEvent('machine_added').subscribe({
      next: (newMachineData: any) => {
        console.log('Real-time update: machine added', newMachineData);
        
        // Push to original list so filters/search can use it
        this.originalList.push(newMachineData);
        
        // Re-run your filtering logic so the item appears if it fits current view
        this.filterMachine(this.currentFilter);
      }
    });

    // 5. Listen for real-time deletions
    const deleteSub = this.websocketService.onEvent('machine_deleted').subscribe({
      next: (data: { id: string }) => {
        console.log('Real-time update: machine deleted', data.id);
        
        // Filter out from both tracking lists
        this.machines = this.machines.filter((m: any) => m.id !== data.id);
        this.originalList = this.originalList.filter((m: any) => m.id !== data.id);
        
        // Close preview panel if the active machine was the one deleted
        if (this.selectedMachine?.id === data.id) {
          this.closePreview();
        }
      }
    });

    // Store subscriptions
    this.socketSubscriptions.add(addSub);
    this.socketSubscriptions.add(deleteSub);
  }

  loadInitialMachines() {
    this.machineService.getMachines().subscribe({
      next: (res: any) => {
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
    if (!this.addMachineData.valid) {
      throw new Error('form invalid');
    }
    this.machineService.addMachine(this.addMachineData.value).subscribe({
      next: (res) => {
        console.log('Machine saved to database:', res);
        this.newMachine = false;
        this.addMachineData.reset(); // Clear the form fields
      },
      error: (err) => {
        console.log('error adding machine', err);
      }
    });
  }

  deleteMachine(machine: any) {
    if (confirm('Are you sure you want to delete this machine?')) {
      this.machineService.deleteMachine(machine.id).subscribe({
        next: (res) => {
          console.log('Delete command successfully pushed to backend', res);
        },
        error: (err) => {
          console.log('error deleting machine', err);
        },
      });
    }
  }

  filterMachine(type: string) {
    this.currentFilter = type;
    if (type == 'all') {
      this.machines = [...this.originalList];
    } else if (type === 'free') {
      this.machines = this.originalList.filter((e: any) => e.type === 'free_weight');
    } else {
      // It's a standard machine type
      this.machines = this.originalList.filter((e: any) => e.type === 'machine');
    }
  }

  searchMachine(event: any) {
    const value = (event.target as HTMLInputElement).value;
    // Map internal type names dynamically to catch current selections cleanly
    const mappedFilter = this.currentFilter === 'free' ? 'free_weight' : this.currentFilter;

    this.machines = this.originalList.filter((e: any) => 
      e.name.toLowerCase().includes(value.toLowerCase()) && 
      (this.currentFilter == 'all' || e.type == mappedFilter)
    );
  }

  closePreview() {
    this.selectedMachine = null;
  }

  ngOnDestroy(): void {
    // 6. Housekeeping: Stop tracking sockets when user exits the component view
    this.socketSubscriptions.unsubscribe();
  }
}