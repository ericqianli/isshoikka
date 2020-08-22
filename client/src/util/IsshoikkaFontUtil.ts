/**
 * Copyright 2015-present Isshoikka. All Rights Reserved.
 *
 */

const WebFont = require("webfontloader");

const LOAD_FONT_TIMEOUT_MS: number = 5000;
const TEST_FONT_STRING: string = "\uE05A";

const IsshoikkaFontUtil = {
    loadAll(): Promise<boolean> {
        return new Promise((resolve) => {
            WebFont.load({
                custom: {
                    families: ["KangXiZiDianCommon", "KangXiZiDianOpt"],
                    urls: ["/css/font.css"],
                    testStrings: {
                        KangXiZiDianOpt: TEST_FONT_STRING,
                    },
                },
                timeout: LOAD_FONT_TIMEOUT_MS,
                active: function () {
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
