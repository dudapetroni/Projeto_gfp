import { BD } from "../db.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'

 const SECRET_KEY = "chave_api_gfp"
class rotasUsuarios {

    // CRIAR USUARIO
    static async novoUsuario(req, res) {
        const { nome, email, senha, tipo_acesso } = req.body;
        const saltRounds = 10;
        const senhaCriptografada = await bcrypt.hash(senha, saltRounds);
        try {
            const sql = `INSERT  INTO usuarios(nome, email, senha, tipo_acesso)
            VALUES ($1, $2, $3, $4)`
            const valores = [nome, email, senhaCriptografada, tipo_acesso]
            const usuario = await BD.query(sql, valores)
            res.status(201).json('Usuário Cadastrado')
        } catch (error) {
            console.error("Erro ao criar usuário:", error);
            res.status(500).json({ message: "Erro ao criar usuário", error: error.message });
        }
    }

    //LOGIN
    static async login(req, res) {
        const { email, senha } = req.body;

        try {
            const resultado = await BD.query(
                `SELECT id_usuario, email, senha, tipo_acesso
                FROM usuarios
                WHERE email = $1 `,
                [email]
            );
            if (resultado.rows.length === 0) {
                return res.status(401).json({ message: 'Email ou senha inválidos' })
            }
            const usuarios = resultado.rows[0];
            const senhaInvalida = await bcrypt.compare(senha, usuarios.senha)

            if (!senhaInvalida) {
                return res.status(401).json('Email ou senha inválidos')
            }
            // //Gerar um novo token para o usuario
            const token = jwt.sign(
            // //payload
            {id: usuarios.id, nome: usuarios.nome, email: usuarios.email},
            // //signature
            SECRET_KEY,
            {expiresIn: '1h'}
             )
            return res.status(200).json({ message: 'Login realizado com sucesso', usuarios, token });
            //  return res.status(200).json({message: 'Login realizado com sucesso', usuario});
        }
        catch (error) {
            console.error('Erro ao realizar login:', error)
            return res.status(500).json({ message: 'Erro ao realizar login', error: error.message })

        }
    }

    // LISTAR
    static async listarUsuarios(req, res) {
        try {
            const resultado = await BD.query(`SELECT * From usuarios`);
            res.json({ usuarios: resultado.rows });
        } catch (error) {
            res.status(500).json({ mensagem: 'Erro ao buscar usuários', erro: error.message });
        }
    }

    // LISTAR POR ID
    static async listarUsuariosPorId (req, res) {
        const { id } = req.params
        try{
            const usuario= await BD.query(`SELECT * FROM usuarios WHERE id_usuario = $1`, [id]);
        res.status(200).json(usuario.rows[0]);
        }catch(error){
            res.status(500).json({message:  "Erro ao consultar usuarios",  error: error.message})
        }
    }

    // ATUALIZAR TODOS
    static async atualizarTodos(req, res) {
        const { id_usuario } = req.params
        const { nome, email, senha, tipo_acesso } = req.body;

        try {
            const usuario = await BD.query('UPDATE usuarios SET nome = $1, email = $2, senha = $3 , tipo_acesso = $4 where id_usuario = $5',
                [nome, email, senha, tipo_acesso, id_usuario]// comando SQL para atualizar o usuario
            )
            res.status(200).json(usuario.rows[0])
        } catch (error) {
            res.status(500).json({ message: "Erro ao consultar usuarios", error: error.message })
        }
    }

    // ATUALIZAR
    static async atualizar(req, res) {
        const { nome, email, senha, tipo_acesso } = req.body;

        try {
            const campos = [];
            const valores = [];

            if (nome !== undefined) {
                campos.push(`nome = $${valores.length + 1}`)
                valores.push(nome);
            }

            if (email !== undefined) {
                campos.push(`email = $${valores.length + 1}`)
                valores.push(email);
            }

            if (senha !== undefined) {
                campos.push(`senha = $${valores.length + 1}`)
                valores.push(senha);
            }

            if (tipo_acesso !== undefined) {
                campos.push(`tipo_acesso = $${valores.length + 1}`)
                valores.push(tipo_acesso);
            }
            if (campos.length === 0) {
                return res.status(400).json({ message: 'Nenhum campo fornecido para atualizar' })
            }

            const query = `UPDATE usuarios SET ${campos.join(',')} WHERE id_usuario = ${id} RETURNING *`
            const usuario = await BD.query(query, valores)

            if (usuario.rows.length === 0) {
                return res.status(404).json({ message: 'Usuário não encontrado' })
            }
            return res.status(200).json(usuario.rows[0]);
        }
        catch (error) {
            res.status(500).json({ message: "Erro ao atualizar o usario", error: error.message })
        }
    }

    //DELETAR
    static async deletar(req, res) {
        const { id_usuario } = req.params

        try {
            const usuario = await BD.query('UPDATE usuarios SET ativo = false where id_usuario = $1',
                [id_usuario]// comando SQL para atualizar o usuario
            )
            res.status(200).json(usuario.rows[0])
        } catch (error) {
            res.status(500).json({ message: "Erro ao consultar usuarios", error: error.message })
        }
    }
}

export function autenticarToken(req, res, next) {
    const token = req.headers['authorization'];

    if (!token) return res.status(403).json({message: 'Token não fornecido'})

    jwt.verify(token.split(" ")[1], SECRET_KEY, (err, usuario) => {
        if(err) return res.status(403).json({message: 'Token inválido'})

        req.usuario = usuario;
        next();
    })
}

export default rotasUsuarios;