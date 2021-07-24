import { Avatar, Divider, Paper, IconButton } from "@material-ui/core";
import { useState } from 'react'
import WarningIcon from "@material-ui/icons/Warning";
import ThumbUpAltRoundedIcon from '@material-ui/icons/ThumbUpAltRounded';
import ThumbDownAltRoundedIcon from '@material-ui/icons/ThumbDownAltRounded';
import React from "react";
import { Link } from 'react-router-dom'
import "./QuestionCard.css";
import { config } from "../config";
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import { AdminContext } from "../Context/Context";

function AllQuestionCard({
  title,
  body,
  name,
  postedOn,
  key,
  id,
  removeQuestion
}) {
  const userData = JSON.parse(localStorage.getItem('userData'));

  const getQuestion = () => {
    console.log("d");
  }

  return (
  
        <Paper className="card" elevation={2}>
      <section className="card-header">
        <WarningIcon />
      </section>
      <Divider />
      <div className="card-body-title">
        <h2><Link to={`/question/${id}`}>{title}</Link></h2>
      </div>
      <div className="card-body-content">
        <p>{body}</p>
        <section className="media-object">
          <Avatar
            className="profile-image"
            alt="profile-pic"
            src="https://i.pinimg.com/originals/53/54/f7/5354f750a2816333f42efbeeacb4e244.jpg"
          />
          <Container>
          <Row>
              <Col sm={8}>
              <div className="profile-description">
                    <small>
                        <strong>{name}</strong>
                    </small>
                    <small>{new Date(postedOn).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</small>
                </div>
              </Col>
              <Col sm={4}>
                  <button type="button" class="btn btn-danger" style={{float:"right"}} onClick={()=>removeQuestion(id)}>Delete Question</button>
              </Col>
          </Row>
          </Container>
        </section>
      </div>
      <Divider />
      
    </Paper>

    
  );
}

export default AllQuestionCard;
