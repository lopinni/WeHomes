import { LightningElement, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { subscribe, MessageContext } from 'lightning/messageService';
import { refreshApex } from '@salesforce/apex';

import SUBJECT from '@salesforce/schema/Case.Subject';
import TYPE from '@salesforce/schema/Case.Type';
import DESCRIPTION from '@salesforce/schema/Case.Description';

import getCases from "@salesforce/apex/WH_CaseController.getCases";

import ERROR from '@salesforce/label/c.Error';
import LOADING from '@salesforce/label/c.Loading';
import MY_CASES from '@salesforce/label/c.My_Cases';

import UPDATE_CASE_LIST_CHANNEL from '@salesforce/messageChannel/Update_Case_List__c';

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
    caseDataRefresh;
    caseDataTemp;

    loaded = false;
    showPaginationControls = true;

    pageSize = 10;
    page;
    pages;

    @wire(MessageContext)
    messageContext;

    subscription = null;

    connectedCallback() {
        this.subscription = subscribe(
            this.messageContext,
            UPDATE_CASE_LIST_CHANNEL,
            () => this.handleMessage()
        );
    }

    handleMessage() {
        this.loaded = false;
        setTimeout(() => {
            refreshApex(this.caseDataRefresh);
            this.loaded = true;
        }, "500");
    }

    @wire(getCases)
    populateTable(value) {
        this.caseDataRefresh = value;
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