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
    priceBookToAdd;

    saveDraftValues = [];
    entryDraftValues = [];

    constructor() {
        super();
        loadStyle(this, noHeader);
    }

    connectedCallback() {
        this.loadPBEs();
    }

    showError(error) {
        this.dispatchEvent(new ShowToastEvent({
            title: 'Error',
            message: error,
            variant: 'error'
        }));
    }

    showSuccess(message) {
        this.dispatchEvent(new ShowToastEvent({
            title: 'Success',
            message: message,
            variant: 'success'
        }));
    }

    loadPBEs() {
        this.loaded = false;
        getStandardPBEs().then(result => {
            this.priceBookEntryData = result;
            this.loaded = true;
        }).catch(error => {
            this.showError(error);
        });
    }

    loadPBEsById(id) {
        this.loaded = false;
        getPBEsById({ Id: id }).then(result => {
            this.priceBookEntryData = result;
            this.loaded = true;
        }).catch(error => {
            this.showError(error);
        });
    }

    @wire(getPricebooks)
    populatePricebookTable(value) {
        this.loaded = false;
        this.refreshPriceBookData = value;
        const { data, error } = value;
        if (data) {
            console.log(data);
            this.pricebookData = data;
        } else if (error) {
            this.showError(error);
        }
        this.loaded = true;
    }

    handleRowAction(event) {
        this.loaded = false;
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
        this.loaded = true;
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

    closeWithToast() {
        this.openAddProductModal = false;
        this.showSuccess('Products added to Price Book.');
    }

    closeWithErrorToast() {
        this.openAddProductModal = false;
        this.showError('Error adding products to Price Book.');
    }

    handleSave(event) {
        this.loaded = false;
        this.saveDraftValues = event.detail.draftValues;
        const recordInputs = this.saveDraftValues.slice().map(draft => {
            const fields = Object.assign({}, draft);
            return { fields };
        });
        const promises = recordInputs.map(recordInput => updateRecord(recordInput));
        Promise.all(promises).then(() => {
            this.saveDraftValues = [];
        }).catch(error => {
            this.showError(error);
        }).finally(() => {
            this.refreshPricebooks();
            this.showSuccess('Price Books updated.');
            this.loaded = true;
        });
    }

    handleEntrySave(event) {
        this.loaded = false;
        this.entryDraftValues = event.detail.draftValues;
        const recordInputs = this.entryDraftValues.slice().map(draft => {
            const fields = Object.assign({}, draft);
            return { fields };
        });
        const promises = recordInputs.map(recordInput => updateRecord(recordInput));
        Promise.all(promises).then(() => {
            this.entryDraftValues = [];
        }).catch(error => {
            this.showError(error);
        }).finally(() => {
            this.loadPBEs();
            this.showSuccess('Price Book Entries updated.');
            this.loaded = true;
        });
    }

    refreshPricebooks() {
        refreshApex(this.refreshPriceBookData);
        if(this.openNewPBModal) {
            this.openNewPBModal = false;
            this.showSuccess('Price Book added.');
        }
    }

    setupDiscountModal() {
        this.loaded = false;
        let recordsToDiscount = this.refs.entries.getSelectedRows();
        let discountValue = this.template.querySelector('lightning-input').value;
        updatePriceBookEntries({
            discount: discountValue,
            entries: recordsToDiscount
        }).then(() => {
            this.showSuccess('Price Book Entries updated.');
        }).then(() => {
            this.loadPBEs();
            this.loaded = true;
        }).catch(error => {
            this.showError(error);
        });
    }

}