import React, { Component, Fragment } from "react";
import { render } from "react-dom";
import request from "superagent";
import $ from 'jquery';

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
      currentUser:[]
    };
    this.loadUsers = this.loadUsers.bind(this)
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

      if (window.innerHeight + window.scrollY
        === document.documentElement.offsetHeight || window.innerHeight >= document.documentElement.offsetHeight) {
          this.setState({
            page: this.state.page +1
          })
        loadUsers();
      }
    };
  }
  // componentDidMount(){
  //   var context = this
  //   $.ajax({
  //     method: 'GET',
  //     url: '/data',
  //     success: (data) => {
  //       console.log(data)
  //     },
  //     error: (err) => {
  //       console.log('err', err);
  //     }
  //   });
  // }
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
      <div>
        <h1>Infinite Users!</h1>
        <p>Scroll down to load more!!</p>
        {currentUser.map(user => (
          <div>
            <hr />
            <div id='myid' style={{ display: 'flex' }}>
              <img
                className='imgId'
                alt={user.username}
                src={user.picture}
              />
              <div>
                <h2 >
                  {user.user}  <div>at {user.pointInSong}</div>
                </h2>
                <div>
                <p> {user.content}</p>
                </div>
                <div className='replyDiv'>
                {user.replies.map((reply) => (
                  <div>
                  {reply.userName}
                  </div>
                ))}
                </div>
                <p>{user.time}</p>
              </div>
              <button className='mybtn'> Reply </button>
            </div>

          </div>
        ))}
        <hr />
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

const container = document.createElement("div");
document.body.appendChild(container);
render(<InfiniteUsers />, container);
