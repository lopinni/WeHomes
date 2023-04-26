import { LightningElement, api, wire } from 'lwc';
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { publish, MessageContext } from 'lightning/messageService';

import updateMainImage from "@salesforce/apex/WH_LocationController.updateMainImage";
import deleteFile from "@salesforce/apex/WH_LocationController.deleteFile";
import UPDATE_MAIN_IMAGE_CHANNEL from '@salesforce/messageChannel/Update_Main_Image__c';

export default class ImageCard extends LightningElement {

    @wire(MessageContext)
    messageContext;

    @api file;
    @api recordId;
    @api thumbnail;

    preview;

    get iconName() {
        return "doctype:image";
    }

    setMainImage() {
        updateMainImage({
            recordId: this.recordId,
            docVerId: this.file.Id
        }).then(() => {
            const payload = { 
                image: this.thumbnail
            };
            publish(this.messageContext, UPDATE_MAIN_IMAGE_CHANNEL, payload);
        }).then(() => {
            this.dispatchEvent(new ShowToastEvent({
                title: 'Success',
                message: 'Main image set',
                variant: 'success'
            }));
        }).catch((error) => {
            this.dispatchEvent(new ShowToastEvent({
                title: 'Error',
                message: error,
                variant: 'error'
            }));
        });
    }

    showPreview() {
        this.preview = true;
    }

    hidePreview() {
        this.preview = false;
    }

    deleteImage() {
        deleteFile({
            id: this.file.Id
        }).then(() => {
            this.file = undefined;
            this.dispatchEvent(new ShowToastEvent({
                title: 'Success',
                message: 'File successfully deleted',
                variant: 'success'
            }));
        }).catch((error) => {
            this.dispatchEvent(new ShowToastEvent({
                title: 'Error',
                message: error,
                variant: 'error'
            }));
        });
    }
}