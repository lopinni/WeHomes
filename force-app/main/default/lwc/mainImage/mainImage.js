import { LightningElement, api, wire, track } from 'lwc';
import { subscribe, MessageContext } from 'lightning/messageService';

import UPDATE_MAIN_IMAGE_CHANNEL from '@salesforce/messageChannel/Update_Main_Image__c';
import getURL from "@salesforce/apex/WH_LocationController.getURL";

export default class MainImage extends LightningElement {

    @wire(MessageContext)
    messageContext;

    @api recordId;
    @track URL;

    loaded = false;

    @wire(getURL, { recordId: "$recordId" })
    fileResponse(value) {
        const { data, error } = value;
        if (data) {
            this.URL = data[0].DisplayUrl;
            this.loaded = true;
        } else if (error) {
            console.log(error);
        }
    }

    subscribeToMessageChannel() {
        this.subscription = subscribe(
            this.messageContext,
            UPDATE_MAIN_IMAGE_CHANNEL,
            (message) => this.handleMessage(message)
        );
    }

    handleMessage(message) {
        this.URL = message.image;
    }

    connectedCallback() {
        this.subscribeToMessageChannel();
    }

    tagLoaded() {
        this.loaded = true;
    }
}