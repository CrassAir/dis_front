import React from 'react';
import {Box, Button, Card, CardMedia, Paper, TextField} from "@mui/material";
import {Form} from "antd";
import {useAppDispatch} from "../../hooks/redux";
import {login} from "../../store/actions/auth";
import Logo from "../../assets/logo_footer.png";
import {IAuth} from "../../models/IAuth";

const LoginPage: React.FC = () => {
    const dispatch = useAppDispatch()
    const [form] = Form.useForm();

    return (
        <Box className={'login-back-image'}>
            <Box className={'login-container'}>
                <Paper sx={{p: '20px 50px 10px 50px'}} className={'login-paper'}>
                    <Card elevation={0} sx={{maxWidth: 230, p: 1}}>
                        <CardMedia
                            component="img"
                            height="100"
                            image={Logo}
                            alt="dis logo"
                        />
                    </Card>
                    <div style={{width: 400}}>
                        <Form
                            form={form}
                            onFinish={(values: IAuth) => {
                                dispatch(login(values))
                                form.resetFields()
                                // console.log(values)
                            }}
                            className={'login-paper'}
                            initialValues={{username: '', password: ''}}
                        >
                            <Form.Item
                                name="username"
                                required={true}
                                // rules={[{ required: true, message: 'Please input your username!' }]}
                            >
                                <TextField
                                    required
                                    label="Логин"
                                    // variant="standard"
                                    fullWidth
                                />

                            </Form.Item>
                            <Form.Item
                                name="password"
                                required={true}
                                // rules={[{ required: true, message: 'Please input your username!' }]}
                            >
                                <TextField
                                    required
                                    label="Пароль"
                                    type="password"
                                    fullWidth
                                    // variant="standard"
                                />
                            </Form.Item>
                            <Form.Item>
                                <Button type={'submit'} variant={'contained'} sx={{float: 'right'}}>Войти</Button>
                            </Form.Item>
                        </Form>
                    </div>
                </Paper>
            </Box>
        </Box>
    );
};

export default LoginPage;