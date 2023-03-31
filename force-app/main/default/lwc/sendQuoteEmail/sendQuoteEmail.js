import { LightningElement, api, wire } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import CONTACT_ID_FIELD from '@salesforce/schema/Quote.ContactId';

const fields = [CONTACT_ID_FIELD];

export default class SendQuoteEmail extends LightningElement {

    @api recordId;

    @wire(getRecord, { recordId: '$recordId', fields })
    record;

    get contactId() {
        return getFieldValue(this.record.data, CONTACT_ID_FIELD);
    }

    handleClick() {
        console.log("klik1", this.recordId);
        console.log("klik2", this.record);
        console.log("klik3", this.contactId);
    }

}