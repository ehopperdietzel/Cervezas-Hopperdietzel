import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'suggestions-input',
  templateUrl: './suggestions-input.component.html',
  styleUrls: ['./suggestions-input.component.css']
})
export class SuggestionsInputComponent implements OnInit {

  @Input() public options : any = {};
  @Output() public itemSelected: EventEmitter<any> = new EventEmitter();
  @Output() public onKeyUp: EventEmitter<any> = new EventEmitter();
  
  public valueBackup : string =  "";
  public hasFocus : boolean = false;

  @HostListener('document:mousedown', ['$event'])
  clickout(event : any) 
  {
    if(this.hasFocus && !this.eRef.nativeElement.contains(event.target)) 
    {
      this.hasFocus = false;
      this.options.value = this.valueBackup;
      this.options.suggestions = [];
    } 
  }
  constructor(private eRef: ElementRef) { }

  ngOnInit(): void 
  {
  }

}
