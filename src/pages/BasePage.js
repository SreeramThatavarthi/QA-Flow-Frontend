import {
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import HomeIcon from "@material-ui/icons/Home";
import LocalOfferIcon from "@material-ui/icons/LocalOffer";
import TimelineIcon from '@material-ui/icons/Timeline';
import { Link, useHistory } from "react-router-dom";
import React from "react";
import { useMediaQuery } from 'react-responsive';
import "./Base.css";
import PersistentDrawerLeft from "./NavBar";

function BasePage({ children }) {
  const isDesktopOrLaptop = useMediaQuery({
    query: '(min-device-width: 1224px)'
  })
  const isTabletOrMobileDevice = useMediaQuery({
    query: '(max-device-width: 1224px)'
  })
  const history = useHistory();
  return (
    <div className="root-container">
      {
        isDesktopOrLaptop &&
        <>
        <div className="side-bar">
        <List>
          <ListItem>
            <ListItemText>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddCircleIcon />}
                onClick={() => history.push("/ask_question")}
              >
                Ask a question
              </Button>
            </ListItemText>
          </ListItem>
        </List>
        <List>
          <ListItem className="link-sidebar">
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <Link to="/" className="router-link">
              <ListItemText>Home</ListItemText>
            </Link>
          </ListItem>
          <ListItem className="link-sidebar">
            <ListItemIcon>
              <TimelineIcon />
            </ListItemIcon>
            <Link to="/activity" className="router-link">
              <ListItemText>My Activity</ListItemText>
            </Link>
          </ListItem>
          <ListItem className="link-sidebar">
            <ListItemIcon>
              <LocalOfferIcon />
            </ListItemIcon>
            <Link to="/tags" className="router-link">
              <ListItemText>Tags</ListItemText>
            </Link>
          </ListItem>
        </List>
      </div>
      <div className="content-plane">{children}</div>
        </>

      }
      {
        isTabletOrMobileDevice &&
      <>
      <PersistentDrawerLeft/>
      <div >{children}</div>
      </>

      }
    </div>
  );
}

export default BasePage;
