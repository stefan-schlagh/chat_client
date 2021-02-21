import React from 'react';
import { shallow } from 'enzyme';
import ForgotPassword from "../../Auth/ForgotPassword";

jest.mock("../../Auth/apiCalls")

describe('test forgotPassword',() => {
   it('check title',async () => {
      const forgotPassword = await shallow(<ForgotPassword/>);
      expect(forgotPassword.find("h1").text()).toEqual("Passwort zurücksetzen")
      forgotPassword.unmount();
   });
   it('username error - too short',async () => {
      const forgotPassword = await shallow(<ForgotPassword/>);
      forgotPassword.setState({username: 'ab'});
      const form = forgotPassword.find('form').first();
      form.simulate('submit',{preventDefault: () => {}});
      await forgotPassword.update();
      // error message should be there
      expect(forgotPassword.state('error')).toEqual(true);
      expect(forgotPassword.state('errorMessage')).toEqual("Benutzername zu kurz")
      forgotPassword.unmount();
   });
   it('username error - too long',async () => {
      const forgotPassword = await shallow(<ForgotPassword/>);
      forgotPassword.setState({username: '0123456789012345678901234567890123456789'});
      const form = forgotPassword.find('form').first();
      form.simulate('submit',{preventDefault: () => {}});
      await forgotPassword.update();
      // error message should be there
      expect(forgotPassword.state('error')).toEqual(true);
      expect(forgotPassword.state('errorMessage')).toEqual("Benutzername zu lang")
      forgotPassword.unmount();
   });
   it('username error - format not valid',async () => {
      const forgotPassword = await shallow(<ForgotPassword/>);
      forgotPassword.setState({username: 'abc😄'});
      const form = forgotPassword.find('form').first();
      form.simulate('submit',{preventDefault: () => {}});
      await forgotPassword.update();
      // error message should be there
      expect(forgotPassword.state('error')).toEqual(true);
      expect(forgotPassword.state('errorMessage')).toEqual("ungültiges Format")
      forgotPassword.unmount();
   });
   it('email error - too short',async () => {
      const forgotPassword = await shallow(<ForgotPassword/>);
      forgotPassword.setState({username: 'username',email: ''});
      const form = forgotPassword.find('form').first();
      form.simulate('submit',{preventDefault: () => {}});
      await forgotPassword.update();
      // error message should be there
      expect(forgotPassword.state('error')).toEqual(true);
      expect(forgotPassword.state('errorMessage')).toEqual("E-Mail Addresse benötigt")
      forgotPassword.unmount();
   });
   it('success',async () => {
      const forgotPassword = await shallow(<ForgotPassword/>);
      forgotPassword.setState({username: 'username',email: 'email@email.com'});
      const form = forgotPassword.find('form').first();
      form.simulate('submit',{preventDefault: () => {}});
      await forgotPassword.update();
      expect(forgotPassword.state('error')).toEqual(false);
      expect(forgotPassword.state('errorMessage')).toEqual('');
      expect(forgotPassword.state('sentMail')).toEqual(true);
      forgotPassword.unmount();
   });
   it('user not existing',async () => {
      const forgotPassword = await shallow(<ForgotPassword/>);
      forgotPassword.setState({username: 'username',email: 'email@email.com'});
      const form = forgotPassword.find('form').first();
      form.simulate('submit',{preventDefault: () => {}});
      await forgotPassword.update();
      // error message should be there
      expect(forgotPassword.state('error')).toEqual(true);
      expect(forgotPassword.state('errorMessage')).toEqual('Dieser Benutzer scheint nicht zu existieren');
      expect(forgotPassword.state('sentMail')).toEqual(false);
      forgotPassword.unmount();
   });
   it('other error',async () => {
      const forgotPassword = await shallow(<ForgotPassword/>);
      forgotPassword.setState({username: 'username',email: 'email@email.com'});
      const form = forgotPassword.find('form').first();
      form.simulate('submit',{preventDefault: () => {}});
      await forgotPassword.update();
      // error message should be there
      expect(forgotPassword.state('error')).toEqual(true);
      expect(forgotPassword.state('errorMessage')).toEqual('ein Fehler ist aufgetreten');
      expect(forgotPassword.state('sentMail')).toEqual(false);
      forgotPassword.unmount();
   });
});