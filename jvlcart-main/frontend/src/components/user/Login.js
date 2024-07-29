import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearAuthError, login, loginWithGoogle } from "../../actions/userActions";
import MetaData from "../layouts/MetaData";
import { toast } from "react-toastify";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import './login.css';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { loading, error, isAuthenticated } = useSelector(
    (state) => state.authState
  );
  const redirect = location.search ? "/" + location.search.split("=")[1] : "/";

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(login(email, password));
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirect);
    }

    if (error) {
      toast.error(error, {
        position: toast.POSITION.BOTTOM_CENTER,
        onOpen: () => {
          dispatch(clearAuthError());
        },
      });
    }
  }, [error, isAuthenticated, dispatch, navigate, redirect]);

  const googleSuccess = (response) => {
    console.log("Google login successful:", response);
    dispatch(loginWithGoogle(response.credential));
    navigate('/');
  };

  const googleFailure = (error) => {
    console.error("Google login failed:", error);
    toast.error("Google login failed. Please try again.", {
      position: toast.POSITION.BOTTOM_CENTER,
    });
  };

  return (
    <Fragment>
      <MetaData title="Login" />
      <div className="row wrapper">
        <div className="col-10 col-lg-5">
          <form onSubmit={submitHandler} className="shadow-lg">
            <h1 className="mb-3">Login</h1>
            <div className="form-group">
              <label htmlFor="email_field">Email</label>
              <input
                type="email"
                id="email_field"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password_field">Password</label>
              <input
                type="password"
                id="password_field"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Link to="/password/forgot" className="float-right mb-4">
              Forgot Password?
            </Link>

            <button
              id="login_button"
              type="submit"
              className="btn btn-block py-3"
              disabled={loading}
            >
              LOGIN
            </button>

            <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
              <GoogleLogin
                onSuccess={googleSuccess}
                onFailure={googleFailure}
                render={(renderProps) => (
                  <button
                    className="google_btn"
                    onClick={renderProps.onClick}
                    disabled={renderProps.disabled}
                    type="button"
                  >
                    <img src="./images/google.png" alt="google icon" />
                    <span>Sign in with Google</span>
                  </button>
                )}
              />
            </GoogleOAuthProvider>

            <Link to="/register" className="float-right mt-3">
              New User?
            </Link>
          </form>
        </div>
      </div>
    </Fragment>
  );
}
