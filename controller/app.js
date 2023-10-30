const express = require("express");
const bodyParser = require('body-parser');
const Db = require('../config/db'); // Importa a classe de conexão com o banco
const cors = require('cors');
const app = express();


app.use(cors());

// Configurar body-parser para analisar solicitações JSON
app.use(bodyParser.json());

class PlayersController {
    constructor() {
        this.db = new Db();
    }

    // Função para ADICIONAR um jogador
    async addPlayers(req, res) {

        console.log('Função adicionar jogador:', req.body);

        try {
            const { nome_jogador, habilidade_principal } = req.body;

            const results = await this.db.query('INSERT INTO jogadores (nome_jogador, habilidade_principal) VALUES (?, ?)',
             [nome_jogador, habilidade_principal]);

            res.json({ codigo_jogador: results.insertId, nome_jogador, habilidade_principal });

        } catch (error) {
            console.error('Erro ao adicionar jogador:', error);
            res.status(500).json({ error: 'Erro ao adicionar jogador. ' + error });
        }
    }

    // Função para BUSCAR um jogador por Nome
    async searchPlayersName(req, res) {

        console.log('Função BUSCAR um jogador por Nome', req.query);

        try {
            const { nome } = req.query;
            if (nome && nome.trim() !== '') {
                const searchQuery = '%' + nome + '%'; 
                
                const results = await this.db.query('SELECT * FROM jogadores WHERE nome_jogador LIKE ?', [searchQuery]);

                res.json({ players: results });
            } else {
                res.status(400).json({ error: 'Parâmetro "nome" é obrigatório.' });
                console.log({ error: 'Parâmetro "nome" é obrigatório.' })
            }
        } catch (error) {
            console.error('Erro ao buscar jogadores:', error);
            res.status(500).json({ error: 'Erro ao buscar jogadores. ' + error });
        }
    }

    //Função para buscar jogador por ID
    async searchPlayersId(req, res) {

        console.log('Função BUSCAR um jogador por id', req.query);

        try {
            const { id } = req.query;
            if (id && id.trim() !== '') {
                const searchQuery = id; 
                
                const results = await this.db.query('SELECT * FROM jogadores WHERE codigo_jogador LIKE ?', [searchQuery]);

                res.json({ players: results });
            } else {
                res.status(400).json({ error: 'Parâmetro "id" é obrigatório.' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Erro ao buscar jogadores. ' + error });
        }
    }

     // Função para ATUALIZAR um jogador
     async updateplayers(req, res) {
        const { habilidade_principal } = req.body;
        const { id } = req.body;
    
        console.log('Função adicionar jogador:', req.body);
        
        try {

            const results = await this.db.query('UPDATE jogadores SET habilidade_principal = ? WHERE codigo_jogador = ?', [habilidade_principal, id]);
    
            if (results.affectedRows > 0) {
                res.status(200).json({ mensagem: 'Jogador atualizado com sucesso.' });
            } else {
                res.status(404).json({ error: 'Jogador não encontrado.' });
            }
        } catch(error) {
            console.error(error);
            res.status(500).json({ error: `Erro ao atualizar jogador. Error: ${error.message}` });
        }
    }

    // Função para DELETAR um jogador
    async deleteplayer (req, res) {

        const { id } = req.params;

        console.log('Função Deletar um jogador por id', req.params);

        try{
            const results = await this.db.query('DELETE FROM jogadores WHERE codigo_jogador = ?', [id]);

            if (results.affectedRows > 0) {
                res.json({ message: 'Jogador removido com sucesso.' });
            } else {
                res.status(404).json({ error: 'Jogador não encontrado.' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: `Erro ao excluir jogador. Error: ${error.message}` });
        }
    }


    async allsearch(req, res) {
        try {

            const results = await this.db.query('SELECT codigo_jogador AS "Id do Jogador", nome_jogador AS "Nome", habilidade_principal AS "Habilidade principal" FROM jogadores');
            
            res.json({ players: results });

        } catch (error) {
            console.error('Erro ao buscar jogadores:', error);
            res.status(500).json({ error: 'Erro ao buscar jogadores. ' + error });
        }
    }
   
}

module.exports = PlayersController;
