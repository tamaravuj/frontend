import AuthRequired from './AuthRequired';

const PrivateRoute = ({ children, currentUser, onNavigate }) => {
  return currentUser ? children : <AuthRequired onNavigate={onNavigate} />;
};

export default PrivateRoute;
