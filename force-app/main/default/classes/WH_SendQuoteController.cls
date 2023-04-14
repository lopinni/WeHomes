public with sharing class WH_SendQuoteController {

    private static final String EMAIL_TEMPLATE_NAME = 'Quote_Offer';
    private static final String NEW_STATUS = 'Presented';
    
    @AuraEnabled
    public static void sendQuoteEmail(String quoteId, String contactId) {
        checkEmail(contactId);
        EmailTemplate emailTemplate = checkEmailTemplate();
        List<QuoteLineItem> quoteLineItems = [
            SELECT Product2Id FROM QuoteLineItem WHERE QuoteId = :quoteId WITH SECURITY_ENFORCED
        ];
        List<QuoteDocument> quoteDocuments = [
            SELECT Name, Document, ContentVersionDocumentId FROM QuoteDocument WHERE QuoteId = :quoteId WITH SECURITY_ENFORCED
        ];
        List<Messaging.EmailFileAttachment> attachments = insertAttachments(quoteDocuments);
        List<Id> contentVersionIds = getContentVersionIds(getQuoteProducts(quoteLineItems));
        Messaging.SingleEmailMessage[] messages = new List<Messaging.SingleEmailMessage>();
        Messaging.SingleEmailMessage message = new Messaging.SingleEmailMessage();
        message.setTemplateId(emailTemplate.Id);
        message.targetObjectId = contactId;
        message.setWhatId(quoteId);
        message.setFileAttachments(attachments);
        message.setEntityAttachments(contentVersionIds);
        messages.add(message);
        try {
            if (!messages.isEmpty()) {
                Messaging.sendEmail(messages);
                updateQuoteStatus(quoteId);
            } else {
                throw new AuraHandledException(System.Label.Email_send_error);
            }
        } catch(Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    private static void checkEmail(String contactId) {
        Contact contact = [
            SELECT Id, Email FROM Contact WHERE Id =: contactId WITH SECURITY_ENFORCED
        ];
        if(contact.Email == '') {
            throw new AuraHandledException(System.Label.Email_send_error);
        }
    }

    private static EmailTemplate checkEmailTemplate() {
        EmailTemplate emailTemplate = [
            SELECT Id FROM EmailTemplate WHERE DeveloperName = :EMAIL_TEMPLATE_NAME WITH SECURITY_ENFORCED
        ];
        if(emailTemplate == null) {
            throw new AuraHandledException(System.Label.Email_send_error);
        }
        return emailTemplate;
    }
    
    private static List<Messaging.EmailFileAttachment> insertAttachments(List<QuoteDocument> quoteDocuments) {
        List<Messaging.EmailFileAttachment> attachments = new List<Messaging.EmailFileAttachment>();
        for (QuoteDocument qd: quoteDocuments) {
            Messaging.EmailFileAttachment emailFileAttachment = new Messaging.EmailFileAttachment();
            emailFileAttachment.setFileName(qd.Name);
            emailFileAttachment.setBody(qd.Document);
            attachments.add(emailFileAttachment);
        }
        return attachments;
    }

    private static List<Id> getContentVersionIds(List<Id> productIds) {
        List<Id> contentVersionIds = new List<Id>();
        List<ContentVersion> contentDocuments = [
            SELECT Id, FirstPublishLocationId
            FROM ContentVersion
            WHERE FirstPublishLocationId IN :productIds
            WITH SECURITY_ENFORCED
            ORDER BY CreatedDate DESC
        ];
        for(ContentVersion contentVersion : contentDocuments) {
            contentVersionIds.add(contentVersion.Id);
        }
        return contentVersionIds;
    }

    private static List<Id> getQuoteProducts(List<QuoteLineItem> quoteLineItems) {
        List<Id> productIds = new List<Id>();
        for(QuoteLineItem qLI : quoteLineItems) {
            productIds.add(qLI.Product2Id);
        }
        return productIds;
    }

    private static void updateQuoteStatus(String quoteId) {
        Quote quote = [
            SELECT Id, Status FROM Quote WHERE Id =: quoteId WITH SECURITY_ENFORCED
        ];
        quote.Status = NEW_STATUS;
        try {
            if(Schema.SObjectType.Quote.fields.Status.isUpdateable()) {
                update quote;
            } else {
                throw new AuraHandledException(System.Label.Quote_status_change_error);
            }
        }catch(Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

}