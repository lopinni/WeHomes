import { LightningElement, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import getDistributionFiles from "@salesforce/apex/WH_LocationController.getDistributionFiles";

import ERROR from '@salesforce/label/c.Error';

export default class CommunityProductGallery extends LightningElement {

    @api recordId;

    images;

    preview = false;
    previewImage;
    previewIndex;

    loaded = false;

    @api
    get showNavigation() {
        if(this.images.length > 1) {
            return true;
        } else {
            return false;
        }
    }
    set showNavigation(value) { }

    connectedCallback(){
        getDistributionFiles({ productId: this.recordId })
        .then(result => {
            this.images = result;
            this.loaded = true;
        }).catch(error => {
            this.dispatchEvent(new ShowToastEvent({
                title: ERROR,
                message: error.statusText,
                variant: 'error'
            }));
        });
    }

    showPreview(event) {
        this.previewIndex = event.target.dataset.index;
        this.previewImage = event.target.dataset.url;
        this.preview = true;
    }

    hidePreview() {
        this.preview = false;
    }

    showPrevious() {
        this.previewIndex -= 1;
        if(this.previewIndex < 0) {
            this.previewIndex = this.images.length - 1;
        }
        this.previewImage = this.images[this.previewIndex].ContentDownloadUrl;
    }

    showNext() {
        this.previewIndex += 1;
        if(this.previewIndex == "01") {
            this.previewIndex = 1;
        }
        if(this.previewIndex >= this.images.length) {
            this.previewIndex = 0;
        }
        this.previewImage = this.images[this.previewIndex].ContentDownloadUrl;
    }

}