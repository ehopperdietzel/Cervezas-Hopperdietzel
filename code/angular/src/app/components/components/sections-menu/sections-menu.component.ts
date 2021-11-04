import { Component, OnInit, Input , Output, EventEmitter} from '@angular/core';
import { LoadingIndicatorService } from 'src/app/services/loading-indicator.service';

@Component({
  selector: 'sections-menu',
  templateUrl: './sections-menu.component.html',
  styleUrls: ['./sections-menu.component.css']
})
export class SectionsMenuComponent implements OnInit {

  constructor(public loadingIndicatorService : LoadingIndicatorService) { }

  @Input() loading = false;
  @Input() sections : any = [];
  @Input() currentSection : string = "";
  @Input() username : string = "";
  @Output() sectionChanged = new EventEmitter();

  ngOnInit(): void 
  {
  }

}
