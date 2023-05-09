import LightningModal from 'lightning/modal';

import LOG_A_CASE from '@salesforce/label/c.Log_a_Case';
import CLOSE from '@salesforce/label/c.Close';

export default class CreateCaseModal extends LightningModal {

    labels = {
        LOG_A_CASE,
        CLOSE
    }

    handleClose() {
        this.close('closed');
    }

    handleStatusChange(event) {
        if (event.detail.status === 'FINISHED') {
            this.close('success');
        }
    }
    
}