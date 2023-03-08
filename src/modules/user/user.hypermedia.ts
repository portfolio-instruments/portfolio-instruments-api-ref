import type { User } from "@prisma/client";
import { omit } from "lodash";
import { IHypermediaResponse } from "../IHypermediaResponse";
import config from '../../config'

export function createUserHypermediaResponse(user: User): IHypermediaResponse<User> {
    return {
        data: omit(user, ['password', 'role']),
        _links: {
            self: {
                href: `${config.HOSTNAME}/v1/users`,
                type: ['application/json'],
                title: 'Create New User',
                method: 'POST',
                status: 'Success'
            },
            session: {
                href: `${config.HOSTNAME}/v1/sessions`,
                type: ['application/json'],
                title: 'Create New Session',
                method: 'POST'
            },
            user: {
                href: `${config.HOSTNAME}/v1/users/${user.id}`,
                type: [],
                title: 'Read User Profile',
                method: 'GET',
                access: 'Restricted'
            }
        }
    };
}