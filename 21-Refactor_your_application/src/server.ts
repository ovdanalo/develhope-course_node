import app from './app';
import 'dotenv/config';
import config from './config';

app.listen(config.PORT, () => {
    console.log(`[server] Server is running on port ${config.PORT}`)
})
