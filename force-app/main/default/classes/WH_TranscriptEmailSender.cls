public without sharing class WH_TranscriptEmailSender {

    private static final String FROM_ADDRESS_NAME = 'Salesforce Bot';
    private static final String EMAIL_TITLE = 'Conversation with WeHomes AutoAgent';
    private static final String STATUS_COMPLETED = 'Completed';

    private Id getOrgWideAddressId() {
        OrgWideEmailAddress owea = [
            SELECT Id FROM OrgWideEmailAddress WHERE DisplayName =: FROM_ADDRESS_NAME
        ][0];
        return owea.Id;
    }
    
    public void send(List<LiveChatTranscript> scripts) {
        List<Messaging.SingleEmailMessage> mails = new List<Messaging.SingleEmailMessage>();
        Id orgAddressId = getOrgWideAddressId();
        for(LiveChatTranscript script : scripts) {
            if(script.IsChatbotSession && script.Status == STATUS_COMPLETED) {
                Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
                mail.setSubject(EMAIL_TITLE);
                mail.setPlainTextBody(script.Body);
                mail.setTargetObjectId(script.ContactId);
                mail.setOrgWideEmailAddressId(orgAddressId);
                mails.add(mail);
            }
        }
        if(!mails.isEmpty()) {
            Messaging.sendEmail(mails);
        }
    }

}