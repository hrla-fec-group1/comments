import React, {Component} from 'react';
import List from "./List.jsx";
// const App = ({first,last}) => {
//   return (<div>Hello from Component, {first} {last}</div>)
// }
// export default App;

class App extends Component{
  constructor(props){
    super(props);
    this.state={
      data: props.data
    }
  }
  render(){
    return(
        <List data={this.state.data} />
    )
  }
}
export default App;
