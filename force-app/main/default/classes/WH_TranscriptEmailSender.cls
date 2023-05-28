public without sharing class WH_TranscriptEmailSender {
    
    public void send(List<LiveChatTranscript> scripts) {
        List<Messaging.SingleEmailMessage> mails = new List<Messaging.SingleEmailMessage>();
        Set<String> ids = new Set<String>();
        for(LiveChatTranscript script : scripts){
            ids.add(script.Id);
        }
        List<LiveChatTranscript> details = [
            SELECT Id, Contact.Email, IsChatbotSession, Body, Status 
            FROM LiveChatTranscript
            WHERE Id IN: ids
        ];
        for(LiveChatTranscript script : details){
            if(script.IsChatbotSession && script.Contact.Email != null){
                Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
                mail.setSubject('Conversation with WeHomes AutoAgent');
                mail.setHtmlBody(script.Body);
                mail.setToAddresses(new List<String>{script.Contact.Email});
                mails.add(mail);
            }
        }
        Messaging.sendEmail(mails);
    }

}