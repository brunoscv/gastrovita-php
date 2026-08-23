<?php

/*
|--------------------------------------------------------------------------
| Variante B — usar só quando o painel da hospedagem NÃO permitir apontar
| o domínio direto pra pasta public/, e o document root ficar preso na
| raiz do public_html.
|--------------------------------------------------------------------------
|
| Esse arquivo substitui public/index.php quando ele é movido pra raiz do
| public_html junto com o .htaccess desta mesma pasta. A única diferença
| pro index.php original é o caminho do bootstrap: como este arquivo passa
| a ficar na mesma pasta do projeto (não mais dentro de public/), o require
| não sobe mais um nível.
|
| Ver DEPLOY.md para o passo a passo completo de quando usar esta variante.
|
*/

$app = require __DIR__.'/bootstrap/app.php';

$app->run();
