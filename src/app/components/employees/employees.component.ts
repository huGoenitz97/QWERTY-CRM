import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { EMPLOYEE, IEMPLOYEE } from './../../utils/employee.data';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { CreateEmployeeComponent } from './create-employee/create-employee.component';
import { EmployeesService } from './../../services/employees.service';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss'],
})
export class EmployeesComponent implements AfterViewInit {
  displayedColumns: string[] = [
    'id',
    'firstName',
    'lastName',
    'email',
    'gender',
    'position',
    'age',
    'nickname',
    'actions',
  ];

  // dataSource = new MatTableDataSource<any>();
  dataSource: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit(): void {
    this.employeeService.fillEmployees();
    this.loadData();
  }

  constructor(
    public dialog: MatDialog,
    private employeeService: EmployeesService
  ) {}

  applyFilter(event: Event): any {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  loadData(): void {
    this.dataSource = new MatTableDataSource(
      this.employeeService.getEmployees()
    );
    this.dataSource.paginator = this.paginator;
  }

  newData(): void {
    const dialogRef = this.dialog.open(CreateEmployeeComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        Swal.fire({
          title: 'Estas seguro de guardar los cambios?',
          showDenyButton: true,
          confirmButtonText: `Guardar`,
        }).then((confirmation) => {
          if (confirmation.isConfirmed) {
            this.employeeService.newRegister(result);
            this.loadData();
            this.loadConfirmDialog();
          } else if (confirmation.isDenied) {
            this.loadDialogError();
          }
        });
      }
    });
  }

  editData(id: any): void {
    const dialogRef = this.dialog.open(CreateEmployeeComponent, {
      data: id,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        Swal.fire({
          title: 'Estas seguro de guardar los cambios?',
          showDenyButton: true,
          confirmButtonText: `Guardar`,
        }).then((confirmation) => {
          if (confirmation.isConfirmed) {
            this.employeeService.dataEdit(result);
            this.loadData();
            this.loadConfirmDialog();
          } else if (confirmation.isDenied) {
            this.loadDialogError();
          }
        });
      }
    });
  }

  deleteData(id: number): void {
    Swal.fire({
      title: 'Estas seguro de eliminar los datos?',
      showDenyButton: true,
      confirmButtonText: `Eliminar`,
    }).then((confirmation) => {
      if (confirmation.isConfirmed) {
        this.employeeService.deleteRegister(id);
        this.loadData();
        this.loadConfirmDialog();
      } else if (confirmation.isDenied) {
        this.loadDialogError();
      }
    });
  }

  loadConfirmDialog(): void {
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Transaccion realizada',
      showConfirmButton: false,
      timer: 1000,
    });
  }

  loadDialogError(): void {
    Swal.fire({
      position: 'top-end',
      icon: 'error',
      title: 'Error',
      showConfirmButton: false,
      timer: 1000,
    });
  }
}
