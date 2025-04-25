import { BD } from "../db.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'

 const SECRET_KEY = "chave_api_gfp"
class rotasLocalTransacao {
    static async nova(req, res) {
        const { nome, tipo_local, saldo, ativo} = req.body;
        try {
            const sql = `INSERT  INTO transacoes(nome, tipo_local, saldo, ativo)
            VALUES ($1, $2, $3, $4)`
            const valores = [nome, tipo_local, saldo, ativo]
            const localtransacao = await BD.query(sql, valores)
            res.status(201).json('Local transação Cadastrada')
        } catch (error) {
            console.error("Erro ao criar transação:", error);
            res.status(500).json({ message: "Erro ao criar transação", error: error.message });
        }
    }
    static async listar(req, res) {
        try {
            const resultado = await BD.query(`SELECT * From local_transacao`);
            res.json({ transacoes: resultado.rows });
        } catch (error) {
            res.status(500).json({ mensagem: 'Erro ao buscar transação', erro: error.message });
        }
    }
    static async listarPorId (req, res) {
        const { id } = req.params
        try{
            const local_transacao = await BD.query(`SELECT * FROM local_transacao WHERE id_local_transacao = $1`, [id]);
        res.status(200).json(transacao.rows[0]);
        }catch(error){
            res.status(500).json({message:  "Erro ao consultar local transação",  error: error.message})
        }
    }

    // Função atualizar
    static async atualizarTodos(req, res) {
        const { id_local_transacao } = req.params
        const { nome, tipo_local, saldo, ativo } = req.body;

        try {
            const transacao = await BD.query('UPDATE transacoes SET nome = $1, tipo_local = $2, saldo = $3, ativo = $4 where id_local_transacao = $5',
                [nome, tipo_local, saldo, ativo, id_local_transacao]// comando SQL para atualizar o usuario
            )
            res.status(200).json(transacao.rows[0])
        } catch (error) {
            res.status(500).json({ message: "Erro ao consultar local transação", error: error.message })
        }
    }

    static async atualizar(req, res) {
        const {id_local_transacao} = req.params
        const { nome, tipo_local, saldo, ativo } = req.body;

        try {
            const campos = [];
            const valores = [];

            if (nome !== undefined) {
                campos.push(`nome = $${valores.length + 1}`)
                valores.push(nome);
            }

            if (tipo_local !== undefined) {
                campos.push(`tipo_local = $${valores.length + 1}`)
                valores.push(tipo_local);
            }

            if (saldo !== undefined) {
                campos.push(`saldo = $${valores.length + 1}`)
                valores.push(saldo);
            }

            if (ativo !== undefined) {
                campos.push(`ativo = $${valores.length + 1}`)
                valores.push(ativo);
            }

            if (campos.length === 0) {
                return res.status(400).json({ message: 'Nenhum campo fornecido para atualizar' })
            }

            const query = `UPDATE transacoes SET ${campos.join(',')} WHERE id_local_transacao = ${id_local_transacao} RETURNING *`
            const transacao = await BD.query(query, valores)

            if (transacao.rows.length === 0) {
                return res.status(404).json({ message: 'Local transação não encontrada' })
            }
            return res.status(200).json(transacao.rows[0]);
        }
        catch (error) {
            res.status(500).json({ message: "Erro ao atualizar o local transação", error: error.message })
        }
    }
    static async deletar(req, res) {
        const { id_local_transacao } = req.params

        try {
            const localtransacao = await BD.query('UPDATE categorias SET ativo = false where id_categoria = $1',
                [id_local_transacao]// comando SQL para atualizar o usuario
            )
            res.status(200).json(localtransacao.rows[0])
        } catch (error) {
            res.status(500).json({ message: "Erro ao consultar local transação", error: error.message })
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

export default rotasLocalTransacao;