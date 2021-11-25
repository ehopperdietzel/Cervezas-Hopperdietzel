import { Component, OnInit, Input , Output, EventEmitter} from '@angular/core';
import { LoadingIndicatorService } from 'src/app/services/loading-indicator.service';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'sections-menu',
  templateUrl: './sections-menu.component.html',
  styleUrls: ['./sections-menu.component.css']
})
export class SectionsMenuComponent implements OnInit {

  constructor(public loadingIndicatorService : LoadingIndicatorService,public sessionService : SessionService) {}

  ngOnInit(): void 
  {
  }

}
