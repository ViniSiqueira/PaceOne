const { gerarMensalidades } = require("../jobs/gerarMensalidades");
const cron = require('node-cron');

cron.schedule('0 6 1 * *', async () => {
//cron.schedule('* * * * *', async () => {
    try {
        const r = await gerarMensalidades({});
        console.log(`[CRON] Mensalidades geradas:`, r);
    } catch (err) {
        console.error('[CRON] Erro ao gerar mensalidades:', err);
    }
});