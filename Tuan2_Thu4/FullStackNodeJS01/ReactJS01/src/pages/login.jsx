import React, { useContext } from 'react';
import { Button, Col, Divider, Form, Input, notification, Row } from 'antd';
import { loginApi } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../components/context/AuthContext';
import { ArrowLeftOutlined } from '@ant-design/icons';

const LoginPage = () => {
    const navigate = useNavigate();
    const { setAuth } = useContext(AuthContext);
    
    const onFinish = async (values) => {
        const { email, password } = values;
        
        const res = await loginApi(email, password);
        
        if (res && res.EC === 0) {
            localStorage.setItem("access_token", res.DT.access_token)
            notification.success({
                message: "LOGIN USER",
                description: "Success"
            });
            setAuth({
                isAuthenticated: true,
                user: {
                    email: res?.DT?.user?.email ?? "",
                    name: res?.DT?.user?.name ?? ""
                }
            })
            navigate("/");
        } else {
            notification.error({
                message: "LOGIN USER",
                description: res?.EM ?? "error"
            })
        }
    };
    
    return (
        <Row justify={"center"} style={{ marginTop: "30px" }}>
            <Col xs={24} md={16} lg={8}>
                <fieldset style={{
                    padding: "15px",
                    margin: "5px",
                    border: "1px solid #ccc",
                    borderRadius: "5px"
                }}>
                    <legend>Đăng Nhập</legend>
                    <Form
                        name="basic"
                        onFinish={onFinish}
                        autoComplete="off"
                        layout="vertical"
                    >
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your email!',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        
                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your password!',
                                },
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>
                        
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Login
                            </Button>
                        </Form.Item>
                    </Form>
                    <Link to={"/"}><ArrowLeftOutlined /> Quay lại trang chủ</Link>
                    <Divider />
                    <div style={{ textAlign: "center" }}>
                        Chưa có tài khoản? <Link to={"/register"}>Đăng ký tại đây</Link>
                    </div>
                </fieldset>
            </Col>
        </Row>
    );
};

export default LoginPage;