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
      page: 1,
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
      if (window.innerHeight + window.scrollY
        === document.documentElement.offsetHeight || window.innerHeight >= document.documentElement.offsetHeight) {
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
    $.ajax({
      method: 'GET',
      url: '/data',
      success: (data) => {
        context.setState({
          users: data,
        },function(){
          context.setState({
            tmpUser: context.state.users.slice(0+this.state.page*10,10+this.state.page*10)
          },function(){
            context.setState({
              currentUser: [...context.state.currentUser,...context.state.tmpUser]
            })
          })
        })
        // setTimeout(function(){
        //   console.log('users',context.state.users,context.state.tmpUser)
        // },1000)
      },
      error: (err) => {
        console.log('err', err);
      }
    });
  }

  loadUsers(){
    var context = this
    context.setState({ isLoading: true }, () => {
      $.ajax({
        method: 'GET',
        url: '/data',
        success: (data) => {
          context.setState({
            users: data
          },function(){
            context.setState({
              tmpUser: context.state.users.slice(0+this.state.page*10,10+this.state.page*10)
            },function(){
              context.setState({
                currentUser: [...context.state.currentUser,...context.state.tmpUser]
              })
            })
          })
          // setTimeout(function(){
          //   console.log('users',context.state.users)
          // },1000)
        },
        error: (err) => {
          console.log('err', err);
        }
      });

          // Merges the next users into our existing users
          context.setState({
            // Note: Depending on the API you're using, this value may
            // be returned as part of the payload to indicate that there
            // is no additional data to be loaded
            hasMore: (context.state.currentUser.length < 1000),
            isLoading: false
          });
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
                'index': this.state.currentUser[index].id
            })
            .then((response) => {
              axios.get('/data').then((myResponse)=>{
                context.setState({
                  users: myResponse.data,
                })
              }).then((newRes)=>{
                  context.setState({
                    tmpUser: context.state.users.slice(0+this.state.page*10,10+this.state.page*10)
              })
            }).then(()=>{
              context.setState({
                currentUser: context.state.tmpUser
              })
            })
              setTimeout(function(){
                console.log(context.state.tmpUser)
              },1000)
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
      <div >
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
              <Popup trigger={<span className="h2T"> {user.user}</span>}
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
              <span>at {user.pointInSong}</span>
              <span>{user.time}</span>
                <div>
                <p> {user.content}</p>
                </div>
                <div className='replyDiv'>
                {user.replies.map((reply) => (
                  <div>
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
                  <Popup trigger={<span>{reply.userName}</span>}
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
                  <span>at {user.pointInSong}</span>
                  <div>
                  <div>
                  <Popup trigger={<span><span>@</span><a className="button">{user.user}</a></span>}
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
                  <span>{reply.reply}</span>
                  <span>{user.time}</span>
                  </div>
                  </div>
                  </div>
                ))}
                </div>
              </div>
              <Popup className="popno" trigger={<button className='mybtn' onClick={()=>this.show(index)}> Reply </button>}
                on='click'
                position='left center'>

                <div><form>
                                    Message:<br></br>
                                    <input onChange={this.change} className="message" type="text" name="firstname"></input><br></br>
                                    Last name:<br></br>
                                    <input type="text" ></input>
                                    <button onClick={(e)=>this.hello(e,index)}>submit</button>
                                    </form></div>
              </Popup>
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
