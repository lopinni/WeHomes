import { LightningElement, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import SUBJECT from '@salesforce/schema/Case.Subject';
import TYPE from '@salesforce/schema/Case.Type';
import DESCRIPTION from '@salesforce/schema/Case.Description';

import getCases from "@salesforce/apex/WH_CaseController.getCases";

import ERROR from '@salesforce/label/c.Error';
import LOADING from '@salesforce/label/c.Loading';
import MY_CASES from '@salesforce/label/c.My_Cases';

export default class CommunityCaseManager extends LightningElement {

    fields = [SUBJECT, TYPE, DESCRIPTION];

    labels = {
        LOADING,
        MY_CASES
    }

    caseColumns = [
        { label: 'Status', fieldName: 'Status' },
        { label: 'Subject', fieldName: 'Show_Case__c', type: 'url', typeAttributes: { label: { fieldName: 'Subject'} } },
        { label: 'Created Date', type: 'date', fieldName: 'CreatedDate' },
        { label: 'Closed Date', type: 'date', fieldName: 'ClosedDate' },
    ];

    caseData;
    caseDataTemp;

    loaded = false;
    showPaginationControls = true;

    pageSize = 10;
    page;
    pages;

    @wire(getCases)
    populateTable(value) {
        const { data, error } = value;
        if (data) {
            this.populateFields(data);
            if(data.length <= this.pageSize) {
                this.showPaginationControls = false;
            }
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

    populateFields(data) {
        this.caseData = data;
        this.page = 1;
        this.pages = Math.ceil(this.caseData.length / this.pageSize);
        this.setPagination();
    }

    setPagination() {
        const start = (this.page - 1) * this.pageSize;
        let end;
        if((start + this.pageSize) > this.caseData.length) {
            end = this.caseData.length;
        } else {
            end = start + this.pageSize;
        }
        this.caseDataTemp = this.caseData.slice(start, end);
    }

    handleMove(event) {
        this.page = event.detail;
        this.setPagination();
    }

}