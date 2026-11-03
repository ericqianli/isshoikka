/**
 * Copyright 2015-present Isshoikka. All Rights Reserved.
 *
 */

import GalleryPage from "./components/GalleryPage";
import IsshoikkaClientStore from "./util/IsshoikkaClientStore";
import IsshoikkaFluxContainer from "./components/IsshoikkaFluxContainer";
import IsshoikkaRouteUtil from "./util/IsshoikkaRouteUtil";
import NavBar from "./components/NavBar";
import React, { Component } from "react";

type Route = "main" | "gallery";

type State = {
    route: Route;
    // bumped whenever a chapter link arrives, so the main page remounts and
    // picks the requested chapter up from the client store on its way in.
    mainKey: number;
};

// A chapter link such as /#12 is handed to the main page through the client
// store, which is where the navigation store has always read the current
// chapter from at startup. The navigation store then keeps the hash in step
// as the reader moves, so the address bar always holds a shareable link.
function readRoute(): Route {
    if (IsshoikkaRouteUtil.isGallery()) {
        return "gallery";
    }
    const chapter = IsshoikkaRouteUtil.getChapterFromHash();
    if (chapter != null) {
        IsshoikkaClientStore.set("currentArrangementID", chapter);
    }
    return "main";
}

class Isshoikka extends Component<{}, State> {
    constructor(props: {}) {
        super(props);
        this.state = { route: readRoute(), mainKey: 0 };
        this._onHashChange = this._onHashChange.bind(this);
    }

    componentDidMount() {
        window.addEventListener("hashchange", this._onHashChange);
    }

    componentWillUnmount() {
        window.removeEventListener("hashchange", this._onHashChange);
    }

    _onHashChange() {
        const isChapterLink = IsshoikkaRouteUtil.getChapterFromHash() != null;
        const route = readRoute();
        this.setState((state) => ({
            route,
            mainKey: isChapterLink ? state.mainKey + 1 : state.mainKey,
        }));
    }

    render() {
        const page =
            this.state.route === "gallery" ? (
                <GalleryPage />
            ) : (
                <IsshoikkaFluxContainer key={this.state.mainKey} />
            );
        return (
            <React.Fragment>
                {page}
                <NavBar />
            </React.Fragment>
        );
    }
}

export default Isshoikka;
