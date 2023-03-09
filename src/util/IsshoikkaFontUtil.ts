/**
 * Copyright 2015-present Isshoikka. All Rights Reserved.
 *
 */

const WebFont = require("webfontloader");

const LOAD_FONT_TIMEOUT_MS: number = 5000;
const TEST_FONT_STRING: string = "\uE05A";

const IsshoikkaFontUtil = {
    loadAll(): Promise<boolean> {
        console.log('load all fonts');
        return new Promise((resolve) => {
            WebFont.load({
                custom: {
                    families: ["KangXiDictPlantNames"],
                    // families: ["KangXiZiDianCommon", "KangXiZiDianOpt", "KangXiDictPlantNames"],
                    // testStrings: {
                    //     KangXiZiDianOpt: TEST_FONT_STRING,
                    // },
                },
                timeout: LOAD_FONT_TIMEOUT_MS,
                active: function () {
                    console.warn("Loading fonts succeeded.");
                    resolve(true);
                },
                inactive: function () {
                    console.warn("Loading fonts failed.");
                    resolve(false);
                },
            });
        });
    },
};

export default IsshoikkaFontUtil;
