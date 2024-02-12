// Learning Express middleware - february 2024
// Created: 2024-02-12

const middleware5501 = {
    id: 5501,
    created: '2024-02-12',
    
    // Basic logging middleware
    logger: (req, res, next) => {
        const timestamp = new Date().toISOString();
        console.log([]   - Middleware 5501);
        next();
    },
    
    // Simple authentication check
    auth: (req, res, next) => {
        const token = req.headers.authorization;
        
        if (!token) {
            return res.status(401).json({
                error: 'No token provided',
                middlewareId: 5501,
                message: 'Learning authentication concepts'
            });
        }
        
        // Basic token validation (learning purposes)
        if (token === 'Bearer learning-token') {
            req.user = { id: 'learner', role: 'student' };
            next();
        } else {
            res.status(403).json({
                error: 'Invalid token',
                middlewareId: 5501
            });
        }
    },
    
    // Error handling middleware
    errorHandler: (err, req, res, next) => {
        console.error("Error in middleware " + this.id + ":", err.message);
        
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            middlewareId: 5501,
            message: 'Learning error handling',
            timestamp: new Date().toISOString()
        });
    },
    
    // Request validation
    validateRequest: (req, res, next) => {
        const startTime = Date.now();
        
        res.on('finish', () => {
            const duration = Date.now() - startTime;
            console.log("Request processed in " + duration + "ms by middleware " + this.id);
        });
        
        next();
    }
};

module.exports = middleware5501;
