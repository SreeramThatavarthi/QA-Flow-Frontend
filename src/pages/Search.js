import { useEffect, useState } from 'react';
import React from "react";
import BasePage from "./BasePage";
import { useHistory, useParams } from 'react-router-dom';
import { config } from "../config";
import QuestionCard from '../components/QuestionCard';
import PropagateLoader from "react-spinners/BeatLoader";

function Search() {
    let { id } = useParams();
    console.log(id);
    const history = useHistory();
    
    const [questions, setQuestions] = useState([]);
    const [loading,setLoading]=useState(true);
    // if(questions==[])
    // {
    //     nf=true;
    // }
    // else
    // {
    //     nf=false;
    // }
    if (localStorage.getItem("userData") === null) {
        history.push('/login')
    }

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
        if(id!=null)
        {
            let tags = id.split(',')
            const userData = JSON.parse(localStorage.getItem('userData'))
            fetch(`${config.apiUrl}/api/search/questions`, {
                body: JSON.stringify({
                    tags: tags,
                }),
                method: "POST",
                headers: {
                    Authorization: `Bearer ${userData.token}`,
                    "Content-Type": "application/json",
                },
            }).then((res) => res.json()).then((data) => {
                console.log(data);
                if(data==[])
                {
                   history.push('/')    
                }
                setQuestions(data["questions"]);
                setLoading(false);
            });
        }

    }, [id])
    console.log(questions.length)

    return (
        <BasePage>
         {
             (!loading) ?(
                 <>
                 {
            (questions.length>0)?(
                questions.map((question) => (
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
                    )
                ) ):(
                    <h1 style={{textAlign:"center",marginTop:"200px"}}>No questions found,Try some other tags</h1>
                )
                }
                </>
             ):(
                <div style={{position:"fixed",top:"50%",left:"50%"}}><PropagateLoader color="#3C4A9C" size={10} /></div>
             )
         }
        </BasePage>

    );
}

export default Search;
