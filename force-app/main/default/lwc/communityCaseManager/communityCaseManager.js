import { LightningElement, wire } from 'lwc';
import CreateCaseModal from 'c/createCaseModal';

import getCases from "@salesforce/apex/WH_CaseController.getCases";

import ERROR from '@salesforce/label/c.Error';

export default class CommunityCaseManager extends LightningElement {

    caseColumns = [
        { label: 'Status', fieldName: 'Status' },
        { label: 'Subject', fieldName: 'Show_Case__c', type: 'url', typeAttributes: { label: { fieldName: 'Subject'} } },
        { label: 'Created Date', fieldName: 'CreatedDate' },
        { label: 'Closed Date', fieldName: 'ClosedDate' },
    ];

    caseData;

    @wire(getCases)
    populateTable(value) {
        const { data, error } = value;
        if (data) {
            this.caseData = data;
        } else if (error) {
            console.log("ERROR", error);
            this.dispatchEvent(new ShowToastEvent({
                title: ERROR,
                message: error.body.message,
                variant: 'error'
            }));
        }
    }

    async openNewCase() {
        const result = await CreateCaseModal.open();
        console.log(result);
    }

}