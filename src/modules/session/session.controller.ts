import type { Request, Response } from "express";
import { CreateSessionContext, CreateSessionRequest } from "./session.schema";
import { validateUser } from "../user/user.service";
import { signJwt } from "./session.utils";
import { User } from "@prisma/client";
import config from '../../config';
import { nonNullProp } from "../../utils/nonNull";
import { createSessionHypermediaResponse } from "./session.hypermedia";

export async function createUserSessionHandler(req: CreateSessionRequest & Request, res: Response): Promise<void> {
    const sessionContext: CreateSessionContext = req.body;
    const user: Partial<User> | null = await validateUser(sessionContext.email, sessionContext.password);
    if (!user) {
        res.status(401).json({ error: 'Invalid email and password combination' });
        return;
    }
    
    const jwtToken: string = signJwt(user, nonNullProp(config, 'JWT_ACCESS_TOKEN_SECRET'), '2h');
    res.status(201).json(createSessionHypermediaResponse(jwtToken));
}

export default { createUserSessionHandler };