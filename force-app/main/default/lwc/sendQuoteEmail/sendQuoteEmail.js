import { LightningElement, api, wire } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import CONTACT_ID_FIELD from '@salesforce/schema/Quote.ContactId';

import sendQuoteEmail from "@salesforce/apex/WH_SendQuoteController.sendQuoteEmail";

import ERROR from '@salesforce/label/c.Error';

const fields = [CONTACT_ID_FIELD];

export default class SendQuoteEmail extends LightningElement {

    showBottomBox = false;
    showSuccess = false;

    @api recordId;

    @wire(getRecord, { recordId: '$recordId', fields })
    record;

    get contactId() {
        return getFieldValue(this.record.data, CONTACT_ID_FIELD);
    }

    handleClick() {
        this.showSuccess = false;
        this.showBottomBox = true;
        sendQuoteEmail({ 
            quoteId: this.recordId,
            contactId: this.contactId
        }).then(() => {
            this.showSuccess = true;
        }).catch(error => {
            this.dispatchEvent(new ShowToastEvent({
                title: ERROR,
                message: error,
                variant: 'error'
            }));
        });
    }

}