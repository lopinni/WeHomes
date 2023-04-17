import { LightningElement, api, track, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

import getURL from "@salesforce/apex/WH_LocationController.getURL";
import getBusinessProductPriceById from "@salesforce/apex/WH_PricebookManagerController.getBusinessProductPriceById";

export default class ProductCard extends NavigationMixin(LightningElement) {

    @api product;
    @track URL;

    @api isCommunity;

    productPrice;

    connectedCallback() {
        getBusinessProductPriceById({ productId: this.product.Id }).then(result => {
            console.log(result);
            this.productPrice = result.UnitPrice;
        }).catch(error => {
            console.log(error);
        });
    }

    @wire(getURL, { recordId: "$product.Id" })
    fileResponse(value) {
        const { data, error } = value;
        if (data) {
            this.URL = data[0].DisplayUrl;
            this.loaded = true;
        } else if (error) {
            console.log(error);
        }
    }

    navigateToRecordPage() {
        if(this.isCommunity) {
            this[NavigationMixin.Navigate]({
                type: 'comm__namedPage',
                attributes: {
                    name: 'Details__c'
                },
                state: {
                    recordId: this.product.Id
                }
            });
        } else {
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

}