import { LightningElement, api } from 'lwc';

import getDistributionFiles from "@salesforce/apex/WH_LocationController.getDistributionFiles";

export default class CommunityProductGallery extends LightningElement {

    @api recordId;

    images;

    connectedCallback(){
        getDistributionFiles({ productId: this.recordId })
        .then(result => {
            this.images = result;
            console.log("IMAGES", this.images);
            console.log("RESULT", result);
        }).catch(error => {
            console.log(error);
        });
    }

}