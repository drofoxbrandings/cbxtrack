import { Grid } from '@mui/material'
import { Paper } from '@mui/material'
import React from 'react'
import LoginForm from '../Forms/LoginForm'
import useStyles from './AuthStyles'
import { makeStyles } from '@mui/styles';



const Login = () => {
    const classes = useStyles()
    return (
        <React.Fragment>
            <Grid container className={classes.container_centered_item}>
                <Grid item xs={12} sm={6} md={6} lg={3}>
                    <Paper className={classes.loginBox} elevation="5">
                        <div className={classes.overlay}></div>
                        <div className={classes.boxTitle}>
                            <h1>Login</h1>
                        </div>
                        <div className={classes.loginForm}>
                            <LoginForm formId="loginForm" formBtnName="Login" />
                        </div>
                    </Paper>
                </Grid>
            </Grid>
        </React.Fragment>
    )
}

export default Login
