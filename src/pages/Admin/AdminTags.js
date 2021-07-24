import React, { useState, useEffect, useContext } from "react";
import GridContainer from "../../components/GridContainer";
import TagCard from "../../components/TagCard";
import { config } from "../../config";
import { useHistory } from 'react-router-dom';
import AdminBasePage from "./AdminBasePage";
import { AdminContext } from "../../Context/Context";

function AdminTags() {
  const [questions, setQuestions] = useState([]);
  const { admin } = useContext(AdminContext);
  const history = useHistory();

  useEffect(() => {
    if (localStorage.getItem("userData") === null) {
      history.push('/login')
    }

    fetch(`${config.apiUrl}/api/questions`, {
      headers: {
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDMyODI1NDU3ZDNlYTAwMmE3NzY4NWYiLCJpYXQiOjE2MTM5MjI5MDAsImV4cCI6MTYxNTY1MDkwMH0.YgaCvQX7YyS6FloS-Ifrp-RJuza9MZb2M7RfHEPRPC0`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setQuestions(data["question"]);
      });
  }, []);

  return (
    <>
      {

        (admin) ?
          (
            <AdminBasePage>
              <h1>Popular tags</h1>
              <GridContainer>
                {questions.map((question) => {
                  return (
                    <TagCard
                      key={question._id}
                      title={question.title}
                      tags={question.tags}
                    />
                  );
                })}
              </GridContainer>
            </AdminBasePage>
          ) : (<h2 style={{ marginTop: "20px", padding: "20px" }}>Only admins can access this page</h2>)
      }
    </>
  );
}

export default AdminTags;
