import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useHistory } from "react-router-dom";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import { Button } from '@material-ui/core';
import DeleteIcon from "@material-ui/icons/Delete";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";
import VisibilityIcon from '@material-ui/icons/Visibility';


const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    width: "450px"
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: '1 0 auto',
  },
  cover: {
    width: 151,
    marginLeft: "20px"
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  playIcon: {
    height: 38,
    width: 38,
  },
}));

export default function MediaControlCard({ name, role, id, removeUser, email, image }) {
  const [openAlert, setOpenAlert] = React.useState(false);
  const history = useHistory();
  const handleClickOpenAlert = () => {
    setOpenAlert(true);
  };

  const handleCloseAlert = () => {
    setOpenAlert(false);
  };
  const classes = useStyles();
  const theme = useTheme();
  function toTitleCase(str) {
    return str.replace(
      /\w\S*/g,
      function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      }
    );
  }

  return (
    <>
      <Card className={classes.root}>
        <div className={classes.details}>
          <CardContent className={classes.content}>
            <Typography component="h5" variant="h5">
              {toTitleCase(name.replace(/[0-9]/g, '')).substring(0, 21)}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              {email}
            </Typography>
          </CardContent>
          <div className={classes.controls}>
            <Button
              startIcon={<VisibilityIcon />}
              variant="contained"
              color="primary"
              style={{ color: "white", textTransform: "none" }}
              onClick={() => {
                history.push(`/admin/activity/${id}`);
              }}
            >
              <b>See Activity</b>
            </Button>
            {' '}
            <Button
              startIcon={<DeleteIcon />}
              variant="contained"
              style={{ backgroundColor: "#c62828", color: "white", textTransform: "none", marginLeft: "20px" }}
              onClick={handleClickOpenAlert}
            >
              <b>Remove</b>
            </Button>
          </div>
        </div>
        <CardMedia
          className={classes.cover}
          image={`${image}`}
        />
      </Card>
      <Dialog
        open={openAlert}
        onClose={handleCloseAlert}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Are you sure you want to delete ?"}</DialogTitle>
        <DialogActions style={{ justifyContent: "center" }}>
          <Button
            startIcon={<ClearIcon />}
            variant="contained"
            style={{ backgroundColor: "#c62828", color: "white", textTransform: "none" }}
            onClick={handleCloseAlert}
          >
            No
      </Button>
          <Button
            startIcon={<CheckIcon />}
            variant="contained"
            style={{ backgroundColor: "#4caf50", color: "white", textTransform: "none" }}
            autoFocus
            onClick={() => {
              removeUser(id);
            }}
          >
            Yes
      </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
