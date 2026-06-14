import { Link } from 'react-router-dom';
import Message from '../components/Message';

const CompleteOrderScreen = () => {
    return (
        <Message variant="success">
            Hvala na kupovini! Vasa porudzbina je uspesno zabelezena.{' '}
            <Link to="/">Nazad na proizvode</Link>
        </Message>
    );
};

export default CompleteOrderScreen;