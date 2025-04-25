import { BD } from "../db.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'

 const SECRET_KEY = "chave_api_gfp"
class rotasTransacao {
    static async nova(req, res) {
        const { valor, descricao, data_transacao, data_vencimento, data_pagamento, tipo_transacao, id_local_transacao, id_categoria, id_subcategoria, id_usuario, num_parcelas, parcela_atual} = req.body;
        try {
            const sql = `INSERT  INTO transacoes(valor, descricao, data_transacao, data_vencimento, data_pagamento, tipo_transacao, id_local_transacao, id_categoria, id_subcategoria, id_usuario, num_parcelas, parcela_atual)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`
            const valores = [valor, descricao, data_transacao, data_vencimento, data_pagamento, tipo_transacao, id_local_transacao, id_categoria, id_subcategoria, id_usuario, num_parcelas, parcela_atual]
            const transacoes = await BD.query(sql, valores)
            res.status(201).json('Transação Cadastrada')
        } catch (error) {
            console.error("Erro ao criar transação:", error);
            res.status(500).json({ message: "Erro ao criar transação", error: error.message });
        }
    }
    static async listar(req, res) {
        try {
            const resultado = await BD.query(`SELECT * From transacoes`);
            res.json({ transacoes: resultado.rows });
        } catch (error) {
            res.status(500).json({ mensagem: 'Erro ao buscar transação', erro: error.message });
        }
    }
    static async listarPorId (req, res) {
        const { id } = req.params
        try{
            const transacao = await BD.query(`SELECT * FROM transacoes WHERE id_transacao = $1`, [id]);
        res.status(200).json(transacao.rows[0]);
        }catch(error){
            res.status(500).json({message:  "Erro ao consultar transação",  error: error.message})
        }
    }

    // Função atualizar
    static async atualizarTodas(req, res) {
        const { id_transacao } = req.params
        const { valor, descricao, data_transacao, data_vencimento, data_pagamento, tipo_transacao, id_local_transacao, id_categoria, id_subcategoria, id_usuario, num_parcelas, parcela_atual } = req.body;

        try {
            const transacao = await BD.query('UPDATE transacoes SET valor = $1, descricao = $2, data_transacao = $3, data_vencimento = $4, data_pagamento = $5, tipo_tansacao = $6, id_local_transacao = $7, id_categoria = $8, id_subcategoria = $9, id_usuario = $10, num_parcelas = $11, parcela_atual = $12 where id_transacao = $13',
                [valor, descricao, data_transacao, data_vencimento, data_pagamento, tipo_transacao, id_local_transacao, id_categoria, id_subcategoria, id_usuario, num_parcelas, parcela_atual]// comando SQL para atualizar o usuario
            )
            res.status(200).json(transacao.rows[0])
        } catch (error) {
            res.status(500).json({ message: "Erro ao consultar transação", error: error.message })
        }
    }

    static async atualizar(req, res) {
        const {id_transacao} = req.params
        const { valor, descricao, data_transacao, data_vencimento, data_pagamento, tipo_transacao, id_local_transacao, id_categoria, id_subcategoria, id_usuario, num_parcelas, parcela_atual } = req.body;

        try {
            const campos = [];
            const valores = [];

            if (valor !== undefined) {
                campos.push(`valor = $${valores.length + 1}`)
                valores.push(valor);
            }

            if (descricao !== undefined) {
                campos.push(`descricao = $${valores.length + 1}`)
                valores.push(descricao);
            }

            if (data_transacao !== undefined) {
                campos.push(`data_transacao = $${valores.length + 1}`)
                valores.push(data_transacao);
            }

            if (data_vencimento !== undefined) {
                campos.push(`data_vencimento = $${valores.length + 1}`)
                valores.push(data_vencimento);
            }

            if (data_pagamento !== undefined) {
                campos.push(`data_pagamento = $${valores.length + 1}`)
                valores.push(data_pagamento);
            }

            if (tipo_transacao !== undefined) {
                campos.push(`tipo_transacao = $${valores.length + 1}`)
                valores.push(tipo_transacao);
            }

            if (id_local_transacao !== undefined) {
                campos.push(`id_local_transacao = $${valores.length + 1}`)
                valores.push(id_local_transacao);
            }

            if (id_categoria !== undefined) {
                campos.push(`id_categoria $${valores.length + 1}`)
                valores.push(id_categoria);
            }

            if (id_subcategoria !== undefined) {
                campos.push(`id_subcategoria $${valores.length + 1}`)
                valores.push(id_subcategoria);
            }

            if (id_usuario !== undefined) {
                campos.push(`id_usuario $${valores.length + 1}`)
                valores.push(id_usuario);
            }

            if (num_parcelas !== undefined) {
                campos.push(`num_parcelas $${valores.length + 1}`)
                valores.push(num_parcelas);
            }

            if (parcela_atual !== undefined) {
                campos.push(`parcela_atual $${valores.length + 1}`)
                valores.push(parcela_atual);
            }

            if (campos.length === 0) {
                return res.status(400).json({ message: 'Nenhum campo fornecido para atualizar' })
            }

            const query = `UPDATE transacoes SET ${campos.join(',')} WHERE id_transacao = ${id_transacao} RETURNING *`
            const transacao = await BD.query(query, valores)

            if (transacao.rows.length === 0) {
                return res.status(404).json({ message: 'Transação não encontrada' })
            }
            return res.status(200).json(transacao.rows[0]);
        }
        catch (error) {
            res.status(500).json({ message: "Erro ao atualizar o transação", error: error.message })
        }
    }
    static async deletar(req, res) {
        const { id_transacao } = req.params

        try {
            const transacao = await BD.query('UPDATE categorias SET ativo = false where id_categoria = $1',
                [id_transacao]// comando SQL para atualizar o usuario
            )
            res.status(200).json(transacao.rows[0])
        } catch (error) {
            res.status(500).json({ message: "Erro ao consultar transação", error: error.message })
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

export default rotasTransacao;