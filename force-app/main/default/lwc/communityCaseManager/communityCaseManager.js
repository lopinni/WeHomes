import { LightningElement, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
import CreateCaseModal from 'c/createCaseModal';

import getCases from "@salesforce/apex/WH_CaseController.getCases";

import ERROR from '@salesforce/label/c.Error';
import SUCCESS from '@salesforce/label/c.Success';
import LOADING from '@salesforce/label/c.Loading';
import LOG_A_CASE from '@salesforce/label/c.Log_a_Case';
import MY_CASES from '@salesforce/label/c.My_Cases';
import SUCCESS_MESSAGE from '@salesforce/label/c.Case_created_successfully';

export default class CommunityCaseManager extends LightningElement {

    labels = {
        LOADING,
        LOG_A_CASE,
        MY_CASES
    }

    caseColumns = [
        { label: 'Status', fieldName: 'Status' },
        { label: 'Subject', fieldName: 'Show_Case__c', type: 'url', typeAttributes: { label: { fieldName: 'Subject'} } },
        { label: 'Created Date', type: 'date', fieldName: 'CreatedDate' },
        { label: 'Closed Date', type: 'date', fieldName: 'ClosedDate' },
    ];

    caseData;
    refreshCaseData;
    caseDataTemp;

    loaded = false;
    showPaginationControls = true;

    pageSize = 10;
    page;
    pages;

    @wire(getCases)
    populateTable(value) {
        this.refreshCaseData = value;
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

    handleStatusChange(event) {
        if (event.detail.status === 'FINISHED') {
            setTimeout(() => {
                refreshApex(this.refreshCaseData);
            }, "500");
            this.dispatchEvent(new ShowToastEvent({
                title: SUCCESS,
                message: SUCCESS_MESSAGE,
                variant: 'success'
            }));
        }
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