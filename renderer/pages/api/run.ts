import { NextApiRequest, NextApiResponse } from 'next';
import { exec } from 'child_process';

import fs from 'fs';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const params = JSON.parse(req.body);

    if (req.method === 'POST') {
        try {
            // Parse the request body to get code and language
            const code = params.code;
            const language = params.language;

            const output = await runCode(code, language);

            // Return the output as JSON
            res.status(200).json({ output: output });
        } catch (error) {
            console.log(error);

            // Handle any errors that occur during code execution
            res.status(500).json({ error: 'Code execution error' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
};

function writeCodeToFile(code: string, language: string): string {
    const fileName = 'code.' + language;
    fs.writeFile(fileName, code, function (err) {
        if (err) return console.log(err);
        console.log('Code written to ' + fileName);
    });
    return fileName;
}

function executeCommand(command: string) {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(error);
                return;
            }

            if (stderr) {
                reject(new Error(stderr));
                return;
            }

            resolve(stdout);
        });
    });
}

async function runPython(code: string) {
    const file = writeCodeToFile(code, 'py');
    const output = await executeCommand(`python ${file}`).then((output) => {
        return output;
    });

    return output;
}

async function runJava(code: string) {
    const file = writeCodeToFile(code, 'java');
    const output = await executeCommand(`java ${file}`).then((output) => {
        return output;
    });

    return output;
}

async function runC(code: string) {
    const file = writeCodeToFile(code, 'c');
    exec(`gcc ${file}`);
    const output = await executeCommand("./ a.out").then((output) => {
        return output;
    });

    return output;
}

async function runJavaScript(code: string) {
    const file = writeCodeToFile(code, 'js');
    const output = await executeCommand(`node ${file}`).then((output) => {
        return output;
    });

    return output;
}

async function runCpp(code: string) {
    const file = writeCodeToFile(code, 'cpp');
    exec(`g++ ${file}`);
    const output = await executeCommand(`./a.out`).then((output) => {
        return output;
    });

    return output;
}

async function runCode(code: string, language: string): Promise<string> {
    if (language === 'javascript') {
        const result: any = await runJavaScript(code);
        return result;
    } else if (language === 'python') {
        const result: any = await runPython(code);
        return result.trim();
    } else if (language === 'java') {
        const result: any = await runJava(code);
        return result.trim();
    } else if (language === 'c') {
        const result: any = await runC(code);
        return result.trim();
    } else if (language === 'cpp') {
        const result: any = await runCpp(code);
        return result.trim();
    } else {
        return 'Language not yet supported';
    }
}

export default handler;
