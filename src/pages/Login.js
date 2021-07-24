import React, { useContext } from "react";
import { GoogleLogin } from "react-google-login";
import { config } from "../config";
import { useHistory } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import pic from '../assests/loginImg.png';
import "./Login.css";
import { ImageContext } from "../Context/Context";
import GoogleButton from 'react-google-button'
const axios = require('axios');
function Login() {
  const history = useHistory();
  const { setImage } = useContext(ImageContext);

  const ResponseGoogle = (response) => {
    console.log(response)
    console.log(response.tokenId)
    // if (response.profileObj.imageUrl) {
      localStorage.setItem("googleAccessToken", response.tokenId);
      localStorage.setItem("profilePic", response.profileObj.imageUrl);

      setImage(response.profileObj.imageUrl);
      axios.post(`${config.apiUrl}/api/google-login`, {
        idToken: response.tokenId
      })
        .then(function (response) {
          console.log(11);
          toast("Google SignIn Success");
          localStorage.setItem("userData", JSON.stringify(response.data));
          history.push('/')
        })
        .catch(function (error) {
          console.log(111);
          toast("Google SignIn Failed, Try Again");
          console.log(error);
        });
  };
  return (
    <>
      <ToastContainer position="top-center" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="centered">
        <div className="d-flex" style={{ marginTop: "80px" }}>
          <img
            alt="gitam-logo"
            src={pic}
            width={500}
            height={200}
            className="img-thumbnail rounded-circle shadow-sm"
          />
        </div>
      </div>
      <div className="centered2" style={{ marginTop: "30px" }}>
        <GoogleLogin
          clientId={config.googleClientId}
          onSuccess={ResponseGoogle}
          onFailure={ResponseGoogle}
          render={renderProps => (

        <GoogleButton style={{backgroundColor:"#d9534f"}}onClick={renderProps.onClick}
          disabled={renderProps.disabled} />
          )}
        />
      </div>
    </>
  );
}

export default Login;
