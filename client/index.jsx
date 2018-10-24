import React, { Component, Fragment } from "react";
import { render } from "react-dom";
import request from "superagent";

class InfiniteUsers extends Component {
  constructor(props) {
    super(props);

    // Sets up our initial state
    this.state = {
      error: false,
      hasMore: true,
      isLoading: false,
      users: [],
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
        loadUsers();
      }
    };
  }
  componentWillMount() {
    // Loads some users on initial load
      this.loadUsers();
  }

  loadUsers(){
    var context = this
    context.setState({ isLoading: true }, () => {
      request
        .get('https://randomuser.me/api/?results=2')
        .then((results) => {
          // Creates a massaged array of user data
          const nextUsers = results.body.results.map(user => ({
            email: user.email,
            name: Object.values(user.name).join(' '),
            photo: user.picture.medium,
            username: user.login.username,
            uuid: user.login.uuid,
          }));

          // Merges the next users into our existing users
          context.setState({
            // Note: Depending on the API you're using, this value may
            // be returned as part of the payload to indicate that there
            // is no additional data to be loaded
            hasMore: (context.state.users.length < 100),
            isLoading: false,
            users: [
              ...context.state.users,
              ...nextUsers,
            ],
          });
        })
        .catch((err) => {
          context.setState({
            error: err.message,
            isLoading: false,
           });
        })
    });
  }

  render() {
    const {
      error,
      hasMore,
      isLoading,
      users,
    } = this.state;

    return (
      <div>
        <h1>Infinite Users!</h1>
        <p>Scroll down to load more!!</p>
        {users.map(user => (
          <div>
            <hr />
            <div id='myid' style={{ display: 'flex' }}>
              <img
                className='imgId'
                alt={user.username}
                src={user.photo}
              />
              <div>
                <h2 >
                  @{user.username}
                </h2>
                <p>Name: {user.name}</p>
                <p>Email: {user.email}</p>
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
