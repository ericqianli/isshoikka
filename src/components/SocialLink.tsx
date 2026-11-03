/**
 * Copyright 2015-present Isshoikka. All Rights Reserved.
 *
 */

import React, { Component } from "react";

// Font Awesome 5 brand glyphs (CC BY 4.0), 448x448 square viewBox.
const GLYPH_PATH = {
    facebook:
        "M448 80v352c0 26.5-21.5 48-48 48h-85.3V302.8h60.6l8.7-67.6h-69.3V192" +
        "c0-19.6 5.4-32.9 33.5-32.9H384V98.7c-6.2-.8-27.4-2.7-52.2-2.7-51.6 0-87 " +
        "31.5-87 89.4v49.9H184v67.6h60.9V480H48c-26.5 0-48-21.5-48-48V80c0-26.5 " +
        "21.5-48 48-48h352c26.5 0 48 21.5 48 48z",
    instagram:
        "M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 " +
        "319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7" +
        "s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3" +
        "c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 " +
        "12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4" +
        "-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58" +
        "-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 " +
        "93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 " +
        "34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7" +
        "-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9" +
        "-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 " +
        "42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 " +
        "42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z",
};

export type Glyph = keyof typeof GLYPH_PATH;

type Props = {
    glyph: Glyph;
    href: string;
    label: string;
};

class SocialLink extends Component<Props> {
    render() {
        return (
            <a
                className="socialLink"
                href={this.props.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={this.props.label}
                title={this.props.label}
            >
                <svg
                    className="socialIcon"
                    viewBox="0 32 448 448"
                    aria-hidden="true"
                    focusable="false"
                >
                    <path
                        fill="currentColor"
                        d={GLYPH_PATH[this.props.glyph]}
                    />
                </svg>
            </a>
        );
    }
}

export default SocialLink;
