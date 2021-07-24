import { useEffect, useContext } from 'react';
import {
  Avatar,
  List,
  Paper,
  ListItemText,
  ListItem,
  ListItemAvatar,
} from "@material-ui/core";
import EmailIcon from "@material-ui/icons/Email";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import { Button } from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import EditIcon from "@material-ui/icons/Edit";
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import React from "react";
import BasePage from "./BasePage";
import { useHistory } from 'react-router-dom';
import "./Profile.css";
import { config } from "../config";
import { AdminContext } from '../Context/Context';

function Profile() {
  const history = useHistory();
  const { admin } = useContext(AdminContext);
  console.log(admin)
  const [image, setImage] = React.useState('');
  const [editBool, seteditBool] = React.useState(false);
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  if (localStorage.getItem("userData") === null) {
    history.push('/login')
  }

  const handleEdit = () => {
    const userData = JSON.parse(localStorage.getItem('userData'))
    fetch(`${config.apiUrl}/api/user/update`, {
      body: JSON.stringify({
        id: `${userData.user._id}`,
        name: name,
      }),
      method: "PUT",
      headers: {
        Authorization: `Bearer ${userData.token}`,
        "Content-Type": "application/json",
      },
    }).then((res) => {
      getUser()
      editBool ? seteditBool(false) : seteditBool(true)
    });
  }

  const getUser = () => {
    const userData = JSON.parse(localStorage.getItem('userData'))
    fetch(`${config.apiUrl}/api/user?userId=${userData.user._id}`, {
      headers: {
        Authorization: `Bearer ${userData.token}`,
      },
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setName(data.user.name)
        setEmail(data.user.email);
        setImage(data.user.profile_pic_url)
      });
  }
  useEffect(() => {
    getUser()
  }, [])

  return (
    <>
      {
        (!admin) ?
          (
            <BasePage>
              <Paper className="profile-card">
                <Avatar
                  className="profile-image"
                  alt="profile-pic"
                  src={image}
                  style={{ width: 200, height: 200 }}
                />
                <List>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar>
                        <AccountBoxIcon />
                      </Avatar>
                    </ListItemAvatar>
                    {
                      !editBool ? <ListItemText primary="Name" secondary={name} /> :
                        <InputGroup style={{ width: "330px " }}>
                          <FormControl aria-label="Large" aria-describedby="inputGroup-sizing-sm" onChange={(e) => {
                            setName(e.target.value);
                          }} placeholder="Enter Name" value={name} />
                        </InputGroup>

                    }

                  </ListItem>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar>
                        <EmailIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="Email" secondary={email} />
                  </ListItem>
                  <ListItem>
                    <Button
                      startIcon={!editBool ? <EditIcon /> : <CheckIcon />}
                      variant="contained"
                      style={{ backgroundColor: "#4caf50", color: "white", textTransform: "none" }}
                      onClick={handleEdit}
                    >
                      {!editBool ? <b>Edit</b> : <b>Submit</b>}
                    </Button>
                  </ListItem>
                </List>

              </Paper>

            </BasePage>
          ) : (<h2 style={{ marginTop: "20px", padding: "20px" }}>Only admins can access this page</h2>)
      }
    </>
  );
}

export default Profile;
