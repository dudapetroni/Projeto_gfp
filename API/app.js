import express from 'express'
import { testarConexao } from './db.js'
import cors from 'cors';
import rotasUsuarios, {autenticarToken} from './routes/rotasUsuarios.js';
import rotasCategorias from './routes/rotasCategorias.js';
import rotasSubCategorias from './routes/rotasSubCategorias.js';

const app = express()

testarConexao();
app.use(cors());
app.use(express.json())

app.get('/', (req, res) =>{
    res.send('API Funcionando')
})

//ROTAS USUÁRIOS
app.post('/usuarios',rotasUsuarios.novoUsuario) //✅
app.post('/usuarios/login',rotasUsuarios.login) // ✅
app.get('/usuarios',autenticarToken, rotasUsuarios.listarUsuarios) //✅
app.get('/usuarios/:id_usuario',autenticarToken, rotasUsuarios.listarUsuariosPorId) //✅
app.patch('/usuarios/:id_usuario',autenticarToken, rotasUsuarios.atualizar) //✅
app.put('/usuarios/:id_usuario',autenticarToken, rotasUsuarios.atualizarTodos) //✅
app.delete('/usuarios/:id_usuario',autenticarToken, rotasUsuarios.deletar) //✅

// //ROTAS CATEGORIAS
app.post('/categorias',rotasCategorias.nova) // ✅
app.get('/categorias', rotasCategorias.listar) //✅
// app.get('/categorias/:id_categoria',autenticarToken, rotasCategorias.ListarPorId)
app.patch('/categorias/:id_categoria', rotasCategorias.atualizar) //✅
app.put('/categorias/:id_categoria', rotasCategorias.atualizarTodas) //✅
app.delete('/categorias/:id_categoria', rotasCategorias.deletar) // ✅

// //ROTAS SUB-CATEGORIAS
app.post('/subcategorias',rotasSubCategorias.nova) //✅
app.get('/subcategorias',rotasSubCategorias.listar) //✅
// app.get('/subcategorias/:id_categoria',rotasSubCategorias.ListarPorId)
app.patch('/subcategorias/:id_subcategoria',rotasSubCategorias.atualizar) //✅
app.put('/subcategorias/:id_subcategoria',rotasSubCategorias.atualizarTodas) //✅
app.delete('/subcategorias/:id_subcategoria',rotasSubCategorias.deletar) //✅

// // ROTAS LOCAL TRANSAÇÃO
// app.post('/transacaolocal',rotasLocalTransacao.nova)
// app.get('/transacaolocal',rotasLocalTransacao.listar)
// app.get('/transacaolocal/:id_transacao',rotasLocalTransacao.ListarPorId)
// app.patch('/transacaolocal/:id_local_transacao',rotasLocalTransacao.atualizar)
// app.put('/transacaolocal/:id_local_transacao',rotasLocalTransacao.atualizarTodos)
// app.delete('/transacaolocal/:id_local_transacao',rotasLocalTransacao.deletar)

// // ROTAS TRANSAÇÕES
// app.post('/transacao',rotasTransacao.nova)
// app.get('/transacao',rotasTransacao.listar)
// app.get('/transacao/:id_transacao',rotasTransacao.ListarPorId)
// app.patch('/transacao/:id_transacao',rotasTransacao.atualizar)
// app.put('/transacao/:id_transacao',rotasTransacao.atualizarTodos)
// app.delete('/transacao/:id_transacao',rotasTransacao.deletar)
//
const porta = 3000
app.listen(porta, () =>{
    console.log(`Api http://localhost:${porta}`);
})

export default app; //ajustar