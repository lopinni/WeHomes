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
import getProductsByType from "@salesforce/apex/WH_PricebookManagerController.getProductsByType";
import updatePriceBookEntries from "@salesforce/apex/WH_PricebookManagerController.updatePriceBookEntries";

import ERROR from '@salesforce/label/c.Error';
import SUCCESS from '@salesforce/label/c.Success';
import PBE_INSERT_SUCCESS from '@salesforce/label/c.PBE_Insert_Success';
import PBE_INSERT_ERROR from '@salesforce/label/c.PBE_Insert_Error';
import PB_UPDATE_SUCCESS from '@salesforce/label/c.Price_Book_Update_Success';
import PB_UPDATE_ERROR from '@salesforce/label/c.Price_Book_Update_Error';
import PBE_UPDATE_SUCCESS from '@salesforce/label/c.PBE_Update_Success';

const actions = [
    { label: 'View', name: 'view' },
    { label: 'Products', name: 'products' },
    { label: 'Add Products', name: 'add' },
];

const pricebookColumns = [
    { label: 'Name', fieldName: 'Name', editable : 'true' },
    { label: 'Description', fieldName: 'Description', editable : 'true' },
    { label: 'Active', fieldName: 'IsActive', type: 'boolean' },
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
    @track products;

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
            title: ERROR,
            message: error,
            variant: 'error'
        }));
    }

    showSuccess(message) {
        this.dispatchEvent(new ShowToastEvent({
            title: SUCCESS,
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
        if(id != undefined) {
            getPBEsById({ Id: id }).then(result => {
                this.priceBookEntryData = result;
                this.loaded = true;
            }).catch(error => {
                this.showError(error);
            });
        } else {
            this.loadPBEs();
        }
    }

    @wire(getPricebooks)
    populatePricebookTable(value) {
        this.loaded = false;
        this.refreshPriceBookData = value;
        const { data, error } = value;
        if (data) {
            this.pricebookData = data;
        } else if (error) {
            this.showError(error);
        }
        this.loaded = true;
    }

    handleRowAction(event) {
        this.loaded = false;
        const actionName = event.detail.action.name;
        this.priceBookToAdd = event.detail.row.Id;
        switch (actionName) {
            case 'view':
                this.navigateToRecordPage(this.priceBookToAdd);
                break;
            case 'products':
                this.loadPBEsById(this.priceBookToAdd);
                break;
            case 'add':
                this.openAddProduct(event.detail.row.TypeInfo__c);
                break;
            default:
        }
        this.loaded = true;
    }

    handleShow(event) {
        this.priceBookToAdd = event.detail;
        this.loadPBEsById(event.detail);
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

    openAddProduct(type) {
        this.loaded = false;
        getProductsByType({ type: type }).then(result => {
            this.products = result;
            this.loaded = true;
        }).catch(error => {
            this.showError(error);
        });
        this.openAddProductModal = true;
    }

    closeAddProduct() {
        this.openAddProductModal = false;
    }

    closeWithToast() {
        this.openAddProductModal = false;
        this.loadPBEsById(this.priceBookToAdd);
        this.showSuccess(PBE_INSERT_SUCCESS);
    }

    closeWithErrorToast() {
        this.openAddProductModal = false;
        this.loadPBEsById(this.priceBookToAdd);
        this.showError(PBE_INSERT_ERROR);
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
            this.loaded = true;
            this.showSuccess(PB_UPDATE_SUCCESS);
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
            this.loadPBEsById(this.priceBookToAdd);
            this.loaded = true;
            this.showSuccess(PB_UPDATE_ERROR);
        });
    }

    refreshPricebooks() {
        setTimeout(() => {
            refreshApex(this.refreshPriceBookData);
        }, "500");
        if(this.openNewPBModal) {
            this.openNewPBModal = false;
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
            this.loadPBEsById(this.priceBookToAdd);
            this.loaded = true;
            this.showSuccess(PBE_UPDATE_SUCCESS);
        }).catch(error => {
            this.showError(error);
        });
    }

}