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
      currentSong: [],
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
        >= document.documentElement.offsetHeight) {
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
          },function(){
            context.setState({
              currentSong: context.state.currentUser[0]
            })
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
                  context.setState({
                    tmpUser: context.state.users.slice(0,10+this.state.page*10)
              },function(){
                context.setState({
                  currentUser: [...context.state.tmpUser]
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
      currentUser,
      currentSong
    } = this.state;

    return (
      <div className="outer">
      <div className="mycontainer">
      <div className="left">
      <div className='amount'><img className="spec" src="https://image.flaticon.com/icons/svg/61/61157.svg"></img> <span className='afterSpec'>{users.length} Comments</span></div>
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
                <div style={{display:'flex'}}>
                <span className='content'> {user.content}</span>
                <Popup className="popno" trigger={<button className='mybtn' onClick={()=>this.show(index)}></button>}
                  on='click'
                  position='left center'>

                  <div><form>
                                      Message:<br></br>
                                      <input onChange={this.change} className="message" type="text" name="firstname"></input><br></br>
                                      <button onClick={(e)=>this.hello(e,index)}>submit</button>
                                      </form></div>
                </Popup>
                </div>
                <div className='replyDiv'>
                {user.replies.map((reply) => (
                  <div style={{display:'flex'}}>
                  <Popup trigger={<img
                    className='newImg'
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
                  <span className="time">{user.time}</span>
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
      </div>
      <div className="right">
      <img className='bigImg' src='https://va.sndcdn.com/box/Eng_dashbox_8.1.17.jpg'></img>
      <div className='first'>
      <a className="aClass" href="">
          <h3 className="aHead">
            <span ><img className="relatedImg" src="https://image.flaticon.com/icons/svg/104/104695.svg"/> Related tracks</span>
          </h3>
          <span className="spanOut">View all</span>
      </a>
      <div className="related">
        <div className="inRel">
        <div className="ele">
          <img className="relateImg" onMouseEnter={()=>document.getElementById('first').style.visibility = 'visible'} onMouseLeave={()=>document.getElementById('first').style.visibility = 'hidden'} src="https://i1.sndcdn.com/avatars-000040646884-2fz9f4-t500x500.jpg"/><img className='specImg' id='first' src="https://image.flaticon.com/icons/svg/283/283695.svg"></img>
          <div className="wrapper">
          <div className='wrapper2'>
          <Popup className="specPop" trigger={<div className="nameRel"> Pray For the Wicked</div>}
          position="bottom center"
          on='hover'>
          <div>
          <img
            className='lgImg'
            src="https://i1.sndcdn.com/avatars-000040646884-2fz9f4-t500x500.jpg"
          />
          <p className="popup"> {'John Appleseed'} </p>
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
            <div className="songRel"> Death of a Bachelor </div>
          </div>
            <a className="iconDiv" href="">
              <img className="iconsF" src="https://image.flaticon.com/icons/svg/56/56809.svg"></img> 3000
              <img className="icons" src="https://image.flaticon.com/icons/svg/69/69904.svg"></img> 3000
              <img className="icons" src="https://image.flaticon.com/icons/svg/16/16148.svg"></img> 3000
              <img className="icons" src="https://image.flaticon.com/icons/svg/61/61157.svg"></img> 3000
            </a>
          </div>
        </div>
        <div className="ele">
          <img className="relateImg" onMouseEnter={()=>document.getElementById('second').style.visibility = 'visible'} onMouseLeave={()=>document.getElementById('second').style.visibility = 'hidden'} src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSuDEqaz2kJVuEZbhw4HDx6HVXDBxD-xrA6A86UpJ4YTi9-5qpk"/><img className='specImg' id='second' src="https://image.flaticon.com/icons/svg/283/283695.svg"></img>
          <div className="wrapper">
          <div className='wrapper2'>
          <Popup className="specPop" trigger={<div className="nameRel"> Panic! at the Disco</div>}
          position="bottom center"
          on='hover'>
          <div>
          <img
            className='lgImg'
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSuDEqaz2kJVuEZbhw4HDx6HVXDBxD-xrA6A86UpJ4YTi9-5qpk"
          />
          <p className="popup"> {'John Appleseed'} </p>
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
            <div className="songRel"> Maroon 5 </div>
          </div>
            <a className="iconDiv" href="">
              <img className="iconsF" src="https://image.flaticon.com/icons/svg/56/56809.svg"></img> 3000
              <img className="icons" src="https://image.flaticon.com/icons/svg/69/69904.svg"></img> 3000
              <img className="icons" src="https://image.flaticon.com/icons/svg/16/16148.svg"></img> 3000
              <img className="icons" src="https://image.flaticon.com/icons/svg/61/61157.svg"></img> 3000
            </a>
          </div>
        </div>
        <div className="ele">
          <img className="relateImg" onMouseEnter={()=>document.getElementById('third').style.visibility = 'visible'} onMouseLeave={()=>document.getElementById('third').style.visibility = 'hidden'} src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0qF8lQkDrUMBXNaO0VWxoVi8HuF9BT7Qa1G6MKzEO88v6_avlQg"/><img className='specImg' id='third' src="https://image.flaticon.com/icons/svg/283/283695.svg"></img>
          <div className="wrapper">
          <div className='wrapper2'>
          <Popup className="specPop" trigger={<div className="nameRel"> Girls Like You</div>}
          position="bottom center"
          on='hover'>
          <div>
          <img
            className='lgImg'
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0qF8lQkDrUMBXNaO0VWxoVi8HuF9BT7Qa1G6MKzEO88v6_avlQg"
          />
          <p className="popup"> {'John Appleseed'} </p>
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
            <div className="songRel"> High Hopes </div>
          </div>
            <a className="iconDiv" href="">
              <img className="iconsF" src="https://image.flaticon.com/icons/svg/56/56809.svg"></img> 3000
              <img className="icons" src="https://image.flaticon.com/icons/svg/69/69904.svg"></img> 3000
              <img className="icons" src="https://image.flaticon.com/icons/svg/16/16148.svg"></img> 3000
              <img className="icons" src="https://image.flaticon.com/icons/svg/61/61157.svg"></img> 3000
            </a>
          </div>
        </div>
        </div>
      </div>
      </div>

      <div className='first'>
      <a className="aClass" href="">
          <h3 className="aHead">
            <span ><img className="relatedImg" src="https://image.flaticon.com/icons/svg/346/346685.svg"/> In albums</span>
          </h3>
          <span className="spanOut">View all</span>
      </a>
      <div className="album">
        <div className="inRel">
          <div className="ele">
            <span><img className="relateImg" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrNU1Hpw6doSSedXlQedQYmG6s58z__kDtwRXHxG83o1mvmTYQdA"/></span>
            <div className="wrapper">
            <div className='wrapper2'>
            <Popup className="specPop" trigger={<div className="nameRel"> Artist</div>}
            position="bottom center"
            on='hover'>
            <div>
            <img
              className='lgImg'
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrNU1Hpw6doSSedXlQedQYmG6s58z__kDtwRXHxG83o1mvmTYQdA"
            />
            <p className="popup"> {'John Appleseed'} </p>
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
              <div className="songRel"> High Hopes </div>
            </div>
              Album * 2018
            </div>
          </div>
        </div>
        </div>
      </div>

      <div className='first'>
      <a className="aClass" href="">
          <h3 className="aHead">
            <span><img className="relatedImg" src="https://image.flaticon.com/icons/svg/346/346685.svg"/> In playlists</span>
          </h3>
          <span className="spanOut">View all</span>
      </a>
      <div className="album">
        <div className="inRel">
          <div className="ele">
            <span><img className="relateImg" src="https://f4.bcbits.com/img/a3824066484_10.jpg"/></span>
            <div className="wrapper">
            <div className='wrapper2'>
            <Popup className="specPop" trigger={<div className="nameRel"> John Appleseed</div>}
            position="bottom center"
            on='hover'>
            <div>
            <img
              className='lgImg'
              src="https://f4.bcbits.com/img/a3824066484_10.jpg"
            />
            <p className="popup"> {'John Appleseed'} </p>
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
              <div className="songRel"> Death of a Bachelor </div>
            </div>
              <a className="iconDiv" href="">
                <img className="iconsF" src="https://image.flaticon.com/icons/svg/69/69904.svg"></img> 5
                <img className="icons" src="https://image.flaticon.com/icons/svg/16/16148.svg"></img> 2
              </a>
            </div>
          </div>
          <div className="ele">
            <span><img className="relateImg" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUsWfd670RZKJ4NwIY3soVTJrDxvL42q-kkVZ6r2lLi-IszaKq"/></span>
            <div className="wrapper">
            <div className='wrapper2'>
            <Popup className="specPop" trigger={<div className="nameRel"> John Appleseed</div>}
            position="bottom center"
            on='hover'>
            <div>
            <img
              className='lgImg'
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUsWfd670RZKJ4NwIY3soVTJrDxvL42q-kkVZ6r2lLi-IszaKq"
            />
            <p className="popup"> {'John Appleseed'} </p>
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
              <div className="songRel"> Pray for the Wicked </div>
            </div>
              <a className="iconDiv" href="">
                <img className="iconsF" src="https://image.flaticon.com/icons/svg/69/69904.svg"></img> 5
                <img className="icons" src="https://image.flaticon.com/icons/svg/16/16148.svg"></img> 2
              </a>
            </div>
          </div>
          <div className="ele">
            <span><img className="relateImg" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSyOTCOlbm-IgT92YVUQH5riH_nXONhDtIRrmxFiF4H8Ikf31kdw"/></span>
            <div className="wrapper">
            <div className='wrapper2'>
            <Popup className="specPop" trigger={<div className="nameRel"> John Appleseed</div>}
            position="bottom center"
            on='hover'>
            <div>
            <img
              className='lgImg'
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSyOTCOlbm-IgT92YVUQH5riH_nXONhDtIRrmxFiF4H8Ikf31kdw"
            />
            <p className="popup"> {'John Appleseed'} </p>
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
              <div className="songRel"> Pray for the Wicked </div>
            </div>
              <a className="iconDiv" href="">
                <img className="iconsF" src="https://image.flaticon.com/icons/svg/69/69904.svg"></img> 5
                <img className="icons" src="https://image.flaticon.com/icons/svg/16/16148.svg"></img> 2
              </a>
            </div>
          </div>

        </div>
        </div>
      </div>


      <div className='first'>
      <a className="aClass" href="">
          <h3 className="aHead">
            <span><img className="relatedImg" src="https://image.flaticon.com/icons/svg/69/69904.svg"/> 5000 likes</span>
          </h3>
          <span className="spanOut">View all</span>
      </a>
      <div className="likeEle">
        {tmpUser.map((user,index) => (
          <Popup trigger={<span><img className="cutImg" src={user.picture}/></span>}
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
        ))}
      </div>
      </div>

      <div className='first'>
      <a className="aClass" href="">
          <h3 className="aHead">
            <span ><img className="relatedImg" src="https://image.flaticon.com/icons/svg/16/16148.svg"/> 5000 reposts</span>
          </h3>
          <span className="spanOut">View all</span>
      </a>
      <div className="likeEle">
        {tmpUser.map((user,index) => (
          <Popup trigger={<span><img className="cutImg" src={user.picture}/></span>}
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
        ))}
      </div>
      </div>

      </div>
      </div>
    );
  }
}
https://image.flaticon.com/icons/svg/346/346685.svg
render(<InfiniteUsers />, document.getElementById('root'));
