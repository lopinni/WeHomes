public with sharing class WH_SendQuoteController {

    private static final String emailTemplateName = 'Quote_Offer';
    
    @AuraEnabled
    public static void sendQuoteEmail(String quoteId, String contactId) {
        EmailTemplate emailTemplate = [
            SELECT Id FROM EmailTemplate WHERE DeveloperName = :emailTemplateName WITH SECURITY_ENFORCED
        ];
        Contact contact = [
            SELECT Id, Email FROM Contact WHERE Id = :contactId WITH SECURITY_ENFORCED
        ];
        List<QuoteLineItem> quoteLineItems = [
            SELECT Product2Id FROM QuoteLineItem WHERE QuoteId = :quoteId WITH SECURITY_ENFORCED
        ];
        List<QuoteDocument> quoteDocuments = [
            SELECT Name, Document, ContentVersionDocumentId FROM QuoteDocument WHERE QuoteId = :quoteId WITH SECURITY_ENFORCED
        ];
        List<Messaging.EmailFileAttachment> attachments = insertAttachments(quoteDocuments);
        List<Id> contentVersionIds = getContentVersionIds(getQuoteProducts(quoteLineItems));
        try {
            Messaging.SingleEmailMessage[] messages = getSingleEmailMessage(
                    emailTemplate, contact, quoteId, attachments, contentVersionIds
                );
            if (!messages.isEmpty()) {
                Messaging.sendEmail(messages);
            } else {
                throw new AuraHandledException('Email has not been sent');
            }
        }catch(Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
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
        List<ContentDocumentLink> contentDocumentLinks = [
            SELECT Id, 
                ContentDocument.LatestPublishedVersion.Id, 
                ContentDocument.LatestPublishedVersion.Title,
                ContentDocument.LatestPublishedVersion.Description, 
                ContentDocument.LatestPublishedVersion.FileExtension
            FROM ContentDocumentLink 
            WHERE LinkedEntityId IN :productIds
            WITH SECURITY_ENFORCED
        ];
        for(ContentDocumentLink cdl : contentDocumentLinks) {
            contentVersionIds.add(cdl.ContentDocument.LatestPublishedVersionId);
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

    private static Messaging.SingleEmailMessage[] getSingleEmailMessage(
                EmailTemplate emailTemplate, 
                Contact contact, 
                Id quoteId,
                List<Messaging.EmailFileAttachment> attachments, 
                List<Id> contentVersionIds 
            ) {
        Messaging.SingleEmailMessage[] messages = new List<Messaging.SingleEmailMessage>();
        Messaging.SingleEmailMessage message = new Messaging.SingleEmailMessage();
        message.setTemplateId(emailTemplate.Id);
        message.targetObjectId = contact.Id;
        message.setWhatId(quoteId);
        message.setFileAttachments(attachments);
        message.setEntityAttachments(contentVersionIds);
        messages.add(message);
        return messages;
    }

}