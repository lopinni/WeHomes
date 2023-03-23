import { LightningElement, api, wire } from 'lwc';

import NAME_FIELD from '@salesforce/schema/Pricebook2.Name';
import DESCRIPTION_FIELD from '@salesforce/schema/Pricebook2.Description';
import IS_ACTIVE_FIELD from '@salesforce/schema/Pricebook2.IsActive';
import IS_STANDARD_FIELD from '@salesforce/schema/Pricebook2.IsStandard';
import START_DATE_FIELD from '@salesforce/schema/Pricebook2.StartDate__c';
import END_DATE_FIELD from '@salesforce/schema/Pricebook2.EndDate__c';

import getProductRecordTypeByName from "@salesforce/apex/WH_PricebookManagerController.getProductRecordTypeByName";

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
        IS_ACTIVE_FIELD,
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

}