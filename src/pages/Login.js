import React, { useContext, useState } from "react";
import { GoogleLogin } from "react-google-login";
import { config } from "../config";
import { useHistory } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import pic from '../assests/loginImg.png';
import "./Login.css";
import { ImageContext } from "../Context/Context";
import GoogleButton from 'react-google-button'
import PropagateLoader from "react-spinners/BeatLoader";

const axios = require('axios');
function Login() {
  const history = useHistory();
  const { setImage } = useContext(ImageContext);
  const [loading,setLoading]=useState(false)
  const ResponseGoogle = (response) => {
    setLoading(true)
      localStorage.setItem("googleAccessToken", response.tokenId);
      localStorage.setItem("profilePic", response.profileObj.imageUrl);
      setImage(response.profileObj.imageUrl);
      axios.post(`${config.apiUrl}/api/google-login`, {
        idToken: response.tokenId
      })
        .then(function (response) {
          localStorage.setItem("userData", JSON.stringify(response.data));
          history.push('/');
          setLoading(false)
          toast("Google SignIn Success",{type:"success"});
        })
        .catch(function (error) {
          toast("Google SignIn Failed, Try Again",{type:"error"});
          setLoading(false)
        });
  };
  return (
    <>
      <div className="centered">
      <div style={{position:"fixed",top:"50%",left:"50%"}}><PropagateLoader color="#3C4A9C" loading={loading} size={10} /></div>
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
