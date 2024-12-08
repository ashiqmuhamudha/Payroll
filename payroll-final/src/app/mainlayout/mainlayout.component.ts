import { Component, HostListener } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-mainlayout',
  templateUrl: './mainlayout.component.html',
  styleUrls: ['./mainlayout.component.scss']
})
export class MainlayoutComponent {
  isDropdownOpen: boolean = false;
  constructor(private authService : AuthService, private router : Router){}

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown() {
    this.isDropdownOpen = false;
  }

  logout() : void{
    this.authService.logout();  
  }
  // @HostListener('document:click', ['$event'])
  // onDocumentClick(event: Event): void {
  //   if (this.isDropdownOpen) {
  //     this.closeDropdown();
  //   }
  // }
}
