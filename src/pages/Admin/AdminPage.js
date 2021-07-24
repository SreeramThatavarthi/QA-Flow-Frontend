import React, { useContext } from "react";
import { useEffect, useState } from "react";
import AdminQuestionCard from "../../components/AdminQuestionCard";
import { useHistory } from 'react-router-dom';
import { config } from "../../config";
import AdminBasePage from "./AdminBasePage";
import { AdminContext } from "../../Context/Context";
import Info from "../../components/Info";


const AdminPage = () => {
  const [questions, setQuestions] = useState([]);
  const history = useHistory();
  const { admin } = useContext(AdminContext);
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
    if (localStorage.getItem("userData") === null) {
      history.push('/login')
    } else {
      const userData = JSON.parse(localStorage.getItem('userData'))
      fetch(`${config.apiUrl}/api/questions`, {
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setQuestions(data["question"]);
        });
    }
  }, [history]);
  return (
    <>
      {
        (admin) ?
          (

            <AdminBasePage>
              {questions.length !== 0 ? questions.map((question) => {
                return (
                  <AdminQuestionCard
                    title={question.title}
                    body={question.body}
                    likes={question.upVotes}
                    tags={question.tags}
                    dislikes={question.downVotes}
                    postedOn={question.postedOn}
                    name={question.postedBy.name}
                    key={question._id}
                    id={question._id}
                    profilePic={question.postedBy.profile_pic_url}
                    updateQuestion={updateQuestion}
                  />
                );
              }) :
                <Info msg="No Questions are available" type="info"></Info>
              }
            </AdminBasePage>
          ) : (<h2 style={{ marginTop: "20px", padding: "20px", textAlign: "center" }}>Only admins can access this page</h2>)
      }
    </>
  )
}

export default AdminPage;