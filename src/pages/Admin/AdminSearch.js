import { useEffect, useState } from 'react';
import React from "react";
import AdminBasePage from "../Admin/AdminBasePage";
import { useHistory, useParams } from 'react-router-dom';
import { config } from "../../config";
import AdminQuestionCard from '../../components/AdminQuestionCard';

function AdminSearch() {
    let { id } = useParams();
    console.log(id);
    const history = useHistory();
    const [questions, setQuestions] = useState();
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
            setQuestions(data["questions"]);
        });

    }, [id])

    return (
       
        <AdminBasePage>
            {
            (questions!=null)?(
            questions.map((question) => {
                return (
                    <AdminQuestionCard
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
                })
            ): (<h1 style={{textAlign:"center",marginTop:"2000px"}}>No questions found,Try some other tags</h1>)
        }
        </AdminBasePage>

    );
}

export default AdminSearch;
