import { Component, OnInit, OnDestroy, ElementRef, ViewChild, NgZone } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { SocketService } from '../../components/socket/socket.service';
import { AuthService } from '../../components/auth/auth.service';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthHttp } from 'angular2-jwt';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';
import { UserService } from '../../components/auth/user.service';
import {DomSanitizer} from '@angular/platform-browser';

const url = 'http://localhost:8000/upload';

function handleError(err) {
    console.log(err);
    return Observable.throw(err.json() || 'Server error');
}

@Component({
    selector: 'photos',
    template: require('./photos.html'),
    styles: [require('./main.scss')],
})
export class PhotosComponent implements OnInit, OnDestroy {
    Http;
    SocketService;
    isAdmin;
    isLoggedIn;
    currentUser = {};
    AuthService;
    fb;
    AuthHttp;
    users: Object[];
    currentImage;
    sanitizer;
    imageTitle;
    imageText;
    user;
    index = -1;
    NgZone;

    @ViewChild('fileInput') fileInput: ElementRef;

    static parameters = [AuthService, Http, SocketService, FormBuilder, AuthHttp, UserService, DomSanitizer, NgZone];
    constructor(authService: AuthService, http: Http, socketService: SocketService, fb: FormBuilder, authHttp: AuthHttp, userService: UserService, sanitizer:DomSanitizer, ngZone: NgZone) {
        this.AuthHttp = authHttp;
        this.sanitizer = sanitizer;
        this.Http = http;
        this.userService = userService;
        this.fb = fb;
        this.NgZone = ngZone;
        this.SocketService = socketService;
        this.AuthService = authService;
        this.AuthService.currentUserChanged.subscribe(user => {
            this.currentUser = user;
            this.reset();
        });
        this.reset()
        setTimeout(() => this.getNewUser(), 1000);
    }

    ngOnInit() {
        setTimeout(() => {this.reset()}, 100);
    }

    reset() {
        this.AuthService.isLoggedIn().then(is => {
            this.isLoggedIn = is;
        });
        this.AuthService.isAdmin().then(is => {
            this.isAdmin = is;
        });
        this.AuthService.getCurrentUser().then(user => {
            this.currentUser = user;
        });
    }

    ngOnDestroy() {
        this.SocketService.unsyncUpdates('thing');
    }

    deleteThing(thing) {
        return this.Http.delete(`/api/things/${thing._id}`)
            .map(res => res.json())
            .catch(err => Observable.throw(err.json().error || 'Server error'))
            .subscribe(() => {
                console.log('Deleted Thing');
            });
    }
    createForm() {
    this.form = this.fb.group({
      avatar: null
    });
  }

  onFileChange(event) {
    let reader = new FileReader();
    if(event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.form.get('avatar').setValue({
          filename: file.name,
          filetype: file.type,
          value: reader.result.split(',')[1]
        })
      };
    }
  }

  onSubmit() {
    var data = { text: this.imageText, user: this.user._id };
    let t = this.AuthHttp.post('/api/users/addText', data)
            .map((res: Response) => res.json())
            .catch(handleError);
    t.toPromise().then(data => {
        this.imageText = '';
        this.getNewUser();
    })
  }

  getNewUser() {
        var t = this.AuthHttp.get('/api/users/publicUsers')
                
                .catch(handleError);
                // .catch(err => Observable.throw(err.json().error || 'Server error'))
                t.toPromise().then(data => {
                    var users = JSON.parse(data._body);
                    this.users = users;
                    this.index < users.length-1 ? this.index++ : this.index = 0;
                    this.currentImage = this.sanitizer.bypassSecurityTrustUrl(users[this.index].photo.value);
                    this.imageTitle = users[this.index].photo.filename;
                    this.user = users[this.index];
                    if(!this.isAdmin){
                        this.imageText = users[this.index].photo.text;
                    }
                    this.NgZone.run(() => {

                    });
                });
    
    
  }

  clearFile() {
    this.form.get('avatar').setValue(null);
    this.fileInput.nativeElement.value = '';
  }
}
