import React, { useContext } from "react";
import { useEffect, useState } from "react";
import { useHistory } from 'react-router-dom';
import { config } from "../../config";
import AdminBasePage from "./AdminBasePage";
import { AdminContext } from "../../Context/Context";
import AdminMiniQuestionCard from "../../components/AdminMiniQuestion";
import GridContainer from "../../components/GridContainer";
import Info from "../../components/Info";


const AdminAllQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const history = useHistory();
  const { admin } = useContext(AdminContext);
  const removeQuestion = (id) => {
    console.log(id)
    const userData = JSON.parse(localStorage.getItem('userData'))
    fetch(`${config.apiUrl}/api/delete/question?questionId=${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${userData.token}`,
      }
    })
      .then((data) => {

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
      })
      .catch((err) => console.log(err));
  }

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
              {
                questions.length !== 0 ? <GridContainer>
                  {questions.map((question) => {
                    return (
                      <AdminMiniQuestionCard
                        key={question._id}
                        id={question._id}
                        title={question.title}
                        tags={question.tags}
                        body={question.body}
                        postedOn={question.postedOn}
                        getUserQuestions={removeQuestion}

                      />

                    );
                  })}
                </GridContainer> : <Info msg="No Questions are available" type="info"></Info>
              }

            </AdminBasePage>
          ) : (<h2 style={{ marginTop: "20px", padding: "20px", textAlign: "center" }}>Only admins can access this page</h2>)
      }
    </>
  )
}

export default AdminAllQuestions;