import React from 'react';
import { Button, Col, Divider, Form, Input, notification, Row } from 'antd';
import { createUserApi } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { MESSAGES, VALIDATION_MESSAGES } from '../constants';

const RegisterPage = () => {
    const navigate = useNavigate();
    
    const onFinish = async (values) => {
        const { name, email, password } = values;
        
        const res = await createUserApi(name, email, password);
        
        if (res) {
            notification.success({
                message: "CREATE USER",
                description: MESSAGES.REGISTER_SUCCESS
            });
            navigate("/login");
        } else {
            notification.error({
                message: "CREATE USER",
                description: MESSAGES.ERROR
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
                    <legend>Đăng Ký Tài Khoản</legend>
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
                                    message: VALIDATION_MESSAGES.REQUIRED_EMAIL,
                                },
                                {
                                    type: 'email',
                                    message: VALIDATION_MESSAGES.INVALID_EMAIL,
                                }
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
                                    message: VALIDATION_MESSAGES.REQUIRED_PASSWORD,
                                },
                                {
                                    min: 6,
                                    message: VALIDATION_MESSAGES.PASSWORD_MIN_LENGTH,
                                }
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        
                        <Form.Item
                            label="Name"
                            name="name"
                            rules={[
                                {
                                    required: true,
                                    message: VALIDATION_MESSAGES.REQUIRED_NAME,
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>
                    <Link to={"/"}><ArrowLeftOutlined /> Quay lại trang chủ</Link>
                    <Divider />
                    <div style={{ textAlign: "center" }}>
                        Đã có tài khoản? <Link to={"/login"}>Đăng nhập</Link>
                    </div>
                </fieldset>
            </Col>
        </Row>
    );
};

export default RegisterPage;