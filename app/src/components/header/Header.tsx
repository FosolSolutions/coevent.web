import React from "react";
import "./Header.css";
import { Link, useHistory, useLocation } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignInAlt, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { useCookies } from "react-cookie";
import Constants from "../../settings/Constants";
import IdentityContext from "../../contexts/identity";

export default () => {
  const history = useHistory();
  const location = useLocation();
  const [identity, setIdentity] = React.useContext(IdentityContext);
  const [, , removeCookie] = useCookies([Constants.cookieName]);

  const logout = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    event.preventDefault();
    removeCookie(Constants.cookieName);
    setIdentity((s) => {
      return {
        ...s,
        isAuthenticated: false,
      };
    });
    history.push("/login");
  };
  return (
    <>
      {location.pathname !== "/login" ? (
        <header className="topbar header">
          <Container>
            <Row>
              <Col>
                <ul className="social-network social-icons">
                  <li>
                    {identity.isAuthenticated ? (
                      <>
                        <span
                          className="text-muted small"
                          style={{ fontSize: "" }}
                        >
                          {identity.displayName}&nbsp;
                        </span>
                        <a href="#logout" title="logout" onClick={logout}>
                          <FontAwesomeIcon icon={faSignOutAlt} />
                        </a>
                      </>
                    ) : (
                      <>
                        <Link to="/login" title="login">
                          <FontAwesomeIcon icon={faSignInAlt} />
                        </Link>
                      </>
                    )}
                  </li>
                </ul>
              </Col>
            </Row>
          </Container>
        </header>
      ) : null}
    </>
  );
};
