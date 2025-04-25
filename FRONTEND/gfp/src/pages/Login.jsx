import Logo from "../assets/senairosalogin.png"
import React from 'react'
import { useState } from 'react'
import { enderecoServidor } from "../utils"
import {useNavigate} from 'react-router-dom'

const Login = () => {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [mensagem, setMensagem] = useState (''); 
    const navigate = useNavigate()

    
    async function botaoClique(e) {
        e.preventDefault();

        try {
            if (email == '' || senha == '') {
                throw new Error('Preencha todos os campos')
            }
            // Autenticando a API de backend com o fetch
            const resposta = await fetch(`${enderecoServidor}/usuarios/login`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        email: email,
                        senha: senha,
                    })
                }
            )
            if (resposta.ok) {
                const dados = await resposta.json();
                navigate("/principal")
                localStorage.setItem('UsuarioLogado', JSON.stringify(dados))
            } else {
                setMensagem('E-mail ou senha incorretos (˚ ˃̣̣̥⌓˂̣̣̥ )')
                throw new Error('Email ou senha incorretos (˚ ˃̣̣̥⌓˂̣̣̥ )')
            }
        } catch (error){
            console.error('Erro ao fazer login:', error)
            alert(error.message);
            return;
        }
    }
    return (
        <div className="card div-menor" style={{backgroundColor:"#f2f2f2"}}>
            <div style={{display: "flex",justifyContent: "center"}}>
                <img className="img-login" src={Logo} alt="" />
            </div>

            <p style={{color: "#e298bb", justifyContent: "center", display:"flex", fontSize: 115, fontFamily: "sans-serif"}}>Login</p>
            <div style={{display: "flex",justifyContent: "center", marginTop: "5px"}}>
                <p style={{marginTop: 15, fontFamily: "sans-serif", fontSize: 20, color: "#FF5CAA", fontWeight: "bold"}}>Email:</p>
                <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" className="form-control" placeholder="Digite seu E-mail" style={{borderRadius: 15, height: 25, backgroundColor:"#ffc4e0", padding: 10, fontSize: 20, marginLeft: 10}}></input>
            </div>
            <div style={{display: "flex",justifyContent: "center", marginTop: "5px"}}>
                <p style={{marginTop: 15, fontFamily: "sans-serif", fontSize: 20, color: "#FF5CAA", fontWeight: "bold"}}>Senha:</p>
                <input onChange={(e) => setSenha(e.target.value)} value={senha} type="password" className="form-control" placeholder="Digite sua senha" style={{borderRadius: 15, height: 25, backgroundColor:"#ffc4e0", padding: 10, fontSize: 20, marginLeft: 10}}></input>
            </div>
            <div style={{display: "flex",justifyContent: "center", marginTop: "5px", marginLeft: 50}}>
                <button onClick={botaoClique}className="button" type="submit" style={{borderRadius:25, backgroundColor: "#FF5CAA", height: 50, width: 80, fontFamily: "sans-serif", fontSize: 20, color: "#ffff"}}>Entrar</button>
            </div>
                <p style={{textAlign:"center", color: "corFundo"}}>{mensagem}</p>
        </div>    
    )
}

export default Login;