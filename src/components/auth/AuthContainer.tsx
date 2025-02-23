"use client";

import { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

interface AuthContainerProps {
  isLogin?: boolean;
}

export default function AuthContainer({
  isLogin: initialIsLogin = true,
}: AuthContainerProps) {
  const [isLogin, setIsLogin] = useState(initialIsLogin);

  useEffect(() => {
    setIsLogin(initialIsLogin);
  }, [initialIsLogin]);

  return (
    <Container
      fluid
      className="vh-100 d-flex align-items-center justify-content-center"
    >
      <div
        className="auth-container bg-white rounded-3 shadow-lg overflow-hidden"
        style={{ width: "80%", maxWidth: "1000px", height: "80vh" }}
      >
        <Row className="h-100">
          <Col
            md={6}
            className={`p-4 transition-transform ${isLogin ? "" : "order-2"}`}
          >
            {isLogin ? (
              <LoginForm />
            ) : (
              <div className="h-100 d-flex flex-column justify-content-center align-items-center">
                <h2>Welcome Back!</h2>
                <p>
                  Already have an account? Login now to continue your journey.
                </p>
                <button
                  className="btn btn-outline-primary"
                  onClick={() => setIsLogin(true)}
                >
                  Login
                </button>
              </div>
            )}
          </Col>
          <Col
            md={6}
            className={`bg-primary text-white p-4 transition-transform ${
              isLogin ? "order-2" : ""
            }`}
          >
            {!isLogin ? (
              <RegisterForm />
            ) : (
              <div className="h-100 d-flex flex-column justify-content-center align-items-center">
                <h2>Hello, Friend!</h2>
                <p>Register now to start creating amazing forms!</p>
                <button
                  className="btn btn-outline-light"
                  onClick={() => setIsLogin(false)}
                >
                  Register
                </button>
              </div>
            )}
          </Col>
        </Row>
      </div>
    </Container>
  );
}
