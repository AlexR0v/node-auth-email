import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import ForgotPasswordPage from './components/pages/ForgotPasswordPage.js'
import LoginPage from './components/pages/LoginPage.js'
import PrivatePage from './components/pages/PrivatePage.js'
import RegisterPage from './components/pages/RegisterPage.js'
import ResetPasswordPage from './components/pages/ResetPasswordPage.js'
import PrivateRoute from './components/routing/PrivateRoute.jsx'

function App () {
  return (
    <Router>
      <div className='app'>
        <Switch>
          <PrivateRoute
            exact
            path='/'
            component={PrivatePage}
          />
          <Route
            exact
            path='/login'
            component={LoginPage}
          />
          <Route
            exact
            path='/register'
            component={RegisterPage}
          />
          <Route
            exact
            path='/forgotpassword'
            component={ForgotPasswordPage}
          />
          <Route
            exact
            path='/passwordreset/:resetToken'
            component={ResetPasswordPage}
          />
        </Switch>
      </div>
    </Router>
  )
}

export default App
