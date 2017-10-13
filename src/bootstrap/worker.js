import fs from 'fs';

const viewPath = think.ROOT_PATH + '/view';
const dirnames = fs.readdirSync(viewPath);
think.config('locale.support', dirnames);