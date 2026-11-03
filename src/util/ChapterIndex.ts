/**
 * Copyright 2015-present Isshoikka. All Rights Reserved.
 *
 */

import NumberConverter from "./NumberConverter";

const CHINESE_DIGITS = "零壹貳參肆伍陸柒捌玖".split("");

function capitalizeFirstLetter(word: string): string {
    return word.charAt(0).toUpperCase() + word.slice(1);
}

const ChapterIndex = {
    // 0 is the prelude (序); everything else is written in formal numerals.
    toChinese(index: number): string {
        if (index === 0) {
            return "序";
        }
        let chars = "";
        while (index > 0) {
            chars = CHINESE_DIGITS[index % 10] + chars;
            index = Math.floor(index / 10);
        }
        return chars;
    },

    // firefox doesn't like text-transform for vertical layout, so capitalize here.
    toEnglish(index: number): string {
        const word = index === 0 ? "prelude" : NumberConverter.toWords(index);
        return capitalizeFirstLetter(word);
    },
};

export default ChapterIndex;
