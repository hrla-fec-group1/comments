import React, {Component} from 'react';
import ListEntry from "./ListEntry.jsx"
class List extends Component{
  constructor(props){
    super(props);
    this.state={
      items:props.data,
    }
  }
  render(){
    return(
      <div>
      {this.state.items.map(item =>(
        <ListEntry item={item} />
      ))}
      </div>
    )
  }
}
export default List;
