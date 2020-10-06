import React, { Component } from 'react';
import AddUsers from "../Home/chatView/groupChatInfo/AddUsers";
import { shallow,mount } from 'enzyme';

jest.mock("../Home/chatView/groupChatInfo/apiCalls");

describe("groupChatInfo",() => {
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

      });
   });
});