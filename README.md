# wishlist

Aplicação estática sem backend ou Python, com armazenamento local e backup remoto opcional pelo JSONBin. Novos produtos entram pela extensão; categorias, listas, prioridades e histórico ficam no navegador. Imagens continuam sendo URLs da loja e o compartilhamento continua sendo uma cópia no link.

## Executar e publicar

```sh
docker compose up --build
```

Abra http://127.0.0.1:8000/ no mesmo perfil usado anteriormente. O contêiner contém apenas Nginx e os arquivos estáticos.

No GitHub Pages, publique `index.html`, `wishlist.html`, `shared.html` e a pasta `assets/`, mantendo a estrutura. A aplicação principal é index.html. wishlist.html é apenas um redirecionamento de compatibilidade que preserva envios da extensão. Não copie o código de index.html para wishlist.html.

O cadastro permanece na chave wishlist.v2 e é compatível com os backups anteriores. Mudar domínio, protocolo, porta ou perfil do navegador muda o armazenamento: exporte antes e importe no endereço novo. A migração não instala extensões nem publica um site automaticamente.

## Instalar a extensão

- Firefox: about:debugging → Este Firefox → Carregar extensão temporária → `extenssion/firefox/manifest.json`. Feche as abas antigas da Wishlist e recarregue o pacote após atualizá-lo. A carga temporária termina ao reiniciar o navegador. A instalação permanente no Firefox padrão exige assinatura da Mozilla.
- Chrome: chrome://extensions → ative Modo do desenvolvedor → Carregar sem compactação → selecione a pasta `extenssion/chrome`. Atualize pelo botão de recarregar da extensão.

Estes são pacotes para desenvolvimento, não pacotes publicados nas lojas. O código comum está na raiz de extenssion; as subpastas firefox e chrome são geradas e são as pastas que devem ser carregadas.

Abra Configurar endereço da Wishlist no popup, informe `https://SEU-USUARIO.github.io/SEU-REPOSITORIO/` e salve. Também são aceitos caminhos HTTPS para wishlist.html e HTTP em localhost. Credenciais, parâmetros e fragmentos não são aceitos no destino.

Permissões: activeTab e scripting para capturar a página após seu clique; storage para preferências e rascunhos; tabs para identificar e reaproveitar a aba correta da Wishlist. Não são solicitadas permissões permanentes para ler o conteúdo de todas as páginas. Os produtos e rascunhos ficam localmente; não há serviço de coleta. Confira o endereço de destino antes de enviar.

## Captura, rascunhos e atualização

1. Abra a página do produto e clique em Capturar página.
2. Confira os candidatos de preço, a moeda e o preço total, não uma parcela. A extensão distingue números estruturados de textos com formato local e avisa quando há ofertas divergentes.
3. Marque a confirmação do preço e envie.
4. A extensão tenta reaproveitar a aba configurada da Wishlist. Se não encontrar uma aba correspondente, abre outra. Uma aba lembrada que tenha navegado para outro site não é reutilizada.
5. Confira categorias/listas e salve na aplicação.

Até 20 rascunhos recentes são preservados por URL no armazenamento da extensão. Use Rascunhos recentes para retomar e Descartar rascunho para remover o produto atual. O último rascunho não é apagado ao enviar, pois o envio não significa que o formulário da aplicação foi salvo.

A recaptura da mesma URL abre uma comparação entre preço salvo e capturado. Você escolhe atualizar preço/moeda, URL da imagem e/ou observações. Nome, categoria e vínculos são preservados. Depois de aplicar ao formulário, é necessário salvar. Links diferentes continuam sendo produtos diferentes, incluindo parâmetros de variação.

No menu do produto, Histórico de preços mostra até 200 registros. Alterar categoria sem alterar preço não cria um novo preço. Atualizações manuais usam a data da alteração; recapturas usam a data enviada pela extensão. O histórico anterior à adoção desta versão só pode ser reconstruído a partir do preço e da data que estavam salvos.

A captura ainda depende do conteúdo da loja e não garante todos os sites. Não há monitoramento de preços em segundo plano. Imagens WebP são suportadas, mas URLs bloqueadas/expiradas podem ficar indisponíveis; nenhuma cópia local da foto é criada.

## Proteção dos dados e concorrência

As gravações usam Web Locks no mesmo endereço e comparam o estado original com o persistido. Uma aba desatualizada não sobrescreve a outra. Sem edição aberta, mudanças de outra aba são recebidas automaticamente. Se houver edição aberta, a gravação será interrompida para conferência; campos de produto que você não alterou são atualizados com o dado mais recente. Quando ambas as abas alteram o mesmo campo, é necessário conferir os valores e marcar a confirmação antes de tentar salvar novamente.

Use Firefox ou Chrome atualizado em HTTPS ou localhost; o modo file:// não é suportado. Se Web Locks não estiver disponível, o aplicativo recusa gravar para não oferecer uma garantia falsa de concorrência.

Quando o armazenamento falha ou fica cheio, não aparece sucesso: o formulário permanece aberto e o cadastro persistido é mantido. Um cadastro inválido bloqueia sobrescritas. Preferências → Exportar backup baixa o original para recuperação. Para restaurar nesse estado, importe um backup válido, confirme a substituição e guarde o original que será baixado. Arquivos de backup e o cadastro são limitados a 10 MB. Os limites estruturais são 20.000 produtos, 500 listas e 200 preços por produto; o limite real do navegador pode ser menor.

O armazenamento continua local, sem sincronização entre computadores. Faça backups regularmente. A extensão e a aplicação usam armazenamentos diferentes.

## Prioridades e desempenho

O menu Mover para posição funciona com toque e teclado sem precisar arrastar. O arraste de desktop mantém a prévia e os atalhos Alt + ↑/↓. Prioridades gerais e por lista continuam independentes.

As telas usam índices por ID e posições em memória. Produtos são mostrados em lotes de 60; Mostrar mais carrega o próximo lote. A busca encontra itens do catálogo inteiro. Para mover além dos produtos carregados, use Mover para posição ou Gerenciar prioridades. Categorias e totais usam todos os produtos do escopo.

## Compartilhamento

O recurso permanece como cópia em `shared.html#snapshot=...`, sem revogação, expiração ou atualização automática. O link contém dados legíveis, não criptografados. O limite continua em 32 mil caracteres e 1.000 produtos. Um link localhost não permite acesso remoto; use hospedagem HTTPS para compartilhar com outras pessoas. Nenhuma exportação HTML adicional ou armazenamento local de fotos foi adicionado.

## Estrutura e desenvolvimento

```text
index.html                  aplicação principal
wishlist.html               redirecionamento de compatibilidade
shared.html                 visualizador da cópia compartilhada
assets/app.css              estilos da aplicação
assets/js/schema.js         validação e transporte versionado comuns
assets/js/storage.js        gravação com bloqueio e detecção de conflitos
assets/js/products.js       modelo, migração, categorias e importação
assets/js/app.js             interface e fluxos
assets/js/theme*.js          aparência
extenssion/                 fontes, manifests e testes da extensão
extenssion/firefox/          pacote Firefox gerado
extenssion/chrome/           pacote Chrome gerado
scripts/                    geração e execução de testes
```

Node é usado somente em desenvolvimento:

```sh
node scripts/build-extension.cjs
node scripts/test.cjs
```

Após editar schema.js, prices.js ou fontes da extensão, gere os dois pacotes antes de entregar. O gerador sincroniza o parser injetado na página e a validação compartilhada; não há eval na captura. Os testes cobrem migração, prioridades, temas, duplicados, preço/WebP, UTF-8, concorrência, quota, recuperação, rascunhos, fluxo das duas APIs e lotes de 1.000 produtos. Os fluxos de APIs de extensão são simulados nos testes; instalação nas lojas e assinatura não fazem parte deles.

## Testar promoções

Abra uma lista ou Todos os produtos → Opções da lista → Testar promoção. A simulação usa os produtos completos do escopo, independentemente da busca/filtros da tela principal. Por padrão considera somente pendentes; é possível incluir comprados e mostrar somente elegíveis.

- Valor fixo: informe o desconto e o preço mínimo de cada produto. Ex.: R$ 30 de desconto, mínimo de R$ 100; um produto de R$ 100 fica por R$ 70 e um de R$ 99,99 não recebe desconto.
- Porcentagem: informe o percentual (até 100%), o teto do desconto por produto e o mínimo. Ex.: 30%, teto R$ 40, mínimo R$ 100; um produto de R$ 100 fica por R$ 70 e um de R$ 200 fica por R$ 160.

O mínimo é inclusivo e comparado ao preço original. O preço final nunca fica negativo. Os descontos são arredondados por produto para centavos. A moeda selecionada não é convertida: produtos em outra moeda e produtos sem preço são identificados e ficam fora dos totais. Produtos abaixo do mínimo continuam nos totais dessa moeda com o preço original. A opção Mostrar somente elegíveis altera apenas a exibição, não o escopo dos totais.

O cálculo é por produto, sem frete e sem acumular promoções. Os totais somam simulações individuais, não garantem que um cupom possa ser usado várias vezes no mesmo pedido. Os valores são recalculados enquanto você preenche; Recalcular também está disponível. Nada é gravado no cadastro, no histórico ou no compartilhamento. Os parâmetros ficam apenas no formulário da aba e são reiniciados ao recarregar. Resultados são mostrados em lotes de 50.

Teste adicional: `node tests/promotions.cjs`; o comando `node scripts/test.cjs` inclui os 11 grupos de testes.

## Metas, orçamento, notas e ofertas do mesmo produto

Editar produto possui Preço desejado, Notas pessoais e Oferta do mesmo produto de. A meta é comparada ao preço salvo na mesma moeda, incluindo igualdade. A marca Meta atingida aparece quando a condição é satisfeita; ela é reavaliada ao recapturar ou editar o preço. Não há monitoramento automático. Ofertas agrupadas na mesma moeda compartilham a meta: editar ou remover a meta de uma oferta atualiza as outras ofertas desse grupo e moeda.

Em Editar lista, informe Orçamento da lista e sua moeda. Deixar vazio remove o limite; zero é um limite válido. O painel mostra uso, saldo ou excesso dos produtos pendentes, contando somente a menor oferta por produto na moeda escolhida. Itens sem preço e outras moedas são sinalizados, sem conversão. Cada lista pode ter orçamento e notas próprios.

Opções da lista → Planejar compras usa o orçamento salvo como sugestão inicial. Também funciona em Todos os produtos com orçamento informado na hora. O plano segue a primeira prioridade de cada grupo no escopo, escolhe a menor oferta pendente naquela moeda e pula o que não couber no saldo. É um planejamento por prioridade, não uma busca pela maior quantidade de compras. É possível restringir a produtos que atingiram a meta. Usa preços salvos, sem frete nem promoções simuladas, e não altera o cadastro. Os resultados são mostrados em lotes de 100.

### Vincular uma promoção/oferta recebida da extensão

No popup, Como cadastrar permite Novo produto ou atualizar pela URL e Nova oferta de um produto existente. Na segunda opção, você pode informar nome ou URL do produto principal como dica de busca. Ao enviar, a aplicação mostra uma seleção dos produtos existentes: confirme o produto e revise o formulário antes de salvar. A extensão não precisa ler o armazenamento do site ou baixar seu catálogo para oferecer esse fluxo. A escolha e a dica também são preservadas no rascunho.

- Mesma URL já cadastrada: abre a comparação de atualização de preço e mantém o histórico daquela oferta. Não cria uma duplicata.
- URL diferente: pode ser associada como nova oferta/promoção do mesmo produto. Cada URL mantém seu preço, imagem, notas e histórico. A associação só é gravada ao salvar.
- Você também pode associar ou separar uma oferta em Editar produto. Ao vincular uma oferta nova, o formulário seleciona as listas do produto associado para sua conferência e herda a meta quando a moeda coincide e o campo está vazio.

Comparar ofertas, no menu do produto, mostra as lojas e destaca a menor oferta pendente por moeda. Totais, orçamento e planejador contam uma alternativa por grupo e moeda, sem somar várias lojas como compras separadas. A oferta precisa pertencer à lista para entrar no cálculo dela; o comparador pode mostrar todas as ofertas globais do grupo. Marcar comprado/pendente é uma ação do produto agrupado e atualiza suas ofertas. As prioridades continuam por card e por lista; o planejador usa a primeira ocorrência do grupo como prioridade. A composição de categorias continua baseada nos cards presentes.

Notas são separadas da descrição da loja. Estão disponíveis no formulário e no menu de produtos/listas; são salvas localmente e incluídas no backup. Notas, metas e orçamento não entram no link público. O agrupamento das ofertas entra na cópia pública para que o total não some alternativas em dobro. Backups antigos ganham campos vazios sem perder os dados originais.

Após atualizar, feche as abas antigas da aplicação e recarregue os pacotes Firefox/Chrome (versão 3.2.0). Publique novamente index.html, shared.html e a pasta assets/ no GitHub Pages. Testes: `node scripts/test.cjs` executa 12 grupos.

## Backup e recuperação via JSONBin

Preferências → Salvar / recuperar JSONBin. Esta integração continua sendo estática e funciona no GitHub Pages: a API v3 permite CORS. Ela não substitui o armazenamento local. O backup remoto contém todo o cadastro normalizado: produtos/ofertas, listas, prioridades, notas, metas, orçamento e histórico; não inclui preferências, rascunhos da extensão ou a chave da API.

### Configurar

1. Na sua conta JSONBin, gere uma Access Key com leitura/atualização. Habilite criação apenas se pretende criar o Bin pelo aplicativo. Master Key também é aceita, mas dá acesso mais amplo à conta.
2. Na Wishlist, escolha o tipo de chave e informe a chave. Para uma cópia existente, informe também o ID do Bin privado. Para começar outra cópia, deixe o ID vazio e use Criar Bin privado. Guarde o ID retornado.
3. Em um segundo navegador/dispositivo, informe a chave e o mesmo ID e clique em Recuperar do JSONBin. Confira a prévia antes de mesclar ou restaurar.
4. Para enviar mudanças locais, use Enviar alterações. O backup automático é opcional: marque a opção e confirme em Guardar configuração.

Por padrão a chave permanece na memória desta aba. Lembrar a chave neste navegador é opcional e usa localStorage sem criptografia. Quem tiver acesso ao perfil, ou scripts executados nesta origem, pode acessar a chave lembrada. Nunca coloque chaves em arquivos, commits, URL ou GitHub Pages. Esquecer chave apaga a credencial lembrada e desativa o automático; não apaga o Bin. A revogação real da chave deve ser feita na conta JSONBin.

### Otimizações e limites

- Um Bin para o cadastro completo, com produtos compartilhados por ID entre as listas. O JSON é minificado.
- SHA-256 de uma representação canônica: sem alterações locais em relação ao último estado confirmado, o aplicativo não faz GET nem PUT. Isso não significa que consultou mudanças feitas em outro dispositivo; use Recuperar para isso.
- Compressão gzip + base64 quando o cadastro passar de 2 KB e a representação completa ficar pelo menos 10% menor. Caso contrário usa JSON compacto. O Bin guarda um envelope versionado wishlist-jsonbin; a recuperação decodifica o conteúdo automaticamente. Também aceita cadastro v2 em JSON puro. Gzip não é criptografia.
- Automático espera 5 segundos sem alterações salvas localmente; múltiplas alterações próximas geram um único envio. Não há polling. Erros pausam o automático até uma operação manual bem-sucedida; envios incertos não são repetidos automaticamente.
- Antes de escrever um estado diferente, consulta /latest e compara com a base conhecida. Divergência abre a prévia remota e interrompe a gravação. Web Locks serializa envios de abas da mesma origem. Entre dispositivos, a conferência GET/PUT não é atômica: existe uma janela de corrida. Evite editar simultaneamente em dispositivos diferentes.
- PUT solicita X-Bin-Versioning:true. O serviço documenta um limite de versões; isso não elimina a necessidade de backups locais.
- A UI oferece limites conservadores de corpo HTTP de 100.000 e 1.000.000 bytes: escolha conforme seu plano. A documentação consultada informa 100 KB no gratuito e até 1 MB no Pro para Bins normais; o JSONBin pode alterar planos/limites. XL Bins não são usados. A descompressão e restauração têm teto de 10 MB.

### Recuperar com controle

Recuperar apenas consulta e mostra a quantidade de ofertas/listas; não altera os dados locais. Mesclar adiciona dados ausentes e une membros de listas com o mesmo ID, preservando valores locais dos registros existentes. Repetir a mesma mesclagem não duplica listas ou ofertas. Restaurar substituindo o local baixa primeiro o JSON local para recuperação e então tenta gravar o remoto com as proteções normais do aplicativo. Usar local no Bin remoto baixa a cópia remota anterior, confere novamente sua assinatura e envia o cadastro local. Nenhuma opção apaga Bins pela API.

A cópia completa inclui notas pessoais no Bin privado. Isso é diferente do link público de compartilhamento, que continua omitindo notas. As chamadas usam apenas https://api.jsonbin.io/v3/b, com autenticação em X-Access-Key ou X-Master-Key, sem cookies e sem seguir redirecionamentos. Falhas de autenticação, limite, rede, privacidade, tamanho e formato são exibidas sem registrar a chave.

Testes: node scripts/test.cjs inclui 14 grupos. As chamadas JSONBin foram testadas com respostas simuladas (criação, leitura, atualização, conflitos, privacidade, erros, compressão e restauração); a validação da sua conta real exige inserir sua chave na aplicação. Nenhum Bin real é criado nos testes.

Referências oficiais consultadas:
- https://jsonbin.io/api-reference
- https://jsonbin.io/api-reference/bins/create
- https://jsonbin.io/api-reference/bins/read
- https://jsonbin.io/api-reference/bins/update
- https://jsonbin.io/api-reference/access-keys/get-started
