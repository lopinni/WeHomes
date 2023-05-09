import { LightningElement, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
import CreateCaseModal from 'c/createCaseModal';

import getCases from "@salesforce/apex/WH_CaseController.getCases";

import ERROR from '@salesforce/label/c.Error';
import SUCCESS from '@salesforce/label/c.Success';
import LOADING from '@salesforce/label/c.Loading';
import LOG_A_CASE from '@salesforce/label/c.Log_a_Case';
import CASES from '@salesforce/label/c.Cases';
import ALL_CASES from '@salesforce/label/c.All_Cases';
import SUCCESS_MESSAGE from '@salesforce/label/c.Case_created_successfully';

export default class CommunityCaseManager extends LightningElement {

    labels = {
        LOADING,
        LOG_A_CASE,
        CASES,
        ALL_CASES
    }

    caseColumns = [
        { label: 'Status', fieldName: 'Status' },
        { label: 'Subject', fieldName: 'Show_Case__c', type: 'url', typeAttributes: { label: { fieldName: 'Subject'} } },
        { label: 'Created Date', fieldName: 'CreatedDate' },
        { label: 'Closed Date', fieldName: 'ClosedDate' },
    ];

    caseData;
    refreshCaseData;

    loaded = false;

    @wire(getCases)
    populateTable(value) {
        this.refreshCaseData = value;
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
        this.loaded = true;
    }

    async openNewCase() {
        const result = await CreateCaseModal.open();
        setTimeout(() => {
            refreshApex(this.refreshCaseData);
        }, "500");
        if(result == 'success') {
            this.dispatchEvent(new ShowToastEvent({
                title: SUCCESS,
                message: SUCCESS_MESSAGE,
                variant: 'success'
            }));
        }
    }

}