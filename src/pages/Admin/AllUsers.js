import React, { useContext, useState, useEffect } from "react";
import GridContainer from "../../components/GridContainer";
import Grid from '@material-ui/core/Grid';
import UserCard from "../../components/UserCard";
import { AdminContext } from "../../Context/Context";
import AdminBasePage from "./AdminBasePage";
import { config } from "../../config";

const AllUsers = () => {
    const { admin } = useContext(AdminContext);
    const [users, setUsers] = useState([])
    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('userData'))
        fetch(`${config.apiUrl}/api/user/getAll`, {
            headers: {
                Authorization: `Bearer ${userData.token}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setUsers(data.users);
            });

    }, [])

    const removeUser = (id) => {
        const userData = JSON.parse(localStorage.getItem('userData'))
        fetch(`${config.apiUrl}/api/user/delete?id=${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${userData.token}`,
            }
        })
            .then(() => {
                const newUser = users.filter(function (person) {
                    return person._id !== id
                })
                setUsers(newUser)
            });
    }
    return (
        <>
            {
                (admin) ? (
                    <AdminBasePage>
                        {/* <GridContainer> */}
                        <Grid container spacing={2}>
                            {
                                users.map((user) => {
                                    return (
                                        <Grid item xs={6}>
                                            <UserCard name={user.name} email={user.email} image={user.profile_pic_url} role={user.role} removeUser={removeUser} id={user._id}></UserCard>
                                        </Grid>
                                    )
                                })
                            }
                        </Grid>
                        {/* </GridContainer> */}
                    </AdminBasePage>
                ) : (<h2 style={{ marginTop: "20px", padding: "20px", textAlign: "center" }}>Only admins can access this page</h2>)
            }
        </>
    )
}

export default AllUsers;