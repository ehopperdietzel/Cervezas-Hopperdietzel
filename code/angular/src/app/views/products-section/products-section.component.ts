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
      title:'Imagen',
      key:'imagePath',
      type:'image'
    },
    {
      title:'Producto',
      key:'name',
      type:'text'
    },
    {
      title:'Precio por defecto',
      key:'name',
      type:'text'
    },
    {
      title:'Cantidad disponible',
      key:'avalaible',
      type:'text'
    }];

  public rows : Array<any> = [];

  public displayingProduct : boolean = false;
  public adding : boolean = false;
  public imageChanged : boolean = false;

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

  ngOnInit(): void {
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

    this.productsService.createProduct(formData).subscribe(
      res => 
      {
        this.loadingIndicatorService.loadingStates["createProduct"] = false;
        //this.usersModal.close();
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
