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
        if (this.file.Extension) {
        if (this.file.Extension === "pdf") {
            return "doctype:pdf";
        }
        if (this.file.Extension === "ppt") {
            return "doctype:ppt";
        }
        if (this.file.Extension === "xls") {
            return "doctype:excel";
        }
        if (this.file.Extension === "csv") {
            return "doctype:csv";
        }
        if (this.file.Extension === "txt") {
            return "doctype:txt";
        }
        if (this.file.Extension === "xml") {
            return "doctype:xml";
        }
        if (this.file.Extension === "doc") {
            return "doctype:word";
        }
        if (this.file.Extension === "zip") {
            return "doctype:zip";
        }
        if (this.file.Extension === "rtf") {
            return "doctype:rtf";
        }
        if (this.file.Extension === "psd") {
            return "doctype:psd";
        }
        if (this.file.Extension === "html") {
            return "doctype:html";
        }
        if (this.file.Extension === "gdoc") {
            return "doctype:gdoc";
        }
        }
        return "doctype:image";
    }

    setMainImage() {
        updateMainImage({
            recordId: this.recordId,
            url: this.thumbnail
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