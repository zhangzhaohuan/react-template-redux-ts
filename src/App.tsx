import * as React from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import Loadable from "react-loadable";
// import 'antd/dist/antd.css';
// import 'axxd/dist/axxd.css';


function Loading() {
  return <div>loading</div>
}

const Home = Loadable({
  loader: () => import("./component/home"),
  loading: Loading
});
const Login = Loadable({
  loader: () => import("./component/login"),
  loading: Loading
});
export interface IAppProps {
}

export default class App extends React.Component<IAppProps> {
  public render() {
    return (
      <div>
        <Router>
          <ul>
            <li><Link to='/login'>login</Link></li>
            <li><Link to='/'>home</Link></li>
          </ul>
          <Switch>
            <Route path='/login' component={Login} ></Route>
            <Route path='/' exact component={Home} ></Route>
          </Switch>
        </Router>
      </div>
    );
  }
}
