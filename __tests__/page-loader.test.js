import nock from 'nock';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import * as fs from 'fs';
import savePage from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const expectedFilePath = path.join(process.cwd(), 'ru-hexlet-io-courses.html');

const baseURI = 'https://ru.hexlet.io'
const filePath = path.join(process.cwd(), 'ru-hexlet-io-courses.html');

beforeEach(() => {
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
});

afterEach(() => {
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
});


nock(baseURI)
    .get('/courses')
    .replyWithFile(200,  `${__dirname}/../__fixtures__/body.html`);

nock(baseURI)
    .get('/undefined')
    .replyWithError('page is undefined')
test('save page test', async () => {
    await expect(savePage(`${baseURI}/courses`, process.cwd())).resolves.toBe(expectedFilePath);
})

test('test page with error', async () => {
    await expect(savePage(`${baseURI}/undefined`, process.cwd()))
        .rejects.toThrow('Request failed with status code 404');
});


beforeAll(() => {
    nock.cleanAll();
})
