import { Avatar, Divider, Paper, IconButton, Chip } from "@material-ui/core";
import { useState } from 'react'
import ReactHtmlParser from 'html-react-parser';
import TodayIcon from '@material-ui/icons/Today';
import ThumbUpAltRoundedIcon from '@material-ui/icons/ThumbUpAltRounded';
import ThumbDownAltRoundedIcon from '@material-ui/icons/ThumbDownAltRounded';
import React from "react";
import { Link, useHistory } from 'react-router-dom'
import "./QuestionCard.css";
import { config } from "../config";
import download from "downloadjs";
function QuestionCard({
  title,
  likes,
  dislikes,
  body,
  name,
  postedOn,
  id,
  tags,
  profilePic,
  updateQuestion,
  file = ''
}) {
  let [disableLike, setDisableLike] = useState(false)
  let [disableDisLike, setdisableDisLike] = useState(false)
  const userData = JSON.parse(localStorage.getItem('userData'))
  const history = useHistory();
  const likeMessage = () => {
    if (disableLike === false && disableDisLike === true) {
      fetch(`${config.apiUrl}/api/vote/question?questionId=${id}&type=like&increase=true`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          fetch(`${config.apiUrl}/api/vote/question?questionId=${id}&type=dislike&increase=false`, {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${userData.token}`,
            },
          })
            .then((res) => {
              return res.json();
            })
            .then((data) => {
              setDisableLike(true)
              setdisableDisLike(false)
              updateQuestion(data.question)
            });
        });
    }
    if (disableLike === false && disableDisLike === false) {
      fetch(`${config.apiUrl}/api/vote/question?questionId=${id}&type=like&increase=true`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          setDisableLike(true)
          updateQuestion(data.question)
        });
    }
  };

  const dislikeMessage = () => {
    if (disableLike === true && disableDisLike === false) {
      fetch(`${config.apiUrl}/api/vote/question?questionId=${id}&type=dislike&increase=true`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          fetch(`${config.apiUrl}/api/vote/question?questionId=${id}&type=like&increase=false`, {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${userData.token}`,
            },
          })
            .then((res) => {
              return res.json();
            })
            .then((data) => {
              setDisableLike(false)
              setdisableDisLike(true)
              updateQuestion(data.question)
            });
        });
    }

    if (disableLike === false && disableDisLike === false) {
      fetch(`${config.apiUrl}/api/vote/question?questionId=${id}&type=dislike&increase=true`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          setDisableLike(true)
          setdisableDisLike(false)
          updateQuestion(data.question)
        });
    }
  };

  return (
    <div className="p-2">
    <Paper className="card" elevation={4}>
      <section className="card-header">
        {new Date(postedOn).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}<TodayIcon style={{ marginLeft: "4px" }}></TodayIcon>
      </section>
      <Divider />
      <div className="card-body-title">
        <h2><Link to={`/question/${id}`}>{title}</Link></h2>
      </div>
      <div className="card-body-content">
        {ReactHtmlParser(body)}
      </div>
      <Divider />
      <section className="card-footer">
        {/* <IconButton style={disableLike ? { color: "#3f51b5" } : { color: "grey" }} onClick={() => likeMessage()}>
          <ThumbUpAltRoundedIcon /> <span>{`\u00A0${likes}`}</span>
        </IconButton>
        <IconButton style={disableDisLike ? { color: "#3f51b5" } : { color: "grey" }} onClick={() => dislikeMessage()}>
          <ThumbDownAltRoundedIcon /> <span>{`\u00A0${dislikes}`}</span>
        </IconButton> */}
        {tags.map((tag) => {
          return (
            <Chip className="chip" style={{ backgroundColor: "#3949ab", color: "white", margin: "3px" }} title={tag} label={tag} onClick={() => {
              history.push(`/search/${tag}`)
            }} />
          );
        })}

        <section className="media-object" >
          {file !== '' ?
            <button class="btn btn-outline-primary btn-sm" role="button" onClick={() => {
              download(file, `${title}_attachment`, file.substring(file.indexOf(':') + 1, file.indexOf(';base64')))
            }}>Download Attachement 🔽</button> : null
          }

          <div className="profile-description" >
            <small>
              <strong>{name}</strong>
            </small>
          </div>
          <Avatar
            style={{ marginLeft: "10px" }}
            className="profile-image"
            alt="profile-pic"
            src={`${profilePic}`}
          />
        </section>
      </section>
     
    </Paper>
    </div>
  );
}

export default QuestionCard;
