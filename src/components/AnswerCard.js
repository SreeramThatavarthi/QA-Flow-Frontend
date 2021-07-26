import { Avatar, Divider, Paper, IconButton } from "@material-ui/core";
import { useState } from 'react'
import ReactHtmlParser from 'html-react-parser';
import TodayIcon from '@material-ui/icons/Today';
import ThumbUpAltRoundedIcon from '@material-ui/icons/ThumbUpAltRounded';
import ThumbDownAltRoundedIcon from '@material-ui/icons/ThumbDownAltRounded';
import React from "react";
import { Link } from 'react-router-dom'
import "./QuestionCard.css";
import { config } from "../config";
import download from "downloadjs";
function AnswerCard({
  title,
  likes,
  dislikes,
  body,
  name,
  postedOn,
  id,
  profilePic,
  updateAnswer,
  file = ''
}) {
  let [disableLike, setDisableLike] = useState(false)
  let [disableDisLike, setdisableDisLike] = useState(false)
  const userData = JSON.parse(localStorage.getItem('userData'))
  const likeMessage = () => {
    if (disableLike === false && disableDisLike === true) {
      fetch(`${config.apiUrl}/api/vote/answer?answerId=${id}&type=like&increase=true`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          fetch(`${config.apiUrl}/api/vote/answer?answerId=${id}&type=dislike&increase=false`, {
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
              updateAnswer(data.answer)
            });
        });
    }
    if (disableLike === false && disableDisLike === false) {
      fetch(`${config.apiUrl}/api/vote/answer?answerId=${id}&type=like&increase=true`, {
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
          updateAnswer(data.answer)
        });
    }
  };

  const dislikeMessage = () => {
    if (disableLike === true && disableDisLike === false) {
      fetch(`${config.apiUrl}/api/vote/answer?answerId=${id}&type=dislike&increase=true`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          fetch(`${config.apiUrl}/api/vote/answer?answerId=${id}&type=like&increase=false`, {
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
              updateAnswer(data.answer)
            });
        });
    }

    if (disableLike === false && disableDisLike === false) {
      fetch(`${config.apiUrl}/api/vote/answer?answerId${id}&type=dislike&increase=true`, {
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
          updateAnswer(data.answer)
        });
    }
  };

  return (
    <Paper className="card p-2" elevation={2}>
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
        <section className="media-object" >
          {file !== '' ?
            <button class="btn btn-outline-primary btn-sm" role="button" onClick={() => {
              download(file, `ans_attachment`, file.substring(file.indexOf(':') + 1, file.indexOf(';base64')))
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
            src={profilePic}
          />
        </section>
      </section>
    </Paper>
  );
}

export default AnswerCard;
