import React, { useContext } from "react";
import { useEffect, useState } from "react";
import { useHistory } from 'react-router-dom';
import { config } from "../../config";
import AdminBasePage from "./AdminBasePage";
import { AdminContext } from "../../Context/Context";
import GridContainer from "../../components/GridContainer";
import Info from "../../components/Info";
import MiniAnswerCard from "../../components/MiniAnswerCard";
import AdminMiniAnswerCard from "../../components/AdminMiniAnswerCard";


const AdminAllAnswers = () => {
    const [answers, setAnswers] = useState([]);
    const history = useHistory();
    const { admin } = useContext(AdminContext);
    const removeAnswers = (id) => {
        const userData = JSON.parse(localStorage.getItem('userData'))
        fetch(`${config.apiUrl}/api/delete/answer?answerId=${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${userData.token}`,
            }
        })
            .then((data) => {

                const userData = JSON.parse(localStorage.getItem('userData'))
                fetch(`${config.apiUrl}/api/answers`, {
                    headers: {
                        Authorization: `Bearer ${userData.token}`,
                    },
                })
                    .then((res) => res.json())
                    .then((data) => {
                        setAnswers(data["answers"]);
                    });
            })
            .catch((err) => console.log(err));
    }

    useEffect(() => {
        if (localStorage.getItem("userData") === null) {
            history.push('/login')
        } else {
            const userData = JSON.parse(localStorage.getItem('userData'))
            fetch(`${config.apiUrl}/api/answers`, {
                headers: {
                    Authorization: `Bearer ${userData.token}`,
                },
            })
                .then((res) => res.json())
                .then((data) => {
                    setAnswers(data["answers"]);
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
                                answers.length !== 0 ? <GridContainer>
                                    {answers.map((answer) => {
                                        return (
                                            <AdminMiniAnswerCard
                                                title={answer.question.title}
                                                body={answer.body}
                                                key={answer._id}
                                                id={answer._id}
                                                postedOn={answer.postedOn}
                                                questionId={answer.question._id}
                                                getUserAnswers={removeAnswers}

                                            />

                                        );
                                    })}
                                </GridContainer> : <Info msg="No Answers are available" type="info"></Info>
                            }

                        </AdminBasePage>
                    ) : (<h2 style={{ marginTop: "20px", padding: "20px", textAlign: "center" }}>Only admins can access this page</h2>)
            }
        </>
    )
}

export default AdminAllAnswers;