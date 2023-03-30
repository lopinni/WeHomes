import { LightningElement, api, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import NAME_FIELD from '@salesforce/schema/Pricebook2.Name';
import DESCRIPTION_FIELD from '@salesforce/schema/Pricebook2.Description';
import IS_STANDARD_FIELD from '@salesforce/schema/Pricebook2.IsStandard';
import START_DATE_FIELD from '@salesforce/schema/Pricebook2.StartDate__c';
import END_DATE_FIELD from '@salesforce/schema/Pricebook2.EndDate__c';

import getProductRecordTypeByName from "@salesforce/apex/WH_PricebookManagerController.getProductRecordTypeByName";

import ERROR from '@salesforce/label/c.Error';
import SUCCESS from '@salesforce/label/c.Success';
import CREATE_PB_ERROR_MESSAGE from '@salesforce/label/c.Create_PB_Error_Message';
import CREATE_PB_SUCCESS_MESSAGE from '@salesforce/label/c.Create_PB_Success_Message';

export default class PricebookModal extends LightningElement {

    picklistValue = 'apartments';

    @wire(getProductRecordTypeByName, { Name: "Apartment PB" })
    apartmentsId;

    @wire(getProductRecordTypeByName, { Name: "Business Premise PB" })
    businessPremisesId;

    get options() {
        return [
            { label: 'Apartments', value: 'apartments' },
            { label: 'Business Premises', value: 'businessPremises' }
        ];
    }

    fields = [
        NAME_FIELD, 
        DESCRIPTION_FIELD,
        IS_STANDARD_FIELD,
        START_DATE_FIELD,
        END_DATE_FIELD
    ];

    @api show;

    closeModal() {
        this.dispatchEvent(new CustomEvent('close'));
    }

    handleSubmit(event) {
        event.preventDefault();
        const fields = event.detail.fields;
        if(this.template.querySelector('lightning-combobox').value == 'apartments') {
            fields.RecordTypeId = this.apartmentsId.data.Id;
        } else {
            fields.RecordTypeId = this.businessPremisesId.data.Id;
        }
        this.template.querySelector('lightning-record-form').submit(fields);
        this.dispatchEvent(new CustomEvent('refresh'));
    }

    handleError() {
        this.dispatchEvent(new ShowToastEvent({
            title: ERROR,
            message: CREATE_PB_ERROR_MESSAGE,
            variant: 'error'
        }));
    }

    handleSuccess() {
        this.dispatchEvent(new ShowToastEvent({
            title: SUCCESS,
            message: CREATE_PB_SUCCESS_MESSAGE,
            variant: 'success'
        }));
    }

}