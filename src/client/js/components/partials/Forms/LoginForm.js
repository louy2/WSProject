import { Component } from 'react';
import {
  Form, Icon, Input, Button, Alert
} from 'antd';


import { login } from 'Utils/api';

class LoginForm extends Component {

  state = {
    loading:false,
    error: null,
  }

  handleSubmit = (e) => {
    const { login } = this;
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        login(values)
      }
    });
  }

  login = async(formdata) => {

    this.setState({loading: true});

    let res = await login(formdata)

    //Auth successful
    if(res.token){
      localStorage.setItem('encore-jwt', res.token)
      this.setState({error: null})
      //TODO redirect to user page
    }
    else{
      this.setState({error: 'Incorrect email/password'})
    }
    
    this.setState({loading: false});
  }

  render(){
    const { getFieldDecorator } = this.props.form;
    const { handleSubmit } = this;
    const { handleFormChange } = this.props;
    const { loading, error } = this.state;
    return(
       <Form onSubmit={handleSubmit} className="login-form">
        {
          error &&
          <Alert message={error} type="warning" />
        }
        <Form.Item>
          {getFieldDecorator('username', {
            rules: [{ required: true, message: 'Please input your email!' }],
          })(
            <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Email" />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please input your Password!' }],
          })(
            <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
          )}
          <a className="login-form-forgot" href="">Forgot password</a>
        </Form.Item>
        <Form.Item>
          <div>
            <Button type="primary" htmlType="submit" className="login-form-button" loading={loading}>
              Log in
            </Button>
          </div>
          Or <a onClick={() => handleFormChange('register')}>register now!</a>
        </Form.Item>
      </Form>
    )
  }
}

export default Form.create({ name: 'login' })(LoginForm);