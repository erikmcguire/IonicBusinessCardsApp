import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
declare var gtag;
@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit {
  i: number = 3;
  is: string = "3 seconds.";
  constructor(private router: Router, private authService: AuthService) { }

    ngOnInit() {
        gtag('event', 'not_found');
        if (this.authService.getUser()) {
            this.countDown('card');
        } else {
            this.countDown('home');
        }
    }

    countDown(url: string) {
        let interval = setInterval(() => {
            if (this.i === 1) {
                clearInterval(interval);
                this.router.navigate([url]);
            } else {
                this.i--;
                this.is = this.i.toString() + " seconds.";
            }
        }, 1000);
    }​

}
