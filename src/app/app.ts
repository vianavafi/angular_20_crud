import {Component, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {EmployeeModel} from './model/Employee';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  employeeForm: FormGroup = new FormGroup({});

  employeeObj: EmployeeModel = new EmployeeModel();

  employeeList: EmployeeModel[] = [];

  isEdit = false;

  ngOnInit(): void {
    this.createForm();
    const oldData = localStorage.getItem("EmpData");
    if (oldData != null) {
      const parseData = JSON.parse(oldData);
      this.employeeList = parseData;
      localStorage.setItem("EmpData", JSON.stringify(parseData));
    }
  }

  reset(){
    this.employeeObj = new EmployeeModel();
    this.isEdit = false;
    this.employeeForm.reset();
  }

  createForm() {
    this.employeeForm = new FormGroup({
      empId: new FormControl(this.employeeObj.empId),
      name: new FormControl(this.employeeObj.name,[ Validators.required, Validators.pattern('^[A-Za-z]+$')]),
      city: new FormControl(this.employeeObj.city),
      address: new FormControl(this.employeeObj.address),
      contactNo: new FormControl(this.employeeObj.contactNo),
      emailId: new FormControl(this.employeeObj.emailId),
      pinCode: new FormControl(this.employeeObj.pinCode, [Validators.required, Validators.minLength(6)]),
      state: new FormControl(this.employeeObj.state)
    })
  }

  onSave() {
    const oldData = localStorage.getItem("EmpData");
    if (oldData != null) {
      const parseData = JSON.parse(oldData);
      this.employeeForm.controls['empId'].setValue(parseData.length + 1);
      this.employeeList.unshift(this.employeeForm.value);
    } else {
      this.employeeList.unshift(this.employeeForm.value);

    }
    localStorage.setItem("EmpData", JSON.stringify(this.employeeList));
    this.reset();
  }

  onEdit(item: EmployeeModel) {
    this.isEdit = true;
    this.employeeObj = item;
    this.createForm();
  }

  onUpdate() {
    const record = this.employeeList.find(m=>m.empId==this.employeeForm.controls['empId'].value);
    if (record != undefined) {
      record.address = this.employeeForm.controls['address'].value;
      record.name = this.employeeForm.controls['name'].value;
      record.contactNo = this.employeeForm.controls['contactNo'].value;
    }
    localStorage.setItem("EmpData", JSON.stringify(this.employeeList));
    this.isEdit = false;
    this.reset();
  }

  onDelete(id: number) {
    const isDelete = confirm("Are you sure you want to delete ?");
    if (isDelete) {
      const index = this.employeeList.findIndex(m=>m.empId==id);
      this.employeeList.splice(index, 1);
      localStorage.setItem("EmpData", JSON.stringify(this.employeeList));

    }
  }
}
