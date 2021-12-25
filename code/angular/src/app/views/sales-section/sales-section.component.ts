import { Component, OnInit } from '@angular/core';
import { ClientsService } from 'src/app/services/clients.service';
import { LoadingIndicatorService } from 'src/app/services/loading-indicator.service';
import { ProductsService } from 'src/app/services/products.service';
import { SalesService } from 'src/app/services/sales.service';
import { SessionService } from 'src/app/services/session.service';
import { currentDate } from 'src/environments/environment';

@Component({
  selector: 'sales-section',
  templateUrl: './sales-section.component.html',
  styleUrls: ['./sales-section.component.css']
})
export class SalesSectionComponent implements OnInit {

  constructor(public clientsService : ClientsService, public salesService : SalesService, public productsService : ProductsService, public loadingIndicatorService : LoadingIndicatorService, public sessionService : SessionService) { }

  ngOnInit(): void 
  {
    this.getAllProducts();
    this.getAllSales();
    this.columns = this.sessionService.columnsSettings['sales'];
  }

  // View mode
  public view : string = "table";

  // Adding indicator
  public adding : boolean = false;

  public documentTypes : any =
  [
    {
      id:0,
      name:"Factura"
    },
    {
      id:1,
      name:"Boleta"
    },
    {
      id:2,
      name:"Guía"
    }
  ];

  public currentItemData : any = {};
  public currentItemDataUnmodified : any = {};

  public products : any = [];

  public clientSuggestionsOptions : any =
  {
    placeholder:"Cliente",
    value:"",
    styles:
    {
      width:"256px"
    },
    suggestions:[]
  }

  public clientSelected(index : number) : void
  {
    this.clientSuggestionsOptions.value = this.clientSuggestionsOptions.suggestions[index]["firstname"] + " " + this.clientSuggestionsOptions.suggestions[index]["lastname"] + " / " + this.clientSuggestionsOptions.suggestions[index]["cityName"] + " / " + this.clientSuggestionsOptions.suggestions[index]["address"];
    this.currentItemData.client = this.clientSuggestionsOptions.suggestions[index].id;
    this.clientSuggestionsOptions.suggestions = [];
  }

  public onClientSuggestionInputChange(value : string) : void
  {
    if(value == "")
    {
      this.clientSuggestionsOptions.suggestions = [];
      return;
    }
    this.loadingIndicatorService.loadingStates["clientSuggestions"] = true;

    var options = 
    {
      query:value
    };

    this.clientsService.getClients(options).subscribe(
    res => 
    {
      this.loadingIndicatorService.loadingStates["clientSuggestions"] = false; 

      for(var i = 0; i < res.length; i++)
      {
        res[i]["value"] = res[i]["firstname"] + " " + res[i]["lastname"] + " / " + res[i]["cityName"] + " / " + res[i]["address"];
      }

      this.clientSuggestionsOptions.suggestions = res;
      console.log(res);
    },
    err => 
    {
      this.loadingIndicatorService.loadingStates["clientSuggestions"] = false;
      console.log(err);
    });
  }

  public columns : Array<any> = [
  {
    title:'Cliente',
    key:'clientName',
    type:'text',
    width:200
  },
  {
    title:'Pagado',
    key:'paid',
    type:'paid',
    width:150
  },
  {
    title:'Entregado',
    key:'delivered',
    type:'delivered',
    width:150
  },
  {
    title:'Última Modificación',
    key:'lastModificationTime',
    type:'text',
    width:150
  },
  {
    title:'Modificado por',
    key:'modifiedBy',
    type:'text',
    width:150
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
  public getAllSales() : void 
  {
    
    this.loadingIndicatorService.loadingStates["getAllSales"] = true;

    this.salesService.getSales().subscribe(
    res => 
    {
      this.loadingIndicatorService.loadingStates["getAllSales"] = false;

      for(var i = 0; i < res.length; i++)
      {
        res[i].clientName = res[i].clientFirstname + " " + res[i].clientLastname;
        res[i].modifiedBy = res[i].userFirstname + " " + res[i].userLastname;
      }
      this.rows = res;
      console.log(res);
    },
    err => 
    {
      this.loadingIndicatorService.loadingStates["getAllSales"] = false;
      console.log(err);
    });
      
  }

  public getSaleTotalCost() : number
  {
    var total = 0;

    for(var i = 0; i < this.currentItemData.products.length; i++)
    {
      var product = this.getProductById(this.currentItemData.products[i].product);
      var price = this.getPriceById(product.prices,this.currentItemData.products[i].priceType).price;
      total += price*this.currentItemData.products[i].quantity;
    }

    return total;
  }

  // Show create item view
  public addItem() : void 
  {
    this.currentItemData = 
    {
      documentType:0,
      paid:false,
      delivered:false,
      comment:"",
      paidDate:currentDate(),
      deliverDate:currentDate(),
      products:
      [
        {
          product:this.products[0].id,
          quantity:0,
          priceType:this.products[0].defaultPrice
        }
      ]
    }
    this.adding = true;
    this.view = 'editor';
  }

  public getProductById(id:number) : any
  {
    for(var i = 0; i < this.products.length; i++)
    {
      if(this.products[i].id == id)
      {
        return this.products[i];
      }
    }
  }

  public getDefaultProductPriceType(product:any) : any
  {
    for(var i = 0; i < product.prices.length; i++)
    {
      if(product.prices[i].id == product.defaultPrice)
      {
        return product.prices[i];
      }
    }
  }

  public getPriceById(priceObject:any,priceTypeId:number) : any
  {
    for(var i = 0; i < priceObject.length; i++)
    {
      if(priceObject[i].id == priceTypeId)
      {
        return priceObject[i];
      }
    }
  }

  public addProduct() : void
  {
    this.currentItemData.products.push({
      product:this.products[0].id,
      quantity:0,
      priceType:this.products[0].defaultPrice
    });
  }

  public getStockDifference(productId : number) : number
  {
    var stock = this.getProductById(productId).stock;

    for(var i = 0; i < this.currentItemData.products.length; i++)
      if(this.currentItemData.products[i].product == productId)
        stock -= this.currentItemData.products[i].quantity;

    return stock;
  }

  public removeProduct(index : number) : void
  {
    this.currentItemData.products.splice(index,1);
  }

  // POST Item
  public uploadNewItem() : void 
  {
    
    this.loadingIndicatorService.loadingStates["createSale"] = true;

    var data = Object.assign({}, this.currentItemData);
    data.products = JSON.stringify(data.products);

    this.salesService.createSale(data).subscribe(
      res => 
      {
        this.loadingIndicatorService.loadingStates["createSale"] = false;
        this.getAllSales();
        this.view = 'table';
        this.adding = false;
        console.log(res);
      },
      err => 
      {
        this.loadingIndicatorService.loadingStates["createSale"] = false;
        console.log(err);
      });
    
  }

  // Update item
  public updateItem()
  {
    /*
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
    */
  }

  // DELETE Item
  public deleteItem()
  {
    /*
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
    */
  }
}
