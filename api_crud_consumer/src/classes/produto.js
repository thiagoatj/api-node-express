// Classe Produto
class Produto {
constructor(nome='', qtdeEstoque='', preco=0, _idFornFK=null) {
this.nome = nome;
this.qtdeEstoque = qtdeEstoque;
this.preco = preco;
this._idFornFK = _idFornFK;
}
}
module.exports = Produto;