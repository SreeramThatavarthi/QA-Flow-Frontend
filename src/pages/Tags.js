import React, { useState, useEffect } from "react";
import GridContainer from "../components/GridContainer";
import TagCard from "../components/TagCard";
import { config } from "../config";
import BasePage from "./BasePage";
import { useHistory } from 'react-router-dom';
import Info from "../components/Info";

function Tags() {
  const [questions, setQuestions] = useState([]);

  const history = useHistory();

  useEffect(() => {
    if (localStorage.getItem("userData") === null) {
      history.push('/login')
    }
    const userData = JSON.parse(localStorage.getItem('userData'))
    fetch(`${config.apiUrl}/api/questions`, {
      headers: {
        Authorization: `Bearer ${userData.token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setQuestions(data["question"]);
      });
  }, []);

  return (
    <BasePage>
      <h1>Popular tags</h1>
      <br />
      {questions.length !== 0 ? <GridContainer>
        {questions.map((question) => {
          return (
            <TagCard
              key={question._id}
              id={question._id}
              title={question.title}
              tags={question.tags}
              likes={question.upVotes}
              dislikes={question.downVotes}
            />
          );
        })}
      </GridContainer> : <Info msg="No Questions are available" type="info"></Info>}

    </BasePage>
  );
}

export default Tags;
