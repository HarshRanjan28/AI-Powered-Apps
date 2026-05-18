import concurrently from 'concurrently';

concurrently([
    {
        command: 'bun run dev',
        name: 'Server',
        cwd: 'packages/server',
        prefixColor: 'blue',
    },
    {
        command: 'bun run dev',
        name: 'Client',
        cwd: 'packages/client',
        prefixColor: 'green',
    }
])