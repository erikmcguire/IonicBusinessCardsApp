import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Http } from '@angular/http';
import domtoimage from 'dom-to-image';
import { Subscription } from 'rxjs';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { Card } from './card.model';

@Injectable({
  providedIn: 'root'
})

export class ImageService implements OnInit, OnDestroy {
    localImg = 'assets/images/bateman.png';
    remoteImg = '';
    base64: string;
    hsubscription: Subscription;
    esubscription: Subscription;
    filledCard: Card = new Card();
    fromScan: boolean = false;
    txtano: string;

    constructor(public http: Http,
                private authService: AuthService,
                private router: Router) { }

    convertToBase64() {
        const imgNode = document.getElementById('image');
        domtoimage.toPng(imgNode)
                        .then( (dataUrl: string) => {
                            this.base64 = dataUrl;
                            this.scanCard();
                        }).catch( (e: any) => {
                                  console.log(e);
                                 });
      }


    displayCardImg(card: Card) {
      if (card.imageUri) {
          return card.imageUri;
      } else return "";
    }

    scanCard(image64?: string) {
        if (image64 == 's') {
            const request: any = {
              'requests': [
                  {'image': {'source': {'imageUri': this.remoteImg}
                  },
              'features': [{ 'type': 'TEXT_DETECTION', 'maxResults': 1 }]
                  }
               ]};
            this.makeRequest(request);
        } else if (image64 && image64.length >= 2) {
                const request: any = {
                    'requests': [{'image': {'content': image64.replace(/.*base64\,/, "")},
              'features': [{ 'type': 'TEXT_DETECTION', 'maxResults': 1 }]}]};
               this.makeRequest(request);
        } else {
            const request: any = {
                'requests': [{'image': {'content': this.base64.replace(/.*base64\,/, "")},
                'features': [{ 'type': 'TEXT_DETECTION', 'maxResults': 1 }]}]};
            this.makeRequest(request);
            }
        }

    async makeRequest(request) {
        const url = 'https://vision.googleapis.com/v1/images:annotate?key=' + environment.cloudVision;
        this.hsubscription = await this.http.post(url, request).subscribe(
               (results: any) => {
              if (results.json().responses[0].fullTextAnnotation) {
                let txt = results.json().responses[0].fullTextAnnotation.text;
                this.txtano = "\n" + results.json().responses[0].fullTextAnnotation.text;
                this.getEntities(txt);
            } else {
                let txt = "";
                console.log("Nothing found.", request);
                this.getEntities(txt);
            }
                });
    }

    async getEntities(text: string) {
        const url = 'https://language.googleapis.com/v1/documents:analyzeEntities?key=' + environment.cloudVision;
        const request: any = {
             "encodingType": "UTF8",
             "document":
             {
             "type": "PLAIN_TEXT",
             "content": text
             }
         }
        this.esubscription = await this.http.post(url, request).subscribe( (results: any) => {
            console.log("Entities: ", "\n", results.json().entities);
            this.fillEnts(results.json().entities);
            });
    }

    toTitle(el): string {
        if (el.replace(/\./g, "").length != 2) {
            return el.charAt(el.search(/[^A-z0-9]/)) + " " +
            el.charAt(el.search(/[A-z]/)).toUpperCase() +
            el.slice(el
              .search(/[A-z]/) + 1)
              .toLowerCase();
        } else {
            return el.toUpperCase();
        }
    }

    fillEnts(ents: any) {
        let businessCard: any = {};
        businessCard.author = this.authService.afAuth.auth.currentUser.uid;
        businessCard.addedAt = Date.now();
        businessCard.imageUri = this.base64 || this.remoteImg;
        ents.forEach(el => {
            switch(el.type) {
                case "PERSON":
                    if (el.name.search(" ") != -1
                        && !businessCard.firstName
                        && !businessCard.lastName) {
                        businessCard.firstName =
                            this.toTitle(el.name.split(" ")[0])
                        businessCard.firstNameLower = businessCard.firstName.toLowerCase()
                        businessCard.lastName =
                            el.name.split(" ").slice(1).map(w => this.toTitle(w)).join(" ");
                    } else if (!businessCard.firstName) {
                        businessCard.firstName = this.toTitle(el.name);
                        businessCard.firstNameLower = businessCard.firstName.toLowerCase()
                    } break;
                case "ORGANIZATION":
                    if (!businessCard.organization) {
                        businessCard.organization = el.name.split(" ")
                        .map(w => this.toTitle(w)).join(" ");
                        businessCard.orgLower = businessCard.organization.toLowerCase()
                    } break;
                case "PHONE_NUMBER":
                    if (!businessCard.phone) {
                        businessCard.phone = el.name;
                    } break;
                case "LOCATION":
                case "ADDRESS":
                    if (el.name.search(/[0-9]/) != -1) {
                        businessCard.address = el.name.replace(/\n/, " ").replace(/,/, " ").split(" ")
                        .map(w => this.toTitle(w))
                        .join(" ").replace(/,([A-z0-9]+)/g, ` $1`).replace(/[\s]+/g, " ");
                        break;
                    } else if (!businessCard.address &&
                               el.metadata.wikipedia_url) {
                               businessCard.address = el.name.replace(/\n/, " ").replace(/,/, " ").split(" ")
                               .map(w => this.toTitle(w)).join(" ").replace(/,([A-z0-9]+)/g, ` $1`).replace(/[\s]+/g, " ")
                               ;
                               break;
                    }
                default:
                    if (el.type.search("@") != -1
                        && !businessCard.email) {
                        businessCard.email = el.name;
                        break;
                    }
            }
        });
        this.filledCard = businessCard;
        if (!this.fromScan) {
            this.router.navigate(['add-card']);
        } else {
            this.fromScan = false;
        }
    }

    ngOnInit() {
        this.hsubscription = null;
        this.esubscription = null;
    }

    navAdd() {
        this.router.navigate(['add-card']);
    }

    ngOnDestroy() {
        this.esubscription.unsubscribe();
        this.hsubscription.unsubscribe();
    }
}
