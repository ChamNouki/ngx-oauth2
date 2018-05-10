import { Component } from '@angular/core';
import { OAuth2ConnectionService } from '../../services/oauth2-connection.service';

@Component({
  selector: 'oauth2-locking-modal',
  styleUrls  : ['./locking-modal.component.css'],
  templateUrl: './locking-modal.component.html'
})
export class LockingModalComponent {
  constructor(private connectionService: OAuth2ConnectionService) {
  }

  public openLoginScreen() {
    this.connectionService.openLoginScreen();
  }
}
