/**
 * Copyright 2015-present Isshoikka. All Rights Reserved.
 *
 */

import assign from "object-assign";

import IsshoikkaDispatcher from "../dispatcher/IsshoikkaDispatcher";
import IsshoikkaInitializerActionConstants from "../constants/IsshoikkaInitializerActionConstants";

import { EventEmitter } from "events";

const CHANGE_EVENT = "change";

let _fontLoaded: boolean = false;

const IsshoikkaFontStore = assign({}, EventEmitter.prototype, {
    isFontLoaded(): boolean {
        return _fontLoaded;
    },

    emitChange() {
        (this as any).emit(CHANGE_EVENT);
    },

    addChangeListener(callback: any) {
        (this as any).on(CHANGE_EVENT, callback);
    },

    removeChangeListener(callback: any) {
        (this as any).removeListener(CHANGE_EVENT, callback);
    },
});

IsshoikkaDispatcher.register(function (action: any) {
    switch (action.actionType) {
        case IsshoikkaInitializerActionConstants.LOAD_ALL_FONTS:
            _fontLoaded = action.fontLoaded;
            IsshoikkaFontStore.emitChange();
            break;
        default:
            break;
    }
});

export default IsshoikkaFontStore;
