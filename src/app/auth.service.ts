import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from  "@angular/fire/auth";
import { Subscription } from 'rxjs';
import { auth } from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {
    asubscription: Subscription;

  constructor(public afAuth: AngularFireAuth,
              private router: Router) {
      this.asubscription = this.afAuth.authState.subscribe(user => {
        if (user)
          {
            localStorage.setItem('user', JSON.stringify(user));
          }
      })}
      login(t: string, email: string, password: string): Promise<firebase.auth.UserCredential> {
  if (t == "google") {
      return this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
  } else if (t == "ep") {
      return this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }
}

logout(): boolean {
  this.afAuth.auth.signOut().then(() => {;
      localStorage.removeItem('user');
  }).catch(err => console.log(err));
  return false;
}

getUser(): any {
    return localStorage.getItem('user');
}

printUser(): string {
    return JSON.parse(this.getUser()).email;
}

isLoggedIn(): boolean {
  return this.getUser() !== null;
}
ngOnDestroy() {
    this.asubscription.unsubscribe();
}
}
