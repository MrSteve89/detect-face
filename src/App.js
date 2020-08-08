import React, {Component} from 'react';
import Particles from 'react-particles-js';
import Logo from './Components/Logo/Logo';
import Navigation from './Components/Navigation/Navigation';
import SignIn from './Components/SignIn/SignIn';
import Register from './Components/Register/Register';
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './Components/FaceRecognition/FaceRecognition';
import Rank from './Components/Rank/Rank';
import './App.css';



const particlesOptions = {
    particles: {
      number: {
        value: 100,
        density: {
          enable: true,
          value_area: 800
        }
      }
    }
  }

const initialState = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signIn',
      user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      }
    }


class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }
  
  onImageSubmit = () => {
    this.setState({imageUrl: this.state.input})
    fetch('https://safe-bastion-47181.herokuapp.com/imageurl', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          input: this.state.input
        })
      })
    .then(response => response.json())
    .then(response => {
      if (response) {
        fetch('https://safe-bastion-47181.herokuapp.com/image', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            id: this.state.user.id
          })
        })
        .then(response => response.json())
        .then(count => {
          this.setState(Object.assign(this.state.user, {entries: count}))
        })
        .catch(console.log)  
      }
      this.displayFaceBox(this.calculateFaceLocation(response));
    })
    .catch(err => console.log(err));  
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - clarifaiFace.right_col * width,
      bottomRow: height - clarifaiFace.bottom_row * height
    }
  }

  displayFaceBox = (box) => {
    this.setState({box: box});
  }

  onRouteChange = (route) => {
    if (route === 'signIn') {
      this.setState(initialState);
    }
    this.setState({route: route});
  }

  render() {
    const {imageUrl, route, box} = this.state;
    return (
      <div className="App">
        <Particles 
            className='particles'
            params={particlesOptions}
        />
        {route === 'home'
          ?
          <div>
            <div className='flex justify-between'>
              <Logo/>
              <Navigation onRouteChange={this.onRouteChange}/>
            </div> 
             <Rank 
              name={this.state.user.name}
              entries={this.state.user.entries}
            />
            <ImageLinkForm 
              onInputChange={this.onInputChange}
              onImageSubmit={this.onImageSubmit}
            />
            <FaceRecognition 
              box = {box}
              imageUrl={imageUrl}
            />
          </div>  
          : (
            route === 'signIn' 
            ? <SignIn 
                loadUser={this.loadUser}
                onRouteChange={this.onRouteChange}
              />
            : <Register 
                loadUser={this.loadUser}
                onRouteChange={this.onRouteChange}
              />
            )
        }
      </div>
    );
  }
}

export default App;
