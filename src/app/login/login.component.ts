import { Component, OnInit, NgZone, Inject } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
    g: boolean = false;
    ep: boolean = false;
    ltypes: string[] = ['Google', 'Email w/ Pass'];
    t: string = "";
    placeholder = "Email w/ Pass";
    constructor(public authService: AuthService,
              private ngZone: NgZone,
              private dialogRef: MatDialogRef<LoginComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private router: Router) { }

    login(email: HTMLInputElement, password: HTMLInputElement) {
         let emailv = email.value || "";
         let passwordv = password.value || "";
         if (!this.t) {
             this.t = "ep";
         }
         if (this.g) { this.t = "google"}
         else if (this.ep) { this.t = "ep"}

         this.authService.login(this.t, emailv, passwordv).then(user => {
                this.dialogRef.close();
                this.ngZone.run(() => this.router.navigate(['card']));
            });
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    toggleGoogle(t) {
      if (t === 'Google') {
        this.g = true;
        this.ep = false;
      } else if (t === 'Email w/ Pass') {
        this.ep = true
        this.g = false;
      }
    }

    changePH(t) {
      this.placeholder = t;
    }

    logout(): boolean {
      this.authService.logout();
      this.dialogRef.close();
      this.router.navigate(['home']);
      return false;
    }

    printUser(): string {
      return this.authService.printUser();
    }

    ngOnInit() {

    }

}
