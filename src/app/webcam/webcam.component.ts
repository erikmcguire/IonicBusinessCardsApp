import { Component, OnInit, OnDestroy } from '@angular/core';
import { ImageService } from '../image.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

@Component({
  selector: 'app-webcam',
  templateUrl: './webcam.component.html',
  styleUrls: ['./webcam.component.scss']
})

export class WebcamComponent implements OnInit, OnDestroy {

    video: HTMLVideoElement;
    canvas: HTMLCanvasElement;
    photo: HTMLImageElement;
    toggleCam: boolean;
    stream: MediaStream = null;
    currentImage: string;
    constructor(private imgService: ImageService, private camera: Camera) {
        }

    ngOnInit() {
        this.video = document.querySelector('video');
        this.toggleCam = false;
        let td = document.getElementById('scanner');
        td.style.display = "none";
    }


  takePicture() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };

    this.camera.getPicture(options).then((imageData) => {
      this.currentImage = 'data:image/jpeg;base64,' + imageData;
    }, (err) => { console.log(err) });
    this.imgService.fromScan = true;
    this.imgService.scanCard(this.currentImage);
  }

    ngOnDestroy() {
        this.stopCamera();
    }

    setImage(imageUri: string): boolean {
        if (imageUri.search("http") != -1) {
            this.imgService.remoteImg = `${imageUri}`;
        } else {
            this.imgService.localImg = `${imageUri}`;
        }
        return false;
    }

    stopCamera() {
        this.video.srcObject = null;
        let td = document.getElementById('scanner');
        td.style.display = "none";
        if (this.stream && this.stream.getTracks()) {
            this.stream.getTracks().forEach((track: MediaStreamTrack) => { track.stop() });
        }
    }

    toggleCamera() {
        this.toggleCam = !this.toggleCam;
        if (navigator.mediaDevices.getUserMedia) {
            let td = document.getElementById('scanner');
            if (this.toggleCam) {
                td.style.display = "block";
                navigator.mediaDevices.getUserMedia({ video: true }).then(
                    stream => {
                        this.stream = stream;
                        this.video.srcObject = stream;
                    }, err => { console.log(err) });
            } else {
                this.stopCamera();
            }
        }
    }

    snap() {
        this.canvas = document.querySelector('canvas');
        this.canvas.getContext('2d').drawImage(this.video, 0, 0, 640, 480);
        this.photo = document.createElement('img');
        this.photo.setAttribute('src', this.canvas.toDataURL('image/png'));
        this.imgService.fromScan = true;
        this.imgService.scanCard(this.photo.src);
    }

}
