const vm = new Vue({
  el: "#app",
  data:{
    produtos: [],
    carrinho: [],
    produto: false,
    carrinhoAtivo: false,
    mensagemAlerta: "Item Adicionado",
    alertaAtivo: false,
  },
  filters:{
    numeroPreco(valor){
      return valor.toLocaleString("pt-BR", { style: "currency", currency:"BRL"})
    }
  },
  computed:{
    carrinhoTotal(){
      total = 0;
      if(this.carrinho.length) this.carrinho.forEach(  item => {
        total += item.preco;
      });
      return total
    }
  },
  methods:{
    fetchProdutos(){
      fetch("./api/produtos.json")
      .then(res => res.json())
      .then(json => {
        this.produtos = json;
      })
    },
    fetchProduto(id){
      fetch(`./api/produtos/${id}/dados.json`)
      .then(r => r.json())
      .then(json => {
        this.produto = json;
      })
    },
    abrirModal(id){
      this.fetchProduto(id);
      window.scrollTo({
        top:0,
        behavior: "smooth"
      })
    },
    fecharModal({target, currentTarget}){
      if(target === currentTarget) this.produto = false;
    },
    clickForaCarrinho({target, currentTarget}){
      if(target === currentTarget) this.carrinhoAtivo = false;
    },
    adicionarItem(){
      this.produto.estoque--;
      const {id, nome, preco} = this.produto
      this.carrinho.push({id, nome, preco})
      this.alerta(`${nome} foi adicionado ao carrinho!`);

    },
    removerItem(index){
      this.carrinho.splice(index,1)
    },
    checarLocalStorage(){
      let localStorage = window.localStorage.carrinho;
      if(localStorage) this.carrinho = JSON.parse(localStorage);
    },
    compararEstoque(){
      const items = this.carrinho.filter( ({id}) => id === this.produto.id)
      this.produto.estoque -= this.produto.estoque;
      console.log(items)
    },
    alerta(msg){
      this.mensagemAlerta = msg;
      this.alertaAtivo = true;
      setTimeout(() => {
        this.alertaAtivo = false;
      }, 2000);
    },router(){
      const hash = document.location.hash;
      if(hash) this.fetchProduto(hash.replace("#",""))
    }
  },
  watch: {
    produto(){
      document.title = this.produto.id || "Techno";
      const hash = this.produto.id || ""; 
      history.pushState(null, null, `#${hash}`)
      if(this.produto) this.compararEstoque();
    },
    carrinho() {
      window.localStorage.carrinho = JSON.stringify(this.carrinho);
    }
  },
  created(){
    this.fetchProdutos();
    this.checarLocalStorage();
    this.router();
  }
})