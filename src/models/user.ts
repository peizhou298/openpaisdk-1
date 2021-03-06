// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/**
 * OpenPAI User Info.
 */
export interface IUserInfo {
    username?: string | null;
    grouplist?: string[] | null;
    email?: string | null;
    extension?: any | null;
    admin?: boolean;
    virtualCluster?: string[] | null;
}
