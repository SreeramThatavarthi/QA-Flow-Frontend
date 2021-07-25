import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from "react-router-dom";
import Card from '@material-ui/core/Card';
import { Button, Chip, IconButton } from "@material-ui/core";
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import VisibilityIcon from '@material-ui/icons/Visibility';
import ThumbUpAltRoundedIcon from '@material-ui/icons/ThumbUpAltRounded';
import ThumbDownAltRoundedIcon from '@material-ui/icons/ThumbDownAltRounded';

const useStyles = makeStyles({
  root: {
    minWidth: 150,
    textTransform: "none"
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

export default function MiniQuestionCard({ id, tags, title, likes, dislikes }) {
  const classes = useStyles();
  const history = useHistory();


  return (
    <Card className={classes.root} variant="outlined" style={{ backgroundColor: "#bbdefb",padding:"2px",marginBottom:"2px" }}>
      <CardContent>
        <Typography className={classes.title} color="textSecondary" gutterBottom>
          Question Title
        </Typography>
        <Typography variant="h5" component="h2">
          <b>{title}</b>
        </Typography>
        <Typography className={classes.pos} color="textSecondary">
          Tags
        </Typography>
        <Typography variant="body2" component="p">
          {tags.map((tag) => {
            return (
              <Chip className="chip" style={{ backgroundColor: "#3949ab", color: "white", margin: "3px" }} title={title} label={tag} />
            );
          })}
        </Typography>
      </CardContent>
      <CardActions>
        <Button startIcon={<VisibilityIcon />} variant="contained" color="primary" style={{ textTransform: "none" }} onClick={() => {
          history.push(`/question/${id}`)
        }}><b>View</b></Button>
        {/* <IconButton disabled >
          <ThumbUpAltRoundedIcon /> <span>{`\u00A0${likes}`}</span>
        </IconButton>
        <IconButton disabled >
          <ThumbDownAltRoundedIcon /> <span>{`\u00A0${dislikes}`}</span>
        </IconButton> */}
      </CardActions>
    </Card>
  );
}
