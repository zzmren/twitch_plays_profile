import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';


import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { TooltipModule } from 'ngx-bootstrap';

import { MainComponent } from './main.component';
import { PhotosComponent } from './photos.component';
import { SocketService } from '../../components/socket/socket.service';

export const ROUTES: Routes = [
    { path: 'home', component: MainComponent },
    { path: 'photos', component: PhotosComponent }
];


@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        RouterModule.forChild(ROUTES),

        ReactiveFormsModule,
        TooltipModule.forRoot(),
    ],
    declarations: [
        MainComponent,
        PhotosComponent
    ],
    providers: [
        SocketService,
    ],
    exports: [
        MainComponent,
        PhotosComponent
    ],
})
export class MainModule {}
