// C reate | R ead | U pdate   | D elete
// Post    | Get   | Put/Patch | Delete

describe('Teste Api de Livros, usando CRUD', () => {
    it('Deve Criar o Livro, Buscar, Atualizar e Deletar', () => {

        // Declarando a variavel que vai armazenar o id do livro
        // Use 'let' para que o valor possa ser alterado
        let livro_id;

        // Criando a variavel com informações do novo livro
        const novolivro = {
            "titulo": "Bloodborne Official Artworks",
            "autor": "FromSoftware",
            "editora": "UDON Entertainment",
            "anoPublicacao": 2017,
            "numeroPaginas": 256
        };

        const livroAtualizado = {
            "titulo": "Grimoire Nier - World Guide",
            "autor": "Square Enix",
            "editora": "Square Enix",
            "anoPublicacao": 2010,
            "numeroPaginas": 128
        };

        // 1. CREATE 'POST' - Adicionando o livro
        cy.api({
            url: 'http://localhost:3000/api/books', // Endereço da API
            method: 'POST', // Metodo: POST
            body: novolivro // Corpo da requisição
        })
        .then((response) => {
            // Captura o ID do livro criado e armazena na variável 'livro_id'
            livro_id = response.body._id;

            // Validações do POST
            expect(response.status).to.eql(201);
            expect(response.body.titulo).to.eql(novolivro.titulo);
            expect(response.body._id).to.not.be.null;

            // 2. READ 'GET' - Buscando o livro
            cy.api({
                method: 'GET',
                url: `http://localhost:3000/api/books/${livro_id}`,
            })
            .then((getResponse) => {
                expect(getResponse.status).to.eql(200);
                expect(getResponse.body._id).to.eql(livro_id);
                expect(getResponse.body.titulo).to.eql(novolivro.titulo);

                // 3. UPDATE 'PUT' - Atualizando o livro
                cy.api({
                    method: 'PUT',
                    url: `http://localhost:3000/api/books/${livro_id}`, // Adiciona o ID na URL
                    body: livroAtualizado
                })
                .then((putResponse) => {
                    expect(putResponse.status).to.eql(200);
                    expect(putResponse.body.titulo).to.eql(livroAtualizado.titulo);

                    // 4. DELETE 'DELETE' 
                    cy.api({
                        method: 'DELETE',
                        url: `http://localhost:3000/api/books/${livro_id}`
                    })
                    .then((deleteResponse) => {
                        expect(deleteResponse.status).to.eql(204);
                        expect(deleteResponse.body).to.be.empty;

                        // 5. GET (final) - Validando que o livro foi deletado
                        cy.api({
                            method: 'GET',
                            url: `http://localhost:3000/api/books/${livro_id}`,
                            failOnStatusCode: false // Permite que o teste continue com status 404
                        })
                        .then((finalGetResponse) => {
                            expect(finalGetResponse.status).to.eql(404);
                        });
                    });
                });
            });
        });
    });
});