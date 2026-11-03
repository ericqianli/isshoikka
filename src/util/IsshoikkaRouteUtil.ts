/**
 * Copyright 2015-present Isshoikka. All Rights Reserved.
 *
 */

// The URL hash is the only routing the site has:
//   /#gallery  the gallery grid
//   /#12       chapter 12 on the main page
//   /          the main page at the last chapter the reader visited

const GALLERY_HASH = "#gallery";
const CHAPTER_HASH = /^#(\d+)$/;

const IsshoikkaRouteUtil = {
    isGallery(): boolean {
        return window.location.hash === GALLERY_HASH;
    },

    getChapterFromHash(): number | null {
        const match = CHAPTER_HASH.exec(window.location.hash);
        return match ? Number(match[1]) : null;
    },

    // Keeps the address bar in step with the current chapter without adding
    // history entries or firing hashchange, so arrow presses stay silent and
    // the link in the bar is always the one to share.
    setChapterHash(arrangementID: number): void {
        if (this.isGallery()) {
            return;
        }
        const hash = "#" + arrangementID;
        if (window.location.hash !== hash) {
            window.history.replaceState(
                null,
                "",
                window.location.pathname + window.location.search + hash
            );
        }
    },
};

export default IsshoikkaRouteUtil;
