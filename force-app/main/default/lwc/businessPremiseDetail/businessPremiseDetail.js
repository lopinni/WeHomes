import { LightningElement, api, wire, track } from 'lwc';

import getProductById from "@salesforce/apex/WH_LocationController.getProductById";

import ERROR from '@salesforce/label/c.Error';

export default class BusinessPremiseDetail extends LightningElement {

    @api recordId;

    productName;

    @wire(getProductById, { productId: '$recordId' })
    getProductInfo({ error, data }) {
        if (error) {
            this.dispatchEvent(new ShowToastEvent({
                title: ERROR,
                message: error,
                variant: 'error'
            }));
        } else if (data) {
            this.productName = data.Name;
        }
    }
}