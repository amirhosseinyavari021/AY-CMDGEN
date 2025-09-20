#!/usr/bin/env node

// --- DOTENV SETUP (MUST BE AT THE VERY TOP) ---
const path = require('path');
const envPath = process.pkg
  ? path.join(path.dirname(process.execPath), '.env')
  : path.join(__dirname, '.env');
require('dotenv').config({ path: envPath });
// --- END DOTENV SETUP ---

const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const axios = require('axios/dist/node/axios.cjs');
const { spawn, execSync } = require('child_process');
const { TextDecoder } = require('util');
const os = require('os');
const { getSystemPrompt } = require('./apiService-cli.js');
const { parseAndConstructData } = require('./responseParser-cli.js');
const packageJson = require('./package.json');
const readline = require('readline');
const { app } = require('./server.js');

// --- OS & System Info Detection ---
const getSystemInfo = () => {
    const platform = process.platform;
    let detectedOS = 'linux';
    let detectedVersion = os.release();
    let detectedShell = 'sh';

    if (platform === 'win32') {
        detectedOS = 'windows';
        detectedVersion = os.release();
        if (process.env.PSModulePath) {
            detectedShell = 'PowerShell';
        } else {
            detectedShell = 'CMD';
        }
    } else if (platform === 'darwin') {
        detectedOS = 'macos';
        detectedVersion = execSync('sw_vers -productVersion').toString().trim();
        detectedShell = process.env.SHELL ? path.basename(process.env.SHELL) : 'zsh';
    } else { // Linux
        detectedOS = 'linux';
        try {
            const osRelease = execSync('cat /etc/os-release').toString();
            const versionMatch = osRelease.match(/^PRETTY_NAME="([^"]+)"/m);
            if (versionMatch) detectedVersion = versionMatch[1];
        } catch (e) { /* Fallback */ }
        detectedShell = process.env.SHELL ? path.basename(process.env.SHELL) : 'bash';
    }
    return { detectedOS, detectedVersion, detectedShell };
};

// --- Banner and Info ---
const showBanner = () => { /* ... unchanged ... */ };

// --- Server Management ---
const serverPort = 3003;
const serverHost = '127.0.0.1';
const serverUrl = `http://${serverHost}:${serverPort}`;

// --- Core API ---
const callApi = async ({ mode, userInput, os, osVersion, cli, lang, options = {} }) => {
    const systemPrompt = getSystemPrompt(mode, os, osVersion, cli, lang, options);
    const payload = { messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userInput }] };
    try {
        const response = await axios.post(`${serverUrl}/api/proxy`, payload, { responseType: 'stream' });
        let fullContent = '';
        const decoder = new TextDecoder();
        return new Promise((resolve, reject) => {
            response.data.on('data', (chunk) => {
                const textChunk = decoder.decode(chunk, { stream: true });
                const dataLines = textChunk.split('\n').filter(line => line.startsWith('data: '));
                for (const line of dataLines) {
                    const jsonPart = line.substring(5).trim();
                    if (jsonPart && jsonPart !== "[DONE]") {
                        try { fullContent += JSON.parse(jsonPart).choices[0].delta.content || ''; } catch (e) {}
                    }
                }
            });
            response.data.on('end', () => {
                const finalData = parseAndConstructData(fullContent, mode, cli);
                if (!finalData) reject(new Error("Parsing failed: The AI response was empty or malformed."));
                else resolve({ type: mode, data: finalData });
            });
            response.data.on('error', (err) => reject(err));
        });
    } catch (err) {
        const errorMessage = err.response?.data?.error?.message || err.message || "An unknown error occurred.";
        console.error(`\n❌ Error: ${errorMessage}`);
        return null;
    }
};

// --- Interactive Prompt ---
const promptForChoice = (commands, onExecute, onMore, onQuit) => { /* ... unchanged ... */ };

// --- Smart Command Execution ---
const executeCommand = (command) => { /* ... unchanged ... */ };

// --- Yargs Command Parser ---
const run = async () => {
    try {
        const { detectedOS, detectedVersion, detectedShell } = getSystemInfo();
        let server = app.listen(serverPort, serverHost);
        server.unref();

        const parser = yargs(hideBin(process.argv))
            .scriptName("cmdgen")
            .usage('Usage: $0 <command> "[input]" [options]')
            
            .command(
                ['generate <request>', 'g <request>'], 
                'Generate a command based on your request', 
                {}, 
                async (argv) => {
                    let currentCommands = [];

                    const getMoreSuggestions = async () => {
                        console.log("\n🔄 Getting more suggestions...");
                        const existing = currentCommands.map(c => c.command);
                        // --- FIX: Pass argv.request as userInput ---
                        const result = await callApi({ ...argv, userInput: argv.request, options: { existingCommands: existing }, mode: 'generate' });
                        if (result && result.data.commands && result.data.commands.length > 0) {
                            currentCommands.push(...result.data.commands);
                            handleSuggestions(result.data.commands, true);
                        } else {
                            console.log("\nCouldn't fetch more suggestions.");
                            process.exit(0);
                        }
                    };
                    
                    const handleSuggestions = (newSuggestions) => { /* ... unchanged ... */ };

                    // --- FIX: Pass argv.request as userInput ---
                    const initialResult = await callApi({ ...argv, userInput: argv.request, mode: 'generate' });
                    
                    if (initialResult && initialResult.data.commands && initialResult.data.commands.length > 0) {
                        currentCommands = initialResult.data.commands;
                        handleSuggestions(currentCommands);
                    } else {
                        process.exit(0);
                    }
                }
            )
            .command(['analyze <command>', 'a <command>'], 'Analyze and explain a command', {}, async (argv) => {
                // --- FIX for analyze command ---
                const result = await callApi({ ...argv, userInput: argv.command, mode: 'explain' });
                if (result) console.log(result.data.explanation);
                process.exit(0);
            })
            .command(['error <message>', 'e <message>'], 'Analyze an error message', {}, async (argv) => {
                // --- FIX for error command ---
                const userInput = `Error Message:\n${argv.message}` + (argv.context ? `\n\nContext:\n${argv.context}` : '');
                const result = await callApi({ ...argv, userInput: userInput, mode: 'error' });
                if (result) {
                    console.log(`\nProbable Cause: ${result.data.cause}\n\nExplanation: ${result.data.explanation}\n\nSolution:`);
                    result.data.solution.forEach(step => console.log(`  - ${step}`));
                }
                process.exit(0);
            })
            .option('os', { default: detectedOS })
            .option('osVersion', { default: detectedVersion })
            .option('shell', { default: detectedShell })
            // ... other options
            .version('v', `Show version number: ${packageJson.version}`).alias('v', 'version');
            
        const argv = await parser.parse();
        if (argv._.length === 0 && !argv.h && !argv.v) {
            showBanner();
            process.exit(0);
        }
    } catch (error) {
        console.error("\n❌ A critical error occurred during startup:", error.message);
        process.exit(1);
    }
};

run();
