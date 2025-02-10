import nock from 'nock';
import { fileURLToPath } from 'url';
import path from 'node:path';
import fs from 'node:fs/promises';
import os from 'node:os';
import savePage from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const baseURI = 'https://ru.hexlet.io';

let tempDir;

async function pathExists(filePath) {
    return fs.access(filePath).then(() => true, () => false)
}

beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'page-loader-'));
});

afterEach(async () => {
    if (await pathExists(tempDir)) {
        await fs.rm(tempDir, { recursive: true, force: true });
    }
});

test('save page test', async () => {
    const expectedFilePath = path.join(tempDir, 'ru-hexlet-io-courses.html');
    nock(baseURI)
        .get('/courses')
        .replyWithFile(200, `${__dirname}/../__fixtures__/body.html`);

    await expect(savePage(`${baseURI}/courses`, tempDir)).resolves.toBe(expectedFilePath);

    const fileContent = await fs.readFile(expectedFilePath, 'utf-8');
    const expectedContent = await fs.readFile(`${__dirname}/../__fixtures__/body.html`, 'utf-8');
    expect(fileContent).toBe(expectedContent);
});

test('test filename generation', async () => {
    const url = `${baseURI}/special-path`;
    const expectedFileName = 'ru-hexlet-io-special-path.html';
    const expectedFilePath = path.join(tempDir, expectedFileName);
    nock(baseURI)
        .get('/special-path')
        .replyWithFile(200, `${__dirname}/../__fixtures__/body.html`);

    const filePath = await savePage(url, tempDir);
    console.log(expectedFileName);
    console.log(expectedFilePath);
    console.log(filePath)
    await expect(await pathExists(tempDir)).toBe(true);
    await expect(filePath).toBe(expectedFilePath)
});

test('test overwrite existing file', async () => {
    const filePath = path.join(tempDir, 'ru-hexlet-io-courses.html');
    await fs.writeFile(filePath, 'existing content');

    nock(baseURI)
        .get('/courses')
        .replyWithFile(200, `${__dirname}/../__fixtures__/body.html`);

    await savePage(`${baseURI}/courses`, tempDir);

    const fileContent = await fs.readFile(filePath, 'utf-8');
    const expectedContent = await fs.readFile(`${__dirname}/../__fixtures__/body.html`, 'utf-8');
    expect(fileContent).toBe(expectedContent);
});

beforeAll(() => {
    nock.cleanAll();
})
