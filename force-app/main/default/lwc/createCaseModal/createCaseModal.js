import LightningModal from 'lightning/modal';

export default class CreateCaseModal extends LightningModal {

    handleClose() {
        this.close('closed');
    }

    handleStatusChange(event) {
        if (event.detail.status === 'FINISHED') {
            this.close('success');
        }
    }
    
}