import React from "react";
import "./Login.scss";
import coEventLogoWh from "../../content/logos/coEventLogoWh.svg";
import { Form, Card, InputGroup, Button, Spinner } from "react-bootstrap";
import { useHistory, useLocation } from "react-router-dom";
import AjaxContext from "../../contexts/ajax";
import Constants from "settings/Constants";
import qs from "query-string";

export interface ILogin {
  waiting?: boolean;
  key: string;
}

export default () => {
  const location = useLocation();
  const history = useHistory();
  const key = qs.parse(location.search).key ?? "";
  const [login, setLogin] = React.useState({
    waiting: false,
    key: Array.isArray(key) ? key.join(";") : key,
  } as ILogin);
  const [, , ajax] = React.useContext(AjaxContext);

  const handleLogin = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.preventDefault();

    setLogin((s) => {
      return { ...s, waiting: true };
    });

    ajax?.oauth
      ?.token(login.key)
      .then((token) => {
        history.push(`/schedule/victoria/${Constants.calendarId}`);
        return token;
      })
      .catch(() => {
        setLogin((s) => {
          return { ...s, waiting: false };
        });
      });
  };

  return (
    <section className="background">
      <div>
        <img className="logo" src={coEventLogoWh} alt="" />
        <h1 className="valueProp">
          Flexible scheduling for teams and organizations.
        </h1>
        <Card className="loginWindow">
          <section className="panel">
            <h2 className="signInHeading">To sign in:</h2>
            <div className="linkInstructionWrap">
              <span className="linkInstructionText">
                Click the sign-in link in your email
              </span>
            </div>
          </section>
          <section className="panel lowEm">
            <h2 className="signInHeading">
              Or, paste and submit your participant ID:
            </h2>
            <Form>
              <InputGroup>
                <Form.Control
                  type="text"
                  placeholder="Participant key"
                  value={login.key}
                  onChange={(e) => setLogin({ key: e.currentTarget.value })}
                ></Form.Control>
                <InputGroup.Append>
                  <Button
                    type="submit"
                    variant="outline-secondary"
                    onClick={handleLogin}
                    disabled={login.waiting}
                  >
                    {login.waiting ? (
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        area-hidden="true"
                      ></Spinner>
                    ) : (
                      "Login"
                    )}
                  </Button>
                </InputGroup.Append>
              </InputGroup>
            </Form>
          </section>
        </Card>
      </div>
    </section>
  );
};
