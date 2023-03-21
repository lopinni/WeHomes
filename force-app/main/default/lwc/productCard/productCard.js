import { LightningElement, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class ProductCard extends NavigationMixin(LightningElement) {

    @api product;

    navigateToRecordPage() {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.product.Id,
                objectApiName: 'Product2',
                actionName: 'view'
            }
        });
    }

}