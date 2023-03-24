import { LightningElement, wire, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from "@salesforce/apex";

import { loadStyle } from "lightning/platformResourceLoader";
import noHeader from '@salesforce/resourceUrl/NoHeaderStylesheet';

import getPricebooks from "@salesforce/apex/WH_PricebookManagerController.getPricebooks";
import getStandardPBEs from "@salesforce/apex/WH_PricebookManagerController.getStandardPBEs";
import getPBEsById from "@salesforce/apex/WH_PricebookManagerController.getPBEsById";
import updatePriceBookEntries from "@salesforce/apex/WH_PricebookManagerController.updatePriceBookEntries";

const actions = [
    { label: 'View', name: 'view' },
    { label: 'Products', name: 'products' },
    { label: 'Add Products', name: 'add' },
];

const pricebookColumns = [
    { label: 'Name', fieldName: 'Name', editable : 'true' },
    { label: 'Description', fieldName: 'Description', editable : 'true' },
    { label: 'Active', fieldName: 'IsActive', type: 'boolean', editable : 'true' },
    { label: 'Standard', fieldName: 'IsStandard', type: 'boolean' },
    { label: 'Start Date', fieldName: 'StartDate__c', type: 'date', editable : 'true' },
    { label: 'End Date', fieldName: 'EndDate__c', type: 'date', editable : 'true' },
    { label: 'Type', fieldName: 'TypeInfo__c' },
    {
        type: 'action',
        typeAttributes: { rowActions: actions },
    },
];

const entryColumns = [
    { label: 'Product Name', fieldName: 'ProductName__c' },
    { label: 'Product Type', fieldName: 'ProductType__c' },
    { label: 'Price', fieldName: 'UnitPrice', type: 'currency', editable : 'true' }
];

export default class PricebookManager extends NavigationMixin(LightningElement) {

    loaded = false;

    @track pricebookData;
    @track refreshPriceBookData;
    pricebookColumns = pricebookColumns;
    entryColumns = entryColumns;

    @track priceBookEntryData;

    openNewPBModal = false;
    openAddProductModal = false;
    @track priceBookToAdd;

    saveDraftValues = [];
    entryDraftValues = [];

    constructor() {
        super();
        loadStyle(this, noHeader);
    }

    connectedCallback() {
        this.loadPBEs();
        this.loaded = true;
    }

    loadPBEs() {
        getStandardPBEs().then(result => {
            this.priceBookEntryData = result;
        }).catch(error => {
            this.dispatchEvent(new ShowToastEvent({
                title: 'Error',
                message: error,
                variant: 'error'
            }));
        });
    }

    loadPBEsById(id) {
        getPBEsById({ Id: id }).then(result => {
            console.log(result);
            this.priceBookEntryData = result;
        }).catch(error => {
            this.dispatchEvent(new ShowToastEvent({
                title: 'Error',
                message: error,
                variant: 'error'
            }));
        });
    }

    @wire(getPricebooks)
    populatePricebookTable(value) {
        this.refreshPriceBookData = value;
        console.log(value);
        const { data, error } = value;
        if (data) {
            console.log(data);
            this.pricebookData = data;
        } else if (error) {
            console.log(error);
        }
    }

    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const rowId = event.detail.row.Id;
        switch (actionName) {
            case 'view':
                this.navigateToRecordPage(rowId);
                break;
            case 'products':
                this.loadPBEsById(rowId);
                break;
            case 'add':
                this.priceBookToAdd = rowId;
                this.openAddProduct();
                break;
            default:
        }
    }

    navigateToRecordPage(rowId) {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: rowId,
                objectApiName: 'Pricebook2',
                actionName: 'view'
            }
        });
    }

    openNewPB() {
        this.openNewPBModal = true;
    }

    closeNewPB() {
        this.openNewPBModal = false;
    }

    openAddProduct() {
        this.openAddProductModal = true;
    }

    closeAddProduct() {
        this.openAddProductModal = false;
    }

    handleSave(event) {
        this.saveDraftValues = event.detail.draftValues;
        const recordInputs = this.saveDraftValues.slice().map(draft => {
            const fields = Object.assign({}, draft);
            return { fields };
        });
        const promises = recordInputs.map(recordInput => updateRecord(recordInput));
        Promise.all(promises).then(() => {
            this.ShowToast('Success', 'Price Book updated successfully', 'success', 'dismissable');
            this.saveDraftValues = [];
        }).catch(error => {
            this.ShowToast('Error', error, 'error', 'dismissable');
        }).finally(() => {
            this.saveDraftValues = [];
            this.refreshPricebooks();
        });
    }

    handleEntrySave(event) {
        this.entryDraftValues = event.detail.draftValues;
        const recordInputs = this.entryDraftValues.slice().map(draft => {
            const fields = Object.assign({}, draft);
            return { fields };
        });
        const promises = recordInputs.map(recordInput => updateRecord(recordInput));
        Promise.all(promises).then(() => {
            this.ShowToast('Success', 'Price Book Entry updated successfully', 'success', 'dismissable');
            this.entryDraftValues = [];
        }).catch(error => {
            this.ShowToast('Error', error, 'error', 'dismissable');
        }).finally(() => {
            this.entryDraftValues = [];
            this.loadPBEs();
        });
    }
 
    ShowToast(title, message, variant, mode){
        const evt = new ShowToastEvent({
            title: title,
            message:message,
            variant: variant,
            mode: mode
        });
        this.dispatchEvent(evt);
    }

    refreshPricebooks() {
        refreshApex(this.refreshPriceBookData);
        this.openNewPBModal = false;
    }

    setupDiscountModal() {
        let recordsToDiscount = this.refs.entries.getSelectedRows();
        let discountValue = this.template.querySelector('lightning-input').value;
        updatePriceBookEntries({
            discount: discountValue,
            entries: recordsToDiscount
        }).then(() => {
            this.ShowToast('Success', 'Price Book Entries updated successfully', 'success', 'dismissable');
        }).then(() => {
            console.log(done);
            this.loadPBEs();
        }).catch(error => {
            console.log(error);
        });
    }

}