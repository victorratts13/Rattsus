![Rattsus](https://i.imgur.com/rsIeQTm.png)
![Version](https://img.shields.io/badge/Version-1.0-green)

# Introdução

Rattsus é um sistema de autotrade basico de criptomoedas e Forex, que ultiliza a estrategia de cruzamento de medias com RSI. Desenvolvido em JS para rodar em servidores NodeJS, o Rattsus tem estabilidade e precisão no calculo da estrategia e no envio de ordens. Atualmente o sistema suporta:

>- Binance
>- Bitmex
>- Poloniex
>- MT5

## Requisitos

>- NODEjs = 12.1 ou Maior
>- NPM = 6 ou Maior

# Configuração

Para fazer as configurações iniciais, (servidores Linux):
```sh
~# git clone https://github.com/victorratts13/Rattsus.git
```

Em seguida, entre no Diretorio Rattsus e escolha o sistema que deseja rodar. Ex: Binance
```sh
~# cd Rattsus/
~# cd Binance/
```

Apos isso, Execute o NPM para instalar as Dependencias:

```sh
~# npm install
```

por fim edite o arquivo ./config/config.js 

```js
let configs = {
    apiKey: 'api', //Sua api
    apiSecret: 'secret', // Sua chave api
```
Basta Executar npm start para iniciar o bot ou npm test para testar a conexão

```sh
~# npm start
```



