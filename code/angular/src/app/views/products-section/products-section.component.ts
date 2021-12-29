import { Component, OnInit } from '@angular/core';
import { LoadingIndicatorService } from 'src/app/services/loading-indicator.service';
import { ProductsService } from 'src/app/services/products.service';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'products-section',
  templateUrl: './products-section.component.html',
  styleUrls: ['./products-section.component.css']
})
export class ProductsSectionComponent implements OnInit {

  constructor(
    public productsService : ProductsService,
    public loadingIndicatorService : LoadingIndicatorService, 
    public sessionService : SessionService) 
  {}

  public columns : Array<any> = [
    {
      title:'Producto',
      key:'name',
      type:'text'
    },
    {
      title:'Unidades disponibles',
      key:'stock',
      type:'text'
    },
    {
      title:'Alias',
      key:'aliasColor',
      type:'colorText'
    },
    {
      title:'Precio por defecto',
      key:'defaultPriceValue',
      type:'money'
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
  
  // View mode
  public view : string = "table";

  // Adding indicator
  public adding : boolean = false;
  public editing : boolean = true;

  public rows : Array<any> = [];

  public displayingProduct : boolean = false;
  public imageChanged : boolean = false;

  public products : any = [];

  public imageData : any;

  public currentItemData : any = {
    name:"",
    alias:"",
    color:"#000000",
    image:false,
    prices:
    [
      {
        name:"Defecto",
        price:0,
        default:true
      }
    ]
  }
  public currentItemDataBackup : any = {};

  ngOnInit() : void 
  {
    this.getProducts();
    this.columns = this.sessionService.columnsSettings['products'];
  }

  public rowLeftClick(event : any) : void
  {
    event.preventDefault();
    this.currentItemData = event.row;
    this.view = 'editor';
    this.adding = false;
    this.editing = true;
    this.editItem();
  }

  public removePrice(index:number) : void 
  {
    var isDefault = this.currentItemData.prices[index].default;
    this.currentItemData.prices.splice(index,1);
    if(isDefault)
      this.currentItemData.prices[0].default = true;
  }

  public deleteItem()
  {
    this.loadingIndicatorService.loadingStates["deleteProduct"] = true;

    this.productsService.deleteProduct(this.currentItemData.id).subscribe(
      res => 
      {
        this.loadingIndicatorService.loadingStates["deleteProduct"] = false;
        this.getProducts();
        this.view = 'table';
        this.adding = false;
        this.editing = true;
        console.log(res);
      },
      err => 
      {
        this.loadingIndicatorService.loadingStates["deleteProduct"] = false;
        console.log(err);
      });
  }

  public getProducts() : void
  {
    this.loadingIndicatorService.loadingStates["getProducts"] = true;

    this.productsService.getProducts().subscribe(
      res => 
      {
        this.loadingIndicatorService.loadingStates["getProducts"] = false;

        for(var i = 0; i < res.length; i++)
        {
          res[i].modifiedBy = res[i].userFirstname + " " + res[i].userLastname;

          res[i].aliasColor = {color:res[i].color,text:res[i].alias};

          for(var j = 0; j < res[i].prices.length; j++)
          {
            res[i].prices[j].default = res[i].prices[j].id == res[i].defaultPrice;
            if(res[i].prices[j].default)
            {
              res[i].defaultPriceValue = res[i].prices[j].price;
            }
          }
        }
          
        this.rows = res;
        console.log(res);
      },
      err => 
      {
        this.loadingIndicatorService.loadingStates["getProducts"] = false;
        console.log(err);
      });
  }

  public editItem() : void 
  {
    this.currentItemDataBackup = JSON.parse(JSON.stringify(this.currentItemData));
    console.log(this.currentItemDataBackup);
    this.editing = true;
  }

  public cancelEdit() : void 
  {
    this.currentItemData = this.currentItemDataBackup;
    this.editing = true;
  }

  public detectChanges() : any
  {
    var changes : any = {id:this.currentItemDataBackup.id,count:0,priceChanges:[],priceDeletions:[],priceAditions:[]};
    var keys = ['name','alias','stock','color','image'];

    if(this.currentItemData.prices.length == 1 && this.currentItemData.prices[0].name == "")
      return changes;

    // General changes
    for(var i = 0; i < keys.length; i++)
    {
      if(this.currentItemDataBackup[keys[i]] != this.currentItemData[keys[i]])
      {
        changes[keys[i]] = this.currentItemData[keys[i]];
        changes.count+=1;
      }
    }

    // Aditions
    for(var j = 0; j < this.currentItemData.prices.length; j++)
    {
      if(!('id' in this.currentItemData.prices[j]))
      {
        changes.priceAditions.push(this.currentItemData.prices[j]);
        changes.count+=1;
      }
    }

    // Deletions
    for(var i = 0; i < this.currentItemDataBackup.prices.length; i++)
    {
      var exists = false;

      for(var j = 0; j < this.currentItemData.prices.length; j++)
      {
        if(this.currentItemDataBackup.prices[i].id === this.currentItemData.prices[j].id)
        {
          exists = true;
          break;
        }
      }

      if(!exists)
      {
        changes.priceDeletions.push(this.currentItemDataBackup.prices[i].id);
        changes.count += 1;
      }
    }

    keys = ['name','price','default'];

    // Price changes
    for(var i = 0; i < this.currentItemDataBackup.prices.length; i++)
    {
      for(var j = 0; j < this.currentItemData.prices.length; j++)
      {
        if(this.currentItemDataBackup.prices[i].id === this.currentItemData.prices[j].id)
        {
          for(var k = 0; k < keys.length; k++)
          {
            if(this.currentItemDataBackup.prices[i][keys[k]] != this.currentItemData.prices[j][keys[k]])
            {
              changes.priceChanges.push(
              {
                id:this.currentItemData.prices[j].id,
                name:this.currentItemData.prices[j].name,
                price:this.currentItemData.prices[j].price,
                default:this.currentItemData.prices[j].default
              });
              changes.count+=1;
              break;
            }
          }
        }
      }
    }

    return changes;
  }

  public addProduct() : void
  {
    this.imageChanged = false;
    this.currentItemData =
    {
      name:"",
      alias:"",
      color:"#000000",
      image:false,
      stock:0,
      prices:
      [
        {
          name:"Defecto",
          price:0,
          default:true
        }
      ]
    }
    this.adding = true;
    this.editing = true;
    this.view = 'editor';
  }

  public addPrice() : void 
  {
    this.currentItemData.prices.push(
    {
      name:"",
      price:0,
      default:false
    })
  }

  public getcurrentItemDataImage() : string
  {
    if(!this.currentItemData.image && !this.imageChanged)
      return "assets/img/icons/no-image.jpg";
    else if(this.imageChanged)
      return this.currentItemData.image;
    else
      return "../../../assets/img/products/"+this.currentItemData.id+".jpg?" + new Date().getTime();
  }

  public removeImage() : void
  {
    this.currentItemData.image = false;
    this.imageChanged = false;
  }

  public setDefaultPrice(index : number) : void 
  {
    for(let i = 0; i < this.currentItemData.prices.length; i++)
    {
      this.currentItemData.prices[i].default = false;
    }

    this.currentItemData.prices[index].default = true;

  }

  public updateItem() : void
  {
    // Create form data
    const formData = new FormData(); 

    var changes = this.detectChanges();
            
    // Store form name as "file" with file data
    formData.append("changes", JSON.stringify(changes));

    if(this.currentItemData.image != false && this.imageChanged)
      formData.append("image", this.imageData,"image.jpg");

    this.loadingIndicatorService.loadingStates["updateProduct"] = true;

    this.productsService.updateProduct(formData).subscribe(
    res => 
    {
      this.loadingIndicatorService.loadingStates["updateProduct"] = false;
      this.getProducts();
      this.view = 'table';
      this.adding = false;
      this.sessionService.getColumnSettings().subscribe(
      res => 
      {
        this.sessionService.columnsSettings = res;
      },
      err => 
      {
        this.sessionService.logout();
        console.log(err);
      });
    },
    err => 
    {
      this.loadingIndicatorService.loadingStates["updateProduct"] = false;
      console.log(err);
    });
  }

  public uploadNewItem() : void 
  {
    // Create form data
    const formData = new FormData(); 
        
    // Store form name as "file" with file data
    formData.append("name", this.currentItemData.name);
    formData.append("alias", this.currentItemData.alias);
    formData.append("color", this.currentItemData.color);
    formData.append("stock", this.currentItemData.stock);
    formData.append("prices", JSON.stringify(this.currentItemData.prices));

    if(this.currentItemData.image != false && this.imageChanged)
      formData.append("image", this.imageData,"image.jpg");

    this.loadingIndicatorService.loadingStates["createProduct"] = true;

    this.productsService.createProduct(formData).subscribe(
    res => 
    {
      this.loadingIndicatorService.loadingStates["createProduct"] = false;
      this.getProducts();
      this.view = 'table';
      this.adding = false;
      this.editing = false;
      this.loadingIndicatorService.loadingStates["updateProduct"] = false;
      this.getProducts();
      this.view = 'table';
      this.adding = false;
      this.sessionService.getColumnSettings().subscribe(
      res => 
      {
        this.sessionService.columnsSettings = res;
      },
      err => 
      {
        this.sessionService.logout();
      });
    },
    err => 
    {
      this.loadingIndicatorService.loadingStates["createProduct"] = false;
      console.log(err);
    });
  }

  public previewImage(files : any) : void 
  {
    if (files.length === 0)
      return;
 
    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) 
    {
      alert("Only images are supported.");
      return;
    }
    
    this.imageData = files[0];
    var reader = new FileReader();
    reader.readAsDataURL(files[0]); 
    reader.onload = (_event : any) => { 
      this.currentItemData.image = _event.target.result; 
    }
    this.imageChanged = true;
  }

  public goBack() : void 
  {
    this.view = 'table';
    this.editing = false;
    this.adding = false;
  }

  public rowRightClick(event : any) : void
  {

  }

}
