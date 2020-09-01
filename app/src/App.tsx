import React from "react";
import "./App.scss";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import { Home, Login, Schedule } from "./pages";
import { IdentityProvider } from "./contexts/identity";
import IdentityContext from "contexts/identity/IdentityContext";
import AjaxContext, { AjaxProvider } from "contexts/ajax";
import { AuthRoutes } from "services";
import Header from "./components/header/Header";
import Error from "./components/error/Error";

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
              {([identity]) => (
                <>
                  <Error></Error>
                  <Router>
                    <Header></Header>
                    <Switch>
                      {!identity?.isAuthenticated ? (
                        <Redirect exact path="/" to="/login" />
                      ) : null}
                      <Route path="/login" component={Login} />
                      <Route path="/schedule/:id" component={Schedule} />
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
};

export default App;
