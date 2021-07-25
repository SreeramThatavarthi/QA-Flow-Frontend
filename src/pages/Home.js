import React, { useContext, useEffect, useState } from "react";
import QuestionCard from "../components/QuestionCard";
import { useHistory, useLocation } from 'react-router-dom';
import { config } from "../config";
import BasePage from "./BasePage";
import { AdminContext, QuestionContext } from "../Context/Context";
import Info from "../components/Info";
import PropagateLoader from "react-spinners/BeatLoader";
function Home() {
  const {questions, setQuestions} = useContext(QuestionContext)
  const history = useHistory();
  const location = useLocation()
  const { setAdmin } = useContext(AdminContext);
  const [loading,setLoading]=useState(true);

  const updateQuestion = (question) => {
    let questions_ = questions.map((q) => {
      if (q._id === question._id) {
        return question;
      } else {
        return q;
      }
    });
    setQuestions(questions_);
  };

  useEffect(() => {
    let userData = JSON.parse(localStorage.getItem("userData"));
    if (localStorage.getItem("userData") === null) {
      history.push('/login')
    }
    else if (userData.user.role === "admin") {
      setAdmin(true);
      history.push('/admin')
    }
    else {
      const userData = JSON.parse(localStorage.getItem('userData'))
      if (location.state === undefined) {
        fetch(`${config.apiUrl}/api/questions`, {
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        })
          .then((res) => res.json())
          .then((data) => {
            setQuestions(data["question"]);
            setLoading(false);
          });
      } else {
        console.log('here')
        fetch(`${config.apiUrl}/api/search/questions`, {
          body: JSON.stringify({
            tags: location.state.tags,
          }),
          method: "POST",
          headers: {
            Authorization: `Bearer ${userData.token}`,
            "Content-Type": "application/json",
          },
        }).then((res) => res.json()).then((data) => {
          setQuestions(data["questions"]);
      setLoading(false);
        });
      }
    }
  }, [history]);

  return (
    <BasePage>
      {
        (!loading)?(
          questions.length !== 0 ? (questions.map((question) => {
          return (
            <QuestionCard
              title={question.title}
              body={question.body}
              likes={question.upVotes}
              tags={question.tags}
              dislikes={question.downVotes}
              postedOn={question.postedOn}
              name={question.postedBy.name}
              profilePic={question.postedBy.profile_pic_url}
              key={question._id}
              id={question._id}
              updateQuestion={updateQuestion}
            />
          );
        })) : (<div className="p-2"><Info msg="No Questions are available" type="info"></Info></div>)):
        (<div style={{position:"fixed",top:"50%",left:"50%"}}><PropagateLoader color="#3C4A9C" size={10} /></div>)
      }
    </BasePage>
  );
}

export default Home;
