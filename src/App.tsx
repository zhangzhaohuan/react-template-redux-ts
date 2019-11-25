import * as React from 'react';
import { BrowerRouter as Router, Route } from 'react-router-dom';

export interface IAppProps {
}

export default class App extends React.Component<IAppProps> {
  public render() {
    return (
      <div>
        <Router>

          <Route path='/login' ></Route>
  
        </Router>
      </div>
    );
  }
}
