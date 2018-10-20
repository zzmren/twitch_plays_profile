import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
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

    @ViewChild('fileInput') fileInput: ElementRef;

    static parameters = [AuthService, Http, SocketService, FormBuilder, AuthHttp, UserService];
    constructor(authService: AuthService, http: Http, socketService: SocketService, fb: FormBuilder, authHttp: AuthHttp, userService: UserService) {
        this.AuthHttp = authHttp;
        this.Http = http;
        this.userService = userService;
        this.fb = fb;
        this.SocketService = socketService;
        this.AuthService = authService;
        this.AuthService.currentUserChanged.subscribe(user => {
            this.currentUser = user;
            this.reset();
        });
        this.userService.query().subscribe(users => {
            this.users = users;
            this.currentImage = users[2].photo.value;
            console.log(this.currentImage)
        }, err => console.log(err));
        this.reset()
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
            console.log(is);
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
    const formModel = this.form.value;
    this.loading = true;
    // In a real-world app you'd have a http request / service call here like
    // this.http.post('apiUrl', formModel)
    console.log(formModel);
    let t = this.AuthHttp.post('/api/users/upload', formModel)
            .map((res: Response) => res.json())
            .catch(handleError);
    t.toPromise().then(data => {
        console.log(data);
        this.loading = false;
        this.finished = true;
        this.clearFile();
    })
  }

  clearFile() {
    this.form.get('avatar').setValue(null);
    this.fileInput.nativeElement.value = '';
  }
}
