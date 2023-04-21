import { LightningElement, api, track, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

import getURL from "@salesforce/apex/WH_LocationController.getURL";
import getBusinessProductPriceById from "@salesforce/apex/WH_PricebookManagerController.getBusinessProductPriceById";

import LOADING from '@salesforce/label/c.Loading';
import TOTAL_SURFACE_AREA from '@salesforce/label/c.Total_Surface_Area';
import FURNISHED from '@salesforce/label/c.Furnished';
import PRICE from '@salesforce/label/c.Price';
import WHEELCHAIR_ACCESSIBLE from '@salesforce/label/c.Wheelchair_Accessible';
import ELEVATOR_ACCESS from '@salesforce/label/c.Elevator_Access';
import AIR_CONDITIONING from '@salesforce/label/c.Air_Conditioning';
import YES from '@salesforce/label/c.Yes';
import NO from '@salesforce/label/c.No';

export default class ProductCard extends NavigationMixin(LightningElement) {

    labels = {
        LOADING,
        TOTAL_SURFACE_AREA,
        FURNISHED,
        PRICE,
        WHEELCHAIR_ACCESSIBLE,
        ELEVATOR_ACCESS,
        AIR_CONDITIONING,
        YES,
        NO
    };

    @api product;
    @track URL;

    @api isCommunity;

    productPrice;

    loaded = false;

    connectedCallback() {
        getBusinessProductPriceById({ productId: this.product.Id }).then(result => {
            this.productPrice = result.UnitPrice;
            this.loaded = true;
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