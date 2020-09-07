import React from "react";
import "./Login.scss";
import coEventLogoWh from "../../content/logos/coEventLogoWh.svg";
import { Form, Card, InputGroup, Button, Spinner } from "react-bootstrap";
import { useHistory, useLocation } from "react-router-dom";
// import AjaxContext from "../../contexts/ajax";
import Constants from "settings/Constants";
import qs from "query-string";
import { Oauth } from "../../services/ajax";
import { AuthRoutes, IToken } from "services";

export interface ILogin {
  loading?: boolean;
  key: string;
}

export default () => {
  const location = useLocation();
  const history = useHistory();
  const key = qs.parse(location.search).key ?? "";
  const [login, setLogin] = React.useState({
    loading: false,
    key: Array.isArray(key) ? key.join(";") : key,
  } as ILogin);

  const handleLogin = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.preventDefault();

    setLogin((s) => {
      return { ...s, loading: true };
    });

    Oauth.post(AuthRoutes.tokenParticipant(login.key))
      .then(async (response) => {
        const token = (await response.json()) as IToken;
        Oauth.setToken(token);
        history.push(`/schedule/victoria/${Constants.calendarId}`);
        return token;
      })
      .catch(() => {
        setLogin((s) => {
          return { ...s, loading: false };
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
                    disabled={login.loading}
                  >
                    {login.loading ? (
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
