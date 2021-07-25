import React, { useState, useEffect } from "react";
import GridContainer from "../components/GridContainer";
import TagCard from "../components/TagCard";
import { config } from "../config";
import BasePage from "./BasePage";
import { useHistory } from 'react-router-dom';
import Info from "../components/Info";
import { useMediaQuery } from 'react-responsive';
import PropagateLoader from "react-spinners/BeatLoader";
import { css } from "@emotion/react";
import { toast } from "react-toastify";

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

function Tags() {

  const isDesktopOrLaptop = useMediaQuery({
    query: '(min-device-width: 1224px)'
  })
  const isTabletOrMobileDevice = useMediaQuery({
    query: '(max-device-width: 1224px)'
  })

  const [questions, setQuestions] = useState([]);
  const [loading,setLoading]=useState(true);
  const history = useHistory();

  useEffect(() => {
    if (localStorage.getItem("userData") === null) {
      toast("Please login",{type:"warning"})
      history.push('/login')
    }
    const userData = JSON.parse(localStorage.getItem('userData'))
    if(userData)
    {
      fetch(`${config.apiUrl}/api/questions`, {
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setLoading(false)
          console.log(data);
          setQuestions(data["question"]);
        });
    }
  }, []);

  return (
    <BasePage>
    <div style={{position:"fixed",top:"50%",left:"50%"}}><PropagateLoader color="#3C4A9C" loading={loading} css={override} size={10} /></div>
      <h1 style={{textAlign:"center",marginTop:"2px"}}>Popular tags</h1>
      <br />
     {
       isDesktopOrLaptop &&
       <>
        {questions.length !== 0 ?
       <GridContainer>
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
      </GridContainer> :(
        (!loading)&&
        <Info msg="No Questions are available" type="info"></Info>
      )}
       </>
     }
     {
       isTabletOrMobileDevice &&
       <>
        {questions.length !== 0 ?
       <div className="p-3">
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
      </div> : 
      (
        (!loading)&&
        <div style={{padding:"3px"}}><Info msg="No Questions are available" type="info" ></Info></div>
      )}
      </>
     }

    </BasePage>
  );
}

export default Tags;
