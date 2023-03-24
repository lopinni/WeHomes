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

    loadPBEs() {
        this.loaded = false;
        getStandardPBEs().then(result => {
            this.priceBookEntryData = result;
            this.loaded = true;
        }).catch(error => {
            this.dispatchEvent(new ShowToastEvent({
                title: 'Error',
                message: error,
                variant: 'error'
            }));
        });
    }

    loadPBEsById(id) {
        this.loaded = false;
        getPBEsById({ Id: id }).then(result => {
            this.priceBookEntryData = result;
            this.loaded = true;
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
        this.loaded = false;
        this.refreshPriceBookData = value;
        const { data, error } = value;
        if (data) {
            console.log(data);
            this.pricebookData = data;
        } else if (error) {
            this.dispatchEvent(new ShowToastEvent({
                title: 'Error',
                message: error,
                variant: 'error'
            }));
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
        this.dispatchEvent(new ShowToastEvent({
            title: 'Success',
            message: 'Products added to Price Book.',
            variant: 'success'
        }));
    }

    closeWithErrorToast() {
        this.openAddProductModal = false;
        this.dispatchEvent(new ShowToastEvent({
            title: 'Error',
            message: 'Error adding products to Price Book',
            variant: 'error'
        }));
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
            this.dispatchEvent(new ShowToastEvent({
                title: 'Success',
                message: 'Price Book updated.',
                variant: 'success'
            }));
            this.saveDraftValues = [];
        }).catch(error => {
            this.dispatchEvent(new ShowToastEvent({
                title: 'Error',
                message: error,
                variant: 'error'
            }));
        }).finally(() => {
            this.saveDraftValues = [];
            this.refreshPricebooks();
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
            this.dispatchEvent(new ShowToastEvent({
                title: 'Success',
                message: 'Price Book Entry updated.',
                variant: 'success'
            }));
            this.entryDraftValues = [];
        }).catch(error => {
            this.dispatchEvent(new ShowToastEvent({
                title: 'Error',
                message: error,
                variant: 'error'
            }));
        }).finally(() => {
            this.entryDraftValues = [];
            this.loadPBEs();
            this.loaded = true;
        });
    }

    refreshPricebooks() {
        refreshApex(this.refreshPriceBookData);
        this.openNewPBModal = false;
        this.dispatchEvent(new ShowToastEvent({
            title: 'Success',
            message: 'Price Book added.',
            variant: 'success'
        }));
    }

    setupDiscountModal() {
        this.loaded = false;
        let recordsToDiscount = this.refs.entries.getSelectedRows();
        let discountValue = this.template.querySelector('lightning-input').value;
        updatePriceBookEntries({
            discount: discountValue,
            entries: recordsToDiscount
        }).then(() => {
            this.dispatchEvent(new ShowToastEvent({
                title: 'Success',
                message: 'Price Book Entries updated.',
                variant: 'success'
            }));
        }).then(() => {
            this.loadPBEs();
            this.loaded = true;
        }).catch(error => {
            this.dispatchEvent(new ShowToastEvent({
                title: 'Error',
                message: error,
                variant: 'error'
            }));
        });
    }

}