import { LightningElement, api, wire, track } from 'lwc';

import getProductById from "@salesforce/apex/WH_LocationController.getProductById";
import getBusinessProductPriceById from "@salesforce/apex/WH_PricebookManagerController.getBusinessProductPriceById";

export default class BusinessPremiseDetail extends LightningElement {

    @api recordId;

    productName;

    productPrice;

    connectedCallback() {
        getProductById({ productId: this.recordId }).then(result => {
            this.productName = result.Name;
        }).catch(error => {
            console.log(error);
        });
        getBusinessProductPriceById({ productId: this.recordId }).then(result => {
            this.productPrice = result.UnitPrice;
        }).catch(error => {
            console.log(error);
        });
    }

}