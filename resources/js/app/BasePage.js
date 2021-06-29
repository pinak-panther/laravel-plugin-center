import React, { Suspense, lazy } from "react";
import {Redirect, Switch} from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../_metronic/layout";
import { BuilderPage } from "./pages/BuilderPage";
import { MyPage } from "./pages/MyPage";
import { DashboardPage } from "./pages/DashboardPage";

import ListApplication from "./pages/Application/ListApplication";
import AddApplication from "./pages/Application/AddApplication";
import EditApplication from "./pages/Application/EditApplication";

import ListStore from "./pages/Store/ListStore";
import FilteredStore from "./pages/Store/FilteredStore";
import EditSnippet from "./pages/Store/EditSnippet";

export default function BasePage() {
  // useEffect(() => {
  //   console.log('Base page');
  // }, []) // [] - is required if you need only one call
  // https://reactjs.org/docs/hooks-reference.html#useeffect

  return (

      <Suspense fallback={<LayoutSplashScreen />}>
        <Switch>
            {
              /* Redirect from root URL to /dashboard. */
              <Redirect exact from="/" to="/application-list" />
            }
            <ContentRoute path="/dashboard" component={DashboardPage} />
            <ContentRoute path="/builder" component={BuilderPage} />
            <ContentRoute path="/my-page" component={MyPage} />

            {/*Application Routes*/}
            <ContentRoute path="/application-list" component={ListApplication} />
            <ContentRoute path="/application-add" component={AddApplication} />
            <ContentRoute path="/application-edit/:id" component={EditApplication} />

            {/*Store Routes*/}
            <ContentRoute path="/store-list" exact component={ListStore} />
            <ContentRoute path="/store-filtered/:appId" component={FilteredStore} />
            <ContentRoute path="/store/edit-snippet/:appId" component={EditSnippet} />

            <Redirect to="/error/error-v1" />
        </Switch>

    </Suspense>
  );
}
