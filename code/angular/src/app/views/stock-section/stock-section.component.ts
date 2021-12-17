import { Component, OnInit } from '@angular/core';
import { LoadingIndicatorService } from 'src/app/services/loading-indicator.service';
import { ProductsService } from 'src/app/services/products.service';
import { SessionService } from 'src/app/services/session.service';
import { StockService } from 'src/app/services/stock.service';


@Component({
  selector: 'stock-section',
  templateUrl: './stock-section.component.html',
  styleUrls: ['./stock-section.component.css']
})
export class StockSectionComponent implements OnInit {

  constructor(public stockService : StockService, public productsService : ProductsService, public loadingIndicatorService : LoadingIndicatorService, public sessionService : SessionService) { }


  ngOnInit(): void 
  {
    this.getAllProducts();
    this.getAllBatches();
  }

  // View mode
  public view : string = "table";

  // Adding indicator
  public adding : boolean = false;

  public currentItemData : any = {};
  public currentItemDataUnmodified : any = {};

  public products : any = [];

  public columns : Array<any> = [
  {
    title:'Nº Tanda',
    key:'batchNumber',
    type:'text'
  },
  {
    title:'Producto',
    key:'productName',
    type:'text'
  },
  {
    title:'Unidades Producidas',
    key:'quantity',
    type:'text'
  },
  {
    title:'Fecha Inicio',
    key:'beginDateN',
    type:'text'
  },
  {
    title:'Fecha Termino',
    key:'endDateN',
    type:'text'
  },
  {
    title:'Duración(mins)',
    key:'duration',
    type:'text'
  },
  {
    title:'Última Modificación',
    key:'lastModificationTime',
    type:'text'
  },
  {
    title:'Modificado por',
    key:'modifiedBy',
    type:'text'
  }];

  public rows : Array<any> = [];
  public rowRightClick(event : any) : void {}

  public getAllProducts() : void
  {
    this.loadingIndicatorService.loadingStates["getAllProducts"] = true;

    this.productsService.getProducts().subscribe(
      res => 
      {
        this.loadingIndicatorService.loadingStates["getAllProducts"] = false;       
        this.products = res;
      },
      err => 
      {
        this.loadingIndicatorService.loadingStates["getAllProducts"] = false;
        console.log(err);
      });
  }

  public rowLeftClick(event : any) : void 
  {
    this.adding = false;
    this.currentItemData = Object.assign({}, event.row);
    this.view = 'editor';
  }

  public goBack() : void 
  {
    this.view = 'table';
    this.adding = false;
  }

  // Get batches list
  public getAllBatches() : void 
  {
    this.loadingIndicatorService.loadingStates["getAllBatches"] = true;

    this.stockService.getBatches().subscribe(
    res => 
    {
      this.loadingIndicatorService.loadingStates["getAllBatches"] = false; 

      for(var i = 0; i < res.length; i++)
      {
        var diff = (this.sessionService.strToDate(res[i]["endDate"]).getTime() - this.sessionService.strToDate(res[i]["beginDate"]).getTime())/60000;
        res[i]["duration"] = diff;
        res[i]["modifiedBy"] = res[i]["userFirstname"] + " " + res[i]["userLastname"];
        res[i]["beginDateN"] = res[i]["beginDate"].slice();
        res[i]["endDateN"] = res[i]["endDate"].slice();
        res[i]["endDate"] = res[i]["endDate"].replace(' ','T');
        res[i]["beginDate"] = res[i]["beginDate"].replace(' ','T');
      }

      this.rows = res;
      console.log(res);
    },
    err => 
    {
      this.loadingIndicatorService.loadingStates["getAllbatches"] = false;
      console.log(err);
    });
      
  }

  // Show create item view
  public addItem() : void 
  {
    this.currentItemData = 
    {
      batchNumber:0,
      quantity:0,
      product:0,
      beginDate:"",
      endDate:"",
      comment:""
    }
    this.adding = true;
    this.view = 'editor';
  }

  // POST Item
  public uploadNewItem() : void 
  {
    this.loadingIndicatorService.loadingStates["createBatch"] = true;

    var data = Object.assign({}, this.currentItemData);

    this.stockService.createBatch(data).subscribe(
      res => 
      {
        this.loadingIndicatorService.loadingStates["createBatch"] = false;
        this.getAllBatches();
        this.view = 'table';
        this.adding = false;
        console.log(res);
      },
      err => 
      {
        this.loadingIndicatorService.loadingStates["createBatch"] = false;
        console.log(err);
      });
  }

  // Update item
  public updateItem()
  {
    this.loadingIndicatorService.loadingStates["updateBatch"] = true;

    var data = Object.assign({}, this.currentItemData);
   
    this.stockService.updateBatch(data).subscribe(
    res => 
    {
      this.loadingIndicatorService.loadingStates["updateBatch"] = false;
      this.getAllBatches();
      this.view = 'table';
      console.log(res);
    },
    err => 
    {
      this.loadingIndicatorService.loadingStates["updateBatch"] = false;
      //this.usersModal.errorMessage = err.error.message;
      console.log(err);
    });
  
  }

  // DELETE Item
  public deleteItem()
  {
    this.loadingIndicatorService.loadingStates["deleteBatch"] = true;

    this.stockService.deleteBatch(this.currentItemData.id).subscribe(
      res => 
      {
        this.loadingIndicatorService.loadingStates["deleteBatch"] = false;
        this.getAllBatches();
        this.view = 'table';
        console.log(res);
      },
      err => 
      {
        this.loadingIndicatorService.loadingStates["deleteBatch"] = false;
        console.log(err);
      });
     
  }




}
