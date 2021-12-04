import { Component, OnInit } from '@angular/core';
import { LoadingIndicatorService } from 'src/app/services/loading-indicator.service';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'products-section',
  templateUrl: './products-section.component.html',
  styleUrls: ['./products-section.component.css']
})
export class ProductsSectionComponent implements OnInit {

  constructor(public productsService : ProductsService,public loadingIndicatorService : LoadingIndicatorService) 
  {}

  public columns : Array<any> = [
    {
      title:'Producto',
      key:'name',
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

  public rows : Array<any> = [];

  public displayingProduct : boolean = false;
  public adding : boolean = false;
  public imageChanged : boolean = false;

  public products : any = [];

  public imageData : any;

  public currentProductData : any = {
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

  ngOnInit() : void 
  {
    this.getProducts();
  }

  public rowLeftClick(event : any) : void
  {
    event.preventDefault();
    this.currentProductData = event.row;
    this.displayingProduct = true;
  }

  public removePrice(index:number) : void 
  {
    var isDefault = this.currentProductData.prices[index].default;
    this.currentProductData.prices.splice(index,1);
    if(isDefault)
      this.currentProductData.prices[0].default = true;
  }

  public deleteProduct()
  {
    this.loadingIndicatorService.loadingStates["deleteProduct"] = true;

    this.productsService.deleteProduct(this.currentProductData.id).subscribe(
      res => 
      {
        this.loadingIndicatorService.loadingStates["deleteProduct"] = false;
        this.getProducts();
        this.displayingProduct = false;
        console.log(res);
      },
      err => 
      {
        this.loadingIndicatorService.loadingStates["deleteProduct"] = false;
        //this.usersModal.errorMessage = err.error.message;
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
        //this.usersModal.close();
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
        //this.usersModal.errorMessage = err.error.message;
        console.log(err);
      });
  }

  public addProduct() : void
  {
    this.imageChanged = false;
    this.currentProductData =
    {
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
    this.adding = true;
    this.displayingProduct = true;
  }

  public addPrice() : void 
  {
    this.currentProductData.prices.push(
    {
      name:"",
      price:0,
      default:false
    })
  }

  public getCurrentProductDataImage() : string
  {
    if(!this.currentProductData.image && !this.imageChanged)
      return "assets/img/icons/no-image.jpg";
    else if(this.imageChanged)
      return this.currentProductData.image;
    else
      return "../../../assets/img/products/"+this.currentProductData.id+".jpg";
  }

  public removeImage() : void
  {
    this.currentProductData.image = false;
    this.imageChanged = false;
  }

  public setDefaultPrice(index : number) : void 
  {
    for(let i = 0; i < this.currentProductData.prices.length; i++)
    {
      this.currentProductData.prices[i].default = false;
    }

    this.currentProductData.prices[index].default = true;

  }

  public uploadNewProduct() : void 
  {
    // Create form data
    const formData = new FormData(); 
        
    // Store form name as "file" with file data
    formData.append("name", this.currentProductData.name);
    formData.append("alias", this.currentProductData.alias);
    formData.append("color", this.currentProductData.color);
    formData.append("prices", JSON.stringify(this.currentProductData.prices));

    if(this.currentProductData.image != false && this.imageChanged)
      formData.append("image", this.imageData,"image.jpg");

    this.loadingIndicatorService.loadingStates["createProduct"] = true;

    this.productsService.createProduct(formData).subscribe(
      res => 
      {
        this.loadingIndicatorService.loadingStates["createProduct"] = false;
        //this.usersModal.close();
        this.getProducts();
        this.displayingProduct = false;
        this.adding = false;
        
        console.log(res);
      },
      err => 
      {
        this.loadingIndicatorService.loadingStates["createProduct"] = false;
        //this.usersModal.errorMessage = err.error.message;
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
      this.currentProductData.image = _event.target.result; 
    }
    this.imageChanged = true;
  }

  public goBack() : void 
  {
    this.displayingProduct = false;
  }

  public rowRightClick(event : any) : void
  {

  }

}
