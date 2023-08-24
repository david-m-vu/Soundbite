import "./LoginPage.css";
import { useState } from "react";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "../../state/index.js";
import NavBar from "../../components/NavBar/NavBar.jsx";

const authBaseURL = `${process.env.REACT_APP_BACKEND_BASE_URL}/auth`;

const registerSchema = yup.object().shape({
  username: yup.string().required("required"),
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
  passwordConfirmation: yup.string().required("required"),
});

const loginSchema = yup.object().shape({
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
});

const initalValuesRegister = {
  username: "",
  email: "",
  password: "",
  passwordConfirmation: "",
};

const initialValuesLogin = {
  email: "",
  password: "",
};

const LoginPage = () => {
  const [isRegister, setIsRegister] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const register = async (values, onSubmitProps) => {
    // const formData = new FormData();
    // for (let value in values) {
    //   formData.append(value, values[value]);
    // }
    
    const savedUserResponse = await fetch(`${authBaseURL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    const savedUser = await savedUserResponse.json();
    onSubmitProps.resetForm();

    if (savedUser) {
      setIsRegister(false);
    }
  };

  const login = async (values, onSubmitProps) => {
    const loggedInResponse = await fetch(`${authBaseURL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    const loggedIn = await loggedInResponse.json();

    if (loggedInResponse.ok) {
      onSubmitProps.resetForm();
      dispatch(
        setLogin({
          user: loggedIn.user,
          token: loggedIn.token,
        })
      );
      navigate("../connect");
    }
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    if (isRegister) {
      await register(values, onSubmitProps);
    } else {
      await login(values, onSubmitProps);
    }
  };

  return (
    <div className="LoginPage">
      <NavBar/>
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={isRegister ? initalValuesRegister : initialValuesLogin}
        validationSchema={isRegister ? registerSchema : loginSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          resetForm,
        }) => (
          <form className="form" onSubmit={handleSubmit}>
            {isRegister ? (
              <div className="registerForm">
                <div className="selection">
                  <label htmlFor="username" className="inputLabel">
                    Pick a username
                  </label>
                  <input
                    className="formInput"
                    id="username"
                    placeholder="my_username"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.username}
                  />
                  {Boolean(touched.username) && Boolean(errors.username) && (
                    <p className="errorMessage">{errors.username}</p>
                  )}
                </div>

                <div className="selection">
                  <label htmlFor="email" className="inputLabel">
                    Email
                  </label>
                  <input
                    className="formInput"
                    id="email"
                    placeholder="example@gmail.com"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.email}
                  />
                  {Boolean(touched.email) && Boolean(errors.email) && (
                    <p className="errorMessage">{errors.email}</p>
                  )}
                </div>

                <div className="selection">
                  <label htmlFor="password" className="inputLabel">
                    Password
                  </label>
                  <input
                    type="password"
                    className="formInput"
                    id="password"
                    placeholder="password"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.password}
                  />
                  {Boolean(touched.password) && Boolean(errors.password) && (
                    <p className="errorMessage">{errors.password}</p>
                  )}
                </div>

                <div className="selection">
                  <label htmlFor="passwordConfirmation" className="inputLabel">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    className="formInput"
                    id="passwordConfirmation"
                    placeholder="confirmed password"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.passwordConfirmation}
                  />
                  {Boolean(touched.passwordConfirmation) && Boolean(errors.passwordConfirmation) && (
                    <p className="errorMessage">
                      {errors.passwordConfirmation}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="loginForm">
                <div className="selection">
                  <label htmlFor="email" className="inputLabel">
                    Email
                  </label>
                  <input
                    className="formInput"
                    id="email"
                    placeholder="example@gmail.com"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.email}
                  />
                  {Boolean(touched.email) && Boolean(errors.email) && (
                    <p className="errorMessage">{errors.email}</p>
                  )}
                </div>

                <div className="selection">
                  <label htmlFor="password" className="inputLabel">
                    Password
                  </label>
                  <input
                    type="password"
                    className="formInput"
                    id="password"
                    placeholder="password"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.password}
                  />
                  {Boolean(touched.password) && Boolean(errors.password) && (
                    <p className="errorMessage">{errors.password}</p>
                  )}
                </div>
              </div>
            )}

            <div className="submitLogin">
              <button className="submitButton standardButton" type="submit">
                {isRegister ? "Next" : "Login"}
              </button>
            </div>

            <div className="switchForm">
              {isRegister ? (
                <p>Already have an account?&nbsp;</p>
              ) : (
                <p>Don't have an account?&nbsp;</p>
              )}
              <p
                className="changeFormTypeButton"
                onClick={() => {
                  setIsRegister(isRegister ? false : true);
                  resetForm();
                }}
              >
                {isRegister ? "Login here." : "Sign Up here."}
              </p>
            </div>
          </form>
        )}
      </Formik>
    </div>
  );
};

export default LoginPage;
