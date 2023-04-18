trigger WH_GalleryImageTrigger on ContentVersion (after insert) {
    List<ContentDistribution> cds = new List<ContentDistribution>();
    for (ContentVersion contentVersion : Trigger.new) {
        ContentDistribution cd = new ContentDistribution();
        cd.Name = contentVersion.FirstPublishLocationId;
        cd.ContentVersionId = contentVersion.Id;
        cd.PreferencesAllowViewInBrowser= true;
        cd.PreferencesLinkLatestVersion=true;
        cd.PreferencesNotifyOnVisit=false;
        cd.PreferencesPasswordRequired=false;
        cd.PreferencesAllowOriginalDownload= true;
        cds.add(cd);
    }
    insert cds;
}