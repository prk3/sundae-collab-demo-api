import makeApp from './app';
import connect from './db';

require('dotenv').config();

const PORT = Number(process.env.PORT);
const app = makeApp(connect());

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
