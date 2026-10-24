import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './shared/footer/footer.component';
import { NavbarComponent } from "./shared/navbar/navbar.component";
import { EntryGateComponent } from './components/entry-gate/entry-gate.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FooterComponent, NavbarComponent, EntryGateComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('VELANTIS');
}
