import React from "react";
import "./App.scss";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Home, Login, Schedule } from "./pages";
import { IdentityProvider } from "./contexts/identity";
import IdentityContext from "contexts/identity/IdentityContext";
import AjaxContext, { AjaxProvider } from "contexts/ajax";
import { AuthRoutes } from "services";
import Header from "./components/header/Header";
import Error from "./components/error/Error";
import { PrivateRoute } from "./components/privateRoute/PrivateRoute";

export const App: React.FC = () => {
  return (
    <IdentityProvider>
      <AjaxProvider
        tokenUrl={AuthRoutes.tokenParticipant}
        refreshUrl={AuthRoutes.refresh()}
      >
        <AjaxContext.Consumer>
          {() => (
            <IdentityContext.Consumer>
              {() => (
                <>
                  <Error></Error>
                  <Router>
                    <Header></Header>
                    <Switch>
                      <PrivateRoute path="/login" component={Login} />
                      <PrivateRoute path="/schedule/:id" component={Schedule} />
                      <PrivateRoute path="/" component={Home} />
                      <Route render={() => <h1>404: page not found</h1>} />
                    </Switch>
                  </Router>
                </>
              )}
            </IdentityContext.Consumer>
          )}
        </AjaxContext.Consumer>
      </AjaxProvider>
    </IdentityProvider>
  );
};

export default App;
