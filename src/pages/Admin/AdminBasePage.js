import {
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import HomeIcon from "@material-ui/icons/Home";
import TimelineIcon from '@material-ui/icons/Timeline';
import HelpIcon from "@material-ui/icons/Help";
import GroupIcon from '@material-ui/icons/Group';
import QuestionAnswerIcon from "@material-ui/icons/QuestionAnswer";
import { Link, useHistory } from "react-router-dom";
import React from "react";
import "../Base.css";

function AdminBasePage({ children }) {
  const history = useHistory();
  return (
    <div className="root-container">
      <div className="side-bar">
        <List>
          <ListItem>
            <ListItemText>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddCircleIcon />}
                onClick={() => history.push("/admin/askquestion")}
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
            <Link to="/admin" className="router-link">
              <ListItemText>Home</ListItemText>
            </Link>
          </ListItem>
          <ListItem className="link-sidebar">
            <ListItemIcon>
              <TimelineIcon />
            </ListItemIcon>
            <Link to="/admin/activity" className="router-link">
              <ListItemText>My Activity</ListItemText>
            </Link>
          </ListItem>
          <ListItem className="link-sidebar">
            <ListItemIcon>
              <GroupIcon />
            </ListItemIcon>
            <Link to="/admin/allusers" className="router-link">
              <ListItemText>All Users</ListItemText>
            </Link>
          </ListItem>
          <ListItem className="link-sidebar">
            <ListItemIcon>
              <HelpIcon />
            </ListItemIcon>
            <Link to="/admin/questions" className="router-link">
              <ListItemText>All Questions</ListItemText>
            </Link>
          </ListItem>
          <ListItem className="link-sidebar">
            <ListItemIcon>
              <QuestionAnswerIcon />
            </ListItemIcon>
            <Link to="/admin/answers" className="router-link">
              <ListItemText>All Answers</ListItemText>
            </Link>
          </ListItem>
        </List>
      </div>
      <div className="content-plane">{children}</div>
    </div>
  );
}

export default AdminBasePage;
