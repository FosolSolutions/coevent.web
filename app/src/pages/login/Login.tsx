import React from "react";
import "./Login.scss";
import coEventLogoWh from "../../content/logos/coEventLogoWh.svg";
import { Form, Card, InputGroup, Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import AjaxContext from "../../contexts/ajax";
import Constants from "settings/Constants";

export default () => {
  const history = useHistory();
  const [login, setLogin] = React.useState({
    key: "",
  });
  const [, , ajax] = React.useContext(AjaxContext);

  const handleLogin = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.preventDefault();
    ajax?.oauth
      ?.token(login.key)
      .then((token) => {
        history.push(`/schedule/victoria/${Constants.calendarId}`);
        return token;
      })
      .catch(() => {});
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
                  >
                    Login
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
