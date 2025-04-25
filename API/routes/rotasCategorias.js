import { BD } from "../db.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'

 const SECRET_KEY = "chave_api_gfp"
class rotasCategorias {
    static async nova(req, res) {
        const { nome, tipo_transacao, gasto_fixo, ativo, id_usuario, cor, icone } = req.body;
        try {
            const sql = `INSERT  INTO categorias(nome, tipo_transacao, gasto_fixo, ativo, id_usuario, cor, icone)
            VALUES ($1, $2, $3, $4, $5, $6, $7)`
            const valores = [nome, tipo_transacao, gasto_fixo, ativo, id_usuario, cor, icone]
            const categoria = await BD.query(sql, valores)
            res.status(201).json('Categoria Cadastrada')
        } catch (error) {
            console.error("Erro ao criar categoria:", error);
            res.status(500).json({ message: "Erro ao criar categoria", error: error.message });
        }
    }
    static async listar(req, res) {
        try {
            const resultado = await BD.query(`SELECT * From categorias`);
            res.json({ categorias: resultado.rows });
        } catch (error) {
            res.status(500).json({ mensagem: 'Erro ao buscar categorias', erro: error.message });
        }
    }
    static async listarPorId (req, res) {
        const { id } = req.params
        try{
            const categoria= await BD.query(`SELECT * FROM categorias WHERE id_categoria = $1`, [id]);
        res.status(200).json(categoria.rows[0]);
        }catch(error){
            res.status(500).json({message:  "Erro ao consultar categoria",  error: error.message})
        }
    }

    // Função atualizar
    static async atualizarTodas(req, res) {
        const { id_categoria } = req.params
        const { nome, tipo_transacao, gasto_fixo, ativo, id_usuario, cor, icone } = req.body;

        try {
            const categoria = await BD.query('UPDATE categorias SET nome = $1, tipo_transacao = $2, gasto_fixo = $3 , ativo = $4, id_usuario = $5, cor = $6, icone = $7 where id_categoria = $8',
                [nome, tipo_transacao, gasto_fixo, ativo, id_usuario, id_categoria, cor, icone]// comando SQL para atualizar o usuario
            )
            res.status(200).json(categoria.rows[0])
        } catch (error) {
            res.status(500).json({ message: "Erro ao consultar categorias", error: error.message })
        }
    }

    static async atualizar(req, res) {
        const {id_categoria} = req.params
        const { nome, tipo_transacao, gasto_fixo, ativo, id_usuario, cor, icone } = req.body;

        try {
            const campos = [];
            const valores = [];

            if (nome !== undefined) {
                campos.push(`nome = $${valores.length + 1}`)
                valores.push(nome);
            }

            if (tipo_transacao !== undefined) {
                campos.push(`tipo_transacao = $${valores.length + 1}`)
                valores.push(tipo_transacao);
            }

            if (gasto_fixo !== undefined) {
                campos.push(`gasto_fixo = $${valores.length + 1}`)
                valores.push(gasto_fixo);
            }

            if (ativo !== undefined) {
                campos.push(`ativo = $${valores.length + 1}`)
                valores.push(ativo);
            }

            if (id_usuario !== undefined) {
                campos.push(`id_usuario = $${valores.length + 1}`)
                valores.push(id_usuario);
            }

            if (cor !== undefined) {
                campos.push(`cor = $${valores.length + 1}`)
                valores.push(cor);
            }

            if (icone !== undefined) {
                campos.push(`icone = $${valores.length + 1}`)
                valores.push(icone);
            }

            if (campos.length === 0) {
                return res.status(400).json({ message: 'Nenhum campo fornecido para atualizar' })
            }

            const query = `UPDATE categorias SET ${campos.join(',')} WHERE id_categoria = ${id_categoria} RETURNING *`
            const categoria = await BD.query(query, valores)

            if (categoria.rows.length === 0) {
                return res.status(404).json({ message: 'Categoria não encontrada' })
            }
            return res.status(200).json(categoria.rows[0]);
        }
        catch (error) {
            res.status(500).json({ message: "Erro ao atualizar o categoria", error: error.message })
        }
    }
    static async deletar(req, res) {
        const { id_categoria } = req.params

        try {
            const categoria = await BD.query('UPDATE categorias SET ativo = false where id_categoria = $1',
                [id_categoria]// comando SQL para atualizar o usuario
            )
            res.status(200).json(categoria.rows[0])
        } catch (error) {
            res.status(500).json({ message: "Erro ao consultar categorias", error: error.message })
        }
    }

    // FILTRAR POR TIPO DE CATEGORIA 
    static async filtrarCategoria(req, res) {
        // O valor será enviado por parâmetro na url, deve ser enviado dessa maneira
        // ? tipo_transação=entrada
        const { tipo_transacao } = req.query ;
        
        try {
            const filtros = [];
            const valores = [];

            if(tipo_transacao){
                filtros.push(`tipo_transacao = $${valores.length + 1}`);
                valores.push(tipo_transacao);

            }
            const query = `
            SELECT * FROM categorias
            ${filtros.length ? `WHERE ${filtros.join(" AND ")} and ativo = true` : ""}
            ORDER BY id_categoria DESC
            `

            const resultado = await BD.query(query, valores)
        }catch(error) {
            
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

export default rotasCategorias;