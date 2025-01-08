import { NextFunction, Request, Response } from "express";
import { ParamsWithId } from "../../interfaces/ParamsWithId";

// Define a proper type for clients
interface Clients {
    [userId: string]: Set<Response>;
}

const clients: Clients = {};

export async function subscribe(
	req: Request<ParamsWithId>,
	res: Response,
	next: NextFunction
) {
	const userId = req.params.id;

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Initialize client list for the user if not present
    if (!clients[userId]) {
        clients[userId] = new Set();
    }
    clients[userId].add(res);

    // Initial message to confirm connection
    res.write(`data: ${JSON.stringify({ message: `Connected as ${userId}` })}\n\n`);

    req.on('close', () => {
        clients[userId].delete(res);
        res.end();
        
        // Cleanup empty client entries
        if (clients[userId].size === 0) {
            delete clients[userId];
        }
    });
}

export const sendEvent = (userId: string, data: any) => {
    if (clients[userId]) {
        clients[userId].forEach(client => {
            client.write(`data: ${JSON.stringify(data)}\n\n`);
        });
    }
}
