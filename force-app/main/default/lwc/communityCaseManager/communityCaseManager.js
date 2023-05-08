import { LightningElement, wire } from 'lwc';

import getCases from "@salesforce/apex/WH_CaseController.getCases";

export default class CommunityCaseManager extends LightningElement {

    caseColumns = [
        { label: 'Case Number', fieldName: 'Show_Case__c', type: 'url', typeAttributes: { label:{ fieldName: 'CaseNumber'} } },
        { label: 'Status', fieldName: 'Status' },
        { label: 'Subject', fieldName: 'Subject' },
        { label: 'Created Date', fieldName: 'CreatedDate' },
        { label: 'Closed Date', fieldName: 'ClosedDate' },
    ];

    caseData;

    @wire(getCases)
    populateTable(value) {
        const { data, error } = value;
        if (data) {
            console.log("DATA", data);
            this.caseData = data;
        } else if (error) {
            console.log("ERROR", error);
        }
    }

}