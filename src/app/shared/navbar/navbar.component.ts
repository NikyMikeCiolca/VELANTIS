import { Component } from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import { RadioComponent } from '../../components/radio/radio.component'

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, RadioComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {

}
