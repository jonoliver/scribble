import React from 'react';
import { mount } from 'enzyme';
import Game from '.';
import renderer from 'react-test-renderer';

const worker = {
  onMessage: () => {},
  postMessage: () => {},
}

it('renders', () => {
  const tree = renderer
    .create(<Game {...{ worker }} />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});