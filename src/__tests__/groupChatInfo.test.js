import React from 'react';
import AddUsers from "../Home/chatView/groupChatInfo/AddUsers";
import ChatOptions from "../Home/chatView/groupChatInfo/ChatOptions";
import {mount, shallow} from 'enzyme';
import {BrowserRouter as Router} from "react-router-dom";

jest.mock("../Home/chatView/groupChatInfo/apiCalls");

describe("groupChatInfo",() => {
   describe("edit",() => {
      it("a",() => {

      })
   });
   describe("addUsers",() => {
      const props = {
         gcid: 2
      }
      it("check title",async () => {
         const addUsers = await shallow(<AddUsers {...props}/>)
         expect(addUsers.find("ModalHeader").find("h2").text()).toEqual("Benutzer hinzufügen")
         addUsers.unmount();
      })
      it("has SelectUsers",async() => {
         const addUsers = await mount(<AddUsers {...props}/>)
         const selectUsers = addUsers.find("SelectUsers")
         expect(typeof selectUsers).toEqual("object")
         expect(selectUsers.state("showOnlySelected")).toEqual(false)
         addUsers.unmount();
      });
      it("loadUsers",async () => {
         const addUsers = await mount(<AddUsers {...props}/>)
         const selectUsers = addUsers.find("SelectUsers")

         expect(addUsers.find("ul.selectUsers")).toHaveLength(1);

         const res = await selectUsers.invoke("loadUsers")("",0)
         expect(res[0].username).toEqual("aaa");

         await addUsers.update();
         expect(addUsers.find("ul.selectUsers").html()).toContain("Nichts gefunden!");

         addUsers.unmount();
      });
      it("submitUsers",async () => {
         const addUsers = await mount(<AddUsers {...props}/>)
         const selectUsers = addUsers.find("SelectUsers")

         const res = await selectUsers.invoke("onNext")({users: [
            {
               uid: 10,
               username: "aaa"
            }
         ]})
         expect(res).toEqual(undefined);

         addUsers.unmount();
      });
   });
   describe("chatOptions",() => {
      const props_admin = {
         gcid: 2,
         memberSelf: {
            isAdmin: true
         }
      }
      const props_notAdmin = {
         gcid: 2,
         memberSelf: {
            isAdmin: false
         }
      }
      beforeEach(() => {
         global.console = {
            warn: jest.fn(),
            log: jest.fn()
         }
      });
      it("is admin",async () => {
         const chatOptions = await mount(<Router><ChatOptions {...(props_admin)}/></Router>)
         expect(chatOptions.html()).toContain("Benutzer hinzufügen")
         expect(chatOptions.html()).toContain("admin status entfernen")
         expect(chatOptions.html()).toContain("Chat verlassen")
         const list = chatOptions.find("ul.chatOptions").getDOMNode();
         expect(typeof list).toEqual("object")
         expect(list.children.length).toEqual(3);
         for(let i=0;i<list.children.length;i++){
            expect(list.children[i].nodeName).toEqual("li".toUpperCase());
         }
      })
      it("is not admin",async () => {
         const chatOptions = await mount(<Router><ChatOptions {...(props_notAdmin)}/></Router>)
         expect(chatOptions.html()).not.toContain("Benutzer hinzufügen")
         expect(chatOptions.html()).not.toContain("admin status entfernen")
         expect(chatOptions.html()).toContain("Chat verlassen")
      })
      it("addUsers toBe a link element",async () => {
         const chatOptions = await mount(<Router><ChatOptions {...(props_admin)}/></Router>)
         const element = chatOptions.find("ul.chatOptions .addUsers").getDOMNode();
         expect(element.children[0].nodeName).toEqual("A")
         expect(element.children[0].getAttribute("href")).toContain("/addUsers")
      });
      it("test removeSelfAdmin",async () => {
         const chatOptions = await mount(<Router><ChatOptions {...(props_admin)}/></Router>)
         const element = chatOptions.find("ul.chatOptions .removeSelfAdmin").getDOMNode()
         element.click()
         await new Promise((resolve, reject) => {
            setTimeout(() => {resolve()},1000)
         })
         //expect(console.log).toHaveBeenCalledWith("removeSelfAdmin clicked");
      })
      it("test leaveChat",async () => {

      })
   });
   describe("groupChatInfo",() => {
      it("a",() => {

      })
   });
   describe("useroptions",() => {
      it("a",() => {

      })
   });
});