import { BD } from "../db.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'

 const SECRET_KEY = "chave_api_gfp"
class rotasSubCategorias {
    static async nova(req, res) {
        const { nome, id_categoria, gasto_fixo, ativo} = req.body;
        try {
            const sql = `INSERT  INTO subcategorias(nome, id_categoria, gasto_fixo, ativo)
            VALUES ($1, $2, $3, $4)`
            const valores = [nome, id_categoria, gasto_fixo, ativo]
            const subcategoria = await BD.query(sql, valores)
            res.status(201).json('SubCategoria Cadastrada')
        } catch (error) {
            console.error("Erro ao criar subcategoria:", error);
            res.status(500).json({ message: "Erro ao criar subcategoria", error: error.message });
        }
    }
    static async listar(req, res) {
        try {
            const resultado = await BD.query(`SELECT * From subcategorias`);
            res.json({ subcategorias: resultado.rows });
        } catch (error) {
            res.status(500).json({ mensagem: 'Erro ao buscar subcategorias', erro: error.message });
        }
    }
    static async listarPorId (req, res) {
        const { id } = req.params
        try{
            const subcategoria= await BD.query(`SELECT * FROM subcategorias WHERE id_subcategoria = $1`, [id]);
        res.status(200).json(subcategoria.rows[0]);
        }catch(error){
            res.status(500).json({message:  "Erro ao consultar subcategoria",  error: error.message})
        }
    }

    // Função atualizar
    static async atualizarTodas(req, res) {
        const { id_subcategoria } = req.params
        const { nome, id_categoria, gasto_fixo, ativo } = req.body;

        try {
            const subcategoria = await BD.query('UPDATE subcategorias SET nome = $1, id_categoria = $2, gasto_fixo = $3 , ativo = $4 where id_subcategoria = $5',
                [nome, id_categoria, gasto_fixo, ativo, id_subcategoria]// comando SQL para atualizar o usuario
            )
            res.status(200).json(subcategoria.rows[0])
        } catch (error) {
            res.status(500).json({ message: "Erro ao consultar subcategorias", error: error.message })
        }
    }

    static async atualizar(req, res) {
        const {id_subcategoria} = req.params
        const { nome, id_categoria, gasto_fixo, ativo } = req.body;

        try {
            const campos = [];
            const valores = [];

            if (nome !== undefined) {
                campos.push(`nome = $${valores.length + 1}`)
                valores.push(nome);
            }

            if (id_categoria !== undefined) {
                campos.push(`id_categoria = $${valores.length + 1}`)
                valores.push(id_categoria);
            }

            if (gasto_fixo !== undefined) {
                campos.push(`gasto_fixo = $${valores.length + 1}`)
                valores.push(gasto_fixo);
            }

            if (ativo !== undefined) {
                campos.push(`ativo = $${valores.length + 1}`)
                valores.push(ativo);
            }

            if (campos.length === 0) {
                return res.status(400).json({ message: 'Nenhum campo fornecido para atualizar' })
            }

            const query = `UPDATE subcategorias SET ${campos.join(',')} WHERE id_subcategoria = ${id_subcategoria} RETURNING *`
            const subcategoria = await BD.query(query, valores)

            if (subcategoria.rows.length === 0) {
                return res.status(404).json({ message: 'Subcategoria não encontrada' })
            }
            return res.status(200).json(subcategoria.rows[0]);
        }
        catch (error) {
            res.status(500).json({ message: "Erro ao atualizar o subcategoria", error: error.message })
        }
    }
    static async deletar(req, res) {
        const { id_subcategoria } = req.params

        try {
            const subcategoria = await BD.query('UPDATE categorias SET ativo = false where id_categoria = $1',
                [id_subcategoria]// comando SQL para atualizar o usuario
            )
            res.status(200).json(subcategoria.rows[0])
        } catch (error) {
            res.status(500).json({ message: "Erro ao consultar subcategorias", error: error.message })
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

export default rotasSubCategorias;