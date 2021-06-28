import React, { Suspense, lazy } from "react";
import {Redirect, Switch, Route, BrowserRouter} from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../_metronic/layout";
import { BuilderPage } from "./pages/BuilderPage";
import { MyPage } from "./pages/MyPage";
import { DashboardPage } from "./pages/DashboardPage";
import ListProduct from "./pages/Product/ListProduct";
import AddProduct from "./pages/Product/AddProduct";
import EditProduct from "./pages/Product/EditProduct";

import ListApplication from "./pages/Application/ListApplication";
import AddApplication from "./pages/Application/AddApplication";
import EditApplication from "./pages/Application/EditApplication";

import ListPlan from "./pages/Plan/ListPlan";
import AddPlan from "./pages/Plan/AddPlan";
import EditPlan from "./pages/Plan/EditPlan";

import ListStore from "./pages/Store/ListStore";
import AddStore from "./pages/Store/AddStore";
import EditStore from "./pages/Store/EditStore";
import FilteredStore from "./pages/Application/FilteredStore";

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
            {/*<ContentRoute path="/my-page" component={MyPage} />*/}
            <Route path="/my-page" component={MyPage} />
            <ContentRoute path="/product-list" component={ListProduct} />
            <ContentRoute path="/product-add" component={AddProduct} />
            <ContentRoute path="/product-edit/:id" component={EditProduct} />

            {/*Application Routes*/}
            <ContentRoute path="/application-list" component={ListApplication} />
            <ContentRoute path="/application-add" component={AddApplication} />
            <ContentRoute path="/application-edit/:id" component={EditApplication} />

            {/*Plan Routes*/}
            {/*<ContentRoute path="/plan-list" component={ListPlan} />*/}
            {/*<ContentRoute path="/plan-add" component={AddPlan} />*/}
            {/*<ContentRoute path="/plan-edit/:id" component={EditPlan} />*/}

            {/*Store Routes*/}
            <ContentRoute path="/store-list" exact component={ListStore} />
            <ContentRoute path="/store-filtered/:appId" component={FilteredStore} />
            {/*<ContentRoute path="/store-add" component={AddStore} />*/}
            {/*<ContentRoute path="/store-edit/:id" component={EditStore} />*/}

            <Redirect to="error/error-v1" />
        </Switch>

    </Suspense>
  );
}
