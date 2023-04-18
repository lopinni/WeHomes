import { LightningElement, api } from 'lwc';

import getDistributionFiles from "@salesforce/apex/WH_LocationController.getDistributionFiles";

export default class CommunityProductGallery extends LightningElement {

    @api recordId;

    images;

    preview = false;
    previewImage;

    connectedCallback(){
        getDistributionFiles({ productId: this.recordId })
        .then(result => {
            this.images = result;
        }).catch(error => {
            console.log(error);
        });
    }

    showPreview(event) {
        this.previewImage = event.target.dataset.url;
        this.preview = true;
    }

    hidePreview() {
        this.preview = false;
    }

}