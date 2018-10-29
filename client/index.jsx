import React, { Component, Fragment } from "react";
import { render } from "react-dom";
import request from "superagent";
import $ from 'jquery';
import Popup from 'reactjs-popup'
import axios from 'axios'

class InfiniteUsers extends Component {
  constructor(props) {
    super(props);

    // Sets up our initial state
    this.state = {
      error: false,
      hasMore: true,
      isLoading: false,
      page: 0,
      users: [],
      tmpUser: [],
      currentUser:[],
      x:0,
      y:0,
      replyMessage:"",
    };
    this.loadUsers = this.loadUsers.bind(this)
    this.hov = this.hov.bind(this)
    this.render = this.render.bind(this)
    this.hello = this.hello.bind(this)
    this.togglePopup = this.togglePopup.bind(this)
    // Binds our scroll event handler
    window.onscroll = () => {
      const {
        loadUsers,
        state: {
          error,
          isLoading,
          hasMore,
        },
      } = this;

      // Bails early if:
      // * there's an error
      // * it's already loading
      // * there's nothing left to load
      if (error || isLoading || !hasMore) return;

      // Checks that the page has scrolled to the bottom
      this.handleMouseMove = this.handleMouseMove.bind(this)
      console.log(window.innerHeight,window.scrollY,document.documentElement.offsetHeight)
      if (window.innerHeight + window.scrollY
        === document.documentElement.offsetHeight) {
          console.log('bigger')
          this.setState({
            page: this.state.page +1
          })
        loadUsers();
      }
    };
  }
  handleMouseMove(event) {
    console.log(event.clientX,event.clientY)
  }
  componentDidMount() {
    // Loads some users on initial load
    var context = this
    axios.get('/data').then((response)=>{
      context.setState({
        users: response.data,
      },function(){
        context.setState({
          tmpUser: context.state.users.slice(0+this.state.page*10,10+this.state.page*10)
        },function(){
          context.setState({
            currentUser: [...context.state.currentUser,...context.state.tmpUser]
          })
        })
      })
    });
  }

  loadUsers(){
    var context = this
    axios.get('/data').then((response)=>{
      context.setState({
        users: response.data,
      },function(){
        context.setState({
          tmpUser: context.state.users.slice(0+this.state.page*10,10+this.state.page*10)
        },function(){
          context.setState({
            currentUser: [...context.state.currentUser,...context.state.tmpUser]
          })
        })
      })
    });

          // Merges the next users into our existing users
          context.setState({
            // Note: Depending on the API you're using, this value may
            // be returned as part of the payload to indicate that there
            // is no additional data to be loaded
            hasMore: (context.state.currentUser.length < 1000),
            isLoading: false
          });
  }
  hov(index){
    document.getElementsByClassName('mybtn')[index].style.visibility = 'visible'
  }
  off(index){
    document.getElementsByClassName('mybtn')[index].style.visibility = 'hidden'
  }
  show(index){
    document.getElementsByClassName('popno').style.visibility = 'visible'
  }
  hello(e,index){
    e.preventDefault()
    var context = this
    console.log(index,document.getElementsByClassName('message'))
    axios.patch('/data', {
                'replies':[document.getElementsByClassName('message')[0].value],
                'index': this.state.currentUser[index]._id
            })
            .then((response) => {
              axios.get('/data').then((myResponse)=>{
                context.setState({
                  users: myResponse.data,
                },function(){
                  console.log(context.state.users,context.state.page)
                  context.setState({
                    tmpUser: context.state.users.slice(0,10+this.state.page*10)
              },function(){
                context.setState({
                  currentUser: [...context.state.tmpUser]
                },function(){
                  console.log(context.state.currentUser)
                })
              })
                })
              })
            });
    document.getElementsByClassName('popno')[0].style.visibility = 'hidden'
  }
  togglePopup(index) {
    if(document.getElementsByClassName('hi')[index].style.visibility === "visible"){
      document.getElementsByClassName('hi')[index].style.visibility = "hidden"
    } else{
      document.getElementsByClassName('hi')[index].style.visibility = "visible"
    }
  }

  render() {
    const {
      error,
      hasMore,
      isLoading,
      users,
      tmpUser,
      currentUser
    } = this.state;

    return (
      <div className="container">
        {currentUser.map((user,index) => (
          <div onMouseEnter={()=>this.hov(index)}
    onMouseLeave={()=>this.off(index)}>

            <div id='myid' style={{ display: 'flex' }}>
            <Popup trigger={<img
              className='imgId'
              src={user.picture}
            />}
            position="bottom left"
            on='hover'>
            <div>
            <img
              className='lgImg'
              src={user.picture}
            />
            <p className="popup"> {user.user} </p>
            <div>
            <img
              className='follow'
              src='http://cdn.onlinewebfonts.com/svg/img_529951.png'
            />
            <span> 50</span>
            </div>
            <button className="myBtn"> Follow</button>
            </div>
            </Popup>
              <div>
              <Popup trigger={<span className="h2T">{user.user}</span>}
              position="bottom left"
              on='hover'>
              <div>
              <img
                className='lgImg'
                src={user.picture}
              />
              <p className="popup">{user.user}</p>
              <div>
              <img
                className='follow'
                src='http://cdn.onlinewebfonts.com/svg/img_529951.png'
              />
              <span> 50</span>
              </div>
              <button className="myBtn"> Follow</button>
              </div>
              </Popup>
              <span className="verylight">at</span>
              <span className="point">{user.pointInSong}</span>
              <span className="time">{user.time}</span>
                <div>
                <span className='content'> {user.content}</span>
                <span>
                <Popup className="popno" trigger={<button className='mybtn' onClick={()=>this.show(index)}> Reply </button>}
                  on='click'
                  position='left center'>

                  <div><form>
                                      Message:<br></br>
                                      <input onChange={this.change} className="message" type="text" name="firstname"></input><br></br>
                                      <button onClick={(e)=>this.hello(e,index)}>submit</button>
                                      </form></div>
                </Popup>
                </span>
                </div><br></br>
                <div className='replyDiv'>
                {user.replies.map((reply) => (
                  <div style={{display:'flex'}}>
                  <Popup trigger={<img
                    className='smImg'
                    src={reply.pic}
                  />}
                  position="bottom center"
                  on='hover'>
                  <div>
                  <img
                    className='lgImg'
                    src={reply.pic}
                  />
                  <p className="popup"> {reply.userName} </p>
                  <div>
                  <img
                    className='follow'
                    src='http://cdn.onlinewebfonts.com/svg/img_529951.png'
                  />
                  <span> 50</span>
                  </div>
                  <button className="myBtn"> Follow</button>
                  </div>
                  </Popup>
                  <div>
                  <Popup trigger={<span className="h2T">{reply.userName}</span>}
                  position="bottom center"
                  on='hover'>
                  <div>
                  <img
                    className='lgImg'
                    src={reply.pic}
                  />
                  <p className="popup"> {reply.userName} </p>
                  <div>
                  <img
                    className='follow'
                    src='http://cdn.onlinewebfonts.com/svg/img_529951.png'
                  />
                  <span> 50</span>
                  </div>
                  <button className="myBtn"> Follow</button>
                  </div>
                  </Popup>
                  <span className="verylight">at</span>
                  <span className="point">{user.pointInSong}</span>
                  <span className="time">{user.time}</span>
                  <div>
                  <Popup trigger={<span>@<a className="button">{user.user}</a>:</span>}
                  position="bottom center"
                  on='hover'>
                  <div>
                  <img
                    className='lgImg'
                    src={user.picture}
                  />
                  <p className="popup"> {user.user} </p>
                  <div>
                  <img
                    className='follow'
                    src='http://cdn.onlinewebfonts.com/svg/img_529951.png'
                  />
                  <span> 50</span>
                  </div>
                  <button className="myBtn"> Follow</button>
                  </div>
                  </Popup>
                  <span className="reply">{reply.reply}</span>
                  </div>
                  </div>
                  <br></br><br></br><br></br>
                  </div>
                ))}
                </div>
              </div>
            </div>
            <br></br>

          </div>
        ))}
        {error &&
          <div style={{ color: '#900' }}>
            {error}
          </div>
        }
        {isLoading &&
          <div>Loading...</div>
        }

      </div>
    );
  }
}

render(<InfiniteUsers />, document.getElementById('root'));
