import { Link, useNavigate} from 'react-router-dom';
import Estilos, {corTextos, corFundo2} from '../styles/Estilos';

export default function Login() {
    const navigate = useNavigate();

    return(
        <div>
            <h1>Tela de Login</h1>
            <button onClick={() => navigate("/principal")}>Entrar</button>
        </div>
    )
}