import React from "react";
import Home from "../Home.jsx";
import renderer from "react-test-renderer";
import { MemoryRouter } from "react-router";

test('Home loads without failing', () => {
    const component = renderer.create(
        <MemoryRouter>
            <Home/>
        </MemoryRouter>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});
