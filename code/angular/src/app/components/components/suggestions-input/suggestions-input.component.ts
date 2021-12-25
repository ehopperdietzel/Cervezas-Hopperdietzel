import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'suggestions-input',
  templateUrl: './suggestions-input.component.html',
  styleUrls: ['./suggestions-input.component.css']
})
export class SuggestionsInputComponent implements OnInit {

  @Input() public options : any = {};
  @Input() public selected : string = "";
  @Output() public itemSelected: EventEmitter<any> = new EventEmitter();
  @Output() public onKeyUp: EventEmitter<any> = new EventEmitter();
  
  @HostListener('document:click', ['$event'])
  clickout(event : any) 
  {
    if(!this.eRef.nativeElement.contains(event.target)) 
    {
      this.options.suggestions = [];
    } 
  }
  constructor(private eRef: ElementRef) { }

  ngOnInit(): void 
  {
  }

}
