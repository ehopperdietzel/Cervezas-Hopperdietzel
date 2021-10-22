import { Component, OnInit, Input , Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'sections-menu',
  templateUrl: './sections-menu.component.html',
  styleUrls: ['./sections-menu.component.css']
})
export class SectionsMenuComponent implements OnInit {

  constructor() { }

  @Input() loading = false;
  @Input() sections : any = [];
  @Input() currentSection : string = "";
  @Input() currentUser : string = "";
  @Output() sectionChanged = new EventEmitter();

  ngOnInit(): void 
  {
  }

}
