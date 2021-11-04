import { ModalService } from 'src/app/services/modal.service';
export class Modal 
{
    public active : boolean = false;
    public name : string;

    constructor(modalName:string,protected modalService : ModalService)
    {
        modalService.registerModal(this);
        this.name = modalName;
    }

    public open()
    {
        this.modalService.open(this.name);
    }

    public close()
    {
        this.modalService.close();
    }
}
