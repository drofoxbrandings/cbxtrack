import { Button, FormControl, Link, TextField } from '@mui/material'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import React from 'react'
import * as Yup from 'yup'
import useStyles from './FormStyles'

const LoginForm = ({ formId, formBtnName }) => {
    const classes = useStyles()
    return (
        <div>
            <Formik
                initialValues={{
                    username: '',
                    password: ''
                }}
                validationSchema={Yup.object().shape({
                    username: Yup.string().required('Please enter username').email("Invalid username"),
                    password: Yup.string().required('Please enter password')
                })}
                onSubmit={values => {
                    alert(JSON.stringify(values))
                }}
            >
                {formikProps => (
                    <Form onSubmit={formikProps.handleSubmit} id={formId}>
                        <FormControl fullWidth className={classes.formField}>
                            <Field
                                as={TextField}
                                name="username"
                                type="email"
                                label="Username"
                                variant="standard"
                                InputLabelProps={{
                                    style: {
                                        color: '#fff'
                                    }
                                }}
                            ></Field>
                            <ErrorMessage className={classes.errorMsg} name="username" component="span"></ErrorMessage>
                        </FormControl>
                        <FormControl fullWidth className={classes.formField}>
                            <Field
                                as={TextField}
                                name="password"
                                type="password"
                                label="Password"
                                variant="standard"
                                InputLabelProps={{
                                    style: {
                                        color: '#fff'
                                    }
                                }}
                            ></Field>
                            <ErrorMessage className={classes.errorMsg} name="password" component="span"></ErrorMessage>
                        </FormControl>
                        <FormControl fullWidth className={classes.formField}>
                            <Button variant="contained" color="primary">{formBtnName}</Button>
                        </FormControl>
                        <div className={classes.cb_link}>
                            <Link href="/forgotPassword" underline="hover">
                                Forgot password
                            </Link>
                        </div>
                    </Form>
                )}
            </Formik>
        </div >
    )
}

export default LoginForm
