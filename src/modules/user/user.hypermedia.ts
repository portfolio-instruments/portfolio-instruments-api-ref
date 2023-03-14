import type { User } from "@prisma/client";
import { omit } from "lodash";
import { IHypermediaResponse } from "../IHypermediaResponse";
import config from '../../config'
import { createSessionDescription } from "../session/session.hypermedia";

export const createUserDescription: string = 'Create a new user';
export const getUserDescription: string = 'Retrieve user information';

export function createUserHypermediaResponse(user: User): IHypermediaResponse<User> {
    return {
        data: omit(user, ['password', 'role']),
        _links: {
            self: {
                href: `${config.HOSTNAME}/v1/users`,
                type: ['application/json'],
                description: createUserDescription,
                method: 'POST',
                status: 'Success'
            },
            session: {
                href: `${config.HOSTNAME}/v1/sessions`,
                type: ['application/json'],
                description: createSessionDescription,
                method: 'POST'
            },
            user: {
                href: `${config.HOSTNAME}/v1/users`,
                type: [],
                description: getUserDescription,
                method: 'GET',
                access: 'Restricted'
            }
        }
    };
}