import { LightningElement, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import getDistributionFiles from "@salesforce/apex/WH_LocationController.getDistributionFiles";

import ERROR from '@salesforce/label/c.Error';

export default class CommunityProductGallery extends LightningElement {

    @api recordId;

    images;

    preview = false;
    previewImage

    loaded = false;

    connectedCallback(){
        getDistributionFiles({ productId: this.recordId })
        .then(result => {
            this.images = result;
            this.loaded = true;
        }).catch(error => {
            this.dispatchEvent(new ShowToastEvent({
                title: ERROR,
                message: error,
                variant: 'error'
            }));
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