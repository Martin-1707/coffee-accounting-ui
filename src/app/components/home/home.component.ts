import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { NavbarComponent } from "../navbar/navbar.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NavbarComponent
], 
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {}