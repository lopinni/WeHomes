import { LightningElement, api, wire } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import CONTACT_ID_FIELD from '@salesforce/schema/Quote.ContactId';

import sendQuoteEmail from "@salesforce/apex/WH_SendQuoteController.sendQuoteEmail";

const fields = [CONTACT_ID_FIELD];

export default class SendQuoteEmail extends LightningElement {

    @api recordId;

    @wire(getRecord, { recordId: '$recordId', fields })
    record;

    get contactId() {
        return getFieldValue(this.record.data, CONTACT_ID_FIELD);
    }

    handleClick() {
        sendQuoteEmail({ 
            quoteId: this.recordId,
            contactId: this.contactId
        }).catch(error => {
            this.showError(error);
        });
    }

}