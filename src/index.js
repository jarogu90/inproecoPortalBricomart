import React, { useContext, useEffect, createContext } from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch, Redirect } from "react-router-dom";

import GlobaContextProvider, {
  GlobalStateContext,
  GlobalDispatchContext,
} from "./context/GlobalContext";
import Login from "./views/crm/Login/Login";

import "bootstrap/dist/css/bootstrap.css";
/*import 'font-awesome/css/font-awesome.min.css';*/
import "assets/scss/zest-admin.css";
import "assets/fonts/simple-line-icons.css";
import "@devexpress/dx-react-grid-bootstrap4/dist/dx-react-grid-bootstrap4.css";

// import Amplify, { Auth } from "aws-amplify";
// import awsconfig from "./aws-exports";

import indexRoutes from "routes/index.jsx";
import ForgottenPassword from "./views/crm/Login/ForgottenPassword";
import VerificationCode from "./views/crm/Login/VerificationCode";

//Amplify.configure(awsconfig);

// This does not throw an error
// Auth.configure(awsconfig);

const hist = createBrowserHistory();

const App = (props) => {
  //ROUTING CON AUTENTICACIÓN
  return (
    <GlobaContextProvider>
      <GlobalStateContext.Consumer>
        {(state) => (
          <GlobalDispatchContext.Consumer>
            {(dispatch) => (
              <Router history={hist} basename={process.env.REACT_APP_BASEDIR}>
                <Switch>
                  <Route path="/login" component={Login} />
                  <Route
                    path="/forgotten-password"
                    component={ForgottenPassword}
                  />
                  <Route
                    path="/verification-code"
                    component={VerificationCode}
                  />
                  {indexRoutes.map((prop, key) => {
                    if (!state.token && !state.isAllowed) {
                      return <Redirect key={key} to="/login" />;
                    } else {
                      return (
                        <Route
                          path={prop.path}
                          key={key}
                          component={prop.component}
                          dispatch={dispatch}
                          state={state}
                        />
                      );
                    }
                  })}
                </Switch>
              </Router>
            )}
          </GlobalDispatchContext.Consumer>
        )}
      </GlobalStateContext.Consumer>
    </GlobaContextProvider>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
