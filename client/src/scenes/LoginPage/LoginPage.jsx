import "./LoginPage.css";
import { useState } from "react";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "../../state/index.js";
import { TextField } from "@mui/material";

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
    const formData = new FormData();
    for (let value in values) {
      formData.append(value, values[value]);
    }

    const savedUserResponse = await fetch(`${authBaseURL}/register`, {
      method: "POST",
      body: formData,
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
    onSubmitProps.resetForm();
    if (loggedIn) {
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
          setFieldValue,
          resetForm,
        }) => (
          <form onSubmit={handleSubmit}>
            {isRegister && (
              <div className="loginForm">
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
                  label="Email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.email}
                  name="email"
                  error={Boolean(touched.email) && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                />
              </div>
            )}
          </form>
        )}
      </Formik>
    </div>
  );
};

export default LoginPage;
