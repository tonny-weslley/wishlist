# Extensão Wishlist

Carregue `firefox/manifest.json` no Firefox ou a pasta `chrome/` no Chrome. Configure a URL HTTPS da aplicação (ou HTTP em localhost), capture a página do produto, confira os preços e confirme antes de enviar. Rascunhos recentes são persistidos por URL.

A raiz desta pasta contém o código comum, manifests de origem e testes. As subpastas firefox/ e chrome/ contêm os pacotes instaláveis para desenvolvimento. Não edite os pacotes gerados: use `node scripts/build-extension.cjs` na raiz do projeto após alterar as fontes.

As permissões tabs, activeTab, scripting e storage permitem reaproveitar a aba da aplicação, capturar a página após seu clique e guardar preferências/rascunhos localmente. Não há backend ou coleta remota.

Firefox: about:debugging → Este Firefox → Carregar extensão temporária → firefox/manifest.json. Repetir após reiniciar; instalação permanente na versão padrão exige assinatura Mozilla.
Chrome: chrome://extensions → Modo do desenvolvedor → Carregar sem compactação → chrome/.

Consulte o README.md na raiz do projeto para configuração, limites, privacidade e recuperação de dados.

## Nova oferta de produto existente

Em Como cadastrar, escolha Nova oferta de um produto existente. Opcionalmente informe nome ou URL do produto principal. Ao enviar, confirme o produto na busca aberta pela Wishlist e salve o formulário. URLs diferentes ficam como ofertas do mesmo grupo; repetir a mesma URL abre a atualização do preço e histórico da oferta existente. A seleção e a dica ficam no rascunho. Atualize também os arquivos da aplicação para usar este fluxo.
