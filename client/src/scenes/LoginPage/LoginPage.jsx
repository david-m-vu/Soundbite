import "./LoginPage.css";
import { useState } from "react";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "../../state/index.js";
import { TextField, Button } from "@mui/material";

const authBaseURL = "http://localhost:3001/auth";

const registerSchema = yup.object().shape({
  firstName: yup.string().required("required"),
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
  location: yup.string().required("required"),
});

const loginSchema = yup.object().shape({
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
});

const initalValuesRegister = {
  firstName: "",
  email: "",
  password: "",
  location: "",
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
        "Content-Type": "application/json"
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
      navigate("/main");
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
          <form onSubmit={handleSubmit}>
            <div className="form">
              {isRegister && (
                <div className="registerForm">
                  {/* <label>First Name</label>
                    <input type="text" onChange={handleChange} value={values.firstName} name="firstName" onError={Boolean(touched.firstName) && Boolean(errors.firstName)}></input> */}
                  <TextField
                    label="First Name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.firstName}
                    name="firstName"
                    error={
                      Boolean(touched.firstName) && Boolean(errors.firstName)
                    }
                    helperText={touched.firstName && errors.firstName}
                  />
                  <TextField
                    label="Location"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.location}
                    name="location"
                    error={
                      Boolean(touched.location) && Boolean(errors.location)
                    }
                    helperText={touched.location && errors.location}
                  />
                </div>
              )}
              <div className="loginForm">
                <TextField
                  label="Email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.email}
                  name="email"
                  error={Boolean(touched.email) && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                />
                <TextField
                  label="Password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.password}
                  name="password"
                  error={Boolean(touched.password) && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                />
              </div>

              <div className="submitLogin">
                <button type="submit">
                  {isRegister ? "REGISTER" : "LOGIN"}
                </button>
              </div>
              <p className="changeFormTypeButton" onClick={() => {
                setIsRegister(isRegister ? false : true)
                resetForm();
              }}>
                {isRegister ? "Already have an account? Login here." : "Don't have an account? Sign Up here."}
              </p>
            </div>
          </form>
        )}
      </Formik>
    </div>
  );
};

export default LoginPage;
