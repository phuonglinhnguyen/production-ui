import React from "react";
import { shallow, mount } from "enzyme";
import sinon from "sinon";
import ButtonActions from "./button_actions";

describe("TEST COMPONENT <ButtonActions />", () => {
  it("State default", () => {
    const wrapper = shallow(<ButtonActions />);
    expect(wrapper.type()).toEqual("div");
  });

  it("State when ajax call", () => {
    const wrapper = shallow(<ButtonActions />);
    wrapper.setProps({ is_saving: true });
    expect(wrapper.find("RaisedButton").children().length).toEqual(0);
  });
});
