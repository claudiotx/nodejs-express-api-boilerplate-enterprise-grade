class Feed {
  constructor(

    public bannerSetId: string,
    public originalBannerSetId: string,
    public historyBannerSetIds: any,
    public imagesCollectionId: string,
    public feedId: any,
    public feedUrl: string,
    public bannerwiseFeedUrl?: string,
    public lastSyncOn?: Date,
    public isSynching?: boolean,
    public changedOn?: Date,

  ) {}
}

export default Feed;