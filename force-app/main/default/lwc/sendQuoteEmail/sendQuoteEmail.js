import { api, wire } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import LightningModal from 'lightning/modal';
import CONTACT_ID_FIELD from '@salesforce/schema/Quote.ContactId';

import sendQuoteEmail from "@salesforce/apex/WH_SendQuoteController.sendQuoteEmail";

import SEND_QUOTE_CONFIRM from '@salesforce/label/c.Send_Quote_Confirm';
import CLOSE from '@salesforce/label/c.Close';
import SUBMIT from '@salesforce/label/c.Submit';

const fields = [CONTACT_ID_FIELD];

export default class SendQuoteEmail extends LightningModal {

    label = {
        SEND_QUOTE_CONFIRM,
        CLOSE,
        SUBMIT
    };

    showSpinner = false;

    @api recordId;

    @wire(getRecord, { recordId: '$recordId', fields })
    record;

    get contactId() {
        return getFieldValue(this.record.data, CONTACT_ID_FIELD);
    }

    handleClick() {
        this.showSpinner = true;
        sendQuoteEmail({ 
            quoteId: this.recordId,
            contactId: this.contactId
        }).then(() => {
            this.dispatchEvent(new CustomEvent('success'));
        }).catch(error => {
            this.dispatchEvent(new CustomEvent('fail'));
        });
    }

    handleCancel() {
        this.dispatchEvent(new CustomEvent('close'));
    }

}