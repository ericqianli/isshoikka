/**
 * Copyright 2015-present Isshoikka. All Rights Reserved.
 *
 */

import FishTail from "./FishTail";
import React, { Component } from "react";

class Copyright extends Component {
    render() {
        return (
            <FishTail className="copyrightFishtail" style="double">
                <div className="copyrightContainer">
                    <span>一生一花 ©</span>
                    <span className="verticalText">Isshoikka</span>
                </div>
            </FishTail>
        );
    }
}

export default Copyright;