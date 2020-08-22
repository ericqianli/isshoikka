/**
 * Copyright 2015-present Isshoikka. All Rights Reserved.
 *
 */

const store = require("store");

const IsshoikkaClientStore = {
    get(key: string): any {
        return store.get(key);
    },

    set(key: string, value: any): void {
        store.set(key, value);
    },
};

export default IsshoikkaClientStore;
