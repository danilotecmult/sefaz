const { Builder, By, Key, until } = require('selenium-webdriver');
const readline = require('readline');

// Cria uma interface de leitura para entrada do usuário
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Função para solicitar manualmente o texto do captcha
function promptCaptcha() {
    return new Promise((resolve) => {
        rl.question('Por favor, insira manualmente o texto do captcha: ', (captchaText) => {
            resolve(captchaText);
        });
    });
}

// Função assíncrona para executar o script
async function automateNFS() {
    // Inicializa o WebDriver para o Chrome
    let driver = await new Builder().forBrowser('chrome').build();

    try {
        // Navega até o site da prefeitura de Salvador
        await driver.get('https://nfse.salvador.ba.gov.br/');

        // Digita o CNPJ
        await driver.findElement(By.id('txtLogin')).sendKeys('41.976.501/0001-95');

        // Digita a senha
        await driver.findElement(By.id('txtSenha')).sendKeys('segura20');

        // Solicita manualmente o texto do captcha
        let captchaText = await promptCaptcha();
        console.log('Texto do Captcha fornecido:', captchaText);

        // Insere o texto do captcha
        await driver.findElement(By.id('tbCaptcha')).sendKeys(captchaText);

        // Espera manualmente que o usuário clique em "Acessar"
        console.log('Aguarde até que você clique em "Acessar" no navegador.');
        await new Promise(resolve => {});

        // Espera até que a próxima página seja carregada
        await driver.wait(until.urlContains('pagina-de-destino'), 30000); // Aumentado para 30 segundos

        // Espera até que o botão "Consulta NFS-e" seja clicável
        await driver.wait(until.elementLocated(By.id('pnPrestador')), 10000);

        // Clica em "Consulta NFS-e"
        await driver.findElement(By.id('pnPrestador')).click();

        // Aguarda até que as NFS-e recebidas sejam exibidas (pode ser necessário ajustar o seletor)
        await driver.wait(until.elementLocated(By.id('tableNfsRecebidas')), 10000);

        // Você pode adicionar mais ações aqui, como obter os dados das NFS-e recebidas
    } catch (error) {
        console.error('Ocorreu um erro:', error);
    } finally {
        // Fecha o navegador ao final da execução
        await driver.quit();
        // Fecha a interface de leitura
        rl.close();
    }
}

// Chama a função para iniciar a automação
automateNFS();
