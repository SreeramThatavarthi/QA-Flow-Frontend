import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from "react-router-dom";
import Card from '@material-ui/core/Card';
import { Button } from "@material-ui/core";
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import VisibilityIcon from '@material-ui/icons/Visibility';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import TodayIcon from "@material-ui/icons/Today";
import { config } from '../config'
import { AdminContext } from '../Context/Context';

const useStyles = makeStyles({
  root: {
    minWidth: 275,
    textTransform: "none"
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

export default function AdminMiniAnswerCard({ id, questionId, postedOn, tags, title, body, getUserAnswers }) {
  const { admin } = useContext(AdminContext);
  const classes = useStyles();
  const history = useHistory();
  let plainText = body.replace(/<[^>]+>/g, '').slice(0, 100);
  const [openAlert, setOpenAlert] = React.useState(false);

  const handleClickOpenAlert = () => {
    setOpenAlert(true);
  };

  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  const handleDelete = (id) => {
    const userData = JSON.parse(localStorage.getItem('userData'))
    fetch(`${config.apiUrl}/api/delete/answer?answerId=${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${userData.token}`,
      }
    })
      .then((data) => {
        handleCloseAlert()
        getUserAnswers()
      })
      .catch((err) => console.log(err));
  }

  return (
    <>
      <Card className={classes.root} variant="outlined" style={{ backgroundColor: "#c8e6c9" }}>
        <CardContent>
          <Typography className={classes.title} color="textSecondary" gutterBottom>
            Question Title
            <span style={{ float: "right" }}>
              {new Date(postedOn).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
              <TodayIcon style={{ marginLeft: "4px" }}></TodayIcon>
            </span>
          </Typography>
          <Typography variant="h5" component="h2">
            <b>{title}</b>
          </Typography>
          <Typography className={classes.pos} color="textSecondary">
            Answer
        </Typography>
          <Typography variant="body2" component="p">
            {plainText}....
        </Typography>
        </CardContent>
        <CardActions>
          {
            (admin) ? (
              <Button startIcon={<VisibilityIcon />} variant="contained" color="primary" style={{ textTransform: "none" }} onClick={() => {
                history.push(`/admin/question/${questionId}`)
              }}><b>View</b></Button>
            ) : (<Button startIcon={<VisibilityIcon />} variant="contained" color="primary" style={{ textTransform: "none" }} onClick={() => {
              history.push(`/question/${questionId}`)
            }}><b>View</b></Button>)
          }
          {
            (admin) ? (
              <Button startIcon={<EditIcon />} variant="contained" style={{ backgroundColor: "#4caf50", color: "white", textTransform: "none" }} onClick={() => {
                history.push({
                  pathname: `/admin/question/${questionId}`,
                  state: { body: body, id: id },
                });
              }}><b>Edit</b></Button>
            ) : (<Button startIcon={<EditIcon />} variant="contained" style={{ backgroundColor: "#4caf50", color: "white", textTransform: "none" }} onClick={() => {
              history.push({
                pathname: `/question/${questionId}`,
                state: { body: body, id: id },
              });
            }}><b>Edit</b></Button>)
          }
          <Button startIcon={<DeleteIcon />} variant="contained" style={{ backgroundColor: "#c62828", color: "white", textTransform: "none" }} onClick={handleClickOpenAlert}><b>Delete</b></Button>
        </CardActions>
      </Card>
      <Dialog
        open={openAlert}
        onClose={handleCloseAlert}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Are you sure you want to delete ?"}
        </DialogTitle>
        <DialogActions style={{ justifyContent: "center" }}>
          <Button startIcon={<ClearIcon />} variant="contained" style={{ backgroundColor: "#c62828", color: "white", textTransform: "none" }} onClick={handleCloseAlert}>
            No
          </Button>
          <Button startIcon={<CheckIcon />} variant="contained" style={{ backgroundColor: "#4caf50", color: "white", textTransform: "none" }} autoFocus onClick={() => {
            handleDelete(id)
          }}>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
