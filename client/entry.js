import App from './App';
import React from 'react';
import { render } from 'react-dom';

if (module.hot) {
  module.hot.accept();
}

document.addEventListener('DOMContentLoaded', () => {
  const socket = io();
  socket.on('message', msg => {
    console.log(msg);
  });

  const root = document.querySelector('#root');
  render(<App />, root);
});
