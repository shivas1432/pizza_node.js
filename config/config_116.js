// Configuration file - Getting better at Node.js
// End of year, more time to learn

const config116 = {
    app: {
        name: 'Learning Project',
        version: '0.1.0',
        description: 'Created while learning GitHub and Node.js'
    },
    
    server: {
        port: process.env.PORT || 3000,
        host: 'localhost'
    },
    
    database: {
        // Will add database later when I learn more
        type: 'none',
        status: 'learning'
    },
    
    metadata: {
        created: '2023-12-03',
        author: 'Beginner developer',
        id: 116,
        phase: 'learning GitHub basics'
    }
};

module.exports = config116;
