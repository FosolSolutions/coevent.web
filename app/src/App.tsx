import React from "react";
import "./App.scss";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Home, Login, Schedule, VictoriaSchedule } from "./pages";
import { IdentityProvider } from "./contexts/identity";
import IdentityContext from "contexts/identity/IdentityContext";
import { AppProvider } from "contexts/app";
import Header from "./components/header/Header";
import Error from "./components/error/Error";
import { PrivateRoute } from "./components/privateRoute/PrivateRoute";

export const App: React.FC = () => {
  return (
    <IdentityProvider>
      <AppProvider>
        <IdentityContext.Consumer>
          {() => (
            <>
              <Error></Error>
              <Router>
                <Header></Header>
                <Switch>
                  <PrivateRoute path="/login" component={Login} />
                  <PrivateRoute
                    path="/schedule/victoria/:id"
                    component={VictoriaSchedule}
                  />
                  <PrivateRoute path="/schedule/:id" component={Schedule} />
                  <PrivateRoute path="/" component={Home} />
                  <Route render={() => <h1>404: page not found</h1>} />
                </Switch>
              </Router>
            </>
          )}
        </IdentityContext.Consumer>
      </AppProvider>
    </IdentityProvider>
  );
};

export default App;
