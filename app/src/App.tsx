import React from "react";
import "./App.scss";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import { Home, Login } from "./pages";
import { IdentityProvider } from "./contexts/identity";
import IdentityContext from "contexts/identity/IdentityContext";
import AjaxContext, { AjaxProvider } from "contexts/ajax";
import { AuthRoutes } from "services";
import { Alert } from "react-bootstrap";

function App() {
  return (
    <IdentityProvider>
      <AjaxProvider
        tokenUrl={AuthRoutes.tokenParticipant}
        refreshUrl={AuthRoutes.refresh()}
      >
        <AjaxContext.Consumer>
          {([ajaxState]) => (
            <IdentityContext.Consumer>
              {([identity]) => (
                <>
                  {!!ajaxState.error ? (
                    <Alert variant="danger">{ajaxState.error}</Alert>
                  ) : (
                    ""
                  )}
                  <Router>
                    <Switch>
                      {!identity?.isAuthenticated ? (
                        <Redirect exact path="/" to="/login" />
                      ) : null}
                      <Route path="/login" component={Login} />
                      <Route path="/" component={Home} />
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
}

export default App;