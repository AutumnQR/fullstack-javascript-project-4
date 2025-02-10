#!/usr/bin/env node
import { Command } from 'commander';
import savePage from '../src/index.js';

const program = new Command();

program
    .name('page-loader')
    .description('Page loader utility')
    .arguments('<url>')
    .option('-V, --version', 'output the version number')
    .option('-o, --output [dir]', 'output dir', process.cwd())
    .action((url) => {
        const options = program.opts();
        savePage(url, options.output).then((path, error) => {
            if (error) throw new Error('error')
            console.log(path)
        })
    });

program.parse();
