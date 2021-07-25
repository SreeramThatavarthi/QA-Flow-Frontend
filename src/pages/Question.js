import React, { useState, useEffect, useRef } from "react";
import BasePage from "./BasePage";
import { Button } from "@material-ui/core";
import { config } from "../config";
import { useHistory, useParams, useLocation } from "react-router-dom";
import QuestionCard from "../components/QuestionCard";
import TextEditor from "../components/TextEditor"
import AnswerCard from "../components/AnswerCard";
import Container from "react-bootstrap/Container";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

function Question(props) {
    let { id } = useParams();
    const inputFile = useRef(null)
    const history = useHistory();
    const location = useLocation()
    let ansTextBox = location.state === undefined ? '' : location.state.body
    let boolTextBox = location.state === undefined ? false : true
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [file, setFile] = useState('');
    // const [showTextArea, setShowTextArea] = useState(boolTextBox);
    const [ansText, setAnsText] = useState(ansTextBox)
    var showTextArea=boolTextBox;
    const uploadDoc = (e) => {
        console.log(e.target.files[0])
        setFile('')
        var FileSize = e.target.files[0].size / 1024 / 1024; // in MiB
        if (FileSize > 5) {
            toast.error('Max file size is 5MB ❕', {
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
        else {
            var reader = new FileReader();
            reader.readAsDataURL(e.target.files[0]);
            reader.onload = function () {
                console.log(reader.result)
                setFile(reader.result);
            };
        }
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
    const updateAnswer = (answer) => {
        console.log(answer);
        let answers_ = answers.map((a) => {
            if (a._id === answer._id) {
                return answer;
            } else {
                return a;
            }
        });
        setAnswers(answers_);
    };
    const submitAns = () => {
        const userData = JSON.parse(localStorage.getItem('userData'))
        fetch(`${config.apiUrl}/api/add/answer`, {
            body: JSON.stringify({
                postedBy: `${userData.user._id}`,
                questionId: questions[0]._id,
                body: ansText,
                file: file
            }),
            method: "POST",
            headers: {
                Authorization: `Bearer ${userData.token}`,
                "Content-Type": "application/json",
            },
        }).then((res) => {
            return res.json();
        }).then((data) => {
            showTextArea=false;
            setAnsText('')
            toast.success('Answer Posted 👍🏻', {
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            getAllAnswers()
        })
    }
    function getAllAnswers() {
        const userData = JSON.parse(localStorage.getItem("userData"));
        fetch(`${config.apiUrl}/api/question?questionId=${id}`, {
            headers: {
                Authorization: `Bearer ${userData.token}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setQuestions([data["question"]]);
                setAnswers(data["answers"]);
            });
    }
    function handleUpdateAns() {
        const userData = JSON.parse(localStorage.getItem('userData'))
        fetch(`${config.apiUrl}/api/edit/answer`, {
            body: JSON.stringify({
                answerId: `${location.state.id}`,
                body: ansText,
            }),
            method: "PUT",
            headers: {
                Authorization: `Bearer ${userData.token}`,
                "Content-Type": "application/json",
            },
        }).then((res) => {
            setAnsText('')
            history.push({
                pathname: "/activity",
                state: { pos: 1 },
            });
        });
    }

    useEffect(() => {
        getAllAnswers()
    }, []);
    return (
        <BasePage>
            <ToastContainer position="top-center" />
            {questions.map((question) => {
                return (
                    <QuestionCard
                        title={question.title}
                        body={question.body}
                        likes={question.upVotes}
                        dislikes={question.downVotes}
                        postedOn={question.postedOn}
                        file={question.file}
                        tags={question.tags}
                        name={question.postedBy.name}
                        key={question._id}
                        id={question._id}
                        profilePic={question.postedBy.profile_pic_url}
                        updateQuestion={updateQuestion}
                    />
                );
            })}
            <Container style={{ marginTop: "20px", marginBottom: "20px", paddingRight: "20px" }}>
                <Row>
                    <Col sm={8}>
                        {
                            answers.length === 0 ? <h5>Be the first one to Answer 👉🏻</h5> : <h5>{showTextArea ? "Add Answer" : `Answers 👇🏻`}</h5>
                        }
                    </Col>
                    <Col sm={4}>
                        {!showTextArea ? (
                            <button
                                type="button"
                                class="btn btn-primary"
                                style={{ float: "right" }}
                                onClick={() => {showTextArea=showTextArea?false:true}}
                            >
                                <strong> Add Answer  <i class="bi bi-plus-circle" style={{ fontSize: "15px" }}></i></strong>
                            </button>
                        ) : (
                            <>
                                <button
                                    type="button"
                                    class="btn btn-danger"
                                    style={{ float: "right" }}
                                    onClick={() => {showTextArea=showTextArea?false:true}}
                                >
                                    <strong>Close <i class="bi bi-x-circle" style={{ fontSize: "15px" }}></i> </strong>
                                </button>
                                <button
                                    type="button"
                                    class="btn btn-success"
                                    style={{ float: "right", marginRight: "27px" }}
                                    onClick={location.state === undefined ? submitAns : handleUpdateAns}
                                >
                                    <strong>{location.state === undefined ? "Submit Ans" : "Update Ans"} <i class="bi bi-check-square" style={{ fontSize: "15px" }}></i></strong>
                                </button>
                            </>
                        )}
                    </Col>
                </Row>
            </Container>

            {showTextArea ? (
                <>
                    <TextEditor setText={setAnsText} text={ansText}></TextEditor>
                    <Button
                        onClick={() => {
                            inputFile.current.click();
                        }}
                        color="primary"
                        className="submit-btn"
                        variant="contained"
                        style={{ color: "white", textTransform: "none", maxWidth: "400px" }}
                    >
                        <b>Upload File</b>
                    </Button>
                    {
                        file !== '' ?
                            <>
                                < span style={{ marginTop: "190px" }}> <b>File Uploaded 👍🏻</b></span>
                            </>
                            :
                            null
                    }

                </>

            ) : (
                <div className="p-2">
                    {answers.map((answer) => {
                        console.log(answer)
                        return (
                            <AnswerCard
                                body={answer.body}
                                likes={answer.upVotes}
                                dislikes={answer.downVotes}
                                postedOn={answer.postedOn}
                                name={answer.postedBy.name}
                                profilePic={answer.postedBy.profile_pic_url}
                                key={answer._id}
                                id={answer._id}
                                file={answer.file}
                                updateAnswer={updateAnswer}
                            />

                        );
                    })}
                </div>
            )}
            <input type='file' id='file' ref={inputFile} style={{ display: 'none' }} onChange={uploadDoc} />
        </BasePage>
    );
}

export default Question;
